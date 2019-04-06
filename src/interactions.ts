import Canvas from "./canvas";
import Layers from "./layers";
import Layer from "./layer";
import Toolbar from "./toolbar";
import ControlDrawer from "./controldrawer";
import Rect from "./rect";
import Marquee from "./marquee";
import * as util from "./util";

import { Mode, ActionType, Point, Group, LayerType } from "./types";

enum Area {
  Corner = 0,
  Center
}

interface Selection {
  layer: Layer;
  area: Area;
}

interface OS {
  toolbar: Toolbar;
  canvas: Canvas;
  layers: Layers;
  controldrawer: ControlDrawer;
}

export function configure(os: OS): void {
  const state = new State();
  const shell = new Shell(os, state);
  shell.dombind();
}

class State {
  public mode: Mode;
  public cursorPoint: Point;
  public pinnedCursorPoint: Point;
  public downAt: number;
  protected canvas: Canvas;
}

abstract class LifeCycle {
  abstract start(c: Canvas, s: State);
  abstract stop(c: Canvas);
  abstract run(s: State);
}

class MarqueeLifeCycle extends LifeCycle {
  shape: Marquee;
  initialPts: Group;
  start(c: Canvas, s: State) {
    this.shape = new Marquee();
    this.shape.pts = [s.pinnedCursorPoint, s.cursorPoint];
    this.shape.uid = crypto.getRandomValues(new Uint32Array(4)).join("-");
    this.initialPts = util.clone(this.shape.pts);
    c.addShape(this.shape);
  }
  stop(c: Canvas) {
    this.shape.stop();
    c.removeShape(this.shape);
  }
  run(s: State) {
    this.shape.pts = [s.pinnedCursorPoint, s.cursorPoint];
  }
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

const QUICK_CLICK_MS = 200;

class Shell {
  private activity: null | MarqueeLifeCycle;
  private state: State;
  private os: OS;
  constructor(os: OS, state: State) {
    this.state = state;
    this.os = os;
  }
  public dombind() {
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

    if (this.state.mode === Mode.Marquee) {
      this.activity = new MarqueeLifeCycle();
      this.activity.start(this.os.canvas, this.state);
    }
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
