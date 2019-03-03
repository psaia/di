"use strict";
exports.__esModule = true;
var events = {};
var Pubsub = /** @class */ (function () {
    function Pubsub() {
        this.events = [];
    }
    Pubsub.prototype.publish = function (name, payload) {
        if (events[name]) {
            events[name](payload);
        }
        // const evts = this.events;
        // for (let i = 0, l = evts.length; i < l; i++) {
        //   if (name === evts[i].name) {
        //     evts[i].fn(payload);
        //   }
        // }
    };
    Pubsub.prototype.subscribe = function (name, fn, group) {
        if (group === void 0) { group = "global"; }
        events[name] = fn;
        // this.events.push({ name, fn, group });
    };
    return Pubsub;
}());
exports["default"] = Pubsub;
//# sourceMappingURL=pubsub.js.map