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
var Line = /** @class */ (function (_super) {
    __extends(Line, _super);
    function Line() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Line.prototype.render = function (c) {
        if (this.pts.length < 2) {
            return;
        }
        this.canvas.ctx.beginPath();
        this.canvas.ctx.moveTo(this.pts[0][0], this.pts[0][1]);
        for (var i = 1, len = this.pts.length; i < len; i++) {
            this.canvas.ctx.lineTo(this.pts[i][0], this.pts[i][1]);
        }
        this.canvas.ctx.strokeStyle = c.shapeColor;
        this.canvas.ctx.stroke();
    };
    return Line;
}(shape_1["default"]));
exports["default"] = Line;
//# sourceMappingURL=line.js.map