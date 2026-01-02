const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  ping: () => "Electron ready",
});
