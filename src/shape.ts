import { ColorPalette, Group, AnchorPosition } from "./types";

/**
 * All shapes on the stage must implement this class.
 */
export default abstract class Shape {
  public ctx: CanvasRenderingContext2D;
  public uid: string;
  public pts: Group = [];
  public colors: ColorPalette;
  public anchor: AnchorPosition;
  protected animating: boolean = true;

  abstract render();

  stop() {
    this.animating = false;
  }

  play() {
    this.animating = true;
  }
}
