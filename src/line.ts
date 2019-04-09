import Shape from "./shape";
import * as util from "./util";

/**
 * A line follows a very particular algorithm. There are potentially 4 break
 * points for each line since there are no diaganal lines.
 */
export default class Line extends Shape {
  render() {
    if (this.pts.length < 2) {
      return;
    }

    const from = this.pts[0];
    const to = this.pts[1];

    this.ctx.beginPath();
    this.ctx.lineWidth = 2;
    this.ctx.moveTo(from[0], from[1]);

    const pt1 = util.pt(from[0] + (to[0] - from[0]) / 2, from[1]);
    const pt2 = util.pt(pt1[0], to[1]);

    // Starting half line.
    this.ctx.lineTo(pt1[0], pt1[1]);

    // Intersecting vertical line.
    this.ctx.lineTo(pt2[0], pt2[1]);

    // Final connecting  line.
    this.ctx.lineTo(to[0], to[1]);

    this.ctx.strokeStyle = this.colors.shapeColor;
    this.ctx.stroke();
  }
}
