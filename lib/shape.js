"use strict";
exports.__esModule = true;
var Shape = /** @class */ (function () {
    function Shape(grid) {
        this.pts = [];
        this.grid = [];
        this.animating = true;
        this.filled = false;
        this.color = "#FFFFFF";
        this.grid = grid;
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