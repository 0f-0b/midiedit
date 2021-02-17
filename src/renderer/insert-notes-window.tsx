import * as React from "react";
import { useState } from "react";
import NewWindow from "react-new-window";
import { Track } from "../common/midi";
import { PropertiesEditor } from "./properties-editor";

export interface InsertNotesWindowProps {
  track: Track;
  selectedIndex: number;
  onSelect: (index: number) => void;
  onChange: (track: Track) => void;
  onUnload?: () => void;
}

export default function InsertNotesWindow({ track, selectedIndex, onSelect, onChange, onUnload }: InsertNotesWindowProps): JSX.Element {
  const [delta, setDelta] = useState(0);
  const [duration, setDuration] = useState(0);
  const [channel, setChannel] = useState(0);
  const [key, setKey] = useState(60);
  const [attack, setAttack] = useState(64);
  const [release, setRelease] = useState(64);

  function insert() {
    onChange([
      ...track.slice(0, selectedIndex),
      { type: "note-on", channel, key, velocity: attack, delta: delta },
      { type: "note-off", channel, key, velocity: release, delta: duration },
      ...track.slice(selectedIndex)
    ]);
    onSelect(selectedIndex + 2);
  }

  return <NewWindow name="insert-notes" copyStyles onUnload={onUnload}>
    <PropertiesEditor className="properties"
      onKeyDown={event => event.code === "Enter" && insert()}
      properties={{
        delta: {
          type: "integer",
          label: "Delta: ",
          value: delta,
          min: 0,
          onChange(delta) {
            setDelta(delta);
          }
        },
        duration: {
          type: "integer",
          label: "Duration: ",
          value: duration,
          min: 0,
          onChange(duration) {
            setDuration(duration);
          }
        },
        channel: {
          type: "integer",
          label: "Channel: ",
          value: channel,
          min: 0,
          max: 15,
          onChange(channel) {
            setChannel(channel);
          }
        },
        key: {
          type: "integer",
          label: "Key: ",
          value: key,
          min: 0,
          max: 127,
          onChange(key) {
            setKey(key);
          }
        },
        attack: {
          type: "integer",
          label: "Attack: ",
          value: attack,
          min: 0,
          max: 127,
          onChange(attack) {
            setAttack(attack);
          }
        },
        release: {
          type: "integer",
          label: "Release: ",
          value: release,
          min: 0,
          max: 127,
          onChange(release) {
            setRelease(release);
          }
        }
      }} />
    <button className="confirm-button" onClick={insert}>Insert</button>
  </NewWindow>;
}
