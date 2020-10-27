import { ChannelAftertouchEvent, ControllerEvent, EVENT_DIVSYSEX, EVENT_META, EVENT_META_COPYRIGHT_NOTICE, EVENT_META_CUE_POINT, EVENT_META_INSTRUMENT_NAME, EVENT_META_KEY_SIGNATURE, EVENT_META_LYRICS, EVENT_META_MARKER, EVENT_META_MIDI_CHANNEL_PREFIX, EVENT_META_SEQUENCER_SPECIFIC, EVENT_META_SEQUENCE_NUMBER, EVENT_META_SET_TEMPO, EVENT_META_SMTPE_OFFSET, EVENT_META_TEXT, EVENT_META_TIME_SIGNATURE, EVENT_MIDI, EVENT_MIDI_CHANNEL_AFTERTOUCH, EVENT_MIDI_CONTROLLER, EVENT_MIDI_NOTE_AFTERTOUCH, EVENT_MIDI_PITCH_BEND, EVENT_MIDI_PROGRAM_CHANGE, EVENT_SYSEX, KeySignatureEvent, MIDIChannelPrefixEvent, NoteAftertouchEvent, PitchBendEvent, ProgramChangeEvent, SequenceNumberEvent, SequencerSpecificEvent, SetTempoEvent, SMPTEOffsetEvent, SysExEvent, TextEvent, TimeSignatureEvent } from "midievents";
import { Event, NoteEvent } from "../common/midi";
import { ByteArrayProperty, IntegerProperty, Property, StringProperty } from "./components/properties-editor";

function buildTextProperties(event: TextEvent, onChange: (event: TextEvent) => void, trackLength: number): {
  time: IntegerProperty;
  text: StringProperty;
} {
  return {
    time: {
      type: "integer",
      label: "Time: ",
      value: event.delta,
      min: 0,
      max: trackLength,
      onChange(value) {
        onChange({ ...event, delta: value });
      }
    },
    text: {
      type: "string",
      label: "Text: ",
      value: Buffer.from(event.data, 0, event.length).toString(),
      onChange(value) {
        const data = Buffer.from(value);
        onChange({ ...event, length: data.length, data: Array.from(data) });
      }
    }
  };
}

function buildSysExProperties(event: SysExEvent, onChange: (event: SysExEvent) => void, trackLength: number): {
  time: IntegerProperty;
  subType: IntegerProperty;
  data: ByteArrayProperty;
} {
  return {
    time: {
      type: "integer",
      label: "Time: ",
      value: event.delta,
      min: 0,
      max: trackLength,
      onChange(value) {
        onChange({ ...event, delta: value });
      }
    },
    subType: {
      type: "integer",
      label: "SysEx type: ",
      value: event.subtype,
      min: 0,
      max: 127,
      onChange(value) {
        onChange({ ...event, subtype: value });
      }
    },
    data: {
      type: "byte-array",
      label: "Data: ",
      value: new Uint8Array(event.data),
      onChange(value) {
        onChange({ ...event, length: value.length, data: Array.from(value) });
      }
    }
  };
}

const typeData: readonly (readonly [number, number, string, unknown, (event: never, onChange: (event: Event) => void, trackLength: number) => { [id: string]: Property; }])[] = [
  [-1, 0, "Note", { channel: 0, duration: 1, note: 60, attack: 100, release: 0 }, (event: NoteEvent, onChange: (event: NoteEvent) => void, trackLength: number) => ({
    time: {
      type: "integer",
      label: "Time: ",
      value: event.delta,
      min: 0,
      max: trackLength - 1,
      onChange(value) {
        onChange({ ...event, delta: value, duration: Math.min(event.duration, trackLength - value) });
      }
    },
    duration: {
      type: "integer",
      label: "Duration: ",
      value: event.duration,
      min: 1,
      max: trackLength,
      onChange(value) {
        onChange({ ...event, delta: Math.min(event.delta, trackLength - value), duration: value });
      }
    },
    channel: {
      type: "integer",
      label: "Channel: ",
      value: event.channel,
      min: 0,
      max: 15,
      onChange(value) {
        onChange({ ...event, channel: value });
      }
    },
    note: {
      type: "integer",
      label: "Note: ",
      value: event.note,
      min: 0,
      max: 127,
      onChange(value) {
        onChange({ ...event, note: value });
      }
    },
    attack: {
      type: "integer",
      label: "Attack: ",
      value: event.attack,
      min: 0,
      max: 127,
      onChange(value) {
        onChange({ ...event, attack: value });
      }
    },
    release: {
      type: "integer",
      label: "Release: ",
      value: event.release,
      min: 0,
      max: 127,
      onChange(value) {
        onChange({ ...event, release: value });
      }
    }
  })],
  [EVENT_META, EVENT_META_SEQUENCE_NUMBER, "Sequence Number", { msb: 0, lsb: 0 }, (event: SequenceNumberEvent, onChange: (event: SequenceNumberEvent) => void, trackLength: number) => ({
    time: {
      type: "integer",
      label: "Time: ",
      value: event.delta,
      min: 0,
      max: trackLength,
      onChange(value) {
        onChange({ ...event, delta: value });
      }
    },
    sequenceNumber: {
      type: "integer",
      label: "Sequence Number: ",
      value: (event.msb << 8) | event.lsb,
      min: 0,
      max: 65535,
      onChange(value) {
        onChange({ ...event, msb: value >> 8, lsb: value & 0x7f });
      }
    }
  })],
  [EVENT_META, EVENT_META_TEXT, "Text", { length: 0, data: [] }, buildTextProperties],
  [EVENT_META, EVENT_META_COPYRIGHT_NOTICE, "Copyright Notice", { length: 0, data: [] }, buildTextProperties],
  [EVENT_META, EVENT_META_INSTRUMENT_NAME, "Instrument Name", { length: 0, data: [] }, buildTextProperties],
  [EVENT_META, EVENT_META_LYRICS, "Lyrics", { length: 0, data: [] }, buildTextProperties],
  [EVENT_META, EVENT_META_MARKER, "Marker", { length: 0, data: [] }, buildTextProperties],
  [EVENT_META, EVENT_META_CUE_POINT, "Cue Point", { length: 0, data: [] }, buildTextProperties],
  [EVENT_META, EVENT_META_MIDI_CHANNEL_PREFIX, "Channel Prefix", { length: 1, prefix: 0 }, (event: MIDIChannelPrefixEvent, onChange: (event: MIDIChannelPrefixEvent) => void, trackLength: number) => ({
    time: {
      type: "integer",
      label: "Time: ",
      value: event.delta,
      min: 0,
      max: trackLength,
      onChange(value) {
        onChange({ ...event, delta: value });
      }
    },
    channel: {
      type: "integer",
      label: "Channel: ",
      value: event.prefix,
      min: 0,
      max: 15,
      onChange(value) {
        onChange({ ...event, prefix: value });
      }
    }
  })],
  [EVENT_META, EVENT_META_SET_TEMPO, "Set Tempo", { length: 3, tempo: 500000 }, (event: SetTempoEvent, onChange: (event: SetTempoEvent) => void, trackLength: number) => ({
    time: {
      type: "integer",
      label: "Time: ",
      value: event.delta,
      min: 0,
      max: trackLength,
      onChange(value) {
        onChange({ ...event, delta: value });
      }
    },
    tempo: {
      type: "integer",
      label: "Tempo (μs / quarter note): ",
      value: event.tempo,
      min: 1,
      max: 16777215,
      onChange(value) {
        onChange({ ...event, tempo: value });
      }
    }
  })],
  [EVENT_META, EVENT_META_SMTPE_OFFSET, "SMPTE Offset", { length: 5, hour: 0, minutes: 0, seconds: 0, frames: 0, subframes: 0 }, (event: SMPTEOffsetEvent, onChange: (event: SMPTEOffsetEvent) => void, trackLength: number) => ({
    time: {
      type: "integer",
      label: "Time: ",
      value: event.delta,
      min: 0,
      max: trackLength,
      onChange(value) {
        onChange({ ...event, delta: value });
      }
    },
    hour: {
      type: "integer",
      label: "Hour: ",
      value: event.hour,
      min: 0,
      max: 23,
      onChange(value) {
        onChange({ ...event, hour: value });
      }
    },
    minutes: {
      type: "integer",
      label: "Minutes: ",
      value: event.minutes,
      min: 0,
      max: 59,
      onChange(value) {
        onChange({ ...event, minutes: value });
      }
    },
    seconds: {
      type: "integer",
      label: "Seconds: ",
      value: event.seconds,
      min: 0,
      max: 59,
      onChange(value) {
        onChange({ ...event, seconds: value });
      }
    },
    frames: {
      type: "integer",
      label: "Frames: ",
      value: event.frames,
      min: 0,
      max: 29,
      onChange(value) {
        onChange({ ...event, frames: value });
      }
    },
    subframes: {
      type: "integer",
      label: "Subframes: ",
      value: event.subframes,
      min: 0,
      max: 99,
      onChange(value) {
        onChange({ ...event, subframes: value });
      }
    }
  })],
  [EVENT_META, EVENT_META_TIME_SIGNATURE, "Time Signature", { length: 4, data: [4, 2, 24, 8] }, (event: TimeSignatureEvent, onChange: (event: TimeSignatureEvent) => void, trackLength: number) => ({
    time: {
      type: "integer",
      label: "Time: ",
      value: event.delta,
      min: 0,
      max: trackLength,
      onChange(value) {
        onChange({ ...event, delta: value });
      }
    },
    numerator: {
      type: "integer",
      label: "Numerator: ",
      value: event.data[0],
      min: 1,
      max: 1 << event.data[1],
      onChange(value) {
        onChange({ ...event, data: [value, event.data[1], event.data[2], event.data[3]] });
      }
    },
    denominator: {
      type: "select",
      label: "Denominator: ",
      value: event.data[1],
      options: Array.from({ length: 5 }, (_, index) => (1 << index).toString()),
      onChange(value) {
        onChange({ ...event, data: [Math.min(event.data[0], 1 << value), value, event.data[2], event.data[3]] });
      }
    },
    metronomeClick: {
      type: "integer",
      label: "Clocks / metronome click: ",
      value: event.data[2],
      min: 0,
      max: 127,
      onChange(value) {
        onChange({ ...event, data: [event.data[0], event.data[1], value, event.data[3]] });
      }
    },
    quarterNote: {
      type: "integer",
      label: "Clocks / quarter note: ",
      value: event.data[3],
      min: 0,
      max: 127,
      onChange(value) {
        onChange({ ...event, data: [event.data[0], event.data[1], event.data[2], value] });
      }
    }
  })],
  [EVENT_META, EVENT_META_KEY_SIGNATURE, "Key Signature", { length: 2, key: 0, scale: 0 }, (event: KeySignatureEvent, onChange: (event: KeySignatureEvent) => void, trackLength: number) => ({
    time: {
      type: "integer",
      label: "Time: ",
      value: event.delta,
      min: 0,
      max: trackLength,
      onChange(value) {
        onChange({ ...event, delta: value });
      }
    },
    key: {
      type: "integer",
      label: "Key: ",
      value: event.key,
      min: -7,
      max: 7,
      onChange(value) {
        onChange({ ...event, key: value });
      }
    },
    scale: {
      type: "select",
      label: "Scale: ",
      value: event.scale,
      options: ["Major", "Minor"],
      onChange(value) {
        onChange({ ...event, scale: value });
      }
    }
  })],
  [EVENT_META, EVENT_META_SEQUENCER_SPECIFIC, "Sequencer Specific", { length: 0, data: [] }, (event: SequencerSpecificEvent, onChange: (event: SequencerSpecificEvent) => void, trackLength: number) => ({
    time: {
      type: "integer",
      label: "Time: ",
      value: event.delta,
      min: 0,
      max: trackLength,
      onChange(value) {
        onChange({ ...event, delta: value });
      }
    },
    data: {
      type: "byte-array",
      label: "Data: ",
      value: new Uint8Array(event.data),
      onChange(value) {
        onChange({ ...event, length: value.length, data: Array.from(value) });
      }
    }
  })],
  [EVENT_SYSEX, 0, "SysEx", { length: 0, data: [] }, buildSysExProperties],
  [EVENT_DIVSYSEX, 0, "SysEx Continuation", { length: 0, data: [] }, buildSysExProperties],
  [EVENT_MIDI, EVENT_MIDI_NOTE_AFTERTOUCH, "Note Aftertouch", { channel: 0, param1: 0, param2: 0 }, (event: NoteAftertouchEvent, onChange: (event: NoteAftertouchEvent) => void, trackLength: number) => ({
    time: {
      type: "integer",
      label: "Time: ",
      value: event.delta,
      min: 0,
      max: trackLength,
      onChange(value) {
        onChange({ ...event, delta: value });
      }
    },
    channel: {
      type: "integer",
      label: "Channel: ",
      value: event.channel,
      min: 0,
      max: 15,
      onChange(value) {
        onChange({ ...event, channel: value });
      }
    },
    noteIndex: {
      type: "integer",
      label: "Note: ",
      value: event.param1,
      min: 0,
      max: 127,
      onChange(value) {
        onChange({ ...event, param1: value });
      }
    },
    aftertouch: {
      type: "integer",
      label: "Pressure: ",
      value: event.param2,
      min: 0,
      max: 127,
      onChange(value) {
        onChange({ ...event, param2: value });
      }
    }
  })],
  [EVENT_MIDI, EVENT_MIDI_CONTROLLER, "Control Change", { channel: 0, param1: 0, param2: 0 }, (event: ControllerEvent, onChange: (event: ControllerEvent) => void, trackLength: number) => ({
    time: {
      type: "integer",
      label: "Time: ",
      value: event.delta,
      min: 0,
      max: trackLength,
      onChange(value) {
        onChange({ ...event, delta: value });
      }
    },
    channel: {
      type: "integer",
      label: "Channel: ",
      value: event.channel,
      min: 0,
      max: 15,
      onChange(value) {
        onChange({ ...event, channel: value });
      }
    },
    id: {
      type: "integer",
      label: "ID: ",
      value: event.param1,
      min: 0,
      max: 127,
      onChange(value) {
        onChange({ ...event, param1: value });
      }
    },
    value: {
      type: "integer",
      label: "Value: ",
      value: event.param2,
      min: 0,
      max: 127,
      onChange(value) {
        onChange({ ...event, param2: value });
      }
    }
  })],
  [EVENT_MIDI, EVENT_MIDI_PROGRAM_CHANGE, "Program Change", { channel: 0, param1: 0 }, (event: ProgramChangeEvent, onChange: (event: ProgramChangeEvent) => void, trackLength: number) => ({
    time: {
      type: "integer",
      label: "Time: ",
      value: event.delta,
      min: 0,
      max: trackLength,
      onChange(value) {
        onChange({ ...event, delta: value });
      }
    },
    channel: {
      type: "integer",
      label: "Channel: ",
      value: event.channel,
      min: 0,
      max: 15,
      onChange(value) {
        onChange({ ...event, channel: value });
      }
    },
    program: {
      type: "integer",
      label: "Program: ",
      value: event.param1,
      min: 0,
      max: 127,
      onChange(value) {
        onChange({ ...event, param1: value });
      }
    }
  })],
  [EVENT_MIDI, EVENT_MIDI_CHANNEL_AFTERTOUCH, "Channel Aftertouch", { channel: 0, param1: 0 }, (event: ChannelAftertouchEvent, onChange: (event: ChannelAftertouchEvent) => void, trackLength: number) => ({
    time: {
      type: "integer",
      label: "Time: ",
      value: event.delta,
      min: 0,
      max: trackLength,
      onChange(value) {
        onChange({ ...event, delta: value });
      }
    },
    channel: {
      type: "integer",
      label: "Channel: ",
      value: event.channel,
      min: 0,
      max: 15,
      onChange(value) {
        onChange({ ...event, channel: value });
      }
    },
    aftertouch: {
      type: "integer",
      label: "Pressure: ",
      value: event.param1,
      min: 0,
      max: 127,
      onChange(value) {
        onChange({ ...event, param1: value });
      }
    }
  })],
  [EVENT_MIDI, EVENT_MIDI_PITCH_BEND, "Pitch Bend", { channel: 0, param1: 0, param2: 64 }, (event: PitchBendEvent, onChange: (event: PitchBendEvent) => void, trackLength: number) => ({
    time: {
      type: "integer",
      label: "Time: ",
      value: event.delta,
      min: 0,
      max: trackLength,
      onChange(value) {
        onChange({ ...event, delta: value });
      }
    },
    channel: {
      type: "integer",
      label: "Channel: ",
      value: event.channel,
      min: 0,
      max: 15,
      onChange(value) {
        onChange({ ...event, channel: value });
      }
    },
    pitch: {
      type: "integer",
      label: "Pitch: ",
      value: (event.param1 | (event.param2 << 7)) - 8192,
      min: -8192,
      max: 8191,
      onChange(value) {
        onChange({ ...event, param1: value & 0x7f, param2: (value + 8192) >> 7 });
      }
    }
  })]
];

function getTypeIndex(type: number, subtype: number): number {
  return typeData.findIndex(data => data[0] === type && ([-1, EVENT_SYSEX, EVENT_DIVSYSEX].includes(type) || data[1] === subtype));
}

export function newEvent(type: number, subtype: number): Event {
  return {
    ...JSON.parse(JSON.stringify(typeData[getTypeIndex(type, subtype)][3])),
    delta: 0,
    type,
    subtype
  };
}

export function getEventName(type: number, subtype: number): string {
  return typeData[getTypeIndex(type, subtype)][2];
}

export function getEventProperties(event: Event | undefined, onChange: (event: Event) => void, trackLength: number): { [id: string]: Property; } {
  if (!event)
    return {};
  const typeIndex = getTypeIndex(event.type, event.subtype);
  const eventProperties = typeData[typeIndex][4](event as never, onChange, trackLength);
  return {
    type: {
      type: "select",
      label: "Type: ",
      options: typeData.map(type => type[2]),
      value: typeIndex,
      onChange(value) {
        const [type, subtype] = typeData[value];
        onChange(newEvent(type, subtype));
      }
    },
    ...eventProperties
  };
}
