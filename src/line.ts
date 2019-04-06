import Shape from "./shape";

export default class Line extends Shape {
  render(ctx, colors) {
    if (this.pts.length < 2) {
      return;
    }

    ctx.ctx.beginPath();
    ctx.ctx.moveTo(this.pts[0][0], this.pts[0][1]);

    for (let i = 1, len = this.pts.length; i < len; i++) {
      ctx.ctx.lineTo(this.pts[i][0], this.pts[i][1]);
    }

    ctx.ctx.strokeStyle = colors.shapeColor;
    ctx.ctx.stroke();
  }
}
