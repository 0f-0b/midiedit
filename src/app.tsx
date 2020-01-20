import { FileFilter, ipcRenderer, remote } from "electron";
import * as path from "path";
import * as React from "react";
import { ReactNode } from "react";
import * as ReactDOM from "react-dom";
import PropertiesEditor, { IntegerProperty } from "./components/properties-editor";
import SplitPane from "./components/split-pane";
import TrackEditor from "./components/track-editor";
import TrackList from "./components/track-list";
import { initLocales, __ } from "./i18n";
import { emptyMIDI, emptyTrack, load, MIDI, save } from "./midi";

const filters: FileFilter[] = [
  { name: "MIDI Music", extensions: ["mid", "midi"] },
  { name: "All Files", extensions: ["*"] }
];

interface AppState {
  filePath: string;
  midi: MIDI;
  selectedTrack: number;
  dirty: boolean;
  error?: string;
}

class App extends React.Component<{}, AppState> {
  public constructor(props: {}) {
    super(props);
    this.saveFile = this.saveFile.bind(this);
    this.state = App.newFile();
    this.componentDidUpdate();
    ipcRenderer.on("new-file", async () => await this.checkDirty() && this.setState(App.newFile()));
    ipcRenderer.on("open-file", async (_, filePath?: string) => await this.checkDirty() && this.setState<never>(await this.openFile(filePath)));
    ipcRenderer.on("save-file", async () => this.setState<never>(await this.saveFile()));
  }

  public static getDerivedStateFromError(error: any): Partial<AppState> {
    return { error: error?.stack ?? String(error) };
  }

  public render(): ReactNode {
    if (this.state.error) return <pre>{this.state.error}</pre>;
    const { midi, selectedTrack } = this.state;
    return <SplitPane className="main-split"
      first={<>
        <PropertiesEditor className="metadata" properties={[
          ["ticksPerBeat", new IntegerProperty(midi.ticksPerBeat, value => {
            midi.ticksPerBeat = value;
            this.setState({ midi, dirty: true });
          }, 1, 32767)],
          ["sequenceNumber", new IntegerProperty(midi.sequenceNumber ?? -1, value => {
            midi.sequenceNumber = value === -1 ? undefined : value;
            this.setState({ midi, dirty: true });
          }, -1, 65536)]
        ]} />
        <TrackList tracks={midi.tracks} selectedIndex={selectedTrack}
          onSelect={selectedTrack => this.setState({ selectedTrack })}
          onChange={() => this.setState({ dirty: true })}
          onAdd={(index, selectedTrack) => {
            midi.tracks.splice(index, 0, emptyTrack());
            this.setState({ midi, selectedTrack, dirty: true });
          }}
          onDelete={(index, selectedTrack) => {
            midi.tracks.splice(index, 1);
            this.setState({ midi, selectedTrack, dirty: true });
          }} />
      </>}
      second={<TrackEditor track={midi.tracks[selectedTrack]}
        onUpdate={() => this.setState({ dirty: true })} />} />;
  }

  public componentDidUpdate(): void {
    const { filePath, dirty } = this.state;
    const title = [remote.app.name];
    if (filePath) title.push(" — " + path.basename(filePath));
    if (dirty) title.push(" *");
    document.title = title.join("");
    ipcRenderer.send("update-state", filePath, dirty);
  }

  public componentDidMount(): void {
    ipcRenderer.send("ready");
  }

  private async checkDirty(): Promise<boolean> {
    const { filePath, dirty } = this.state;
    if (dirty) {
      const response = (await remote.dialog.showMessageBox(remote.getCurrentWindow(), {
        type: "warning",
        message: filePath ? __("saveMessage", { fileName: path.basename(filePath) }) : __("saveMessageNoName"),
        detail: __("saveDetail"),
        buttons: [__("save"), __("cancel"), __("dontSave")],
        defaultId: 0,
        cancelId: 1,
        noLink: true
      })).response;
      return (response === 0 && await this.saveFile() !== null) || response === 2;
    }
    return true;
  }

  private async saveFile(): Promise<Partial<AppState> | null> {
    const filePath = this.state.filePath ||
      (await remote.dialog.showSaveDialog(remote.getCurrentWindow(), { filters })).filePath;
    if (!filePath) return null;
    await save(filePath, this.state.midi);
    remote.app.addRecentDocument(filePath);
    return {
      filePath,
      dirty: false
    };
  }

  private async openFile(filePath?: string): Promise<Partial<AppState> | null> {
    if (!filePath) {
      filePath = (await remote.dialog.showOpenDialog(remote.getCurrentWindow(), { properties: ["openFile"], filters })).filePaths[0];
      if (!filePath) return null;
    }
    try {
      const midi = await load(filePath);
      remote.app.addRecentDocument(filePath);
      return {
        filePath,
        midi,
        selectedTrack: 0,
        dirty: false
      };
    } catch (e) {
      await remote.dialog.showMessageBox(remote.getCurrentWindow(), {
        type: "error",
        message: __("failToOpenMessage", { fileName: path.basename(filePath) }),
        detail: e?.stack ?? e.toString()
      });
      return {};
    }
  }

  private static newFile(): AppState {
    return {
      filePath: "",
      midi: emptyMIDI(),
      selectedTrack: 0,
      dirty: false
    };
  }
}

initLocales().then(() => void ReactDOM.render(<App />, document.getElementById("root")));
