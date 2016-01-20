'use strict';

const ProcessManagerBase = require('./process-manager-base');
const Settings = require('./../settings');
const NetworkSettings = Settings.NetworkSettings;
const PathSettings = Settings.PathSettings;

/**
 * Manages the daemon process.
 */
class DaemonProcess extends ProcessManagerBase {
  /**
   * Creates a new DaemonProcess instance.
   */
  constructor() {
    let extraArgs = new Map();
    extraArgs.set('data-dir', PathSettings.directoryDaemonData);

    super(
      PathSettings.softwareDaemon,
      NetworkSettings.rpcDaemonIp,
      NetworkSettings.rpcDaemonPort,
      'rpc server initialized',
      extraArgs
    );

    // Start the process
    this.start();
  }
}

module.exports = DaemonProcess;
