import Canvas from "./canvas";
import { ColorPalette, Group } from "./types";

export default abstract class Shape {
  public ctx: CanvasRenderingContext2D;
  public uid: string;
  public pts: Group = [];
  public colors: ColorPalette;
  protected animating: boolean = true;

  abstract render();

  stop() {
    this.animating = false;
  }

  play() {
    this.animating = true;
  }
}
