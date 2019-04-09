import Marquee from "./marquee";
import Lifecycle from "./lifecycle";
import Canvas from "./canvas";
import * as util from "./util";
import { Group, Point } from "./types";

export default class MarqueeLifecycle extends Lifecycle {
  shape: Marquee;
  initialPts: Group;
  hitTest(p: Point) {
    return null;
  }
  start(c: Canvas) {
    this.shape = new Marquee();
    this.shape.pts = [this.state.pinnedCursorPoint, this.state.cursorPoint];
    this.shape.colors = this.state.colors;
    this.shape.ctx = c.ctx;
    this.initialPts = util.clone(this.shape.pts);

    c.addShape(this.shape);
  }
  remove(c: Canvas) {
    c.removeShape(this.shape);
  }
  mutate() {
    this.shape.pts = [this.state.pinnedCursorPoint, this.state.cursorPoint];
  }
  select(selected: boolean) {}
}
