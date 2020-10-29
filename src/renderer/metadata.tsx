import * as React from "react";
import { Division, DivisionType, Format, Midi, newDivision, smpteFrames } from "../common/midi";
import { PropertiesEditor, PropertiesEditorProps, Property } from "./properties-editor";

function divisionProperties(division: Division, onChange: (division: Division) => void): { [id: string]: Property; } {
  switch (division.type) {
    case 0: {
      const { ticksPerBeat } = division;
      return {
        ticksPerBeat: {
          type: "integer",
          label: "Ticks per beat: ",
          value: ticksPerBeat,
          min: 1,
          max: 32767,
          onChange(value) {
            onChange({ type: 0, ticksPerBeat: value });
          }
        }
      };
    }
    case 1: {
      const { smpteFormat, ticksPerFrame } = division;
      return {
        smpteFormat: {
          type: "select",
          label: "Frames per second: ",
          value: smpteFormat,
          options: smpteFrames.map(String),
          onChange(value) {
            onChange({ type: 1, smpteFormat: value, ticksPerFrame });
          }
        },
        ticksPerFrame: {
          type: "integer",
          label: "Ticks per frame: ",
          value: ticksPerFrame,
          min: 1,
          max: 127,
          onChange(value) {
            onChange({ type: 1, smpteFormat, ticksPerFrame: value });
          }
        }
      };
    }
  }
}

export interface MetadataProps extends Omit<PropertiesEditorProps, "properties" | "onChange"> {
  midi: Midi;
  onChange: (midi: Midi) => void;
}

export default function Metadata({ midi, onChange, ...props }: MetadataProps): JSX.Element {
  return <PropertiesEditor className="metadata"
    properties={{
      format: {
        type: "select",
        label: "Format: ",
        value: midi.format,
        options: ["Single track", "Simultaneous", "Independent"],
        onChange(value) {
          onChange({ ...midi, format: value as Format, tracks: value === 0 ? midi.tracks.slice(0, 1) : midi.tracks });
        }
      },
      division: {
        type: "select",
        label: "Division: ",
        value: midi.division.type,
        // midifile does not handle SMPTE time correctly
        options: ["Metrical"/*, "SMPTE"*/],
        onChange(value) {
          onChange({ ...midi, division: newDivision(value as DivisionType) });
        }
      },
      ...divisionProperties(midi.division, division => onChange({ ...midi, division }))
    }} {...props} />;
}
