import * as dom from "./dom";
import Layer from "./layer";
import Component from "./component";
import { Point, LayerType, ColorPalette, RenderFn } from "./types";

export default class Toolbar extends Component {
  showing: boolean;
  position: Point;
  render() {
    const width = 42;
    const el = dom.section("toolbar");
    el.style.width = `${width}px`;
    el.style.background = this.colorPalette.toolbarBg;
    el.style.position = "absolute";

    if (this.showing) {
      el.style.display = "absolute";
      el.style.left = `${this.position[0] - width / 2}px`;
      el.style.top = `${this.position[1]}px`;
      el.innerHTML = "IAMTOOLBAR";
    } else {
      el.style.display = "none";
    }

    this.rendered(el);
  }
  show(pos: Point) {
    this.showing = true;
    this.position = pos;
    this.render();
  }
  hide() {
    this.showing = false;
    this.render();
  }
}
