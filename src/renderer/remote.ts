import { ipcRenderer } from "electron";
import { Midi } from "../common/midi";
import type { OpenResult, SaveResult } from "../main/remote";

export function openFile(filePath: string | undefined): Promise<OpenResult | null> {
  return ipcRenderer.invoke("open-file", filePath);
}

export function saveFile(filePath: string | undefined, midi: Midi): Promise<SaveResult | null> {
  return ipcRenderer.invoke("save-file", filePath, midi);
}

export function askSave(filePath: string | undefined, midi: Midi): Promise<SaveResult | null> {
  return ipcRenderer.invoke("ask-save", filePath, midi);
}

export function exportJson(midi: Midi): Promise<void> {
  return ipcRenderer.invoke("export-json", midi);
}
