import type { MenuItemConstructorOptions } from "electron";
import { Menu } from "electron";

const devOnly: (menu: MenuItemConstructorOptions[]) => MenuItemConstructorOptions[] = process.env.NODE_ENV === "production" ? () => [] : menu => menu;

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
        {
          label: "&Export as JSON",
          click: (_, window) => window?.webContents.send("export-json")
        },
        { type: "separator" },
        { role: "quit" }
      ]
    },
    {
      role: "editMenu",
      submenu: [
        {
          label: "Undo",
          accelerator: "CmdOrCtrl+Z",
          click: (_, window) => window?.webContents.send("undo")
        },
        {
          label: "Redo",
          accelerator: "CmdOrCtrl+Shift+Z",
          click: (_, window) => window?.webContents.send("redo")
        },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "delete" },
        { role: "selectAll" },
        { type: "separator" },
        {
          label: "&Insert Notes",
          click: (_, window) => window?.webContents.send("insert-notes")
        }
      ]
    },
    ...devOnly([
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
    ]),
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
        },
        { type: "separator" },
        {
          label: "&Export as JSON",
          click: (_, window) => window?.webContents.send("export-json")
        }
      ]
    },
    {
      role: "editMenu",
      submenu: [
        {
          label: "Undo",
          accelerator: "CmdOrCtrl+Z",
          click: (_, window) => window?.webContents.send("undo")
        },
        {
          label: "Redo",
          accelerator: "CmdOrCtrl+Shift+Z",
          click: (_, window) => window?.webContents.send("redo")
        },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "delete" },
        { role: "selectAll" },
        { type: "separator" },
        {
          label: "&Insert Notes",
          click: (_, window) => window?.webContents.send("insert-notes")
        }
      ]
    },
    { role: "windowMenu" },
    ...devOnly([
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
    ])
  ];
}

export function buildMenu(): Menu {
  return Menu.buildFromTemplate(process.platform === "darwin" ? darwinMenuTemplate() : menuTemplate());
}
