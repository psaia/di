"use strict";
exports.__esModule = true;
var util = require("./util");
var assert = require("assert");
describe("util", function () {
    describe("util.within()", function () {
        it("should determine if a number is within a range", function () {
            assert.equal(true, util.within(5, 1, 10));
            assert.equal(true, util.within(5, 1, 100000));
            assert.equal(false, util.within(0, 1, 5));
            assert.equal(true, util.within(1, 1, 5));
        });
    });
});
//# sourceMappingURL=util_test.js.map