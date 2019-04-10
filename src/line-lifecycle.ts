import Line from "./line";
import Lifecycle from "./lifecycle";
import Canvas from "./canvas";
import LineTux from "./line-tux";
import RectLineConnection from "./rect-line-connection";
import * as util from "./util";
import { Point, AnchorPosition } from "./types";

export default class LineLifecycle extends Lifecycle {
  shape: Line;
  tux: LineTux;
  rectLineConnection: RectLineConnection;
  hitTest(p: Point) {
    if (this.tux) {
      return this.tux.checkAllHitTests(p);
    }
  }
  start(c: Canvas) {
    this.shape = new Line();
    this.shape.ctx = c.ctx;

    this.tux = new LineTux();
    this.tux.ctx = c.ctx;

    c.addShape(this.shape);
    c.addShape(this.tux);
  }
  remove(c: Canvas) {
    c.removeShape(this.shape);
    c.removeShape(this.tux);
  }
  select(selected: boolean) {
    this.selected = selected;
    if (selected) {
      this.tux.play();
    } else {
      this.tux.stop();
    }
  }
  mutate(diffX: number, diffY: number) {
    this.shape.colors = this.state.colors;
    this.tux.colors = this.state.colors;

    if (this.state.anchorPosition === AnchorPosition.RightMiddle) {
      this.shape.pts = [
        util.pt(this.prevPts[0][0], this.prevPts[0][1]),
        util.pt(this.prevPts[1][0] + diffX, this.prevPts[1][1] + diffY)
      ];
    } else if (this.state.anchorPosition === AnchorPosition.LeftMiddle) {
      this.shape.pts = [
        util.pt(this.prevPts[0][0] + diffX, this.prevPts[0][1] + diffY),
        util.pt(this.prevPts[1][0], this.prevPts[1][1])
      ];
    } else if (this.state.anchorPosition === AnchorPosition.Center) {
      this.shape.pts = [
        util.pt(this.prevPts[0][0] + diffX, this.prevPts[0][1] + diffY),
        util.pt(this.prevPts[1][0] + diffX, this.prevPts[1][1] + diffY)
      ];
    } else {
      this.shape.pts = [this.state.pinnedCursorPoint, this.state.cursorPoint];
    }
    this.tux.pts = this.shape.pts;
  }
}
