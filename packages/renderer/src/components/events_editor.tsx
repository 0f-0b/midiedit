import React from "react";
import type { Track } from "../../../shared/src/midi.ts";
import { EventList } from "./event_list.tsx";
import { getEventProperties } from "./events.ts";
import classes from "./events_editor.module.css";
import { NotesViewer } from "./notes_viewer.tsx";
import { PropertiesEditor } from "./properties_editor.tsx";

export interface EventsEditorProps {
  track: Track;
  ticksPerBeat: number | null;
  selectedIndex: number;
  onSelect: (index: number) => void;
  onChange: (track: Track, selectedIndex: number) => void;
}

export function EventsEditor(
  { track, ticksPerBeat, selectedIndex, onSelect, onChange }: EventsEditorProps,
): JSX.Element {
  return (
    <div className={classes.eventsEditor}>
      <NotesViewer track={track} ticksPerBeat={ticksPerBeat} />
      <div className={classes.eventListWrapper}>
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
      </div>
    </div>
  );
}
