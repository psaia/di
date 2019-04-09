import { Point, Group } from "./types";

export function pt(x?: number, y?: number): Point {
  if (x === undefined || y === undefined) {
    return new Float32Array([0, 0]);
  }
  return new Float32Array([x, y]);
}

export function within(p: number, a: number, b: number): boolean {
  return p >= Math.min(a, b) && p <= Math.max(a, b);
}

export function withinBound(pt: Point, rect: Group): boolean {
  if (
    !within(pt[0], rect[0][0], rect[1][0]) ||
    !within(pt[1], rect[0][1], rect[1][1])
  ) {
    return false;
  }
  return true;
}

/**
 * Obtain the center of two vectors in 2d space.
 * @params pts contains top left and bottom right.
 */
export function centroid(pts: Group): Point {
  return pt(
    pts[0][0] + (pts[1][0] - pts[0][0]) / 2,
    pts[0][1] + (pts[1][1] - pts[0][1]) / 2
  );
}

export function add(a: Point, b: Point | Group): Point | Group {
  if (b instanceof Array) {
    return b.map(v => pt(v[0] + a[0], v[1] + a[1]));
  } else if (b instanceof Float32Array) {
    return pt(a[0] + b[0], a[1] + b[1]);
  }
}

export function subtract(a: Point, b: Point | Group): Point | Group {
  if (b instanceof Array) {
    return b.map(v => pt(v[0] - a[0], v[1] - a[1]));
  } else if (b instanceof Float32Array) {
    return pt(a[0] - b[0], a[1] - b[1]);
  }
}

export function clone(a: Group): Group {
  return a.map(v => pt(v[0], v[1]));
}

export function multiply(a: Point, b: Group): Group {
  return b.map(v => pt(v[0] * a[0], v[1] * a[1]));
}

export function dot(...pts): number {
  const init = new Float32Array([0, 0]);
  return pts.reduce((acc, p) => multiply(acc, p), init);
}
