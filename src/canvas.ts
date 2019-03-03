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
  public grid: Grid;
  protected pixelScale = 1;
  protected shapes: any = [];
  protected mouseDownFn: (e?: any) => void;
  protected mouseUpFn: (e?: any) => void;
  protected mouseMoveFn: (e?: any) => void;
  protected resizeFn: (e?: any) => void;

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

  private play = (time = 0) => {
    requestAnimationFrame(this.play);

    this.ctx.clearRect(0, 0, this.width, this.height);
    this.grid.render();

    for (let i = 0, l = this.shapes.length; i < l; i++) {
      this.shapes[i].render(this.colorPalette);
    }
  };

  private resize(container: HTMLElement) {
    const { width, height } = dom.getDimensions(container);
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
  }

  private registerListeners(container: HTMLElement) {
    this.listen(this.canvas, "mousemove", e => {
      this.grid.setCursor(util.pt(e.layerX, e.layerY));
      if (this.mouseMoveFn) {
        this.mouseMoveFn(e);
      }
    });

    this.listen(this.canvas, "mousedown", e => {
      if (this.mouseDownFn) {
        this.mouseDownFn(e);
      }
    });

    this.listen(this.canvas, "mouseup", e => {
      if (this.mouseUpFn) {
        this.mouseUpFn(e);
      }
    });

    this.listen(window, "resize", () => {
      this.resize(container);
      if (this.resizeFn) {
        this.resizeFn();
      }
    });
  }

  render() {
    const container = dom.section("app");
    container.style.height = "100%";
    container.style.width = "100%";
    container.style.overflow = "hidden";
    container.style.background = this.colorPalette.stageBg;

    this.canvas = dom.canvas();
    this.ctx = this.canvas.getContext("2d");
    container.appendChild(this.canvas);

    this.pixelScale = window.devicePixelRatio;

    this.grid = new Grid(this.ctx);
    this.grid.setColor(this.colorPalette.gridColor);

    this.registerListeners(container);
    this.rendered(container);
    this.play();
    this.resize(container);
  }
}
