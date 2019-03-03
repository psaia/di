import * as dom from "./dom";
import Layer from "./layer";
import Component from "./component";
import { LayerType, RenderFn } from "./types";

export default class Layers extends Component {
  protected layers: Layer[] = [];

  public addLayer(layer: Layer) {
    this.layers.push(layer);
    this.render();
  }

  public getLayers(): Layer[] {
    return this.layers;
  }

  render() {
    const section = dom.section("layers");
    const ul = dom.ul("layer-list");

    section.style.width = "165px";
    section.style.background = this.colorPalette.layersBg;
    section.style.color = this.colorPalette.layersColor;

    const countHashMap = {
      [LayerType.Rect]: 0,
      [LayerType.Line]: 0,
      [LayerType.Text]: 0
    };

    this.layers.forEach(l => {
      const li = dom.li("layer-list-item");
      li.innerHTML = `${l.humanName} ${++countHashMap[l.type]}`;
      ul.appendChild(li);
    });

    section.appendChild(ul);

    this.rendered(section);
  }
}
