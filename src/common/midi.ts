import { ChannelAftertouchEvent, ControllerEvent, CopyrightNoticeEvent, CuePointEvent, Event as RawEvent, EVENT_META, EVENT_META_END_OF_TRACK, EVENT_META_TRACK_NAME, EVENT_MIDI, EVENT_MIDI_NOTE_OFF, EVENT_MIDI_NOTE_ON, InstrumentNameEvent, KeySignatureEvent, LyricsEvent, MarkerEvent, MIDIChannelPrefixEvent, NoteAftertouchEvent, PitchBendEvent, ProgramChangeEvent, SequenceNumberEvent, SequencerSpecificEvent, SetTempoEvent, SMPTEOffsetEvent, SysExEvent, TextEvent, TimeSignatureEvent } from "midievents";
import * as MIDIFile from "midifile";

export type Format = MIDIFile.Format;
export type Division =
  | { type: 0; ticksPerBeat: number; }
  | { type: 1; smpteFormat: number; ticksPerFrame: number; };
export type DivisionType = Division["type"];

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
  | SequenceNumberEvent
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

export interface Midi {
  format: Format;
  division: Division;
  tracks: Track[];
}

export const smpteFrames = Object.freeze([24, 25, 29.97, 30] as const);

export function newTrack(length: number): Track {
  return {
    name: "",
    length,
    events: []
  };
}

export function newDivision(type: DivisionType): Division {
  switch (type) {
    case 0:
      return { type, ticksPerBeat: 96 };
    case 1:
      return { type, smpteFormat: 0, ticksPerFrame: 4 };
  }
}

export function newMidi(): Midi {
  return {
    format: 1,
    division: newDivision(0),
    tracks: [newTrack(1)]
  };
}

class Channel {
  private readonly on = new Map<number, [number, number]>();

  public constructor(private readonly addNote: (startTime: number, endTime: number, note: number, attack: number, release: number) => void) { }

  public noteOn(time: number, note: number, velocity: number): void {
    if (this.on.has(note))
      this.noteOff(time, note, velocity);
    this.on.set(note, [time, velocity]);
  }

  public noteOff(time: number, note: number, velocity: number): void {
    const on = this.on.get(note);
    if (!on)
      return;
    this.on.delete(note);
    const [startTime, attack] = on;
    this.addNote(startTime, time, note, attack, velocity);
  }
}

function readTrack(track: Track, events: readonly RawEvent[]): void {
  const channels: Channel[] = Array.from({ length: 16 }, (_, index) => new Channel((startTime, endTime, note, attack, release) =>
    track.events.push({
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
    track.events.push({ ...event, delta: time });
  }
  for (const channel of channels)
    for (let note = 0; note < 128; note++)
      channel.noteOff(time, note, 0);
  track.events.sort((a, b) => a.delta - b.delta);
  track.length = Math.max(time, 1);
}

function writeTrack(track: Track): RawEvent[] {
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
  for (const event of track.events)
    if (event.type === -1)
      result.push(
        {
          delta: event.delta,
          type: EVENT_MIDI,
          subtype: EVENT_MIDI_NOTE_ON,
          channel: event.channel,
          param1: event.note,
          param2: event.attack
        },
        {
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

export function readMidi(buf: ArrayBuffer): Midi {
  const file = new MIDIFile(buf);
  const midi: Midi = {
    format: file.header.getFormat(),
    division: file.header.getTimeDivision() === MIDIFile.Header.TICKS_PER_BEAT
      ? { type: 0, ticksPerBeat: file.header.getTicksPerBeat() }
      : { type: 1, smpteFormat: smpteFrames.indexOf(file.header.getSMPTEFrames()), ticksPerFrame: file.header.getTicksPerFrame() },
    tracks: file.tracks.map(() => newTrack(0))
  };
  for (let i = 0, len = file.tracks.length; i < len; i++)
    readTrack(midi.tracks[i], file.getTrackEvents(i));
  if ((midi.division.type === 1) as boolean)
    throw "SMPTE time is unsupported";
  return midi;
}

export function writeMidi(midi: Midi): ArrayBuffer {
  if ((midi.division.type === 1) as boolean)
    throw "SMPTE time is unsupported";
  const file = new MIDIFile;
  const header = file.header;
  header.setFormat(midi.format);
  header.setTracksCount(midi.tracks.length);
  if (midi.division.type === 0)
    header.setTicksPerBeat(midi.division.ticksPerBeat);
  else
    header.setSMTPEDivision(smpteFrames[midi.division.smpteFormat], midi.division.ticksPerFrame);
  file.tracks = midi.tracks.map(() => new MIDIFile.Track);
  for (let i = 0, len = midi.tracks.length; i < len; i++)
    file.setTrackEvents(i, writeTrack(midi.tracks[i]));
  return file.getContent();
}
