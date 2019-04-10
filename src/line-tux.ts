import Tux from "./tux";
import * as util from "./util";
import { AnchorPosition, Point, Bounds } from "./types";
import RectLifecycle from "./rect-lifecycle";

export default class LineTux extends Tux {
  peripheralRectCycles: Set<RectLifecycle> = new Set();

  peripheralAnchorBounds(p: Point): Bounds {
    const margin = 5;

    const bottomLeft = util.pt(p[0] - margin, p[1] + margin);
    const bottomRight = util.pt(p[0] + margin, p[1] + margin);
    const topLeft = util.pt(p[0] - margin, p[1] - margin);
    const topRight = util.pt(p[0] + margin, p[1] - margin);

    return { topLeft, topRight, bottomRight, bottomLeft };
  }

  configurePeripheralAnchor(position: AnchorPosition, bounds: Bounds) {
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

  render() {
    if (this.pts.length < 2) {
      return;
    }
    const centroid = util.centroid(this.pts);

    this.hitTestChecks = [];

    this.configureAnchor(
      AnchorPosition.LeftMiddle,
      this.anchorBounds(this.pts[0])
    );

    this.configureAnchor(
      AnchorPosition.RightMiddle,
      this.anchorBounds(this.pts[1])
    );

    // for (let cycle of this.peripheralRectCycles.values()) {
    //   this.configureAnchor(
    //     AnchorPosition.RightMiddle,
    //     this.anchorBounds(cycle.shape.pts[1])
    //   );
    //   this.configureAnchor(
    //     AnchorPosition.LeftMiddle,
    //     this.anchorBounds(cycle.shape.pts[0])
    //   );
    //   this.configureAnchor(
    //     AnchorPosition.TopMiddle,
    //     this.anchorBounds(cycle.shape.pts[1])
    //   );
    // }

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
