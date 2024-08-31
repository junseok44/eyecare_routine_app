import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import electronReload from "electron-reload";
import { ELECTRON_EVENTS } from "./constants";
import { createMainWindow, hideWindow, showAndFocusWindow } from "./services";

electronReload(path.join(__dirname), {
  electron: path.join(__dirname, "../node_modules/.bin/electron"),
  awaitWriteFinish: true,
});

let mainWindow: BrowserWindow | null = null;
let intervalId: NodeJS.Timeout | null = null;
let INTERVAL = 10 * 60000;

app.whenReady().then(() => {
  mainWindow = createMainWindow(intervalId);
});

ipcMain.on(ELECTRON_EVENTS.START_TIMER, (_event, interval: number) => {
  if (intervalId) clearInterval(intervalId);

  INTERVAL = interval;

  intervalId = setInterval(() => {
    if (mainWindow) {
      showAndFocusWindow(mainWindow);
    }
  }, INTERVAL);

  if (mainWindow) {
    hideWindow(mainWindow);
  }
});

ipcMain.on(ELECTRON_EVENTS.SET_TIMER_AGAIN, () => {
  if (mainWindow) {
    mainWindow.hide();
  }

  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }

  intervalId = setInterval(() => {
    if (mainWindow) {
      showAndFocusWindow(mainWindow);
    }
  }, INTERVAL);
});

ipcMain.on(ELECTRON_EVENTS.QUIT_APP, () => {
  app.quit();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    mainWindow = createMainWindow(intervalId);
  }
});
