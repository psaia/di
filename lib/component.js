"use strict";
exports.__esModule = true;
var Component = /** @class */ (function () {
    function Component(defaultPalette) {
        this.setColorPalette(defaultPalette);
    }
    Component.prototype.onRender = function (fn) {
        this.rendered = fn;
    };
    Component.prototype.setColorPalette = function (c) {
        this.colorPalette = c;
    };
    return Component;
}());
exports["default"] = Component;
//# sourceMappingURL=component.js.map