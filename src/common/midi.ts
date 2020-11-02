import { Event as RawEvent, EVENT_DIVSYSEX, EVENT_META, EVENT_META_COPYRIGHT_NOTICE, EVENT_META_CUE_POINT, EVENT_META_END_OF_TRACK, EVENT_META_INSTRUMENT_NAME, EVENT_META_KEY_SIGNATURE, EVENT_META_LYRICS, EVENT_META_MARKER, EVENT_META_MIDI_CHANNEL_PREFIX, EVENT_META_SEQUENCER_SPECIFIC, EVENT_META_SEQUENCE_NUMBER, EVENT_META_SET_TEMPO, EVENT_META_SMTPE_OFFSET, EVENT_META_TEXT, EVENT_META_TIME_SIGNATURE, EVENT_META_TRACK_NAME, EVENT_MIDI, EVENT_MIDI_CHANNEL_AFTERTOUCH, EVENT_MIDI_CONTROLLER, EVENT_MIDI_NOTE_AFTERTOUCH, EVENT_MIDI_NOTE_OFF, EVENT_MIDI_NOTE_ON, EVENT_MIDI_PITCH_BEND, EVENT_MIDI_PROGRAM_CHANGE, EVENT_SYSEX, TextEvent as RawTextEvent } from "midievents";
import * as MIDIFile from "midifile";

export type Format = MIDIFile.Format;
export type Division =
  | { type: 0; ticksPerBeat: number; }
  | { type: 1; smpteFormat: number; ticksPerFrame: number; };
export type DivisionType = Division["type"];

export interface NoteOffEvent {
  type: "note-off";
  channel: number;
  key: number;
  velocity: number;
}

export interface NoteOnEvent {
  type: "note-on";
  channel: number;
  key: number;
  velocity: number;
}

export interface PolyphonicKeyPressureEvent {
  type: "polyphonic-key-pressure";
  channel: number;
  key: number;
  pressure: number;
}

export interface ControlChangeEvent {
  type: "control-change";
  channel: number;
  id: number;
  value: number;
}

export interface ProgramChangeEvent {
  type: "program-change";
  channel: number;
  program: number;
}

export interface ChannelPressureEvent {
  type: "channel-pressure";
  channel: number;
  pressure: number;
}

export interface PitchBendChangeEvent {
  type: "pitch-bend-change";
  channel: number;
  pitch: number;
}

export type MIDIEvent =
  | NoteOffEvent
  | NoteOnEvent
  | PolyphonicKeyPressureEvent
  | ControlChangeEvent
  | ProgramChangeEvent
  | ChannelPressureEvent
  | PitchBendChangeEvent;

export interface SysExEvent {
  type: "sysex" | "sysex-escape";
  data: Uint8Array;
}

export interface SequenceNumberEvent {
  type: "sequence-number";
  sequenceNumber: number;
}

export interface TextEvent {
  type: "text";
  subtype: number;
  text: string;
}

export interface MIDIChannelPrefixEvent {
  type: "midi-channel-prefix";
  channel: number;
}

export interface EndOfTrackEvent {
  type: "end-of-track";
}

export interface SetTempoEvent {
  type: "set-tempo";
  tempo: number;
}

export interface SMPTEOffsetEvent {
  type: "smpte-offset";
  smpteFormat: number;
  hours: number;
  minutes: number;
  seconds: number;
  frames: number;
  subframes: number;
}

export interface TimeSignatureEvent {
  type: "time-signature";
  numerator: number;
  denominator: number;
  metronomeClick: number;
  quarterNote: number;
}

export interface KeySignatureEvent {
  type: "key-signature";
  key: number;
  scale: number;
}

export interface SequencerSpecificEvent {
  type: "sequencer-specific";
  data: Uint8Array;
}

export type MetaEvent =
  | SequenceNumberEvent
  | TextEvent
  | MIDIChannelPrefixEvent
  | EndOfTrackEvent
  | SetTempoEvent
  | SMPTEOffsetEvent
  | TimeSignatureEvent
  | KeySignatureEvent
  | SequencerSpecificEvent;

export type Event = MIDIEvent | SysExEvent | MetaEvent;
export type TrackEvent = Event & { delta: number; };
export type Track = TrackEvent[];

export interface Midi {
  format: Format;
  division: Division;
  tracks: Track[];
}

export const smpteFrames = Object.freeze([24, 25, 29.97, 30] as const);

export function newDivision(type: DivisionType): Division {
  switch (type) {
    case 0:
      return { type, ticksPerBeat: 96 };
    case 1:
      return { type, smpteFormat: 0, ticksPerFrame: 4 };
  }
}

export function newTrack(): Track {
  return [{ type: "end-of-track", delta: 0 }];
}

export function newMidi(): Midi {
  return {
    format: 1,
    division: newDivision(0),
    tracks: [newTrack()]
  };
}

export function getTrackLength(track: Track): number {
  let length = 0;
  for (const event of track) {
    length += event.delta;
    if (event.type === "end-of-track")
      break;
  }
  return length;
}

function readTrack(events: readonly RawEvent[]): Track {
  return events.map((event): TrackEvent => {
    switch (event.type) {
      case EVENT_META:
        switch (event.subtype) {
          case EVENT_META_SEQUENCE_NUMBER:
            return {
              type: "sequence-number",
              sequenceNumber: (event.msb << 8) | event.lsb,
              delta: event.delta
            };
          case EVENT_META_TEXT:
          case EVENT_META_COPYRIGHT_NOTICE:
          case EVENT_META_TRACK_NAME:
          case EVENT_META_INSTRUMENT_NAME:
          case EVENT_META_LYRICS:
          case EVENT_META_MARKER:
          case EVENT_META_CUE_POINT:
          case 0x8:
          case 0x9:
          case 0xa:
          case 0xb:
          case 0xc:
          case 0xd:
          case 0xe:
          case 0xf:
            return {
              type: "text",
              subtype: event.subtype - 1,
              text: Buffer.from(event.data).toString(),
              delta: event.delta
            };
          case EVENT_META_MIDI_CHANNEL_PREFIX:
            return {
              type: "midi-channel-prefix",
              channel: event.prefix,
              delta: event.delta
            };
          case EVENT_META_END_OF_TRACK:
            return {
              type: "end-of-track",
              delta: event.delta
            };
          case EVENT_META_SET_TEMPO:
            return {
              type: "set-tempo",
              tempo: event.tempo,
              delta: event.delta
            };
          case EVENT_META_SMTPE_OFFSET:
            return {
              type: "smpte-offset",
              smpteFormat: 0,
              hours: event.hour,
              minutes: event.minutes,
              seconds: event.seconds,
              frames: event.frames,
              subframes: event.subframes,
              delta: event.delta
            };
          case EVENT_META_TIME_SIGNATURE:
            return {
              type: "time-signature",
              numerator: event.data[0],
              denominator: event.data[1],
              metronomeClick: event.data[2],
              quarterNote: event.data[3],
              delta: event.delta
            };
          case EVENT_META_KEY_SIGNATURE:
            return {
              type: "key-signature",
              key: event.key,
              scale: event.scale,
              delta: event.delta
            };
          case EVENT_META_SEQUENCER_SPECIFIC:
            return {
              type: "sequencer-specific",
              data: Buffer.from(event.data),
              delta: event.delta
            };
          default:
            throw new TypeError(`Unknown meta event ${event.subtype}`);
        }
      case EVENT_SYSEX:
        return {
          type: "sysex",
          data: Buffer.from(event.data),
          delta: event.delta
        };
      case EVENT_DIVSYSEX:
        return {
          type: "sysex-escape",
          data: Buffer.from(event.data),
          delta: event.delta
        };
      case EVENT_MIDI:
        switch (event.subtype) {
          case EVENT_MIDI_NOTE_OFF:
            return {
              type: "note-off",
              channel: event.channel,
              key: event.param1,
              velocity: event.param2,
              delta: event.delta
            };
          case EVENT_MIDI_NOTE_ON:
            return {
              type: "note-on",
              channel: event.channel,
              key: event.param1,
              velocity: event.param2,
              delta: event.delta
            };
          case EVENT_MIDI_NOTE_AFTERTOUCH:
            return {
              type: "polyphonic-key-pressure",
              channel: event.channel,
              key: event.param1,
              pressure: event.param2,
              delta: event.delta
            };
          case EVENT_MIDI_CONTROLLER:
            return {
              type: "control-change",
              channel: event.channel,
              id: event.param1,
              value: event.param2,
              delta: event.delta
            };
          case EVENT_MIDI_PROGRAM_CHANGE:
            return {
              type: "program-change",
              channel: event.channel,
              program: event.param1,
              delta: event.delta
            };
          case EVENT_MIDI_CHANNEL_AFTERTOUCH:
            return {
              type: "channel-pressure",
              channel: event.channel,
              pressure: event.param1,
              delta: event.delta
            };
          case EVENT_MIDI_PITCH_BEND:
            return {
              type: "pitch-bend-change",
              channel: event.channel,
              pitch: event.param1 | (event.param2 << 7),
              delta: event.delta
            };
          default:
            return ((_: never) => _)(event);
        }
      default:
        throw new TypeError(`Unknown event ${event.type}`);
    }
  });
}

function writeTrack(track: Track): RawEvent[] {
  return track.map((event): RawEvent => {
    switch (event.type) {
      case "note-off":
        return {
          delta: event.delta,
          type: EVENT_MIDI,
          subtype: EVENT_MIDI_NOTE_OFF,
          channel: event.channel,
          param1: event.key,
          param2: event.velocity
        };
      case "note-on":
        return {
          delta: event.delta,
          type: EVENT_MIDI,
          subtype: EVENT_MIDI_NOTE_ON,
          channel: event.channel,
          param1: event.key,
          param2: event.velocity
        };
      case "polyphonic-key-pressure":
        return {
          delta: event.delta,
          type: EVENT_MIDI,
          subtype: EVENT_MIDI_NOTE_AFTERTOUCH,
          channel: event.channel,
          param1: event.key,
          param2: event.pressure
        };
      case "control-change":
        return {
          delta: event.delta,
          type: EVENT_MIDI,
          subtype: EVENT_MIDI_CONTROLLER,
          channel: event.channel,
          param1: event.id,
          param2: event.value
        };
      case "program-change":
        return {
          delta: event.delta,
          type: EVENT_MIDI,
          subtype: EVENT_MIDI_PROGRAM_CHANGE,
          channel: event.channel,
          param1: event.program
        };
      case "channel-pressure":
        return {
          delta: event.delta,
          type: EVENT_MIDI,
          subtype: EVENT_MIDI_CHANNEL_AFTERTOUCH,
          channel: event.channel,
          param1: event.pressure
        };
      case "pitch-bend-change":
        return {
          delta: event.delta,
          type: EVENT_MIDI,
          subtype: EVENT_MIDI_PITCH_BEND,
          channel: event.channel,
          param1: event.pitch & 0x7f,
          param2: event.pitch >> 7
        };
      case "sysex":
        return {
          delta: event.delta,
          type: EVENT_SYSEX,
          length: event.data.length,
          data: Array.from(event.data)
        };
      case "sysex-escape":
        return {
          delta: event.delta,
          type: EVENT_DIVSYSEX,
          length: event.data.length,
          data: Array.from(event.data)
        };
      case "sequence-number":
        return {
          delta: event.delta,
          type: EVENT_META,
          subtype: EVENT_META_SEQUENCE_NUMBER,
          length: 2,
          msb: event.sequenceNumber >> 8,
          lsb: event.sequenceNumber & 0xff
        };
      case "text": {
        const buf = Buffer.from(event.text);
        return {
          delta: event.delta,
          type: EVENT_META,
          subtype: (event.subtype + 1) as RawTextEvent["subtype"],
          length: buf.length,
          data: Array.from(buf)
        };
      }
      case "midi-channel-prefix":
        return {
          delta: event.delta,
          type: EVENT_META,
          subtype: EVENT_META_MIDI_CHANNEL_PREFIX,
          length: 1,
          prefix: event.channel
        };
      case "end-of-track":
        return {
          delta: event.delta,
          type: EVENT_META,
          subtype: EVENT_META_END_OF_TRACK,
          length: 0
        };
      case "set-tempo":
        return {
          delta: event.delta,
          type: EVENT_META,
          subtype: EVENT_META_SET_TEMPO,
          length: 3,
          tempo: event.tempo
        };
      case "smpte-offset":
        return {
          delta: event.delta,
          type: EVENT_META,
          subtype: EVENT_META_SMTPE_OFFSET,
          length: 5,
          hour: event.hours,
          minutes: event.minutes,
          seconds: event.seconds,
          frames: event.frames,
          subframes: event.subframes
        };
      case "time-signature":
        return {
          delta: event.delta,
          type: EVENT_META,
          subtype: EVENT_META_TIME_SIGNATURE,
          length: 4,
          data: [
            event.numerator,
            event.denominator,
            event.metronomeClick,
            event.quarterNote
          ]
        };
      case "key-signature":
        return {
          delta: event.delta,
          type: EVENT_META,
          subtype: EVENT_META_KEY_SIGNATURE,
          length: 2,
          key: event.key,
          scale: event.scale
        };
      case "sequencer-specific":
        return {
          delta: event.delta,
          type: EVENT_META,
          subtype: EVENT_META_SEQUENCER_SPECIFIC,
          length: event.data.length,
          data: Array.from(event.data)
        };
      default:
        return ((_: never) => _)(event);
    }
  });
}

export function readMidi(buf: ArrayBuffer): Midi {
  const file = new MIDIFile(buf);
  return {
    format: file.header.getFormat(),
    division: file.header.getTimeDivision() === MIDIFile.Header.TICKS_PER_BEAT
      ? { type: 0, ticksPerBeat: file.header.getTicksPerBeat() }
      : { type: 1, smpteFormat: smpteFrames.indexOf(file.header.getSMPTEFrames()), ticksPerFrame: file.header.getTicksPerFrame() },
    tracks: file.tracks.map((_, i) => readTrack(file.getTrackEvents(i)))
  };
}

export function writeMidi(midi: Midi): ArrayBuffer {
  if ((midi.division.type === 1) as boolean)
    throw "SMPTE time is unsupported";
  const file = new MIDIFile;
  file.header.setFormat(midi.format);
  file.header.setTracksCount(midi.tracks.length);
  if (midi.division.type === 0)
    file.header.setTicksPerBeat(midi.division.ticksPerBeat);
  else
    file.header.setSMTPEDivision(smpteFrames[midi.division.smpteFormat], midi.division.ticksPerFrame);
  file.tracks = midi.tracks.map(() => new MIDIFile.Track);
  for (let i = 0, len = midi.tracks.length; i < len; i++)
    file.setTrackEvents(i, writeTrack(midi.tracks[i]));
  return file.getContent();
}
