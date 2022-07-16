import {
  isIos,
  isMacOs,
  isTouchSupported,
  BaseSettings,
} from "@webrcade/app-common"

export class Prefs extends BaseSettings {
  constructor(emu) {
    super(emu.getStorage());

    this.emu = emu;
    const app = emu.getApp();

    const PREFS_PREFIX = "prefs";

    this.vboPath = app.getStoragePath(`${PREFS_PREFIX}.vboEnabled`);
    this.vboEnabled = true;
  }

  async load() {
    let enabled = await super.loadBool(this.vboPath, null);
    if (enabled === null) {
      enabled = !(isIos() || (isMacOs() && isTouchSupported()));
    }
    this.vboEnabled = enabled;
  }

  async save() {
    await super.saveBool(this.vboPath, this.vboEnabled);
  }

  isVboEnabled() {
    return this.vboEnabled;
  }

  setVboEnabled(enabled) {
    if (this.vboEnabled !== enabled) {
      this.vboEnabled = enabled;
      this.emu.enableVbo(enabled);
    }
  }
}