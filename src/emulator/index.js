import {
  isIos,
  isMacOs,
  isTouchSupported,
  AppWrapper,
  Controller,
  Controllers,
  KeyCodeToControlMapping,
  DisplayLoop,
  ScriptAudioProcessor,
  UAParser,
  UrlUtil,
  md5,
  u8ArrayToStr,
  CIDS,
  KCODES,
  LOG,
} from '@webrcade/app-common';

import { getCompatibilityMessage } from './compat';
import { Prefs } from './prefs';

const UP = 0x0001;
const DOWN = 0x0002;
const LEFT = 0x0004;
const RIGHT = 0x0008;
const START = 0x0010;
const R_KEY = 0x0020;
const L_KEY = 0x0040;
const Z_KEY = 0x0080;
const A_KEY = 0x0100;
const B_KEY = 0x0200;
const CL_KEY = 0x0400;
const CR_KEY = 0x0800;
const CU_KEY = 0x1000;
const CD_KEY = 0x2000;

const ANALOG_BIT = 0x8000;
const ANALOG_UP = ANALOG_BIT | CIDS.UP;
const ANALOG_DOWN = ANALOG_BIT | CIDS.DOWN;
const ANALOG_LEFT = ANALOG_BIT | CIDS.LEFT;
const ANALOG_RIGHT = ANALOG_BIT | CIDS.RIGHT;

const C_BIT = 0x4000;
const C_UP = C_BIT | CIDS.UP;
const C_DOWN = C_BIT | CIDS.DOWN;
const C_LEFT = C_BIT | CIDS.LEFT;
const C_RIGHT = C_BIT | CIDS.RIGHT;

const ANALOG_50 = 0x2000;
const ANALOG_25 = 0x1000;

// class N64KeyCodeToControlMapping extends KeyCodeToControlMapping {
//   constructor() {
//     super({
//       [KCODES.ENTER]: CIDS.START,
//       [KCODES.ESCAPE]: CIDS.ESCAPE,
//       [KCODES.ARROW_UP]: ANALOG_UP,
//       [KCODES.ARROW_DOWN]: ANALOG_DOWN,
//       [KCODES.ARROW_RIGHT]: ANALOG_RIGHT,
//       [KCODES.ARROW_LEFT]: ANALOG_LEFT,
//       [KCODES.SHIFT_LEFT]: CIDS.A, // A button
//       [KCODES.CONTROL_LEFT]: CIDS.X, // B button
//       [KCODES.Z]: CIDS.RTRIG, // Z button
//       [KCODES.X]: CIDS.LBUMP, // L button
//       [KCODES.C]: CIDS.RBUMP, // R button
//       [KCODES.W]: CIDS.UP, // D-pad (up)
//       [KCODES.A]: CIDS.LEFT, // D-pad (left)
//       [KCODES.S]: CIDS.DOWN, // D-pad (down)
//       [KCODES.D]: CIDS.RIGHT, // D-pad (right)
//       [KCODES.I]: C_UP, // C-pad (up)
//       [KCODES.J]: C_LEFT, // C-pad (left)
//       [KCODES.K]: C_DOWN, // C-pad (down)
//       [KCODES.L]: C_RIGHT, // C-pad (right)
//       [KCODES.CONTROL_RIGHT]: ANALOG_50, // Analog 50%
//       [KCODES.SHIFT_RIGHT]: ANALOG_25, // Analog 25%
//     });
//   }
// }

class N64KeyCodeToControlMapping2 extends KeyCodeToControlMapping {
  constructor() {
    super({
      [KCODES.ENTER]: CIDS.START,
      [KCODES.ESCAPE]: CIDS.ESCAPE,
      [KCODES.ARROW_UP]: ANALOG_UP,
      [KCODES.ARROW_DOWN]: ANALOG_DOWN,
      [KCODES.ARROW_RIGHT]: ANALOG_RIGHT,
      [KCODES.ARROW_LEFT]: ANALOG_LEFT,
      [KCODES.C]: CIDS.LBUMP, // L button
      [KCODES.V]: CIDS.RBUMP, // R button
      [KCODES.Z]: CIDS.X, // B Button
      [KCODES.X]: CIDS.A, // A button
      [KCODES.SPACE_BAR]: CIDS.RTRIG, // Z button
      [KCODES.W]: C_UP, // D-pad (up)
      [KCODES.A]: C_LEFT, // D-pad (left)
      [KCODES.S]: C_DOWN, // D-pad (down)
      [KCODES.D]: C_RIGHT, // D-pad (right)
      [KCODES.I]: CIDS.UP, // C-pad (up)
      [KCODES.J]: CIDS.LEFT, // C-pad (left)
      [KCODES.K]: CIDS.DOWN, // C-pad (down)
      [KCODES.L]: CIDS.RIGHT, // C-pad (right)
      [KCODES.CONTROL_RIGHT]: ANALOG_50, // Analog 50%
      [KCODES.CONTROL_LEFT]: ANALOG_50, // Analog 50%
      [KCODES.SHIFT_RIGHT]: ANALOG_25, // Analog 25%
      [KCODES.SHIFT_LEFT]: ANALOG_25, // Analog 25%
    });
  }
}


window.audioCallback = null;

export class Emulator extends AppWrapper {
  constructor(app, debug = false) {
    super(app, debug);

    this.n64module = null;
    this.romBytes = null;
    this.romMd5 = null;
    this.romName = null;
    this.pal = null;
    this.saveStatePath = null;
    this.started = false;
    this.escapeCount = -1;
    this.prefs = new Prefs(this);
    this.lastSound = 0;
  }

  EMPTY_EEPROM_SAVE_MD5 = 'e0deebd3c3f560212af17c68b9344bae';
  EEPROM_SAVE = '/save.eep';
  EMPTY_SRAM_SAVE_MD5 = 'bb7df04e1b0a2570657527a7e108ae23';
  SRAM_SAVE = '/save.sra';
  EMPTY_FLASH_SAVE_MD5 = '41d2e2c0c0edfccf76fa1c3e38bc1cf2';
  FLASH_SAVE = '/save.fla';
  EMPTY_PAK_SAVE_MD5 = 'bca9dca61f42308a5230074bc4d2ac87';
  PAK_SAVE_PREFIX = '/save.pak.';

  getPrefs() {
    return this.prefs;
  }

  async checkPlatform() {

    // Make sure preferences have been loaded
    await this.prefs.load();

    return new Promise((resolve, reject) => {
      const parser = UAParser();

      let issue = false;
      if (parser.os.name.toLowerCase().includes("ios")) {
        const ver = parser.os.version.split(".");
        if (ver.length > 0) {
          if (ver[0] >= 16) {
            issue = true;
          }
        }
      }

      if (this.prefs.isIosGpuPromptEnabled() && issue) {
        this.app.yesNoPrompt({
          header: 'iOS 16+ Performance Issue',
          message: "A recent change in iOS 16 has significantly reduced N64 performance\n" +
                   "Disable the following Safari experimental feature to undo this change:\n" +
                   "Settings > Safari > Advanced > Experimental Features > GPU Process: WebGL\n\n" +
                   "See 'https://docs.webrcade.com/apps/emulators/n64/' for additional information.",
          prompt: 'Do you wish to skip this message in the future?',
          onYes: (prompt) => {
            prompt.close();
            this.prefs.setIosGpuPromptEnabled(false);
            this.prefs.save();
            resolve();
          },
          onNo: (prompt) => {
            prompt.close();
            resolve();
          },
        });
      } else {
        resolve();
      }
    });
  }

  async setRom(pal, name, bytes, md5) {
    return new Promise((resolve, reject) => {
      if (bytes.byteLength === 0) {
        throw new Error('The size is invalid (0 bytes).');
      }
      this.romName = name;
      this.romMd5 = md5;
      this.romBytes = bytes;
      this.pal = pal;
      if (this.pal === null || this.pal === undefined) {
        this.pal = false;
      }

      LOG.info('name: ' + this.romName);
      LOG.info('md5: ' + this.romMd5);
      LOG.info('pal: ' + this.pal);

      const compatMsg = getCompatibilityMessage(this.romMd5);
      if (compatMsg) {
        this.app.yesNoPrompt({
          header: 'Compatibility Issues',
          message: compatMsg,
          prompt: 'Do you still wish to continue?',
          onYes: (prompt) => {
            prompt.close();
            resolve();
          },
          onNo: (prompt) => {
            prompt.close();
            this.app.exit();
          },
        });
      } else {
        resolve();
      }
    });
  }

  createControllers() {
    this.keyToControlMapping = new N64KeyCodeToControlMapping2();
    return new Controllers([
      new Controller(this.keyToControlMapping),
      new Controller(),
      new Controller(),
      new Controller(),
    ]);
  }

  createAudioProcessor() {
    return new ScriptAudioProcessor(2, 44100).setDebug(false /*this.debug*/);
  }

  async onShowPauseMenu() {
    await this.saveState();
  }

  onPause(p, isMenu) {
    if (!p && isMenu) {
      this.lastSound = Date.now();
    }
  }

  pollControls() {
    const { controllers, keyToControlMapping } = this;

    controllers.poll();

    if (
      controllers.isControlDown(0, CIDS.LTRIG) ||
      controllers.isControlDown(0, CIDS.LANALOG) ||
      controllers.isControlDown(0, CIDS.RANALOG)
    ) {
      this.escapeCount = this.escapeCount === -1 ? 0 : this.escapeCount + 1;
    } else {
      this.escapeCount = -1;
    }

    for (let i = 0; i < 4; i++) {
      let input = 0;
      let axisX = 0;
      let axisY = 0;

      // Hack to reduce likelihood of accidentally bringing up menu
      if (
        controllers.isControlDown(0 /*i*/, CIDS.ESCAPE) &&
        (this.escapeCount === -1 || this.escapeCount < 60)
      ) {
        if (this.pause(true)) {
          controllers
            .waitUntilControlReleased(0 /*i*/, CIDS.ESCAPE)
            .then(() => this.showPauseMenu());
          return;
        }
      }
      if (controllers.isControlDown(i, CIDS.UP, false)) {
        input |= UP;
      } else if (controllers.isControlDown(i, CIDS.DOWN, false)) {
        input |= DOWN;
      }
      if (controllers.isControlDown(i, CIDS.RIGHT, false)) {
        input |= RIGHT;
      } else if (controllers.isControlDown(i, CIDS.LEFT, false)) {
        input |= LEFT;
      }
      if (controllers.isControlDown(i, CIDS.START)) {
        input |= START;
      }
      if (controllers.isControlDown(i, CIDS.A)) {
        input |= A_KEY;
      }
      if (controllers.isControlDown(i, CIDS.X)) {
        input |= B_KEY;
      }
      if (controllers.isControlDown(i, CIDS.LBUMP)) {
        input |= L_KEY;
      }
      if (controllers.isControlDown(i, CIDS.RBUMP)) {
        input |= R_KEY;
      }
      if (
        controllers.isControlDown(i, CIDS.LTRIG) ||
        controllers.isControlDown(i, CIDS.RTRIG)
      ) {
        input |= Z_KEY;
      }
      if (controllers.isAxisLeft(i, 1) ||
        (i === 0 && keyToControlMapping.isControlDown(C_LEFT))) {
        input |= CL_KEY;
      }
      if (controllers.isAxisRight(i, 1) ||
        (i === 0 && keyToControlMapping.isControlDown(C_RIGHT))) {
        input |= CR_KEY;
      }
      if (controllers.isAxisUp(i, 1) ||
        (i === 0 && keyToControlMapping.isControlDown(C_UP))) {
        input |= CU_KEY;
      }
      if (controllers.isAxisDown(i, 1) ||
        (i === 0 && keyToControlMapping.isControlDown(C_DOWN))) {
        input |= CD_KEY;
      }
      axisX = (controllers.getAxisValue(i, 0, true) * 0x7fff) | 0;
      axisY = (controllers.getAxisValue(i, 0, false) * 0x7fff) | 0;

      if (i === 0) {
        let multiplier = 1;
        if (keyToControlMapping.isControlDown(ANALOG_50) ||
          keyToControlMapping.isControlDown(ANALOG_25)) {
          if (keyToControlMapping.isControlDown(ANALOG_50)) {
            multiplier -= 0.50;
          }
          if (keyToControlMapping.isControlDown(ANALOG_25)) {
            multiplier -= 0.25;
          }
        }

        if (keyToControlMapping.isControlDown(ANALOG_RIGHT)) {
          axisX = (multiplier * 0x7fff) | 0;
        }
        if (keyToControlMapping.isControlDown(ANALOG_LEFT)) {
          axisX = (-multiplier * 0x7fff) | 0;
        }
        if (keyToControlMapping.isControlDown(ANALOG_UP)) {
          axisY = (-multiplier * 0x7fff) | 0;
        }
        if (keyToControlMapping.isControlDown(ANALOG_DOWN)) {
          axisY = (multiplier * 0x7fff) | 0;
        }
      }

      this.n64module._updateControls(i, input, axisX, axisY);
    }
  }

  loadEmscriptenModule() {
    const { app } = this;

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      document.body.appendChild(script);
      script.src = 'js/n64wasm-vbo.js';
      script.async = false;
      script.onerror = () => {
        reject('An error occurred attempting to load the N64 engine.');
      };
      script.onload = () => {
        LOG.info('Script loaded.');
        if (window.n64) {
          window.n64().then((n64module) => {
            n64module.onAbort = (msg) => app.exit(msg);
            n64module.onExit = () => app.exit();
            this.n64module = n64module;
            resolve();
          });
        } else {
          reject('An error occurred attempting to load the N64 engine.');
        }
      };
    });
  }

  async destroy() {
    console.log('destroy start');
    if (this.audioProcessor) {
      this.audioProcessor.pause(true);
    }
    console.log('destroy end');
  }

  async migrateSaves() {
    const { app, romMd5, storage } = this;

    // Load old saves (if applicable)
    const files = [];

    const eepromPath = app.getStoragePath(`${romMd5}${this.EEPROM_SAVE}`);
    let s = await storage.get(eepromPath);
    if (s) {
      files.push({
        name: this.EEPROM_SAVE.slice(1),
        content: s,
      });
    }
    const sramPath = app.getStoragePath(`${romMd5}${this.SRAM_SAVE}`);
    s = await storage.get(sramPath);
    if (s) {
      files.push({
        name: this.SRAM_SAVE.slice(1),
        content: s,
      });
    }
    const flashPath = app.getStoragePath(`${romMd5}${this.FLASH_SAVE}`);
    s = await storage.get(flashPath);
    if (s) {
      files.push({
        name: this.FLASH_SAVE.slice(1),
        content: s,
      });
    }
    for (let i = 0; i < 4; i++) {
      const pakName = `${this.PAK_SAVE_PREFIX}${i}`;
      const pakPath = app.getStoragePath(`${romMd5}${pakName}`);
      s = await storage.get(pakPath);
      if (s) {
        files.push({
          name: pakName.slice(1),
          content: s,
        });
      }
    }

    if (files.length > 0) {
      LOG.info('Migrating local saves.');
      const saveStatePath = app.getStoragePath(`${romMd5}/sav`);

      await this.getSaveManager().saveLocal(saveStatePath, files);

      // Delete old location (and info)
      await storage.remove(eepromPath);
      await storage.remove(sramPath);
      await storage.remove(flashPath);
      for (let i = 0; i < 4; i++) {
        const pakName = `${this.PAK_SAVE_PREFIX}${i}`;
        const pakPath = app.getStoragePath(`${romMd5}${pakName}`);
        await storage.remove(pakPath);
      }
      await storage.remove(`${saveStatePath}/info`);
    }
  }

  async loadState() {
    const { app, n64module, romMd5 /*, storage*/ } = this;
    const FS = n64module.FS;

    // let path = null;
    // let res = null;
    // let s = null;

    try {
      // Migrate old save format
      await this.migrateSaves();

      // Load save files
      const saveStatePath = app.getStoragePath(`${romMd5}/sav`);
      const files = await this.getSaveManager().load(
        saveStatePath,
        this.loadMessageCallback,
      );

      if (files) {
        for (let i = 0; i < files.length; i++) {
          const f = files[i];
          if (f.name === this.EEPROM_SAVE.slice(1)) {
            LOG.info('writing ' + f.name);
            FS.writeFile(this.EEPROM_SAVE, f.content);
          } else if (f.name === this.SRAM_SAVE.slice(1)) {
            LOG.info('writing ' + f.name);
            FS.writeFile(this.SRAM_SAVE, f.content);
          } else if (f.name === this.FLASH_SAVE.slice(1)) {
            LOG.info('writing ' + f.name);
            FS.writeFile(this.FLASH_SAVE, f.content);
          } else if (f.name.startsWith(this.PAK_SAVE_PREFIX.slice(1))) {
            LOG.info('writing ' + f.name);
            FS.writeFile('/' + f.name, f.content);
          }
        }

        // Cache the initial files
        await this.getSaveManager().checkFilesChanged(files);
      }

      // res = FS.analyzePath(this.EEPROM_SAVE, true);
      // if (!res.exists) {
      //   path = app.getStoragePath(`${romMd5}${this.EEPROM_SAVE}`);
      //   s = await storage.get(path);
      //   if (s) {
      //     FS.writeFile(this.EEPROM_SAVE, s);
      //   }
      // }
      // res = FS.analyzePath(this.SRAM_SAVE, true);
      // if (!res.exists) {
      //   path = app.getStoragePath(`${romMd5}${this.SRAM_SAVE}`);
      //   s = await storage.get(path);
      //   if (s) {
      //     FS.writeFile(this.SRAM_SAVE, s);
      //   }
      // }
      // res = FS.analyzePath(this.FLASH_SAVE, true);
      // if (!res.exists) {
      //   path = app.getStoragePath(`${romMd5}${this.FLASH_SAVE}`);
      //   s = await storage.get(path);
      //   if (s) {
      //     FS.writeFile(this.FLASH_SAVE, s);
      //   }
      // }
      // for (let i = 0; i < 4; i++) {
      //   const pakName = `${this.PAK_SAVE_PREFIX}${i}`;
      //   res = FS.analyzePath(pakName, true);
      //   if (!res.exists) {
      //     path = app.getStoragePath(`${romMd5}${pakName}`);
      //     s = await storage.get(path);
      //     if (s) {
      //       FS.writeFile(pakName, s);
      //     }
      //   }
      // }
    } catch (e) {
      LOG.error('Error loading save state: ' + e);
    }
  }

  async saveState() {
    const { app, n64module, romMd5 /*, storage*/ } = this;
    const FS = n64module.FS;

    if (!this.started) return;

    //let found = false;
    let path = '';

    try {
      // Force save
      n64module._writeSaves();

      const files = [];

      // TODO: CHECK READ (otherwise throws exception...)

      let s = FS.readFile(this.EEPROM_SAVE);
      if (s) {
        path = app.getStoragePath(`${romMd5}${this.EEPROM_SAVE}`);
        if (md5(u8ArrayToStr(s)) !== this.EMPTY_EEPROM_SAVE_MD5) {
          files.push({
            name: this.EEPROM_SAVE.slice(1),
            content: s,
          });
        }
      }
      s = FS.readFile(this.SRAM_SAVE);
      if (s) {
        path = app.getStoragePath(`${romMd5}${this.SRAM_SAVE}`);
        if (md5(u8ArrayToStr(s)) !== this.EMPTY_SRAM_SAVE_MD5) {
          files.push({
            name: this.SRAM_SAVE.slice(1),
            content: s,
          });
        }
      }
      s = FS.readFile(this.FLASH_SAVE);
      if (s) {
        path = app.getStoragePath(`${romMd5}${this.FLASH_SAVE}`);
        if (md5(u8ArrayToStr(s)) !== this.EMPTY_FLASH_SAVE_MD5) {
          files.push({
            name: this.FLASH_SAVE.slice(1),
            content: s,
          });
        }
      }
      for (let i = 0; i < 4; i++) {
        const pakName = `${this.PAK_SAVE_PREFIX}${i}`;
        s = FS.readFile(pakName);
        if (s) {
          path = app.getStoragePath(`${romMd5}${pakName}`);
          if (md5(u8ArrayToStr(s)) !== this.EMPTY_PAK_SAVE_MD5) {
            files.push({
              name: pakName.slice(1),
              content: s,
            });
          }
        }
      }

      path = app.getStoragePath(`${romMd5}/sav`);
      if (files.length > 0) {
        if (await this.getSaveManager().checkFilesChanged(files)) {
          await this.getSaveManager().save(
            path,
            files,
            this.saveMessageCallback,
          );
        }
      } else {
        await this.getSaveManager().delete(path);
      }

      // let s = FS.readFile(this.EEPROM_SAVE);
      // if (s) {
      //   path = app.getStoragePath(`${romMd5}${this.EEPROM_SAVE}`);
      //   if (md5(u8ArrayToStr(s)) !== this.EMPTY_EEPROM_SAVE_MD5) {
      //     found = true;
      //     await this.saveStateToStorage(path, s, false);
      //   } else {
      //     await storage.remove(path);
      //   }
      // }
      // s = FS.readFile(this.SRAM_SAVE);
      // if (s) {
      //   path = app.getStoragePath(`${romMd5}${this.SRAM_SAVE}`);
      //   if (md5(u8ArrayToStr(s)) !== this.EMPTY_SRAM_SAVE_MD5) {
      //     found = true;
      //     await this.saveStateToStorage(path, s, false);
      //   } else {
      //     await storage.remove(path);
      //   }
      // }
      // s = FS.readFile(this.FLASH_SAVE);
      // if (s) {
      //   path = app.getStoragePath(`${romMd5}${this.FLASH_SAVE}`);
      //   if (md5(u8ArrayToStr(s)) !== this.EMPTY_FLASH_SAVE_MD5) {
      //     found = true;
      //     await this.saveStateToStorage(path, s, false);
      //   } else {
      //     await storage.remove(path);
      //   }
      // }
      // for (let i = 0; i < 4; i++) {
      //   const pakName = `${this.PAK_SAVE_PREFIX}${i}`;
      //   s = FS.readFile(pakName);
      //   if (s) {
      //     path = app.getStoragePath(`${romMd5}${pakName}`);
      //     if (md5(u8ArrayToStr(s)) !== this.EMPTY_PAK_SAVE_MD5) {
      //       found = true;
      //       await this.saveStateToStorage(path, s, false);
      //     } else {
      //       await storage.remove(path);
      //     }
      //   }
      // }

      // path = app.getStoragePath(`${romMd5}/sav`);
      // if (found) {
      //   await this.saveStateToStorage(path, null);
      // } else {
      //   await storage.remove(path);
      // }
    } catch (e) {
      LOG.error('Error persisting save state: ' + e);
    }
  }

  enableVbo(enable) {
    const { n64module } = this;
    n64module._setVboEnabled(enable);
  }

  async onStart(canvas) {
    const { app, debug, n64module, pal, prefs, romBytes } = this;

    try {
      // FS
      const FS = n64module.FS;

      // Set the canvas for the module
      n64module.canvas = canvas;

      // Load preferences
      await this.prefs.load();

      // Load save state
      await this.loadState();

      // Load the ROM
      const filename = 'custom.v64';
      const u8array = new Uint8Array(romBytes);
      FS.writeFile(filename, u8array);

      // Get skip count
      let skip = 0;
      try {
        const skipStr = UrlUtil.getParam(window.location.search, 'n64.skip');
        if (skipStr) {
          skip = parseInt(skipStr);
        }
      } catch (e) {
        LOG.error('Error parsing skip: ' + e);
      }

      // Determine the zoom level
      let zoomLevel = 0;
      if (this.getProps().zoomLevel) {
        zoomLevel = this.getProps().zoomLevel;
      }

      // width: 96vw;
      // height: 96vh;
      // max-width: calc(96vh * 1.333);
      // max-height: calc(96vw * 0.75);

      const size = 96 + zoomLevel;
      canvas.style.setProperty('width', `${size}vw`, 'important');
      canvas.style.setProperty('height', `${size}vh`, 'important');
      canvas.style.setProperty('max-width', `calc(${size}vh*1.333)`, 'important');
      canvas.style.setProperty('max-height', `calc(${size}vw*0.75)`, 'important');

      // Start the emulator
      n64module.callMain([filename]);

      // Determine PAL mode
      const isPal = pal ? true : n64module._isPalSystem() === 1;
      LOG.info('pal mode: ' + isPal);
      const frameRate = isPal ? 50 : 60;

      // Create display loop
      this.displayLoop = new DisplayLoop(frameRate, false, debug);

      this.displayLoop.setDebugCallback((msg) => {
        return (
          msg +
          ', Vbo: ' +
          n64module._isVboEnabled() +
          ', Tc: ' +
          n64module._getTrimCount() +
          ', Skip: ' +
          n64module._getSkipCount() +
          ', isMac: ' +
          isMacOs() +
          ', isIos: ' +
          isIos() +
          ', isTouch: ' +
          isTouchSupported()
        );
      });

      // Audio configuration
      let audioArray = null;

      this.lastSound = Date.now();

      const emu = this;

      let audioStarted = false;

      window.audioCallback = (offset, length) => {
        if (!audioStarted) return;

        if (isIos()) {
          let now = Date.now();
          if (now - this.lastSound > 1000) {
            if (this.audioProcessor) {
              this.audioProcessor.pause(true);
              this.audioProcessor = this.createAudioProcessor();
              emu.addAudioProcessorCallback(this.audioProcessor);
              this.audioProcessor.start(true);
              this.app.setShowOverlay(true);
            }
          }
          this.lastSound = now;
        }
        audioArray = new Int16Array(n64module.HEAP16.buffer, offset, 4096);
        this.audioProcessor.storeSoundCombinedInput(
          audioArray,
          2,
          length,
          0,
          32768,
        );
      };

      // Mark that the loop is starting
      let first = true;
      this.started = true;

      // Enable show message
      this.setShowMessageEnabled(true);

      // Start the display loop
      this.displayLoop.start(() => {
        this.pollControls();
        n64module._runMainLoop();
        try {
          if (first) {
            this.enableVbo(prefs.isVboEnabled());

            // Start the audio processor
            setTimeout(() => {
              this.lastSound = Date.now() + 5000;
              this.audioProcessor.start();
              audioStarted = true;
            }, 0);

            if (skip > 0) {
              n64module._setSkipCount(skip);
            }

            first = false;
          }
        } catch (e) {
          app.exit(e);
        }
      });
    } catch (e) {
      LOG.error(e);
      app.exit(e);
    }
  }
}
