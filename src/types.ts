export type Point = Float32Array;

export type RenderFn = (elements: HTMLElement) => void;

export type Group = Float32Array[];

export enum ActionType {
  Moving = 0,
  Creating,
  Resizing
}

export enum LayerType {
  Rect = 0,
  Line,
  Text
}

export interface ColorPalette {
  toolbarBg: string;
  toolbarColor: string;
  stageBg: string;
  stageColor: string;
  layersBg: string;
  layersColor: string;
  gridColor: string;
  shapeColor: string;
}
