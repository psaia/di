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
var util = require("./util");
var Rect = /** @class */ (function (_super) {
    __extends(Rect, _super);
    function Rect() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rect.prototype.render = function (ctx) {
        if (!this.animating || this.pts.length < 2) {
            return;
        }
        ctx.beginPath();
        ctx.moveTo(this.pts[0][0], this.pts[0][1]);
        ctx.lineTo(this.pts[0][0], this.pts[1][1]);
        ctx.lineTo(this.pts[1][0], this.pts[1][1]);
        ctx.lineTo(this.pts[1][0], this.pts[0][1]);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.closePath();
        if (this.filled) {
            ctx.fill();
        }
        else {
            ctx.stroke();
        }
    };
    Rect.withinBound = function (pt, rect) {
        if (!util.within(pt[0], rect[0][0], rect[1][0]) ||
            !util.within(pt[1], rect[0][1], rect[1][1])) {
            return false;
        }
        return true;
    };
    return Rect;
}(shape_1["default"]));
exports["default"] = Rect;
//# sourceMappingURL=rect.js.map