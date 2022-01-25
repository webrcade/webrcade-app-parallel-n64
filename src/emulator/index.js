import {
  isIos,
  AppWrapper,
  Controller, 
  Controllers, 
  DefaultKeyCodeToControlMapping,
  DisplayLoop,
  ScriptAudioProcessor,
  CIDS,
  LOG  
} from "@webrcade/app-common"

// class ButtonMapping {
//   constructor(id, joy, cid) {
//     this.id = id;
//     this.joy = joy;
//     this.cid = cid;
//     this.down = false;
//   }    
// }

export class Emulator extends AppWrapper {
  constructor(app, debug = false) {
    super(app, debug);

    // this.port2 = port2;
    this.n64module = null;
    this.romBytes = null;
    this.romMd5 = null;
    this.romName = null;
    this.pal = null;
    this.saveStatePath = null;

    // const bmaps = [];
    // this.bmaps = bmaps;
    // for(let i = 0; i < this.controllerCount; i++) {
    //   const b = i * 12;
    //   bmaps.push(new ButtonMapping(b+0, i, CIDS.RIGHT));
    //   bmaps.push(new ButtonMapping(b+1, i, CIDS.LEFT));
    //   bmaps.push(new ButtonMapping(b+2, i, CIDS.DOWN));
    //   bmaps.push(new ButtonMapping(b+3, i, CIDS.UP));
    //   bmaps.push(new ButtonMapping(b+4, i, CIDS.START));
    //   bmaps.push(new ButtonMapping(b+5, i, CIDS.SELECT));
    //   bmaps.push(new ButtonMapping(b+6, i, CIDS.B));
    //   bmaps.push(new ButtonMapping(b+7, i, CIDS.A));
    //   bmaps.push(new ButtonMapping(b+8, i, CIDS.Y));
    //   bmaps.push(new ButtonMapping(b+9, i, CIDS.X));
    //   bmaps.push(new ButtonMapping(b+10, i, CIDS.LBUMP));
    //   bmaps.push(new ButtonMapping(b+11, i, CIDS.RBUMP));
    // }    
    // const controllers = this.controllers;
    // this.bcheck = map => {
    //   const down = controllers.isControlDown(map.joy, map.cid);
    //   if (down !== map.down) {
    //     window.Module._report_button(map.id, down);
    //     map.down = down;
    //   };
    // }
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

  createAudioProcessor() {
    return new ScriptAudioProcessor(2, 44100).setDebug(this.debug);
  }

  async onShowPauseMenu() {
    await this.saveState();
  }

  pollControls() {
    const { controllers, bmaps, bcheck } = this;
    
    controllers.poll();

    for (let i = 0; i < 2; i++) {
      if (controllers.isControlDown(i, CIDS.ESCAPE)) {
        if (this.pause(true)) {
          controllers.waitUntilControlReleased(i, CIDS.ESCAPE)
            .then(() => this.showPauseMenu());
          return;
        }
      }
    }

    // bmaps.forEach(bcheck);
  }
                             
  loadEmscriptenModule() {
    const { app } = this;

    return new Promise((resolve, reject) => {

      const script = document.createElement('script');
      document.body.appendChild(script);

      window.Module = {
        preRun: [],
        postRun: [],
        onAbort: msg => app.exit(msg),
        onExit: () => app.exit()
      }  

      script.src = isIos()? 'js/n64wasm.js' : 'js/n64wasm-vbo.js';
      script.async = true;      
      script.onerror = () => {
        reject("An error occurred attempting to load the N64 engine.");
      }
      script.onload = () => {
        LOG.info('Script loaded.');
        if (window.n64) {
          window.n64().then(n64module => {
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
        ((isPal ? 50 : (60.13)) / 2), 
        false, debug);

      this.displayLoop.setDebugCallback((msg) => {        
        return msg + ", vbo: " + n64module._isVboEnabled();
      });
      
      // Audio configuration
      this.audioBufferResampled = new Int16Array(
        n64module.HEAP16.buffer, n64module._getSoundBufferResampledAddress(), 64000);
      this.audioWritePosition = 0;
      this.audioReadPosition = 0;  

      // Start the audio processor
      this.audioProcessor.start();

      // Start the display loop
      const audioChannels = [new Array(64000), new Array(64000)];
      this.displayLoop.start(() => {
        try {
          n64module._runMainLoop();
          n64module._runMainLoop();

          this.audioWritePosition = n64module._getAudioWritePosition();
          let pos = 0;
          while (this.audioWritePosition !== this.audioReadPosition) {
            audioChannels[0][pos] = (this.audioBufferResampled[this.audioReadPosition] / 32768);
            audioChannels[1][pos++] = (this.audioBufferResampled[this.audioReadPosition + 1] / 32768);
            this.audioReadPosition += 2;
            if (this.audioReadPosition === 64000) {
              this.audioReadPosition = 0;
            }
          }
          this.audioProcessor.storeSound(audioChannels, pos);

          this.pollControls();
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
