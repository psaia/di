import Shape from "./shape";
import { Point } from "./types";

export default class Line extends Shape {
  render() {
    if (this.pts.length < 2) {
      return;
    }

    this.ctx.beginPath();
    this.ctx.moveTo(this.pts[0][0], this.pts[0][1]);

    for (let i = 1, len = this.pts.length; i < len; i++) {
      this.ctx.lineTo(this.pts[i][0], this.pts[i][1]);
    }

    this.ctx.strokeStyle = this.colors.shapeColor;
    this.ctx.stroke();
  }
}
