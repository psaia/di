"use strict";
exports.__esModule = true;
var layer_1 = require("./layer");
var util = require("./util");
var types_1 = require("./types");
var Area;
(function (Area) {
    Area[Area["Corner"] = 0] = "Corner";
    Area[Area["Center"] = 1] = "Center";
})(Area || (Area = {}));
function configure(canvas, toolbar, layers) {
    var state = new State(canvas);
    canvas.onMouseMove(function (e) {
        state.cursorPoint = canvas.grid.closestPt;
    });
    canvas.onMouseDown(function (e) {
        state.mouseDown = true;
        state.selection = what(canvas.grid.closestPt, layers);
        if (state.selection) {
            state.pinnedPts = util.clone(state.selection.layer.shape.pts);
        }
        else {
            // const addLayer(
        }
        console.log(state.selection);
        state.pinnerCursorPoint = canvas.grid.closestPt;
        state.process();
    });
    canvas.onMouseUp(function (e) {
        state.mouseDown = false;
        state.process();
    });
}
exports.configure = configure;
function addLayer(layers, shape) {
    var layer = new layer_1["default"]();
    layer.humanName = "Rectangle";
    layer.type = types_1.LayerType.Rect;
    layer.shape = shape;
    layers.addLayer(layer);
    layers.render();
    return layer;
}
function what(cursor, layers) {
    var list = layers.getLayers();
    for (var i = 0, l = list.length; i < l; i++) {
        var layer = list[i];
        var shape = list[i].shape;
        if (shape.pts.length > 1) {
            if (util.withinBound(cursor, shape.pts)) {
                return {
                    layer: layer,
                    area: Area.Corner
                };
            }
        }
    }
}
var State = /** @class */ (function () {
    function State(canvas) {
        this.canvas = canvas;
    }
    State.prototype.process = function () {
        if (this.mouseDown && this.selection) {
            if (this.selection.area === Area.Corner) {
                this.selection.layer.shape.pts = [
                    this.pinnerCursorPoint,
                    this.cursorPoint
                ];
            }
            else if (this.selection.area === Area.Center) {
                this.selection.layer.shape.pts = (util.add(util.subtract(this.cursorPoint, this.pinnerCursorPoint), this.pinnedPts));
            }
        }
    };
    return State;
}());
//# sourceMappingURL=interactions.js.map