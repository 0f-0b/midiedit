import { app, BrowserWindow, ipcMain, Menu } from "electron";
import * as path from "path";
import { Midi } from "../common/midi";
import { buildMenu } from "./menu";
import { askSave, exportJson, openFile, saveFile } from "./remote";

let window: BrowserWindow;
app.once("ready", () => {
  Menu.setApplicationMenu(buildMenu());
  window = new BrowserWindow({
    title: app.name,
    width: 800,
    height: 600,
    minWidth: 640,
    minHeight: 480,
    backgroundColor: "#222",
    show: false,
    webPreferences: {
      contextIsolation: true,
      nativeWindowOpen: true,
      preload: path.join(app.getAppPath(), "preload.js")
    }
  });
  void window.loadFile(path.join(app.getAppPath(), "index.html"));
  app.on("open-file", (event, path) => {
    event.preventDefault();
    window.webContents.send("open-file", path);
  });
  window.webContents.on("new-window", (event, _url, name, _disposition, options) => {
    switch (name) {
      case "insert-notes":
        event.preventDefault();
        event.newGuest = new BrowserWindow(Object.assign(options, {
          parent: window,
          title: "Insert Notes",
          width: 240,
          height: 200,
          minWidth: 240,
          minHeight: 200
        }));
        break;
      default:
        console.warn(`Unknown window '${name}'`);
        break;
    }
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
  ipcMain.handle("export-json", (_, midi: Midi) => exportJson(window, midi));
});
