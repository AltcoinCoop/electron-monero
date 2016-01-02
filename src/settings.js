import { LocalStorage } from 'node-localstorage';
import os from 'os';
import path from 'path';
import OS_TYPE from './enums/os-type';
import Utils from './utils';

const LOCALHOST_IP = '127.0.0.1';

let localStorage = new LocalStorage('./settings');
//const DB = low('db.json', { storage });

export class GeneralSettings {
  static get transactionMixCount() {
    return localStorage.getItem('general_transactionMixCount') || 3;
  }

  static set transactionMixCount(value) {
    return localStorage.setItem('general_transactionMixCount', value);
  }
}

export class PathSettings {
  static get directoryDaemonData() {
    let output = localStorage.getItem('paths_directoryDaemonData');
    if (output != null) return output;

    // Each OS has different defaults
    switch (Utils.currentOsType) {
      case OS_TYPE.WINDOWS:
        return path.join(process.env.programData, 'bitmonero');
      default:
        return '~/.bitmonero';
    }
  }

  static set directoryDaemonData(value) {
    return localStorage.setItem('paths_directoryDaemonData', value);
  }

  static get fileAccountData() {
    return localStorage.getItem('paths_fileAccountData') ||
      path.join(os.homedir(), 'Monero Accounts/account.bin');
  }

  static set fileAccountData(value) {
    return PathSettings.table.set('paths_fileAccountData', value);
  }

  static get softwareDaemon() {
    // Each OS has different defaults
    return localStorage.getItem('paths_softwareDaemon') ||
      './cli/bitmonerod' + Utils.executableFileExtension;
  }

  static set softwareDaemon(value) {
    return localStorage.setItem('paths_softwareDaemon', value);
  }

  static get softwareAccountManager() {
    // Each OS has different defaults
    return localStorage.getItem('paths_softwareAccountManager') ||
      './cli/simplewallet' + Utils.executableFileExtension;
  }

  static set softwareAccountManager(value) {
    return localStorage.setItem('paths_softwareAccountManager', value);
  }
}

export class NetworkSettings {
  static get rpcDaemonIp() {
    return localStorage.getItem('network_rpcDaemonIp') || LOCALHOST_IP;
  }

  static set rpcDaemonIp(value) {
    return localStorage.setItem('network_rpcDaemonIp', value);
  }

  static get rpcDaemonPort() {
    return localStorage.getItem('network_rpcDaemonPort') || 18081;
  }

  static set rpcDaemonPort(value) {
    return localStorage.setItem('network_rpcDaemonPort', value);
  }

  static get rpcAccountManagerIp() {
    return localStorage.getItem('network_rpcAccountManagerIp') || LOCALHOST_IP;
  }

  static set rpcAccountManagerIp(value) {
    return localStorage.setItem('network_rpcAccountManagerIp', value);
  }

  static get rpcAccountManagerPort() {
    return localStorage.getItem('network_rpcAccountManagerPort') || 18082;
  }

  static set rpcAccountManagerPort(value) {
    return localStorage.setItem('network_rpcAccountManagerPort', value);
  }
}
