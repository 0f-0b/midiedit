import React from "react";
import {
  newTrack,
  type TextEvent,
  type Track,
} from "../../../shared/src/midi.ts";
import { inflect } from "../inflection.ts";
import { List } from "./list.tsx";
import classes from "./track_list.module.css";

export interface TrackListProps {
  tracks: Track[];
  selectedIndex: number;
  multiTrack: boolean;
  onSelect: (index: number) => void;
  onChange: (tracks: Track[], selectedIndex: number) => void;
}

export function TrackList(
  { tracks, selectedIndex, multiTrack, onSelect, onChange }: TrackListProps,
): JSX.Element {
  return (
    <List
      rowCount={tracks.length}
      rowRenderer={(index) => {
        const track = tracks[index];
        const trackName = track.find((event) =>
          event.type === "text" && event.subtype === 2
        ) as TextEvent | undefined;
        return (
          <div className={classes.track}>
            <div className={classes.trackName}>
              {trackName ? trackName.text : "(Unnamed)"}
            </div>
            <div>
              {`#${index}, ${inflect(track.length, "event", "events")}`}
            </div>
          </div>
        );
      }}
      selectedIndex={selectedIndex}
      canAppend={multiTrack}
      canInsert={multiTrack}
      canRemove={tracks.length > 1}
      onSelect={(index) => onSelect(index)}
      onAdd={(index) => onChange(tracks.toSpliced(index, 0, newTrack()), index)}
      onRemove={(index) =>
        onChange(
          tracks.toSpliced(index, 1),
          selectedIndex >= index && selectedIndex > 0
            ? selectedIndex - 1
            : selectedIndex,
        )}
    />
  );
}
