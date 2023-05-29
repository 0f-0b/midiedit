import { contextBridge, ipcRenderer, type IpcRendererEvent } from "electron";
import type { OpenResult, SaveResult } from "../../main/src/remote.ts";
import type { Midi } from "../../shared/src/midi.ts";

export type IpcListener = (event: IpcRendererEvent, ...args: never) => unknown;

export interface Api {
  ready(): undefined;
  updateState(path: string | undefined, dirty: boolean): undefined;
  addIpcListener(channel: string, listener: IpcListener): undefined;
  removeIpcListener(channel: string, listener: IpcListener): undefined;
  openFile(path: string | undefined): Promise<OpenResult | null>;
  saveFile(path: string | undefined, midi: Midi): Promise<SaveResult | null>;
  askSave(path: string | undefined, midi: Midi): Promise<SaveResult | null>;
  exportJson(midi: Midi): Promise<undefined>;
}

const api: Api = {
  ready(): undefined {
    ipcRenderer.send("ready");
    return;
  },
  updateState(path, dirty): undefined {
    ipcRenderer.send("update-state", path, dirty);
    return;
  },
  addIpcListener(channel, listener): undefined {
    ipcRenderer.addListener(channel, listener as never);
    return;
  },
  removeIpcListener(channel, listener): undefined {
    ipcRenderer.removeListener(channel, listener as never);
    return;
  },
  openFile(path) {
    return ipcRenderer.invoke("open-file", path);
  },
  saveFile(path, midi) {
    return ipcRenderer.invoke("save-file", path, midi);
  },
  askSave(path, midi) {
    return ipcRenderer.invoke("ask-save", path, midi);
  },
  exportJson(midi) {
    return ipcRenderer.invoke("export-json", midi);
  },
};
contextBridge.exposeInMainWorld("api", api);
