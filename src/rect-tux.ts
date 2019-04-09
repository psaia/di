import Tux from "./tux";
import * as util from "./util";
import { Point, AnchorPosition } from "./types";

export default class RectTux extends Tux {
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
