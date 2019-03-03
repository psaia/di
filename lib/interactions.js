"use strict";
exports.__esModule = true;
var layer_1 = require("./layer");
var rect_1 = require("./rect");
var util = require("./util");
var types_1 = require("./types");
function addLayer(layers, shape) {
    var layer = new layer_1["default"]();
    layer.humanName = "Rectangle";
    layer.type = types_1.LayerType.Rect;
    layer.shape = shape;
    layers.addLayer(layer);
    layers.render();
}
function configure(canvas, toolbar, layers) {
    var rects = [];
    var lastRect = function () { return rects[rects.length - 1]; };
    var rectAction;
    var _activeShape;
    var clickedPt = util.pt();
    var mouseDown = false;
    var activeRect = function () {
        for (var i = 0, l = rects.length; i < l; i++) {
            if (rects[i].pts.length > 1) {
                if (util.withinBound(canvas.grid.cursorPt, rects[i].pts)) {
                    return rects[i];
                }
            }
        }
    };
    var tmpPts;
    canvas.evt.subscribe("mousemove", function (e) {
        // If clicking into a square, move it. If not, create a new.
        if (mouseDown) {
            if (rectAction === types_1.ActionType.Creating) {
                _activeShape.pts = [clickedPt, canvas.grid.closestPt];
            }
            else if (rectAction === types_1.ActionType.Moving) {
                _activeShape.pts = (util.add(util.subtract(canvas.grid.closestPt, clickedPt), tmpPts));
            }
        }
    });
    canvas.evt.subscribe("mousedown", function (e) {
        mouseDown = true;
        clickedPt = canvas.grid.closestPt;
        _activeShape = activeRect();
        if (_activeShape) {
            tmpPts = util.clone(_activeShape.pts);
            rectAction = types_1.ActionType.Moving;
        }
        else {
            // Add a new grid on the stack.
            _activeShape = new rect_1["default"](canvas);
            canvas.addShape(_activeShape);
            rects.push(_activeShape);
            addLayer(layers, _activeShape);
            rectAction = types_1.ActionType.Creating;
        }
    });
    canvas.evt.subscribe("mouseup", function (e) {
        mouseDown = false;
    });
}
exports.configure = configure;
//# sourceMappingURL=interactions.js.map