import Shape from "./shape";
import { Point, Group } from "./types";
import * as util from "./util";

export default class Rect extends Shape {
  render(ctx: CanvasRenderingContext2D) {
    if (!this.animating || this.pts.length < 2) {
      return;
    }

    ctx.beginPath();
    ctx.moveTo(this.pts[0][0], this.pts[0][1]);
    ctx.lineTo(this.pts[0][0], this.pts[1][1]);
    ctx.lineTo(this.pts[1][0], this.pts[1][1]);
    ctx.lineTo(this.pts[1][0], this.pts[0][1]);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.closePath();

    if (this.filled) {
      ctx.fill();
    } else {
      ctx.stroke();
    }
  }
  static withinBound(pt: Point, rect: Group): boolean {
    if (
      !util.within(pt[0], rect[0][0], rect[1][0]) ||
      !util.within(pt[1], rect[0][1], rect[1][1])
    ) {
      return false;
    }
    return true;
  }
}
