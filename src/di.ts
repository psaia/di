import * as dom from "./dom";
import ControlDrawer from "./controldrawer";
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
  toolbarBg: "#FFF",
  toolbarColor: "#FFF",
  controldrawerBg: "#690000",
  controldrawerColor: "#FFF"
};

function di(parentSelector: string) {
  const parent = dom.select(parentSelector);
  const controldrawer = new ControlDrawer(defaultPalette);
  const toolbar = new Toolbar(defaultPalette);
  const layers = new Layers(defaultPalette);
  const canvas = new Canvas(defaultPalette);

  controldrawer.onRender(dom.renderer(parent));
  layers.onRender(dom.renderer(parent));
  canvas.onRender(dom.renderer(parent));
  toolbar.onRender(dom.renderer(parent));

  canvas.render();
  toolbar.render();
  layers.render();
  controldrawer.render();

  interactions.configure({ canvas, toolbar, layers, controldrawer });
}
