import { Dimension, ElementLike, RenderFn } from "./types";

const prefix = "di__";

export function renderer<T extends HTMLElement>(c: T): RenderFn {
  let lastNode = section("-") as T;
  c.appendChild(lastNode);

  return function(el: T): void {
    c.replaceChild(el, lastNode);
    lastNode = el;
  };
}

export function getDimensions<T extends HTMLElement>(
  element: T,
  inject: boolean = false
): Dimension {
  let dim;

  if (inject) {
    const clone = element.cloneNode(true) as T;
    clone.style.display = "block";
    clone.style.visibility = "hidden";
    document.body.appendChild(clone);
    dim = clone.getBoundingClientRect();
    document.body.removeChild(clone);
  } else {
    dim = element.getBoundingClientRect();
  }

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

export function button(className: string = ""): HTMLElement {
  const button = document.createElement("button");
  button.className = prefix + className;
  return button;
}

export function a(className: string = ""): HTMLElement {
  const a = document.createElement("a");
  a.className = prefix + className;
  return a;
}

export function canvas(className: string = ""): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.className = prefix + className;
  return canvas;
}
