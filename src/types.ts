export type Point = Float32Array;

export type ElementLike = Element | HTMLElement | HTMLCanvasElement;

export type RenderFn = (elements: ElementLike) => void;

export type Group = Float32Array[];

export enum ActionType {
  Moving = 0,
  Resizing
}

export enum AnchorPosition {
  LeftTop = 0,
  LeftMiddle,
  LeftBottom,
  Center,
  RightTop,
  RightMiddle,
  RightBottom,
  BottomMiddle,
  TopMiddle
}

export enum LayerType {
  Rect = 0,
  Line
}

export enum Mode {
  Marquee = 0,
  Rectangle,
  Line
}

export interface HitTestResult {
  position: AnchorPosition;
  point: Point;
}

export type HitTestFn = (p: Point) => HitTestResult | null;

export interface Bounds {
  topLeft: Point;
  topRight: Point;
  bottomLeft: Point;
  bottomRight: Point;
}

export interface ColorPalette {
  brandingBg: string;
  brandingColor: string;
  utilityBg: string;
  utilityColor: string;
  toolbarBg: string;
  toolbarColor: string;
  toolbarActiveBg: string;
  stageBg: string;
  stageColor: string;
  layersBg: string;
  layersColor: string;
  gridColor: string;
  shapeColor: string;
}

export interface Dimension {
  width: number;
  height: number;
}

export enum KeyEvent {
  BACKSPACE = 8,
  ARROW_LEFT = 37,
  ARROW_RIGHT = 39,
  ARROW_UP = 38,
  ARROW_DOWN = 40
}

export enum BorderType {
  Light = "light",
  Heavy = "heavy",
  Double = "double",
  Dashed = "dashed",
  None = "no-border"
}

export enum OptionType {
  Bool = 1,
  Text,
  Choice
}

export interface Option {
  fieldType: string;
}

export interface PubSubEvent {
  name: string;
  fn: (any) => any;
}
