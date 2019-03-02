"use strict";
exports.__esModule = true;
var util = require("./util");
var Grid = /** @class */ (function () {
    function Grid(ctx) {
        this.density = 10;
        this.gridActiveColor = "white";
        this.gridColor = "white";
        this.size = {
            width: 100,
            height: 100
        };
        this.ctx = ctx;
        this.cursorPt = util.pt();
    }
    Grid.prototype.setSize = function (width, height) {
        this.size = { width: width, height: height };
        this.render();
    };
    Grid.prototype.setCursor = function (p) {
        this.cursorPt = p;
    };
    Grid.prototype.setColor = function (c) {
        this.gridColor = c;
    };
    Grid.prototype.drawCross = function (center) {
        var size = 7;
        var htSize = 7;
        var rightTop = util.pt(center[0] - htSize, center[1] + htSize);
        var leftBottom = util.pt(center[0] + htSize, center[1] - htSize);
        var bounds = [rightTop, leftBottom];
        this.ctx.beginPath();
        // |
        this.ctx.moveTo(center[0], center[1] - size);
        this.ctx.lineTo(center[0], center[1] + size);
        // --
        this.ctx.moveTo(center[0] - size, center[1]);
        this.ctx.lineTo(center[0] + size, center[1]);
        if (util.withinBound(this.cursorPt, bounds)) {
            this.closestPt = center;
            this.ctx.strokeStyle = this.gridActiveColor;
        }
        else {
            this.ctx.strokeStyle = this.gridColor;
        }
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
    };
    Grid.prototype.render = function () {
        var grid = [];
        var ctx = this.ctx;
        var w = this.size.width;
        var h = this.size.height;
        var padding = 20;
        var margin = 15;
        for (var x = padding; x < w - padding; x += margin) {
            for (var y = padding; y < h - padding; y += margin) {
                var p = util.pt(x, y);
                this.drawCross(p);
                grid.push(p);
            }
        }
        this.grid = grid;
        return grid;
    };
    return Grid;
}());
exports["default"] = Grid;
//# sourceMappingURL=grid.js.map