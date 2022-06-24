import React from "react";

import {
  ControlsTab,
} from '@webrcade/app-common'

export class GamepadControlsTab extends ControlsTab {
  render() {
    return (
      <>
        {this.renderControl("start", "Start")}
        {this.renderControl("dpad", "D-pad")}
        {this.renderControl("lanalog", "Analog stick")}
        {this.renderControl("a", "A")}
        {this.renderControl("x", "B")}
        {this.renderControl("lbump", "L")}
        {this.renderControl("rbump", "R")}
        {this.renderControl("ltrig", "Z")}
        {this.renderControl("rtrig", "Z")}
        {this.renderControl("ranalog", "C buttons (up/down/left/right)")}
      </>
    );
  }
}

