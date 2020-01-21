import * as React from "react";
import { ReactNode } from "react";
import { emptyEvent, eventProperties } from "../events";
import { Track } from "../midi";
import EventList from "./event-list";
import NotesEditor from "./notes-editor";
import PropertiesEditor from "./properties-editor";
import { mergeClass } from "./props";
import SplitPane, { SplitPaneProps } from "./split-pane";

export interface TrackEditorProps extends Omit<SplitPaneProps, "direction" | "first" | "second" | "onSelect"> {
  track: Track;
  selectedIndex: number;
  onSelect: (index: number) => void;
  onChange: () => void;
}

export default class TrackEditor extends React.Component<TrackEditorProps> {
  public constructor(props: TrackEditorProps) {
    super(props);
  }

  public render(): ReactNode {
    const { track, selectedIndex, onSelect, onChange, className, ...props } = this.props;
    return <SplitPane className={mergeClass("track-editor", className)}
      direction="column"
      first={<NotesEditor track={track}
        selectedIndex={selectedIndex}
        onSelect={onSelect}
        onAdd={() => {
          track.events.push(emptyEvent(-1, 0));
          onSelect(track.events.length);
          onChange();
        }}
        onDelete={index => {
          track.events.splice(index, 1);
          onSelect(0);
          onChange();
        }} />}
      second={<SplitPane
        first={<EventList events={track.events}
          selectedIndex={selectedIndex}
          onSelect={onSelect}
          onAdd={(index, selectedIndex) => {
            track.events.splice(index, 0, emptyEvent(-1, 0));
            onSelect(selectedIndex);
            onChange();
          }}
          onDelete={(index, selectedIndex) => {
            track.events.splice(index, 1);
            onSelect(selectedIndex);
            onChange();
          }} />}
        second={<PropertiesEditor keyPrefix={selectedIndex.toString()} properties={track.events.length
          ? eventProperties(track.events[selectedIndex], event => {
            track.events[selectedIndex] = event;
            onChange();
          }, track.length) : []} />}
        {...props} />} />;
  }
}
