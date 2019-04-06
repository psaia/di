import * as dom from "./dom";
import ControlDrawer from "./control-drawer";
import Canvas from "./canvas";
import LayerDrawer from "./layer-drawer";
import Toolbar from "./toolbar";
import * as palettes from "./palettes";
import * as interactions from "./interactions";

function di(parentSelector: string) {
  const parent = dom.select(parentSelector);
  const controldrawer = new ControlDrawer(palettes.DEFAULT);
  const toolbar = new Toolbar(palettes.DEFAULT);
  const layers = new LayerDrawer(palettes.DEFAULT);
  const canvas = new Canvas(palettes.DEFAULT);

  controldrawer.onRender(dom.renderer(parent));
  layers.onRender(dom.renderer(parent));
  toolbar.onRender(dom.renderer(parent));
  canvas.onRender(dom.renderer(parent));

  canvas.render();
  toolbar.render();
  layers.render();
  controldrawer.render();

  interactions.configure({ canvas, toolbar, layers, controldrawer });
}

(<any>window).di = di;
