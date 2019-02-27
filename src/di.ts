import * as dom from "./dom";
import * as util from "./util";
import Canvas from "./canvas";
import { Point, ActionType } from "./types";
import Layer from "./layer";
import Line from "./line";
import Rect from "./rect";
import Grid from "./grid";

export default class Di {
  constructor(parentEl: string) {
    const canvas = new Canvas(dom.select(parentEl)).configure();

    const grid = new Grid();
    const rects: Rect[] = [];
    const lastRect = () => rects[rects.length - 1];
    let rectAction: ActionType;
    let _activeRect: Rect;
    let clickedPt: Point = util.pt();
    let mouseDown = false;

    canvas.addLayer(grid);
    grid.setSize(canvas.width, canvas.height);

    const activeRect = () => {
      for (let i = 0, l = rects.length; i < l; i++) {
        if (Rect.withinBound(grid.cursorPt, rects[i].pts)) {
          return rects[i];
        }
      }
    };

    let tmpPts;

    canvas.evt.subscribe("mousemove", (e: MouseEvent) => {
      grid.setCursor(util.pt(e.x, e.y));

      // If clicking into a square, move it. If not, create a new.
      if (mouseDown) {
        if (rectAction === ActionType.CREATING) {
          _activeRect.pts = [clickedPt, grid.closestPt];
        } else if (rectAction === ActionType.MOVING) {
          _activeRect.pts = util.subtract(
            util.subtract(grid.closestPt, [clickedPt])[0],
            tmpPts
          );
        }
      }
    });

    canvas.evt.subscribe("mousedown", (e: MouseEvent) => {
      mouseDown = true;
      clickedPt = grid.closestPt;

      _activeRect = activeRect();

      if (!_activeRect) {
        rectAction = ActionType.CREATING;

        // Add a new grid on the stack.
        _activeRect = new Rect(grid.grid);
        canvas.addLayer(_activeRect);
        rects.push(_activeRect);
      } else {
        tmpPts = util.clone(_activeRect.pts);
        rectAction = ActionType.MOVING;
      }
    });

    canvas.evt.subscribe("mouseup", (e: MouseEvent) => {
      mouseDown = false;
    });

    canvas.evt.subscribe("resize", (e: MouseEvent) => {
      grid.setSize(canvas.width, canvas.height);
    });
  }
}

// Ghetto exposure.
let w: any = window;
w.Di = Di;
