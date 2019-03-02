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
var shape_1 = require("./shape");
var Rect = /** @class */ (function (_super) {
    __extends(Rect, _super);
    function Rect() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rect.prototype.render = function (c) {
        if (!this.animating || this.pts.length < 2) {
            return;
        }
        this.canvas.ctx.beginPath();
        this.canvas.ctx.moveTo(this.pts[0][0], this.pts[0][1]);
        this.canvas.ctx.lineTo(this.pts[0][0], this.pts[1][1]);
        this.canvas.ctx.lineTo(this.pts[1][0], this.pts[1][1]);
        this.canvas.ctx.lineTo(this.pts[1][0], this.pts[0][1]);
        this.canvas.ctx.lineWidth = 1;
        this.canvas.ctx.closePath();
        this.canvas.ctx.strokeStyle = c.shapeColor;
        this.canvas.ctx.stroke();
    };
    return Rect;
}(shape_1["default"]));
exports["default"] = Rect;
//# sourceMappingURL=rect.js.map