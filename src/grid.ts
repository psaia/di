import { Point, Group } from "./types";
import * as util from "./util";

export default class Grid {
  protected ctx: CanvasRenderingContext2D;
  public density = 10;
  public closestPt: Point;
  public grid: Group;
  public gridActiveColor: string = "white";
  public gridColor: string = "white";
  public cursorPt: Point;

  private size: { width: number; height: number } = {
    width: 100,
    height: 100
  };

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.cursorPt = util.pt();
  }

  setSize(width: number, height: number) {
    this.size = { width, height };
    this.render();
  }

  setCursor(p: Point) {
    this.cursorPt = p;
  }

  setColor(c: string) {
    this.gridColor = c;
  }

  drawCross(center: Point) {
    const size = 7;
    const htSize = 7;

    const rightTop = util.pt(center[0] - htSize, center[1] + htSize);
    const leftBottom = util.pt(center[0] + htSize, center[1] - htSize);
    const bounds = [rightTop, leftBottom];

    this.ctx.beginPath();

    // |
    this.ctx.moveTo(center[0], center[1] - size);
    this.ctx.lineTo(center[0], center[1] + size);
    // --
    this.ctx.moveTo(center[0] - size, center[1]);
    this.ctx.lineTo(center[0] + size, center[1]);

    if (util.withinBound(this.cursorPt, bounds)) {
      this.closestPt = center;
      // this.ctx.strokeStyle = this.gridActiveColor;
    } else {
      this.ctx.strokeStyle = this.gridColor;
    }
    this.ctx.setLineDash([0, 0]);

    this.ctx.lineWidth = 1;
    this.ctx.stroke();
  }

  render() {
    const grid = [];
    const ctx = this.ctx;

    let w = this.size.width;
    let h = this.size.height;

    const padding = 20;
    const margin = 15;

    for (let x = padding; x < w - padding; x += margin) {
      for (let y = padding; y < h - padding; y += margin) {
        const p = util.pt(x, y);
        this.drawCross(p);
        grid.push(p);
      }
    }

    this.grid = grid;
    return grid;
  }
}
