import ProcessManagerBase from './process-manager-base';
import { NetworkSettings, PathSettings } from './../settings';

/**
 * Manages the daemon process.
 * @property {string} directoryDaemonData Daemon data directory.
 */
export default class DaemonManager extends ProcessManagerBase {
  /**
   * Creates a new DaemonManager instance.
   * @param {string} directoryDaemonData Daemon data directory.
   */
  constructor(directoryDaemonData = PathSettings.directoryDaemonData) {
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
