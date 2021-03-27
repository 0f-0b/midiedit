export type Format = 0 | 1 | 2;
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
