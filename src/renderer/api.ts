import type { IpcRendererEvent } from "electron";
import type { Midi } from "../common/midi";
import type { OpenResult, SaveResult } from "../main/remote";

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

export const api = (window as unknown as { api: Api; }).api;
