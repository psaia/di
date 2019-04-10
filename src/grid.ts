import { Point, Group } from "./types";
import * as util from "./util";

export default class Grid {
  protected ctx: CanvasRenderingContext2D;
  public density = 15;
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

  drawCell(center: Point) {
    const size = 9;

    // Here a bounds object is created to be used to determine if the mouse is
    // within a certain cell. It is essentially the bounds of one cell.
    const htSize = size;
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

    let w = this.size.width;
    let h = this.size.height;

    const padding = 25;
    const margin = this.density;

    for (let x = padding; x < w - padding; x += margin) {
      for (let y = padding; y < h - padding; y += margin) {
        const p = util.pt(x, y);
        this.drawCell(p);
        grid.push(p);
      }
    }

    this.grid = grid;
    return grid;
  }
}
