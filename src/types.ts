export type Point = Float32Array;

export type Group = Float32Array[];

export enum ActionType {
  Moving = 0,
  Creating
}

export enum LayerType {
  Rect = 0,
  Line,
  Text
}

export interface ColorPalette {
  sidebarBg: string;
  stageBg: string;
  sidebarColor: string;
  stageColor: string;
}
