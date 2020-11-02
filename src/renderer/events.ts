import { Event, TrackEvent } from "../common/midi";
import { Property } from "./properties-editor";

interface EventType<T> {
  name: string;
  default: Event & { type: T; };
  properties(event: Event & { type: T; }, onChange: (event: Event & { type: T; }) => void): { [id: string]: Property; };
}

const eventTypeMap: { [K in Event["type"]]: EventType<K>; } = {
  "note-off": {
    name: "Note Off",
    default: {
      type: "note-off",
      channel: 0,
      key: 60,
      velocity: 64
    },
    properties(event, onChange) {
      return {
        channel: {
          type: "integer",
          label: "Channel: ",
          value: event.channel,
          min: 0,
          max: 15,
          onChange(channel) {
            onChange({ ...event, channel });
          }
        },
        key: {
          type: "integer",
          label: "Key: ",
          value: event.key,
          min: 0,
          max: 127,
          onChange(key) {
            onChange({ ...event, key });
          }
        },
        velocity: {
          type: "integer",
          label: "Velocity: ",
          value: event.velocity,
          min: 0,
          max: 127,
          onChange(velocity) {
            onChange({ ...event, velocity });
          }
        }
      };
    }
  },
  "note-on": {
    name: "Note On",
    default: {
      type: "note-on",
      channel: 0,
      key: 60,
      velocity: 64
    },
    properties(event, onChange) {
      return {
        channel: {
          type: "integer",
          label: "Channel: ",
          value: event.channel,
          min: 0,
          max: 15,
          onChange(channel) {
            onChange({ ...event, channel });
          }
        },
        key: {
          type: "integer",
          label: "Key: ",
          value: event.key,
          min: 0,
          max: 127,
          onChange(key) {
            onChange({ ...event, key });
          }
        },
        velocity: {
          type: "integer",
          label: "Velocity: ",
          value: event.velocity,
          min: 0,
          max: 127,
          onChange(velocity) {
            onChange({ ...event, velocity });
          }
        }
      };
    }
  },
  "polyphonic-key-pressure": {
    name: "Polyphonic Key Pressure",
    default: {
      type: "polyphonic-key-pressure",
      channel: 0,
      key: 60,
      pressure: 0
    },
    properties(event, onChange) {
      return {
        channel: {
          type: "integer",
          label: "Channel: ",
          value: event.channel,
          min: 0,
          max: 15,
          onChange(channel) {
            onChange({ ...event, channel });
          }
        },
        key: {
          type: "integer",
          label: "Key: ",
          value: event.key,
          min: 0,
          max: 127,
          onChange(key) {
            onChange({ ...event, key });
          }
        },
        pressure: {
          type: "integer",
          label: "Pressure: ",
          value: event.pressure,
          min: 0,
          max: 127,
          onChange(pressure) {
            onChange({ ...event, pressure });
          }
        }
      };
    }
  },
  "control-change": {
    name: "Control Change",
    default: {
      type: "control-change",
      channel: 0,
      id: 0,
      value: 0
    },
    properties(event, onChange) {
      return {
        channel: {
          type: "integer",
          label: "Channel: ",
          value: event.channel,
          min: 0,
          max: 15,
          onChange(channel) {
            onChange({ ...event, channel });
          }
        },
        id: {
          type: "integer",
          label: "ID: ",
          value: event.id,
          min: 0,
          max: 127,
          onChange(id) {
            onChange({ ...event, id });
          }
        },
        value: {
          type: "integer",
          label: "Value: ",
          value: event.value,
          min: 0,
          max: 127,
          onChange(value) {
            onChange({ ...event, value });
          }
        }
      };
    }
  },
  "program-change": {
    name: "Program Change",
    default: {
      type: "program-change",
      channel: 0,
      program: 0
    },
    properties(event, onChange) {
      return {
        channel: {
          type: "integer",
          label: "Channel: ",
          value: event.channel,
          min: 0,
          max: 15,
          onChange(channel) {
            onChange({ ...event, channel });
          }
        },
        program: {
          type: "integer",
          label: "Program: ",
          value: event.program,
          min: 0,
          max: 127,
          onChange(program) {
            onChange({ ...event, program });
          }
        }
      };
    }
  },
  "channel-pressure": {
    name: "Channel Pressure",
    default: {
      type: "channel-pressure",
      channel: 0,
      pressure: 0
    },
    properties(event, onChange) {
      return {
        channel: {
          type: "integer",
          label: "Channel: ",
          value: event.channel,
          min: 0,
          max: 15,
          onChange(channel) {
            onChange({ ...event, channel });
          }
        },
        pressure: {
          type: "integer",
          label: "Pressure: ",
          value: event.pressure,
          min: 0,
          max: 127,
          onChange(pressure) {
            onChange({ ...event, pressure });
          }
        }
      };
    }
  },
  "pitch-bend-change": {
    name: "Pitch Bend Change",
    default: {
      type: "pitch-bend-change",
      channel: 0,
      pitch: 8192
    },
    properties(event, onChange) {
      return {
        channel: {
          type: "integer",
          label: "Channel: ",
          value: event.channel,
          min: 0,
          max: 15,
          onChange(channel) {
            onChange({ ...event, channel });
          }
        },
        pitch: {
          type: "integer",
          label: "Pitch: ",
          value: event.pitch,
          min: 0,
          max: 16383,
          onChange(pitch) {
            onChange({ ...event, pitch });
          }
        }
      };
    }
  },
  "sysex": {
    name: "SysEx",
    default: {
      type: "sysex",
      data: new Uint8Array
    },
    properties(event, onChange) {
      return {
        data: {
          type: "byte-array",
          label: "Data: ",
          value: event.data,
          onChange(data) {
            onChange({ ...event, data });
          }
        }
      };
    }
  },
  "sysex-escape": {
    name: "SysEx (Escape)",
    default: {
      type: "sysex-escape",
      data: new Uint8Array
    },
    properties(event, onChange) {
      return {
        data: {
          type: "byte-array",
          label: "Data: ",
          value: event.data,
          onChange(data) {
            onChange({ ...event, data });
          }
        }
      };
    }
  },
  "sequence-number": {
    name: "Sequence Number",
    default: {
      type: "sequence-number",
      sequenceNumber: 0
    },
    properties(event, onChange) {
      return {
        sequenceNumber: {
          type: "integer",
          label: "Sequence Number: ",
          value: event.sequenceNumber,
          min: 0,
          max: 65535,
          onChange(sequenceNumber) {
            onChange({ ...event, sequenceNumber });
          }
        }
      };
    }
  },
  "text": {
    name: "Text",
    default: {
      type: "text",
      subtype: 0,
      text: ""
    },
    properties(event, onChange) {
      return {
        subtype: {
          type: "select",
          label: "Subtype: ",
          value: event.subtype,
          options: [
            "Generic Text",
            "Copyright Notice",
            "Track Name",
            "Instrument Name",
            "Lyric",
            "Marker",
            "Cue Point",
            "8",
            "9",
            "10",
            "11",
            "12",
            "13",
            "14",
            "15"
          ],
          onChange(subtype) {
            onChange({ ...event, subtype });
          }
        },
        text: {
          type: "string",
          label: "Text: ",
          value: event.text,
          onChange(text) {
            onChange({ ...event, text });
          }
        }
      };
    }
  },
  "midi-channel-prefix": {
    name: "MIDI Channel Prefix",
    default: {
      type: "midi-channel-prefix",
      channel: 0
    },
    properties(event, onChange) {
      return {
        channel: {
          type: "integer",
          label: "Channel: ",
          value: event.channel,
          min: 0,
          max: 15,
          onChange(channel) {
            onChange({ ...event, channel });
          }
        }
      };
    }
  },
  "end-of-track": {
    name: "End of Track",
    default: {
      type: "end-of-track"
    },
    properties() {
      return {};
    }
  },
  "set-tempo": {
    name: "Set Tempo",
    default: {
      type: "set-tempo",
      tempo: 500000
    },
    properties(event, onChange) {
      return {
        tempo: {
          type: "integer",
          label: "Tempo (μs / quarter-note): ",
          value: event.tempo,
          min: 1,
          max: 16777215,
          onChange(tempo) {
            onChange({ ...event, tempo });
          }
        }
      };
    }
  },
  "smpte-offset": {
    name: "SMPTE Offset",
    default: {
      type: "smpte-offset",
      smpteFormat: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      frames: 0,
      subframes: 0
    },
    properties(event, onChange) {
      return {
        hour: {
          type: "integer",
          label: "Hour: ",
          value: event.hours,
          min: 0,
          max: 23,
          onChange(hours) {
            onChange({ ...event, hours });
          }
        },
        minutes: {
          type: "integer",
          label: "Minutes: ",
          value: event.minutes,
          min: 0,
          max: 59,
          onChange(minutes) {
            onChange({ ...event, minutes });
          }
        },
        seconds: {
          type: "integer",
          label: "Seconds: ",
          value: event.seconds,
          min: 0,
          max: 59,
          onChange(seconds) {
            onChange({ ...event, seconds });
          }
        },
        frames: {
          type: "integer",
          label: "Frames: ",
          value: event.frames,
          min: 0,
          max: 29,
          onChange(frames) {
            onChange({ ...event, frames });
          }
        },
        subframes: {
          type: "integer",
          label: "Subframes: ",
          value: event.subframes,
          min: 0,
          max: 99,
          onChange(subframes) {
            onChange({ ...event, subframes });
          }
        }
      };
    }
  },
  "time-signature": {
    name: "Time Signature",
    default: {
      type: "time-signature",
      numerator: 4,
      denominator: 2,
      metronomeClick: 24,
      quarterNote: 8
    },
    properties(event, onChange) {
      return {
        numerator: {
          type: "integer",
          label: "Numerator: ",
          value: event.numerator,
          min: 1,
          max: 1 << event.denominator,
          onChange(numerator) {
            onChange({ ...event, numerator });
          }
        },
        denominator: {
          type: "select",
          label: "Denominator: ",
          value: event.denominator,
          options: Array.from({ length: 5 }, (_, index) => (1 << index).toString()),
          onChange(denominator) {
            onChange({ ...event, numerator: Math.min(event.numerator, 1 << denominator), denominator });
          }
        },
        metronomeClick: {
          type: "integer",
          label: "Clocks / metronome click: ",
          value: event.metronomeClick,
          min: 0,
          max: 127,
          onChange(metronomeClick) {
            onChange({ ...event, metronomeClick });
          }
        },
        quarterNote: {
          type: "integer",
          label: "Notated 32nd-notes / quarter-note: ",
          value: event.quarterNote,
          min: 0,
          max: 127,
          onChange(quarterNote) {
            onChange({ ...event, quarterNote });
          }
        }
      };
    }
  },
  "key-signature": {
    name: "Key Signature",
    default: {
      type: "key-signature",
      key: 0,
      scale: 0
    },
    properties(event, onChange) {
      return {
        key: {
          type: "integer",
          label: "Key: ",
          value: event.key,
          min: -7,
          max: 7,
          onChange(key) {
            onChange({ ...event, key });
          }
        },
        scale: {
          type: "select",
          label: "Scale: ",
          value: event.scale,
          options: ["Major", "Minor"],
          onChange(scale) {
            onChange({ ...event, scale });
          }
        }
      };
    }
  },
  "sequencer-specific": {
    name: "Sequencer Specific",
    default: {
      type: "sequencer-specific",
      data: new Uint8Array
    },
    properties(event, onChange) {
      return {
        data: {
          type: "byte-array",
          label: "Data: ",
          value: event.data,
          onChange(data) {
            onChange({ ...event, data });
          }
        }
      };
    }
  }
};

const eventTypes = (keys => (keys.splice(keys.indexOf("end-of-track"), 1), keys))(Object.keys(eventTypeMap)) as Exclude<Event["type"], "end-of-track">[];

export function newTrackEvent(type: Event["type"], delta: number): TrackEvent {
  return { ...eventTypeMap[type].default, delta };
}

export function getEventName(type: Event["type"]): string {
  return eventTypeMap[type].name;
}

export function getEventProperties(event: TrackEvent, onChange: (event: TrackEvent) => void): { [id: string]: Property; } {
  const delta = event.delta;
  if (event.type === "end-of-track")
    return {
      delta: {
        type: "integer",
        label: "Delta: ",
        value: delta,
        min: 0,
        onChange(delta) {
          onChange({ ...event, delta });
        }
      }
    };
  const eventType: EventType<string> = eventTypeMap[event.type];
  const eventProperties = eventType.properties(event, event => onChange({ ...event, delta }));
  return {
    type: {
      type: "select",
      label: "Type: ",
      value: eventTypes.indexOf(event.type),
      options: eventTypes.map(getEventName),
      onChange(type) {
        onChange(newTrackEvent(eventTypes[type], delta));
      }
    },
    delta: {
      type: "integer",
      label: "Delta: ",
      value: delta,
      min: 0,
      onChange(delta) {
        onChange({ ...event, delta });
      }
    },
    ...eventProperties
  };
}
