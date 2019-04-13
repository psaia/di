import * as React from "react";
import * as palettes from "./palettes";
import { Mode } from "./types";
import State from "./state";
import Events from "./events";

export interface ToolbarProps {
  globalState: State;
  events: Events;
}

export default class ToolbarDrawer extends React.Component<ToolbarProps> {
  public state = {
    colorPalette: palettes.DEFAULT
  };
  componentDidMount() {
    this.props.events.subscribe("stateChange", () => this.forceUpdate());
  }
  handleClickEvent(m: Mode) {
    return () => {
      this.props.globalState.setStateProp(this.props.events, "mode", m);
    };
  }
  render() {
    return (
      <div
        className="toolbar-drawer"
        style={{
          color: this.state.colorPalette.toolbarColor,
          background: this.state.colorPalette.toolbarBg
        }}
      >
        <div
          className="branding"
          style={{
            color: this.state.colorPalette.brandingColor,
            background: this.state.colorPalette.brandingBg
          }}
        >
          <h1>txt.io | ASCII Studio</h1>
        </div>
        <div className="tools">
          <button
            className={
              this.props.globalState.mode === Mode.Marquee ? "active" : ""
            }
            style={{
              background:
                this.props.globalState.mode === Mode.Marquee
                  ? this.state.colorPalette.toolbarActiveBg
                  : "transparent"
            }}
            onClick={this.handleClickEvent(Mode.Marquee)}
          >
            <i
              className="icon-cursor"
              style={{
                color: this.state.colorPalette.toolbarColor
              }}
            />
          </button>
          <button
            className={
              this.props.globalState.mode === Mode.Rectangle ? "active" : ""
            }
            style={{
              background:
                this.props.globalState.mode === Mode.Rectangle
                  ? this.state.colorPalette.toolbarActiveBg
                  : "transparent"
            }}
            onClick={this.handleClickEvent(Mode.Rectangle)}
          >
            <i
              className="icon-box"
              style={{ color: this.state.colorPalette.toolbarColor }}
            />
          </button>
          <button
            style={{
              background:
                this.props.globalState.mode === Mode.Line
                  ? this.state.colorPalette.toolbarActiveBg
                  : "transparent"
            }}
            className={
              this.props.globalState.mode === Mode.Line ? "active" : ""
            }
            onClick={this.handleClickEvent(Mode.Line)}
          >
            <i
              className="icon-line"
              style={{ color: this.state.colorPalette.toolbarColor }}
            />
          </button>
        </div>
      </div>
    );
  }
}
