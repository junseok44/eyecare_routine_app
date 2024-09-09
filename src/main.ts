import { app, BrowserWindow, ipcMain } from "electron";

import * as path from "path";
import { ELECTRON_EVENTS } from "./constants";
import { createMainWindow, hideWindow, showAndFocusWindow } from "./services";
import AutoLaunch from "auto-launch";

require("dotenv").config({
  path: app.isPackaged
    ? path.join(process.resourcesPath, ".env")
    : path.resolve(process.cwd(), ".env"),
});

if (process.env.NODE_ENV === "development") {
  try {
    require("electron-reload")(path.join(__dirname), {
      electron: path.join(__dirname, "../node_modules/.bin/electron"),
      awaitWriteFinish: true,
    });
  } catch (err) {
    console.error("Failed to load electron-reload:", err);
  }
}

let mainWindow: BrowserWindow | null = null;
let intervalId: NodeJS.Timeout | null = null;
let INTERVAL = 10 * 60000;

app.whenReady().then(() => {
  mainWindow = createMainWindow(intervalId);

  // Auto-launch 설정
  if (process.env.NODE_ENV === "production") {
    const autoLaunch = new AutoLaunch({
      name: "MyElectronApp", // 앱의 이름
      path: app.getPath("exe"), // 앱 실행 파일의 경로
    });

    autoLaunch
      .isEnabled()
      .then((isEnabled) => {
        if (!isEnabled) {
          autoLaunch.enable(); // 로그인 시 자동 실행 활성화
        }
      })
      .catch((err) => {
        console.error("Auto-launch 설정 오류:", err);
      });
  }
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
