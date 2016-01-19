'use strict';

const os = require('os');
const OS_TYPE = require('./enums/os-type');

class Utils {
  static get currentOsType() {
    if (Utils._currentOsType != null) return Utils._currentOsType;

    switch (os.platform()) {
      case 'win32':
        return Utils._currentOsType = OS_TYPE.WINDOWS;

      case 'darwin':
        return Utils._currentOsType = OS_TYPE.MAC;

      default:
        return Utils._currentOsType = OS_TYPE.LINUX;
    }
  }

  static get executableFileExtension() {
    return Utils.currentOsType === OS_TYPE.WINDOWS ? '.exe' : '';
  }
}

module.exports = Utils;
