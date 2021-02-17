import * as React from "react";
import { useEffect, useState } from "react";
import { useBeforeunload } from "react-beforeunload";
import * as ReactDOM from "react-dom";
import { newMidi } from "../common/midi";
import { api } from "./api";
import EventsEditor from "./events-editor";
import InsertNotesWindow from "./insert-notes-window";
import Metadata from "./metadata";
import SplitView from "./split-view";
import TrackList from "./track-list";
import useIpc from "./use-ipc";

function App(): JSX.Element {
  const [filePath, setFilePath] = useState<string | undefined>(undefined);
  const [midi, setMidi] = useState(newMidi());
  const [selectedTrack, setSelectedTrack] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState(0);
  const [dirty, setDirty] = useState(false);
  const [insertingNotes, setInsertingNotes] = useState(false);
  useEffect(() => api.ready(), []);
  useEffect(() => api.updateState(filePath, dirty), [filePath, dirty]);
  /* eslint-disable @typescript-eslint/no-misused-promises */
  useIpc("new-file", async () => {
    if (dirty && !await api.askSave(filePath, midi))
      return;
    setSelectedTrack(0);
    setSelectedEvent(0);
    setFilePath(undefined);
    setMidi(newMidi());
    setDirty(false);
  });
  useIpc("open-file", async (_, preferredPath?: string) => {
    if (dirty) {
      const saved = await api.askSave(filePath, midi);
      if (!saved)
        return;
      if (saved.path !== undefined) {
        setFilePath(saved.path);
        setDirty(false);
      }
    }
    const opened = await api.openFile(preferredPath);
    if (!opened)
      return;
    setSelectedTrack(0);
    setSelectedEvent(0);
    setFilePath(opened.path);
    setMidi(opened.midi);
    setDirty(false);
  });
  useIpc("save-file", async () => {
    const saved = await api.saveFile(filePath, midi);
    if (saved) {
      setFilePath(saved.path);
      setDirty(false);
    }
  });
  useIpc("export-json", () => api.exportJson(midi));
  /* eslint-enable @typescript-eslint/no-misused-promises */
  useIpc("insert-notes", () => setInsertingNotes(true));
  useBeforeunload(event => {
    if (dirty) {
      event.preventDefault();
      void (async () => {
        const saved = await api.askSave(filePath, midi);
        if (!saved)
          return;
        setDirty(false);
        window.close();
      })();
    }
  });
  return <>
    <SplitView className="app"
      direction="horizontal"
      first={<SplitView className="side"
        direction="vertical"
        first={<Metadata
          midi={midi}
          onChange={midi => {
            setMidi(midi);
            if (selectedTrack >= midi.tracks.length) {
              setSelectedTrack(0);
              setSelectedEvent(0);
            }
            setDirty(true);
          }} />}
        second={<TrackList
          tracks={midi.tracks}
          selectedIndex={selectedTrack}
          multiTrack={midi.format !== 0}
          onSelect={index => {
            setSelectedTrack(index);
            setSelectedEvent(0);
          }}
          onChange={tracks => {
            setMidi({ ...midi, tracks });
            setDirty(true);
          }} />} />}
      second={<EventsEditor
        track={midi.tracks[selectedTrack]}
        selectedIndex={selectedEvent}
        onSelect={setSelectedEvent}
        onChange={track => {
          setMidi({ ...midi, tracks: [...midi.tracks.slice(0, selectedTrack), track, ...midi.tracks.slice(selectedTrack + 1)] });
          setDirty(true);
        }} />} />
    {insertingNotes && <InsertNotesWindow
      track={midi.tracks[selectedTrack]}
      selectedIndex={selectedEvent}
      onSelect={setSelectedEvent}
      onChange={track => {
        setMidi({ ...midi, tracks: [...midi.tracks.slice(0, selectedTrack), track, ...midi.tracks.slice(selectedTrack + 1)] });
        setDirty(true);
      }}
      onUnload={() => setInsertingNotes(false)} />}
  </>;
}

ReactDOM.render(<App />, document.getElementById("root"));
