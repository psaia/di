"use strict";
exports.__esModule = true;
var dom = require("./dom");
var canvas_1 = require("./canvas");
var layers_1 = require("./layers");
var toolbar_1 = require("./toolbar");
var interactions = require("./interactions");
var w = window;
w.di = di;
var defaultPalette = {
    layersBg: "#111",
    layersColor: "white",
    stageBg: "#000",
    stageColor: "#fff",
    gridColor: "#111",
    shapeColor: "#ccc",
    toolbarBg: "#690000",
    toolbarColor: "#FFF"
};
function di(parentSelector) {
    var parent = dom.select(parentSelector);
    var toolbar = new toolbar_1["default"](defaultPalette);
    var layers = new layers_1["default"](defaultPalette);
    var canvas = new canvas_1["default"](defaultPalette);
    var actions = new canvas_1["default"](defaultPalette);
    toolbar.onRender(dom.renderer(parent));
    layers.onRender(dom.renderer(parent));
    canvas.onRender(dom.renderer(parent));
    canvas.render();
    toolbar.render();
    layers.render();
    interactions.configure(canvas, toolbar, layers);
}
//# sourceMappingURL=di.js.map