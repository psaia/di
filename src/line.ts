import Shape from "./shape";

export default class Line extends Shape {
  render(c) {
    if (this.pts.length < 2) {
      return;
    }

    this.canvas.ctx.beginPath();
    this.canvas.ctx.moveTo(this.pts[0][0], this.pts[0][1]);

    for (let i = 1, len = this.pts.length; i < len; i++) {
      this.canvas.ctx.lineTo(this.pts[i][0], this.pts[i][1]);
    }

    this.canvas.ctx.strokeStyle = c.shapeColor;
    this.canvas.ctx.stroke();
  }
}
