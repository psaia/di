// @ts-ignore
window.process = {
  env: {
    NODE_ENV: "development"
  }
};

// @ts-ignore
window.di = di;

import * as React from "react";
import { render } from "react-dom";
import * as dom from "./dom";
import ToolbarDrawer from "./toolbar-drawer";
import Canvas from "./canvas";
import State from "./state";
import Grid from "./grid";
import Events from "./events";
import LayerDrawer from "./layer-drawer";
import UtilityDrawer from "./utility-drawer";
import * as interactions from "./interactions";

function di(parentSelector: string) {
  const state = new State();
  const events = new Events();
  const parent = dom.select(parentSelector);

  const App = (
    <>
      <UtilityDrawer events={events} globalState={state} />
      <LayerDrawer events={events} globalState={state} />
      <ToolbarDrawer events={events} globalState={state} />
      <Grid events={events} globalState={state} />
      <Canvas events={events} globalState={state} />
    </>
  );

  render(App, parent);

  interactions.configure(state, events);
}
