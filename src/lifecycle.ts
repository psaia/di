import State from "./state";
import Canvas from "./canvas";
import { Point } from "./types";

export default abstract class LifeCycle {
  state: State;
  selected: boolean = true;
  constructor(state: State) {
    this.state = state;
  }
  abstract hitTest(p: Point);
  abstract start(c: Canvas);
  abstract stop();
  abstract mutate();
  abstract remove(c: Canvas);
}
