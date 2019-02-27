import * as dom from "./dom";

export default class Layer {
  parent: dom.El;
  el: dom.El;
  stable: boolean = false;
  immutable: boolean;

  constructor(parent: dom.El, el: dom.El, immutable: boolean = false) {
    this.parent = parent;
    this.el = el;
    this.update(el);
  }

  update(el) {
    if (this.immutable) {
      throw new Error("Layer is immutable. Will not update.");
    }
    this.remove();
    this.parent.appendChild(el);
    this.el = el;
    this.stable = true;
    return this;
  }

  remove() {
    if (this.stable && !this.immutable) {
      this.parent.removeChild(this.el);
      this.stable = false;
    }
    return this;
  }
}
