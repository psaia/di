import { Mode, Point, ColorPalette, AnchorPosition } from "./types";
import * as palettes from "./palettes";
import MarqueeLifecycle from "./marquee-lifecycle";
import RectLifecycle from "./rect-lifecycle";
import LineLifecycle from "./line-lifecycle";

export type LifecycleItem = MarqueeLifecycle | RectLifecycle | LineLifecycle;

/**
 * This class is instantiated in the interactions module and is mutated as
 * needed. It effectively contains the entire state of the application at a
 * given moment from a data perspective.
 */
export default class State {
  // The current selected objects.
  public hotCycles: Set<LifecycleItem> = new Set();

  // Mode represents the intended object to create. This is updated by the
  // toolbar.
  public mode: Mode = Mode.Marquee;

  // The anchorPosition which is being dragged on a given cycle.
  public anchorPosition: AnchorPosition;

  // All cycles in runtime/stage.
  public cycles: Set<LifecycleItem> = new Set();

  public colors: ColorPalette = palettes.DEFAULT;
  public cursorPoint: Point;
  public pinnedCursorPoint: Point;
  public downAt: number;
}
