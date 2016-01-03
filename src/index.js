import { spawn } from 'child_process';
import { app, BrowserWindow } from 'electron';
import OS_TYPE from './enums/os-type';
import DaemonManager from './process-managers/daemon-manager';
import WalletManager from './process-managers/wallet-manager';
import { NetworkSettings, PathSettings } from './settings';
import Utils from './utils';

// Declare important variables in an outer scope to avoid GC
let mainWindow;
let daemonManager;
let walletManager;

// Quit when all windows are closed
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar to stay active
  // until the user quits explicitly with Cmd + Q
  if (Utils.currentOsType === OS_TYPE.MAC) return;

  app.quit();
});

// App initialization handler
app.on('ready', () => {
  // Create the main browser window
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  });

  mainWindow.on('closed', () => {
    // Dereference the window object
    mainWindow = null;
  });

  // Load the index page of the app
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  // Open DevTools
  mainWindow.webContents.openDevTools();

  daemonManager = new DaemonManager();
  walletManager = new WalletManager('x');
});
