import Shape from "./shape";
import * as util from "./util";
import {
  Bounds,
  HitTestFn,
  HitTestResult,
  Point,
  AnchorPosition
} from "./types";

export default abstract class Tux extends Shape {
  hitTestChecks: HitTestFn[] = [];
  /**
   * Check all the hit tests to see if the given point is within anything.
   */
  checkAllHitTests(p: Point): HitTestResult | null {
    for (let i = 0, l = this.hitTestChecks.length; i < l; i++) {
      const result = this.hitTestChecks[i](p);
      if (result) {
        return result;
      }
    }
    return null;
  }
  anchorBounds(p: Point): Bounds {
    const margin = 5;

    const bottomLeft = util.pt(p[0] - margin, p[1] + margin);
    const bottomRight = util.pt(p[0] + margin, p[1] + margin);
    const topLeft = util.pt(p[0] - margin, p[1] - margin);
    const topRight = util.pt(p[0] + margin, p[1] - margin);

    return { topLeft, topRight, bottomRight, bottomLeft };
  }
  configureAnchor(position: AnchorPosition, bounds: Bounds) {
    this.ctx.beginPath();
    this.ctx.setLineDash([]);
    this.ctx.lineWidth = 1;
    this.ctx.moveTo(bounds.topLeft[0], bounds.topLeft[1]);
    this.ctx.lineTo(bounds.topRight[0], bounds.topRight[1]);
    this.ctx.lineTo(bounds.bottomRight[0], bounds.bottomRight[1]);
    this.ctx.lineTo(bounds.bottomLeft[0], bounds.bottomLeft[1]);

    this.ctx.strokeStyle = this.colors.shapeColor;
    this.ctx.fillStyle = this.colors.shapeColor;
    this.ctx.fill();
    this.ctx.closePath();

    this.hitTestChecks.push((p: Point) => {
      if (util.withinBound(p, [bounds.topLeft, bounds.bottomRight])) {
        return {
          position,
          point: util.centroid([bounds.topLeft, bounds.bottomRight])
        };
      }
    });
  }
  render() {}
}
