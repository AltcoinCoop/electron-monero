'use strict';

const ProcessManagerBase = require('./process-manager-base');
const Settings = require('./../settings');
const NetworkSettings = Settings.NetworkSettings;
const PathSettings = Settings.PathSettings;

/**
 * Manages the daemon process.
 * @property {string} directoryDaemonData Daemon data directory.
 */
class DaemonProcess extends ProcessManagerBase {
  /**
   * Creates a new DaemonProcess instance.
   * @param {string} directoryDaemonData Daemon data directory.
   */
  constructor(directoryDaemonData) {
    directoryDaemonData =
      directoryDaemonData || PathSettings.directoryDaemonData;

    let extraArgs = new Map();
    extraArgs.set('data-dir', directoryDaemonData);

    super(
      PathSettings.softwareDaemon,
      NetworkSettings.rpcDaemonIp,
      NetworkSettings.rpcDaemonPort,
      extraArgs
    );

    this.directoryDaemonData = directoryDaemonData;

    // Start the process
    this.start();
  }
}

module.exports = DaemonProcess;
