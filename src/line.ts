import Shape from "./shape";

export default class Line extends Shape {
  render(canvas, colors) {
    if (this.pts.length < 2) {
      return;
    }

    canvas.ctx.beginPath();
    canvas.ctx.moveTo(this.pts[0][0], this.pts[0][1]);

    for (let i = 1, len = this.pts.length; i < len; i++) {
      canvas.ctx.lineTo(this.pts[i][0], this.pts[i][1]);
    }

    canvas.ctx.strokeStyle = colors.shapeColor;
    canvas.ctx.stroke();
  }
}
