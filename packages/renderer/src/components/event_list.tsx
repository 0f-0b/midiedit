import React, { useMemo } from "react";
import type { Track } from "../../../shared/src/midi.ts";
import { scan } from "../util.ts";
import classes from "./event_list.module.css";
import { getEventName, newTrackEvent } from "./events.ts";
import { List } from "./list.tsx";

export interface EventListProps {
  track: Track;
  selectedIndex: number;
  onSelect: (index: number) => void;
  onChange: (track: Track, selectedIndex: number) => void;
}

export function EventList(
  { track, selectedIndex, onSelect, onChange }: EventListProps,
): JSX.Element {
  const time = useMemo(
    () => scan(track, (time, event) => time + event.delta, 0),
    [track],
  );
  return (
    <List
      rowCount={track.length}
      rowRenderer={(index) => {
        const event = track[index];
        return (
          <div className={classes.event}>
            <div className={classes.eventName}>
              {getEventName(event.type)}
            </div>
            <div>
              {`Delta: ${event.delta}, Time: ${time[index]}`}
            </div>
          </div>
        );
      }}
      selectedIndex={selectedIndex}
      canAppend={false}
      canInsert={true}
      canRemove={(index) => index < track.length - 1}
      onSelect={(index) => onSelect(index)}
      onAdd={(index) =>
        onChange(track.toSpliced(index, 0, newTrackEvent("text", 0)), index)}
      onRemove={(index) =>
        onChange(
          track.toSpliced(index, 1),
          selectedIndex >= index && selectedIndex > 0
            ? selectedIndex - 1
            : selectedIndex,
        )}
    />
  );
}
