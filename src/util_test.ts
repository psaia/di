import * as util from "./util";
import * as assert from "assert";

describe("util", function() {
  describe("util.within()", function() {
    it("should determine if a number is within a range", function() {
      assert.equal(true, util.within(5, 1, 10));
      assert.equal(true, util.within(5, 1, 100000));
      assert.equal(false, util.within(0, 1, 5));
      assert.equal(true, util.within(1, 1, 5));
    });
  });
  describe("util.centroid()", function() {
    it("should obtain the center of a boundbox of vectors", function() {
      const center = util.centroid([util.pt(0, 0), util.pt(2, 2)]);
      assert.deepEqual([center[0], center[1]], [1, 1]);
    });
  });
});
