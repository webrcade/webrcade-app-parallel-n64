import {
  isIos,
  isMacOs,
  isTouchSupported,
  BaseSettings,
} from '@webrcade/app-common';

export class Prefs extends BaseSettings {
  constructor(emu) {
    super(emu.getStorage());

    this.emu = emu;
    const app = emu.getApp();

    const PREFS_PREFIX = 'prefs';

    this.vboPath = app.getStoragePath(`${PREFS_PREFIX}.vboEnabled`);
    this.iosGpuPromptPath = app.getStoragePath(`${PREFS_PREFIX}.iosGpuPromptEnabled`);
    this.vboEnabled = true;
    this.iosGpuPromptEnabled = true;
  }

  async load() {
    let enabled = await super.loadBool(this.vboPath, null);
    if (enabled === null) {
      enabled = !(isIos() || (isMacOs() && isTouchSupported()));
    }
    this.vboEnabled = enabled;
    this.iosGpuPromptEnabled = await super.loadBool(this.iosGpuPromptPath, this.iosGpuPromptEnabled);
  }

  async save() {
    await super.saveBool(this.vboPath, this.vboEnabled);
    await super.saveBool(this.iosGpuPromptPath, this.iosGpuPromptEnabled);
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

  isIosGpuPromptEnabled() {
    return this.iosGpuPromptEnabled;
  }

  setIosGpuPromptEnabled(enabled) {
    if (this.iosGpuPromptEnabled !== enabled) {
      this.iosGpuPromptEnabled = enabled;
    }
  }
}
