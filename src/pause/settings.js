import React from "react";
import { Component } from "react";

import {
  EditorScreen,
  FieldsTab,
  FieldRow,
  FieldLabel,
  FieldControl,
  SettingsWhiteImage,
  Switch,
  WebrcadeContext,
} from '@webrcade/app-common'

export class N64SettingsEditor extends Component {
  constructor() {
    super();
    this.state = {
      tabIndex: null,
      focusGridComps: null,
      values: {}
    };
  }

  componentDidMount() {
    const { emulator } = this.props;
    const prefs = emulator.getPrefs();

    this.setState({
      values: {
        vboEnabled: prefs.isVboEnabled()
      }
    })
  }

  render() {
    const { emulator, onClose } = this.props;
    const { tabIndex, values, focusGridComps } = this.state;
    const prefs = emulator.getPrefs();

    const setFocusGridComps = (comps) => {
      this.setState({ focusGridComps: comps });
    }

    const setValues = (values) => {
      this.setState({ values: values });
    }

    return (
      <EditorScreen
        showCancel={true}
        onOk={() => {
          prefs.setVboEnabled(values.vboEnabled);
          prefs.save().finally(() => {
            onClose();
          })
        }}
        onClose={onClose}
        focusGridComps={focusGridComps}
        onTabChange={(oldTab, newTab) => this.setState({ tabIndex: newTab })}
        tabs={[{
          image: SettingsWhiteImage,
          label: "Nintendo 64 Settings",
          content: (
            <N64SettingsTab
              emulator={emulator}
              isActive={tabIndex === 0}
              setFocusGridComps={setFocusGridComps}
              values={values}
              setValues={setValues}
            />
          )
        }]}
      />
    );
  }
}

class N64SettingsTab extends FieldsTab {
  constructor() {
    super();
    this.enableVboRef = React.createRef();
    this.gridComps = [
      [this.enableVboRef]
    ]
  }

  componentDidUpdate(prevProps, prevState) {
    const { gridComps } = this;
    const { setFocusGridComps } = this.props;
    const { isActive } = this.props;

    if (isActive && (isActive !== prevProps.isActive)) {
      setFocusGridComps(gridComps);
    }
  }

  render() {
    const { enableVboRef } = this;
    const { focusGrid } = this.context;
    const { setValues, values } = this.props;

    return (
      <>
        <FieldRow>
          <FieldLabel>
            Enable vertex buffers
          </FieldLabel>
          <FieldControl>
            <Switch
              ref={enableVboRef}
              onPad={e => focusGrid.moveFocus(e.type, enableVboRef)}
              onChange={e => {
                setValues({ ...values, ...{ vboEnabled: e.target.checked } });
              }}
              checked={values.vboEnabled}
            />
          </FieldControl>
        </FieldRow>
      </>
    );
  }
}
N64SettingsTab.contextType = WebrcadeContext;
