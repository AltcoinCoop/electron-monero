import { spawn } from 'child_process';
import { app, BrowserWindow } from 'electron';
import { NetworkSettings, PathSettings } from './settings';

// Declare important variables in an outer scope to avoid GC
let mainWindow;
let daemonProcess;
let walletProcess;

// Quit when all windows are closed
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar to stay active
  // until the user quits explicitly with Cmd + Q
  if (process.platform === 'darwin') return;

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

  PathSettings.directoryDaemonData = 'D:/Cryptocurrency data/Blockchains/Monero';

  daemonProcess = spawn(PathSettings.softwareDaemon, [
    `--data-dir=${PathSettings.directoryDaemonData}`,
    `--rpc-bind-ip=${NetworkSettings.rpcDaemonIp}`,
    `--rpc-bind-port=${NetworkSettings.rpcDaemonPort}`
  ], {
    cwd: __dirname
  });

  daemonProcess.stdout.on('data', (data) => {
    console.log('stdout: ' + data);
  });
  daemonProcess.stderr.on('data', (data) => {
    console.log('stdout: ' + data);
  });
  daemonProcess.on('close', (code) => {
    console.log('closing code: ' + code);
  });
});
