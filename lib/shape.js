"use strict";
exports.__esModule = true;
var Shape = /** @class */ (function () {
    function Shape(canvas) {
        this.pts = [];
        this.animating = true;
        this.canvas = canvas;
    }
    Shape.prototype.stop = function () {
        this.animating = false;
    };
    Shape.prototype.play = function () {
        this.animating = true;
    };
    return Shape;
}());
exports["default"] = Shape;
//# sourceMappingURL=shape.js.map