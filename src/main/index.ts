import { app, BrowserWindow, ipcMain, Menu } from "electron";
import { once } from "events";
import * as path from "path";
import { Midi } from "../common/midi";
import { askSave, openFile, saveFile } from "./files";
import { buildMenu } from "./menu";

(async () => {
  let opened: string | undefined;
  app.on("open-file", (event, file) => {
    event.preventDefault();
    opened = file;
  });
  app.on("window-all-closed", () => app.quit());
  await once(app, "ready");
  Menu.setApplicationMenu(buildMenu());
  const window = new BrowserWindow({
    title: app.name,
    width: 800,
    height: 600,
    minWidth: 640,
    minHeight: 480,
    backgroundColor: "#222",
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  });
  window.loadFile(path.resolve(__dirname, "../../index.html"));
  if (opened !== undefined)
    window.webContents.send("open-file", opened);
  app.removeAllListeners("open-file");
  app.on("open-file", (event, path) => {
    event.preventDefault();
    window.webContents.send("open-file", path);
  });
  ipcMain.on("ready", () => window.show());
  ipcMain.on("update-state", (_, filePath: string | undefined, dirty: boolean) => {
    const title = [app.name];
    if (filePath !== undefined)
      title.push("— ", path.basename(filePath));
    if (dirty)
      title.push("*");
    window.title = title.join(" ");
    window.setRepresentedFilename(filePath ?? "");
    window.setDocumentEdited(dirty);
  });
  ipcMain.handle("open-file", (_, filePath: string | undefined) => openFile(window, filePath));
  ipcMain.handle("save-file", (_, filePath: string | undefined, midi: Midi) => saveFile(window, filePath, midi));
  ipcMain.handle("ask-save", (_, filePath: string | undefined, midi: Midi) => askSave(window, filePath, midi));
})();
