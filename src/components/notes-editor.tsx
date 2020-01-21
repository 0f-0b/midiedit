import * as React from "react";
import { ComponentPropsWithoutRef, ReactNode } from "react";
import { NoteEvent, Track } from "../midi";
import { mergeClass } from "./props";

const colors = [
  ["#5555ff", "#aaaaff"],
  ["#55ff55", "#aaffaa"],
  ["#55ffff", "#aaffff"],
  ["#ff5555", "#ffaaaa"],
  ["#ff55ff", "#ffaaff"],
  ["#ffff55", "#ffffaa"]
];
const noteHeight = 8;

function getBounds(note: NoteEvent): {
  left: number;
  top: number;
  width: number;
  height: number;
} {
  return {
    left: note.delta,
    top: noteHeight * (127 - note.note),
    width: note.duration,
    height: noteHeight
  };
}

export interface NotesEditorProps extends Omit<ComponentPropsWithoutRef<"div">, "onSelect"> {
  track: Track;
  selectedIndex: number;
  onSelect: (index: number) => void;
  onAdd: () => void;
  onDelete: (index: number) => void;
}

export default class NotesEditor extends React.Component<NotesEditorProps> {
  public render(): ReactNode {
    const { track, selectedIndex, onSelect, onAdd, onDelete, className, ...props } = this.props;
    const notes: [NoteEvent, number][] = track.events
      .map((event, index) => [event, index] as [NoteEvent, number])
      .filter(([event]) => event.type === -1);
    const selectedEvent = track.events[selectedIndex];
    const selectedNote = selectedEvent?.type === -1 ? selectedEvent as NoteEvent : undefined;
    return <div className={mergeClass("notes-editor", className)} {...props}>
      <div className="edit-buttons">
        <button onClick={onAdd}>+</button>
        {selectedNote && <button onClick={() => onDelete(selectedIndex)}>-</button>}
      </div>
      <div style={{
        width: length,
        height: 128 * noteHeight
      }}>
        {notes.map(([note, index]) => <div key={index} className={"note"}
          style={{
            ...getBounds(note),
            backgroundColor: colors[note.channel % colors.length][0]
          }}
          onClick={() => onSelect(index)} />)}
        {selectedNote && <div className="note selected"
          style={{
            ...getBounds(selectedNote),
            borderColor: colors[selectedNote.channel % colors.length][1]
          }} />}
      </div>
    </div>;
  }
}
