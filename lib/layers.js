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