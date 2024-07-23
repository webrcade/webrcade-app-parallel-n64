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

    this.vboPathOld = app.getStoragePath(`${this.PREFS_PREFIX}.vboEnabled`);
    this.vboPath = app.getStoragePath(`${this.PREFS_PREFIX}.vboEnabledNew`);
    // this.iosGpuPromptPath = app.getStoragePath(`${this.PREFS_PREFIX}.iosGpuPromptEnabled`);
    this.vboPromptPath = app.getStoragePath(`${this.PREFS_PREFIX}.vboPromptEnabled`);
    this.vboEnabled = true;
    // this.iosGpuPromptEnabled = true;
    this.vboPromptEnabled = true;
  }

  async load() {
    await super.load();

    let enabled = await super.loadBool(this.vboPath, null);
    if (enabled === null) {
      let oldEnabled = await super.loadBool(this.vboPathOld, null);
      if (oldEnabled !== null) {
        if (isIos() || (isMacOs() && isTouchSupported())) {
          enabled = true;
        } else {
          enabled = oldEnabled;
        }
      } else {
        enabled = true;
      }
    }

    this.vboEnabled = enabled;
    // this.iosGpuPromptEnabled = await super.loadBool(this.iosGpuPromptPath, this.iosGpuPromptEnabled);
    this.vboPromptEnabled = await super.loadBool(this.vboPromptPath, this.vboPromptEnabled);
  }

  async save() {
    await super.save();

    await super.saveBool(this.vboPath, this.vboEnabled);
    // await super.saveBool(this.iosGpuPromptPath, this.iosGpuPromptEnabled);
    await super.saveBool(this.vboPromptPath, this.vboPromptEnabled);
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

  // isIosGpuPromptEnabled() {
  //   return this.iosGpuPromptEnabled;
  // }

  // setIosGpuPromptEnabled(enabled) {
  //   if (this.iosGpuPromptEnabled !== enabled) {
  //     this.iosGpuPromptEnabled = enabled;
  //   }
  // }

  isVboPromptEnabled() {
    return this.vboPromptEnabled;
  }

  setVboPromptEnabled(enabled) {
    if (this.vboPromptEnabled !== enabled) {
      this.vboPromptEnabled = enabled;
    }
  }
}
