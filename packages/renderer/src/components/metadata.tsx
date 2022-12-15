import React from "react";
import {
  type Division,
  type DivisionType,
  type Format,
  type Midi,
  newDivision,
  smpteFrames,
} from "../../../shared/src/midi";
import classes from "./metadata.module.css";
import { PropertiesEditor, type Property } from "./properties_editor";

function divisionProperties(
  division: Division,
  onChange: (division: Division) => void,
): { [id: string]: Property } {
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
          },
        },
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
          },
        },
        ticksPerFrame: {
          type: "integer",
          label: "Ticks per frame: ",
          value: ticksPerFrame,
          min: 1,
          max: 127,
          onChange(value) {
            onChange({ type: 1, smpteFormat, ticksPerFrame: value });
          },
        },
      };
    }
  }
}

export interface MetadataProps {
  midi: Midi;
  onChange: (midi: Midi) => void;
}

export function Metadata({ midi, onChange }: MetadataProps): JSX.Element {
  return (
    <PropertiesEditor
      className={classes.metadata}
      properties={{
        format: {
          type: "select",
          label: "Format: ",
          value: midi.format,
          options: ["Single track", "Simultaneous", "Independent"],
          onChange(value) {
            onChange({
              ...midi,
              format: value as Format,
              tracks: value === 0 ? midi.tracks.slice(0, 1) : midi.tracks,
            });
          },
        },
        division: {
          type: "select",
          label: "Division: ",
          value: midi.division.type,
          options: [
            "Metrical",
            // "SMPTE", // midifile does not handle SMPTE time correctly
          ],
          onChange(value) {
            onChange({ ...midi, division: newDivision(value as DivisionType) });
          },
        },
        ...divisionProperties(
          midi.division,
          (division) => onChange({ ...midi, division }),
        ),
      }}
    />
  );
}
