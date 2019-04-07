import * as dom from "./dom";
import Component from "./component";

export default class ControlDrawer extends Component {
  render() {
    const section = dom.section("controldrawer");
    section.style.background = this.colorPalette.controldrawerBg;
    section.style.color = this.colorPalette.controldrawerColor;

    this.rendered(section);
  }
}
