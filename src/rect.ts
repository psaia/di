import Shape from "./shape";
import { Point, Group } from "./types";
import * as util from "./util";

export default class Rect extends Shape {
  render(canvas, colors) {
    if (!this.animating || this.pts.length < 2) {
      return;
    }

    canvas.ctx.beginPath();
    canvas.ctx.moveTo(this.pts[0][0], this.pts[0][1]);
    canvas.ctx.lineTo(this.pts[0][0], this.pts[1][1]);
    canvas.ctx.lineTo(this.pts[1][0], this.pts[1][1]);
    canvas.ctx.lineTo(this.pts[1][0], this.pts[0][1]);
    canvas.ctx.lineWidth = 1;
    canvas.ctx.closePath();
    canvas.ctx.strokeStyle = colors.shapeColor;
    canvas.ctx.stroke();
  }
}
