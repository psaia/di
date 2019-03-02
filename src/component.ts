import { RenderFn, ColorPalette } from "./Types";

export default abstract class Component {
  protected rendered: RenderFn;
  protected colorPalette: ColorPalette;

  constructor(defaultPalette: ColorPalette) {
    this.setColorPalette(defaultPalette);
  }

  onRender(fn: RenderFn) {
    this.rendered = fn;
  }

  setColorPalette(c: ColorPalette) {
    this.colorPalette = c;
  }

  // Always call this.rendered(element); at the end.
  public abstract render();
}
