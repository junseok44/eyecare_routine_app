import { BrowserWindow } from "electron";
import { ELECTRON_EVENTS } from "./constants";
import path from "path";

export const showAndFocusWindow = (mainWindow: BrowserWindow) => {
  mainWindow.webContents.send(ELECTRON_EVENTS.SHOW_WINDOW);
  mainWindow.show();
  mainWindow.focus();
};

export const hideWindow = (mainWindow: BrowserWindow) => {
  mainWindow.hide();
};

export const createMainWindow = (intervalId: NodeJS.Timeout | null) => {
  let mainWindow: BrowserWindow | null = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      webviewTag: false,
      sandbox: true,
    },
  });

  if (process.env.NODE_ENV === "production") {
    const filePath = path.join(__dirname, "./renderer/index.html");

    mainWindow.loadFile(filePath);
  } else {
    mainWindow.loadURL("http://localhost:3001");
  }

  mainWindow.on("closed", () => {
    if (intervalId) clearInterval(intervalId);
    mainWindow = null;
  });

  return mainWindow;
};
