import Line from "./line";
import Lifecycle from "./lifecycle";
import LineTux from "./line-tux";
import RectLineConnection from "./rect-line-connection";
import * as util from "./util";
import { ColorPalette, Point, AnchorPosition, Group } from "./types";

export default class LineLifecycle extends Lifecycle {
  shape: Line;
  tux: LineTux;
  rectLineConnection: RectLineConnection;
  hitTest(p: Point) {
    if (this.tux) {
      return this.tux.checkAllHitTests(p);
    }
  }
  start(c: CanvasRenderingContext2D, initialPts: Group, colors: ColorPalette) {
    this.shape = new Line();
    this.tux = new LineTux();

    this.tux.ctx = c;
    this.shape.ctx = c;

    this.shape.colors = colors;
    this.tux.colors = colors;

    this.tux.pts = initialPts;
    this.shape.pts = initialPts;
    this.prevPts = initialPts;
  }
  select(selected: boolean) {
    this.selected = selected;
    if (selected) {
      this.tux.play();
    } else {
      this.tux.stop();
    }
  }
  mutate(
    anchorPosition: AnchorPosition,
    diffX: number,
    diffY: number,
    colors: ColorPalette
  ) {
    this.shape.colors = colors;
    this.tux.colors = colors;

    if (anchorPosition === AnchorPosition.RightMiddle) {
      this.shape.pts = [
        util.pt(this.prevPts[0][0], this.prevPts[0][1]),
        util.pt(this.prevPts[1][0] + diffX, this.prevPts[1][1] + diffY)
      ];
    } else if (anchorPosition === AnchorPosition.LeftMiddle) {
      this.shape.pts = [
        util.pt(this.prevPts[0][0] + diffX, this.prevPts[0][1] + diffY),
        util.pt(this.prevPts[1][0], this.prevPts[1][1])
      ];
    } else if (anchorPosition === AnchorPosition.Center) {
      this.shape.pts = [
        util.pt(this.prevPts[0][0] + diffX, this.prevPts[0][1] + diffY),
        util.pt(this.prevPts[1][0] + diffX, this.prevPts[1][1] + diffY)
      ];
    } else {
      // this.shape.pts = [this.state.pinnedCursorPoint, this.state.cursorPoint];
      this.shape.pts = [
        util.pt(this.shape.pts[0][0], this.shape.pts[0][1]),
        util.pt(this.prevPts[1][0] + diffX, this.prevPts[1][1] + diffY)
      ];
    }

    this.tux.pts = this.shape.pts;
  }
}
