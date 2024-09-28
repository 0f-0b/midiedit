import {
  type BrowserWindow,
  Menu,
  type MenuItemConstructorOptions,
} from "electron";
import process from "node:process";

function devOnly(
  menu: MenuItemConstructorOptions[],
): MenuItemConstructorOptions[] {
  return process.env.NODE_ENV === "production" ? [] : menu;
}

function menuTemplate(window: BrowserWindow): MenuItemConstructorOptions[] {
  return [
    {
      role: "fileMenu",
      submenu: [
        {
          label: "&New",
          accelerator: "CmdOrCtrl+N",
          click: () => window.webContents.send("new-file"),
        },
        {
          label: "&Open…",
          accelerator: "CmdOrCtrl+O",
          click: () => window.webContents.send("open-file"),
        },
        { type: "separator" },
        {
          label: "&Save",
          accelerator: "CmdOrCtrl+S",
          click: () => window.webContents.send("save-file"),
        },
        { type: "separator" },
        {
          label: "&Export as JSON",
          click: () => window.webContents.send("export-json"),
        },
        { type: "separator" },
        { role: "quit" },
      ],
    },
    {
      role: "editMenu",
      submenu: [
        {
          label: "Undo",
          accelerator: "CmdOrCtrl+Z",
          click: () => window.webContents.send("undo"),
        },
        {
          label: "Redo",
          accelerator: "CmdOrCtrl+Shift+Z",
          click: () => window.webContents.send("redo"),
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
          click: () => window.webContents.send("insert-notes"),
        },
      ],
    },
    ...devOnly([
      {
        label: "Debug",
        submenu: [
          {
            role: "reload",
            accelerator: "CmdOrCtrl+R",
          },
          {
            role: "toggleDevTools",
            accelerator: "F12",
          },
        ],
      },
    ]),
    {
      role: "help",
      submenu: [
        { role: "about" },
      ],
    },
  ];
}

function darwinMenuTemplate(
  window: BrowserWindow,
): MenuItemConstructorOptions[] {
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
        { role: "quit" },
      ],
    },
    {
      role: "fileMenu",
      submenu: [
        {
          label: "New",
          accelerator: "CmdOrCtrl+N",
          click: () => window.webContents.send("new-file"),
        },
        {
          label: "Open…",
          accelerator: "CmdOrCtrl+O",
          click: () => window.webContents.send("open-file"),
        },
        { type: "separator" },
        {
          label: "Save",
          accelerator: "CmdOrCtrl+S",
          click: () => window.webContents.send("save-file"),
        },
        { type: "separator" },
        {
          label: "&Export as JSON",
          click: () => window.webContents.send("export-json"),
        },
      ],
    },
    {
      role: "editMenu",
      submenu: [
        {
          label: "Undo",
          accelerator: "CmdOrCtrl+Z",
          click: () => window.webContents.send("undo"),
        },
        {
          label: "Redo",
          accelerator: "CmdOrCtrl+Shift+Z",
          click: () => window.webContents.send("redo"),
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
          click: () => window.webContents.send("insert-notes"),
        },
      ],
    },
    { role: "windowMenu" },
    ...devOnly([
      {
        label: "Debug",
        submenu: [
          {
            role: "reload",
            accelerator: "CmdOrCtrl+R",
          },
          {
            role: "toggleDevTools",
            accelerator: "F12",
          },
        ],
      },
    ]),
  ];
}

export function buildMenu(window: BrowserWindow): Menu {
  return Menu.buildFromTemplate(
    process.platform === "darwin"
      ? darwinMenuTemplate(window)
      : menuTemplate(window),
  );
}
