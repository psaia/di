import * as dom from "./dom";
import * as util from "./util";
import Grid from "./grid";
import Component from "./component";
import { ColorPalette } from "./types";

export default class Canvas extends Component {
  public width: number = 0;
  public height: number = 0;
  public ctx: CanvasRenderingContext2D;
  public canvas: HTMLCanvasElement;
  public container: HTMLElement;
  public grid: Grid;
  protected pixelScale = 1;
  protected time = { prev: 0, diff: 0 };
  protected shapes: any = [];
  protected mouseDownFn;
  protected mouseUpFn;
  protected mouseMoveFn;
  protected resizeFn;

  public addShape(layer) {
    this.shapes.push(layer);
  }

  public onMouseDown(fn) {
    this.mouseDownFn = fn;
  }
  public onMouseUp(fn) {
    this.mouseUpFn = fn;
  }
  public onMouseMove(fn) {
    this.mouseMoveFn = fn;
  }
  public onResize(fn) {
    this.resizeFn = fn;
  }

  private listen(o: any, evt: string, fn: (e?: any) => void) {
    o.addEventListener(evt, fn, false);
  }

  private play(time = 0) {
    requestAnimationFrame(this.play.bind(this));

    this.time.diff = time - this.time.prev;
    this.time.prev = time;

    this.renderShapes();
  }

  private renderShapes() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.grid.render();

    for (let i = 0, l = this.shapes.length; i < l; i++) {
      this.shapes[i].render(this.colorPalette);
    }
  }

  private resize() {
    const { width, height } = dom.getDimensions(this.container);
    this.width = width;
    this.height = height;

    this.grid.setSize(width, height);

    this.canvas.setAttribute("width", String(width * this.pixelScale));
    this.canvas.setAttribute("height", String(height * this.pixelScale));

    this.canvas.width = width * this.pixelScale;
    this.canvas.height = height * this.pixelScale;
    this.canvas.style.width = `${Math.floor(width)}px`;
    this.canvas.style.height = `${Math.floor(height)}px`;

    if (this.pixelScale > 1) {
      this.ctx.scale(this.pixelScale, this.pixelScale);
      this.ctx.translate(0.5, 0.5);
    }

    this.renderShapes();
  }

  render() {
    this.container = dom.section("app");
    this.container.style.height = "100%";
    this.container.style.width = "100%";
    this.container.style.overflow = "hidden";
    this.container.style.background = this.colorPalette.stageBg;

    this.canvas = dom.canvas();
    this.ctx = this.canvas.getContext("2d");
    this.container.appendChild(this.canvas);

    this.pixelScale = window.devicePixelRatio;

    this.grid = new Grid(this.ctx);
    this.grid.setColor(this.colorPalette.gridColor);

    this.listen(this.canvas, "mousemove", e => {
      this.grid.setCursor(util.pt(e.layerX, e.layerY));
      this.mouseMoveFn(e);
    });

    this.listen(this.canvas, "mousedown", e => {
      this.mouseDownFn(e);
    });

    this.listen(this.canvas, "mouseup", e => {
      this.mouseUpFn(e);
    });

    this.listen(window, "resize", () => {
      this.resize();
      this.resizeFn();
    });

    this.rendered(this.container);

    this.play();
    this.resize();
  }
}
