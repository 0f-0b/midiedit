import { app, BrowserWindow, dialog, FileFilter } from "electron";
import { promises as fs } from "fs";
import * as path from "path";
import { Midi, readMidi, writeMidi } from "../common/midi";

const filters: FileFilter[] = [
  { name: "MIDI Music", extensions: ["mid", "midi"] },
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
  filePath ??= (await dialog.showOpenDialog(window, { properties: ["openFile"], filters })).filePaths[0];
  if (!filePath)
    return null;
  try {
    const midi = readMidi(await fs.readFile(filePath));
    app.addRecentDocument(filePath);
    return { path: filePath, midi };
  } catch (e) {
    await dialog.showMessageBox(window, {
      type: "error",
      message: `Failed to open ${path.basename(filePath)}`,
      detail: String(e?.stack ?? e)
    });
    return null;
  }
}

export async function saveFile(window: BrowserWindow, filePath: string | undefined, midi: Midi): Promise<SaveResult | null> {
  filePath ??= (await dialog.showSaveDialog(window, { filters })).filePath;
  if (!filePath)
    return null;
  await fs.writeFile(filePath, new Uint8Array(writeMidi(midi)));
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
