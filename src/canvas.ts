import * as dom from "./dom";
import PubSub from "./pubsub";

export default class Canvas {
  public evt: PubSub;
  public width: number = 0;
  public height: number = 0;
  public _onmove;
  protected canvas: HTMLCanvasElement;
  protected container: HTMLElement;
  protected pixelScale = 1;
  protected ctx: CanvasRenderingContext2D;
  protected time = { prev: 0, diff: 0 };
  protected animId = -1;
  protected layers: any = [];

  constructor(element: HTMLElement) {
    this.evt = new PubSub();
    this.container = element;
    this.canvas = dom.canvas();
    this.ctx = this.canvas.getContext("2d");
    this.pixelScale = window.devicePixelRatio;
  }

  configure() {
    this.container.appendChild(this.canvas);

    this.listen(this.canvas, "mousemove", e => {
      this.evt.publish("mousemove", e);
    });

    this.listen(this.canvas, "mousedown", e => {
      this.evt.publish("mousedown", e);
    });

    this.listen(this.canvas, "mouseup", e => {
      this.evt.publish("mouseup", e);
    });

    this.listen(window, "resize", () => {
      this.resize();
      this.evt.publish("resize", null);
    });

    this.resize();
    this.play();

    return this;
  }

  private listen(o: any, evt: string, fn: (e?: any) => void) {
    this.evt.publish(evt, null);
    o.addEventListener(evt, fn, false);
  }

  setColor(c: string) {}

  play(time = 0) {
    this.animId = requestAnimationFrame(this.play.bind(this));

    this.time.diff = time - this.time.prev;
    this.time.prev = time;

    this.renderLayers();
  }

  renderLayers() {
    this.clear();
    for (let i = 0, l = this.layers.length; i < l; i++) {
      this.layers[i].render(this.ctx, this);
    }
  }

  addLayer(layer) {
    this.layers.push(layer);
  }

  resize() {
    const { width, height } = dom.getDimensions(this.container);
    const scaledHeight = height * this.pixelScale;
    this.width = width;
    this.height = height;

    dom.attr(this.canvas, "width", width * this.pixelScale);
    dom.attr(this.canvas, "height", height * this.pixelScale);

    this.canvas.width = width * this.pixelScale;
    this.canvas.height = height * this.pixelScale;
    this.canvas.style.width = `${Math.floor(width)}px`;
    this.canvas.style.height = `${Math.floor(height)}px`;

    if (this.pixelScale > 1) {
      this.ctx.scale(this.pixelScale, this.pixelScale);
      this.ctx.translate(0.5, 0.5);
    }

    this.renderLayers();
  }

  clear() {
    this.ctx.fillRect(-1, -1, this.width + 1, this.height + 1);
  }
}
