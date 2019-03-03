import Canvas from "./canvas";
import Layers from "./layers";
import Layer from "./layer";
import Toolbar from "./toolbar";
import ControlDrawer from "./controldrawer";
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

interface OS {
  toolbar: Toolbar;
  canvas: Canvas;
  layers: Layers;
  controldrawer: ControlDrawer;
}

class State {
  public cursorPoint: Point;
  public pinnerCursorPoint: Point;
  public mouseDown: boolean;
  public selection: Selection | null;
  public pinnedPts: Group | null;
  public downAt: number;
  protected canvas: Canvas;
}

export function configure(os: OS): void {
  const state = new State();
  const system = new System(os, state);
  system.connect();
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

const QUICK_CLICK_MS = 200;

class System {
  private state: State;
  private os: OS;
  constructor(os: OS, state: State) {
    this.state = state;
    this.os = os;
  }
  public connect() {
    this.os.canvas.onMouseDown(this.handleMouseDown.bind(this));
    this.os.canvas.onMouseUp(this.handleMouseUp.bind(this));
    this.os.canvas.onMouseMove(this.handleMouseMove.bind(this));
  }
  private handleMouseUp(e: MouseEvent) {
    this.state.mouseDown = false;
    if (new Date().getTime() - this.state.downAt < QUICK_CLICK_MS) {
      this.os.toolbar.show(this.os.canvas.grid.cursorPt);
    }
  }

  private handleMouseDown(e: MouseEvent) {
    this.state.mouseDown = true;
    this.state.downAt = new Date().getTime();
    // state.mouseDown = true;
    // state.selection = what(canvas.grid.closestPt, layers);
    // if (state.selection) {
    //   state.pinnedPts = util.clone(state.selection.layer.shape.pts);
    // } else {
    //   // const addLayer(
    // }
    // console.log(state.selection);
    // state.pinnerCursorPoint = canvas.grid.closestPt;
    // state.process();
  }
  private handleMouseMove(e: MouseEvent) {
    // if (this.mouseDown && this.selection) {
    //   if (this.selection.area === Area.Corner) {
    //     this.selection.layer.shape.pts = [
    //       this.pinnerCursorPoint,
    //       this.cursorPoint
    //     ];
    //   } else if (this.selection.area === Area.Center) {
    //     this.selection.layer.shape.pts = <Group>(
    //       util.add(
    //         <Point>util.subtract(this.cursorPoint, this.pinnerCursorPoint),
    //         this.pinnedPts
    //       )
    //     );
    //   }
  }
}
