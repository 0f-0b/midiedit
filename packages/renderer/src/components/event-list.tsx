import * as React from "react";
import { useMemo } from "react";
import type { Track } from "../../../../src/midi";
import { scan } from "../util";
import { getEventName, newTrackEvent } from "./events";
import List from "./list";

export interface EventListProps {
  track: Track;
  selectedIndex: number;
  onSelect: (index: number) => void;
  onChange: (track: Track, selectedIndex: number) => void;
}

export default function EventList({ track, selectedIndex, onSelect, onChange }: EventListProps): JSX.Element {
  const time = useMemo(() => scan(track, (time, event) => time + event.delta, 0), [track]);
  return <List
    rowCount={track.length}
    rowHeight={50}
    rowRenderer={index => {
      const event = track[index];
      return <>
        <b>{getEventName(event.type)}</b><br />
        Delta: {event.delta}, Time: {time[index]}
      </>;
    }}
    selectedIndex={selectedIndex}
    canAppend={false}
    canInsert={true}
    canRemove={index => index < track.length - 1}
    onSelect={index => onSelect(index)}
    onAdd={index => onChange(
      [...track.slice(0, index), newTrackEvent("text", 0), ...track.slice(index)],
      index)}
    onRemove={index => onChange(
      [...track.slice(0, index), ...track.slice(index + 1)],
      selectedIndex >= index && selectedIndex > 0 ? selectedIndex - 1 : selectedIndex)} />;
}
