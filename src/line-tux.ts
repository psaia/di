import Tux from "./tux";
import * as util from "./util";
import { AnchorPosition, Point } from "./types";

export default class LineTux extends Tux {
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
