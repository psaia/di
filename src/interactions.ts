import State from "./state";
import * as util from "./util";
import MarqueeLifecycle from "./marquee-lifecycle";
import RectLifecycle from "./rect-lifecycle";
import LineLifecycle from "./line-lifecycle";
import Lifecycle from "./lifecycle";
import { Mode, AnchorPosition, Group, KeyEvent } from "./types";
import Events from "./events";

export function configure(state: State, events: Events): void {
  const op = new Operator(state, events);

  op.dbind();
}

class Operator {
  private state: State;
  private events: Events;

  constructor(state: State, events: Events) {
    this.state = state;
    this.events = events;
  }

  /**
   * Bind the canvas and toolbar elements in the OS to event listeners in the
   * operator.
   */
  public dbind() {
    this.events.subscribeFast(
      "canvasMouseMove",
      this.handleMouseMove.bind(this)
    );
    this.events.subscribeFast("canvasMouseUp", this.handleMouseUp.bind(this));
    this.events.subscribeFast(
      "canvasMouseDown",
      this.handleMouseDown.bind(this)
    );

    document.addEventListener("keydown", this.handleKeyDown.bind(this), false);
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
  public select(cycle: Lifecycle, selected: boolean = true) {
    cycle.select(selected);

    // Even though a property didn't change directly, publish a state change so
    // listeners can update after something is updated.
    this.events.publish("stateChange", null);
  }

  /**
   * Delete a cycle from stage fully.
   */
  public remove(cycle) {
    this.state.cycles.delete(cycle);
  }

  /**
   * When the mouse is pressed on the canvas.
   */
  private handleMouseDown(e: MouseEvent) {
    // Configure state based on this mousedown.
    this.state.setStateProp(
      this.events,
      "anchorPosition",
      AnchorPosition.RightBottom
    );

    // Loop through each cycle to see if the user clicked on something on the
    // stage.
    for (let cycle of this.state.cycles.values()) {
      // Note that the cursorPt is passed and not the closestPt. This is so the
      // most absolute position is accounted for.
      const o = cycle.hitTest(this.state.cursorPt);
      if (o !== null) {
        this.state.setStateProp(this.events, "anchorPosition", o.position);

        if (this.state.selected().size === 1) {
          this.deselectAll();
        }

        cycle.prevPts = cycle.shape.pts;
        this.select(cycle, true);
        return;
      }
    }

    // Deselect all shapes before creating a new one or selecting others.
    this.deselectAll();
    const ctx = this.state.stageCtx;

    // Move on to creating a new shape w/ mgmt lifecycle.
    switch (this.state.mode) {
      case Mode.Marquee: {
        const cycle = new MarqueeLifecycle();
        cycle.start(
          ctx,
          [this.state.pinnedCursorPt, this.state.pinnedCursorPt],
          this.state.colors
        );
        this.state.cycles.add(cycle);
        this.select(cycle, true);
        break;
      }
      case Mode.Rectangle: {
        const cycle = new RectLifecycle();
        cycle.start(
          ctx,
          [this.state.pinnedCursorPt, this.state.pinnedCursorPt],
          this.state.colors
        );
        this.state.cycles.add(cycle);
        this.select(cycle, true);
        break;
      }
      case Mode.Line: {
        const cycle = new LineLifecycle();
        cycle.start(
          ctx,
          [this.state.pinnedCursorPt, this.state.pinnedCursorPt],
          this.state.colors
        );
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
    if (this.state.cycles.size) {
      for (let cycle of this.state.cycles.values()) {
        // A marquee gets removed as soon as the cursor is released, always. Then
        // selecty any shapes that the marquee overlapped.
        if (cycle instanceof MarqueeLifecycle) {
          const marqueePts = cycle.shape.pts;
          this.remove(cycle);
          this.deselectAll();
          this.selectWithinRect(marqueePts);
        } else {
          cycle.prevPts = cycle.shape.pts;
        }
      }
    }

    // Reset the mode to be marquee, always.
    this.state.setStateProp(this.events, "mode", Mode.Marquee);
    this.state.setStateProp(this.events, "anchorPosition", null);

    const selected = this.state.selected();

    if (
      selected.size === 1 &&
      selected.values().next().value instanceof RectLifecycle
    ) {
      this.events.publish("rect.focus-text", null);
    }
  }

  /**
   * When the mouse moves all cycles need to be mutated relative to the
   * current state.
   */
  private handleMouseMove(e: MouseEvent) {
    if (this.state.anchorPosition !== null) {
      const diffX = this.state.cursorGridPt[0] - this.state.pinnedCursorPt[0];
      const diffY = this.state.cursorGridPt[1] - this.state.pinnedCursorPt[1];

      for (let cycle of this.state.selected().values()) {
        cycle.mutate(
          this.state.anchorPosition,
          diffX,
          diffY,
          this.state.colors
        );
      }

      // Only mutate what's hot unless we're moving things around. Then we can
      // mutate all of the selected items at once.
      // if (this.state.anchorPosition === AnchorPosition.Center) {
      //   for (let cycle of this.state.selected().values())
      //     cycle.mutate(
      //       this.state.anchorPosition,
      //       diffX,
      //       diffY,
      //       this.state.colors
      //     );
      // } else {
      //   for (let cycle of this.state.hotCycles.values())
      //     cycle.mutate(
      //       this.state.anchorPosition,
      //       diffX,
      //       diffY,
      //       this.state.colors
      //     );
      // }
    }
  }

  /**
   * Handle anytime a key is pressed.
   */
  private handleKeyDown(e: any) {
    switch (e.target.nodeName) {
      case "INPUT":
      case "SELECT":
      case "TEXTBOX":
        return;
    }

    const direction = {
      [KeyEvent.ARROW_LEFT]: [-this.state.gridDensity, 0],
      [KeyEvent.ARROW_RIGHT]: [this.state.gridDensity, 0],
      [KeyEvent.ARROW_UP]: [0, -this.state.gridDensity],
      [KeyEvent.ARROW_DOWN]: [0, this.state.gridDensity]
    };
    switch (e.keyCode) {
      case KeyEvent.BACKSPACE: {
        e.preventDefault();
        for (let cycle of this.state.selected().values()) this.remove(cycle);
        break;
      }
      case KeyEvent.ARROW_UP:
      case KeyEvent.ARROW_DOWN:
      case KeyEvent.ARROW_RIGHT:
      case KeyEvent.ARROW_LEFT:
        e.preventDefault();
        for (let cycle of this.state.selected().values()) {
          cycle.mutate(
            AnchorPosition.Center,
            direction[e.keyCode][0],
            direction[e.keyCode][1],
            this.state.colors
          );
          cycle.prevPts = cycle.shape.pts;
        }
        break;
    }
  }
}
