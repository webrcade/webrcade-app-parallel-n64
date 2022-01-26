import {
  isIos,
  AppWrapper,
  Controller, 
  Controllers, 
  KeyCodeToControlMapping,
  DisplayLoop,
  ScriptAudioProcessor,
  CIDS,
  KCODES,
  LOG  
} from "@webrcade/app-common"


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
  }

  SRAM_FILE = '/rom.srm';

  setRom(pal, name, bytes, md5) {
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
  }  

  createControllers() {
    return new Controllers([
      new Controller(new N64KeyCodeToControlMapping())
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

    for (let i = 0; i < 1; i++) {
      let input = 0;
      let axisX = 0;
      let axisY = 0;

      if (controllers.isControlDown(i, CIDS.ESCAPE)) {
        if (this.pause(true)) {
          controllers.waitUntilControlReleased(i, CIDS.ESCAPE)
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

      this.n64module._updateControls(input, axisX, axisY);
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
              console.log(n64module);
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
    // const { saveStatePath, storage, SRAM_FILE } = this;
    // const { FS } = window;

    // // Write the save state (if applicable)
    // try {
    //   // Create the save path (MEM FS)
    //   const res = FS.analyzePath(SRAM_FILE, true);
    //   if (!res.exists) {
    //     const s = await storage.get(saveStatePath);
    //     if (s) {
    //       LOG.info('writing sram file.');
    //       FS.writeFile(SRAM_FILE, s);
    //     }
    //   }
    // } catch (e) {
    //   LOG.error(e);
    // }    
  }

  async saveState() {
    // const { saveStatePath, started, SRAM_FILE } = this;
    // const { Module, FS } = window;
    // if (!started || !saveStatePath) {
    //   return;
    // }
    
    // Module._S9xAutoSaveSRAM();    
    // const res = FS.analyzePath(SRAM_FILE, true);
    // if (res.exists) {
    //   const s = FS.readFile(SRAM_FILE);              
    //   if (s) {
    //     LOG.info('saving sram.');
    //     await this.saveStateToStorage(saveStatePath, s);
    //   }
    // }
  }

  async onStart(canvas) {
    const { app, debug, n64module, pal, romBytes, romMd5 } = this;

    try {
      // FS
      const FS = n64module.FS;

      // Set the canvas for the module
      n64module.canvas = canvas; 
          
      // Force PAL if applicable
      if (pal) {
        // Module._force_pal(1);
      }

      // Enable debug settings
      if (debug) {
        // Module._show_fps(1);
      }

      // Disable Emscripten capturing events
      //window.SDL.receiveEvent = (event) => {}

      // Load save state
      this.saveStatePath = app.getStoragePath(`${romMd5}/sav`);
      await this.loadState();

      // Load the ROM
      const filename = "custom.v64";
      const u8array = new Uint8Array(romBytes);
      FS.writeFile(filename, u8array);

      n64module.callMain([filename]);

      // Determine PAL mode      
      const isPal = pal ? true : (n64module._isPalSystem() === 1);
      LOG.info("pal mode: " + isPal); 

      // Create display loop
      this.displayLoop = new DisplayLoop(
        ((isPal ? 50 : 60) / 1), // 60.13
        false, debug);

      this.displayLoop.setDebugCallback((msg) => {        
        return msg + ", vbo: " + n64module._isVboEnabled();
      });
      
      // Audio configuration
      let audioArray = null;
      window.audioCallback = (offset, length) => {        
        audioArray = new Int16Array(n64module.HEAP16.buffer, offset, 4096);
        this.audioProcessor.storeSoundCombinedInput(audioArray, 2, length, 0, 32768);
      }

      // Start the audio processor
      this.audioProcessor.start();      

      // Start the display loop    
      this.displayLoop.start(() => {
        try {
          this.pollControls();
          n64module._runMainLoop();
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
