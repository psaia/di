import {
  Mode,
  ActionType,
  Point,
  Group,
  LayerType,
  ColorPalette
} from "./types";
import * as palettes from "./palettes";
import Canvas from "./canvas";

export default class State {
  public mode: Mode = Mode.Marquee;
  public colors: ColorPalette = palettes.DEFAULT;
  public cursorPoint: Point;
  public pinnedCursorPoint: Point;
  public downAt: number;
}
