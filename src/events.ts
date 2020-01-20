import { ControllerEvent, EVENT_DIVSYSEX, EVENT_META, EVENT_META_COPYRIGHT_NOTICE, EVENT_META_CUE_POINT, EVENT_META_INSTRUMENT_NAME, EVENT_META_KEY_SIGNATURE, EVENT_META_LYRICS, EVENT_META_MARKER, EVENT_META_MIDI_CHANNEL_PREFIX, EVENT_META_SEQUENCER_SPECIFIC, EVENT_META_SET_TEMPO, EVENT_META_SMTPE_OFFSET, EVENT_META_TEXT, EVENT_META_TIME_SIGNATURE, EVENT_MIDI, EVENT_MIDI_CHANNEL_AFTERTOUCH, EVENT_MIDI_CONTROLLER, EVENT_MIDI_NOTE_AFTERTOUCH, EVENT_MIDI_PITCH_BEND, EVENT_MIDI_PROGRAM_CHANGE, EVENT_SYSEX, KeySignatureEvent, MIDIChannelPrefixEvent, NoteAftertouchEvent, PitchBendEvent, ProgramChangeEvent, SetTempoEvent, SMPTEOffsetEvent, SysExEvent, TextEvent, TimeSignatureEvent } from "midievents";
import { BooleanProperty, ByteStringProperty, IntegerProperty, Property, SelectProperty, StringProperty } from "./components/properties-editor";
import { __ } from "./i18n";
import { Event, NoteEvent } from "./midi";

type MakeProperties = (event: any, onChange: () => void, trackLength: number) => [string, Property<any>][];

const emptyData = { length: 0, data: [] };

function timeProperty(event: { delta: number; }, onChange: () => void, trackLength: number): [string, IntegerProperty] {
  return ["time", new IntegerProperty(event.delta, value => {
    event.delta = value;
    onChange();
  }, 0, trackLength)];
}

function channelProperty(event: { channel: number; }, onChange: () => void): [string, IntegerProperty] {
  return ["channel", new IntegerProperty(event.channel, value => {
    event.channel = value;
    onChange();
  }, 0, 15)];
}

const makeTextProperties: MakeProperties = (event: TextEvent, onChange: () => void, trackLength: number) => [
  timeProperty(event, onChange, trackLength),
  ["text", new StringProperty(Buffer.from(event.data).toString(), value => {
    event.length = value.length;
    event.data = Array.from(Buffer.from(value));
    onChange();
  })]
];
const makeSysExProperties: MakeProperties = (event: SysExEvent, onChange: () => void) => [
  ["sysExType", new IntegerProperty(event.subtype, value => {
    event.subtype = value;
    onChange();
  }, 0, 127)],
  ["data", new ByteStringProperty(event.data, value => {
    event.length = value.length;
    event.data = value;
    onChange();
  })]
];
const typeData: readonly (readonly [number, number, string, any, MakeProperties])[] = [
  [-1, 0, "event.note", { channel: 0, duration: 1, note: 60, attack: 100, release: 0 }, (event: NoteEvent, onChange: () => void, trackLength: number) => [
    ["time", new IntegerProperty(event.delta, value => {
      event.delta = value;
      event.duration = Math.min(event.duration, trackLength - value);
      onChange();
    }, 0, trackLength - 1)],
    ["duration", new IntegerProperty(event.duration, value => {
      event.duration = value;
      onChange();
    }, 1, trackLength - event.delta)],
    channelProperty(event, onChange),
    ["noteIndex", new IntegerProperty(event.note, value => {
      event.note = value;
      onChange();
    }, 0, 127)],
    ["attack", new IntegerProperty(event.attack, value => {
      event.attack = value;
      onChange();
    }, 0, 127)],
    ["release", new IntegerProperty(event.release, value => {
      event.release = value;
      onChange();
    }, 0, 127)]
  ]],
  [EVENT_META, EVENT_META_TEXT, "event.meta.text", emptyData, makeTextProperties],
  [EVENT_META, EVENT_META_COPYRIGHT_NOTICE, "event.meta.copyrightNotice", emptyData, makeTextProperties],
  [EVENT_META, EVENT_META_INSTRUMENT_NAME, "event.meta.instrumentName", emptyData, makeTextProperties],
  [EVENT_META, EVENT_META_LYRICS, "event.meta.lyrics", emptyData, makeTextProperties],
  [EVENT_META, EVENT_META_MARKER, "event.meta.marker", emptyData, makeTextProperties],
  [EVENT_META, EVENT_META_CUE_POINT, "event.meta.cuePoint", emptyData, makeTextProperties],
  [EVENT_META, EVENT_META_MIDI_CHANNEL_PREFIX, "event.meta.channelPrefix", { length: 1, prefix: 0 }, (event: MIDIChannelPrefixEvent, onChange: () => void, trackLength: number) => [
    timeProperty(event, onChange, trackLength),
    ["channel", new IntegerProperty(event.prefix, value => {
      event.prefix = value;
      onChange();
    }, 0, 15)]
  ]],
  [EVENT_META, EVENT_META_SET_TEMPO, "event.meta.setTempo", { length: 3, tempo: 500000 }, (event: SetTempoEvent, onChange: () => void, trackLength: number) => [
    timeProperty(event, onChange, trackLength),
    ["tempo", new IntegerProperty(event.tempo, value => {
      event.tempo = value;
      onChange();
    }, 1, 16777215)]
  ]],
  [EVENT_META, EVENT_META_SMTPE_OFFSET, "event.meta.smpteOffset", { length: 5, hour: 0, minutes: 0, seconds: 0, frames: 0, subframes: 0 }, (event: SMPTEOffsetEvent, onChange: () => void, trackLength: number) => [
    timeProperty(event, onChange, trackLength),
    ["smpteOffset.hour", new IntegerProperty(event.hour, value => {
      event.hour = value;
      onChange();
    }, 0, 23)],
    ["smpteOffset.minutes", new IntegerProperty(event.minutes, value => {
      event.minutes = value;
      onChange();
    }, 0, 59)],
    ["smpteOffset.seconds", new IntegerProperty(event.seconds, value => {
      event.seconds = value;
      onChange();
    }, 0, 59)],
    ["smpteOffset.frames", new IntegerProperty(event.frames, value => {
      event.frames = value;
      onChange();
    }, 0, 29)],
    ["smpteOffset.subframes", new IntegerProperty(event.subframes, value => {
      event.subframes = value;
      onChange();
    }, 0, 99)]
  ]],
  [EVENT_META, EVENT_META_TIME_SIGNATURE, "event.meta.timeSignature", { length: 4, data: [4, 2, 24, 8] }, (event: TimeSignatureEvent, onChange: () => void, trackLength: number) => [
    timeProperty(event, onChange, trackLength),
    ["timeSignature.numerator", new IntegerProperty(event.data[0], value => {
      event.data[0] = value;
      onChange();
    }, 1, 1 << event.data[1])],
    ["timeSignature.denominator", new IntegerProperty(event.data[1], value => {
      event.data[0] = Math.min(event.data[0], 1 << value);
      event.data[1] = value;
      onChange();
    }, 0, 5)],
    ["timeSignature.metronomeClick", new IntegerProperty(event.data[2], value => {
      event.data[2] = value;
      onChange();
    }, 0, 127)],
    ["timeSignature.quarterNote", new IntegerProperty(event.data[3], value => {
      event.data[3] = value;
      onChange();
    }, 0, 127)]
  ]],
  [EVENT_META, EVENT_META_KEY_SIGNATURE, "event.meta.keySignature", { length: 2, key: 0, scale: 0 }, (event: KeySignatureEvent, onChange: () => void, trackLength: number) => [
    timeProperty(event, onChange, trackLength),
    ["keySignature.key", new IntegerProperty(event.key, value => {
      event.key = value;
      onChange();
    }, -7, 7)],
    ["keySignature.isMinor", new BooleanProperty(Boolean(event.scale), value => {
      event.scale = Number(value);
      onChange();
    })]
  ]],
  [EVENT_META, EVENT_META_SEQUENCER_SPECIFIC, "event.meta.sequencerSpecific", { length: 0, data: [] }, (event: SysExEvent, onChange: () => void, trackLength: number) => [
    timeProperty(event, onChange, trackLength),
    ["data", new ByteStringProperty(event.data, value => {
      event.length = value.length;
      event.data = value;
      onChange();
    })]
  ]],
  [EVENT_SYSEX, 0, "event.sysEx", emptyData, makeSysExProperties],
  [EVENT_DIVSYSEX, 0, "event.divSysEx", emptyData, makeSysExProperties],
  [EVENT_MIDI, EVENT_MIDI_NOTE_AFTERTOUCH, "event.midi.noteAftertouch", { channel: 0, param1: 0, param2: 0 }, (event: NoteAftertouchEvent, onChange: () => void, trackLength: number) => [
    timeProperty(event, onChange, trackLength),
    channelProperty(event, onChange),
    ["noteIndex", new IntegerProperty(event.param1, value => {
      event.param1 = value;
      onChange();
    }, 0, 127)],
    ["aftertouch", new IntegerProperty(event.param2, value => {
      event.param2 = Number(value);
      onChange();
    }, 0, 127)]
  ]],
  [EVENT_MIDI, EVENT_MIDI_CONTROLLER, "event.midi.controlChange", { channel: 0, param1: 0, param2: 0 }, (event: ControllerEvent, onChange: () => void, trackLength: number) => [
    timeProperty(event, onChange, trackLength),
    channelProperty(event, onChange),
    ["controlChange.id", new IntegerProperty(event.param1, value => {
      event.param1 = value;
      onChange();
    }, 0, 127)],
    ["controlChange.value", new IntegerProperty(event.param2, value => {
      event.param2 = Number(value);
      onChange();
    }, 0, 127)]
  ]],
  [EVENT_MIDI, EVENT_MIDI_PROGRAM_CHANGE, "event.midi.programChange", { channel: 0, param1: 0 }, (event: ProgramChangeEvent, onChange: () => void, trackLength: number) => [
    timeProperty(event, onChange, trackLength),
    channelProperty(event, onChange),
    ["program", new IntegerProperty(event.param1, value => {
      event.param1 = value;
      onChange();
    }, 0, 127)]
  ]],
  [EVENT_MIDI, EVENT_MIDI_CHANNEL_AFTERTOUCH, "event.midi.channelAftertouch", { channel: 0, param1: 0 }, (event: ProgramChangeEvent, onChange: () => void, trackLength: number) => [
    timeProperty(event, onChange, trackLength),
    channelProperty(event, onChange),
    ["aftertouch", new IntegerProperty(event.param1, value => {
      event.param1 = value;
      onChange();
    }, 0, 127)]
  ]],
  [EVENT_MIDI, EVENT_MIDI_PITCH_BEND, "event.midi.pitchBend", { channel: 0, param1: 0, param2: 64 }, (event: PitchBendEvent, onChange: () => void, trackLength: number) => [
    timeProperty(event, onChange, trackLength),
    channelProperty(event, onChange),
    ["pitch", new IntegerProperty((event.param1 | (event.param2 << 7)) - 8192, value => {
      value += 8192;
      event.param1 = value & 0x7f;
      event.param2 = value >> 7;
      onChange();
    }, -8192, 8191)]
  ]]
];

function getTypeIndex(type: number, subtype: number): number {
  return typeData.findIndex(data => data[0] === type && ([-1, EVENT_SYSEX, EVENT_DIVSYSEX].includes(type) || data[1] === subtype));
}

export function emptyEvent(type: number, subtype: number): Event {
  return {
    ...JSON.parse(JSON.stringify(typeData[getTypeIndex(type, subtype)][3])),
    delta: 0,
    type,
    subtype
  };
}

export function nameOfEvent(type: number, subtype: number): string {
  return __(typeData[getTypeIndex(type, subtype)][2]);
}

export function eventProperties(event: Event, onChange: (event: Event) => void, trackLength: number): [string, Property<any>][] {
  const typeIndex = getTypeIndex(event.type, event.subtype);
  return [
    ["type", new SelectProperty(
      typeIndex,
      index => onChange(emptyEvent(typeData[index][0], typeData[index][1])),
      typeData.map(type => __(type[2])))],
    ...typeData[typeIndex][4](event, () => onChange(event), trackLength)
  ];
}
