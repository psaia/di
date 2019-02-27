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
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.pts = [];
        return _this;
    }
    Line.prototype.render = function (ctx) {
        if (this.pts.length < 2) {
            return;
        }
        ctx.beginPath();
        ctx.moveTo(this.pts[0][0], this.pts[0][1]);
        for (var i = 1, len = this.pts.length; i < len; i++) {
            ctx.lineTo(this.pts[i][0], this.pts[i][1]);
        }
        ctx.stroke();
    };
    return Line;
}(shape_1["default"]));
exports["default"] = Line;
//# sourceMappingURL=line.js.map