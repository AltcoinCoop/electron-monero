import fs from 'fs';
import ProcessManagerBase from './process-manager-base';
import { NetworkSettings, PathSettings } from './../settings';

/**
 * Manages the wallet process.
 */
export default class WalletManager extends ProcessManagerBase {
  /**
   * Creates a new WalletManager instance.
   * @param {string} password Password to be used for the wallet.
   */
  constructor(password) {
    let fileWalletData = PathSettings.fileWalletData;
    let isCreatingNewWallet = false;
    let extraArgs = new Map();
    extraArgs.set('password', password);

    try {
      // Check whether the wallet data file already exists
      fs.accessSync(fileWalletData);
      extraArgs.set('wallet-file', fileWalletData);
      extraArgs.set('daemon-host', NetworkSettings.rpcDaemonIp);
      extraArgs.set('daemon-port', NetworkSettings.rpcDaemonPort);

    } catch (err) {
      // Create a new wallet
      isCreatingNewWallet = true;
      extraArgs.set('generate-new-wallet', fileWalletData);
    }

    super(
      PathSettings.softwareWallet,
      isCreatingNewWallet ? null : NetworkSettings.rpcWalletIp,
      isCreatingNewWallet ? null : NetworkSettings.rpcWalletPort,
      extraArgs
    );
  }
}
