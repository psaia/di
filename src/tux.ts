import Shape from "./shape";
import * as util from "./util";
import { Point, Group } from "./types";

export default class Tux extends Shape {
  anchorBounds(p: Point) {
    const margin = 5;

    const topLeft = util.pt(p[0] - margin, p[1] + margin);
    const topRight = util.pt(p[0] + margin, p[1] + margin);
    const bottomLeft = util.pt(p[0] - margin, p[1] - margin);
    const bottomRight = util.pt(p[0] + margin, p[1] - margin);

    return [topLeft, topRight, bottomRight, bottomLeft];
  }
  drawAnchor(bounds: Group) {
    this.ctx.beginPath();
    this.ctx.setLineDash([]);
    this.ctx.lineWidth = 1;
    this.ctx.moveTo(bounds[0][0], bounds[0][1]);
    this.ctx.lineTo(bounds[1][0], bounds[1][1]);
    this.ctx.lineTo(bounds[2][0], bounds[2][1]);
    this.ctx.lineTo(bounds[3][0], bounds[3][1]);
    this.ctx.strokeStyle = this.colors.shapeColor;
    this.ctx.fillStyle = this.colors.shapeColor;
    this.ctx.fill();
    this.ctx.closePath();
  }
  render() {
    // Left side.
    this.drawAnchor(this.anchorBounds(this.pts[0]));
    this.drawAnchor(
      this.anchorBounds(
        util.pt(
          this.pts[0][0],
          this.pts[0][1] + (this.pts[1][1] - this.pts[0][1]) / 2
        )
      )
    );
    this.drawAnchor(
      this.anchorBounds(
        util.pt(
          this.pts[0][0],
          this.pts[0][1] + (this.pts[1][1] - this.pts[0][1])
        )
      )
    );

    // Right side.
    this.drawAnchor(this.anchorBounds(this.pts[1]));
    this.drawAnchor(
      this.anchorBounds(
        util.pt(
          this.pts[1][0],
          this.pts[1][1] - (this.pts[1][1] - this.pts[0][1]) / 2
        )
      )
    );
    this.drawAnchor(
      this.anchorBounds(
        util.pt(
          this.pts[1][0],
          this.pts[1][1] - (this.pts[1][1] - this.pts[0][1])
        )
      )
    );
  }
}
