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
  const canvasBackground = new Canvas();
  const canvasForeground = new Canvas();

  canvasForeground.renderGrid = false;

  controldrawer.onRender(dom.renderer(parent));
  layers.onRender(dom.renderer(parent));
  toolbar.onRender(dom.renderer(parent));
  canvasBackground.onRender(dom.renderer(parent));
  canvasForeground.onRender(dom.renderer(parent));

  toolbar.render();
  layers.render();
  controldrawer.render();
  canvasBackground.render();
  canvasForeground.render();

  interactions.configure({
    canvas: canvasForeground,
    canvasBackground: canvasBackground,
    toolbar,
    layers,
    controldrawer
  });
}

(<any>window).di = di;
