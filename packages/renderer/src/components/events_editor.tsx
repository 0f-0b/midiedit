import React from "react";
import type { Track } from "../../../shared/src/midi";
import { getEventProperties } from "./events";
import classes from "./events_editor.module.css";
import { EventList } from "./event_list";
import { NotesViewer } from "./notes_viewer";
import { PropertiesEditor } from "./properties_editor";
import { SplitView } from "./split_view";

export interface EventsEditorProps {
  track: Track;
  selectedIndex: number;
  onSelect: (index: number) => void;
  onChange: (track: Track, selectedIndex: number) => void;
}

export function EventsEditor(
  { track, selectedIndex, onSelect, onChange }: EventsEditorProps,
): JSX.Element {
  return (
    <SplitView className={classes.eventsEditor} direction="vertical">
      <NotesViewer track={track} />
      <SplitView className={classes.eventListContainer} direction="horizontal">
        <EventList
          track={track}
          selectedIndex={selectedIndex}
          onSelect={onSelect}
          onChange={onChange}
        />
        <PropertiesEditor
          className={classes.eventProperties}
          properties={getEventProperties(track[selectedIndex], (event) =>
            onChange(
              [
                ...track.slice(0, selectedIndex),
                event,
                ...track.slice(selectedIndex + 1),
              ],
              selectedIndex,
            ))}
        />
      </SplitView>
    </SplitView>
  );
}
