import * as dom from "./dom";
import Layer from "./layer";
import Component from "./component";
import { Mode, Point, LayerType, ColorPalette, RenderFn } from "./types";

const LEFT_MARGIN = 180;

export default class Toolbar extends Component {
  public onModeChange: (m: Mode) => void;
  showing: boolean;
  position: Point;
  mode: Mode;
  handleClickEvent(m: Mode) {
    return () => {
      this.mode = Mode.Marquee;
      // this.mode = this.mode === m ? Mode.Marquee : m;
      this.onModeChange(this.mode);
    };
  }
  render() {
    const el = dom.section("toolbar");

    const rectButton = dom.button();
    const lineButton = dom.button();
    const textButton = dom.button();

    rectButton.style.backgroundImage = `url(${icons.rectangleDark})`;
    lineButton.style.backgroundImage = `url(${icons.lineDark})`;
    textButton.style.backgroundImage = `url(${icons.textDark})`;

    el.style.background = this.colorPalette.toolbarBg;
    el.style.position = "absolute";

    rectButton.addEventListener("click", this.handleClickEvent(Mode.Rectangle));
    lineButton.addEventListener("click", this.handleClickEvent(Mode.Line));
    textButton.addEventListener("click", this.handleClickEvent(Mode.Text));

    el.appendChild(rectButton);
    el.appendChild(lineButton);
    el.appendChild(textButton);

    if (this.showing) {
      el.style.display = "absolute";
      const d = dom.getDimensions(el, true);
      el.style.left = `${LEFT_MARGIN + this.position[0] - d.width / 2}px`;
      el.style.top = `${this.position[1] - d.height - 26}px`;
    } else {
      el.style.display = "none";
    }

    this.rendered(el);
  }
  show(pos: Point) {
    this.showing = true;
    this.position = pos;
    this.render();
  }
  hide() {
    this.showing = false;
    this.render();
  }
}

const icons = {
  textDark:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAgCAYAAAAmG5mqAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAbklEQVQ4je2UwQ2AIBAEF0MBdrKWoJVrCWwndoCB4EMBkT/zu2M3Fz5jvPfowYYsyRnA0ug5SadNQwjvWeTJBuCYsnWD4h9IxqUk837rvjAKo1BhFEahQvQSyfWP+ST1m+92q0vu/CJkyqqsAuACdNIeCAV1+NEAAAAASUVORK5CYII=",
  lineDark:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAABGdBTUEAALGPC/xhBQAAAf9JREFUWAntlztOw0AQhmOLInJJC3dIUiaipKEmUCKEEC0dDTWHQIpSUPI4AdS2qJyEM9BC5wrF/IMYa2PvY5x4kyaWrH3Nznyefz2yW63tZc9AYF/2u9rpdPbyPD9GlP3ZbHZD0Xb8hqx6Z4ggCE4BM4AFJeWaLdcCRBAAGALghCHQMkOOtRceeAMqQwBAezwAE0+n008vQFIIDk4tQB/V8coZWgZCAViQi+aXAloRouApy1ULqCmIggYdAD2pYyeQDwgFAMcnf1bGf12tZL1e72g+n99iwwC39u0oO6o71slFPkKdo3a7/Y75CLcXGIqpk4vmtUBJknxFUXSITSkZebi0clEcLRAt+IQyyWUF8gllkssJ5AnKKJcIqGkom1xioCahbHLVAmoIyipXbSDaEMfxN57yg/p1L5dc5E9bqU2BqGp3u90R2jOTjW3eJRftNdahsmMF5oLXwjB8QBBp8XTKJQbSwQBknKbpubSiS+QSAZlgJpPJJYLk0ooO28qnBmdaba2SuWDYkQBKJJc1Q1IYCZRULiNQXRgXlFQuLdCyMBYosVzkY+EDbFUYhqK23+/vZln2hm6G/64Ddc3WLw51kzAUkA86atWdDaC8VmQIH/T3gLpiA+g+5leb59bRFhnCk7wC4oeCbgqm8sD42xj+Z6rIXMVoO7HhDPwC/Y58qqnpGUQAAAAASUVORK5CYII=",
  rectangleDark:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAiCAYAAAAge+tMAAAABGdBTUEAALGPC/xhBQAAAKpJREFUWAntl0EOgCAQA8HwHv7/Dj6k4dAEe+JAYKv1sgoEdodaQq613ml4Wmt5+ExR+68xSaX3opRszxUKkCWeUQHIs8bRfjpynrLEZTTOSpAlflq6/1v/dUpGLv87rsKV8N8bdRdkXcU+HlVSzmsVAfv4KpKz8xT7+CyqRePs44tAepqwBOzju7fGPr6dOC+Ik5RvQmjH+N39WBdR9gZ0dXJMD1VFjrLEH/xAUETson4YAAAAAElFTkSuQmCC"
};
