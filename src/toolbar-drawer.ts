import * as dom from "./dom";
import Component from "./component";
import { Mode } from "./types";

export default class ToolbarDrawer extends Component {
  public onModeChange: (m: Mode) => void;
  mode: Mode;
  handleClickEvent(m: Mode) {
    return () => {
      this.mode = m;
      this.onModeChange(this.mode);
    };
  }
  render() {
    const el = dom.section("toolbar");

    const marqueeButton = dom.button();
    const rectButton = dom.button();
    const lineButton = dom.button();
    const textButton = dom.button();

    marqueeButton.innerHTML = "marquee";
    rectButton.innerHTML = "rect";
    lineButton.innerHTML = "line";
    textButton.innerHTML = "text";
    // marqueeButton.style.backgroundImage = `url(${icons.marqueeLight})`;
    // rectButton.style.backgroundImage = `url(${icons.rectangleDark})`;
    // lineButton.style.backgroundImage = `url(${icons.lineDark})`;
    // textButton.style.backgroundImage = `url(${icons.textDark})`;

    el.style.background = this.colorPalette.toolbarBg;

    marqueeButton.addEventListener(
      "click",
      this.handleClickEvent(Mode.Marquee)
    );
    rectButton.addEventListener("click", this.handleClickEvent(Mode.Rectangle));
    lineButton.addEventListener("click", this.handleClickEvent(Mode.Line));
    textButton.addEventListener("click", this.handleClickEvent(Mode.Text));

    el.appendChild(marqueeButton);
    el.appendChild(rectButton);
    el.appendChild(lineButton);
    el.appendChild(textButton);

    this.rendered(el);
  }
}

// const icons = {
//   textLight:
//     "iVBORw0KGgoAAAANSUhEUgAAABYAAAAeCAYAAAAo5+5WAAAABGdBTUEAALGPC/xhBQAAAMFJREFUSA1j/A8EDNQHDUzUNxNiIt0MlgXax48F/0PyWRUWeZCe6UhqGFiQOUD2J0ZGxk9oYgxo8fADh5pfyProFhTIllLEBgXFRCQTULyDJM6IxMbFPIgkcQKJjZsJDOM/oHCGgkLcKhEyQy+MR10Mj73RoBgNCngIwBmjqWIIBwV6ZQqqOAWB/uGD+wnCQK5BBIFq5JHlgZXrQ2Q+VjZQUye0piCW+oPNIJolN4ygANr+HYg/YHMFDrG/OMRpIwwAOl1jHCODvn8AAAAASUVORK5CYII=",
//   selectLight:
//     "iVBORw0KGgoAAAANSUhEUgAAACAAAAAeCAYAAABNChwpAAAABGdBTUEAALGPC/xhBQAAAlhJREFUSA29lk9IVFEUxt8kYUgltsiNDCW4SMiVBFELNxJCEAjZroW0Eheia/+s3Og2qDYRgYJuNdxNtIoW4qJooW5aaKGUEJSg9vx94716e86bO+/x3nzwec+95zvnOw7v3ZlCGIZvgyBYh4uFQuEra33BACPQ4jPBBLxVtykwa4UHMAo7TGfuw+C8ZNw3WT9GJ2GvYSZhPsPQeAAKv2AjLMIxWJ9hMLoE96Dw2P3I2ddnGIxeyh0suQO4Mbn8hqH5PbkDPZDXXeNKMZrsh6HpBhRGKpnGnaF3h/lX7nD2p/YHmJoJU7caZ+Y7p17DjEI9wMmGoeCmU3TbZ+bL08sOs0vsQm/bo4r1JD4Y5UxFQYJD+tyBJdNPyz6chddi25B8BoUt2BArrJKgrgMuQIsjgjewWKXsJIWoGf6FwgNvgSNAr2v9OXSv9nfsuxyZP6RgHgpzfnUQoLsMp+BvaPGJoKeW+nMaCvtMlz+sV88JnAPy/fCH0WtZh//dpo68tpAGDXAbCoNxVeRa4E+JwHc4BC/G6ROd00hPq/A+rpCc1XwjvhKnS3VOwy4o6DK5EW2iM6jXSngazWeyp/FauX0Yjkcbcj5nctJciOYz2dNYV6qg34ynYN8N7TXbe5rIOsBE7/UhFO7a/sQlHYAVe5bbisly2SoMX8iE+KHZ63ZLdsGkmRKTJ8ZQr1sT/GL2r9P0S1yDmftzzX4auqDaEjdLW4DZK/Nf22U6ba9Udbjet86sO7Dq9ZzKxFeE6aYZYtinzSWPub7t9EWTzV2fdEqM22F/0jqf/hhHAq5AGWttgQAAAABJRU5ErkJggg==",
//   rectLight:
//     "iVBORw0KGgoAAAANSUhEUgAAACgAAAAcCAYAAAATFf3WAAAABGdBTUEAALGPC/xhBQAAAJ1JREFUWAntl7ENgDAQAwlCgpoKwT4MwmLMwUBITAE8FSdKFySFUzlKLFv3aZKuWFWZa00pLXWZ3d5WzSurM/SBfQ7ZRWjPYBY8AunEw791vLY5MjfmFj9iF+S4FG2CCjV6TJA0FG2CCjV6TJA0FG2CCjV6TJA0FG2CCjV6TJA0FG2CCjV6+Ksb4le18zCDbr+ZLPiMe/xeyL0v/g3eJSUQX+Hu6UAAAAAASUVORK5CYII=",
//   lineLight:
//     "iVBORw0KGgoAAAANSUhEUgAAABoAAAAcCAYAAAB/E6/TAAAABGdBTUEAALGPC/xhBQAAAYRJREFUSA21lk8rRFEYh91JpNCQRIqUImWhLEiKZmMhKSmzsbGxYWHDxsLOUuyUL8AHYKksRikLNc2UUlKTkhCRv8fz6t46nWaaHPd96+mcc+99n9+9M90zE1QoljGmE/0sjMQeg7wFliADUe1VxpGELYlnGtIwBgmw68ReeM0JmYS36NZLjENecrcJ+XaJADksN1Ht9nitEQWwC8Xq/x+bfVckJCBXJGlTrnO/NLv3r/N1GnrgwWnMOGv/JU+xGj7JMWMDHIZrGTr8zVYnosVQespYL6cYa+AICtal/lNE8/AN59Bom1jXwYp9zGuOJA1fkIdmL0m5JsRT8AGX0Fbueq/ziMdBXsJrkE0z/kI8Ci9wA93xJ2BEPAhPcAd9WiH9yO/hEQa0QnqR38IzDGuFdCEvwCuktELakV/BO0xohbQiv4BPmNEKaUKeBdla5rRCksjPQGpBK6QWefTPZVkrJNrW5UnWtEKqkB9IArWhEiJS5Pu/EcZsqYWEQfK7sgOBZtAPqmfXRATkc3kAAAAASUVORK5CYII=",
//   textDark:
//     "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAgCAYAAAAmG5mqAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAbklEQVQ4je2UwQ2AIBAEF0MBdrKWoJVrCWwndoCB4EMBkT/zu2M3Fz5jvPfowYYsyRnA0ug5SadNQwjvWeTJBuCYsnWD4h9IxqUk837rvjAKo1BhFEahQvQSyfWP+ST1m+92q0vu/CJkyqqsAuACdNIeCAV1+NEAAAAASUVORK5CYII=",
//   lineDark:
//     "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABcCAYAAACRILDuAAAACXBIWXMAABYlAAAWJQFJUiTwAAACrElEQVR4nO2c0XHbMBAF32Xyn3QQl+ASUkI6iEtIKSnB7sQlxB3YHdgVXIYJNaINigBJUAfcvZ3BD0jZM7smKEGWRFVB7PhE97YwgDEMYAwDGMMAxjCAMQxgDAMYwwDGMIAxDGAMA1RARH6IyL2IvK79aZ+TGVLEIB3AaXwZH/PEAAdyQfqUx2QmAwNkKJA+hQFqsFL6lD/JTAYGGNkh/cSLqj4nsxlCB6ggfcrq5QcRA1SWPmX18oOgV8Ag/mcyu59NV0DIN+WHF02VI7yp6tdktoCQr4RV9Q7AQ3JgO5uWH0TeiqgcYdPyg+h7QRUjbA7Af8yqcE9QVUkmC+Fu6P4rYfUG3BQGGBkjvCQH8mxefsAAZ8Zl6FtyIA8D7GXnPWDzU1AwwKL8kuVo0wbclNABFuQ/qOpNwY151/KDyAEy8ocbcsmzo13LD8ZfEm4AGOTrzLifc7Fw/u3c+WsG5Z/HrPyFx73OnccAC2NG4mksyr8Q4XHunLUjzD2gZM3P8eGesPsGjChvyNSQf2I4X+Tf1k+VAO4342rKPwLXS1Dr8uE5QA/y4TVAL/LhMUBP8uEtQG/y4SlAj/LhJUCv8uEhQM/y0XuA3uWj5wAe5KPXAF7ko8cAnuSjtwDe5KOnAB7lo5cAXuWjhwCe5aP1AN7lo+UAEeSj1QBR5KPFAJHko7UA0eSjpQAR5aOVAFHlo4UAkeXDOkB0+bAMQPn/MQlA+WeuHoDy33PVAJSfcrUAlD/PVQJQ/mUOD0D5yxwagPLzHBaA8ss4JADll1M9AOWvo2oAEflN+euofQUMf/1vH+Yof4GqAVR1+PKK75MIlJ/hkM8Ji8gtgDtV/ZUcJO9def+gduuE/8YsaxjAGAYwhgGMYQBjGMAYBjCGAYxhAGMYwBgGMIYBLAHwF4/RU4hJQEIfAAAAAElFTkSuQmCC",
//   rectangleDark:
//     "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAiCAYAAAAge+tMAAAABGdBTUEAALGPC/xhBQAAAIZJREFUWAnt2LENgGAIhFExzsP+c7CQJpZUV1xQks9Ocz+SBzZGZt7Hwutc2PPbMo1PT+7qL6yq6M/+cN+/RVZleiqIIy4KsCoilC2GuI1SLIS4CGWLIW6jFAshLkLZYojbKMVCiItQthjiNkqxEOIilC2GuI1SLBT9D5F47vMYqzI9grXiDy7JB1eT5yRbAAAAAElFTkSuQmCC",
//   marqueeDark:
//     "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAiCAYAAAAge+tMAAAABGdBTUEAALGPC/xhBQAAAKpJREFUWAntl0EOgCAQA8HwHv7/Dj6k4dAEe+JAYKv1sgoEdodaQq613ml4Wmt5+ExR+68xSaX3opRszxUKkCWeUQHIs8bRfjpynrLEZTTOSpAlflq6/1v/dUpGLv87rsKV8N8bdRdkXcU+HlVSzmsVAfv4KpKz8xT7+CyqRePs44tAepqwBOzju7fGPr6dOC+Ik5RvQmjH+N39WBdR9gZ0dXJMD1VFjrLEH/xAUETson4YAAAAAElFTkSuQmCC"
// };
