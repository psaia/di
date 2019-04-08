import State from "./state";
import Canvas from "./canvas";

export default abstract class LifeCycle {
  state: State;
  selected: boolean = true;
  constructor(state: State) {
    this.state = state;
  }
  abstract start(c: Canvas);
  abstract stop();
  abstract run();
  abstract remove(c: Canvas);
}
