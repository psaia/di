import Canvas from "./canvas";
import LayerDrawer from "./layer-drawer";
import Toolbar from "./toolbar-drawer";
import ControlDrawer from "./control-drawer";
import State, { LifecycleItem } from "./state";
import * as util from "./util";
import MarqueeLifecycle from "./marquee-lifecycle";
import RectLifecycle from "./rect-lifecycle";
import LineLifecycle from "./line-lifecycle";
import { Mode, AnchorPosition, Group, KeyEvent } from "./types";

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

  /**
   * Bind the canvas and toolbar elements in the OS to event listeners in the
   * operator.
   */
  public dbind() {
    this.os.canvas.onMouseDown(this.handleMouseDown.bind(this));
    this.os.canvas.onMouseUp(this.handleMouseUp.bind(this));
    this.os.canvas.onMouseMove(this.handleMouseMove.bind(this));
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
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

  /**
   * Deselect all cycles.
   */
  public deselectAll() {
    for (let cycle of this.state.cycles.values()) {
      this.select(cycle, false);
    }
  }

  /**
   * Automatically select and make hot cycles out of cycles that the marquee
   * selects.
   */
  public selectWithinRect(rect: Group) {
    for (let cycle of this.state.cycles.values()) {
      if (util.intersect(rect, cycle.shape.pts)) {
        this.select(cycle, true);
      }
    }
  }

  /**
   * Convienence method to select or deselect a cycle. This will also make it
   * hot or cold depending on if it's selected.
   */
  public select(cycle, selected: boolean = true) {
    cycle.select(selected);

    if (selected) {
      this.state.hotCycles.add(cycle);
    } else {
      this.state.hotCycles.delete(cycle);
    }
  }

  /**
   * Return all selected items on stage.
   */
  public selected(): Set<LifecycleItem> {
    const s = new Set();
    for (let cycle of this.state.cycles.values()) {
      if (cycle.selected) {
        s.add(cycle);
      }
    }
    return s;
  }

  /**
   * Delete a cycle from stage fully.
   */
  public remove(cycle) {
    this.state.hotCycles.delete(cycle);
    this.state.cycles.delete(cycle);
    cycle.remove(this.os.canvas);
  }

  /**
   * Triggered when a mode changes from an external source. Likely, the toolbar.
   */
  private handleChangeMode(m: Mode) {
    this.state.mode = m;
  }

  /**
   * When the mouse is pressed on the canvas.
   */
  private handleMouseDown(e: MouseEvent) {
    // Configure state based on this mousedown.
    this.state.downAt = new Date().getTime();
    this.state.pinnedCursorPoint = this.os.canvas.grid.closestPt;
    this.state.cursorPoint = this.os.canvas.grid.closestPt;
    this.state.anchorPosition = AnchorPosition.RightBottom;

    // Loop through each cycle to see if the user clicked on something on the
    // stage.
    for (let cycle of this.state.cycles.values()) {
      // Note that the cursorPt is passed and not the closestPt. This is so the
      // most absolute position is accounted for.
      const o = cycle.hitTest(this.os.canvas.grid.cursorPt);
      if (o !== null) {
        this.state.anchorPosition = o.position;

        if (this.selected().size === 1) {
          this.deselectAll();
        }

        cycle.prevPts = cycle.shape.pts;
        this.select(cycle, true);
        return;
      }
    }

    // Deselect all shapes before creating a new one or selecting others.
    this.deselectAll();

    // Move on to creating a new shape w/ mgmt lifecycle.
    switch (this.state.mode) {
      case Mode.Marquee: {
        const cycle = new MarqueeLifecycle(this.state);
        cycle.start(this.os.canvas);
        cycle.prevPts = [
          this.state.pinnedCursorPoint,
          this.state.pinnedCursorPoint
        ];
        this.state.cycles.add(cycle);
        this.select(cycle, true);
        break;
      }
      case Mode.Rectangle: {
        const cycle = new RectLifecycle(this.state);
        cycle.prevPts = [
          this.state.pinnedCursorPoint,
          this.state.pinnedCursorPoint
        ];
        cycle.start(this.os.canvas);
        this.state.cycles.add(cycle);
        this.select(cycle, true);
        break;
      }
      case Mode.Line: {
        const cycle = new LineLifecycle(this.state);
        cycle.prevPts = [
          this.state.pinnedCursorPoint,
          this.state.pinnedCursorPoint
        ];
        cycle.start(this.os.canvas);
        this.state.cycles.add(cycle);
        this.select(cycle, true);
        break;
      }
    }
  }

  /**
   * When the mouse is released:
   *
   * 1. Determine if any of the hotCycles are the marquee. If so:
   *   1. Remove the marquee.
   *   2. Deselect all.
   *   3. Select cycles which intersect with the marquee.
   * 2. Set mode to marquee.
   * 3. Unset anchor position.
   */
  private handleMouseUp(e: MouseEvent) {
    if (this.state.hotCycles.size) {
      for (let cycle of this.state.hotCycles.values()) {
        // A marquee gets removed as soon as the cursor is released, always. Then
        // selecty any shapes that the marquee overlapped.
        if (cycle instanceof MarqueeLifecycle) {
          const marqueePts = util.clone(cycle.shape.pts);
          this.remove(cycle);
          this.deselectAll();
          this.selectWithinRect(marqueePts);
        } else {
          cycle.prevPts = cycle.shape.pts;
          this.state.hotCycles.delete(cycle);
        }
      }
    }

    // Reset the mode to be marquee, always.
    this.state.mode = Mode.Marquee;
    this.state.anchorPosition = null;
  }

  /**
   * When the mouse moves all hotCycles need to be mutated relative to the
   * current state.
   */
  private handleMouseMove(e: MouseEvent) {
    this.state.cursorPoint = this.os.canvas.grid.closestPt;

    if (this.state.pinnedCursorPoint) {
      const diffX = this.state.cursorPoint[0] - this.state.pinnedCursorPoint[0];
      const diffY = this.state.cursorPoint[1] - this.state.pinnedCursorPoint[1];

      // Only mutate what's hot unless we're moving things around. Then we can
      // mutate all of the selected items at once.
      if (this.state.anchorPosition === AnchorPosition.Center) {
        for (let cycle of this.selected().values()) cycle.mutate(diffX, diffY);
      } else {
        for (let cycle of this.state.hotCycles.values())
          cycle.mutate(diffX, diffY);
      }
    }
  }

  /**
   * Handle anytime a key is pressed.
   */
  private handleKeyDown(e: KeyboardEvent) {
    const direction = {
      [KeyEvent.ARROW_LEFT]: [-this.os.canvas.grid.density, 0],
      [KeyEvent.ARROW_RIGHT]: [this.os.canvas.grid.density, 0],
      [KeyEvent.ARROW_UP]: [0, -this.os.canvas.grid.density],
      [KeyEvent.ARROW_DOWN]: [0, this.os.canvas.grid.density]
    };
    switch (e.keyCode) {
      case KeyEvent.BACKSPACE: {
        e.preventDefault();
        for (let cycle of this.selected().values()) this.remove(cycle);
        break;
      }
      case KeyEvent.ARROW_UP:
      case KeyEvent.ARROW_DOWN:
      case KeyEvent.ARROW_RIGHT:
      case KeyEvent.ARROW_LEFT:
        e.preventDefault();
        this.state.anchorPosition = AnchorPosition.Center;
        for (let cycle of this.selected().values()) {
          cycle.mutate(direction[e.keyCode][0], direction[e.keyCode][1]);
          cycle.prevPts = cycle.shape.pts;
        }
        this.state.anchorPosition = null;
        break;
    }
  }
}
