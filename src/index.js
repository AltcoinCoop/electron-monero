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

  daemonProcess = spawn(PathSettings.softwareDaemon, [
    `--rpc-bind-ip=${NetworkSettings.rpcDaemonIp}`,
    `--rpc-bind-port=${NetworkSettings.rpcDaemonPort}`,
    `--data-dir=${PathSettings.directoryDaemonData}`
  ]);

  daemonProcess.stdout.on('data', (data) => {
    console.log('DAEMON OUT: ' + data);
  });
  daemonProcess.stderr.on('data', (data) => {
    console.log('DAEMON ERR: ' + data);
  });
  daemonProcess.on('close', (code) => {
    console.log('DAEMON EXIT: ' + code);
  });

  walletProcess = spawn(PathSettings.softwareWallet, [
    `--rpc-bind-ip=${NetworkSettings.rpcWalletIp}`,
    `--rpc-bind-port=${NetworkSettings.rpcWalletPort}`,
    `--daemon-host=${NetworkSettings.rpcDaemonIp}`,
    `--daemon-port=${NetworkSettings.rpcDaemonPort}`,
    `--wallet-file=${PathSettings.fileWalletData}`,
    `--password=x`
  ]);

  walletProcess.stdout.on('data', (data) => {
    console.log('WALLET OUT: ' + data);
  });
  walletProcess.stderr.on('data', (data) => {
    console.log('WALLET ERR: ' + data);
  });
  walletProcess.on('close', (code) => {
    console.log('WALLET EXIT: ' + code);
  });
});
