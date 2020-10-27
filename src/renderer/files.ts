import { ipcRenderer } from "electron";
import { Midi } from "../common/midi";
import type { OpenResult, SaveResult } from "../main/files";

export async function openFile(filePath: string | undefined): Promise<OpenResult | null> {
  return ipcRenderer.invoke("open-file", filePath);
}

export async function saveFile(filePath: string | undefined, midi: Midi): Promise<SaveResult | null> {
  return ipcRenderer.invoke("save-file", filePath, midi);
}

export async function askSave(filePath: string | undefined, midi: Midi): Promise<SaveResult | null> {
  return ipcRenderer.invoke("ask-save", filePath, midi);
}
