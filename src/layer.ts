import { LayerType } from "./types";
import Rect from "./rect";
import Line from "./line";
// import Text from "./text";

export default class Layer {
  type: LayerType;
  humanName: string = "";
  shape: Rect | Line;
}
