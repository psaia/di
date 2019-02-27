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

export function add(a: Point, b: Group): Group {
  return b.map(v => pt(v[0] + a[0], v[1] + a[1]));
}

export function subtract(a: Point, b: Group): Group {
  return b.map(v => pt(v[0] - a[0], v[1] - a[1]));
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
