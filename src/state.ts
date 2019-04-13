import { Mode, Point, ColorPalette, AnchorPosition } from "./types";
import * as palettes from "./palettes";
import Events from "./events";
import Lifecycle from "./lifecycle";
import * as util from "./util";

/**
 * This class is instantiated in the interactions module and is mutated as
 * needed. It effectively contains the entire state of the application at a
 * given moment from a data perspective.
 */
export default class State {
  public stageCtx: CanvasRenderingContext2D;
  public cursorPt: Point = util.pt(0, 0);
  public cursorGridPt: Point = util.pt(0, 0);

  // Where the cursor clicked on the stage last.
  public pinnedCursorPt: Point;

  public gridDensity: number = 12;

  // The current selected objects.
  public hotCycles: Set<Lifecycle> = new Set();

  // Mode represents the intended object to create. This is updated by the
  // toolbar.
  public mode: Mode = Mode.Marquee;

  // The anchorPosition which is being dragged on a given cycle.
  public anchorPosition: AnchorPosition = null;

  // All cycles in runtime/stage.
  public cycles: Set<Lifecycle> = new Set();

  // The currently selected color palette.
  public colors: ColorPalette = palettes.DEFAULT;

  // DateTime of click.
  public downAt: number;

  public selected(): Set<Lifecycle> {
    const s = new Set();
    for (let cycle of this.cycles.values()) {
      if (cycle.selected) {
        s.add(cycle);
      }
    }
    return s;
  }

  public setStateProp(
    events: Events,
    propName: string,
    value: any,
    broadcast: boolean = true
  ): State {
    this[propName] = value;
    if (broadcast) {
      events.publish("stateChange", this);
    }
    return this;
  }
}
