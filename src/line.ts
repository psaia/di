import Shape from "./shape";

export default class Line extends Shape {
  pts: Float32Array[] = [];

  render(ctx: CanvasRenderingContext2D) {
    if (this.pts.length < 2) {
      return;
    }

    ctx.beginPath();
    ctx.moveTo(this.pts[0][0], this.pts[0][1]);

    for (let i = 1, len = this.pts.length; i < len; i++) {
      ctx.lineTo(this.pts[i][0], this.pts[i][1]);
    }

    ctx.stroke();
  }
}
