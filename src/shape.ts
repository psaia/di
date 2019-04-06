import Canvas from "./canvas";
import { ColorPalette, Group } from "./types";

export default abstract class Shape {
  public uid: string;
  public pts: Group = [];
  protected animating: boolean = true;

  abstract render(canvas: CanvasRenderingContext2D, colorPalette: ColorPalette);

  stop() {
    this.animating = false;
  }

  play() {
    this.animating = true;
  }
}
