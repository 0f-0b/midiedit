import * as React from "react";
import { Event, newTrack, Track } from "../../common/midi";
import List, { ListProps } from "./list";
import { PropertiesEditor } from "./properties-editor";
import { StringInput } from "./properties/string-input";

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
            min: 1,
            onChange(value) {
              track.length = value;
              const newEvents: Event[] = [];
              for (const event of track.events) {
                if (event.delta > value)
                  continue;
                if (event.type === -1) {
                  const maxDuration = value - event.delta;
                  if (maxDuration <= 0)
                    continue;
                  if (event.duration > maxDuration)
                    event.duration = maxDuration;
                }
                newEvents.push(event);
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
