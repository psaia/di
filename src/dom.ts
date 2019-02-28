export interface Dimension {
  width: number;
  height: number;
}

const NS = "http://www.w3.org/2000/svg";
export type El = HTMLElement | SVGSVGElement | SVGGElement | SVGCircleElement;

export function getDimensions(element: Element): Dimension {
  const dim = element.getBoundingClientRect();

  return {
    height: dim.height,
    width: dim.width
  };
}

export function select(selector: string): HTMLElement {
  return document.querySelector(selector);
}

export function section(id: string): HTMLElement {
  const s = document.createElement("section");
  s.id = id;
  return s;
}

export function attr(
  element: El,
  key: string,
  value?: string | number
): string {
  if (typeof value === "undefined") {
    return element.getAttribute(key);
  }
  element.setAttribute(key, String(value));
  return String(value);
}

export function circle(
  r: number | string,
  x: number | string,
  y: number | string
) {
  const el = document.createElementNS(NS, "circle");
  attr(el, "r", String(r));
  attr(el, "cx", String(x));
  attr(el, "cy", String(y));
  attr(el, "fill", "#333");
  return el;
}

export function canvas(): HTMLCanvasElement {
  return document.createElement("canvas");
}
