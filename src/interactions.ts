import Canvas from "./canvas";
import LayerDrawer from "./layer-drawer";
import Layer from "./layer";
import Toolbar from "./toolbar-drawer";
import ControlDrawer from "./control-drawer";
import * as util from "./util";
import State from "./state";
import MarqueeLifeCycle from "./marquee-lifecycle";
import RectLifeCycle from "./rect-lifecycle";
import LineLifeCycle from "./line-lifecycle";

import {
  ColorPalette,
  Mode,
  ActionType,
  Point,
  Group,
  LayerType
} from "./types";

enum Area {
  Corner = 0,
  Center
}

interface Selection {
  layer: Layer;
  area: Area;
}

interface OS {
  colors: ColorPalette;
  toolbar: Toolbar;
  canvas: Canvas;
  layers: LayerDrawer;
  controldrawer: ControlDrawer;
}

export function configure(os: OS): void {
  const state = new State();
  const op = new Operator(os, state);
  op.dbind();
}

// function addLayer(layers: Layers, shape): Layer {
//   const layer = new Layer();
//   layer.humanName = "Rectangle";
//   layer.type = LayerType.Rect;
//   layer.shape = shape;
//   layers.addLayer(layer);
//   layers.render();
//
//   return layer;
// }

// function what(cursor: Point, layers: Layers): Selection | null {
//   const list = layers.getLayers();
//
//   for (let i = 0, l = list.length; i < l; i++) {
//     const layer = list[i];
//     const shape = list[i].shape;
//
//     if (shape.pts.length > 1) {
//       if (util.withinBound(cursor, shape.pts)) {
//         return {
//           layer,
//           area: Area.Corner
//         };
//       }
//     }
//   }
// }

// class RectangleLifeCycle extends LifeCycle {
//   start(c: Canvas, s: State) {
//     const shape = new Marquee(c);
//     const layer = new Layer();
//     layer.humanName = "Rectangle";
//     layer.type = LayerType.Rect;
//     layer.shape = shape;
//
//     s.selection = what(canvas.grid.closestPt, layers);
//     this.initialPts = util.clone(s.selection.layer.shape.pts);
//   }
//   stop() {}
// }

class Operator {
  private activity: null | MarqueeLifeCycle | RectLifeCycle | LineLifeCycle;
  private state: State;
  private os: OS;
  constructor(os: OS, state: State) {
    this.state = state;
    this.os = os;
  }
  public dbind() {
    this.os.canvas.onMouseDown(this.handleMouseDown.bind(this));
    this.os.canvas.onMouseUp(this.handleMouseUp.bind(this));
    this.os.canvas.onMouseMove(this.handleMouseMove.bind(this));
    this.os.toolbar.onModeChange = this.handleChangeMode.bind(this);
  }
  private handleChangeMode(m: Mode) {
    this.state.mode = m;
  }
  private handleMouseDown(e: MouseEvent) {
    this.state.downAt = new Date().getTime();
    this.state.pinnedCursorPoint = this.os.canvas.grid.closestPt;
    this.state.cursorPoint = this.os.canvas.grid.closestPt;

    switch (this.state.mode) {
      case Mode.Marquee:
        this.activity = new MarqueeLifeCycle();
        break;
      case Mode.Rectangle:
        this.activity = new RectLifeCycle();
        break;
      case Mode.Line:
        this.activity = new LineLifeCycle();
        break;
    }

    this.activity.colors = this.os.colors;
    this.activity.start(this.os.canvas, this.state);
  }
  private handleMouseUp(e: MouseEvent) {
    if (this.activity) {
      this.activity.stop(this.os.canvas);
      this.activity = null;
    }
  }
  private handleMouseMove(e: MouseEvent) {
    this.state.cursorPoint = this.os.canvas.grid.closestPt;

    if (this.activity) {
      this.activity.run(this.state);
    }
  }
}
