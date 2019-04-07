import { RenderFn, ColorPalette } from "./Types";
import * as palettes from "./palettes";

export default abstract class Component {
  protected rendered: RenderFn;
  protected colorPalette: ColorPalette = palettes.DEFAULT;

  public onRender(fn: RenderFn) {
    this.rendered = fn;
  }

  public setColorPalette(c: ColorPalette) {
    this.colorPalette = c;
    this.render();
  }

  // Always call this.rendered(element); at the end.
  public abstract render();
}
