import Canvas from "./canvas";
import Layers from "./layers";
import Layer from "./layer";
import Toolbar from "./toolbar";
import Rect from "./rect";
import * as util from "./util";

import { ActionType, Point, Group, LayerType } from "./types";

enum Area {
  Corner = 0,
  Center
}

interface Selection {
  layer: Layer;
  area: Area;
}

export function configure(canvas: Canvas, toolbar: Toolbar, layers: Layers) {
  const state = new State(canvas);

  canvas.onMouseMove((e: MouseEvent) => {
    state.cursorPoint = canvas.grid.closestPt;
  });

  canvas.onMouseDown((e: MouseEvent) => {
    state.mouseDown = true;
    state.selection = what(canvas.grid.closestPt, layers);
    if (state.selection) {
      state.pinnedPts = util.clone(state.selection.layer.shape.pts);
    } else {
      // const addLayer(
    }
    console.log(state.selection);
    state.pinnerCursorPoint = canvas.grid.closestPt;
    state.process();
  });

  canvas.onMouseUp((e: MouseEvent) => {
    state.mouseDown = false;
    state.process();
  });
}

function addLayer(layers: Layers, shape): Layer {
  const layer = new Layer();
  layer.humanName = "Rectangle";
  layer.type = LayerType.Rect;
  layer.shape = shape;
  layers.addLayer(layer);
  layers.render();

  return layer;
}

function what(cursor: Point, layers: Layers): Selection | null {
  const list = layers.getLayers();

  for (let i = 0, l = list.length; i < l; i++) {
    const layer = list[i];
    const shape = list[i].shape;

    if (shape.pts.length > 1) {
      if (util.withinBound(cursor, shape.pts)) {
        return {
          layer,
          area: Area.Corner
        };
      }
    }
  }
}

class State {
  public cursorPoint: Point;
  public pinnerCursorPoint: Point;
  public mouseDown: boolean;
  public selection: Selection | null;
  public pinnedPts: Group | null;

  protected canvas: Canvas;

  constructor(canvas: Canvas) {
    this.canvas = canvas;
  }

  public process() {
    if (this.mouseDown && this.selection) {
      if (this.selection.area === Area.Corner) {
        this.selection.layer.shape.pts = [
          this.pinnerCursorPoint,
          this.cursorPoint
        ];
      } else if (this.selection.area === Area.Center) {
        this.selection.layer.shape.pts = <Group>(
          util.add(
            <Point>util.subtract(this.cursorPoint, this.pinnerCursorPoint),
            this.pinnedPts
          )
        );
      }
    }
  }
}
