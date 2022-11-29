import { clsx } from "clsx";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { AutoSizer, Collection } from "react-virtualized";
import { Track } from "../../../../src/midi";
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
  const channels = Array.from(
    { length: channelCount * keyCount },
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

const colors: string[] = [
  classes.color0,
  classes.color1,
  classes.color2,
  classes.color3,
  classes.color4,
  classes.color5,
];

function color(index: number): string {
  return colors[index % colors.length];
}

export interface NotesViewerProps {
  track: Track;
}

export function NotesViewer({ track }: NotesViewerProps): JSX.Element {
  const [scale, setScale] = useState(0);
  const tickWidth = 2 ** scale;
  const noteHeight = 8;
  const trackLength = useMemo(
    () => track.reduce((time, event) => time + event.delta, 0),
    [track],
  );
  const notes = useMemo(() => extractNotes(track), [track]);
  const collection = useRef<Collection>(null);
  useEffect(() => collection.current?.recomputeCellSizesAndPositions(), [
    trackLength,
    notes,
    scale,
  ]);
  return (
    <div className={classes.notesViewer}>
      <AutoSizer>
        {({ width, height }) => (
          <Collection
            width={width}
            height={height}
            cellCount={notes.length + 1}
            cellSizeAndPositionGetter={({ index }) => {
              if (index === notes.length) {
                return {
                  x: Math.ceil(trackLength * tickWidth),
                  y: Math.ceil(keyCount * noteHeight),
                  width: 0,
                  height: 0,
                };
              }
              const note = notes[index];
              return {
                x: Math.floor(note.start * tickWidth),
                y: Math.floor(noteHeight * ((keyCount - 1) - note.key)),
                width: Math.ceil((note.end - note.start) * tickWidth),
                height: Math.ceil(noteHeight),
              };
            }}
            cellRenderer={({ index, key, style }) => {
              if (index === notes.length) {
                return undefined;
              }
              const note = notes[index];
              return (
                <div
                  key={key}
                  className={clsx(classes.note, color(note.channel))}
                  style={{ ...style, opacity: note.velocity / 127 }}
                />
              );
            }}
            ref={collection}
          />
        )}
      </AutoSizer>
      <input
        className={classes.scale}
        type="range"
        value={scale}
        min={-4}
        max={4}
        step="any"
        onChange={(event) => setScale(event.target.valueAsNumber)}
      />
    </div>
  );
}
