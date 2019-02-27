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