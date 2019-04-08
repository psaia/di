import Rect from "./rect";
import LifeCycle from "./lifecycle";
import Canvas from "./canvas";
import Tux from "./tux";
import * as util from "./util";
import { Group } from "./types";

export default class RectLifeCycle extends LifeCycle {
  tux: Tux;
  shape: Rect;
  initialPts: Group;
  start(c: Canvas) {
    this.shape = new Rect();
    this.shape.pts = [this.state.pinnedCursorPoint, this.state.cursorPoint];
    this.shape.uid = crypto.getRandomValues(new Uint32Array(4)).join("-");
    this.shape.colors = this.state.colors;
    this.shape.ctx = c.ctx;
    this.initialPts = util.clone(this.shape.pts);

    if (this.selected) {
      this.tux = new Tux();
      this.tux.uid = crypto.getRandomValues(new Uint32Array(4)).join("-");
      this.tux.colors = this.state.colors;
      this.tux.pts = this.shape.pts;
      this.tux.ctx = c.ctx;
      c.addShape(this.tux);
    }

    c.addShape(this.shape);
  }
  stop() {}
  remove(c: Canvas) {
    this.shape.stop();
    c.removeShape(this.shape);
  }
  run() {
    this.shape.pts = [this.state.pinnedCursorPoint, this.state.cursorPoint];
    this.tux.pts = this.shape.pts;
  }
}
