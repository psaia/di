import Rect from "./rect";
import Lifecycle from "./lifecycle";
import Canvas from "./canvas";
import RectTux from "./rect-tux";
import * as util from "./util";
import { Point, AnchorPosition } from "./types";

export default class RectLifecycle extends Lifecycle {
  shape: Rect;
  tux: RectTux;
  hitTest(p: Point) {
    if (this.tux) {
      return this.tux.checkAllHitTests(p);
    }
  }
  start(c: Canvas) {
    this.shape = new Rect();
    this.shape.ctx = c.ctx;

    this.tux = new RectTux();
    this.tux.pts = this.shape.pts;
    this.tux.ctx = c.ctx;

    c.addShape(this.shape);
    c.addShape(this.tux);
  }
  remove(c: Canvas) {
    c.removeShape(this.shape);
    c.removeShape(this.tux);
  }
  select(selected: boolean) {
    if (selected) {
      this.tux.play();
    } else {
      this.tux.stop();
    }
  }
  mutate() {
    this.shape.colors = this.state.colors;
    this.tux.colors = this.state.colors;

    const diffX = this.state.cursorPoint[0] - this.state.pinnedCursorPoint[0];
    const diffY = this.state.cursorPoint[1] - this.state.pinnedCursorPoint[1];

    if (this.state.anchorPosition === AnchorPosition.RightBottom) {
      this.shape.pts = [this.state.initialPts[0], this.state.cursorPoint];
    } else if (this.state.anchorPosition === AnchorPosition.RightMiddle) {
      this.shape.pts = [
        this.shape.pts[0],
        util.pt(diffX + this.state.initialPts[1][0], this.shape.pts[1][1])
      ];
    } else if (this.state.anchorPosition === AnchorPosition.RightTop) {
      this.shape.pts = [
        util.pt(this.shape.pts[0][0], this.state.initialPts[0][1] + diffY),
        util.pt(this.state.initialPts[1][0] + diffX, this.shape.pts[1][1])
      ];
    } else if (this.state.anchorPosition === AnchorPosition.BottomMiddle) {
      this.shape.pts = [
        this.shape.pts[0],
        util.pt(this.shape.pts[1][0], this.state.initialPts[1][1] + diffY)
      ];
    } else if (this.state.anchorPosition === AnchorPosition.LeftBottom) {
      this.shape.pts = [
        util.pt(this.state.initialPts[0][0] + diffX, this.shape.pts[0][1]),
        util.pt(this.shape.pts[1][0], this.state.initialPts[1][1] + diffY)
      ];
    } else if (this.state.anchorPosition === AnchorPosition.LeftMiddle) {
      this.shape.pts = [
        util.pt(this.state.initialPts[0][0] + diffX, this.shape.pts[0][1]),
        util.pt(this.shape.pts[1][0], this.shape.pts[1][1])
      ];
    } else if (this.state.anchorPosition === AnchorPosition.LeftTop) {
      this.shape.pts = [
        util.pt(
          this.state.initialPts[0][0] + diffX,
          this.state.initialPts[0][1] + diffY
        ),
        util.pt(this.shape.pts[1][0], this.shape.pts[1][1])
      ];
    } else if (this.state.anchorPosition === AnchorPosition.TopMiddle) {
      this.shape.pts = [
        util.pt(this.shape.pts[0][0], this.state.initialPts[0][1] + diffY),
        util.pt(this.shape.pts[1][0], this.shape.pts[1][1])
      ];
    } else if (this.state.anchorPosition === AnchorPosition.Center) {
      this.shape.pts = [
        util.pt(
          this.state.initialPts[0][0] + diffX,
          this.state.initialPts[0][1] + diffY
        ),
        util.pt(
          this.state.initialPts[1][0] + diffX,
          this.state.initialPts[1][1] + diffY
        )
      ];
    }

    if (this.tux && this.shape.pts.length) {
      this.tux.pts = this.shape.pts;
    }
  }
}
