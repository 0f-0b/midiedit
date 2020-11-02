import * as React from "react";
import { newTrack, TextEvent, Track } from "../common/midi";
import List from "./list";

export interface TrackListProps {
  tracks: Track[];
  selectedIndex: number;
  multiTrack: boolean;
  onChange: (tracks: Track[], selectedIndex: number) => void;
}

export default function TrackList({ tracks, selectedIndex, multiTrack, onChange }: TrackListProps): JSX.Element {
  return <List
    rowCount={tracks.length}
    rowHeight={50}
    rowRenderer={index => {
      const track = tracks[index];
      const trackName = track.find(event => event.type === "text" && event.subtype === 2) as TextEvent | undefined;
      return <>
        <b className="track-name">{trackName?.text ?? "(Unnamed)"}</b>
        {`#${index}, ${track.length} ${track.length === 1 ? "event" : "events"}`}
      </>;
    }}
    selectedIndex={selectedIndex}
    canAppend={multiTrack}
    canInsert={() => multiTrack}
    canRemove={() => multiTrack && tracks.length > 1}
    onSelect={index => onChange(tracks, index)}
    onAdd={(index, selectedIndex) => onChange([...tracks.slice(0, index), newTrack(), ...tracks.slice(index)], selectedIndex)}
    onRemove={(index, selectedIndex) => onChange([...tracks.slice(0, index), ...tracks.slice(index + 1)], selectedIndex)} />;
}
