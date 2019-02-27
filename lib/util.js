"use strict";
exports.__esModule = true;
function pt(x, y) {
    if (x === undefined || y === undefined) {
        return new Float32Array([0, 0]);
    }
    return new Float32Array([x, y]);
}
exports.pt = pt;
function within(p, a, b) {
    return p >= Math.min(a, b) && p <= Math.max(a, b);
}
exports.within = within;
function add(a, b) {
    return b.map(function (v) { return pt(v[0] + a[0], v[1] + a[1]); });
}
exports.add = add;
function subtract(a, b) {
    return b.map(function (v) { return pt(v[0] - a[0], v[1] - a[1]); });
}
exports.subtract = subtract;
function clone(a) {
    return a.map(function (v) { return pt(v[0], v[1]); });
}
exports.clone = clone;
function multiply(a, b) {
    return b.map(function (v) { return pt(v[0] * a[0], v[1] * a[1]); });
}
exports.multiply = multiply;
function dot() {
    var pts = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        pts[_i] = arguments[_i];
    }
    var init = new Float32Array([0, 0]);
    return pts.reduce(function (acc, p) { return multiply(acc, p); }, init);
}
exports.dot = dot;
//# sourceMappingURL=util.js.map