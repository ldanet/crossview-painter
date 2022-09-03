import React from "react";

type Point = {
  x: number;
  y: number;
  depth: number;
};

type Stroke = {
  color: string;
  size: number;
  points: Point[];
};

type StoreData = {
  strokes: Stroke[];
  currentStroke?: Stroke;
  backgroundColor: string;
  color: string;
  size: number;
  scaling: number;
  depth: number;
  leftCtx?: CanvasRenderingContext2D;
  rightCtx?: CanvasRenderingContext2D;
};

type StoreHandlers = {
  handleInit: (
    leftCtx: CanvasRenderingContext2D,
    rightCtx: CanvasRenderingContext2D,
    scaling: number
  ) => void;
  handlePress: (
    e:
      | React.MouseEvent<HTMLCanvasElement, MouseEvent>
      | React.TouchEvent<HTMLCanvasElement>
  ) => void;
  handleDrag: (
    e:
      | React.MouseEvent<HTMLCanvasElement, MouseEvent>
      | React.TouchEvent<HTMLCanvasElement>
  ) => void;
  handleRelease: (
    e?:
      | React.MouseEvent<HTMLCanvasElement, MouseEvent>
      | React.TouchEvent<HTMLCanvasElement>
  ) => void;
  handleCancel: () => void;
  handleClear: () => void;
  handleUndo: () => void;
  redraw: () => void;
};

export type Store = StoreData & StoreHandlers;
