import {
  ColorPalette,
  Mode,
  ActionType,
  Point,
  Group,
  LayerType
} from "./types";

import State from "./state";
import Canvas from "./canvas";

export default abstract class LifeCycle {
  colors: ColorPalette;
  abstract start(c: Canvas, s: State);
  abstract stop(c: Canvas);
  abstract run(s: State);
}
