"use strict";
exports.__esModule = true;
var Grid = /** @class */ (function () {
    function Grid() {
        this.density = 10;
        this.gridColor = "#333";
        this.size = {
            width: 100,
            height: 100
        };
        this.cursorPt = new Float32Array([0, 0]);
    }
    Grid.prototype.setSize = function (width, height) {
        this.size = { width: width, height: height };
    };
    Grid.prototype.setCursor = function (p) {
        this.cursorPt = p;
    };
    Grid.prototype.render = function (ctx) {
        var grid = [];
        var w = this.size.width;
        var h = this.size.height;
        var buffer = 5;
        for (var i = 0; i < w; i++) {
            if (i < buffer || i > w - buffer)
                continue;
            if (i % this.density === 0) {
                for (var k = 0; k < h; k++) {
                    if (k < buffer || k > h - buffer)
                        continue;
                    if (k % this.density === 0) {
                        ctx.beginPath();
                        if (Math.abs(this.cursorPt[1] - k) < buffer &&
                            Math.abs(this.cursorPt[0] - i) < buffer) {
                            ctx.fillStyle = "#ffffff";
                            this.closestPt = new Float32Array([i, k]);
                        }
                        else {
                            ctx.fillStyle = this.gridColor;
                        }
                        ctx.arc(i, k, 1, 0, Math.PI * 2, true);
                        ctx.fill();
                        grid.push(new Float32Array([i, k]));
                    }
                }
            }
        }
        this.grid = grid;
        return grid;
    };
    return Grid;
}());
exports["default"] = Grid;
//# sourceMappingURL=grid.js.map