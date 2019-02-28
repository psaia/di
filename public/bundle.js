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

  Pax.files["/Users/petesaia/work/github.com/psaia/di/lib/canvas.js"] = file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fcanvas$2ejs; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fcanvas$2ejs.deps = {"./pubsub":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fpubsub$2ejs,"./dom":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fdom$2ejs}; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fcanvas$2ejs.filename = "/Users/petesaia/work/github.com/psaia/di/lib/canvas.js"; function file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fcanvas$2ejs(module, exports, require, __filename, __dirname, __import_meta) {
"use strict";
exports.__esModule = true;
var dom = require("./dom");
var pubsub_1 = require("./pubsub");
var Canvas = /** @class */ (function () {
    function Canvas(element) {
        this.width = 0;
        this.height = 0;
        this.pixelScale = 1;
        this.time = { prev: 0, diff: 0 };
        this.animId = -1;
        this.layers = [];
        this.evt = new pubsub_1["default"]();
        this.container = element;
        this.canvas = dom.canvas();
        this.ctx = this.canvas.getContext("2d");
        this.pixelScale = window.devicePixelRatio;
    }
    Canvas.prototype.configure = function () {
        var _this = this;
        this.container.appendChild(this.canvas);
        this.listen(this.canvas, "mousemove", function (e) {
            _this.evt.publish("mousemove", e);
        });
        this.listen(this.canvas, "mousedown", function (e) {
            _this.evt.publish("mousedown", e);
        });
        this.listen(this.canvas, "mouseup", function (e) {
            _this.evt.publish("mouseup", e);
        });
        this.listen(window, "resize", function () {
            _this.resize();
            _this.evt.publish("resize", null);
        });
        this.resize();
        this.play();
        return this;
    };
    Canvas.prototype.listen = function (o, evt, fn) {
        this.evt.publish(evt, null);
        o.addEventListener(evt, fn, false);
    };
    Canvas.prototype.setColor = function (c) { };
    Canvas.prototype.play = function (time) {
        if (time === void 0) { time = 0; }
        this.animId = requestAnimationFrame(this.play.bind(this));
        this.time.diff = time - this.time.prev;
        this.time.prev = time;
        try {
            this.renderLayers();
        }
        catch (err) {
            throw err;
        }
    };
    Canvas.prototype.renderLayers = function () {
        this.clear();
        for (var i = 0, l = this.layers.length; i < l; i++) {
            this.layers[i].render(this.ctx, this);
        }
    };
    Canvas.prototype.addLayer = function (layer) {
        this.layers.push(layer);
    };
    Canvas.prototype.resize = function () {
        var _a = dom.getDimensions(this.container), width = _a.width, height = _a.height;
        var scaledHeight = height * this.pixelScale;
        this.width = width;
        this.height = height;
        dom.attr(this.canvas, "width", width * this.pixelScale);
        dom.attr(this.canvas, "height", height * this.pixelScale);
        this.canvas.width = width * this.pixelScale;
        this.canvas.height = height * this.pixelScale;
        this.canvas.style.width = Math.floor(width) + "px";
        this.canvas.style.height = Math.floor(height) + "px";
        if (this.pixelScale > 1) {
            this.ctx.scale(this.pixelScale, this.pixelScale);
            this.ctx.translate(0.5, 0.5);
        }
        this.renderLayers();
    };
    Canvas.prototype.clear = function () {
        this.ctx.fillRect(-1, -1, this.width + 1, this.height + 1);
    };
    return Canvas;
}());
exports["default"] = Canvas;
//# sourceMappingURL=canvas.js.map
}
  Pax.files["/Users/petesaia/work/github.com/psaia/di/lib/di.js"] = file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fdi$2ejs; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fdi$2ejs.deps = {"./grid":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fgrid$2ejs,"./pubsub":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fpubsub$2ejs,"./util":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2futil$2ejs,"./canvas":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fcanvas$2ejs,"./rect":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2frect$2ejs,"./dom":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fdom$2ejs,"./types":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2ftypes$2ejs}; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fdi$2ejs.filename = "/Users/petesaia/work/github.com/psaia/di/lib/di.js"; function file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fdi$2ejs(module, exports, require, __filename, __dirname, __import_meta) {
"use strict";
exports.__esModule = true;
var dom = require("./dom");
var util = require("./util");
var canvas_1 = require("./canvas");
var types_1 = require("./types");
var rect_1 = require("./rect");
var grid_1 = require("./grid");
var pubsub_1 = require("./pubsub");
var Di = /** @class */ (function () {
    function Di(parentEl) {
        this.pubsub = new pubsub_1["default"]();
        this.colorPalette = {
            sidebarBg: "#000000",
            sidebarColor: "#CCCCCC",
            stageBg: "#151515",
            stageColor: "#FFFFFF"
        };
        this.appContainer = dom.select(parentEl);
        this.buildLayers();
        this.buildStage();
        this.paint();
        this.render();
    }
    Di.prototype.buildLayers = function () {
        this.sidebarContainer = dom.section("sidebar-container");
        this.sidebarContainer.style.width = "200px";
        this.appContainer.appendChild(this.sidebarContainer);
    };
    Di.prototype.buildStage = function () {
        this.stageContainer = dom.section("stage-container");
        this.stageContainer.style.height = "100%";
        this.stageContainer.style.width = "100%";
        this.canvas = new canvas_1["default"](this.stageContainer).configure();
        this.appContainer.appendChild(this.stageContainer);
    };
    Di.prototype.paint = function () {
        this.stageContainer.style.backgroundColor = this.colorPalette.stageBg;
        this.stageContainer.style.color = this.colorPalette.stageColor;
        this.sidebarContainer.style.backgroundColor = this.colorPalette.sidebarBg;
        this.sidebarContainer.style.color = this.colorPalette.sidebarColor;
    };
    Di.prototype.render = function () {
        var _this = this;
        var grid = new grid_1["default"]();
        var rects = [];
        var lastRect = function () { return rects[rects.length - 1]; };
        var rectAction;
        var _activeRect;
        var clickedPt = util.pt();
        var mouseDown = false;
        this.canvas.addLayer(grid);
        grid.setSize(this.canvas.width, this.canvas.height);
        var activeRect = function () {
            for (var i = 0, l = rects.length; i < l; i++) {
                if (rect_1["default"].withinBound(grid.cursorPt, rects[i].pts)) {
                    return rects[i];
                }
            }
        };
        var tmpPts;
        this.canvas.evt.subscribe("mousemove", function (e) {
            grid.setCursor(util.pt(e.layerX, e.layerY));
            // If clicking into a square, move it. If not, create a new.
            if (mouseDown) {
                if (rectAction === types_1.ActionType.Creating) {
                    _activeRect.pts = [clickedPt, grid.closestPt];
                }
                else if (rectAction === types_1.ActionType.Moving) {
                    _activeRect.pts = util.subtract(util.subtract(grid.closestPt, [clickedPt])[0], tmpPts);
                }
            }
        });
        this.canvas.evt.subscribe("mousedown", function (e) {
            mouseDown = true;
            clickedPt = grid.closestPt;
            _activeRect = activeRect();
            if (!_activeRect) {
                rectAction = types_1.ActionType.Creating;
                // Add a new grid on the stack.
                _activeRect = new rect_1["default"](grid.grid);
                _this.canvas.addLayer(_activeRect);
                rects.push(_activeRect);
            }
            else {
                tmpPts = util.clone(_activeRect.pts);
                rectAction = types_1.ActionType.Moving;
            }
        });
        this.canvas.evt.subscribe("mouseup", function (e) {
            mouseDown = false;
        });
        this.canvas.evt.subscribe("resize", function (e) {
            grid.setSize(_this.canvas.width, _this.canvas.height);
        });
    };
    return Di;
}());
exports["default"] = Di;
// Ghetto exposure.
var w = window;
w.Di = Di;
//# sourceMappingURL=di.js.map
}
  Pax.files["/Users/petesaia/work/github.com/psaia/di/lib/dom.js"] = file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fdom$2ejs; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fdom$2ejs.deps = {}; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fdom$2ejs.filename = "/Users/petesaia/work/github.com/psaia/di/lib/dom.js"; function file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fdom$2ejs(module, exports, require, __filename, __dirname, __import_meta) {
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
function section(id) {
    var s = document.createElement("section");
    s.id = id;
    return s;
}
exports.section = section;
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
}
  Pax.files["/Users/petesaia/work/github.com/psaia/di/lib/grid.js"] = file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fgrid$2ejs; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fgrid$2ejs.deps = {}; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fgrid$2ejs.filename = "/Users/petesaia/work/github.com/psaia/di/lib/grid.js"; function file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fgrid$2ejs(module, exports, require, __filename, __dirname, __import_meta) {
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
}
  Pax.files["/Users/petesaia/work/github.com/psaia/di/lib/pubsub.js"] = file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fpubsub$2ejs; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fpubsub$2ejs.deps = {}; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fpubsub$2ejs.filename = "/Users/petesaia/work/github.com/psaia/di/lib/pubsub.js"; function file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fpubsub$2ejs(module, exports, require, __filename, __dirname, __import_meta) {
"use strict";
exports.__esModule = true;
var Pubsub = /** @class */ (function () {
    function Pubsub() {
        this.events = [];
    }
    Pubsub.prototype.publish = function (name, payload) {
        var evts = this.events;
        for (var i = 0, l = evts.length; i < l; i++) {
            if (name === evts[i].name) {
                evts[i].fn(payload);
            }
        }
    };
    Pubsub.prototype.subscribe = function (name, fn, group) {
        if (group === void 0) { group = "global"; }
        this.events.push({ name: name, fn: fn, group: group });
    };
    return Pubsub;
}());
exports["default"] = Pubsub;
//# sourceMappingURL=pubsub.js.map
}
  Pax.files["/Users/petesaia/work/github.com/psaia/di/lib/rect.js"] = file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2frect$2ejs; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2frect$2ejs.deps = {"./util":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2futil$2ejs,"./shape":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fshape$2ejs}; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2frect$2ejs.filename = "/Users/petesaia/work/github.com/psaia/di/lib/rect.js"; function file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2frect$2ejs(module, exports, require, __filename, __dirname, __import_meta) {
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
}
  Pax.files["/Users/petesaia/work/github.com/psaia/di/lib/shape.js"] = file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fshape$2ejs; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fshape$2ejs.deps = {}; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fshape$2ejs.filename = "/Users/petesaia/work/github.com/psaia/di/lib/shape.js"; function file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fshape$2ejs(module, exports, require, __filename, __dirname, __import_meta) {
"use strict";
exports.__esModule = true;
var Shape = /** @class */ (function () {
    function Shape(grid) {
        this.pts = [];
        this.grid = [];
        this.animating = true;
        this.filled = false;
        this.color = "#FFFFFF";
        this.grid = grid;
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
  Pax.files["/Users/petesaia/work/github.com/psaia/di/lib/types.js"] = file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2ftypes$2ejs; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2ftypes$2ejs.deps = {}; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2ftypes$2ejs.filename = "/Users/petesaia/work/github.com/psaia/di/lib/types.js"; function file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2ftypes$2ejs(module, exports, require, __filename, __dirname, __import_meta) {
"use strict";
exports.__esModule = true;
var ActionType;
(function (ActionType) {
    ActionType[ActionType["Moving"] = 0] = "Moving";
    ActionType[ActionType["Creating"] = 1] = "Creating";
})(ActionType = exports.ActionType || (exports.ActionType = {}));
var LayerType;
(function (LayerType) {
    LayerType[LayerType["Rect"] = 0] = "Rect";
    LayerType[LayerType["Line"] = 1] = "Line";
    LayerType[LayerType["Text"] = 2] = "Text";
})(LayerType = exports.LayerType || (exports.LayerType = {}));
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
}
  Pax.main = file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fdi$2ejs; Pax.makeRequire(null)()
  if (typeof module !== 'undefined') module.exports = Pax.main.module && Pax.main.module.exports
}(typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : this)
//# sourceMappingURL=bundle.js.map
