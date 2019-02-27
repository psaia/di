"use strict";
exports.__esModule = true;
var dom = require("./dom");
var util = require("./util");
var grid = require("./grid");
var pts_1 = require("pts");
var App = /** @class */ (function () {
    function App(args) {
        this.grid = {
            x: [0],
            y: [0]
        };
        this.cursor = {
            x: 0,
            y: 0
        };
        var space = new pts_1.CanvasSpace("#app");
        space.setup({ bgcolor: "#222" });
        // this.stageLayer = new Layer(args.el, dom.svg(), true);
        // this.gridLayer = new Layer(this.stageLayer.el, grid.buildDOM(this.grid));
        //
        // this.resize();
        //
        // this.stageLayer.parent.addEventListener(
        //   "mousemove",
        //   (e: MouseEvent) => this.handleMouseMove(e),
        //   false
        // );
        //
        // this.stageLayer.parent.addEventListener(
        //   "mousedown",
        //   (e: MouseEvent) => this.handleMouseDown(e),
        //   false
        // );
        //
        // window.addEventListener("resize", e => this.resize(), false);
    }
    App.prototype.handleMouseMove = function (event) {
        var closestX = util.closestInt(this.grid.x, event.x);
        var closestY = util.closestInt(this.grid.y, event.y);
        this.cursor = {
            x: closestX,
            y: closestY
        };
    };
    App.prototype.handleMouseDown = function (event) {
        // console.log(event);
        // const line = new Layer(this.stageLayer.el, dom.line());
        // line.invoke(inputs);
    };
    App.prototype.resize = function () {
        var stageContainer = this.stageLayer.parent;
        var svg = this.stageLayer.el;
        var _a = dom.getDimensions(stageContainer), width = _a.width, height = _a.height;
        dom.attr(svg, "width", "" + width);
        dom.attr(svg, "height", "" + height);
        this.grid = grid.build(width, height);
        this.gridLayer.update(grid.buildDOM(this.grid));
    };
    return App;
}());
exports["default"] = App;
//# sourceMappingURL=app.js.map