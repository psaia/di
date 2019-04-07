import Marquee from "./marquee";
import LifeCycle from "./lifecycle";
import Canvas from "./canvas";
import * as util from "./util";
import { Group } from "./types";

export default class MarqueeLifeCycle extends LifeCycle {
  shape: Marquee;
  initialPts: Group;
  start(c: Canvas) {
    this.shape = new Marquee();
    this.shape.pts = [this.state.pinnedCursorPoint, this.state.cursorPoint];
    this.shape.uid = crypto.getRandomValues(new Uint32Array(4)).join("-");
    this.shape.colors = this.state.colors;
    this.shape.ctx = c.ctx;
    this.initialPts = util.clone(this.shape.pts);

    c.addShape(this.shape);
  }
  stop() {
    // The marquee gets removed as soon as it's let go.
  }
  remove(c: Canvas) {
    this.shape.stop();
    c.removeShape(this.shape);
  }
  run() {
    this.shape.pts = [this.state.pinnedCursorPoint, this.state.cursorPoint];
  }
}
