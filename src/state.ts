import { Mode, Point, ColorPalette, AnchorPosition, Group } from "./types";
import * as palettes from "./palettes";
import MarqueeLifeCycle from "./marquee-lifecycle";
import RectLifeCycle from "./rect-lifecycle";
import LineLifeCycle from "./line-lifecycle";

type LifeCycleItem = MarqueeLifeCycle | RectLifeCycle | LineLifeCycle;

/**
 * This class is instantiated in the interactions module and is mutated as
 * needed. It effectively contains the entire state of the application at a
 * given moment from a data perspective.
 */
export default class State {
  // The current selected object.
  public cycle: LifeCycleItem | null;
  // Mode represents the intended object to create. This is updated by the
  // toolbar.
  public mode: Mode = Mode.Marquee;
  public anchorPosition: AnchorPosition;
  public cycles: Set<LifeCycleItem> = new Set();
  public colors: ColorPalette = palettes.DEFAULT;
  public cursorPoint: Point;
  public pinnedCursorPoint: Point;
  public initialPts: Group = [];
  public downAt: number;
}
