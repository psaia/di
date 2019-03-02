"use strict";
exports.__esModule = true;
var prefix = "di__";
function renderer(c) {
    var lastNode = section("-");
    c.appendChild(lastNode);
    return function (el) {
        c.replaceChild(el, lastNode);
        lastNode = el;
    };
}
exports.renderer = renderer;
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
function section(className) {
    var s = document.createElement("section");
    s.className = prefix + className;
    return s;
}
exports.section = section;
function ul(className) {
    if (className === void 0) { className = ""; }
    var ul = document.createElement("ul");
    ul.className = prefix + className;
    return ul;
}
exports.ul = ul;
function li(className) {
    if (className === void 0) { className = ""; }
    var li = document.createElement("li");
    li.className = prefix + className;
    return li;
}
exports.li = li;
function canvas(className) {
    if (className === void 0) { className = ""; }
    var canvas = document.createElement("canvas");
    canvas.className = prefix + className;
    return canvas;
}
exports.canvas = canvas;
//# sourceMappingURL=dom.js.map