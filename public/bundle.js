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
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
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
        _this.shapes = new Set();
        _this.play = function (time) {
            if (time === void 0) { time = 0; }
            var e_1, _a;
            requestAnimationFrame(_this.play);
            _this.ctx.clearRect(0, 0, _this.width, _this.height);
            _this.grid.render();
            try {
                for (var _b = __values(_this.shapes.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var s = _c.value;
                    if (s.animating) {
                        s.render();
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        };
        return _this;
    }
    Canvas.prototype.addShape = function (shape) {
        this.shapes.add(shape);
    };
    Canvas.prototype.removeShape = function (shape) {
        this.shapes["delete"](shape);
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
  Pax.files["/Users/petesaia/work/github.com/psaia/di/lib/component.js"] = file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fcomponent$2ejs; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fcomponent$2ejs.deps = {"./palettes":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fpalettes$2ejs}; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fcomponent$2ejs.filename = "/Users/petesaia/work/github.com/psaia/di/lib/component.js"; function file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fcomponent$2ejs(module, exports, require, __filename, __dirname, __import_meta) {
"use strict";
exports.__esModule = true;
var palettes = require("./palettes");
var Component = /** @class */ (function () {
    function Component() {
        this.colorPalette = palettes.DEFAULT;
    }
    Component.prototype.onRender = function (fn) {
        this.rendered = fn;
    };
    Component.prototype.setColorPalette = function (c) {
        this.colorPalette = c;
        this.render();
    };
    return Component;
}());
exports["default"] = Component;
//# sourceMappingURL=component.js.map
}
  Pax.files["/Users/petesaia/work/github.com/psaia/di/lib/control-drawer.js"] = file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fcontrol$2ddrawer$2ejs; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fcontrol$2ddrawer$2ejs.deps = {"./component":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fcomponent$2ejs,"./dom":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fdom$2ejs}; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fcontrol$2ddrawer$2ejs.filename = "/Users/petesaia/work/github.com/psaia/di/lib/control-drawer.js"; function file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fcontrol$2ddrawer$2ejs(module, exports, require, __filename, __dirname, __import_meta) {
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
        section.style.background = this.colorPalette.controldrawerBg;
        section.style.color = this.colorPalette.controldrawerColor;
        this.rendered(section);
    };
    return ControlDrawer;
}(component_1["default"]));
exports["default"] = ControlDrawer;
//# sourceMappingURL=control-drawer.js.map
}
  Pax.files["/Users/petesaia/work/github.com/psaia/di/lib/di.js"] = file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fdi$2ejs; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fdi$2ejs.deps = {"./layer-drawer":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2flayer$2ddrawer$2ejs,"./canvas":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fcanvas$2ejs,"./control-drawer":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fcontrol$2ddrawer$2ejs,"./toolbar-drawer":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2ftoolbar$2ddrawer$2ejs,"./dom":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fdom$2ejs,"./interactions":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2finteractions$2ejs}; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fdi$2ejs.filename = "/Users/petesaia/work/github.com/psaia/di/lib/di.js"; function file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fdi$2ejs(module, exports, require, __filename, __dirname, __import_meta) {
"use strict";
exports.__esModule = true;
var dom = require("./dom");
var control_drawer_1 = require("./control-drawer");
var layer_drawer_1 = require("./layer-drawer");
var toolbar_drawer_1 = require("./toolbar-drawer");
var canvas_1 = require("./canvas");
var interactions = require("./interactions");
function di(parentSelector) {
    var parent = dom.select(parentSelector);
    var controldrawer = new control_drawer_1["default"]();
    var toolbar = new toolbar_drawer_1["default"]();
    var layers = new layer_drawer_1["default"]();
    var canvas = new canvas_1["default"]();
    controldrawer.onRender(dom.renderer(parent));
    layers.onRender(dom.renderer(parent));
    toolbar.onRender(dom.renderer(parent));
    canvas.onRender(dom.renderer(parent));
    toolbar.render();
    layers.render();
    controldrawer.render();
    canvas.render();
    interactions.configure({
        canvas: canvas,
        toolbar: toolbar,
        layers: layers,
        controldrawer: controldrawer
    });
}
window.di = di;
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
    Grid.prototype.drawCell = function (center) {
        var size = 9;
        // Here a bounds object is created to be used to determine if the mouse is
        // within a certain cell. It is essentially the bounds of one cell.
        var htSize = size;
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
            // this.ctx.strokeStyle = this.gridActiveColor;
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
        var w = this.size.width;
        var h = this.size.height;
        var padding = 25;
        var margin = 15;
        for (var x = padding; x < w - padding; x += margin) {
            for (var y = padding; y < h - padding; y += margin) {
                var p = util.pt(x, y);
                this.drawCell(p);
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
  Pax.files["/Users/petesaia/work/github.com/psaia/di/lib/interactions.js"] = file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2finteractions$2ejs; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2finteractions$2ejs.deps = {"./marquee-lifecycle":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fmarquee$2dlifecycle$2ejs,"./line-lifecycle":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fline$2dlifecycle$2ejs,"./state":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fstate$2ejs,"./util":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2futil$2ejs,"./rect-lifecycle":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2frect$2dlifecycle$2ejs,"./types":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2ftypes$2ejs}; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2finteractions$2ejs.filename = "/Users/petesaia/work/github.com/psaia/di/lib/interactions.js"; function file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2finteractions$2ejs(module, exports, require, __filename, __dirname, __import_meta) {
"use strict";
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
exports.__esModule = true;
var state_1 = require("./state");
var util = require("./util");
var marquee_lifecycle_1 = require("./marquee-lifecycle");
var rect_lifecycle_1 = require("./rect-lifecycle");
var line_lifecycle_1 = require("./line-lifecycle");
var types_1 = require("./types");
function configure(os) {
    var state = new state_1["default"]();
    var op = new Operator(os, state);
    op.dbind();
    op.paint();
}
exports.configure = configure;
var Operator = /** @class */ (function () {
    function Operator(os, state) {
        this.state = state;
        this.os = os;
    }
    Operator.prototype.dbind = function () {
        this.os.canvas.onMouseDown(this.handleMouseDown.bind(this));
        this.os.canvas.onMouseUp(this.handleMouseUp.bind(this));
        this.os.canvas.onMouseMove(this.handleMouseMove.bind(this));
        this.os.toolbar.onModeChange = this.handleChangeMode.bind(this);
    };
    /**
     * Called to set/change the operating system with a different color scheme.
     */
    Operator.prototype.paint = function () {
        for (var k in this.os) {
            this.os[k].setColorPalette(this.state.colors);
        }
    };
    Operator.prototype.deselectAll = function () {
        var e_1, _a;
        try {
            for (var _b = __values(this.state.cycles.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var cycle = _c.value;
                cycle.select(false);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    Operator.prototype.handleChangeMode = function (m) {
        this.state.mode = m;
    };
    Operator.prototype.handleMouseDown = function (e) {
        var e_2, _a;
        this.state.downAt = new Date().getTime();
        this.state.pinnedCursorPoint = this.os.canvas.grid.closestPt;
        this.state.cursorPoint = this.os.canvas.grid.closestPt;
        this.state.anchorPosition = types_1.AnchorPosition.RightBottom;
        this.state.initialPts = [
            this.state.pinnedCursorPoint,
            this.state.pinnedCursorPoint
        ];
        try {
            // Loop through each cycle to see if the user clicked on something on the
            // stage.
            for (var _b = __values(this.state.cycles.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var cycle = _c.value;
                // Note that the cursorPt is passed and not the closestPt. This is so the
                // most absolute position is accounted for.
                var o = cycle.hitTest(this.os.canvas.grid.cursorPt);
                if (o !== null) {
                    this.state.cycle = cycle;
                    cycle.select(true);
                    this.state.initialPts = util.clone(cycle.shape.pts);
                    this.state.anchorPosition = o.position;
                    return;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        switch (this.state.mode) {
            case types_1.Mode.Marquee:
                this.deselectAll();
                this.state.cycle = new marquee_lifecycle_1["default"](this.state);
                this.state.cycles.add(this.state.cycle);
                this.state.cycle.start(this.os.canvas);
                break;
            case types_1.Mode.Rectangle:
                this.state.cycle = new rect_lifecycle_1["default"](this.state);
                this.state.cycles.add(this.state.cycle);
                this.state.cycle.start(this.os.canvas);
                break;
            case types_1.Mode.Line:
                this.state.cycle = new line_lifecycle_1["default"](this.state);
                this.state.cycles.add(this.state.cycle);
                this.state.cycle.start(this.os.canvas);
                break;
        }
    };
    Operator.prototype.handleMouseUp = function (e) {
        if (this.state.cycle) {
            // A marquee gets removed as soon as the cursor is released, always.
            if (this.state.cycle instanceof marquee_lifecycle_1["default"]) {
                this.state.cycle.remove(this.os.canvas);
            }
            this.state.cycle = null;
        }
        // Reset the mode to be marquee, always.
        this.state.mode = types_1.Mode.Marquee;
    };
    Operator.prototype.handleMouseMove = function (e) {
        this.state.cursorPoint = this.os.canvas.grid.closestPt;
        if (this.state.cycle) {
            this.state.cycle.mutate();
        }
    };
    return Operator;
}());
//# sourceMappingURL=interactions.js.map
}
  Pax.files["/Users/petesaia/work/github.com/psaia/di/lib/layer-drawer.js"] = file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2flayer$2ddrawer$2ejs; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2flayer$2ddrawer$2ejs.deps = {"./component":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fcomponent$2ejs,"./dom":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fdom$2ejs,"./types":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2ftypes$2ejs}; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2flayer$2ddrawer$2ejs.filename = "/Users/petesaia/work/github.com/psaia/di/lib/layer-drawer.js"; function file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2flayer$2ddrawer$2ejs(module, exports, require, __filename, __dirname, __import_meta) {
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
var LayerDrawer = /** @class */ (function (_super) {
    __extends(LayerDrawer, _super);
    function LayerDrawer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.layers = [];
        return _this;
    }
    LayerDrawer.prototype.addLayer = function (layer) {
        this.layers.push(layer);
        this.render();
    };
    LayerDrawer.prototype.getLayers = function () {
        return this.layers;
    };
    LayerDrawer.prototype.render = function () {
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
    return LayerDrawer;
}(component_1["default"]));
exports["default"] = LayerDrawer;
//# sourceMappingURL=layer-drawer.js.map
}
  Pax.files["/Users/petesaia/work/github.com/psaia/di/lib/lifecycle.js"] = file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2flifecycle$2ejs; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2flifecycle$2ejs.deps = {}; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2flifecycle$2ejs.filename = "/Users/petesaia/work/github.com/psaia/di/lib/lifecycle.js"; function file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2flifecycle$2ejs(module, exports, require, __filename, __dirname, __import_meta) {
"use strict";
exports.__esModule = true;
var Lifecycle = /** @class */ (function () {
    function Lifecycle(state) {
        this.state = state;
    }
    return Lifecycle;
}());
exports["default"] = Lifecycle;
//# sourceMappingURL=lifecycle.js.map
}
  Pax.files["/Users/petesaia/work/github.com/psaia/di/lib/line-lifecycle.js"] = file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fline$2dlifecycle$2ejs; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fline$2dlifecycle$2ejs.deps = {"./lifecycle":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2flifecycle$2ejs,"./line":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fline$2ejs,"./line-tux":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fline$2dtux$2ejs,"./util":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2futil$2ejs,"./types":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2ftypes$2ejs}; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fline$2dlifecycle$2ejs.filename = "/Users/petesaia/work/github.com/psaia/di/lib/line-lifecycle.js"; function file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fline$2dlifecycle$2ejs(module, exports, require, __filename, __dirname, __import_meta) {
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
var line_1 = require("./line");
var lifecycle_1 = require("./lifecycle");
var line_tux_1 = require("./line-tux");
var util = require("./util");
var types_1 = require("./types");
var LineLifecycle = /** @class */ (function (_super) {
    __extends(LineLifecycle, _super);
    function LineLifecycle() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LineLifecycle.prototype.hitTest = function (p) {
        if (this.tux) {
            return this.tux.checkAllHitTests(p);
        }
    };
    LineLifecycle.prototype.start = function (c) {
        this.shape = new line_1["default"]();
        this.shape.ctx = c.ctx;
        this.tux = new line_tux_1["default"]();
        this.tux.ctx = c.ctx;
        c.addShape(this.shape);
        c.addShape(this.tux);
    };
    LineLifecycle.prototype.remove = function (c) {
        c.removeShape(this.shape);
        c.removeShape(this.tux);
    };
    LineLifecycle.prototype.select = function (selected) {
        if (selected) {
            this.tux.play();
        }
        else {
            this.tux.stop();
        }
    };
    LineLifecycle.prototype.mutate = function () {
        this.shape.colors = this.state.colors;
        this.tux.colors = this.state.colors;
        var diffX = this.state.cursorPoint[0] - this.state.pinnedCursorPoint[0];
        var diffY = this.state.cursorPoint[1] - this.state.pinnedCursorPoint[1];
        if (this.state.anchorPosition === types_1.AnchorPosition.RightMiddle) {
            this.shape.pts = [
                util.pt(this.state.initialPts[0][0], this.state.initialPts[0][1]),
                util.pt(this.state.initialPts[1][0] + diffX, this.state.initialPts[1][1] + diffY)
            ];
        }
        else if (this.state.anchorPosition === types_1.AnchorPosition.LeftMiddle) {
            this.shape.pts = [
                util.pt(this.state.initialPts[0][0] + diffX, this.state.initialPts[0][1] + diffY),
                util.pt(this.state.initialPts[1][0], this.state.initialPts[1][1])
            ];
        }
        else {
            this.shape.pts = [this.state.pinnedCursorPoint, this.state.cursorPoint];
        }
        this.tux.pts = this.shape.pts;
    };
    return LineLifecycle;
}(lifecycle_1["default"]));
exports["default"] = LineLifecycle;
//# sourceMappingURL=line-lifecycle.js.map
}
  Pax.files["/Users/petesaia/work/github.com/psaia/di/lib/line-tux.js"] = file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fline$2dtux$2ejs; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fline$2dtux$2ejs.deps = {"./tux":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2ftux$2ejs,"./util":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2futil$2ejs,"./types":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2ftypes$2ejs}; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fline$2dtux$2ejs.filename = "/Users/petesaia/work/github.com/psaia/di/lib/line-tux.js"; function file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fline$2dtux$2ejs(module, exports, require, __filename, __dirname, __import_meta) {
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
var tux_1 = require("./tux");
var util = require("./util");
var types_1 = require("./types");
var LineTux = /** @class */ (function (_super) {
    __extends(LineTux, _super);
    function LineTux() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LineTux.prototype.render = function () {
        var _this = this;
        if (this.pts.length < 2) {
            return;
        }
        var centroid = util.centroid(this.pts);
        this.hitTestChecks = [];
        this.configureAnchor(types_1.AnchorPosition.LeftMiddle, this.anchorBounds(this.pts[0]));
        this.configureAnchor(types_1.AnchorPosition.RightMiddle, this.anchorBounds(this.pts[1]));
        // Lastly, setup a check for anywhere in the center of the shape.
        this.hitTestChecks.push(function (p) {
            if (util.withinBound(p, [_this.pts[0], _this.pts[1]])) {
                return {
                    position: types_1.AnchorPosition.Center,
                    point: centroid
                };
            }
        });
    };
    return LineTux;
}(tux_1["default"]));
exports["default"] = LineTux;
//# sourceMappingURL=line-tux.js.map
}
  Pax.files["/Users/petesaia/work/github.com/psaia/di/lib/line.js"] = file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fline$2ejs; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fline$2ejs.deps = {"./util":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2futil$2ejs,"./shape":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fshape$2ejs}; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fline$2ejs.filename = "/Users/petesaia/work/github.com/psaia/di/lib/line.js"; function file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fline$2ejs(module, exports, require, __filename, __dirname, __import_meta) {
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
/**
 * A line follows a very particular algorithm. There are potentially 4 break
 * points for each line since there are no diaganal lines.
 */
var Line = /** @class */ (function (_super) {
    __extends(Line, _super);
    function Line() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Line.prototype.render = function () {
        if (this.pts.length < 2) {
            return;
        }
        var from = this.pts[0];
        var to = this.pts[1];
        this.ctx.beginPath();
        this.ctx.lineWidth = 2;
        this.ctx.moveTo(from[0], from[1]);
        var pt1 = util.pt(from[0] + (to[0] - from[0]) / 2, from[1]);
        var pt2 = util.pt(pt1[0], to[1]);
        // Starting half line.
        this.ctx.lineTo(pt1[0], pt1[1]);
        // Intersecting vertical line.
        this.ctx.lineTo(pt2[0], pt2[1]);
        // Final connecting  line.
        this.ctx.lineTo(to[0], to[1]);
        this.ctx.strokeStyle = this.colors.shapeColor;
        this.ctx.stroke();
    };
    return Line;
}(shape_1["default"]));
exports["default"] = Line;
//# sourceMappingURL=line.js.map
}
  Pax.files["/Users/petesaia/work/github.com/psaia/di/lib/marquee-lifecycle.js"] = file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fmarquee$2dlifecycle$2ejs; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fmarquee$2dlifecycle$2ejs.deps = {"./lifecycle":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2flifecycle$2ejs,"./util":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2futil$2ejs,"./marquee":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fmarquee$2ejs}; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fmarquee$2dlifecycle$2ejs.filename = "/Users/petesaia/work/github.com/psaia/di/lib/marquee-lifecycle.js"; function file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fmarquee$2dlifecycle$2ejs(module, exports, require, __filename, __dirname, __import_meta) {
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
var lifecycle_1 = require("./lifecycle");
var util = require("./util");
var MarqueeLifecycle = /** @class */ (function (_super) {
    __extends(MarqueeLifecycle, _super);
    function MarqueeLifecycle() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MarqueeLifecycle.prototype.hitTest = function (p) {
        return null;
    };
    MarqueeLifecycle.prototype.start = function (c) {
        this.shape = new marquee_1["default"]();
        this.shape.pts = [this.state.pinnedCursorPoint, this.state.cursorPoint];
        this.shape.colors = this.state.colors;
        this.shape.ctx = c.ctx;
        this.initialPts = util.clone(this.shape.pts);
        c.addShape(this.shape);
    };
    MarqueeLifecycle.prototype.remove = function (c) {
        c.removeShape(this.shape);
    };
    MarqueeLifecycle.prototype.mutate = function () {
        this.shape.pts = [this.state.pinnedCursorPoint, this.state.cursorPoint];
    };
    MarqueeLifecycle.prototype.select = function (selected) { };
    return MarqueeLifecycle;
}(lifecycle_1["default"]));
exports["default"] = MarqueeLifecycle;
//# sourceMappingURL=marquee-lifecycle.js.map
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
    Marquee.prototype.render = function () {
        if (!this.animating || this.pts.length < 2) {
            return;
        }
        this.ctx.beginPath();
        this.ctx.moveTo(this.pts[0][0], this.pts[0][1]);
        this.ctx.lineTo(this.pts[0][0], this.pts[1][1]);
        this.ctx.lineTo(this.pts[1][0], this.pts[1][1]);
        this.ctx.lineTo(this.pts[1][0], this.pts[0][1]);
        this.ctx.setLineDash([5, 5]);
        this.ctx.lineWidth = 1;
        this.ctx.closePath();
        this.ctx.strokeStyle = this.colors.shapeColor;
        this.ctx.stroke();
    };
    return Marquee;
}(shape_1["default"]));
exports["default"] = Marquee;
//# sourceMappingURL=marquee.js.map
}
  Pax.files["/Users/petesaia/work/github.com/psaia/di/lib/palettes.js"] = file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fpalettes$2ejs; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fpalettes$2ejs.deps = {}; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fpalettes$2ejs.filename = "/Users/petesaia/work/github.com/psaia/di/lib/palettes.js"; function file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fpalettes$2ejs(module, exports, require, __filename, __dirname, __import_meta) {
"use strict";
exports.__esModule = true;
// Default palette based on: https://colorhunt.co/palette/2763
exports.DARK = {
    stageBg: "#222831",
    stageColor: "#ffffff",
    gridColor: "#393E46",
    shapeColor: "#ffffff",
    // The primary toolbar at the top.
    toolbarBg: "#393e46",
    toolbarColor: "#FFFFFF",
    // The layer palette.
    layersBg: "#00ADB5",
    layersColor: "#FFFFFF",
    // The far left drawer.
    controldrawerBg: "#EEEEEE",
    controldrawerColor: "#222831"
};
exports.DEFAULT = exports.DARK;
//# sourceMappingURL=palettes.js.map
}
  Pax.files["/Users/petesaia/work/github.com/psaia/di/lib/rect-lifecycle.js"] = file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2frect$2dlifecycle$2ejs; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2frect$2dlifecycle$2ejs.deps = {"./lifecycle":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2flifecycle$2ejs,"./util":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2futil$2ejs,"./rect":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2frect$2ejs,"./rect-tux":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2frect$2dtux$2ejs,"./types":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2ftypes$2ejs}; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2frect$2dlifecycle$2ejs.filename = "/Users/petesaia/work/github.com/psaia/di/lib/rect-lifecycle.js"; function file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2frect$2dlifecycle$2ejs(module, exports, require, __filename, __dirname, __import_meta) {
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
var rect_1 = require("./rect");
var lifecycle_1 = require("./lifecycle");
var rect_tux_1 = require("./rect-tux");
var util = require("./util");
var types_1 = require("./types");
var RectLifecycle = /** @class */ (function (_super) {
    __extends(RectLifecycle, _super);
    function RectLifecycle() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RectLifecycle.prototype.hitTest = function (p) {
        if (this.tux) {
            return this.tux.checkAllHitTests(p);
        }
    };
    RectLifecycle.prototype.start = function (c) {
        this.shape = new rect_1["default"]();
        this.shape.ctx = c.ctx;
        this.tux = new rect_tux_1["default"]();
        this.tux.pts = this.shape.pts;
        this.tux.ctx = c.ctx;
        c.addShape(this.shape);
        c.addShape(this.tux);
    };
    RectLifecycle.prototype.remove = function (c) {
        c.removeShape(this.shape);
        c.removeShape(this.tux);
    };
    RectLifecycle.prototype.select = function (selected) {
        if (selected) {
            this.tux.play();
        }
        else {
            this.tux.stop();
        }
    };
    RectLifecycle.prototype.mutate = function () {
        this.shape.colors = this.state.colors;
        this.tux.colors = this.state.colors;
        var diffX = this.state.cursorPoint[0] - this.state.pinnedCursorPoint[0];
        var diffY = this.state.cursorPoint[1] - this.state.pinnedCursorPoint[1];
        if (this.state.anchorPosition === types_1.AnchorPosition.RightBottom) {
            this.shape.pts = [this.state.initialPts[0], this.state.cursorPoint];
        }
        else if (this.state.anchorPosition === types_1.AnchorPosition.RightMiddle) {
            this.shape.pts = [
                this.shape.pts[0],
                util.pt(diffX + this.state.initialPts[1][0], this.shape.pts[1][1])
            ];
        }
        else if (this.state.anchorPosition === types_1.AnchorPosition.RightTop) {
            this.shape.pts = [
                util.pt(this.shape.pts[0][0], this.state.initialPts[0][1] + diffY),
                util.pt(this.state.initialPts[1][0] + diffX, this.shape.pts[1][1])
            ];
        }
        else if (this.state.anchorPosition === types_1.AnchorPosition.BottomMiddle) {
            this.shape.pts = [
                this.shape.pts[0],
                util.pt(this.shape.pts[1][0], this.state.initialPts[1][1] + diffY)
            ];
        }
        else if (this.state.anchorPosition === types_1.AnchorPosition.LeftBottom) {
            this.shape.pts = [
                util.pt(this.state.initialPts[0][0] + diffX, this.shape.pts[0][1]),
                util.pt(this.shape.pts[1][0], this.state.initialPts[1][1] + diffY)
            ];
        }
        else if (this.state.anchorPosition === types_1.AnchorPosition.LeftMiddle) {
            this.shape.pts = [
                util.pt(this.state.initialPts[0][0] + diffX, this.shape.pts[0][1]),
                util.pt(this.shape.pts[1][0], this.shape.pts[1][1])
            ];
        }
        else if (this.state.anchorPosition === types_1.AnchorPosition.LeftTop) {
            this.shape.pts = [
                util.pt(this.state.initialPts[0][0] + diffX, this.state.initialPts[0][1] + diffY),
                util.pt(this.shape.pts[1][0], this.shape.pts[1][1])
            ];
        }
        else if (this.state.anchorPosition === types_1.AnchorPosition.TopMiddle) {
            this.shape.pts = [
                util.pt(this.shape.pts[0][0], this.state.initialPts[0][1] + diffY),
                util.pt(this.shape.pts[1][0], this.shape.pts[1][1])
            ];
        }
        else if (this.state.anchorPosition === types_1.AnchorPosition.Center) {
            this.shape.pts = [
                util.pt(this.state.initialPts[0][0] + diffX, this.state.initialPts[0][1] + diffY),
                util.pt(this.state.initialPts[1][0] + diffX, this.state.initialPts[1][1] + diffY)
            ];
        }
        if (this.tux && this.shape.pts.length) {
            this.tux.pts = this.shape.pts;
        }
    };
    return RectLifecycle;
}(lifecycle_1["default"]));
exports["default"] = RectLifecycle;
//# sourceMappingURL=rect-lifecycle.js.map
}
  Pax.files["/Users/petesaia/work/github.com/psaia/di/lib/rect-tux.js"] = file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2frect$2dtux$2ejs; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2frect$2dtux$2ejs.deps = {"./tux":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2ftux$2ejs,"./util":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2futil$2ejs,"./types":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2ftypes$2ejs}; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2frect$2dtux$2ejs.filename = "/Users/petesaia/work/github.com/psaia/di/lib/rect-tux.js"; function file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2frect$2dtux$2ejs(module, exports, require, __filename, __dirname, __import_meta) {
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
var tux_1 = require("./tux");
var util = require("./util");
var types_1 = require("./types");
var RectTux = /** @class */ (function (_super) {
    __extends(RectTux, _super);
    function RectTux() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RectTux.prototype.render = function () {
        var _this = this;
        if (this.pts.length !== 2) {
            return;
        }
        var centroid = util.centroid(this.pts);
        this.hitTestChecks = [];
        this.configureAnchor(types_1.AnchorPosition.LeftTop, this.anchorBounds(this.pts[0]));
        this.configureAnchor(types_1.AnchorPosition.LeftMiddle, this.anchorBounds(util.pt(this.pts[0][0], centroid[1])));
        this.configureAnchor(types_1.AnchorPosition.LeftBottom, this.anchorBounds(util.pt(this.pts[0][0], this.pts[0][1] + (this.pts[1][1] - this.pts[0][1]))));
        this.configureAnchor(types_1.AnchorPosition.RightBottom, this.anchorBounds(this.pts[1]));
        this.configureAnchor(types_1.AnchorPosition.RightMiddle, this.anchorBounds(util.pt(this.pts[1][0], centroid[1])));
        this.configureAnchor(types_1.AnchorPosition.RightTop, this.anchorBounds(util.pt(this.pts[1][0], this.pts[1][1] - (this.pts[1][1] - this.pts[0][1]))));
        this.configureAnchor(types_1.AnchorPosition.TopMiddle, this.anchorBounds(util.pt(centroid[0], this.pts[0][1])));
        this.configureAnchor(types_1.AnchorPosition.BottomMiddle, this.anchorBounds(util.pt(centroid[0], this.pts[1][1])));
        // Lastly, setup a check for anywhere in the center of the shape.
        this.hitTestChecks.push(function (p) {
            if (util.withinBound(p, [_this.pts[0], _this.pts[1]])) {
                return {
                    position: types_1.AnchorPosition.Center,
                    point: centroid
                };
            }
        });
    };
    return RectTux;
}(tux_1["default"]));
exports["default"] = RectTux;
//# sourceMappingURL=rect-tux.js.map
}
  Pax.files["/Users/petesaia/work/github.com/psaia/di/lib/rect.js"] = file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2frect$2ejs; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2frect$2ejs.deps = {"./shape":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fshape$2ejs}; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2frect$2ejs.filename = "/Users/petesaia/work/github.com/psaia/di/lib/rect.js"; function file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2frect$2ejs(module, exports, require, __filename, __dirname, __import_meta) {
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
var Rect = /** @class */ (function (_super) {
    __extends(Rect, _super);
    function Rect() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rect.prototype.render = function () {
        if (!this.animating || this.pts.length < 2) {
            return;
        }
        this.ctx.beginPath();
        this.ctx.setLineDash([]);
        this.ctx.strokeStyle = this.colors.shapeColor;
        this.ctx.lineWidth = 2;
        this.ctx.moveTo(this.pts[0][0], this.pts[0][1]);
        this.ctx.lineTo(this.pts[0][0], this.pts[1][1]);
        this.ctx.lineTo(this.pts[1][0], this.pts[1][1]);
        this.ctx.lineTo(this.pts[1][0], this.pts[0][1]);
        this.ctx.closePath();
        this.ctx.stroke();
    };
    return Rect;
}(shape_1["default"]));
exports["default"] = Rect;
//# sourceMappingURL=rect.js.map
}
  Pax.files["/Users/petesaia/work/github.com/psaia/di/lib/shape.js"] = file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fshape$2ejs; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fshape$2ejs.deps = {}; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fshape$2ejs.filename = "/Users/petesaia/work/github.com/psaia/di/lib/shape.js"; function file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fshape$2ejs(module, exports, require, __filename, __dirname, __import_meta) {
"use strict";
exports.__esModule = true;
/**
 * All shapes on the stage must implement this class.
 */
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
  Pax.files["/Users/petesaia/work/github.com/psaia/di/lib/state.js"] = file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fstate$2ejs; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fstate$2ejs.deps = {"./palettes":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fpalettes$2ejs,"./types":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2ftypes$2ejs}; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fstate$2ejs.filename = "/Users/petesaia/work/github.com/psaia/di/lib/state.js"; function file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fstate$2ejs(module, exports, require, __filename, __dirname, __import_meta) {
"use strict";
exports.__esModule = true;
var types_1 = require("./types");
var palettes = require("./palettes");
/**
 * This class is instantiated in the interactions module and is mutated as
 * needed. It effectively contains the entire state of the application at a
 * given moment from a data perspective.
 */
var State = /** @class */ (function () {
    function State() {
        // Mode represents the intended object to create. This is updated by the
        // toolbar.
        this.mode = types_1.Mode.Marquee;
        this.cycles = new Set();
        this.colors = palettes.DEFAULT;
        this.initialPts = [];
    }
    return State;
}());
exports["default"] = State;
//# sourceMappingURL=state.js.map
}
  Pax.files["/Users/petesaia/work/github.com/psaia/di/lib/toolbar-drawer.js"] = file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2ftoolbar$2ddrawer$2ejs; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2ftoolbar$2ddrawer$2ejs.deps = {"./component":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fcomponent$2ejs,"./dom":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fdom$2ejs,"./types":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2ftypes$2ejs}; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2ftoolbar$2ddrawer$2ejs.filename = "/Users/petesaia/work/github.com/psaia/di/lib/toolbar-drawer.js"; function file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2ftoolbar$2ddrawer$2ejs(module, exports, require, __filename, __dirname, __import_meta) {
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
var ToolbarDrawer = /** @class */ (function (_super) {
    __extends(ToolbarDrawer, _super);
    function ToolbarDrawer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ToolbarDrawer.prototype.handleClickEvent = function (m) {
        var _this = this;
        return function () {
            _this.mode = m;
            _this.onModeChange(_this.mode);
        };
    };
    ToolbarDrawer.prototype.render = function () {
        var el = dom.section("toolbar");
        var marqueeButton = dom.button();
        var rectButton = dom.button();
        var lineButton = dom.button();
        var textButton = dom.button();
        marqueeButton.innerHTML = "marquee";
        rectButton.innerHTML = "rect";
        lineButton.innerHTML = "line";
        textButton.innerHTML = "text";
        // marqueeButton.style.backgroundImage = `url(${icons.marqueeLight})`;
        // rectButton.style.backgroundImage = `url(${icons.rectangleDark})`;
        // lineButton.style.backgroundImage = `url(${icons.lineDark})`;
        // textButton.style.backgroundImage = `url(${icons.textDark})`;
        el.style.background = this.colorPalette.toolbarBg;
        marqueeButton.addEventListener("click", this.handleClickEvent(types_1.Mode.Marquee));
        rectButton.addEventListener("click", this.handleClickEvent(types_1.Mode.Rectangle));
        lineButton.addEventListener("click", this.handleClickEvent(types_1.Mode.Line));
        textButton.addEventListener("click", this.handleClickEvent(types_1.Mode.Text));
        el.appendChild(marqueeButton);
        el.appendChild(rectButton);
        el.appendChild(lineButton);
        el.appendChild(textButton);
        this.rendered(el);
    };
    return ToolbarDrawer;
}(component_1["default"]));
exports["default"] = ToolbarDrawer;
// const icons = {
//   textLight:
//     "iVBORw0KGgoAAAANSUhEUgAAABYAAAAeCAYAAAAo5+5WAAAABGdBTUEAALGPC/xhBQAAAMFJREFUSA1j/A8EDNQHDUzUNxNiIt0MlgXax48F/0PyWRUWeZCe6UhqGFiQOUD2J0ZGxk9oYgxo8fADh5pfyProFhTIllLEBgXFRCQTULyDJM6IxMbFPIgkcQKJjZsJDOM/oHCGgkLcKhEyQy+MR10Mj73RoBgNCngIwBmjqWIIBwV6ZQqqOAWB/uGD+wnCQK5BBIFq5JHlgZXrQ2Q+VjZQUye0piCW+oPNIJolN4ygANr+HYg/YHMFDrG/OMRpIwwAOl1jHCODvn8AAAAASUVORK5CYII=",
//   selectLight:
//     "iVBORw0KGgoAAAANSUhEUgAAACAAAAAeCAYAAABNChwpAAAABGdBTUEAALGPC/xhBQAAAlhJREFUSA29lk9IVFEUxt8kYUgltsiNDCW4SMiVBFELNxJCEAjZroW0Eheia/+s3Og2qDYRgYJuNdxNtIoW4qJooW5aaKGUEJSg9vx94716e86bO+/x3nzwec+95zvnOw7v3ZlCGIZvgyBYh4uFQuEra33BACPQ4jPBBLxVtykwa4UHMAo7TGfuw+C8ZNw3WT9GJ2GvYSZhPsPQeAAKv2AjLMIxWJ9hMLoE96Dw2P3I2ddnGIxeyh0suQO4Mbn8hqH5PbkDPZDXXeNKMZrsh6HpBhRGKpnGnaF3h/lX7nD2p/YHmJoJU7caZ+Y7p17DjEI9wMmGoeCmU3TbZ+bL08sOs0vsQm/bo4r1JD4Y5UxFQYJD+tyBJdNPyz6chddi25B8BoUt2BArrJKgrgMuQIsjgjewWKXsJIWoGf6FwgNvgSNAr2v9OXSv9nfsuxyZP6RgHgpzfnUQoLsMp+BvaPGJoKeW+nMaCvtMlz+sV88JnAPy/fCH0WtZh//dpo68tpAGDXAbCoNxVeRa4E+JwHc4BC/G6ROd00hPq/A+rpCc1XwjvhKnS3VOwy4o6DK5EW2iM6jXSngazWeyp/FauX0Yjkcbcj5nctJciOYz2dNYV6qg34ynYN8N7TXbe5rIOsBE7/UhFO7a/sQlHYAVe5bbisly2SoMX8iE+KHZ63ZLdsGkmRKTJ8ZQr1sT/GL2r9P0S1yDmftzzX4auqDaEjdLW4DZK/Nf22U6ba9Udbjet86sO7Dq9ZzKxFeE6aYZYtinzSWPub7t9EWTzV2fdEqM22F/0jqf/hhHAq5AGWttgQAAAABJRU5ErkJggg==",
//   rectLight:
//     "iVBORw0KGgoAAAANSUhEUgAAACgAAAAcCAYAAAATFf3WAAAABGdBTUEAALGPC/xhBQAAAJ1JREFUWAntl7ENgDAQAwlCgpoKwT4MwmLMwUBITAE8FSdKFySFUzlKLFv3aZKuWFWZa00pLXWZ3d5WzSurM/SBfQ7ZRWjPYBY8AunEw791vLY5MjfmFj9iF+S4FG2CCjV6TJA0FG2CCjV6TJA0FG2CCjV6TJA0FG2CCjV6TJA0FG2CCjV6+Ksb4le18zCDbr+ZLPiMe/xeyL0v/g3eJSUQX+Hu6UAAAAAASUVORK5CYII=",
//   lineLight:
//     "iVBORw0KGgoAAAANSUhEUgAAABoAAAAcCAYAAAB/E6/TAAAABGdBTUEAALGPC/xhBQAAAYRJREFUSA21lk8rRFEYh91JpNCQRIqUImWhLEiKZmMhKSmzsbGxYWHDxsLOUuyUL8AHYKksRikLNc2UUlKTkhCRv8fz6t46nWaaHPd96+mcc+99n9+9M90zE1QoljGmE/0sjMQeg7wFliADUe1VxpGELYlnGtIwBgmw68ReeM0JmYS36NZLjENecrcJ+XaJADksN1Ht9nitEQWwC8Xq/x+bfVckJCBXJGlTrnO/NLv3r/N1GnrgwWnMOGv/JU+xGj7JMWMDHIZrGTr8zVYnosVQespYL6cYa+AICtal/lNE8/AN59Bom1jXwYp9zGuOJA1fkIdmL0m5JsRT8AGX0Fbueq/ziMdBXsJrkE0z/kI8Ci9wA93xJ2BEPAhPcAd9WiH9yO/hEQa0QnqR38IzDGuFdCEvwCuktELakV/BO0xohbQiv4BPmNEKaUKeBdla5rRCksjPQGpBK6QWefTPZVkrJNrW5UnWtEKqkB9IArWhEiJS5Pu/EcZsqYWEQfK7sgOBZtAPqmfXRATkc3kAAAAASUVORK5CYII=",
//   textDark:
//     "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAgCAYAAAAmG5mqAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAbklEQVQ4je2UwQ2AIBAEF0MBdrKWoJVrCWwndoCB4EMBkT/zu2M3Fz5jvPfowYYsyRnA0ug5SadNQwjvWeTJBuCYsnWD4h9IxqUk837rvjAKo1BhFEahQvQSyfWP+ST1m+92q0vu/CJkyqqsAuACdNIeCAV1+NEAAAAASUVORK5CYII=",
//   lineDark:
//     "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABcCAYAAACRILDuAAAACXBIWXMAABYlAAAWJQFJUiTwAAACrElEQVR4nO2c0XHbMBAF32Xyn3QQl+ASUkI6iEtIKSnB7sQlxB3YHdgVXIYJNaINigBJUAfcvZ3BD0jZM7smKEGWRFVB7PhE97YwgDEMYAwDGMMAxjCAMQxgDAMYwwDGMIAxDGAMA1RARH6IyL2IvK79aZ+TGVLEIB3AaXwZH/PEAAdyQfqUx2QmAwNkKJA+hQFqsFL6lD/JTAYGGNkh/cSLqj4nsxlCB6ggfcrq5QcRA1SWPmX18oOgV8Ag/mcyu59NV0DIN+WHF02VI7yp6tdktoCQr4RV9Q7AQ3JgO5uWH0TeiqgcYdPyg+h7QRUjbA7Af8yqcE9QVUkmC+Fu6P4rYfUG3BQGGBkjvCQH8mxefsAAZ8Zl6FtyIA8D7GXnPWDzU1AwwKL8kuVo0wbclNABFuQ/qOpNwY151/KDyAEy8ocbcsmzo13LD8ZfEm4AGOTrzLifc7Fw/u3c+WsG5Z/HrPyFx73OnccAC2NG4mksyr8Q4XHunLUjzD2gZM3P8eGesPsGjChvyNSQf2I4X+Tf1k+VAO4342rKPwLXS1Dr8uE5QA/y4TVAL/LhMUBP8uEtQG/y4SlAj/LhJUCv8uEhQM/y0XuA3uWj5wAe5KPXAF7ko8cAnuSjtwDe5KOnAB7lo5cAXuWjhwCe5aP1AN7lo+UAEeSj1QBR5KPFAJHko7UA0eSjpQAR5aOVAFHlo4UAkeXDOkB0+bAMQPn/MQlA+WeuHoDy33PVAJSfcrUAlD/PVQJQ/mUOD0D5yxwagPLzHBaA8ss4JADll1M9AOWvo2oAEflN+euofQUMf/1vH+Yof4GqAVR1+PKK75MIlJ/hkM8Ji8gtgDtV/ZUcJO9def+gduuE/8YsaxjAGAYwhgGMYQBjGMAYBjCGAYxhAGMYwBgGMIYBLAHwF4/RU4hJQEIfAAAAAElFTkSuQmCC",
//   rectangleDark:
//     "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAiCAYAAAAge+tMAAAABGdBTUEAALGPC/xhBQAAAIZJREFUWAnt2LENgGAIhFExzsP+c7CQJpZUV1xQks9Ocz+SBzZGZt7Hwutc2PPbMo1PT+7qL6yq6M/+cN+/RVZleiqIIy4KsCoilC2GuI1SLIS4CGWLIW6jFAshLkLZYojbKMVCiItQthjiNkqxEOIilC2GuI1SLBT9D5F47vMYqzI9grXiDy7JB1eT5yRbAAAAAElFTkSuQmCC",
//   marqueeDark:
//     "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAiCAYAAAAge+tMAAAABGdBTUEAALGPC/xhBQAAAKpJREFUWAntl0EOgCAQA8HwHv7/Dj6k4dAEe+JAYKv1sgoEdodaQq613ml4Wmt5+ExR+68xSaX3opRszxUKkCWeUQHIs8bRfjpynrLEZTTOSpAlflq6/1v/dUpGLv87rsKV8N8bdRdkXcU+HlVSzmsVAfv4KpKz8xT7+CyqRePs44tAepqwBOzju7fGPr6dOC+Ik5RvQmjH+N39WBdR9gZ0dXJMD1VFjrLEH/xAUETson4YAAAAAElFTkSuQmCC"
// };
//# sourceMappingURL=toolbar-drawer.js.map
}
  Pax.files["/Users/petesaia/work/github.com/psaia/di/lib/tux.js"] = file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2ftux$2ejs; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2ftux$2ejs.deps = {"./util":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2futil$2ejs,"./shape":file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2fshape$2ejs}; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2ftux$2ejs.filename = "/Users/petesaia/work/github.com/psaia/di/lib/tux.js"; function file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2ftux$2ejs(module, exports, require, __filename, __dirname, __import_meta) {
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
var Tux = /** @class */ (function (_super) {
    __extends(Tux, _super);
    function Tux() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.hitTestChecks = [];
        return _this;
    }
    /**
     * Check all the hit tests to see if the given point is within anything.
     */
    Tux.prototype.checkAllHitTests = function (p) {
        for (var i = 0, l = this.hitTestChecks.length; i < l; i++) {
            var result = this.hitTestChecks[i](p);
            if (result) {
                return result;
            }
        }
        return null;
    };
    Tux.prototype.anchorBounds = function (p) {
        var margin = 5;
        var bottomLeft = util.pt(p[0] - margin, p[1] + margin);
        var bottomRight = util.pt(p[0] + margin, p[1] + margin);
        var topLeft = util.pt(p[0] - margin, p[1] - margin);
        var topRight = util.pt(p[0] + margin, p[1] - margin);
        return { topLeft: topLeft, topRight: topRight, bottomRight: bottomRight, bottomLeft: bottomLeft };
    };
    Tux.prototype.configureAnchor = function (position, bounds) {
        this.ctx.beginPath();
        this.ctx.setLineDash([]);
        this.ctx.lineWidth = 1;
        this.ctx.moveTo(bounds.topLeft[0], bounds.topLeft[1]);
        this.ctx.lineTo(bounds.topRight[0], bounds.topRight[1]);
        this.ctx.lineTo(bounds.bottomRight[0], bounds.bottomRight[1]);
        this.ctx.lineTo(bounds.bottomLeft[0], bounds.bottomLeft[1]);
        this.ctx.strokeStyle = this.colors.shapeColor;
        this.ctx.fillStyle = this.colors.shapeColor;
        this.ctx.fill();
        this.ctx.closePath();
        this.hitTestChecks.push(function (p) {
            if (util.withinBound(p, [bounds.topLeft, bounds.bottomRight])) {
                return {
                    position: position,
                    point: util.centroid([bounds.topLeft, bounds.bottomRight])
                };
            }
        });
    };
    Tux.prototype.render = function () { };
    return Tux;
}(shape_1["default"]));
exports["default"] = Tux;
//# sourceMappingURL=tux.js.map
}
  Pax.files["/Users/petesaia/work/github.com/psaia/di/lib/types.js"] = file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2ftypes$2ejs; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2ftypes$2ejs.deps = {}; file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2ftypes$2ejs.filename = "/Users/petesaia/work/github.com/psaia/di/lib/types.js"; function file_$2fUsers$2fpetesaia$2fwork$2fgithub$2ecom$2fpsaia$2fdi$2flib$2ftypes$2ejs(module, exports, require, __filename, __dirname, __import_meta) {
"use strict";
exports.__esModule = true;
var ActionType;
(function (ActionType) {
    ActionType[ActionType["Moving"] = 0] = "Moving";
    ActionType[ActionType["Resizing"] = 1] = "Resizing";
})(ActionType = exports.ActionType || (exports.ActionType = {}));
var AnchorPosition;
(function (AnchorPosition) {
    AnchorPosition[AnchorPosition["LeftTop"] = 0] = "LeftTop";
    AnchorPosition[AnchorPosition["LeftMiddle"] = 1] = "LeftMiddle";
    AnchorPosition[AnchorPosition["LeftBottom"] = 2] = "LeftBottom";
    AnchorPosition[AnchorPosition["Center"] = 3] = "Center";
    AnchorPosition[AnchorPosition["RightTop"] = 4] = "RightTop";
    AnchorPosition[AnchorPosition["RightMiddle"] = 5] = "RightMiddle";
    AnchorPosition[AnchorPosition["RightBottom"] = 6] = "RightBottom";
    AnchorPosition[AnchorPosition["BottomMiddle"] = 7] = "BottomMiddle";
    AnchorPosition[AnchorPosition["TopMiddle"] = 8] = "TopMiddle";
})(AnchorPosition = exports.AnchorPosition || (exports.AnchorPosition = {}));
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
/**
 * Obtain the center of two vectors in 2d space.
 * @params pts contains top left and bottom right.
 */
function centroid(pts) {
    return pt(pts[0][0] + (pts[1][0] - pts[0][0]) / 2, pts[0][1] + (pts[1][1] - pts[0][1]) / 2);
}
exports.centroid = centroid;
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
