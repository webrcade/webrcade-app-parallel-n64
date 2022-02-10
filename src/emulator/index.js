import {
  isIos,
  AppWrapper,
  Controller, 
  Controllers, 
  KeyCodeToControlMapping,
  DisplayLoop,
  ScriptAudioProcessor,
  UrlUtil,
  md5,
  u8ArrayToStr,
  CIDS,
  KCODES,
  LOG  
} from "@webrcade/app-common"

import { getCompatibilityMessage } from "./compat";

const UP      = 0x0001;
const DOWN    = 0x0002;
const LEFT    = 0x0004;
const RIGHT   = 0x0008;
const START   = 0x0010;
const R_KEY   = 0x0020;
const L_KEY   = 0x0040;
const Z_KEY   = 0x0080;
const A_KEY   = 0x0100;
const B_KEY   = 0x0200;
const CL_KEY  = 0x0400;
const CR_KEY  = 0x0800;
const CU_KEY  = 0x1000;
const CD_KEY  = 0x2000;

class N64KeyCodeToControlMapping extends KeyCodeToControlMapping {
  constructor() {
    super({
      [KCODES.ENTER]: CIDS.START,
      [KCODES.ESCAPE]: CIDS.ESCAPE
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
  }

  EMPTY_EEPROM_SAVE_MD5 = "e0deebd3c3f560212af17c68b9344bae";
  EEPROM_SAVE = "/save.eep";
  EMPTY_SRAM_SAVE_MD5 = "bb7df04e1b0a2570657527a7e108ae23";
  SRAM_SAVE = "/save.sra";
  EMPTY_FLASH_SAVE_MD5 = "41d2e2c0c0edfccf76fa1c3e38bc1cf2";
  FLASH_SAVE = "/save.fla";
  EMPTY_PAK_SAVE_MD5 = "bca9dca61f42308a5230074bc4d2ac87";
  PAK_SAVE_PREFIX = "/save.pak.";  

  async setRom(pal, name, bytes, md5) {
    return new Promise((resolve, reject) => {    
      if (bytes.byteLength === 0) {
        throw new Error("The size is invalid (0 bytes).");
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
          header: "Compatibility Issues",
          message: compatMsg,
          prompt: "Do you still wish to continue?",
          onYes: (prompt) => { prompt.close(); resolve(); },
          onNo: (prompt) => { prompt.close(); this.app.exit() }  
        });
      } else {
        resolve();
      }
    });
  }  

  createControllers() {
    return new Controllers([
      new Controller(new N64KeyCodeToControlMapping()),
      new Controller(),
      new Controller(),
      new Controller()
    ]);
  }  

  createAudioProcessor() {
    return new ScriptAudioProcessor(2, 44100).setDebug(false /*this.debug*/);
  }

  async onShowPauseMenu() {
    await this.saveState();
  }

  pollControls() {
    const { controllers } = this;
    
    controllers.poll();

    if (controllers.isControlDown(0, CIDS.LTRIG) ||
      controllers.isControlDown(0, CIDS.LANALOG) ||
      controllers.isControlDown(0, CIDS.RANALOG)) {
      this.escapeCount = this.escapeCount === -1 ? 0 : (this.escapeCount + 1);
    } else {
      this.escapeCount = -1;
    }

    for (let i = 0; i < 4; i++) {
      let input = 0;
      let axisX = 0;
      let axisY = 0;

      // Hack to reduce likelihood of accidentally bringing up menu
      if (controllers.isControlDown(0 /*i*/, CIDS.ESCAPE) && 
        (this.escapeCount >= 0 && this.escapeCount < 60)) {
        if (this.pause(true)) {
          controllers.waitUntilControlReleased(0 /*i*/, CIDS.ESCAPE)
            .then(() => this.showPauseMenu());
          return;
        }
      }
      if (controllers.isControlDown(i, CIDS.UP, false)) {
        input |= UP;
      }
      else if (controllers.isControlDown(i, CIDS.DOWN, false)) {
        input |= DOWN;
      }
      if (controllers.isControlDown(i, CIDS.RIGHT, false)) {
        input |= RIGHT;
      }
      else if (controllers.isControlDown(i, CIDS.LEFT, false)) {
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
      if (controllers.isControlDown(i, CIDS.LTRIG)) {
        input |= Z_KEY;
      }      
      if (controllers.isAxisLeft(i, 1)) {
        input |= CL_KEY;
      }            
      if (controllers.isAxisRight(i, 1)) {
        input |= CR_KEY;
      }            
      if (controllers.isAxisUp(i, 1)) {
        input |= CU_KEY;
      }            
      if (controllers.isAxisDown(i, 1)) {
        input |= CD_KEY;
      }            
      axisX = (controllers.getAxisValue(i, 0, true) * 0x7FFF) | 0;
      axisY = (controllers.getAxisValue(i, 0, false) * 0x7FFF) | 0;

      this.n64module._updateControls(i, input, axisX, axisY);
    }
  }
                             
  loadEmscriptenModule() {
    const { app } = this;

    return new Promise((resolve, reject) => {

      const script = document.createElement('script');
      document.body.appendChild(script);

      script.src = isIos()? 'js/n64wasm.js' : 'js/n64wasm-vbo.js';
      script.async = false;      
      script.onerror = () => {
        reject("An error occurred attempting to load the N64 engine.");
      }
      script.onload = () => {
        LOG.info('Script loaded.');
        if (window.n64) {
          window.n64()
            .then(n64module => {
              n64module.onAbort = msg => app.exit(msg);
              n64module.onExit = () => app.exit();  
              this.n64module = n64module;
              resolve();
            });
        } else {
          reject("An error occurred attempting to load the N64 engine.");
        }
      };
    });
  }

  async destroy() {
    console.log('destroy start')
    if (this.audioProcessor) {
      this.audioProcessor.pause(true);
    }
    console.log('destroy end')
  }

  async loadState() {
    const { app, n64module, romMd5, storage } = this;
    const FS = n64module.FS;

    let path = null;
    let res = null;
    let s = null;

    try {        
      res = FS.analyzePath(this.EEPROM_SAVE, true);
      if (!res.exists) {
        path = app.getStoragePath(`${romMd5}${this.EEPROM_SAVE}`);
        s = await storage.get(path);          
        if (s) {
          FS.writeFile(this.EEPROM_SAVE, s);
        }
      }
      res = FS.analyzePath(this.SRAM_SAVE, true);
      if (!res.exists) {
        path = app.getStoragePath(`${romMd5}${this.SRAM_SAVE}`);
        s = await storage.get(path);          
        if (s) {
          FS.writeFile(this.SRAM_SAVE, s);
        }
      }
      res = FS.analyzePath(this.FLASH_SAVE, true);
      if (!res.exists) {
        path = app.getStoragePath(`${romMd5}${this.FLASH_SAVE}`);
        s = await storage.get(path);          
        if (s) {
          FS.writeFile(this.FLASH_SAVE, s);
        }
      }
      for (let i = 0; i < 4; i++) {
        const pakName = `${this.PAK_SAVE_PREFIX}${i}`;
        res = FS.analyzePath(pakName, true);
        if (!res.exists) {
          path = app.getStoragePath(`${romMd5}${pakName}`);
          s = await storage.get(path);          
          if (s) {
            FS.writeFile(pakName, s);
          }
        }
      }
    } catch(e) {
      LOG.error(e);
    }
  }

  async saveState() {
    const { app, n64module, romMd5, storage } = this;
    const FS = n64module.FS;
    
    if (!this.started) return;

    let found = false;
    let path = "";

    try {
      // Force save
      n64module._writeSaves();

      let s = FS.readFile(this.EEPROM_SAVE);    
      if (s) {          
        path = app.getStoragePath(`${romMd5}${this.EEPROM_SAVE}`);
        if (md5(u8ArrayToStr(s)) !== this.EMPTY_EEPROM_SAVE_MD5) {        
          found = true;
          await this.saveStateToStorage(path, s, false);  
        } else {
          await storage.remove(path);
        }
      }
      s = FS.readFile(this.SRAM_SAVE);    
      if (s) {          
        path = app.getStoragePath(`${romMd5}${this.SRAM_SAVE}`);
        if (md5(u8ArrayToStr(s)) !== this.EMPTY_SRAM_SAVE_MD5) {        
          found = true;
          await this.saveStateToStorage(path, s, false);  
        } else {
          await storage.remove(path);
        }
      }
      s = FS.readFile(this.FLASH_SAVE);    
      if (s) {          
        path = app.getStoragePath(`${romMd5}${this.FLASH_SAVE}`);
        if (md5(u8ArrayToStr(s)) !== this.EMPTY_FLASH_SAVE_MD5) {        
          found = true;
          await this.saveStateToStorage(path, s, false);  
        } else {
          await storage.remove(path);
        }
      }
      for (let i = 0; i < 4; i++) {
        const pakName = `${this.PAK_SAVE_PREFIX}${i}`;
        s = FS.readFile(pakName);    
        if (s) {          
          path = app.getStoragePath(`${romMd5}${pakName}`);
          if (md5(u8ArrayToStr(s)) !== this.EMPTY_PAK_SAVE_MD5) {        
            found = true;
            await this.saveStateToStorage(path, s, false);  
          } else {
            await storage.remove(path);
          }
        }  
      }

      path = app.getStoragePath(`${romMd5}/sav`);
      if (found) {      
        await this.saveStateToStorage(path, null);
      } else {
        await storage.remove(path);
      }
    } catch(e) {
      LOG.error(e);
    }
  }

  async onStart(canvas) {
    const { app, debug, n64module, pal, romBytes } = this;

    try {
      // FS
      const FS = n64module.FS;      

      // Set the canvas for the module
      n64module.canvas = canvas; 
                
      // Load save state
      await this.loadState();

      // Load the ROM
      const filename = "custom.v64";
      const u8array = new Uint8Array(romBytes);
      FS.writeFile(filename, u8array);

      // Get skip count
      let skip = 0;
      try {
        const skipStr = UrlUtil.getParam(window.location.search, "n64.skip");
        if (skipStr) {
          skip = parseInt(skipStr)
        }
      } catch(e) {
        LOG.error("Error parsing skip: " + e);
      }

      // Start the emulator      
      n64module.callMain([filename]);      

      // Determine PAL mode      
      const isPal = pal ? true : (n64module._isPalSystem() === 1);
      LOG.info("pal mode: " + isPal); 

      // Create display loop
      this.displayLoop = new DisplayLoop(
        (isPal ? 50 : 60), // 60.13
        false, debug);

      this.displayLoop.setDebugCallback((msg) => {        
        return msg + ", Vbo: " + n64module._isVboEnabled() 
          + ", Tc: " + n64module._getTrimCount()
          + ", Skip: " + n64module._getSkipCount()
      });
      
      // Audio configuration
      let audioArray = null;
      window.audioCallback = (offset, length) => {        
        audioArray = new Int16Array(n64module.HEAP16.buffer, offset, 4096);
        this.audioProcessor.storeSoundCombinedInput(audioArray, 2, length, 0, 32768);
      }

      // Start the audio processor
      this.audioProcessor.start();      

      // Mark that the loop is starting
      this.started = true;

      // Start the display loop    
      let first = true;
      this.displayLoop.start(() => {        
        try {
          this.pollControls();
          n64module._runMainLoop();
          if (first) {
            if (skip > 0) {
              n64module._setSkipCount(skip);
            }
            first = false;
          }
        } catch (e) {
          app.exit(e);
        }
      });
    } catch(e) {
      LOG.error(e);
      app.exit(e);
    }
  }
}