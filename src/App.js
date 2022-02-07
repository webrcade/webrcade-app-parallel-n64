import {
  blobToStr,
  md5,  
  romNameScorer,
  AppRegistry,
  FetchAppData, 
  Resources, 
  Unzip, 
  UrlUtil, 
  WebrcadeApp, 
  APP_TYPE_KEYS,
  LOG,
  TEXT_IDS 
} from '@webrcade/app-common'
import { Emulator } from './emulator'

import './App.scss';

class App extends WebrcadeApp {
  emulator = null;

  componentDidMount() {
    super.componentDidMount();

    const { appProps, ModeEnum } = this;

    const exts = 
      AppRegistry.instance.getExtensions(APP_TYPE_KEYS.PARALLEL_N64, true, false);
    const extsNotUnique = 
      AppRegistry.instance.getExtensions(APP_TYPE_KEYS.PARALLEL_N64, true, true);    

    try {
      // Get the ROM location that was specified
      const rom = appProps.rom;
      if (!rom) throw new Error("A ROM file was not specified.");
      const pal = appProps.pal !== undefined ? appProps.pal === true : null;

      // Create the emulator
      if (this.emulator === null) {
        this.emulator = new Emulator(this, this.isDebug());
      }
      const emulator = this.emulator;

      // Load emscripten and the ROM
      const uz = new Unzip().setDebug(this.isDebug());
      let romBlob = null;
      let romMd5 = null;
      emulator.loadEmscriptenModule()
        .then(() => new FetchAppData(rom).fetch())
        .then(response => { LOG.info('downloaded.'); return response.blob() })
        .then(blob => uz.unzip(blob, extsNotUnique, exts, romNameScorer))
        .then(blob => { romBlob = blob; return blob; })
        .then(blob => blobToStr(blob))
        .then(str => { romMd5 = md5(str); })
        .then(() => new Response(romBlob).arrayBuffer())
        .then(bytes => emulator.setRom(
          pal,
          uz.getName() ? uz.getName() : UrlUtil.getFileName(rom),
          bytes,
          romMd5))
        .then(() => this.setState({ mode: ModeEnum.LOADED }))
        .catch(msg => {
          LOG.error(msg);
          this.exit(this.isDebug() ? msg : Resources.getText(TEXT_IDS.ERROR_RETRIEVING_GAME));
        })
    } catch (e) {
      this.exit(e);
    }
  }

  async onPreExit() {
    try {
      await super.onPreExit();
      if (this.emulator) {
        await this.emulator.saveState();
        await this.emulator.destroy();
      }
    } catch (e) {
      LOG.error(e);
    }
  }

  componentDidUpdate() {
    const { mode } = this.state;
    const { canvas, emulator, ModeEnum } = this;

    if (mode === ModeEnum.LOADED) {
      window.focus();
      // Start the emulator
      emulator.start(canvas);
    }
  }

  renderCanvas() {
    return (
      <canvas ref={canvas => { this.canvas = canvas; }} id="canvas"></canvas>
    );
  }

  render() {
    const { mode } = this.state;
    const { ModeEnum } = this;

    return (
      <>
        { super.render()}
        { mode === ModeEnum.LOADING ? this.renderLoading() : null}
        { mode === ModeEnum.PAUSE ? this.renderPauseScreen() : null}        
        { mode === ModeEnum.LOADED || mode === ModeEnum.PAUSE  ? this.renderCanvas() : null}
      </>
    );
  }
}

export default App;
