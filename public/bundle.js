~function(global) {
  const Pax = {}
  Pax.baseRequire = typeof require !== "undefined" ? require : n => {
    throw new Error(`Could not resolve module name: ${n}`)
  }
  Pax.modules = {}
  Pax.files = {}
  Pax.mains = {}
  Pax.resolve = (base, then) => {
    base = base.split('/')
    base.shift()
    for (const p of then.split('/')) {
      if (p === '..') base.pop()
      else if (p !== '.') base.push(p)
    }
    return '/' + base.join('/')
  }
  Pax.Module = function Module(filename, parent) {
    this.filename = filename
    this.id = filename
    this.loaded = false
    this.parent = parent
    this.children = []
    this.exports = {}
  }
  Pax.makeRequire = self => {
    const require = m => require._module(m).exports
    require._deps = {}
    require.main = self

    require._esModule = m => {
      const mod = require._module(m)
      return mod.exports.__esModule ? mod.exports : {
        get default() {return mod.exports},
      }
    }
    require._module = m => {
      let fn = self ? require._deps[m] : Pax.main
      if (fn == null) {
        const module = {exports: Pax.baseRequire(m)}
        require._deps[m] = {module: module}
        return module
      }
      if (fn.module) return fn.module
      const module = new Pax.Module(fn.filename, self)
      fn.module = module
      module.require = Pax.makeRequire(module)
      module.require._deps = fn.deps
      module.require.main = self ? self.require.main : module
      if (self) self.children.push(module)
      fn(module, module.exports, module.require, fn.filename, fn.filename.split('/').slice(0, -1).join('/'), {url: 'file://' + (fn.filename.charAt(0) === '/' ? '' : '/') + fn.filename})
      module.loaded = true
      return module
    }
    return require
  }

  Pax.files["/Users/petesaia/work/github.com/psaia/di/lib/canvas.js"] = file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fcanvas$2ejs; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fcanvas$2ejs.deps = {"./grid":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fgrid$2ejs,"./component":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fcomponent$2ejs,"./util":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2futil$2ejs,"./dom":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fdom$2ejs}; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fcanvas$2ejs.filename = "/Users/petesaia/work/github.com/psaia/di/lib/canvas.js"; function file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fcanvas$2ejs(module, exports, require, __filename, __dirname, __import_meta) {
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
var dom = require("./dom");
var util = require("./util");
var grid_1 = require("./grid");
var component_1 = require("./component");
var Canvas = /** @class */ (function (_super) {
    __extends(Canvas, _super);
    function Canvas() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.width = 0;
        _this.height = 0;
        _this.pixelScale = 1;
        _this.shapes = [];
        _this.play = function (time) {
            if (time === void 0) { time = 0; }
            requestAnimationFrame(_this.play);
            _this.ctx.clearRect(0, 0, _this.width, _this.height);
            _this.grid.render();
            for (var i = 0, l = _this.shapes.length; i < l; i++) {
                _this.shapes[i].render(_this.ctx, _this.colorPalette);
            }
        };
        return _this;
    }
    Canvas.prototype.addShape = function (layer) {
        this.shapes.push(layer);
    };
    Canvas.prototype.onMouseDown = function (fn) {
        this.mouseDownFn = fn;
    };
    Canvas.prototype.onMouseUp = function (fn) {
        this.mouseUpFn = fn;
    };
    Canvas.prototype.onMouseMove = function (fn) {
        this.mouseMoveFn = fn;
    };
    Canvas.prototype.onResize = function (fn) {
        this.resizeFn = fn;
    };
    Canvas.prototype.listen = function (o, evt, fn) {
        o.addEventListener(evt, fn, false);
    };
    Canvas.prototype.resize = function (container) {
        var _a = dom.getDimensions(container), width = _a.width, height = _a.height;
        this.width = width;
        this.height = height;
        this.grid.setSize(width, height);
        this.canvas.setAttribute("width", String(width * this.pixelScale));
        this.canvas.setAttribute("height", String(height * this.pixelScale));
        this.canvas.width = width * this.pixelScale;
        this.canvas.height = height * this.pixelScale;
        this.canvas.style.width = Math.floor(width) + "px";
        this.canvas.style.height = Math.floor(height) + "px";
        if (this.pixelScale > 1) {
            this.ctx.scale(this.pixelScale, this.pixelScale);
            this.ctx.translate(0.5, 0.5);
        }
    };
    Canvas.prototype.registerListeners = function (container) {
        var _this = this;
        this.listen(this.canvas, "mousemove", function (e) {
            _this.grid.setCursor(util.pt(e.layerX, e.layerY));
            if (_this.mouseMoveFn) {
                _this.mouseMoveFn(e);
            }
        });
        this.listen(this.canvas, "mousedown", function (e) {
            if (_this.mouseDownFn) {
                _this.mouseDownFn(e);
            }
        });
        this.listen(this.canvas, "mouseup", function (e) {
            if (_this.mouseUpFn) {
                _this.mouseUpFn(e);
            }
        });
        this.listen(window, "resize", function () {
            _this.resize(container);
            if (_this.resizeFn) {
                _this.resizeFn();
            }
        });
    };
    Canvas.prototype.render = function () {
        var container = dom.section("app");
        container.style.height = "100%";
        container.style.width = "100%";
        container.style.display = "relative";
        container.style.overflow = "hidden";
        container.style.background = this.colorPalette.stageBg;
        this.canvas = dom.canvas();
        this.ctx = this.canvas.getContext("2d");
        container.appendChild(this.canvas);
        this.pixelScale = window.devicePixelRatio;
        this.grid = new grid_1["default"](this.ctx);
        this.grid.setColor(this.colorPalette.gridColor);
        this.registerListeners(container);
        this.rendered(container);
        this.play();
        this.resize(container);
    };
    return Canvas;
}(component_1["default"]));
exports["default"] = Canvas;
//# sourceMappingURL=canvas.js.map
}
  Pax.files["/Users/petesaia/work/github.com/psaia/di/lib/component.js"] = file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fcomponent$2ejs; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fcomponent$2ejs.deps = {}; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fcomponent$2ejs.filename = "/Users/petesaia/work/github.com/psaia/di/lib/component.js"; function file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fcomponent$2ejs(module, exports, require, __filename, __dirname, __import_meta) {
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
}
  Pax.files["/Users/petesaia/work/github.com/psaia/di/lib/controldrawer.js"] = file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fcontroldrawer$2ejs; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fcontroldrawer$2ejs.deps = {"./component":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fcomponent$2ejs,"./dom":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fdom$2ejs}; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fcontroldrawer$2ejs.filename = "/Users/petesaia/work/github.com/psaia/di/lib/controldrawer.js"; function file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fcontroldrawer$2ejs(module, exports, require, __filename, __dirname, __import_meta) {
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
var dom = require("./dom");
var component_1 = require("./component");
var ControlDrawer = /** @class */ (function (_super) {
    __extends(ControlDrawer, _super);
    function ControlDrawer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ControlDrawer.prototype.render = function () {
        var section = dom.section("controldrawer");
        section.style.width = "42px";
        section.style.background = this.colorPalette.controldrawerBg;
        section.style.color = this.colorPalette.controldrawerColor;
        this.rendered(section);
    };
    return ControlDrawer;
}(component_1["default"]));
exports["default"] = ControlDrawer;
//# sourceMappingURL=controldrawer.js.map
}
  Pax.files["/Users/petesaia/work/github.com/psaia/di/lib/di.js"] = file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fdi$2ejs; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fdi$2ejs.deps = {"./controldrawer":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fcontroldrawer$2ejs,"./layers":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2flayers$2ejs,"./toolbar":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2ftoolbar$2ejs,"./canvas":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fcanvas$2ejs,"./dom":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fdom$2ejs,"./interactions":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2finteractions$2ejs}; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fdi$2ejs.filename = "/Users/petesaia/work/github.com/psaia/di/lib/di.js"; function file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fdi$2ejs(module, exports, require, __filename, __dirname, __import_meta) {
"use strict";
exports.__esModule = true;
var dom = require("./dom");
var controldrawer_1 = require("./controldrawer");
var canvas_1 = require("./canvas");
var layers_1 = require("./layers");
var toolbar_1 = require("./toolbar");
var interactions = require("./interactions");
var w = window;
w.di = di;
var defaultPalette = {
    layersBg: "#111",
    layersColor: "white",
    stageBg: "#000",
    stageColor: "#fff",
    gridColor: "#111",
    shapeColor: "#ccc",
    toolbarBg: "#FFF",
    toolbarColor: "#FFF",
    controldrawerBg: "#690000",
    controldrawerColor: "#FFF"
};
function di(parentSelector) {
    var parent = dom.select(parentSelector);
    var controldrawer = new controldrawer_1["default"](defaultPalette);
    var toolbar = new toolbar_1["default"](defaultPalette);
    var layers = new layers_1["default"](defaultPalette);
    var canvas = new canvas_1["default"](defaultPalette);
    controldrawer.onRender(dom.renderer(parent));
    layers.onRender(dom.renderer(parent));
    canvas.onRender(dom.renderer(parent));
    toolbar.onRender(dom.renderer(parent));
    canvas.render();
    toolbar.render();
    layers.render();
    controldrawer.render();
    interactions.configure({ canvas: canvas, toolbar: toolbar, layers: layers, controldrawer: controldrawer });
}
//# sourceMappingURL=di.js.map
}
  Pax.files["/Users/petesaia/work/github.com/psaia/di/lib/dom.js"] = file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fdom$2ejs; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fdom$2ejs.deps = {}; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fdom$2ejs.filename = "/Users/petesaia/work/github.com/psaia/di/lib/dom.js"; function file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fdom$2ejs(module, exports, require, __filename, __dirname, __import_meta) {
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
function getDimensions(element, inject) {
    if (inject === void 0) { inject = false; }
    var dim;
    if (inject) {
        var clone = element.cloneNode(true);
        clone.style.display = "block";
        clone.style.visibility = "hidden";
        document.body.appendChild(clone);
        dim = clone.getBoundingClientRect();
        document.body.removeChild(clone);
    }
    else {
        dim = element.getBoundingClientRect();
    }
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
function button(className) {
    if (className === void 0) { className = ""; }
    var button = document.createElement("button");
    button.className = prefix + className;
    return button;
}
exports.button = button;
function a(className) {
    if (className === void 0) { className = ""; }
    var a = document.createElement("a");
    a.className = prefix + className;
    return a;
}
exports.a = a;
function canvas(className) {
    if (className === void 0) { className = ""; }
    var canvas = document.createElement("canvas");
    canvas.className = prefix + className;
    return canvas;
}
exports.canvas = canvas;
//# sourceMappingURL=dom.js.map
}
  Pax.files["/Users/petesaia/work/github.com/psaia/di/lib/grid.js"] = file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fgrid$2ejs; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fgrid$2ejs.deps = {"./util":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2futil$2ejs}; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fgrid$2ejs.filename = "/Users/petesaia/work/github.com/psaia/di/lib/grid.js"; function file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fgrid$2ejs(module, exports, require, __filename, __dirname, __import_meta) {
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
        this.ctx.setLineDash([0, 0]);
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
}
  Pax.files["/Users/petesaia/work/github.com/psaia/di/lib/interactions.js"] = file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2finteractions$2ejs; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2finteractions$2ejs.deps = {"./util":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2futil$2ejs,"./types":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2ftypes$2ejs,"./marquee":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fmarquee$2ejs}; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2finteractions$2ejs.filename = "/Users/petesaia/work/github.com/psaia/di/lib/interactions.js"; function file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2finteractions$2ejs(module, exports, require, __filename, __dirname, __import_meta) {
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
var marquee_1 = require("./marquee");
var util = require("./util");
var types_1 = require("./types");
var Area;
(function (Area) {
    Area[Area["Corner"] = 0] = "Corner";
    Area[Area["Center"] = 1] = "Center";
})(Area || (Area = {}));
function configure(os) {
    var state = new State();
    var shell = new Shell(os, state);
    shell.dombind();
}
exports.configure = configure;
var State = /** @class */ (function () {
    function State() {
    }
    return State;
}());
var Engine = /** @class */ (function () {
    function Engine() {
    }
    return Engine;
}());
var MarqueeEngine = /** @class */ (function (_super) {
    __extends(MarqueeEngine, _super);
    function MarqueeEngine() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MarqueeEngine.prototype.start = function (c, s) {
        this.shape = new marquee_1["default"]();
        this.shape.pts = [s.pinnedCursorPoint, s.cursorPoint];
        this.initialPts = util.clone(this.shape.pts);
        c.addShape(this.shape);
    };
    MarqueeEngine.prototype.stop = function () {
        this.shape.stop();
        // NOW REMOVE IT.
    };
    MarqueeEngine.prototype.run = function (s) {
        this.shape.pts = [s.pinnedCursorPoint, s.cursorPoint];
    };
    return MarqueeEngine;
}(Engine));
// function addLayer(layers: Layers, shape): Layer {
//   const layer = new Layer();
//   layer.humanName = "Rectangle";
//   layer.type = LayerType.Rect;
//   layer.shape = shape;
//   layers.addLayer(layer);
//   layers.render();
//
//   return layer;
// }
// function what(cursor: Point, layers: Layers): Selection | null {
//   const list = layers.getLayers();
//
//   for (let i = 0, l = list.length; i < l; i++) {
//     const layer = list[i];
//     const shape = list[i].shape;
//
//     if (shape.pts.length > 1) {
//       if (util.withinBound(cursor, shape.pts)) {
//         return {
//           layer,
//           area: Area.Corner
//         };
//       }
//     }
//   }
// }
// class RectangleEngine extends Engine {
//   start(c: Canvas, s: State) {
//     const shape = new Marquee(c);
//     const layer = new Layer();
//     layer.humanName = "Rectangle";
//     layer.type = LayerType.Rect;
//     layer.shape = shape;
//
//     s.selection = what(canvas.grid.closestPt, layers);
//     this.initialPts = util.clone(s.selection.layer.shape.pts);
//   }
//   stop() {}
// }
var QUICK_CLICK_MS = 200;
var Shell = /** @class */ (function () {
    function Shell(os, state) {
        this.state = state;
        this.os = os;
    }
    Shell.prototype.dombind = function () {
        this.os.canvas.onMouseDown(this.handleMouseDown.bind(this));
        this.os.canvas.onMouseUp(this.handleMouseUp.bind(this));
        this.os.canvas.onMouseMove(this.handleMouseMove.bind(this));
        this.os.toolbar.onModeChange = this.handleChangeMode.bind(this);
    };
    Shell.prototype.handleChangeMode = function (m) {
        this.state.mode = m;
        this.os.toolbar.hide();
    };
    Shell.prototype.handleMouseDown = function (e) {
        this.os.toolbar.hide();
        this.state.downAt = new Date().getTime();
        this.state.pinnedCursorPoint = this.os.canvas.grid.closestPt;
        this.state.cursorPoint = this.os.canvas.grid.closestPt;
        if (this.state.mode === types_1.Mode.Marquee) {
            this.activity = new MarqueeEngine();
            this.activity.start(this.os.canvas, this.state);
        }
    };
    Shell.prototype.handleMouseUp = function (e) {
        if (new Date().getTime() - this.state.downAt < QUICK_CLICK_MS) {
            this.os.toolbar.show(this.os.canvas.grid.closestPt);
        }
        else {
            if (this.activity) {
                this.activity.stop();
                this.activity = null;
            }
        }
    };
    Shell.prototype.handleMouseMove = function (e) {
        this.state.cursorPoint = this.os.canvas.grid.closestPt;
        if (this.activity) {
            this.activity.run(this.state);
        }
    };
    return Shell;
}());
//# sourceMappingURL=interactions.js.map
}
  Pax.files["/Users/petesaia/work/github.com/psaia/di/lib/layers.js"] = file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2flayers$2ejs; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2flayers$2ejs.deps = {"./component":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fcomponent$2ejs,"./dom":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fdom$2ejs,"./types":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2ftypes$2ejs}; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2flayers$2ejs.filename = "/Users/petesaia/work/github.com/psaia/di/lib/layers.js"; function file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2flayers$2ejs(module, exports, require, __filename, __dirname, __import_meta) {
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
var dom = require("./dom");
var component_1 = require("./component");
var types_1 = require("./types");
var Layers = /** @class */ (function (_super) {
    __extends(Layers, _super);
    function Layers() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.layers = [];
        return _this;
    }
    Layers.prototype.addLayer = function (layer) {
        this.layers.push(layer);
        this.render();
    };
    Layers.prototype.getLayers = function () {
        return this.layers;
    };
    Layers.prototype.render = function () {
        var _a;
        var section = dom.section("layers");
        var ul = dom.ul("layer-list");
        section.style.width = "165px";
        section.style.background = this.colorPalette.layersBg;
        section.style.color = this.colorPalette.layersColor;
        var countHashMap = (_a = {},
            _a[types_1.LayerType.Rect] = 0,
            _a[types_1.LayerType.Line] = 0,
            _a[types_1.LayerType.Text] = 0,
            _a);
        this.layers.forEach(function (l) {
            var li = dom.li("layer-list-item");
            li.innerHTML = l.humanName + " " + ++countHashMap[l.type];
            ul.appendChild(li);
        });
        section.appendChild(ul);
        this.rendered(section);
    };
    return Layers;
}(component_1["default"]));
exports["default"] = Layers;
//# sourceMappingURL=layers.js.map
}
  Pax.files["/Users/petesaia/work/github.com/psaia/di/lib/marquee.js"] = file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fmarquee$2ejs; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fmarquee$2ejs.deps = {"./shape":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fshape$2ejs}; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fmarquee$2ejs.filename = "/Users/petesaia/work/github.com/psaia/di/lib/marquee.js"; function file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fmarquee$2ejs(module, exports, require, __filename, __dirname, __import_meta) {
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
var Marquee = /** @class */ (function (_super) {
    __extends(Marquee, _super);
    function Marquee() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Marquee.prototype.render = function (ctx, colors) {
        if (!this.animating || this.pts.length < 2) {
            return;
        }
        ctx.beginPath();
        ctx.moveTo(this.pts[0][0], this.pts[0][1]);
        ctx.lineTo(this.pts[0][0], this.pts[1][1]);
        ctx.lineTo(this.pts[1][0], this.pts[1][1]);
        ctx.lineTo(this.pts[1][0], this.pts[0][1]);
        ctx.setLineDash([5, 5]);
        ctx.lineWidth = 1;
        ctx.closePath();
        ctx.strokeStyle = "#ffffff";
        // this.canvas.ctx.strokeStyle = c.shapeColor;
        ctx.stroke();
    };
    return Marquee;
}(shape_1["default"]));
exports["default"] = Marquee;
//# sourceMappingURL=marquee.js.map
}
  Pax.files["/Users/petesaia/work/github.com/psaia/di/lib/shape.js"] = file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fshape$2ejs; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fshape$2ejs.deps = {}; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fshape$2ejs.filename = "/Users/petesaia/work/github.com/psaia/di/lib/shape.js"; function file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fshape$2ejs(module, exports, require, __filename, __dirname, __import_meta) {
"use strict";
exports.__esModule = true;
var Shape = /** @class */ (function () {
    function Shape() {
        this.pts = [];
        this.animating = true;
    }
    Shape.prototype.stop = function () {
        this.animating = false;
    };
    Shape.prototype.play = function () {
        this.animating = true;
    };
    return Shape;
}());
exports["default"] = Shape;
//# sourceMappingURL=shape.js.map
}
  Pax.files["/Users/petesaia/work/github.com/psaia/di/lib/toolbar.js"] = file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2ftoolbar$2ejs; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2ftoolbar$2ejs.deps = {"./component":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fcomponent$2ejs,"./dom":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fdom$2ejs,"./types":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2ftypes$2ejs}; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2ftoolbar$2ejs.filename = "/Users/petesaia/work/github.com/psaia/di/lib/toolbar.js"; function file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2ftoolbar$2ejs(module, exports, require, __filename, __dirname, __import_meta) {
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
var dom = require("./dom");
var component_1 = require("./component");
var types_1 = require("./types");
var LEFT_MARGIN = 180;
var Toolbar = /** @class */ (function (_super) {
    __extends(Toolbar, _super);
    function Toolbar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Toolbar.prototype.handleClickEvent = function (m) {
        var _this = this;
        return function () {
            _this.mode = types_1.Mode.Marquee;
            // this.mode = this.mode === m ? Mode.Marquee : m;
            _this.onModeChange(_this.mode);
        };
    };
    Toolbar.prototype.render = function () {
        var el = dom.section("toolbar");
        var rectButton = dom.button();
        var lineButton = dom.button();
        var textButton = dom.button();
        rectButton.style.backgroundImage = "url(" + icons.rectangleDark + ")";
        lineButton.style.backgroundImage = "url(" + icons.lineDark + ")";
        textButton.style.backgroundImage = "url(" + icons.textDark + ")";
        el.style.background = this.colorPalette.toolbarBg;
        el.style.position = "absolute";
        rectButton.addEventListener("click", this.handleClickEvent(types_1.Mode.Rectangle));
        lineButton.addEventListener("click", this.handleClickEvent(types_1.Mode.Line));
        textButton.addEventListener("click", this.handleClickEvent(types_1.Mode.Text));
        el.appendChild(rectButton);
        el.appendChild(lineButton);
        el.appendChild(textButton);
        if (this.showing) {
            el.style.display = "absolute";
            var d = dom.getDimensions(el, true);
            el.style.left = LEFT_MARGIN + this.position[0] - d.width / 2 + "px";
            el.style.top = this.position[1] - d.height - 26 + "px";
        }
        else {
            el.style.display = "none";
        }
        this.rendered(el);
    };
    Toolbar.prototype.show = function (pos) {
        this.showing = true;
        this.position = pos;
        this.render();
    };
    Toolbar.prototype.hide = function () {
        this.showing = false;
        this.render();
    };
    return Toolbar;
}(component_1["default"]));
exports["default"] = Toolbar;
var icons = {
    textDark: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAgCAYAAAAmG5mqAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAbklEQVQ4je2UwQ2AIBAEF0MBdrKWoJVrCWwndoCB4EMBkT/zu2M3Fz5jvPfowYYsyRnA0ug5SadNQwjvWeTJBuCYsnWD4h9IxqUk837rvjAKo1BhFEahQvQSyfWP+ST1m+92q0vu/CJkyqqsAuACdNIeCAV1+NEAAAAASUVORK5CYII=",
    lineDark: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAABGdBTUEAALGPC/xhBQAAAf9JREFUWAntlztOw0AQhmOLInJJC3dIUiaipKEmUCKEEC0dDTWHQIpSUPI4AdS2qJyEM9BC5wrF/IMYa2PvY5x4kyaWrH3Nznyefz2yW63tZc9AYF/2u9rpdPbyPD9GlP3ZbHZD0Xb8hqx6Z4ggCE4BM4AFJeWaLdcCRBAAGALghCHQMkOOtRceeAMqQwBAezwAE0+n008vQFIIDk4tQB/V8coZWgZCAViQi+aXAloRouApy1ULqCmIggYdAD2pYyeQDwgFAMcnf1bGf12tZL1e72g+n99iwwC39u0oO6o71slFPkKdo3a7/Y75CLcXGIqpk4vmtUBJknxFUXSITSkZebi0clEcLRAt+IQyyWUF8gllkssJ5AnKKJcIqGkom1xioCahbHLVAmoIyipXbSDaEMfxN57yg/p1L5dc5E9bqU2BqGp3u90R2jOTjW3eJRftNdahsmMF5oLXwjB8QBBp8XTKJQbSwQBknKbpubSiS+QSAZlgJpPJJYLk0ooO28qnBmdaba2SuWDYkQBKJJc1Q1IYCZRULiNQXRgXlFQuLdCyMBYosVzkY+EDbFUYhqK23+/vZln2hm6G/64Ddc3WLw51kzAUkA86atWdDaC8VmQIH/T3gLpiA+g+5leb59bRFhnCk7wC4oeCbgqm8sD42xj+Z6rIXMVoO7HhDPwC/Y58qqnpGUQAAAAASUVORK5CYII=",
    rectangleDark: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAiCAYAAAAge+tMAAAABGdBTUEAALGPC/xhBQAAAKpJREFUWAntl0EOgCAQA8HwHv7/Dj6k4dAEe+JAYKv1sgoEdodaQq613ml4Wmt5+ExR+68xSaX3opRszxUKkCWeUQHIs8bRfjpynrLEZTTOSpAlflq6/1v/dUpGLv87rsKV8N8bdRdkXcU+HlVSzmsVAfv4KpKz8xT7+CyqRePs44tAepqwBOzju7fGPr6dOC+Ik5RvQmjH+N39WBdR9gZ0dXJMD1VFjrLEH/xAUETson4YAAAAAElFTkSuQmCC"
};
//# sourceMappingURL=toolbar.js.map
}
  Pax.files["/Users/petesaia/work/github.com/psaia/di/lib/types.js"] = file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2ftypes$2ejs; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2ftypes$2ejs.deps = {}; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2ftypes$2ejs.filename = "/Users/petesaia/work/github.com/psaia/di/lib/types.js"; function file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2ftypes$2ejs(module, exports, require, __filename, __dirname, __import_meta) {
"use strict";
exports.__esModule = true;
var ActionType;
(function (ActionType) {
    ActionType[ActionType["Moving"] = 0] = "Moving";
    ActionType[ActionType["Enlarging"] = 1] = "Enlarging";
    ActionType[ActionType["Resizing"] = 2] = "Resizing";
})(ActionType = exports.ActionType || (exports.ActionType = {}));
var LayerType;
(function (LayerType) {
    LayerType[LayerType["Rect"] = 0] = "Rect";
    LayerType[LayerType["Line"] = 1] = "Line";
    LayerType[LayerType["Text"] = 2] = "Text";
})(LayerType = exports.LayerType || (exports.LayerType = {}));
var Mode;
(function (Mode) {
    Mode[Mode["Marquee"] = 0] = "Marquee";
    Mode[Mode["Rectangle"] = 1] = "Rectangle";
    Mode[Mode["Line"] = 2] = "Line";
    Mode[Mode["Text"] = 3] = "Text";
})(Mode = exports.Mode || (exports.Mode = {}));
//# sourceMappingURL=types.js.map
}
  Pax.files["/Users/petesaia/work/github.com/psaia/di/lib/util.js"] = file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2futil$2ejs; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2futil$2ejs.deps = {}; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2futil$2ejs.filename = "/Users/petesaia/work/github.com/psaia/di/lib/util.js"; function file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2futil$2ejs(module, exports, require, __filename, __dirname, __import_meta) {
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
function withinBound(pt, rect) {
    if (!within(pt[0], rect[0][0], rect[1][0]) ||
        !within(pt[1], rect[0][1], rect[1][1])) {
        return false;
    }
    return true;
}
exports.withinBound = withinBound;
function add(a, b) {
    if (b instanceof Array) {
        return b.map(function (v) { return pt(v[0] + a[0], v[1] + a[1]); });
    }
    else if (b instanceof Float32Array) {
        return pt(a[0] + b[0], a[1] + b[1]);
    }
}
exports.add = add;
function subtract(a, b) {
    if (b instanceof Array) {
        return b.map(function (v) { return pt(v[0] - a[0], v[1] - a[1]); });
    }
    else if (b instanceof Float32Array) {
        return pt(a[0] - b[0], a[1] - b[1]);
    }
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
}
  Pax.main = file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fdi$2ejs; Pax.makeRequire(null)()
  if (typeof module !== 'undefined') module.exports = Pax.main.module && Pax.main.module.exports
}(typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : this)
//# sourceMappingURL=bundle.js.map
