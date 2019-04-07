import {
  Mode,
  Point,
  ColorPalette
} from "./types";
import * as palettes from "./palettes";

export default class State {
  public mode: Mode = Mode.Marquee;
  public colors: ColorPalette = palettes.DEFAULT;
  public cursorPoint: Point;
  public pinnedCursorPoint: Point;
  public downAt: number;
}
