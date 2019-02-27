"use strict";
exports.__esModule = true;
var dom = require("./dom");
var util = require("./util");
var canvas_1 = require("./canvas");
var rect_1 = require("./rect");
var grid_1 = require("./grid");
var ActionType;
(function (ActionType) {
    ActionType[ActionType["MOVING"] = 1] = "MOVING";
    ActionType[ActionType["CREATING"] = 2] = "CREATING";
})(ActionType || (ActionType = {}));
var Di = /** @class */ (function () {
    function Di(parentEl) {
        var canvas = new canvas_1["default"](dom.select(parentEl)).configure();
        var grid = new grid_1["default"]();
        var rects = [];
        var lastRect = function () { return rects[rects.length - 1]; };
        var rectAction;
        var _activeRect;
        var clickedPt = util.pt();
        var mouseDown = false;
        canvas.addLayer(grid);
        grid.setSize(canvas.width, canvas.height);
        var activeRect = function () {
            for (var i = 0, l = rects.length; i < l; i++) {
                if (rect_1["default"].withinBound(grid.cursorPt, rects[i].pts)) {
                    return rects[i];
                }
            }
        };
        var tmpPts;
        canvas.evt.subscribe("mousemove", function (e) {
            grid.setCursor(util.pt(e.x, e.y));
            // If clicking into a square, move it. If not, create a new.
            if (mouseDown) {
                if (rectAction === ActionType.CREATING) {
                    _activeRect.pts = [clickedPt, grid.closestPt];
                }
                else if (rectAction === ActionType.MOVING) {
                    _activeRect.pts = util.subtract(util.subtract(grid.closestPt, [clickedPt])[0], tmpPts);
                }
            }
        });
        canvas.evt.subscribe("mousedown", function (e) {
            mouseDown = true;
            clickedPt = grid.closestPt;
            _activeRect = activeRect();
            if (!_activeRect) {
                rectAction = ActionType.CREATING;
                // Add a new grid on the stack.
                _activeRect = new rect_1["default"](grid.grid);
                canvas.addLayer(_activeRect);
                rects.push(_activeRect);
            }
            else {
                tmpPts = util.clone(_activeRect.pts);
                rectAction = ActionType.MOVING;
            }
        });
        canvas.evt.subscribe("mouseup", function (e) {
            mouseDown = false;
        });
        canvas.evt.subscribe("resize", function (e) {
            grid.setSize(canvas.width, canvas.height);
        });
    }
    return Di;
}());
exports["default"] = Di;
// Ghetto exposure.
var w = window;
w.Di = Di;
//# sourceMappingURL=di.js.map