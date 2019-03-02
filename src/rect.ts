import Shape from "./shape";
import { Point, Group } from "./types";
import * as util from "./util";

export default class Rect extends Shape {
  render(c) {
    if (!this.animating || this.pts.length < 2) {
      return;
    }

    this.canvas.ctx.beginPath();
    this.canvas.ctx.moveTo(this.pts[0][0], this.pts[0][1]);
    this.canvas.ctx.lineTo(this.pts[0][0], this.pts[1][1]);
    this.canvas.ctx.lineTo(this.pts[1][0], this.pts[1][1]);
    this.canvas.ctx.lineTo(this.pts[1][0], this.pts[0][1]);
    this.canvas.ctx.lineWidth = 1;
    this.canvas.ctx.closePath();
    this.canvas.ctx.strokeStyle = c.shapeColor;
    this.canvas.ctx.stroke();
  }
}
