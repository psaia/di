import * as dom from "./dom";
import ControlDrawer from "./control-drawer";
import LayerDrawer from "./layer-drawer";
import ToolbarDrawer from "./toolbar-drawer";
import Canvas from "./canvas";
import * as interactions from "./interactions";

function di(parentSelector: string) {
  const parent = dom.select(parentSelector);
  const controldrawer = new ControlDrawer();
  const toolbar = new ToolbarDrawer();
  const layers = new LayerDrawer();
  const canvas = new Canvas();

  controldrawer.onRender(dom.renderer(parent));
  layers.onRender(dom.renderer(parent));
  toolbar.onRender(dom.renderer(parent));
  canvas.onRender(dom.renderer(parent));

  toolbar.render();
  layers.render();
  controldrawer.render();
  canvas.render();

  interactions.configure({
    canvas,
    toolbar,
    layers,
    controldrawer
  });
}

(<any>window).di = di;
