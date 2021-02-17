import * as React from "react";
import { Track } from "../common/midi";
import EventList from "./event-list";
import { getEventProperties } from "./events";
import NotesViewer from "./notes-viewer";
import { PropertiesEditor } from "./properties-editor";
import SplitView from "./split-view";

export interface EventsEditorProps {
  track: Track;
  selectedIndex: number;
  onSelect: (index: number) => void;
  onChange: (track: Track) => void;
}

export default function EventsEditor({ track, selectedIndex, onSelect, onChange }: EventsEditorProps): JSX.Element {
  return <SplitView className="events-editor"
    direction="vertical"
    first={<NotesViewer track={track} visibleChannels={new Array(16).fill(true)} />}
    second={<SplitView className="event-list-container"
      direction="horizontal"
      first={<EventList track={track} selectedIndex={selectedIndex} onSelect={onSelect} onChange={onChange} />}
      second={<PropertiesEditor className="event-properties" properties={getEventProperties(track[selectedIndex], event => onChange([...track.slice(0, selectedIndex), event, ...track.slice(selectedIndex + 1)]))} />} />} />;
}
