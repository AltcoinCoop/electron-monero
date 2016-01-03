import { spawn } from 'child_process';
import { EventEmitter } from 'events';

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
 * @extends EventEmitter
 * @fires ProcessManagerBase#data
 * @fires ProcessManagerBase#close
 * @property {string} executablePath Path of the executable process.
 * @property {string} rpcIp IP address used for RPC communication.
 * @property {number} rpcPort Port used for RPC communication.
 * @property {Map.<string, Object>} extraArgs Extra command line arguments
 * provided to the process.
 */
export default class ProcessManagerBase extends EventEmitter {
  /**
   * Creates a new ProcessManagerBase instance.
   * @param {string} executablePath Path of the executable process.
   * @param {string} rpcIp IP address used for RPC communication.
   * @param {number} rpcPort Port used for RPC communication.
   * @param {Map.<string, Object>} extraArgs Extra command line arguments
   * provided to the process.
   */
  constructor(executablePath, rpcIp = null, rpcPort = null, extraArgs = null) {
    super();

    this.executablePath = executablePath;
    this.rpcIp = rpcIp;
    this.rpcPort = rpcPort;
    this.extraArgs = extraArgs;

    // Initialize the Map of arguments
    let argsMap = new Map(extraArgs);
    if (rpcIp != null && rpcPort != null) {
      argsMap.set('rpc-bind-ip', rpcIp);
      argsMap.set('rpc-bind-port', rpcPort);
    }

    // Convert 'argsMap' to string[]
    let argsArray = [];
    for (let [key, value] of extraArgs) {
      argsArray.push(`--${key}=${value}`);
    }

    // Start the process
    let process = spawn(executablePath, argsArray);
    this._process = process;

    // Attach event handlers to the process
    process.stdout.on('data', (data) => {
      this.emit('data', data, false);
    });
    process.stderr.on('data', (data) => {
      this.emit('data', data, true);
    });
    process.on('close', (code) => {
      this.emit('close', code);
    });
  }
}
