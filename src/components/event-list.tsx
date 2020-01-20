import * as React from "react";
import { ReactNode } from "react";
import { nameOfEvent } from "../events";
import { __ } from "../i18n";
import { Event } from "../midi";
import List, { ListProps } from "./list";
import { mergeClass } from "./props";

export interface EventListProps extends Omit<ListProps, "elements" | "notEmpty"> {
  events: Event[];
}

export default class EventList extends React.Component<EventListProps> {
  public render(): ReactNode {
    const { events, className, ...props } = this.props;
    return <List className={mergeClass("event-list", className)}
      elements={events.map(event => <>
        <b>{nameOfEvent(event.type, event.subtype)}</b><br />
        {__("eventDescription", {
          time: event.delta
        })}
      </>)}
      {...props} />;
  }
}
