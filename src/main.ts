import { app, BrowserWindow, ipcMain, Menu } from "electron";
import * as path from "path";
import { initLocales } from "./i18n";
import { buildMenu } from "./menu";

let window: BrowserWindow | undefined;

const init = initLocales();
app.once("ready", async () => {
  await init;
  Menu.setApplicationMenu(buildMenu());
  (window = new BrowserWindow({
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
  })).loadFile(path.resolve(__dirname, "../index.html"));
});
app.on("window-all-closed", () => app.quit());
app.on("open-file", (event, filePath) => {
  if (!window) return;
  event.preventDefault();
  window.webContents.send("open-file", filePath);
});
ipcMain.on("ready", () => {
  if (!window) return;
  window.show();
});
ipcMain.on("update-state", (_, filePath: string, dirty: boolean) => {
  if (!window) return;
  window.setRepresentedFilename(filePath);
  window.setDocumentEdited(dirty);
});
