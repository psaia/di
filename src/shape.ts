import Canvas from "./canvas";
import { ColorPalette, Group } from "./types";

export default abstract class Shape {
  public pts: Group = [];
  protected canvas: Canvas;
  protected animating: boolean = true;

  constructor(canvas: Canvas) {
    this.canvas = canvas;
  }

  abstract render(colorPalette: ColorPalette);

  stop() {
    this.animating = false;
  }

  play() {
    this.animating = true;
  }
}
