import React from 'react';

import { ControlsTab } from '@webrcade/app-common';

export class GamepadControlsTab extends ControlsTab {
  render() {
    return (
      <>
        {this.renderControl('start', 'Start')}
        {this.renderControl('dpad', 'D-pad')}
        {this.renderControl('lanalog', 'Analog stick')}
        {this.renderControl('a', 'A')}
        {this.renderControl('x', 'B')}
        {this.renderControl('lbump', 'L')}
        {this.renderControl('rbump', 'R')}
        {this.renderControl('ltrig', 'Z')}
        {this.renderControl('rtrig', 'Z')}
        {this.renderControl('ranalog', 'C buttons (up/down/left/right)')}
      </>
    );
  }
}

export class KeyboardControlsTab extends ControlsTab {
  render() {
    return (
      <>
        {this.renderKey('Enter', 'Start')}
        {this.renderKey('ArrowUp', 'Analog (Up)')}
        {this.renderKey('ArrowDown', 'Analog (Down)')}
        {this.renderKey('ArrowLeft', 'Analog (Left)')}
        {this.renderKey('ArrowRight', 'Analog (Right)')}
        {this.renderKey('ShiftLeft', 'Analog -25%')}
        {this.renderKey('ControlLeft', 'Analog -50%')}
        {this.renderKey('KeyX', 'A')}
        {this.renderKey('KeyZ', 'B')}
        {this.renderKey('KeyC', 'L')}
        {this.renderKey('KeyV', 'R')}
        {this.renderKey('Space', 'Z')}
        {this.renderKey('KeyI', 'D-pad (Up)')}
        {this.renderKey('KeyK', 'D-pad (Down)')}
        {this.renderKey('KeyJ', 'D-pad (Left)')}
        {this.renderKey('KeyL', 'D-pad (Right)')}
        {this.renderKey('KeyW', 'C button (Up)')}
        {this.renderKey('KeyS', 'C button (Down)')}
        {this.renderKey('KeyA', 'C button (Left)')}
        {this.renderKey('KeyD', 'C button (Right)')}
      </>
    );
  }
}
