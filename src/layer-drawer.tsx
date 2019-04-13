import * as React from "react";
import Layer from "./layer";
import * as palettes from "./palettes";
import State from "./state";
import Events from "./events";

export interface LayerProps {
  globalState: State;
  events: Events;
}

export default class LayerDrawer extends React.Component<LayerProps> {
  state = {
    colorPalette: palettes.DEFAULT
  };

  protected layers: Layer[] = [];

  public addLayer(layer: Layer) {
    this.layers.push(layer);
    this.render();
  }

  public getLayers(): Layer[] {
    return this.layers;
  }

  render() {
    return (
      <div
        className="layer-drawer"
        style={{
          backgroundColor: this.state.colorPalette.layersBg,
          color: this.state.colorPalette.layersColor
        }}
      >
        <ul className="layer-list">
          {this.getLayers().map((l, i) => {
            return <li key={i} />;
          })}
        </ul>
      </div>
    );
  }
}
