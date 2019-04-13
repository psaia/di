import * as React from "react";
import * as dom from "./dom";
import * as util from "./util";
import * as palettes from "./palettes";
import State from "./state";
import Events from "./events";

const PIXEL_SCALE = window.devicePixelRatio;

export interface CanvasProps {
  globalState: State;
  events: Events;
}

export default class Canvas extends React.Component<CanvasProps> {
  ctx: CanvasRenderingContext2D;
  _canvas = React.createRef<HTMLCanvasElement>();

  public state = {
    colorPalette: palettes.DEFAULT,
    width: 100,
    height: 100
  };

  componentDidMount() {
    const canvas = this._canvas.current;
    this.ctx = canvas.getContext("2d");
    this.props.globalState.stageCtx = this.ctx;
    this.ctx.scale(PIXEL_SCALE, PIXEL_SCALE);

    this.adjustSize();

    window.addEventListener(
      "resize",
      () => {
        this.adjustSize();
      },
      false
    );

    this.play();
  }

  adjustSize() {
    const parent = this._canvas.current.parentNode as HTMLElement;
    const { width, height } = dom.getDimensions(parent);
    const aWidth = width - this._canvas.current.offsetLeft;
    const aHeight = height - this._canvas.current.offsetTop;
    const rWidth = Math.floor(aWidth * PIXEL_SCALE);
    const rHeight = Math.floor(aHeight * PIXEL_SCALE);

    this.setState(
      {
        // For the width, subtract the sidebar menus.
        width: aWidth,
        // For the height, subtract the top navbar.
        height: aHeight
      },
      () => {
        this._canvas.current.width = rWidth;
        this._canvas.current.height = rHeight;
        this.ctx.scale(PIXEL_SCALE, PIXEL_SCALE);
      }
    );
  }

  private play = (time = 0) => {
    requestAnimationFrame(this.play);

    this.ctx.clearRect(0, 0, this.state.width, this.state.height);

    for (let s of this.props.globalState.cycles) {
      if (s.shape.animating) {
        s.shape.render();
      }

      if (s.tux && s.tux.animating) {
        s.tux.render();
      }
    }
  };

  private updateCursorCalculations(x: number, y: number) {
    const cursorPt = util.pt(x, y);

    this.props.globalState.cursorPt = cursorPt;

    // First update the cursorGridPt then call the event. The cursorGridPt
    // is somewhat expensive so we don't need to call it on mouse move for
    // a better user experience.
    const { gridDensity } = this.props.globalState;

    const grid = util.createGrid(
      gridDensity,
      this.state.width,
      this.state.height
    );

    for (let i = 0, l = grid.length; i < l; i++) {
      const center = grid[i];

      // Here a bounds object is created to be used to determine if the mouse is
      // within a certain cell. It is essentially the bounds of one cell.
      const htSize = 9;
      const rightTop = util.pt(center[0] - htSize, center[1] + htSize);
      const leftBottom = util.pt(center[0] + htSize, center[1] - htSize);
      const bounds = [rightTop, leftBottom];

      if (util.withinBound(cursorPt, bounds)) {
        this.props.globalState.cursorGridPt = center;
        break;
      }
    }
  }

  render() {
    return (
      <canvas
        className="canvas"
        ref={this._canvas}
        width={String(Math.floor(this.state.width * PIXEL_SCALE))}
        height={String(Math.floor(this.state.height * PIXEL_SCALE))}
        style={{
          width: this.state.width + "px",
          height: this.state.height + "px",
          overflow: "hidden"
        }}
        onMouseMove={(e: React.MouseEvent<HTMLCanvasElement>) => {
          // Update the real cursorPt and call the event.
          const { offsetLeft, offsetTop } = this._canvas.current;

          this.updateCursorCalculations(
            e.nativeEvent.clientX - offsetLeft,
            e.nativeEvent.clientY - offsetTop
          );

          this.props.events.publishFast("canvasMouseMove", e);
        }}
        onMouseUp={e => {
          this.props.events.publishFast("canvasMouseUp", e);
        }}
        onMouseDown={e => {
          // Update the real cursorPt and call the event.
          // const { offsetLeft, offsetTop } = this._canvas.current;

          // this.updateCursorCalculations(
          //   e.nativeEvent.clientX - offsetLeft,
          //   e.nativeEvent.clientY - offsetTop
          // );

          this.props.globalState.downAt = new Date().getTime();
          this.props.globalState.pinnedCursorPt = this.props.globalState.cursorGridPt;

          this.props.events.publishFast("canvasMouseDown", e);
        }}
      />
    );
  }
}
