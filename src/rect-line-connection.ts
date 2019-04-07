// import Line from "./line";
// import Rect from "./rect";
import { AnchorPlacement } from "./types";

/**
 * RectLineConnection is the point where a line connects to a rectangle. A line
 * can connect to one or two rectangles.
 *
 * The connection can be made on any of the 7 anchor points on a rect.
 *
 * [LeftTop, LeftMiddle, LeftBottom]
 * [Middle]
 * [RightTop, RightMiddle, RightBottom]
 */
export default class RectLineConnection {
  startRect: AnchorPlacement;
  endRect: AnchorPlacement;
}
