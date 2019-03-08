import Shape from "./shape";
import { Point, Group } from "./types";
import * as util from "./util";

export default class Marquee extends Shape {
  render(ctx, colors) {
    if (!this.animating || this.pts.length < 2) {
      return;
    }

    ctx.beginPath();
    ctx.moveTo(this.pts[0][0], this.pts[0][1]);
    ctx.lineTo(this.pts[0][0], this.pts[1][1]);
    ctx.lineTo(this.pts[1][0], this.pts[1][1]);
    ctx.lineTo(this.pts[1][0], this.pts[0][1]);
    ctx.lineWidth = 1;
    ctx.closePath();
    ctx.strokeStyle = "#ffffff";
    // this.canvas.ctx.strokeStyle = c.shapeColor;
    ctx.stroke();
  }
}
