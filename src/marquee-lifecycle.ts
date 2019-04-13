import Marquee from "./marquee";
import Lifecycle from "./lifecycle";
import * as util from "./util";
import { ColorPalette, AnchorPosition, Point, Group } from "./types";

export default class MarqueeLifecycle extends Lifecycle {
  shape: Marquee;
  hitTest(p: Point) {
    return null;
  }
  start(
    ctx: CanvasRenderingContext2D,
    initialPts: Group,
    colors: ColorPalette
  ) {
    this.shape = new Marquee();
    this.shape.ctx = ctx;

    this.shape.colors = colors;
    this.shape.pts = initialPts;
    this.prevPts = initialPts;
  }
  mutate(
    anchorPosition: AnchorPosition,
    diffX: number,
    diffY: number,
    colors: ColorPalette
  ) {
    this.shape.colors = colors;
    this.shape.pts = [
      util.pt(this.shape.pts[0][0], this.shape.pts[0][1]),
      util.pt(this.prevPts[1][0] + diffX, this.prevPts[1][1] + diffY)
    ];
  }
  select(selected: boolean) {
    this.selected = selected;
  }
}
