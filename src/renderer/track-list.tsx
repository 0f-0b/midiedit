import * as React from "react";
import { Event, newTrack, Track } from "../common/midi";
import { StringInput } from "./inputs/string-input";
import List, { ListProps } from "./list";
import { PropertiesEditor } from "./properties-editor";

function limitTime(event: Event, trackLength: number): Event | null {
  if (event.delta > trackLength)
    return null;
  if (event.type === -1) {
    const maxDuration = trackLength - event.delta;
    if (maxDuration === 0)
      return null;
    if (event.duration > maxDuration)
      return {
        ...event,
        duration: maxDuration
      };
  }
  return event;
}

export interface TrackListProps extends Omit<ListProps, "className" | "onChange" | "elements" | "notEmpty" | "onSelect" | "onAdd" | "onDelete"> {
  tracks: Track[];
  onChange: (tracks: Track[], selectedIndex: number) => void;
}

export default function TrackList({ tracks, onChange, ...props }: TrackListProps): JSX.Element {
  return <List className="track-list"
    elements={tracks.map((track, index) => <>
      <StringInput value={track.name} placeholder="Unnamed" size={20}
        onChange={value => onChange([
          ...tracks.slice(0, index),
          { ...track, name: value },
          ...tracks.slice(index + 1)
        ], index)} /><br />
      {`#${index}, ${track.events.length} ${track.events.length === 1 ? "event" : "events"}`}<br />
      <PropertiesEditor className="track-properties"
        properties={{
          length: {
            type: "integer",
            label: "Length: ",
            value: track.length,
            min: 0,
            onChange(value) {
              track.length = value;
              const newEvents: Event[] = [];
              for (const event of track.events) {
                const newEvent = limitTime(event, value);
                if (newEvent)
                  newEvents.push(newEvent);
              }
              onChange([
                ...tracks.slice(0, index),
                { ...track, length: value, events: newEvents },
                ...tracks.slice(index + 1)
              ], index);
            }
          }
        }} />
    </>)}
    notEmpty
    onSelect={index => onChange(tracks, index)}
    onAdd={(index, selectedIndex) => onChange([...tracks.slice(0, index), newTrack(Math.max(1, ...tracks.map(track => track.length))), ...tracks.slice(index)], selectedIndex)}
    onDelete={(index, selectedIndex) => onChange([...tracks.slice(0, index), ...tracks.slice(index + 1)], selectedIndex)}
    {...props} />;
}
