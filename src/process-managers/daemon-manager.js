import ProcessManagerBase from './process-manager-base';
import { NetworkSettings, PathSettings } from './../settings';

/**
 * Manages the daemon process.
 */
export default class DaemonManager extends ProcessManagerBase {
  /**
   * Creates a new DaemonManager instance.
   */
  constructor() {
    let extraArgs = new Map();
    extraArgs.set('data-dir', PathSettings.directoryDaemonData);

    super(
      PathSettings.softwareDaemon,
      NetworkSettings.rpcDaemonIp,
      NetworkSettings.rpcDaemonPort,
      extraArgs
    );

    // Start the process
    this.start();
  }
}
