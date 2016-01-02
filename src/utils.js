import os from 'os';
import OS_TYPE from './enums/os-type';

export default class Utils {
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
