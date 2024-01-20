import { contextBridge, ipcRenderer } from "electron";
import type { OpenResult, SaveResult } from "../../main/src/remote.ts";
import type { Midi } from "../../shared/src/midi.ts";

export type IpcListener = (...args: unknown[]) => unknown;

export interface Api {
  ready(): undefined;
  updateState(path: string | undefined, dirty: boolean): undefined;
  addIpcListener(channel: string, listener: IpcListener): number;
  removeIpcListener(channel: string, id: number): undefined;
  openFile(path: string | undefined): Promise<OpenResult | null>;
  saveFile(path: string | undefined, midi: Midi): Promise<SaveResult | null>;
  askSave(path: string | undefined, midi: Midi): Promise<SaveResult | null>;
  exportJson(midi: Midi): Promise<undefined>;
}

const listeners = new Map<number, (...args: unknown[]) => unknown>();
let nextListenerId = 0;
const api: Api = {
  ready() {
    ipcRenderer.send("ready");
  },
  updateState(path, dirty) {
    ipcRenderer.send("update-state", path, dirty);
  },
  addIpcListener(channel, listener) {
    const wrapper = (_: unknown, ...args: unknown[]) => listener(...args);
    ipcRenderer.addListener(channel, wrapper);
    const id = nextListenerId++;
    listeners.set(id, wrapper);
    return id;
  },
  removeIpcListener(channel, id) {
    const wrapper = listeners.get(id);
    if (!wrapper) {
      throw new TypeError(`Listener #${id} does not exist`);
    }
    listeners.delete(id);
    ipcRenderer.removeListener(channel, wrapper);
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
