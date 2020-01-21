import * as React from "react";
import { ReactNode } from "react";
import { __ } from "../i18n";
import { Track } from "../midi";
import IntegerInput from "./input/integer";
import TextInput from "./input/text";
import List, { ListProps } from "./list";
import { mergeClass } from "./props";

export interface TrackListProps extends Omit<ListProps, "elements" | "notEmpty" | "onChange"> {
  tracks: Track[];
  onChange: (index: number) => void;
}

export default class TrackList extends React.Component<TrackListProps> {
  public render(): ReactNode {
    const { tracks, onChange, className, ...props } = this.props;
    return <List className={mergeClass("track-list", className)}
      elements={tracks.map((track, index) => <>
        <TextInput placeholder={__("unnamedTrack")} size={20} value={track.name}
          onChange={value => {
            track.name = value;
            onChange(index);
          }} /><br />
        {__("trackDescription", {
          id: index + 1,
          eventCount: track.events.length
        })}<br />
        <label>
          {__("trackLength")}
          <IntegerInput className="track-list-length" value={track.length} min={1}
            onChange={value => {
              track.length = value;
              let i = 0;
              for (const event of track.events) {
                if (event.delta > value) continue;
                if (event.type === -1) {
                  const maxDuration = value - event.delta;
                  if (maxDuration <= 0) continue;
                  if (event.duration > maxDuration) event.duration = maxDuration;
                }
                track.events[i++] = event;
              }
              track.events.length = i;
              onChange(index);
            }} />
        </label>
      </>)}
      notEmpty
      {...props} />;
  }
}
