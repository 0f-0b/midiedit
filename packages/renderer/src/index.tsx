import React, { useEffect, useState } from "react";
import { useBeforeunload } from "react-beforeunload";
import { newMidi } from "../../shared/src/midi.ts";
import { api } from "./api.ts";
import { EventsEditor } from "./components/events_editor.tsx";
import { InsertNotesWindow } from "./components/insert_notes_window.tsx";
import { Metadata } from "./components/metadata.tsx";
import { TrackList } from "./components/track_list.tsx";
import classes from "./index.module.css";
import { useIpc } from "./use_ipc.ts";
import { useUndoable } from "./use_undoable.ts";

export function Index(): JSX.Element {
  const [filePath, setFilePath] = useState<string | undefined>(undefined);
  const [
    { midi, selectedTrack, selectedEvent },
    setState,
    replaceState,
    resetState,
    undo,
    redo,
  ] = useUndoable(() => ({
    midi: newMidi(),
    selectedTrack: 0,
    selectedEvent: 0,
  }));
  const [persisted, setPersisted] = useState(midi);
  const [showInsertNotes, setShowInsertNotes] = useState(false);
  const [exiting, setExiting] = useState(false);
  const dirty = midi !== persisted;
  useEffect(() => api.ready(), []);
  useEffect(() => api.updateState(filePath, dirty), [filePath, dirty]);
  useIpc("new-file", async () => {
    if (dirty && !await api.askSave(filePath, midi)) {
      return;
    }
    setFilePath(undefined);
    const root = newMidi();
    resetState({
      midi: root,
      selectedTrack: 0,
      selectedEvent: 0,
    });
    setPersisted(root);
  });
  useIpc("open-file", async (preferredPath) => {
    if (!(preferredPath === undefined || typeof preferredPath === "string")) {
      throw new TypeError("preferredPath must be a string or undefined");
    }
    if (dirty) {
      const result = await api.askSave(filePath, midi);
      if (!result) {
        return;
      }
      if (result.path !== undefined) {
        setFilePath(result.path);
        setPersisted(midi);
      }
    }
    const result = await api.openFile(preferredPath);
    if (!result) {
      return;
    }
    setFilePath(result.path);
    const root = result.midi;
    resetState({
      midi: root,
      selectedTrack: 0,
      selectedEvent: 0,
    });
    setPersisted(root);
  });
  useIpc("save-file", async () => {
    const result = await api.saveFile(filePath, midi);
    if (result) {
      setFilePath(result.path);
      setPersisted(midi);
    }
  });
  useIpc("export-json", () => api.exportJson(midi));
  useIpc("undo", () => undo?.());
  useIpc("redo", () => redo?.());
  useIpc("insert-notes", () => setShowInsertNotes(!showInsertNotes));
  useBeforeunload((event) => {
    if (dirty && !exiting) {
      event.preventDefault();
      void (async () => {
        const result = await api.askSave(filePath, midi);
        if (!result) {
          return;
        }
        setExiting(true);
      })();
    }
  });
  useEffect(() => {
    if (exiting) {
      close();
    }
  }, [exiting]);
  return (
    <>
      <div className={classes.app}>
        <div className={classes.side}>
          <div className={classes.metadataWrapper}>
            <Metadata
              midi={midi}
              onChange={(midi) =>
                setState({
                  midi,
                  selectedTrack: selectedTrack < midi.tracks.length
                    ? selectedTrack
                    : 0,
                  selectedEvent: selectedTrack < midi.tracks.length
                    ? selectedEvent
                    : 0,
                })}
            />
          </div>
          <TrackList
            tracks={midi.tracks}
            selectedIndex={selectedTrack}
            multiTrack={midi.format !== 0}
            onSelect={(index) =>
              replaceState({
                midi,
                selectedTrack: index,
                selectedEvent: 0,
              })}
            onChange={(tracks, selectedIndex) =>
              setState({
                midi: { ...midi, tracks },
                selectedTrack: selectedIndex,
                selectedEvent:
                  midi.tracks[selectedTrack] === tracks[selectedIndex]
                    ? selectedEvent
                    : 0,
              })}
          />
        </div>
        <EventsEditor
          track={midi.tracks[selectedTrack]}
          ticksPerBeat={midi.division.type === 0
            ? midi.division.ticksPerBeat
            : null}
          selectedIndex={selectedEvent}
          onSelect={(index) =>
            replaceState({
              midi,
              selectedTrack,
              selectedEvent: index,
            })}
          onChange={(track, selectedIndex) =>
            setState({
              midi: { ...midi, tracks: midi.tracks.with(selectedTrack, track) },
              selectedTrack,
              selectedEvent: selectedIndex,
            })}
        />
      </div>
      {showInsertNotes && (
        <InsertNotesWindow
          track={midi.tracks[selectedTrack]}
          selectedIndex={selectedEvent}
          onChange={(track, selectedIndex) =>
            setState({
              midi: { ...midi, tracks: midi.tracks.with(selectedTrack, track) },
              selectedTrack,
              selectedEvent: selectedIndex,
            })}
          onUnload={() => setShowInsertNotes(false)}
        />
      )}
    </>
  );
}
