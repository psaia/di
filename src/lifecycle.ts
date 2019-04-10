import State from "./state";
import Canvas from "./canvas";
import { HitTestResult, Point, Group } from "./types";

export default abstract class Lifecycle {
  protected state: State;

  /**
   * prevPts need to be updated anytime a series of mutations is complete. This
   * needs to be handled manually since there's not way to automatically know
   * when the mutation is totally complete.
   */
  public prevPts: Group = [];

  /**
   * Determine whether or not the object is selected.
   */
  public selected: boolean = true;

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
  abstract mutate(diffX: number, diffY: number);

  /**
   * Remove all shapes that this lifecycle manages from the canvas.
   */
  abstract remove(c: Canvas);

  constructor(state: State) {
    this.state = state;
  }
}
