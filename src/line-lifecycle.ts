import Line from "./line";
import LifeCycle from "./lifecycle";
import Canvas from "./canvas";
import * as util from "./util";
import RectLineConnection from "./rect-line-connection";
import { Group, Point } from "./types";

export default class LineLifeCycle extends LifeCycle {
  rectLineConnection: RectLineConnection;
  shape: Line;
  initialPts: Group;
  hitTest(p: Point) {
    return null;
  }
  start(c: Canvas) {
    this.shape = new Line();
    this.shape.uid = crypto.getRandomValues(new Uint32Array(4)).join("-");
    this.shape.colors = this.state.colors;
    this.shape.ctx = c.ctx;
    this.initialPts = util.clone(this.shape.pts);

    c.addShape(this.shape);
  }
  stop() {}
  remove(c: Canvas) {
    this.shape.stop();
    c.removeShape(this.shape);
  }
  mutate() {
    this.shape.pts = [this.state.pinnedCursorPoint, this.state.cursorPoint];
  }
}
