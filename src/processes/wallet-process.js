'use strict';

const fs = require('fs');
const mkdirp = require('mkdirp');
const moneroWallet = require('monero-nodejs');
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

    super(PathSettings.softwareWallet, rpcIp, rpcPort, 'Starting wallet rpc');

    this._password = password;
    this.fileWalletData = fileWalletData;

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
      this.once('rpcInit', () => this._onRpcInit());

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

  _onRpcInit() {
    this._rpc = new moneroWallet({
      host: this.rpcIp,
      port: this.rpcPort
    });

    this._queryBalance();
  }

  _queryBalance() {
    this._rpc.balance().then((balance) => {
      this.balance = balance;
      this.emit('balance', balance);

      setTimeout(
        () => this._queryBalance,
        5000
      );
    });
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
      this.isRpcEnabled = true;
      extraArgs.set('wallet-file', this.fileWalletData);
      extraArgs.set('daemon-host', NetworkSettings.rpcDaemonIp);
      extraArgs.set('daemon-port', NetworkSettings.rpcDaemonPort);

    } else {
      // Create a new wallet
      this.isRpcEnabled = false;
      mkdirp.sync(path.dirname(this.fileWalletData));
      extraArgs.set('generate-new-wallet', this.fileWalletData);
    }

    return extraArgs;
  }
}

module.exports = WalletProcess;
