import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import electronReload from "electron-reload";
import { ELECTRON_EVENTS } from "./constants";
import { createMainWindow, hideWindow, showAndFocusWindow } from "./services";
import AutoLaunch from "auto-launch";

electronReload(path.join(__dirname), {
  electron: path.join(__dirname, "../node_modules/.bin/electron"),
  awaitWriteFinish: true,
});

let mainWindow: BrowserWindow | null = null;
let intervalId: NodeJS.Timeout | null = null;
let INTERVAL = 10 * 60000;

app.whenReady().then(() => {
  mainWindow = createMainWindow(intervalId);

  // Auto-launch 설정
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
