import {
  ColorPalette,
  Mode,
  ActionType,
  Point,
  Group,
  LayerType
} from "./types";

import Canvas from "./canvas";

export default class State {
  public mode: Mode;
  public cursorPoint: Point;
  public pinnedCursorPoint: Point;
  public downAt: number;
  protected canvas: Canvas;
}
