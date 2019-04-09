import Shape from "./shape";
import * as util from "./util";
import {
  Bounds,
  HitTestFn,
  HitTestResult,
  Point,
  AnchorPosition
} from "./types";

export default class Tux extends Shape {
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
  // The only thing render does is setup hittest checks.
  render() {
    if (this.pts.length !== 2) {
      return;
    }
    const centroid = util.centroid(this.pts);
    this.hitTestChecks = [];

    this.configureAnchor(
      AnchorPosition.LeftTop,
      this.anchorBounds(this.pts[0])
    );
    this.configureAnchor(
      AnchorPosition.LeftMiddle,
      this.anchorBounds(util.pt(this.pts[0][0], centroid[1]))
    );
    this.configureAnchor(
      AnchorPosition.LeftBottom,
      this.anchorBounds(
        util.pt(
          this.pts[0][0],
          this.pts[0][1] + (this.pts[1][1] - this.pts[0][1])
        )
      )
    );
    this.configureAnchor(
      AnchorPosition.RightBottom,
      this.anchorBounds(this.pts[1])
    );
    this.configureAnchor(
      AnchorPosition.RightMiddle,
      this.anchorBounds(util.pt(this.pts[1][0], centroid[1]))
    );
    this.configureAnchor(
      AnchorPosition.RightTop,
      this.anchorBounds(
        util.pt(
          this.pts[1][0],
          this.pts[1][1] - (this.pts[1][1] - this.pts[0][1])
        )
      )
    );
    this.configureAnchor(
      AnchorPosition.TopMiddle,
      this.anchorBounds(util.pt(centroid[0], this.pts[0][1]))
    );
    this.configureAnchor(
      AnchorPosition.BottomMiddle,
      this.anchorBounds(util.pt(centroid[0], this.pts[1][1]))
    );

    // Lastly, setup a check for anywhere in the center of the shape.
    this.hitTestChecks.push((p: Point) => {
      if (util.withinBound(p, [this.pts[0], this.pts[1]])) {
        return {
          position: AnchorPosition.Center,
          point: centroid
        };
      }
    });
  }
}
