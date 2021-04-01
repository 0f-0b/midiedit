import * as React from "react";
import type { Track } from "../../../../src/midi";
import EventList from "./event-list";
import { getEventProperties } from "./events";
import classes from "./events-editor.module.css";
import NotesViewer from "./notes-viewer";
import { PropertiesEditor } from "./properties-editor";
import SplitView from "./split-view";

export interface EventsEditorProps {
  track: Track;
  selectedIndex: number;
  onSelect: (index: number) => void;
  onChange: (track: Track, selectedIndex: number) => void;
}

export default function EventsEditor({ track, selectedIndex, onSelect, onChange }: EventsEditorProps): JSX.Element {
  return <SplitView className={classes.eventsEditor} direction="vertical">
    <NotesViewer track={track} />
    <SplitView className={classes.eventListContainer} direction="horizontal">
      <EventList track={track} selectedIndex={selectedIndex} onSelect={onSelect} onChange={onChange} />
      <PropertiesEditor className={classes.eventProperties}
        properties={getEventProperties(track[selectedIndex], event => onChange(
          [...track.slice(0, selectedIndex), event, ...track.slice(selectedIndex + 1)],
          selectedIndex))} />
    </SplitView>
  </SplitView>;
}
