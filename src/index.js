'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const OS_TYPE = require('./enums/os-type');
const DaemonProcess = require('./processes/daemon-process');
const WalletProcess = require('./processes/wallet-process');
const Utils = require('./utils');

// Declare important variables in an outer scope to avoid GC
let mainWindow;
let daemonProcess;
let walletProcess;

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

  daemonProcess = new DaemonProcess();
  walletProcess = new WalletProcess('x');
});
