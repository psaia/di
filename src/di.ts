import * as dom from "./dom";
import * as util from "./util";
import Canvas from "./canvas";
import { Point, ActionType, ColorPalette } from "./types";
import Layer from "./layer";
import Line from "./line";
import Rect from "./rect";
import Grid from "./grid";
import PubSub from "./pubsub";

export default class Di {
  private appContainer: HTMLElement;
  private sidebarContainer: HTMLElement;
  private stageContainer: HTMLElement;
  private layers: Layer[];
  private pubsub: PubSub = new PubSub();
  private canvas: Canvas;
  private colorPalette: ColorPalette = {
    sidebarBg: "#000000",
    sidebarColor: "#CCCCCC",
    stageBg: "#151515",
    stageColor: "#FFFFFF"
  };

  constructor(parentEl: string) {
    this.appContainer = dom.select(parentEl);
    this.buildLayers();
    this.buildStage();
    this.paint();
    this.render();
  }

  buildLayers() {
    this.sidebarContainer = dom.section("sidebar-container");
    this.sidebarContainer.style.width = "200px";
    this.appContainer.appendChild(this.sidebarContainer);
  }

  buildStage() {
    this.stageContainer = dom.section("stage-container");
    this.stageContainer.style.height = "100%";
    this.stageContainer.style.width = "100%";
    this.canvas = new Canvas(this.stageContainer).configure();
    this.appContainer.appendChild(this.stageContainer);
  }

  paint() {
    this.stageContainer.style.backgroundColor = this.colorPalette.stageBg;
    this.stageContainer.style.color = this.colorPalette.stageColor;
    this.sidebarContainer.style.backgroundColor = this.colorPalette.sidebarBg;
    this.sidebarContainer.style.color = this.colorPalette.sidebarColor;
  }

  render() {
    const grid = new Grid();
    const rects: Rect[] = [];
    const lastRect = () => rects[rects.length - 1];

    let rectAction: ActionType;
    let _activeRect: Rect;
    let clickedPt: Point = util.pt();
    let mouseDown = false;

    this.canvas.addLayer(grid);

    grid.setSize(this.canvas.width, this.canvas.height);

    const activeRect = () => {
      for (let i = 0, l = rects.length; i < l; i++) {
        if (Rect.withinBound(grid.cursorPt, rects[i].pts)) {
          return rects[i];
        }
      }
    };

    let tmpPts;

    this.canvas.evt.subscribe("mousemove", (e: MouseEvent) => {
      grid.setCursor(util.pt(e.layerX, e.layerY));

      // If clicking into a square, move it. If not, create a new.
      if (mouseDown) {
        if (rectAction === ActionType.Creating) {
          _activeRect.pts = [clickedPt, grid.closestPt];
        } else if (rectAction === ActionType.Moving) {
          _activeRect.pts = util.subtract(
            util.subtract(grid.closestPt, [clickedPt])[0],
            tmpPts
          );
        }
      }
    });

    this.canvas.evt.subscribe("mousedown", (e: MouseEvent) => {
      mouseDown = true;
      clickedPt = grid.closestPt;

      _activeRect = activeRect();

      if (!_activeRect) {
        rectAction = ActionType.Creating;

        // Add a new grid on the stack.
        _activeRect = new Rect(grid.grid);
        this.canvas.addLayer(_activeRect);
        rects.push(_activeRect);
      } else {
        tmpPts = util.clone(_activeRect.pts);
        rectAction = ActionType.Moving;
      }
    });

    this.canvas.evt.subscribe("mouseup", (e: MouseEvent) => {
      mouseDown = false;
    });

    this.canvas.evt.subscribe("resize", (e: MouseEvent) => {
      grid.setSize(this.canvas.width, this.canvas.height);
    });
  }
}

// Ghetto exposure.
let w: any = window;
w.Di = Di;
