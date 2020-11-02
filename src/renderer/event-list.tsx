import * as React from "react";
import { Track } from "../common/midi";
import { getEventName, newTrackEvent } from "./events";
import List from "./list";

export interface EventListProps {
  track: Track;
  selectedIndex: number;
  onChange: (track: Track, selectedIndex: number) => void;
}

export default function EventList({ track, selectedIndex, onChange }: EventListProps): JSX.Element {
  return <List
    rowCount={track.length}
    rowHeight={50}
    rowRenderer={index => {
      const event = track[index];
      return <>
        <b>{getEventName(event.type)}</b><br />
        {`Delta: ${event.delta}`}
      </>;
    }}
    selectedIndex={selectedIndex}
    canAppend={false}
    canInsert={() => true}
    canRemove={index => index < track.length - 1}
    onSelect={index => onChange(track, index)}
    onAdd={(index, selectedIndex) => onChange([...track.slice(0, index), newTrackEvent("text", 0), ...track.slice(index)], selectedIndex)}
    onRemove={(index, selectedIndex) => onChange([...track.slice(0, index), ...track.slice(index + 1)], selectedIndex)} />;
}
