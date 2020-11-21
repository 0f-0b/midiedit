import { useEffect, useRef } from "react";
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
  scale: number;
  noteHeight: number;
  visibleChannels: boolean[];
}

export default function NotesViewer({ track, scale, noteHeight, visibleChannels }: NotesViewerProps): JSX.Element {
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
                x: trackLength * scale,
                y: keyCount * noteHeight,
                width: 0,
                height: 0
              };
            const note = notes[index];
            return {
              x: note.start * scale,
              y: noteHeight * ((keyCount - 1) - note.key),
              width: (note.end - note.start) * scale,
              height: noteHeight
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
  </div>;
}
