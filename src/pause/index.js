import React from 'react';
import { Component } from 'react';

import { N64SettingsEditor } from './settings';
import { GamepadControlsTab, KeyboardControlsTab } from './controls';

import {
  CustomPauseScreen,
  EditorScreen,
  GamepadWhiteImage,
  KeyboardWhiteImage,
  PauseScreenButton,
  Resources,
  SettingsAppWhiteImage,
  TEXT_IDS,
} from '@webrcade/app-common';

export class N64PauseScreen extends Component {
  constructor() {
    super();
    this.state = {
      mode: this.ModeEnum.PAUSE,
    };
  }

  ModeEnum = {
    PAUSE: 'pause',
    CONTROLS: 'controls',
    N64_SETTINGS: 'n64-settings',
  };

  ADDITIONAL_BUTTON_REFS = [React.createRef(), React.createRef()];

  render() {
    const { ADDITIONAL_BUTTON_REFS, ModeEnum } = this;
    const { appProps, closeCallback, emulator, exitCallback, isEditor, isStandalone } =
      this.props;
    const { mode } = this.state;

    return (
      <>
        {mode === ModeEnum.PAUSE ? (
          <CustomPauseScreen
            appProps={appProps}
            closeCallback={closeCallback}
            exitCallback={exitCallback}
            isEditor={isEditor}
            isStandalone={isStandalone}
            additionalButtonRefs={ADDITIONAL_BUTTON_REFS}
            additionalButtons={[
              <PauseScreenButton
                imgSrc={GamepadWhiteImage}
                buttonRef={ADDITIONAL_BUTTON_REFS[0]}
                label={Resources.getText(TEXT_IDS.VIEW_CONTROLS)}
                onHandlePad={(focusGrid, e) =>
                  focusGrid.moveFocus(e.type, ADDITIONAL_BUTTON_REFS[0])
                }
                onClick={() => {
                  this.setState({ mode: ModeEnum.CONTROLS });
                }}
              />,
              <PauseScreenButton
                imgSrc={SettingsAppWhiteImage}
                buttonRef={ADDITIONAL_BUTTON_REFS[1]}
                label="N64 Settings"
                onHandlePad={(focusGrid, e) =>
                  focusGrid.moveFocus(e.type, ADDITIONAL_BUTTON_REFS[1])
                }
                onClick={() => {
                  this.setState({ mode: ModeEnum.N64_SETTINGS });
                }}
              />,
            ]}
          />
        ) : null}
        {mode === ModeEnum.CONTROLS ? (
          <EditorScreen
            onClose={closeCallback}
            tabs={[
              {
                image: GamepadWhiteImage,
                label: Resources.getText(TEXT_IDS.GAMEPAD_CONTROLS),
                content: <GamepadControlsTab />,
              },
              {
                image: KeyboardWhiteImage,
                label: Resources.getText(TEXT_IDS.KEYBOARD_CONTROLS),
                content: <KeyboardControlsTab />,
              },
            ]}
          />
        ) : null}
        {mode === ModeEnum.N64_SETTINGS ? (
          <N64SettingsEditor emulator={emulator} onClose={closeCallback} />
        ) : null}
      </>
    );
  }
}
