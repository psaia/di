"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var dom = require("./dom");
var util = require("./util");
var grid_1 = require("./grid");
var component_1 = require("./component");
var Canvas = /** @class */ (function (_super) {
    __extends(Canvas, _super);
    function Canvas() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.width = 0;
        _this.height = 0;
        _this.pixelScale = 1;
        _this.time = { prev: 0, diff: 0 };
        _this.shapes = [];
        return _this;
    }
    Canvas.prototype.addShape = function (layer) {
        this.shapes.push(layer);
    };
    Canvas.prototype.onMouseDown = function (fn) {
        this.mouseDownFn = fn;
    };
    Canvas.prototype.onMouseUp = function (fn) {
        this.mouseUpFn = fn;
    };
    Canvas.prototype.onMouseMove = function (fn) {
        this.mouseMoveFn = fn;
    };
    Canvas.prototype.onResize = function (fn) {
        this.resizeFn = fn;
    };
    Canvas.prototype.listen = function (o, evt, fn) {
        o.addEventListener(evt, fn, false);
    };
    Canvas.prototype.play = function (time) {
        if (time === void 0) { time = 0; }
        requestAnimationFrame(this.play.bind(this));
        this.time.diff = time - this.time.prev;
        this.time.prev = time;
        this.renderShapes();
    };
    Canvas.prototype.renderShapes = function () {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.grid.render();
        for (var i = 0, l = this.shapes.length; i < l; i++) {
            this.shapes[i].render(this.colorPalette);
        }
    };
    Canvas.prototype.resize = function (container) {
        var _a = dom.getDimensions(container), width = _a.width, height = _a.height;
        this.width = width;
        this.height = height;
        this.grid.setSize(width, height);
        this.canvas.setAttribute("width", String(width * this.pixelScale));
        this.canvas.setAttribute("height", String(height * this.pixelScale));
        this.canvas.width = width * this.pixelScale;
        this.canvas.height = height * this.pixelScale;
        this.canvas.style.width = Math.floor(width) + "px";
        this.canvas.style.height = Math.floor(height) + "px";
        if (this.pixelScale > 1) {
            this.ctx.scale(this.pixelScale, this.pixelScale);
            this.ctx.translate(0.5, 0.5);
        }
        this.renderShapes();
    };
    Canvas.prototype.render = function () {
        var _this = this;
        var container = dom.section("app");
        container.style.height = "100%";
        container.style.width = "100%";
        container.style.overflow = "hidden";
        container.style.background = this.colorPalette.stageBg;
        this.canvas = dom.canvas();
        this.ctx = this.canvas.getContext("2d");
        container.appendChild(this.canvas);
        this.pixelScale = window.devicePixelRatio;
        this.grid = new grid_1["default"](this.ctx);
        this.grid.setColor(this.colorPalette.gridColor);
        this.listen(this.canvas, "mousemove", function (e) {
            _this.grid.setCursor(util.pt(e.layerX, e.layerY));
            _this.mouseMoveFn(e);
        });
        this.listen(this.canvas, "mousedown", function (e) {
            _this.mouseDownFn(e);
        });
        this.listen(this.canvas, "mouseup", function (e) {
            _this.mouseUpFn(e);
        });
        this.listen(window, "resize", function () {
            _this.resize(container);
            _this.resizeFn();
        });
        this.rendered(container);
        this.play();
        this.resize(container);
    };
    return Canvas;
}(component_1["default"]));
exports["default"] = Canvas;
//# sourceMappingURL=canvas.js.map