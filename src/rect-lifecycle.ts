import Rect from "./rect";
import Lifecycle from "./lifecycle";
import Canvas from "./canvas";
import RectTux from "./rect-tux";
import * as util from "./util";
import { ColorPalette, Point, Group, AnchorPosition } from "./types";

export default class RectLifecycle extends Lifecycle {
  shape: Rect;
  tux: RectTux;
  text: string = "";
  hitTest(p: Point) {
    if (this.tux) {
      return this.tux.checkAllHitTests(p);
    }
  }
  start(c: Canvas, initialPts: Group, colors: ColorPalette) {
    this.shape = new Rect();
    this.tux = new RectTux();

    this.shape.colors = colors;
    this.tux.colors = colors;

    this.shape.ctx = c.ctx;
    this.tux.ctx = c.ctx;

    this.shape.pts = initialPts;
    this.tux.pts = initialPts;
    this.prevPts = initialPts;

    c.addShape(this.shape);
    c.addShape(this.tux);
  }
  remove(c: Canvas) {
    c.removeShape(this.shape);
    c.removeShape(this.tux);
  }
  select(selected: boolean) {
    this.selected = selected;
    if (selected) {
      this.tux.play();
    } else {
      this.tux.stop();
    }
  }
  mutate(
    anchorPosition: AnchorPosition,
    diffX: number,
    diffY: number,
    colors: ColorPalette
  ) {
    this.shape.colors = colors;
    this.tux.colors = colors;
    this.shape.text = this.text;

    if (anchorPosition === AnchorPosition.RightBottom) {
      this.shape.pts = [
        util.pt(this.shape.pts[0][0], this.shape.pts[0][1]),
        util.pt(this.prevPts[1][0] + diffX, this.prevPts[1][1] + diffY)
      ];
    } else if (anchorPosition === AnchorPosition.RightMiddle) {
      this.shape.pts = [
        this.shape.pts[0],
        util.pt(diffX + this.prevPts[1][0], this.shape.pts[1][1])
      ];
    } else if (anchorPosition === AnchorPosition.RightTop) {
      this.shape.pts = [
        util.pt(this.shape.pts[0][0], this.prevPts[0][1] + diffY),
        util.pt(this.prevPts[1][0] + diffX, this.shape.pts[1][1])
      ];
    } else if (anchorPosition === AnchorPosition.BottomMiddle) {
      this.shape.pts = [
        this.shape.pts[0],
        util.pt(this.shape.pts[1][0], this.prevPts[1][1] + diffY)
      ];
    } else if (anchorPosition === AnchorPosition.LeftBottom) {
      this.shape.pts = [
        util.pt(this.prevPts[0][0] + diffX, this.shape.pts[0][1]),
        util.pt(this.shape.pts[1][0], this.prevPts[1][1] + diffY)
      ];
    } else if (anchorPosition === AnchorPosition.LeftMiddle) {
      this.shape.pts = [
        util.pt(this.prevPts[0][0] + diffX, this.shape.pts[0][1]),
        util.pt(this.shape.pts[1][0], this.shape.pts[1][1])
      ];
    } else if (anchorPosition === AnchorPosition.LeftTop) {
      this.shape.pts = [
        util.pt(this.prevPts[0][0] + diffX, this.prevPts[0][1] + diffY),
        util.pt(this.shape.pts[1][0], this.shape.pts[1][1])
      ];
    } else if (anchorPosition === AnchorPosition.TopMiddle) {
      this.shape.pts = [
        util.pt(this.shape.pts[0][0], this.prevPts[0][1] + diffY),
        util.pt(this.shape.pts[1][0], this.shape.pts[1][1])
      ];
    } else if (anchorPosition === AnchorPosition.Center) {
      this.shape.pts = [
        util.pt(this.prevPts[0][0] + diffX, this.prevPts[0][1] + diffY),
        util.pt(this.prevPts[1][0] + diffX, this.prevPts[1][1] + diffY)
      ];
    }

    if (this.tux && this.shape.pts.length) {
      this.tux.pts = this.shape.pts;
    }
  }
}
