import { Dimension, ElementLike, RenderFn } from "./types";

const prefix = "di__";

export function renderer(c: ElementLike): RenderFn {
  let lastNode: ElementLike = section("-");
  c.appendChild(lastNode);

  return function(el: ElementLike): void {
    c.replaceChild(el, lastNode);
    lastNode = el;
  };
}

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

export function section(className: string): HTMLElement {
  const s = document.createElement("section");
  s.className = prefix + className;
  return s;
}

export function ul(className: string = ""): HTMLElement {
  const ul = document.createElement("ul");
  ul.className = prefix + className;
  return ul;
}

export function li(className: string = ""): HTMLElement {
  const li = document.createElement("li");
  li.className = prefix + className;
  return li;
}

export function canvas(className: string = ""): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.className = prefix + className;
  return canvas;
}
