import { ipcRenderer } from "electron";
import * as React from "react";
import { useEffect, useState } from "react";
import { useBeforeunload } from "react-beforeunload";
import * as ReactDOM from "react-dom";
import { newMidi } from "../common/midi";
import EventsEditor from "./events-editor";
import Metadata from "./metadata";
import { askSave, exportJson, openFile, saveFile } from "./remote";
import SplitView from "./split-view";
import TrackList from "./track-list";
import useIpc from "./use-ipc";

function App(): JSX.Element {
  const [filePath, setFilePath] = useState<string | undefined>(undefined);
  const [midi, setMidi] = useState(newMidi());
  const [selectedTrack, setSelectedTrack] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState(0);
  const [dirty, setDirty] = useState(false);
  useEffect(() => ipcRenderer.send("ready"), []);
  useEffect(() => ipcRenderer.send("update-state", filePath, dirty), [filePath, dirty]);
  useIpc("new-file", async () => {
    if (dirty && !await askSave(filePath, midi))
      return;
    setSelectedTrack(0);
    setSelectedEvent(0);
    setFilePath(undefined);
    setMidi(newMidi());
    setDirty(false);
  });
  useIpc("open-file", async (_, preferredPath?: string) => {
    if (dirty) {
      const saved = await askSave(filePath, midi);
      if (!saved)
        return;
      if (saved.path !== undefined) {
        setFilePath(saved.path);
        setDirty(false);
      }
    }
    const opened = await openFile(preferredPath);
    if (!opened)
      return;
    setSelectedTrack(0);
    setSelectedEvent(0);
    setFilePath(opened.path);
    setMidi(opened.midi);
    setDirty(false);
  });
  useIpc("save-file", async () => {
    const saved = await saveFile(filePath, midi);
    if (saved) {
      setFilePath(saved.path);
      setDirty(false);
    }
  });
  useIpc("export-json", () => exportJson(midi));
  useBeforeunload(event => {
    if (dirty) {
      event.preventDefault();
      askSave(filePath, midi).then(saved => {
        if (!saved)
          return;
        setDirty(false);
        window.close();
      });
    }
  });
  return <SplitView className="app"
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
      onSelect={index => setSelectedEvent(index)}
      onChange={track => {
        setMidi({ ...midi, tracks: [...midi.tracks.slice(0, selectedTrack), track, ...midi.tracks.slice(selectedTrack + 1)] });
        setDirty(true);
      }} />} />;
}

ReactDOM.render(<App />, document.getElementById("root"));
