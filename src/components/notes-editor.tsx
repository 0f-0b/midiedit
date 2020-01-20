import * as React from "react";
import { ReactNode } from "react";
import { NoteEvent, Track } from "../midi";
import { HTMLProps, mergeClass } from "./props";

export interface NotesEditorProps extends HTMLProps<HTMLDivElement> {
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
    const noteHeight = 8;
    return <div className={mergeClass("notes-editor", className)} {...props}>
      <div className="edit-buttons">
        <button onClick={onAdd}>+</button>
        <button onClick={() => track.events[selectedIndex]?.type === -1 && onDelete(selectedIndex)}>-</button>
      </div>
      <div style={{
        width: length,
        height: 128 * noteHeight
      }}>{notes.map(([note, index]) => <div key={index} className={selectedIndex === index ? "note selected" : "note"} style={{
        left: note.delta,
        top: noteHeight * (127 - note.note),
        width: note.duration,
        height: noteHeight
      }}
        onClick={() => onSelect(index)} />)}</div>
    </div>;
  }
}
