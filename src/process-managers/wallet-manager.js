import fs from 'fs';
import mkdirp from 'mkdirp';
import path from 'path';
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
    super(PathSettings.softwareWallet);

    this._password = password;

    // Start the process
    this.start();
  }

  /**
   * Starts the process.
   */
  start() {
    super.start();
    if (this.isWalletDataExistent) return;

    // Handle wallet creation if necessary
    this.on('data', (data) => {
      if (data.indexOf('language of your choice') >= 0) {
        // TODO: Let the user select the language of the seed
        this.writeLine('0');
      }

      if (data.indexOf('wallet has been generated') >= 0) {
        this.restart();
      }
    });
  }

  get isWalletDataExistent() {
    try {
      // Check whether the wallet data file already exists
      fs.accessSync(PathSettings.fileWalletData);
      return true;

    } catch (err) {
      return false;
    }
  }

  get extraArgs() {
    let extraArgs = new Map();
    extraArgs.set('password', this._password);

    if (this.isWalletDataExistent) {
      // The wallet data file already exists
      extraArgs.set('wallet-file', PathSettings.fileWalletData);
      extraArgs.set('daemon-host', NetworkSettings.rpcDaemonIp);
      extraArgs.set('daemon-port', NetworkSettings.rpcDaemonPort);

    } else {
      // Create a new wallet
      mkdirp.sync(path.dirname(PathSettings.fileWalletData));
      extraArgs.set('generate-new-wallet', PathSettings.fileWalletData);
    }

    return extraArgs;
  }
}
