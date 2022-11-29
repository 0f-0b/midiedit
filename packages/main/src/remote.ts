import { app, type BrowserWindow, dialog, type FileFilter } from "electron";
import { readFile, writeFile } from "node:fs/promises";
import { basename } from "node:path";
import type { Midi } from "../../../src/midi";
import { readMidi, writeMidi } from "./midi_io";

const midiFilters: FileFilter[] = [
  { name: "Standard MIDI File", extensions: ["mid", "midi"] },
  { name: "All Files", extensions: ["*"] },
];
const jsonFilters: FileFilter[] = [
  { name: "JSON File", extensions: ["json"] },
  { name: "All Files", extensions: ["*"] },
];

export interface OpenResult {
  path: string;
  midi: Midi;
}

export interface SaveResult {
  path: string | undefined;
}

export async function openFile(
  window: BrowserWindow,
  path: string | undefined,
): Promise<OpenResult | null> {
  path ??= (await dialog.showOpenDialog(window, {
    properties: ["openFile"],
    filters: midiFilters,
  })).filePaths[0];
  if (!path) {
    return null;
  }
  let midi: Midi;
  try {
    midi = readMidi(await readFile(path));
  } catch (e) {
    await dialog.showMessageBox(window, {
      type: "error",
      message: `Failed to open ${basename(path)}`,
      detail: String(e),
    });
    return null;
  }
  app.addRecentDocument(path);
  return { path, midi };
}

export async function saveFile(
  window: BrowserWindow,
  path: string | undefined,
  midi: Midi,
): Promise<SaveResult | null> {
  path ??= (await dialog.showSaveDialog(window, {
    filters: midiFilters,
  })).filePath;
  if (!path) {
    return null;
  }
  try {
    await writeFile(path, new Uint8Array(writeMidi(midi)));
  } catch (e) {
    await dialog.showMessageBox(window, {
      type: "error",
      message: `Failed to save ${basename(path)}`,
      detail: String(e),
    });
    return null;
  }
  app.addRecentDocument(path);
  return { path };
}

export async function askSave(
  window: BrowserWindow,
  path: string | undefined,
  midi: Midi,
): Promise<SaveResult | null> {
  const { response } = await dialog.showMessageBox(window, {
    type: "warning",
    message: `Do you want to save the changes you made to ${
      path ? basename(path) : "this file"
    }?`,
    detail: "Your changes will be lost if you don't save them.",
    buttons: ["Save", "Cancel", "Don't Save"],
    defaultId: 0,
    cancelId: 1,
    noLink: true,
  });
  switch (response) {
    case 0:
      return await saveFile(window, path, midi);
    case 2:
      return { path: undefined };
    default:
      return null;
  }
}

export async function exportJson(
  window: BrowserWindow,
  midi: Midi,
): Promise<undefined> {
  const path = (await dialog.showSaveDialog(window, {
    filters: jsonFilters,
  })).filePath;
  if (!path) {
    return;
  }
  try {
    await writeFile(
      path,
      JSON.stringify(
        midi,
        (_, value: unknown) =>
          value instanceof Uint8Array ? String.fromCharCode(...value) : value,
        2,
      ) + "\n",
    );
  } catch (e) {
    await dialog.showMessageBox(window, {
      type: "error",
      message: `Failed to export to ${basename(path)}`,
      detail: String(e),
    });
  }
}
