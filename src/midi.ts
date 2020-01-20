import * as fs from "fs";
import { ChannelAftertouchEvent, ControllerEvent, CopyrightNoticeEvent, CuePointEvent, Event as RawEvent, EVENT_META, EVENT_META_END_OF_TRACK, EVENT_META_SEQUENCE_NUMBER, EVENT_META_TRACK_NAME, EVENT_MIDI, EVENT_MIDI_NOTE_OFF, EVENT_MIDI_NOTE_ON, InstrumentNameEvent, KeySignatureEvent, LyricsEvent, MarkerEvent, MIDIChannelPrefixEvent, NoteAftertouchEvent, PitchBendEvent, ProgramChangeEvent, SequencerSpecificEvent, SetTempoEvent, SMPTEOffsetEvent, SysExEvent, TextEvent, TimeSignatureEvent } from "midievents";
import * as MIDIFile from "midifile";
import { promisify } from "util";

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

export interface NoteEvent {
  delta: number;
  type: -1;
  subtype: 0;
  channel: number;
  duration: number;
  note: number;
  attack: number;
  release: number;
}

export type Event =
  | NoteEvent
  | TextEvent
  | CopyrightNoticeEvent
  | InstrumentNameEvent
  | LyricsEvent
  | MarkerEvent
  | CuePointEvent
  | MIDIChannelPrefixEvent
  | SetTempoEvent
  | SMPTEOffsetEvent
  | TimeSignatureEvent
  | KeySignatureEvent
  | SequencerSpecificEvent
  | SysExEvent
  | NoteAftertouchEvent
  | ControllerEvent
  | ProgramChangeEvent
  | ChannelAftertouchEvent
  | PitchBendEvent;

export interface Track {
  name: string;
  length: number;
  events: Event[];
}

export interface MIDI {
  ticksPerBeat: number;
  sequenceNumber?: number;
  tracks: Track[];
}

export function emptyTrack(): Track {
  return {
    name: "",
    length: 1,
    events: []
  };
}

export function emptyMIDI(): MIDI {
  return {
    ticksPerBeat: 192,
    tracks: [emptyTrack()]
  };
}

class Channel {
  private readonly on = new Map<number, [number, number]>();

  public constructor(private readonly addNote: (startTime: number, endTime: number, note: number, attack: number, release: number) => void) { }

  public noteOn(time: number, note: number, velocity: number): void {
    if (this.on.has(note)) this.noteOff(time, note, velocity);
    this.on.set(note, [time, velocity]);
  }

  public noteOff(time: number, note: number, velocity: number): void {
    const on = this.on.get(note);
    if (!on) return;
    this.on.delete(note);
    const [startTime, attack] = on;
    this.addNote(startTime, time, note, attack, velocity);
  }
}

export function readTrack(midi: MIDI, track: Track, events: readonly RawEvent[]): void {
  const channels: Channel[] = Array.from({ length: 16 }, (_, index) => new Channel(
    (startTime, endTime, note, attack, release) => track.events.push({
      delta: startTime,
      type: -1,
      subtype: 0,
      channel: index,
      duration: endTime - startTime,
      note,
      attack,
      release
    })));
  let time = 0;
  readEvents: for (const event of events) {
    time += event.delta;
    switch (event.type) {
      case EVENT_META:
        switch (event.subtype) {
          case EVENT_META_TRACK_NAME:
            track.name = Buffer.from(event.data).toString();
            continue;
          case EVENT_META_SEQUENCE_NUMBER:
            midi.sequenceNumber = (event.msb << 8) | event.lsb;
            continue;
          case EVENT_META_END_OF_TRACK:
            break readEvents;
        }
        break;
      case EVENT_MIDI:
        switch (event.subtype) {
          case EVENT_MIDI_NOTE_ON:
            channels[event.channel].noteOn(time, event.param1, event.param2);
            continue;
          case EVENT_MIDI_NOTE_OFF:
            channels[event.channel].noteOff(time, event.param1, event.param2);
            continue;
        }
        break;
    }
    track.events.push({
      ...event,
      delta: time
    });
  }
  for (const channel of channels)
    for (let note = 0; note < 128; note++)
      channel.noteOff(time, note, 0);
  track.events.sort((a, b) => a.delta - b.delta);
  track.length = Math.max(time, 1);
}

export function writeTrack(midi: MIDI, track: Track): RawEvent[] {
  const result: RawEvent[] = [];
  if (track.name) {
    const data = Array.from(Buffer.from(track.name));
    result.push({
      delta: 0,
      type: EVENT_META,
      subtype: EVENT_META_TRACK_NAME,
      length: data.length,
      data
    });
  }
  if (midi.sequenceNumber !== undefined) result.push({
    delta: 0,
    type: EVENT_META,
    subtype: EVENT_META_SEQUENCE_NUMBER,
    length: 2,
    msb: midi.sequenceNumber >>> 8,
    lsb: midi.sequenceNumber & 0xff
  });
  for (const event of track.events)
    if (event.type === -1) result.push({
      delta: event.delta,
      type: EVENT_MIDI,
      subtype: EVENT_MIDI_NOTE_ON,
      channel: event.channel,
      param1: event.note,
      param2: event.attack
    }, {
      delta: event.delta + event.duration,
      type: EVENT_MIDI,
      subtype: EVENT_MIDI_NOTE_OFF,
      channel: event.channel,
      param1: event.note,
      param2: event.release
    });
    else result.push(event);
  result.push({
    delta: track.length,
    type: EVENT_META,
    subtype: EVENT_META_END_OF_TRACK,
    length: 0
  });
  result.sort((a, b) => a.delta - b.delta);
  let last = 0;
  for (const event of result) {
    const cur = event.delta;
    event.delta -= last;
    last = cur;
  }
  return result;
}

export async function load(filePath: string): Promise<MIDI> {
  const file = new MIDIFile(await readFile(filePath));
  if (file.header.getFormat() > 1) throw "unsupported format";
  if (file.header.getTimeDivision() !== MIDIFile.Header.TICKS_PER_BEAT) throw "unsupported time division";
  const result: MIDI = {
    ticksPerBeat: file.header.getTicksPerBeat(),
    tracks: file.tracks.map(emptyTrack)
  };
  for (let i = 0, len = file.tracks.length; i < len; i++)
    readTrack(result, result.tracks[i], file.getTrackEvents(i));
  return result;
}

export async function save(filePath: string, midi: MIDI): Promise<void> {
  const trackCount = midi.tracks.length;
  if (!trackCount) throw "no tracks";
  const file = new MIDIFile;
  file.header.setFormat(trackCount === 1 ? 0 : 1);
  file.header.setTicksPerBeat(midi.ticksPerBeat);
  for (let i = 1; i < trackCount; i++)
    file.addTrack(i);
  for (let i = 0; i < trackCount; i++)
    file.setTrackEvents(i, writeTrack(midi, midi.tracks[i]));
  await writeFile(filePath, new Uint8Array(file.getContent()));
}
