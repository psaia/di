import State from "./state";
import Canvas from "./canvas";
import { HitTestResult, Point } from "./types";

export default abstract class Lifecycle {
  protected state: State;
  constructor(state: State) {
    this.state = state;
  }

  /**
   * Called when we want to indicate that the shapes this lifecycle managers
   * should be in a selected state.
   */
  abstract select(selected: boolean): void;

  /**
   * Determine what is at a given point.
   */
  abstract hitTest(p: Point): HitTestResult;

  /**
   * Instantiate the shapes on this canvas, including any tuxes.
   */
  abstract start(c: Canvas);

  /**
   * Mutate is called on every interactive tick and will mutate the relative
   * points based on the state.
   */
  abstract mutate();

  /**
   * Remove all shapes that this lifecycle manages from the canvas.
   */
  abstract remove(c: Canvas);
}
