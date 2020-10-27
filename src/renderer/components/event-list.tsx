import * as React from "react";
import { Event } from "../../common/midi";
import { getEventName, newEvent } from "../events";
import List, { ListProps } from "./list";

export interface EventListProps extends Omit<ListProps, "className" | "onChange" | "elements" | "notEmpty" | "onSelect" | "onAdd" | "onDelete"> {
  events: Event[];
  onChange: (events: Event[], selectedIndex: number) => void;
}

export default function EventList({ events, onChange, ...props }: EventListProps): JSX.Element {
  return <List className="event-list"
    elements={events.map(event => <>
      <b>{getEventName(event.type, event.subtype)}</b><br />
      Time: {event.delta}
    </>)}
    onSelect={index => onChange(events, index)}
    onAdd={(index, selectedIndex) => onChange([...events.slice(0, index), newEvent(-1, 0), ...events.slice(index)], selectedIndex)}
    onDelete={(index, selectedIndex) => onChange([...events.slice(0, index), ...events.slice(index + 1)], selectedIndex)}
    {...props} />;
}
