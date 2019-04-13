import * as React from "react";
import * as dom from "./dom";
import * as palettes from "./palettes";
import State from "./state";
import Events from "./events";
import { Point } from "./types";
import * as util from "./util";

const PIXEL_SCALE = window.devicePixelRatio;

export interface GridProps {
  globalState: State;
  events: Events;
}

export default class Grid extends React.Component<GridProps> {
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

    this.adjustSize();

    window.addEventListener(
      "resize",
      () => {
        this.adjustSize();
      },
      false
    );
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
        this.drawGrid();
      }
    );
  }

  drawGrid() {
    const grid = util.createGrid(
      this.props.globalState.gridDensity,
      this.state.width,
      this.state.height
    );

    for (let i = 0, l = grid.length; i < l; i++) {
      this.drawCell(grid[i]);
    }
  }

  drawCell(center: Point) {
    const size = 9;

    this.ctx.beginPath();

    // |
    this.ctx.moveTo(center[0], center[1] - size);
    this.ctx.lineTo(center[0], center[1] + size);
    // --
    this.ctx.moveTo(center[0] - size, center[1]);
    this.ctx.lineTo(center[0] + size, center[1]);

    this.ctx.strokeStyle = this.state.colorPalette.gridColor;
    this.ctx.setLineDash([0, 0]);

    this.ctx.lineWidth = 1;
    this.ctx.stroke();
  }

  render() {
    return (
      <canvas
        className="canvas grid"
        ref={this._canvas}
        width={String(Math.floor(this.state.width * PIXEL_SCALE))}
        height={String(Math.floor(this.state.height * PIXEL_SCALE))}
        style={{
          background: this.state.colorPalette.stageBg,
          width: this.state.width + "px",
          height: this.state.height + "px",
          overflow: "hidden"
        }}
      />
    );
  }
}
