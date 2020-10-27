import { ipcRenderer } from "electron";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { newMidi } from "../common/midi";
import EventsEditor from "./components/events-editor";
import { PropertiesEditor } from "./components/properties-editor";
import SplitPane from "./components/split-pane";
import TrackList from "./components/track-list";
import { askSave, openFile, saveFile } from "./files";

function App(): JSX.Element {
  const [filePath, setFilePath] = React.useState<string | undefined>(undefined);
  const [midi, setMidi] = React.useState(newMidi());
  const [selectedTrack, setSelectedTrack] = React.useState(0);
  const [selectedEvent, setSelectedEvent] = React.useState(0);
  const [dirty, setDirty] = React.useState(false);
  React.useEffect(() => ipcRenderer.send("ready"), []);
  React.useEffect(() => ipcRenderer.send("update-state", filePath, dirty), [filePath, dirty]);
  React.useEffect(() => {
    ipcRenderer.on("new-file", async () => {
      if (dirty && !await askSave(filePath, midi))
        return;
      setFilePath(undefined);
      setMidi(newMidi());
      setSelectedTrack(0);
      setSelectedEvent(0);
      setDirty(false);
    });
    ipcRenderer.on("open-file", async (_, preferredPath?: string) => {
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
      setFilePath(opened.path);
      setMidi(opened.midi);
      setSelectedTrack(0);
      setSelectedEvent(0);
      setDirty(false);
    });
    ipcRenderer.on("save-file", async () => {
      const saved = await saveFile(filePath, midi);
      if (saved) {
        setFilePath(saved.path);
        setDirty(false);
      }
    });
    return () => {
      ipcRenderer.removeAllListeners("new-file");
      ipcRenderer.removeAllListeners("open-file");
      ipcRenderer.removeAllListeners("save-file");
    };
  }, [filePath, midi, dirty]);
  return <SplitPane className="main-split"
    first={<>
      <PropertiesEditor className="metadata"
        properties={{
          ticksPerBeat: {
            type: "integer",
            label: "Ticks per beat: ",
            value: midi.ticksPerBeat,
            min: 1,
            max: 32767,
            onChange(value) {
              setMidi({ ...midi, ticksPerBeat: value });
              setDirty(true);
            }
          }
        }} />
      <TrackList tracks={midi.tracks} selectedIndex={selectedTrack}
        onChange={(tracks, selectedIndex) => {
          if (selectedTrack !== selectedIndex) {
            setSelectedTrack(selectedIndex);
            setSelectedEvent(0);
          }
          setMidi({ ...midi, tracks });
          setDirty(true);
        }} />
    </>}
    second={<EventsEditor
      trackLength={midi.tracks[selectedTrack].length}
      events={midi.tracks[selectedTrack].events}
      selectedIndex={selectedEvent}
      onChange={(events, selectedIndex) => {
        setMidi({
          ...midi,
          tracks: [
            ...midi.tracks.slice(0, selectedTrack),
            { ...midi.tracks[selectedTrack], events },
            ...midi.tracks.slice(selectedTrack + 1)
          ]
        });
        setSelectedEvent(selectedIndex);
        setDirty(true);
      }} />} />;
}

ReactDOM.render(<App />, document.getElementById("root"));
