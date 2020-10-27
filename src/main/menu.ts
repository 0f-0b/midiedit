import { Menu, MenuItemConstructorOptions } from "electron";

function menuTemplate(): MenuItemConstructorOptions[] {
  return [
    {
      role: "fileMenu",
      submenu: [
        {
          label: "&New",
          accelerator: "CmdOrCtrl+N",
          click: (_, window) => window?.webContents.send("new-file")
        },
        {
          label: "&Open…",
          accelerator: "CmdOrCtrl+O",
          click: (_, window) => window?.webContents.send("open-file")
        },
        { type: "separator" },
        {
          label: "&Save",
          accelerator: "CmdOrCtrl+S",
          click: (_, window) => window?.webContents.send("save-file")
        },
        { type: "separator" },
        { role: "quit" }
      ]
    },
    {
      role: "editMenu",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "delete" },
        { role: "selectAll" }
      ]
    },
    {
      label: "Debug",
      submenu: [
        {
          role: "reload",
          accelerator: "CmdOrCtrl+R"
        },
        {
          role: "toggleDevTools",
          accelerator: "F12"
        }
      ]
    },
    {
      role: "help",
      submenu: [
        { role: "about" }
      ]
    }
  ];
}

function darwinMenuTemplate(): MenuItemConstructorOptions[] {
  return [
    {
      role: "appMenu",
      submenu: [
        { role: "about" },
        { type: "separator" },
        { role: "services" },
        { type: "separator" },
        { role: "hide" },
        { role: "hideOthers" },
        { role: "unhide" },
        { type: "separator" },
        { role: "quit" }
      ]
    },
    {
      role: "fileMenu",
      submenu: [
        {
          label: "New",
          accelerator: "CmdOrCtrl+N",
          click: (_, window) => window?.webContents.send("new-file")
        },
        {
          label: "Open…",
          accelerator: "CmdOrCtrl+O",
          click: (_, window) => window?.webContents.send("open-file")
        },
        { type: "separator" },
        {
          label: "Save",
          accelerator: "CmdOrCtrl+S",
          click: (_, window) => window?.webContents.send("save-file")
        }
      ]
    },
    {
      role: "editMenu",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "delete" },
        { role: "selectAll" }
      ]
    },
    { role: "windowMenu" },
    {
      label: "Debug",
      submenu: [
        {
          role: "reload",
          accelerator: "CmdOrCtrl+R"
        },
        {
          role: "toggleDevTools",
          accelerator: "F12"
        }
      ]
    }
  ];
}

export function buildMenu(): Menu {
  return Menu.buildFromTemplate(process.platform === "darwin" ? darwinMenuTemplate() : menuTemplate());
}
