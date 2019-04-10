import Shape from "./shape";
import { centroid } from "./util";

export default class Rect extends Shape {
  text: string = "";
  render() {
    if (!this.animating || this.pts.length < 2) {
      return;
    }

    this.ctx.beginPath();
    this.ctx.setLineDash([]);
    this.ctx.strokeStyle = this.colors.shapeColor;
    this.ctx.lineWidth = 2;

    this.ctx.moveTo(this.pts[0][0], this.pts[0][1]);
    this.ctx.lineTo(this.pts[0][0], this.pts[1][1]);
    this.ctx.lineTo(this.pts[1][0], this.pts[1][1]);
    this.ctx.lineTo(this.pts[1][0], this.pts[0][1]);

    if (this.text) {
      const center = centroid([this.pts[0], this.pts[1]]);
      this.ctx.fillText(this.text, center[0], center[1]);
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      this.ctx.font = "14pt 'Helvetica Neue', Helvetica, Arial, sans-serif'";
    }

    this.ctx.closePath();
    this.ctx.stroke();
  }
}
