import { type IpcRendererEvent, contextBridge, ipcRenderer } from "electron";
import type { Midi } from "../../../src/midi";
import type { OpenResult, SaveResult } from "../../main/src/remote";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IpcListener = (event: IpcRendererEvent, ...args: any[]) => void;

export interface Api {
  ready(): void;
  updateState(filePath: string | undefined, dirty: boolean): void;
  addIpcListener(channel: string, listener: IpcListener): void;
  removeIpcListener(channel: string, listener: IpcListener): void;
  openFile(filePath: string | undefined): Promise<OpenResult | null>;
  saveFile(filePath: string | undefined, midi: Midi): Promise<SaveResult | null>;
  askSave(filePath: string | undefined, midi: Midi): Promise<SaveResult | null>;
  exportJson(midi: Midi): Promise<void>;
}

const api: Api = {
  ready() {
    ipcRenderer.send("ready");
  },
  updateState(filePath, dirty) {
    ipcRenderer.send("update-state", filePath, dirty);
  },
  addIpcListener(channel, listener) {
    ipcRenderer.addListener(channel, listener);
  },
  removeIpcListener(channel, listener) {
    ipcRenderer.removeListener(channel, listener);
  },
  openFile(filePath) {
    return ipcRenderer.invoke("open-file", filePath);
  },
  saveFile(filePath, midi) {
    return ipcRenderer.invoke("save-file", filePath, midi);
  },
  askSave(filePath, midi) {
    return ipcRenderer.invoke("ask-save", filePath, midi);
  },
  exportJson(midi) {
    return ipcRenderer.invoke("export-json", midi);
  }
};
contextBridge.exposeInMainWorld("api", api);
