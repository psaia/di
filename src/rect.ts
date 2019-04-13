import Shape from "./shape";
import { centroid } from "./util";
import { BorderType } from "./types";

export default class Rect extends Shape {
  text: string = "";
  options = {
    border: BorderType.Light,
    text: ""
  };
  render() {
    if (!this.animating || this.pts.length < 2) {
      return;
    }

    this.ctx.beginPath();

    this.ctx.strokeStyle = this.colors.shapeColor;

    if (this.options.border === BorderType.Light) {
      this.ctx.setLineDash([]);
      this.ctx.lineWidth = 1;
    } else if (this.options.border === BorderType.Heavy) {
      this.ctx.setLineDash([]);
      this.ctx.lineWidth = 3;
    } else if (this.options.border === BorderType.Double) {
      this.ctx.setLineDash([]);
      this.ctx.lineWidth = 1;
      this.ctx.moveTo(this.pts[0][0] - 2, this.pts[0][1] - 2);
      this.ctx.lineTo(this.pts[0][0] - 2, this.pts[1][1] + 2);
      this.ctx.lineTo(this.pts[1][0] + 2, this.pts[1][1] + 2);
      this.ctx.lineTo(this.pts[1][0] + 2, this.pts[0][1] - 2);
      this.ctx.closePath();
    } else if (this.options.border === BorderType.Dashed) {
      this.ctx.setLineDash([4, 4]);
      this.ctx.lineWidth = 2;
    } else if (this.options.border === BorderType.None) {
      this.ctx.lineWidth = 0;
      this.ctx.strokeStyle = "transparent";
    } else {
      this.ctx.setLineDash([]);
      this.ctx.lineWidth = 2;
    }

    this.ctx.moveTo(this.pts[0][0], this.pts[0][1]);
    this.ctx.lineTo(this.pts[0][0], this.pts[1][1]);
    this.ctx.lineTo(this.pts[1][0], this.pts[1][1]);
    this.ctx.lineTo(this.pts[1][0], this.pts[0][1]);

    if (this.options.text) {
      const center = centroid([this.pts[0], this.pts[1]]);
      this.ctx.fillText(this.options.text, center[0], center[1]);
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      this.ctx.font = "16pt 'Helvetica Neue', Helvetica, Arial, sans-serif'";
    }

    this.ctx.closePath();
    this.ctx.stroke();
  }
}
