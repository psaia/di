import Shape from "./shape";

export default class Marquee extends Shape {
  render() {
    if (!this.animating || this.pts.length < 2) {
      return;
    }

    this.ctx.beginPath();
    this.ctx.moveTo(this.pts[0][0], this.pts[0][1]);
    this.ctx.lineTo(this.pts[0][0], this.pts[1][1]);
    this.ctx.lineTo(this.pts[1][0], this.pts[1][1]);
    this.ctx.lineTo(this.pts[1][0], this.pts[0][1]);
    this.ctx.setLineDash([5, 5]);
    this.ctx.lineWidth = 1;
    this.ctx.closePath();
    this.ctx.strokeStyle = this.colors.shapeColor;
    this.ctx.stroke();
  }
}
