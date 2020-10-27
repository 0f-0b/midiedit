import "ecma-proposal-math-extensions";
import * as React from "react";
import { Event, NoteEvent } from "../../common/midi";
import { newEvent } from "../events";
import { AddButton, RemoveButton } from "./edit-buttons";

const colors = [
  ["#00a", "#55f"],
  ["#0a0", "#5f5"],
  ["#0aa", "#5ff"],
  ["#a00", "#f55"],
  ["#a0a", "#f5f"],
  ["#aa0", "#ff5"]
];
const noteHeight = 8;
let nextUpdate = 0;

export interface NotesEditorProps extends Omit<React.ComponentPropsWithoutRef<"div">, "className" | "onSelect" | "onChange"> {
  trackLength: number;
  events: Event[];
  selectedIndex: number;
  onChange: (events: Event[], selectedIndex: number) => void;
}

export interface NotesEditorState {
  dragOffset?: [number, number];
}

export default function NotesEditor({ trackLength, events, selectedIndex, onChange, ...props }: NotesEditorProps): JSX.Element {
  const editRegion = React.useRef<HTMLDivElement>(null);
  const [dragOffset, setDragOffset] = React.useState<[number, number] | undefined>(undefined);
  const notes: [NoteEvent, number][] = events
    .map((event, index) => [event, index] as [NoteEvent, number])
    .filter(([event]) => event.type === -1);
  const selectedEvent = events[selectedIndex];
  const selectedNote = selectedEvent?.type === -1 ? selectedEvent as NoteEvent : undefined;
  return <div className="notes-editor" {...props}>
    <div className="edit-buttons">
      <AddButton onClick={() => onChange([...events, newEvent(-1, 0)], events.length)} />
      {selectedNote && <RemoveButton onClick={() => onChange([...events.slice(0, selectedIndex), ...events.slice(selectedIndex + 1)], 0)} />}
    </div>
    <div ref={editRegion} className="notes-edit-region"
      style={{
        width: trackLength,
        height: 128 * noteHeight
      }}
      onMouseMove={event => {
        if (selectedNote && dragOffset) {
          event.preventDefault();
          if (performance.now() >= nextUpdate) {
            nextUpdate = performance.now() + 50;
            const bounds = event.currentTarget.getBoundingClientRect();
            const x = event.clientX - bounds.x - dragOffset[0];
            const y = event.clientY - bounds.y - dragOffset[1];
            onChange([
              ...events.slice(0, selectedIndex),
              {
                ...selectedNote,
                delta: Math.clamp(x, 0, trackLength - selectedNote.duration),
                note: Math.clamp(Math.round(127 - y / noteHeight), 0, 127)
              },
              ...events.slice(selectedIndex + 1)
            ], selectedIndex);
          }
        }
      }}
      onMouseUp={() => setDragOffset(undefined)}
      onMouseLeave={() => setDragOffset(undefined)}>
      {notes.map(([note, index]) => {
        const selected = selectedIndex === index;
        return <div key={index} className="note"
          style={{
            left: note.delta,
            top: noteHeight * note.note,
            width: note.duration,
            height: noteHeight,
            backgroundColor: colors[note.channel % colors.length][+selected]
          }}
          onMouseDown={event => {
            onChange(events, index);
            const bounds = event.currentTarget.getBoundingClientRect();
            setDragOffset([event.clientX - bounds.x, event.clientY - bounds.y]);
          }} />;
      })}
    </div>
  </div>;
}
