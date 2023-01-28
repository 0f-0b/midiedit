import { app, BrowserWindow, ipcMain, Menu } from "electron";
import { once } from "node:events";
import { basename, join } from "node:path";
import { pathToFileURL } from "node:url";
import type { Midi } from "../../shared/src/midi.ts";
import { buildMenu } from "./menu.ts";
import { askSave, exportJson, openFile, saveFile } from "./remote.ts";

void (async () => {
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
      preload: join(app.getAppPath(), "packages/preload/dist/index.cjs"),
    },
  });
  app.on("open-file", (event, path) => {
    event.preventDefault();
    window.webContents.send("open-file", path);
  });
  window.webContents.setWindowOpenHandler(({ frameName }) => {
    switch (frameName) {
      case "insert-notes":
        return {
          action: "allow",
          overrideBrowserWindowOptions: {
            parent: window,
            title: "Insert Notes",
            width: 240,
            height: 200,
            minWidth: 240,
            minHeight: 200,
          },
        };
      default:
        return { action: "deny" };
    }
  });
  ipcMain.on("ready", () => window.show());
  ipcMain.on("update-state", (_, path: string | undefined, dirty: boolean) => {
    let title = app.name;
    if (path !== undefined) {
      title += ` — ${basename(path)}`;
    }
    if (dirty) {
      title += " *";
    }
    window.title = title;
    window.setRepresentedFilename(path ?? "");
    window.setDocumentEdited(dirty);
  });
  ipcMain.handle(
    "open-file",
    (_, path: string | undefined) => openFile(window, path),
  );
  ipcMain.handle(
    "save-file",
    (_, path: string | undefined, midi: Midi) => saveFile(window, path, midi),
  );
  ipcMain.handle(
    "ask-save",
    (_, path: string | undefined, midi: Midi) => askSave(window, path, midi),
  );
  ipcMain.handle("export-json", (_, midi: Midi) => exportJson(window, midi));
  await window.loadURL(
    process.env.VITE_DEV_SERVER_URL ||
      pathToFileURL(join(app.getAppPath(), "packages/renderer/dist/index.html"))
        .href,
  );
})();
