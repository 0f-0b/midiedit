const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  ready() {
    ipcRenderer.send("ready");
  },
  updateState(filePath, dirty) {
    ipcRenderer.send("update-state", filePath, dirty);
  },
  addIpcListener(channel, listener) {
    ipcRenderer.addListener(channel, listener);
  },
  removeIpcListener(channel, listener) {
    ipcRenderer.removeListener(channel, listener);
  },
  openFile(filePath) {
    return ipcRenderer.invoke("open-file", filePath);
  },
  saveFile(filePath, midi) {
    return ipcRenderer.invoke("save-file", filePath, midi);
  },
  askSave(filePath, midi) {
    return ipcRenderer.invoke("ask-save", filePath, midi);
  },
  exportJson(midi) {
    return ipcRenderer.invoke("export-json", midi);
  },
});
