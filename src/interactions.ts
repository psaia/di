import Canvas from "./canvas";
import LayerDrawer from "./layer-drawer";
import Toolbar from "./toolbar-drawer";
import ControlDrawer from "./control-drawer";
import State from "./state";
import * as util from "./util";
import MarqueeLifecycle from "./marquee-lifecycle";
import RectLifecycle from "./rect-lifecycle";
import LineLifecycle from "./line-lifecycle";
import { Mode, AnchorPosition } from "./types";

interface OS {
  toolbar: Toolbar;
  canvas: Canvas;
  layers: LayerDrawer;
  controldrawer: ControlDrawer;
}

export function configure(os: OS): void {
  const state = new State();

  const op = new Operator(os, state);
  op.dbind();
  op.paint();
}

class Operator {
  private state: State;
  private os: OS;
  constructor(os: OS, state: State) {
    this.state = state;
    this.os = os;
  }
  public dbind() {
    this.os.canvas.onMouseDown(this.handleMouseDown.bind(this));
    this.os.canvas.onMouseUp(this.handleMouseUp.bind(this));
    this.os.canvas.onMouseMove(this.handleMouseMove.bind(this));
    this.os.toolbar.onModeChange = this.handleChangeMode.bind(this);
  }
  /**
   * Called to set/change the operating system with a different color scheme.
   */
  public paint() {
    for (let k in this.os) {
      this.os[k].setColorPalette(this.state.colors);
    }
  }
  public deselectAll() {
    for (let cycle of this.state.cycles.values()) {
      cycle.select(false);
    }
  }
  private handleChangeMode(m: Mode) {
    this.state.mode = m;
  }
  private handleMouseDown(e: MouseEvent) {
    this.state.downAt = new Date().getTime();
    this.state.pinnedCursorPoint = this.os.canvas.grid.closestPt;
    this.state.cursorPoint = this.os.canvas.grid.closestPt;
    this.state.anchorPosition = AnchorPosition.RightBottom;
    this.state.initialPts = [
      this.state.pinnedCursorPoint,
      this.state.pinnedCursorPoint
    ];

    // Loop through each cycle to see if the user clicked on something on the
    // stage.
    for (let cycle of this.state.cycles.values()) {
      // Note that the cursorPt is passed and not the closestPt. This is so the
      // most absolute position is accounted for.
      const o = cycle.hitTest(this.os.canvas.grid.cursorPt);
      if (o !== null) {
        this.state.cycle = cycle;
        cycle.select(true);
        this.state.initialPts = util.clone(cycle.shape.pts);
        this.state.anchorPosition = o.position;
        return;
      }
    }

    switch (this.state.mode) {
      case Mode.Marquee:
        this.deselectAll();
        this.state.cycle = new MarqueeLifecycle(this.state);
        this.state.cycles.add(this.state.cycle);
        this.state.cycle.start(this.os.canvas);
        break;
      case Mode.Rectangle:
        this.state.cycle = new RectLifecycle(this.state);
        this.state.cycles.add(this.state.cycle);
        this.state.cycle.start(this.os.canvas);
        break;
      case Mode.Line:
        this.state.cycle = new LineLifecycle(this.state);
        this.state.cycles.add(this.state.cycle);
        this.state.cycle.start(this.os.canvas);
        break;
    }
  }
  private handleMouseUp(e: MouseEvent) {
    if (this.state.cycle) {
      // A marquee gets removed as soon as the cursor is released, always.
      if (this.state.cycle instanceof MarqueeLifecycle) {
        this.state.cycle.remove(this.os.canvas);
      }

      this.state.cycle = null;
    }

    // Reset the mode to be marquee, always.
    this.state.mode = Mode.Marquee;
  }
  private handleMouseMove(e: MouseEvent) {
    this.state.cursorPoint = this.os.canvas.grid.closestPt;

    if (this.state.cycle) {
      this.state.cycle.mutate();
    }
  }
}
