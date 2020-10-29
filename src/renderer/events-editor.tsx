import * as React from "react";
import { Event } from "../common/midi";
import EventList from "./event-list";
import { getEventProperties } from "./events";
import NotesEditor from "./notes-editor";
import { PropertiesEditor } from "./properties-editor";
import SplitView, { SplitViewProps } from "./split-view";

export interface TrackEditorProps extends Omit<SplitViewProps, "className" | "direction" | "first" | "second" | "onChange"> {
  trackLength: number;
  events: Event[];
  selectedIndex: number;
  onChange: (events: Event[], selectedIndex: number) => void;
}

export default function EventsEditor({ trackLength, events, selectedIndex, onChange, ...props }: TrackEditorProps): JSX.Element {
  return <SplitView className="events-editor"
    direction="vertical"
    first={<NotesEditor trackLength={trackLength} events={events} selectedIndex={selectedIndex} onChange={onChange} />}
    second={<SplitView className="event-list-container"
      direction="horizontal"
      first={<EventList events={events} selectedIndex={selectedIndex} onChange={onChange} />}
      second={<PropertiesEditor className="event-properties" properties={getEventProperties(events[selectedIndex], event => onChange([
        ...events.slice(0, selectedIndex),
        event,
        ...events.slice(selectedIndex + 1)
      ], selectedIndex), trackLength)} />} />}
    {...props} />;
}
