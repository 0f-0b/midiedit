import { type BrowserWindow, type FileFilter, app, dialog } from "electron";
import fs from "fs/promises";
import path from "path";
import type { Midi } from "../../../src/midi";
import { readMidi, writeMidi } from "./midi-io";

const midiFilters: FileFilter[] = [
  { name: "Standard MIDI File", extensions: ["mid", "midi"] },
  { name: "All Files", extensions: ["*"] }
];
const jsonFilters: FileFilter[] = [
  { name: "JSON File", extensions: ["json"] },
  { name: "All Files", extensions: ["*"] }
];

export interface OpenResult {
  path: string;
  midi: Midi;
}

export interface SaveResult {
  path: string | undefined;
}

export async function openFile(window: BrowserWindow, filePath: string | undefined): Promise<OpenResult | null> {
  filePath ??= (await dialog.showOpenDialog(window, { properties: ["openFile"], filters: midiFilters })).filePaths[0];
  if (!filePath)
    return null;
  let midi: Midi;
  try {
    midi = readMidi(await fs.readFile(filePath));
  } catch (e) {
    await dialog.showMessageBox(window, {
      type: "error",
      message: `Failed to open ${path.basename(filePath)}`,
      detail: String(e)
    });
    return null;
  }
  app.addRecentDocument(filePath);
  return { path: filePath, midi };
}

export async function saveFile(window: BrowserWindow, filePath: string | undefined, midi: Midi): Promise<SaveResult | null> {
  filePath ??= (await dialog.showSaveDialog(window, { filters: midiFilters })).filePath;
  if (!filePath)
    return null;
  try {
    await fs.writeFile(filePath, new Uint8Array(writeMidi(midi)));
  } catch (e) {
    await dialog.showMessageBox(window, {
      type: "error",
      message: `Failed to save ${path.basename(filePath)}`,
      detail: String(e)
    });
    return null;
  }
  app.addRecentDocument(filePath);
  return { path: filePath };
}

export async function askSave(window: BrowserWindow, filePath: string | undefined, midi: Midi): Promise<SaveResult | null> {
  switch ((await dialog.showMessageBox(window, {
    type: "warning",
    message: `Do you want to save the changes you made to ${filePath === undefined ? "this file" : path.basename(filePath)}?`,
    detail: "Your changes will be lost if you don't save them.",
    buttons: ["Save", "Cancel", "Don't Save"],
    defaultId: 0,
    cancelId: 1,
    noLink: true
  })).response) {
    case 0:
      return await saveFile(window, filePath, midi);
    case 2:
      return { path: undefined };
    default:
      return null;
  }
}

export async function exportJson(window: BrowserWindow, midi: Midi): Promise<void> {
  const filePath = (await dialog.showSaveDialog(window, { filters: jsonFilters })).filePath;
  if (!filePath)
    return;
  try {
    await fs.writeFile(filePath, JSON.stringify(midi, (_, value: unknown) => value instanceof Uint8Array ? String.fromCharCode(...value) : value, 2) + "\n");
  } catch (e) {
    await dialog.showMessageBox(window, {
      type: "error",
      message: `Failed to export to ${path.basename(filePath)}`,
      detail: String(e)
    });
  }
}
