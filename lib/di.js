"use strict";
exports.__esModule = true;
var dom = require("./dom");
var util = require("./util");
var canvas_1 = require("./canvas");
var types_1 = require("./types");
var rect_1 = require("./rect");
var grid_1 = require("./grid");
var pubsub_1 = require("./pubsub");
var Di = /** @class */ (function () {
    function Di(parentEl) {
        this.pubsub = new pubsub_1["default"]();
        this.colorPalette = {
            sidebarBg: "#000000",
            sidebarColor: "#CCCCCC",
            stageBg: "#151515",
            stageColor: "#FFFFFF"
        };
        this.appContainer = dom.select(parentEl);
        this.buildLayers();
        this.buildStage();
        this.paint();
        this.render();
    }
    Di.prototype.buildLayers = function () {
        this.sidebarContainer = dom.section("sidebar-container");
        this.sidebarContainer.style.width = "200px";
        this.appContainer.appendChild(this.sidebarContainer);
    };
    Di.prototype.buildStage = function () {
        this.stageContainer = dom.section("stage-container");
        this.stageContainer.style.height = "100%";
        this.stageContainer.style.width = "100%";
        this.canvas = new canvas_1["default"](this.stageContainer).configure();
        this.appContainer.appendChild(this.stageContainer);
    };
    Di.prototype.paint = function () {
        this.stageContainer.style.backgroundColor = this.colorPalette.stageBg;
        this.stageContainer.style.color = this.colorPalette.stageColor;
        this.sidebarContainer.style.backgroundColor = this.colorPalette.sidebarBg;
        this.sidebarContainer.style.color = this.colorPalette.sidebarColor;
    };
    Di.prototype.render = function () {
        var _this = this;
        var grid = new grid_1["default"]();
        var rects = [];
        var lastRect = function () { return rects[rects.length - 1]; };
        var rectAction;
        var _activeRect;
        var clickedPt = util.pt();
        var mouseDown = false;
        this.canvas.addLayer(grid);
        grid.setSize(this.canvas.width, this.canvas.height);
        var activeRect = function () {
            for (var i = 0, l = rects.length; i < l; i++) {
                if (rect_1["default"].withinBound(grid.cursorPt, rects[i].pts)) {
                    return rects[i];
                }
            }
        };
        var tmpPts;
        this.canvas.evt.subscribe("mousemove", function (e) {
            grid.setCursor(util.pt(e.layerX, e.layerY));
            // If clicking into a square, move it. If not, create a new.
            if (mouseDown) {
                if (rectAction === types_1.ActionType.Creating) {
                    _activeRect.pts = [clickedPt, grid.closestPt];
                }
                else if (rectAction === types_1.ActionType.Moving) {
                    _activeRect.pts = util.subtract(util.subtract(grid.closestPt, [clickedPt])[0], tmpPts);
                }
            }
        });
        this.canvas.evt.subscribe("mousedown", function (e) {
            mouseDown = true;
            clickedPt = grid.closestPt;
            _activeRect = activeRect();
            if (!_activeRect) {
                rectAction = types_1.ActionType.Creating;
                // Add a new grid on the stack.
                _activeRect = new rect_1["default"](grid.grid);
                _this.canvas.addLayer(_activeRect);
                rects.push(_activeRect);
            }
            else {
                tmpPts = util.clone(_activeRect.pts);
                rectAction = types_1.ActionType.Moving;
            }
        });
        this.canvas.evt.subscribe("mouseup", function (e) {
            mouseDown = false;
        });
        this.canvas.evt.subscribe("resize", function (e) {
            grid.setSize(_this.canvas.width, _this.canvas.height);
        });
    };
    return Di;
}());
exports["default"] = Di;
// Ghetto exposure.
var w = window;
w.Di = Di;
//# sourceMappingURL=di.js.map