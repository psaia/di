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
  Line,
  Text
}

export enum Mode {
  Marquee = 0,
  Rectangle,
  Line,
  Text
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
  controldrawerBg: string;
  controldrawerColor: string;
  toolbarBg: string;
  toolbarColor: string;
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
