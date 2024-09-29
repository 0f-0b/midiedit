import React, { useMemo, useState } from "react";
import { makeArray } from "../../../shared/src/array.ts";
import { Track } from "../../../shared/src/midi.ts";
import classes from "./notes_viewer.module.css";

const channelCount = 16;
const keyCount = 128;

interface Note {
  start: number;
  end: number;
  channel: number;
  key: number;
  velocity: number;
}

function extractNotes(track: Track): Note[] {
  const notes: Note[] = [];
  const channels = makeArray(
    channelCount * keyCount,
    () => ({ time: 0, velocity: 0 }),
  );
  let time = 0;
  const update = (channel: number, key: number, velocity: number) => {
    const note = channels[channel * keyCount + key];
    if (note.velocity) {
      notes.push({
        start: note.time,
        end: time,
        channel,
        key,
        velocity: note.velocity,
      });
    }
    note.time = time;
    note.velocity = velocity;
  };
  for (const event of track) {
    time += event.delta;
    switch (event.type) {
      case "note-off":
        update(event.channel, event.key, 0);
        break;
      case "note-on":
        update(event.channel, event.key, event.velocity);
        break;
      case "end-of-track":
        for (let channel = 0; channel < channelCount; channel++) {
          for (let key = 0; key < keyCount; key++) {
            update(channel, key, 0);
          }
        }
        break;
    }
  }
  return notes;
}

const colors = ["#00f", "#0f0", "#0ff", "#f00", "#f0f", "#ff0"];

function color(index: number): string {
  return colors[index % colors.length];
}

export interface NotesViewerProps {
  track: Track;
  ticksPerBeat: number | null;
}

export function NotesViewer(
  { track, ticksPerBeat }: NotesViewerProps,
): JSX.Element {
  const [scale, setScale] = useState(0);
  const tickWidth = 2 ** scale;
  const keyHeight = 8;
  const trackLength = useMemo(
    () => track.reduce((time, event) => time + event.delta, 0),
    [track],
  );
  const notes = useMemo(() => extractNotes(track), [track]);
  return (
    <div className={classes.notesViewer}>
      <div className={classes.notesWrapper}>
        <svg
          className={classes.notes}
          width={trackLength * tickWidth}
          height={keyCount * keyHeight}
          transform="scale(1, -1)"
        >
          {notes.map((note, index) => (
            <rect
              key={index}
              x={note.start * tickWidth}
              y={note.key * keyHeight}
              width={(note.end - note.start) * tickWidth}
              height={keyHeight}
              fill={color(note.channel)}
              opacity={note.velocity / 127}
            />
          ))}
          <g fill="none" stroke="#333">
            {ticksPerBeat === null || Array.from(
              { length: Math.ceil(trackLength / ticksPerBeat) - 1 },
              (_, index) => (
                <line
                  key={index}
                  x1={(index + 1) * ticksPerBeat * tickWidth}
                  x2={(index + 1) * ticksPerBeat * tickWidth}
                  y2={keyCount * keyHeight}
                />
              ),
            )}
            <line
              x={trackLength * tickWidth}
              width={trackLength * tickWidth}
              height={keyCount * keyHeight}
            />
          </g>
        </svg>
      </div>
      <input
        className={classes.scaleSlider}
        type="range"
        value={scale}
        min={-4}
        max={4}
        step="any"
        onChange={(event) => setScale(event.target.valueAsNumber)}
        aria-label="Scale"
      />
    </div>
  );
}
