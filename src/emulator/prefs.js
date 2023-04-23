import {
  isIos,
  isMacOs,
  isTouchSupported,
  AppPrefs
} from '@webrcade/app-common';

export class Prefs extends AppPrefs {
  constructor(emu) {
    super(emu);

    this.emu = emu;
    const app = emu.getApp();

    this.vboPath = app.getStoragePath(`${this.PREFS_PREFIX}.vboEnabled`);
    this.iosGpuPromptPath = app.getStoragePath(`${this.PREFS_PREFIX}.iosGpuPromptEnabled`);
    this.vboEnabled = true;
    this.iosGpuPromptEnabled = true;
  }

  async load() {
    super.load();

    let enabled = await super.loadBool(this.vboPath, null);
    if (enabled === null) {
      enabled = !(isIos() || (isMacOs() && isTouchSupported()));
    }
    this.vboEnabled = enabled;
    this.iosGpuPromptEnabled = await super.loadBool(this.iosGpuPromptPath, this.iosGpuPromptEnabled);
  }

  async save() {
    super.save();

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
