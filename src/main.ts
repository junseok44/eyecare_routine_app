import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import electronReload from "electron-reload";

let win: BrowserWindow | null = null;

electronReload(path.join(__dirname), {
  electron: path.join(__dirname, "../node_modules/.bin/electron"),
  awaitWriteFinish: true,
});

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (process.env.NODE_ENV === "production") {
    win.loadFile(path.join(__dirname, "renderer/index.html"));
  } else {
    win.loadURL("http://localhost:3000");
  }

  win.on("closed", () => {
    win = null;
  });
}

app.whenReady().then(createWindow);

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
