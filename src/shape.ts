import { ColorPalette, Group } from "./types";

/**
 * All shapes on the stage must implement this class.
 */
export default abstract class Shape {
  public ctx: CanvasRenderingContext2D;
  public pts: Group = [];
  public colors: ColorPalette;
  public animating: boolean = true;

  abstract render(): void;

  stop() {
    this.animating = false;
  }

  play() {
    this.animating = true;
  }
}
