import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
  send: (channel: string, data?: any) => ipcRenderer.send(channel, data),
  on: (channel: string, func: (...args: any[]) => void) =>
    ipcRenderer.on(channel, (_event, ...args) => func(...args)),
});
