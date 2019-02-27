"use strict";
exports.__esModule = true;
var dom = require("./dom");
var pubsub_1 = require("./pubsub");
var Canvas = /** @class */ (function () {
    function Canvas(element) {
        this.width = 0;
        this.height = 0;
        this.pixelScale = 1;
        this.time = { prev: 0, diff: 0 };
        this.animId = -1;
        this.layers = [];
        this.evt = new pubsub_1["default"]();
        this.container = element;
        this.canvas = dom.canvas();
        this.ctx = this.canvas.getContext("2d");
        this.pixelScale = window.devicePixelRatio;
    }
    Canvas.prototype.configure = function () {
        var _this = this;
        this.container.appendChild(this.canvas);
        this.listen(this.canvas, "mousemove", function (e) {
            _this.evt.publish("mousemove", e);
        });
        this.listen(this.canvas, "mousedown", function (e) {
            _this.evt.publish("mousedown", e);
        });
        this.listen(this.canvas, "mouseup", function (e) {
            _this.evt.publish("mouseup", e);
        });
        this.listen(window, "resize", function () {
            _this.resize();
            _this.evt.publish("resize", null);
        });
        this.resize();
        this.play();
        return this;
    };
    Canvas.prototype.listen = function (o, evt, fn) {
        this.evt.publish(evt, null);
        o.addEventListener(evt, fn, false);
    };
    Canvas.prototype.setColor = function (c) { };
    Canvas.prototype.play = function (time) {
        if (time === void 0) { time = 0; }
        this.animId = requestAnimationFrame(this.play.bind(this));
        this.time.diff = time - this.time.prev;
        this.time.prev = time;
        this.ctx.fillStyle = "#222222";
        try {
            this.renderLayers();
        }
        catch (err) {
            throw err;
        }
    };
    Canvas.prototype.renderLayers = function () {
        this.clear();
        for (var i = 0, l = this.layers.length; i < l; i++) {
            this.layers[i].render(this.ctx, this);
        }
    };
    Canvas.prototype.addLayer = function (layer) {
        this.layers.push(layer);
    };
    Canvas.prototype.resize = function () {
        var _a = dom.getDimensions(this.container), width = _a.width, height = _a.height;
        var scaledHeight = height * this.pixelScale;
        this.width = width;
        this.height = height;
        dom.attr(this.canvas, "width", width * this.pixelScale);
        dom.attr(this.canvas, "height", height * this.pixelScale);
        this.canvas.width = width * this.pixelScale;
        this.canvas.height = height * this.pixelScale;
        this.canvas.style.width = Math.floor(width) + "px";
        this.canvas.style.height = Math.floor(height) + "px";
        if (this.pixelScale > 1) {
            this.ctx.scale(this.pixelScale, this.pixelScale);
            this.ctx.translate(0.5, 0.5);
        }
        this.renderLayers();
    };
    Canvas.prototype.clear = function () {
        this.ctx.fillStyle = "#1b212b";
        this.ctx.fillRect(-1, -1, this.width + 1, this.height + 1);
    };
    return Canvas;
}());
exports["default"] = Canvas;
//# sourceMappingURL=canvas.js.map