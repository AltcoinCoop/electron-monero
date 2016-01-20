'use strict';

const spawn = require('child_process').spawn;
const EventEmitter = require('events').EventEmitter;

/**
 * Data event, which fires when the process outputs information.
 * @event ProcessManagerBase#data
 * @property {string} data Output provided by the process.
 * @property {boolean} isError Indicates whether the data is an error.
 */

/**
 * Close event, which fires when the process exits.
 * @event ProcessManagerBase#close
 * @property {number} code Exit code provided by the process.
 */

/**
 * Base class for managing child processes.
 * @fires ProcessManagerBase#data
 * @fires ProcessManagerBase#close
 * @property {string} executablePath Path of the executable process.
 * @property {string} rpcIp IP address used for RPC communication.
 * @property {number} rpcPort Port used for RPC communication.
 * @property {Map.<string, Object>} extraArgs Extra command line arguments
 * provided to the process.
 */
class ProcessManagerBase extends EventEmitter {
  /**
   * Creates a new ProcessManagerBase instance.
   * @param {string} executablePath Path of the executable process.
   * @param {string} [rpcIp] IP address used for RPC communication.
   * @param {number} [rpcPort] Port used for RPC communication.
   * @param {Map.<string, Object>} [extraArgs] Extra command line arguments
   * provided to the process.
   */
  constructor(executablePath, rpcIp, rpcPort, extraArgs) {
    super();

    this.executablePath = executablePath;
    this.rpcIp = rpcIp;
    this.rpcPort = rpcPort;
    this.isRpcEnabled = true;

    if (extraArgs != null) {
      this.extraArgs = extraArgs;
    }
  }

  /**
   * Starts the process.
   */
  start() {
    // Start the process
    let process = spawn(this.executablePath, this.argsArray);
    this._process = process;

    // Attach event handlers to the process
    process.stdout.on('data', (data) => {
      this.emit('data', data.toString(), false);
    });
    process.stderr.on('data', (data) => {
      this.emit('data', data.toString(), true);
    });
    process.on('close', (code) => {
      this.emit('close', code);
    });
  }

  /**
   * Stops the process.
   */
  stop() {
    if (this._process == null) return;

    this._process.kill();
    this._process = null;
  }

  /**
   * Restarts the process.
   */
  restart() {
    this.stop();
    this.start();
  }

  /**
   * Writes a message to the stdin stream of the process.
   * @param {string} msg Message to be written 
   */
  writeLine(msg) {
    this._process.stdin.write(msg + '\n');
  }

  /**
   * Array of arguments passed to the process.
   */
  get argsArray() {
    // Initialize the Map of arguments
    let argsMap = new Map(this.extraArgs);
    if (this.isRpcEnabled) {
      argsMap.set('rpc-bind-ip', this.rpcIp);
      argsMap.set('rpc-bind-port', this.rpcPort);
    }

    // Convert 'argsMap' to string[]
    let argsArray = [];
    argsMap.forEach((value, key) => {
      argsArray.push(`--${key}=${value}`);
    });
    console.log(argsArray);
    return argsArray;
  }
}

module.exports = ProcessManagerBase;
