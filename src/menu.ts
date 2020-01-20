import { app, Menu, MenuItemConstructorOptions } from "electron";
import { __ } from "./i18n";

const seperator: MenuItemConstructorOptions = { type: "separator" };

function menuTemplate(): MenuItemConstructorOptions[] {
  return [
    {
      role: "fileMenu",
      submenu: [
        {
          label: __("menu.new"),
          accelerator: "CmdOrCtrl+N",
          click: (_, window) => window.webContents.send("new-file")
        },
        {
          label: __("menu.open"),
          accelerator: "CmdOrCtrl+O",
          click: (_, window) => window.webContents.send("open-file")
        },
        seperator,
        {
          label: __("menu.save"),
          accelerator: "CmdOrCtrl+S",
          click: (_, window) => window.webContents.send("save-file")
        },
        seperator,
        {
          label: __("menu.preferences"),
          accelerator: "CmdOrCtrl+,",
          click: (_, window) => window.webContents.send("show-preferences")
        },
        seperator,
        { role: "quit" }
      ]
    },
    {
      role: "editMenu",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        seperator,
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
        {
          label: __("menu.help"),
          accelerator: "F1",
          click: (_, window) => window.webContents.send("show-help")
        },
        seperator,
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
        seperator,
        {
          label: __("menu.preferences", { context: "darwin" }),
          accelerator: "CmdOrCtrl+,",
          click: (_, window) => window.webContents.send("show-preferences")
        },
        seperator,
        { role: "services" },
        seperator,
        { role: "hide" },
        { role: "hideOthers" },
        { role: "unhide" },
        seperator,
        { role: "quit" }
      ]
    },
    {
      role: "fileMenu",
      submenu: [
        {
          label: __("menu.new", { context: "darwin" }),
          accelerator: "CmdOrCtrl+N",
          click: (_, window) => window.webContents.send("new-file")
        },
        {
          label: __("menu.open", { context: "darwin" }),
          accelerator: "CmdOrCtrl+O",
          click: (_, window) => window.webContents.send("open-file")
        },
        seperator,
        {
          label: __("menu.save", { context: "darwin" }),
          accelerator: "CmdOrCtrl+S",
          click: (_, window) => window.webContents.send("save-file")
        }
      ]
    },
    {
      role: "editMenu",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        seperator,
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
    },
    {
      role: "help",
      submenu: [
        {
          label: __("menu.help", { context: "darwin", name: app.name }),
          click: (_, window) => window.webContents.send("show-help")
        }
      ]
    }
  ];
}

export function buildMenu(): Menu {
  return Menu.buildFromTemplate(process.platform === "darwin" ? darwinMenuTemplate() : menuTemplate());
}
