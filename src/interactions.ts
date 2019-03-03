import Canvas from "./canvas";
import Layers from "./layers";
import Layer from "./layer";
import Toolbar from "./toolbar";
import Rect from "./rect";
import * as util from "./util";

import { ActionType, Point, Group, LayerType } from "./types";

function addLayer(layers: Layers, shape) {
  const layer = new Layer();
  layer.humanName = "Rectangle";
  layer.type = LayerType.Rect;
  layer.shape = shape;

  layers.addLayer(layer);
  layers.render();
}

export function configure(canvas: Canvas, toolbar: Toolbar, layers: Layers) {
  const rects: Rect[] = [];
  const lastRect = () => rects[rects.length - 1];

  let rectAction: ActionType;
  let _activeShape: Rect;
  let clickedPt: Point = util.pt();
  let mouseDown = false;

  const activeRect = () => {
    for (let i = 0, l = rects.length; i < l; i++) {
      if (rects[i].pts.length > 1) {
        if (util.withinBound(canvas.grid.cursorPt, rects[i].pts)) {
          return rects[i];
        }
      }
    }
  };

  let tmpPts;

  canvas.evt.subscribe("mousemove", (e: MouseEvent) => {
    // If clicking into a square, move it. If not, create a new.
    if (mouseDown) {
      if (rectAction === ActionType.Creating) {
        _activeShape.pts = [clickedPt, canvas.grid.closestPt];
      } else if (rectAction === ActionType.Moving) {
        _activeShape.pts = <Group>(
          util.add(
            <Point>util.subtract(canvas.grid.closestPt, clickedPt),
            tmpPts
          )
        );
      }
    }
  });

  canvas.evt.subscribe("mousedown", (e: MouseEvent) => {
    mouseDown = true;
    clickedPt = canvas.grid.closestPt;

    _activeShape = activeRect();

    if (_activeShape) {
      tmpPts = util.clone(_activeShape.pts);
      rectAction = ActionType.Moving;
    } else {
      // Add a new grid on the stack.
      _activeShape = new Rect(canvas);
      canvas.addShape(_activeShape);
      rects.push(_activeShape);
      addLayer(layers, _activeShape);

      rectAction = ActionType.Creating;
    }
  });

  canvas.evt.subscribe("mouseup", (e: MouseEvent) => {
    mouseDown = false;
  });
}
