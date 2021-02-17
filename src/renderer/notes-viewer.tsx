import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { AutoSizer, Collection } from "react-virtualized";
import { getTrackLength, Track } from "../common/midi";

const channelCount = 16;
const keyCount = 128;

interface Note {
  channel: number;
  key: number;
  start: number;
  end: number;
}

function extractNotes(track: Track, visible: boolean[]): Note[] {
  const notes: Note[] = [];
  const channels = Array.from({ length: channelCount }, () => new Array<number>(keyCount));
  let time = 0;
  for (const event of track) {
    time += event.delta;
    if (event.type === "end-of-track") {
      for (let channel = 0; channel < channelCount; channel++) {
        if (!visible[channel])
          continue;
        const ch = channels[channel];
        for (let key = 0; key < keyCount; key++)
          if (key in ch)
            notes.push({ channel, key, start: ch[key], end: time });
      }
      break;
    }
    if (event.type !== "note-on" && event.type !== "note-off")
      continue;
    const { channel, key } = event;
    if (!visible[channel])
      continue;
    const ch = channels[channel];
    if (event.type === "note-off" || event.velocity === 0) {
      if (key in ch) {
        notes.push({ channel, key, start: ch[key], end: time });
        delete ch[key];
      }
    } else
      ch[key] ??= time;
  }
  return notes;
}

export interface NotesViewerProps {
  track: Track;
  visibleChannels: boolean[];
}

export default function NotesViewer({ track, visibleChannels }: NotesViewerProps): JSX.Element {
  const [scale, setScale] = useState(0);
  const tickWidth = 2 ** scale;
  const noteHeight = 8;
  const trackLength = getTrackLength(track);
  const notes = extractNotes(track, visibleChannels);
  const collection = useRef<Collection>(null);
  useEffect(() => collection.current?.recomputeCellSizesAndPositions(), [trackLength, notes]);
  return <div className="notes-viewer">
    <AutoSizer>
      {({ width, height }) =>
        <Collection
          width={width}
          height={height}
          cellCount={notes.length + 1}
          cellSizeAndPositionGetter={({ index }) => {
            if (index === notes.length)
              return {
                x: Math.ceil(trackLength * tickWidth),
                y: Math.ceil(keyCount * noteHeight),
                width: 0,
                height: 0
              };
            const note = notes[index];
            return {
              x: Math.floor(note.start * tickWidth),
              y: Math.floor(noteHeight * ((keyCount - 1) - note.key)),
              width: Math.ceil((note.end - note.start) * tickWidth),
              height: Math.ceil(noteHeight)
            };
          }}
          cellRenderer={({ index, key, style }) => {
            if (index === notes.length)
              return undefined;
            const note = notes[index];
            return <div key={key} className={`note channel-${note.channel}`} style={style} />;
          }}
          ref={collection} />}
    </AutoSizer>
    <input className="scale" type="range" value={scale} min={-4} max={4} step="any"
      onChange={event => setScale(event.target.valueAsNumber)} />
  </div>;
}
