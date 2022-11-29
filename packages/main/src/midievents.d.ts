type Byte =
  | 0x00
  | 0x01
  | 0x02
  | 0x03
  | 0x04
  | 0x05
  | 0x06
  | 0x07
  | 0x08
  | 0x09
  | 0x0a
  | 0x0b
  | 0x0c
  | 0x0d
  | 0x0e
  | 0x0f
  | 0x10
  | 0x11
  | 0x12
  | 0x13
  | 0x14
  | 0x15
  | 0x16
  | 0x17
  | 0x18
  | 0x19
  | 0x1a
  | 0x1b
  | 0x1c
  | 0x1d
  | 0x1e
  | 0x1f
  | 0x20
  | 0x21
  | 0x22
  | 0x23
  | 0x24
  | 0x25
  | 0x26
  | 0x27
  | 0x28
  | 0x29
  | 0x2a
  | 0x2b
  | 0x2c
  | 0x2d
  | 0x2e
  | 0x2f
  | 0x30
  | 0x31
  | 0x32
  | 0x33
  | 0x34
  | 0x35
  | 0x36
  | 0x37
  | 0x38
  | 0x39
  | 0x3a
  | 0x3b
  | 0x3c
  | 0x3d
  | 0x3e
  | 0x3f
  | 0x40
  | 0x41
  | 0x42
  | 0x43
  | 0x44
  | 0x45
  | 0x46
  | 0x47
  | 0x48
  | 0x49
  | 0x4a
  | 0x4b
  | 0x4c
  | 0x4d
  | 0x4e
  | 0x4f
  | 0x50
  | 0x51
  | 0x52
  | 0x53
  | 0x54
  | 0x55
  | 0x56
  | 0x57
  | 0x58
  | 0x59
  | 0x5a
  | 0x5b
  | 0x5c
  | 0x5d
  | 0x5e
  | 0x5f
  | 0x60
  | 0x61
  | 0x62
  | 0x63
  | 0x64
  | 0x65
  | 0x66
  | 0x67
  | 0x68
  | 0x69
  | 0x6a
  | 0x6b
  | 0x6c
  | 0x6d
  | 0x6e
  | 0x6f
  | 0x70
  | 0x71
  | 0x72
  | 0x73
  | 0x74
  | 0x75
  | 0x76
  | 0x77
  | 0x78
  | 0x79
  | 0x7a
  | 0x7b
  | 0x7c
  | 0x7d
  | 0x7e
  | 0x7f
  | 0x80
  | 0x81
  | 0x82
  | 0x83
  | 0x84
  | 0x85
  | 0x86
  | 0x87
  | 0x88
  | 0x89
  | 0x8a
  | 0x8b
  | 0x8c
  | 0x8d
  | 0x8e
  | 0x8f
  | 0x90
  | 0x91
  | 0x92
  | 0x93
  | 0x94
  | 0x95
  | 0x96
  | 0x97
  | 0x98
  | 0x99
  | 0x9a
  | 0x9b
  | 0x9c
  | 0x9d
  | 0x9e
  | 0x9f
  | 0xa0
  | 0xa1
  | 0xa2
  | 0xa3
  | 0xa4
  | 0xa5
  | 0xa6
  | 0xa7
  | 0xa8
  | 0xa9
  | 0xaa
  | 0xab
  | 0xac
  | 0xad
  | 0xae
  | 0xaf
  | 0xb0
  | 0xb1
  | 0xb2
  | 0xb3
  | 0xb4
  | 0xb5
  | 0xb6
  | 0xb7
  | 0xb8
  | 0xb9
  | 0xba
  | 0xbb
  | 0xbc
  | 0xbd
  | 0xbe
  | 0xbf
  | 0xc0
  | 0xc1
  | 0xc2
  | 0xc3
  | 0xc4
  | 0xc5
  | 0xc6
  | 0xc7
  | 0xc8
  | 0xc9
  | 0xca
  | 0xcb
  | 0xcc
  | 0xcd
  | 0xce
  | 0xcf
  | 0xd0
  | 0xd1
  | 0xd2
  | 0xd3
  | 0xd4
  | 0xd5
  | 0xd6
  | 0xd7
  | 0xd8
  | 0xd9
  | 0xda
  | 0xdb
  | 0xdc
  | 0xdd
  | 0xde
  | 0xdf
  | 0xe0
  | 0xe1
  | 0xe2
  | 0xe3
  | 0xe4
  | 0xe5
  | 0xe6
  | 0xe7
  | 0xe8
  | 0xe9
  | 0xea
  | 0xeb
  | 0xec
  | 0xed
  | 0xee
  | 0xef
  | 0xf0
  | 0xf1
  | 0xf2
  | 0xf3
  | 0xf4
  | 0xf5
  | 0xf6
  | 0xf7
  | 0xf8
  | 0xf9
  | 0xfa
  | 0xfb
  | 0xfc
  | 0xfd
  | 0xfe
  | 0xff;

interface GenericEvent {
  delta: number;
}

interface GenericMetaEvent extends GenericEvent {
  type: typeof MIDIEvents.EVENT_META;
  length: number;
}

interface Generic1ParamMIDIEvent extends GenericEvent {
  type: typeof MIDIEvents.EVENT_MIDI;
  channel: number;
  param1: number;
}

interface Generic2ParamsMIDIEvent extends Generic1ParamMIDIEvent {
  param2: number;
}

declare namespace MIDIEvents {
  interface DataStream {
    position: number;
    buffer: DataView;
    readUint8(): number;
    readUint16(): number;
    readUint32(): number;
    readVarInt(): number;
    readBytes(length: number): number[];
    pos(): string;
    end(): boolean;
  }

  interface Parser {
    next(): Event | null;
  }

  const EVENT_META: 0xff;
  const EVENT_SYSEX: 0xf0;
  const EVENT_DIVSYSEX: 0xf7;
  const EVENT_MIDI: 0x8;
  const EVENT_META_SEQUENCE_NUMBER: 0x00;
  const EVENT_META_TEXT: 0x01;
  const EVENT_META_COPYRIGHT_NOTICE: 0x02;
  const EVENT_META_TRACK_NAME: 0x03;
  const EVENT_META_INSTRUMENT_NAME: 0x04;
  const EVENT_META_LYRICS: 0x05;
  const EVENT_META_MARKER: 0x06;
  const EVENT_META_CUE_POINT: 0x07;
  const EVENT_META_MIDI_CHANNEL_PREFIX: 0x20;
  const EVENT_META_END_OF_TRACK: 0x2f;
  const EVENT_META_SET_TEMPO: 0x51;
  const EVENT_META_SMTPE_OFFSET: 0x54;
  const EVENT_META_TIME_SIGNATURE: 0x58;
  const EVENT_META_KEY_SIGNATURE: 0x59;
  const EVENT_META_SEQUENCER_SPECIFIC: 0x7f;
  const EVENT_MIDI_NOTE_OFF: 0x8;
  const EVENT_MIDI_NOTE_ON: 0x9;
  const EVENT_MIDI_NOTE_AFTERTOUCH: 0xa;
  const EVENT_MIDI_CONTROLLER: 0xb;
  const EVENT_MIDI_PROGRAM_CHANGE: 0xc;
  const EVENT_MIDI_CHANNEL_AFTERTOUCH: 0xd;
  const EVENT_MIDI_PITCH_BEND: 0xe;
  const MIDI_1PARAM_EVENTS: readonly [
    typeof EVENT_MIDI_PROGRAM_CHANGE,
    typeof EVENT_MIDI_CHANNEL_AFTERTOUCH,
  ];
  const MIDI_2PARAMS_EVENTS: readonly [
    typeof EVENT_MIDI_NOTE_OFF,
    typeof EVENT_MIDI_NOTE_ON,
    typeof EVENT_MIDI_NOTE_AFTERTOUCH,
    typeof EVENT_MIDI_CONTROLLER,
    typeof EVENT_MIDI_PITCH_BEND,
  ];

  interface SequenceNumberEvent extends GenericMetaEvent {
    subtype: typeof EVENT_META_SEQUENCE_NUMBER;
    msb: number;
    lsb: number;
  }

  interface TextEvent extends GenericMetaEvent {
    subtype:
      | typeof EVENT_META_TEXT
      | typeof EVENT_META_COPYRIGHT_NOTICE
      | typeof EVENT_META_TRACK_NAME
      | typeof EVENT_META_INSTRUMENT_NAME
      | typeof EVENT_META_LYRICS
      | typeof EVENT_META_MARKER
      | typeof EVENT_META_CUE_POINT
      | 0x8
      | 0x9
      | 0xa
      | 0xb
      | 0xc
      | 0xd
      | 0xe
      | 0xf;
    data: number[];
  }

  interface MIDIChannelPrefixEvent extends GenericMetaEvent {
    subtype: typeof EVENT_META_MIDI_CHANNEL_PREFIX;
    prefix: number;
  }

  interface EndOfTrackEvent extends GenericMetaEvent {
    subtype: typeof EVENT_META_END_OF_TRACK;
  }

  interface SetTempoEvent extends GenericMetaEvent {
    subtype: typeof EVENT_META_SET_TEMPO;
    tempo: number;
  }

  interface SMPTEOffsetEvent extends GenericMetaEvent {
    subtype: typeof EVENT_META_SMTPE_OFFSET;
    hour: number;
    minutes: number;
    seconds: number;
    frames: number;
    subframes: number;
  }

  interface TimeSignatureEvent extends GenericMetaEvent {
    subtype: typeof EVENT_META_TIME_SIGNATURE;
    data: number[];
  }

  interface KeySignatureEvent extends GenericMetaEvent {
    subtype: typeof EVENT_META_KEY_SIGNATURE;
    key: number;
    scale: number;
  }

  interface SequencerSpecificEvent extends GenericMetaEvent {
    subtype: typeof EVENT_META_SEQUENCER_SPECIFIC;
    data: number[];
  }

  type KnownMetaEvent =
    | SequenceNumberEvent
    | TextEvent
    | MIDIChannelPrefixEvent
    | EndOfTrackEvent
    | SetTempoEvent
    | SMPTEOffsetEvent
    | TimeSignatureEvent
    | KeySignatureEvent
    | SequencerSpecificEvent;

  interface UnknownMetaEvent extends GenericMetaEvent {
    subtype: Exclude<Byte, KnownMetaEvent["subtype"]>;
    data: number[];
  }

  type MetaEvent = KnownMetaEvent | UnknownMetaEvent;

  interface SysExEvent extends GenericEvent {
    type: typeof EVENT_SYSEX | typeof EVENT_DIVSYSEX;
    length: number;
    data: number[];
  }

  interface UnknownEvent extends GenericEvent {
    type: Exclude<
      | 0xf0
      | 0xf1
      | 0xf2
      | 0xf3
      | 0xf4
      | 0xf5
      | 0xf6
      | 0xf7
      | 0xf8
      | 0xf9
      | 0xfa
      | 0xfb
      | 0xfc
      | 0xfd
      | 0xfe
      | 0xff,
      MetaEvent["type"] | SysExEvent["type"]
    >;
    length: number;
    data: number[];
  }

  interface NoteOffEvent extends Generic2ParamsMIDIEvent {
    subtype: typeof EVENT_MIDI_NOTE_OFF;
  }

  interface NoteOnEvent extends Generic2ParamsMIDIEvent {
    subtype: typeof EVENT_MIDI_NOTE_ON;
  }

  interface NoteAftertouchEvent extends Generic2ParamsMIDIEvent {
    subtype: typeof EVENT_MIDI_NOTE_AFTERTOUCH;
  }

  interface ControllerEvent extends Generic2ParamsMIDIEvent {
    subtype: typeof EVENT_MIDI_CONTROLLER;
  }

  interface ProgramChangeEvent extends Generic1ParamMIDIEvent {
    subtype: typeof EVENT_MIDI_PROGRAM_CHANGE;
  }

  interface ChannelAftertouchEvent extends Generic1ParamMIDIEvent {
    subtype: typeof EVENT_MIDI_CHANNEL_AFTERTOUCH;
  }

  interface PitchBendEvent extends Generic2ParamsMIDIEvent {
    subtype: typeof EVENT_MIDI_PITCH_BEND;
  }

  type MIDIEvent =
    | NoteOffEvent
    | NoteOnEvent
    | NoteAftertouchEvent
    | ControllerEvent
    | ProgramChangeEvent
    | ChannelAftertouchEvent
    | PitchBendEvent;
  type Event =
    | MetaEvent
    | SysExEvent
    | UnknownEvent
    | MIDIEvent;

  function createParser(
    stream: DataView | DataStream,
    startAt?: number,
    strictMode?: boolean,
  ): Parser;
  function writeToTrack(
    events: readonly Event[],
    destination: Uint8Array,
    strictMode?: boolean,
  ): undefined;
  function getRequiredBufferLength(events: readonly Event[]): number;
}

export = MIDIEvents;
