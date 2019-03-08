export type Point = Float32Array;

export type ElementLike = Element | HTMLElement | HTMLCanvasElement;

export type RenderFn = (elements: ElementLike) => void;

export type Group = Float32Array[];

export enum ActionType {
  Moving = 0,
  Enlarging,
  Resizing
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
