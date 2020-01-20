import * as React from "react";
import { ReactNode } from "react";
import { emptyEvent, eventProperties } from "../events";
import { Track } from "../midi";
import EventList from "./event-list";
import NotesEditor from "./notes-editor";
import PropertiesEditor from "./properties-editor";
import { mergeClass } from "./props";
import SplitPane, { SplitPaneProps } from "./split-pane";

export interface TrackEditorProps extends Omit<SplitPaneProps, "direction" | "first" | "second"> {
  track: Track;
  onUpdate: () => void;
}

export interface TrackEditorState {
  selectedIndex: number;
}

export default class TrackEditor extends React.Component<TrackEditorProps, TrackEditorState> {
  public constructor(props: TrackEditorProps) {
    super(props);
    this.state = { selectedIndex: 0 };
  }

  public render(): ReactNode {
    const { track, onUpdate, className, ...props } = this.props;
    const { selectedIndex } = this.state;
    return <SplitPane className={mergeClass("track-editor", className)}
      direction="column"
      first={<NotesEditor track={track}
        selectedIndex={selectedIndex}
        onSelect={index => this.setState({ selectedIndex: index })}
        onAdd={() => {
          this.setState({ selectedIndex: track.events.length });
          track.events.push(emptyEvent(-1, 0));
        }}
        onDelete={index => {
          this.setState({ selectedIndex: 0 });
          track.events.splice(index, 1);
        }} />}
      second={<SplitPane
        first={<EventList events={track.events}
          selectedIndex={selectedIndex}
          onSelect={index => this.setState({ selectedIndex: index })}
          onAdd={(index, selectedIndex) => {
            track.events.splice(index, 0, emptyEvent(-1, 0));
            this.setState({ selectedIndex });
            onUpdate();
          }}
          onDelete={(index, selectedIndex) => {
            track.events.splice(index, 1);
            this.setState({ selectedIndex });
            onUpdate();
          }} />}
        second={<PropertiesEditor properties={selectedIndex in track.events
          ? eventProperties(track.events[selectedIndex], event => {
            track.events[selectedIndex] = event;
            this.setState({ selectedIndex });
            onUpdate();
          }, track.length)
          : []} />}
        {...props} />} />;
  }

  public componentDidUpdate(prevProps: Readonly<TrackEditorProps>, prevState: Readonly<TrackEditorState>): void {
    if (prevProps.track !== this.props.track) this.setState({ selectedIndex: 0 });
  }
}
