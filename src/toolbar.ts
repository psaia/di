import * as dom from "./dom";
import Layer from "./layer";
import Component from "./component";
import { LayerType, ColorPalette, RenderFn } from "./types";

export default class Toolbar extends Component {
  protected layers: Layer[] = [];

  render() {
    const section = dom.section("toolbar-container");
    section.style.width = "42px";
    section.style.background = this.colorPalette.toolbarBg;

    this.rendered(section);
  }
}
