import {
  ColorPalette,
  AnchorPosition,
  HitTestResult,
  Point,
  Group
} from "./types";
import Shape from "./shape";
import Tux from "./tux";

export default abstract class Lifecycle {
  public shape: Shape;
  public tux: Tux;
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
  abstract start(
    ctx: CanvasRenderingContext2D,
    initialPts: Group,
    colors: ColorPalette
  );

  /**
   * Mutate is called on every interactive tick and will mutate the relative
   * points based on the state.
   */
  abstract mutate(
    anchorPosition: AnchorPosition,
    diffX: number,
    diffY: number,
    colors: ColorPalette
  );

  /**
   * Add an option to the nested shape within this lifecycle.
   */
  setOption(name: string, value: number | string) {
    this.shape.options[name] = value;
  }
}
