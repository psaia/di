"use strict";
exports.__esModule = true;
var Layer = /** @class */ (function () {
    function Layer(parent, el, immutable) {
        if (immutable === void 0) { immutable = false; }
        this.stable = false;
        this.parent = parent;
        this.el = el;
        this.update(el);
    }
    Layer.prototype.update = function (el) {
        if (this.immutable) {
            throw new Error("Layer is immutable. Will not update.");
        }
        this.remove();
        this.parent.appendChild(el);
        this.el = el;
        this.stable = true;
        return this;
    };
    Layer.prototype.remove = function () {
        if (this.stable && !this.immutable) {
            this.parent.removeChild(this.el);
            this.stable = false;
        }
        return this;
    };
    return Layer;
}());
exports["default"] = Layer;
//# sourceMappingURL=layer.js.map