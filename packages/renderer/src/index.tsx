import * as React from "react";
import { useEffect, useState } from "react";
import { useBeforeunload } from "react-beforeunload";
import { newMidi } from "../../../src/midi";
import api from "./api";
import EventsEditor from "./components/events-editor";
import InsertNotesWindow from "./components/insert-notes-window";
import Metadata from "./components/metadata";
import SplitView from "./components/split-view";
import TrackList from "./components/track-list";
import classes from "./index.module.css";
import useIpc from "./use-ipc";
import useUndoable from "./use-undoable";

export function Index(): JSX.Element {
  const [filePath, setFilePath] = useState<string | undefined>(undefined);
  const [{ midi, selectedTrack, selectedEvent }, setState, replaceState, resetState, undo, redo] = useUndoable(() => ({
    midi: newMidi(),
    selectedTrack: 0,
    selectedEvent: 0
  }));
  const [persisted, setPersisted] = useState(midi);
  const [showInsertNotes, setShowInsertNotes] = useState(false);
  const dirty = midi !== persisted;
  useEffect(() => api.ready(), []);
  useEffect(() => api.updateState(filePath, dirty), [filePath, dirty]);
  /* eslint-disable @typescript-eslint/no-misused-promises */
  useIpc("new-file", async () => {
    if (dirty && !await api.askSave(filePath, midi))
      return;
    setFilePath(undefined);
    const root = newMidi();
    resetState({
      midi: root,
      selectedTrack: 0,
      selectedEvent: 0
    });
    setPersisted(root);
  });
  useIpc("open-file", async (_, preferredPath?: string) => {
    if (dirty) {
      const saved = await api.askSave(filePath, midi);
      if (!saved)
        return;
      if (saved.path !== undefined) {
        setFilePath(saved.path);
        setPersisted(midi);
      }
    }
    const opened = await api.openFile(preferredPath);
    if (!opened)
      return;
    setFilePath(opened.path);
    const root = opened.midi;
    resetState({
      midi: root,
      selectedTrack: 0,
      selectedEvent: 0
    });
    setPersisted(root);
  });
  useIpc("save-file", async () => {
    const saved = await api.saveFile(filePath, midi);
    if (saved) {
      setFilePath(saved.path);
      setPersisted(midi);
    }
  });
  useIpc("export-json", () => api.exportJson(midi));
  /* eslint-enable @typescript-eslint/no-misused-promises */
  useIpc("undo", () => undo?.());
  useIpc("redo", () => redo?.());
  useIpc("insert-notes", () => setShowInsertNotes(!showInsertNotes));
  useBeforeunload(event => {
    if (dirty) {
      event.preventDefault();
      void (async () => {
        const saved = await api.askSave(filePath, midi);
        if (!saved)
          return;
        setPersisted(midi);
        window.close();
      })();
    }
  });
  return <>
    <SplitView className={classes.app} direction="horizontal">
      <SplitView className={classes.side} direction="vertical">
        <Metadata
          midi={midi}
          onChange={midi => setState({
            midi,
            selectedTrack: selectedTrack < midi.tracks.length ? selectedTrack : 0,
            selectedEvent: selectedTrack < midi.tracks.length ? selectedEvent : 0
          })} />
        <TrackList
          tracks={midi.tracks}
          selectedIndex={selectedTrack}
          multiTrack={midi.format !== 0}
          onSelect={index => replaceState({
            midi,
            selectedTrack: index,
            selectedEvent: 0
          })}
          onChange={(tracks, selectedIndex) => setState({
            midi: { ...midi, tracks },
            selectedTrack: selectedIndex,
            selectedEvent: midi.tracks[selectedTrack] === tracks[selectedIndex] ? selectedEvent : 0
          })} />
      </SplitView>
      <EventsEditor
        track={midi.tracks[selectedTrack]}
        selectedIndex={selectedEvent}
        onSelect={index => replaceState({
          midi,
          selectedTrack,
          selectedEvent: index
        })}
        onChange={(track, selectedIndex) => setState({
          midi: { ...midi, tracks: [...midi.tracks.slice(0, selectedTrack), track, ...midi.tracks.slice(selectedTrack + 1)] },
          selectedTrack,
          selectedEvent: selectedIndex
        })} />
    </SplitView>
    {showInsertNotes && <InsertNotesWindow
      track={midi.tracks[selectedTrack]}
      selectedIndex={selectedEvent}
      onChange={(track, selectedIndex) => setState({
        midi: { ...midi, tracks: [...midi.tracks.slice(0, selectedTrack), track, ...midi.tracks.slice(selectedTrack + 1)] },
        selectedTrack,
        selectedEvent: selectedIndex
      })}
      onUnload={() => setShowInsertNotes(false)} />}
  </>;
}
