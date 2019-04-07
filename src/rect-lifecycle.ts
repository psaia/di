import Rect from "./rect";
import LifeCycle from "./lifecycle";
import Canvas from "./canvas";
import State from "./state";
import * as util from "./util";
import { Group } from "./types";

export default class RectLifeCycle extends LifeCycle {
  shape: Rect;
  initialPts: Group;
  start(c: Canvas, s: State) {
    this.shape = new Rect();
    this.shape.pts = [s.pinnedCursorPoint, s.cursorPoint];
    this.shape.uid = crypto.getRandomValues(new Uint32Array(4)).join("-");
    this.shape.colors = this.colors;
    this.shape.ctx = c.ctx;
    this.initialPts = util.clone(this.shape.pts);
    c.addShape(this.shape);
  }
  stop(c: Canvas) {
    this.shape.stop();
  }
  run(s: State) {
    this.shape.pts = [s.pinnedCursorPoint, s.cursorPoint];
  }
}
