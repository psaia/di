import * as dom from "./dom";
import Canvas from "./canvas";
import Layers from "./layers";
import Toolbar from "./toolbar";
import * as interactions from "./interactions";

const w: any = window;
w.di = di;

const defaultPalette = {
  layersBg: "#111",
  layersColor: "white",
  stageBg: "#000",
  stageColor: "#fff",
  gridColor: "#111",
  shapeColor: "#ccc",
  toolbarBg: "#690000",
  toolbarColor: "#FFF"
};

function di(parentSelector: string) {
  const parent = dom.select(parentSelector);
  const toolbar = new Toolbar(defaultPalette);
  const layers = new Layers(defaultPalette);
  const canvas = new Canvas(defaultPalette);
  const actions = new Canvas(defaultPalette);

  toolbar.onRender(dom.renderer(parent));
  layers.onRender(dom.renderer(parent));
  canvas.onRender(dom.renderer(parent));

  canvas.render();
  toolbar.render();
  layers.render();

  interactions.configure(canvas, toolbar, layers);
}
