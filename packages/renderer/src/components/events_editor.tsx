/// <reference types="../../types/array.with.d.ts" />
import React from "react";
import type { Track } from "../../../shared/src/midi.ts";
import { EventList } from "./event_list.tsx";
import { getEventProperties } from "./events.ts";
import classes from "./events_editor.module.css";
import { NotesViewer } from "./notes_viewer.tsx";
import { PropertiesEditor } from "./properties_editor.tsx";
import { SplitView } from "./split_view.tsx";

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
          properties={getEventProperties(
            track[selectedIndex],
            (event) =>
              onChange(track.with(selectedIndex, event), selectedIndex),
          )}
        />
      </SplitView>
    </SplitView>
  );
}
