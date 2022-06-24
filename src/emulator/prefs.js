import {
  isIos,
  isMacOs,
  isTouchSupported,
} from "@webrcade/app-common"

export class Prefs {
  constructor(emu) {
    this.emu = emu;
    const app = emu.getApp();

    const PREFS_PREFIX = "prefs";

    this.vboPath = app.getStoragePath(`${PREFS_PREFIX}.vboEnabled`);
    this.vboEnabled = true;
  }

  async load() {
    const storage = this.emu.getStorage();
    let enabled = await storage.get(this.vboPath);
    if (enabled === null) {
      enabled = !(isIos() || (isMacOs() && isTouchSupported()));
    } else {
      enabled = (enabled === "true");
    }
    this.vboEnabled = enabled;
  }

  async save() {
    const storage = this.emu.getStorage();
    await storage.put(this.vboPath, this.vboEnabled.toString());
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