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
var Toolbar = /** @class */ (function (_super) {
    __extends(Toolbar, _super);
    function Toolbar() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.layers = [];
        return _this;
    }
    Toolbar.prototype.render = function () {
        var section = dom.section("toolbar-container");
        section.style.width = "42px";
        section.style.background = this.colorPalette.toolbarBg;
        this.rendered(section);
    };
    return Toolbar;
}(component_1["default"]));
exports["default"] = Toolbar;
//# sourceMappingURL=toolbar.js.map