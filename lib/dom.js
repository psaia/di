"use strict";
exports.__esModule = true;
var NS = "http://www.w3.org/2000/svg";
function getDimensions(element) {
    var dim = element.getBoundingClientRect();
    return {
        height: dim.height,
        width: dim.width
    };
}
exports.getDimensions = getDimensions;
function select(selector) {
    return document.querySelector(selector);
}
exports.select = select;
function attr(element, key, value) {
    if (typeof value === "undefined") {
        return element.getAttribute(key);
    }
    element.setAttribute(key, String(value));
    return String(value);
}
exports.attr = attr;
function circle(r, x, y) {
    var el = document.createElementNS(NS, "circle");
    attr(el, "r", String(r));
    attr(el, "cx", String(x));
    attr(el, "cy", String(y));
    attr(el, "fill", "#333");
    return el;
}
exports.circle = circle;
function canvas() {
    return document.createElement("canvas");
}
exports.canvas = canvas;
//# sourceMappingURL=dom.js.map