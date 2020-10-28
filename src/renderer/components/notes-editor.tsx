import { useThrottleCallback } from "@react-hook/throttle";
import "ecma-proposal-math-extensions";
import * as React from "react";
import { Event, NoteEvent } from "../../common/midi";
import { newEvent } from "../events";
import { indexedFilter } from "../util";
import { AddButton, RemoveButton } from "./edit-buttons";

const noteHeight = 8;
const colors = [
  ["#00a", "#55f"],
  ["#0a0", "#5f5"],
  ["#0aa", "#5ff"],
  ["#a00", "#f55"],
  ["#a0a", "#f5f"],
  ["#aa0", "#ff5"]
];

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
  const [dragOffset, setDragOffset] = React.useState<{ x: number; y: number; } | undefined>(undefined);
  const notes = indexedFilter(events, (event): event is NoteEvent => event.type === -1);
  const selectedNote = (event => event?.type === -1 ? event : undefined)(events[selectedIndex]);
  const onDrag = useThrottleCallback((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (selectedNote && dragOffset) {
      event.preventDefault();
      const bounds = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - bounds.x - dragOffset.x;
      const y = event.clientY - bounds.y - dragOffset.y;
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
  });
  return <div className="notes-editor" {...props}>
    <div className="notes-edit-buttons">
      <AddButton onClick={() => onChange([...events, newEvent(-1, 0)], events.length)} />
      {selectedNote && <RemoveButton onClick={() => onChange([...events.slice(0, selectedIndex), ...events.slice(selectedIndex + 1)], 0)} />}
    </div>
    <div className="notes-edit-region"
      style={{
        width: trackLength,
        height: 128 * noteHeight
      }}
      onMouseMove={onDrag}
      onMouseUp={() => setDragOffset(undefined)}
      onMouseLeave={() => setDragOffset(undefined)}>
      {notes.map(({ value, index }) => {
        const selected = selectedIndex === index;
        return <div key={index} className="note"
          style={{
            left: value.delta,
            top: noteHeight * value.note,
            width: value.duration,
            height: noteHeight,
            backgroundColor: colors[value.channel % colors.length][+selected]
          }}
          onMouseDown={event => {
            onChange(events, index);
            const bounds = event.currentTarget.getBoundingClientRect();
            setDragOffset({ x: event.clientX - bounds.x, y: event.clientY - bounds.y });
          }} />;
      })}
    </div>
  </div>;
}
