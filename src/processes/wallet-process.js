'use strict';

const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
const ProcessManagerBase = require('./process-manager-base');
const Settings = require('./../settings');
const NetworkSettings = Settings.NetworkSettings;
const PathSettings = Settings.PathSettings;

/**
 * Initialization event, which fires when the process gets initialized.
 * @event WalletProcess#init
 */

/**
 * Manages the wallet process.
 * @fires WalletProcess#init
 * @property {string} fileWalletData Wallet data file.
 */
class WalletProcess extends ProcessManagerBase {
  /**
   * Creates a new WalletProcess instance.
   * @param {string} password Password to be used for the wallet.
   * @param {string} [fileWalletData] Wallet data file.
   * @param {string} [rpcIp] IP address used for RPC communication.
   * @param {number} [rpcPort] Port used for RPC communication.
   */
  constructor(password, fileWalletData, rpcIp, rpcPort) {
    fileWalletData = fileWalletData || PathSettings.fileWalletData;
    rpcIp = rpcIp || NetworkSettings.rpcWalletIp;
    rpcPort = rpcPort || NetworkSettings.rpcWalletPort;

    super(PathSettings.softwareWallet);

    this._password = password;
    this.fileWalletData = fileWalletData;
    this.rpcIp = rpcIp;
    this.rpcPort = rpcPort;

    // Start the process
    this.start();
  }

  /**
   * Starts the process.
   */
  start() {
    super.start();

    if (this.isWalletDataExistent) {
      // Wait for the RPC to be initialized
      this.on('data', (data) => {
        if (!this._isInitialized && data.indexOf('Starting wallet rpc') >= 0) {
          this._isInitialized = true;
          this.emit('init');
        }
      });

    } else {
      // Handle wallet creation
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
  }

  get isWalletDataExistent() {
    try {
      // Check whether the wallet data file already exists
      fs.accessSync(this.fileWalletData);
      return true;

    } catch (err) {
      return false;
    }
  }

  get extraArgs() {
    let extraArgs = new Map();
    extraArgs.set('password', this._password);

    if (this.isWalletDataExistent) {
      // The wallet data file already exists, use RPC
      extraArgs.set('wallet-file', this.fileWalletData);
      extraArgs.set('rpc-bind-ip', this.rpcIp);
      extraArgs.set('rpc-bind-port', this.rpcPort);
      extraArgs.set('daemon-host', NetworkSettings.rpcDaemonIp);
      extraArgs.set('daemon-port', NetworkSettings.rpcDaemonPort);

    } else {
      // Create a new wallet
      mkdirp.sync(path.dirname(this.fileWalletData));
      extraArgs.set('generate-new-wallet', this.fileWalletData);
    }

    return extraArgs;
  }
}

module.exports = WalletProcess;
