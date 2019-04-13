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
  public onModeChange: (m: Mode) => void;
  componentDidMount() {
    this.props.events.subscribe("globalStateUpdate", () => this.forceUpdate());
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
        <button
          className={
            this.props.globalState.mode === Mode.Marquee ? "active" : ""
          }
          onClick={this.handleClickEvent(Mode.Marquee)}
        >
          <i
            className="icon-near_me"
            style={{ color: this.state.colorPalette.toolbarColor }}
          />
        </button>
        <button
          className={
            this.props.globalState.mode === Mode.Rectangle ? "active" : ""
          }
          onClick={this.handleClickEvent(Mode.Rectangle)}
        >
          <i
            className="icon-text-box"
            style={{ color: this.state.colorPalette.toolbarColor }}
          />
        </button>
        <button
          className={this.props.globalState.mode === Mode.Line ? "active" : ""}
          onClick={this.handleClickEvent(Mode.Line)}
        >
          <i
            className="icon-subdirectory-right"
            style={{ color: this.state.colorPalette.toolbarColor }}
          />
        </button>
      </div>
    );
  }
}
