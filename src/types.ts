import React from "react";

export type Point = {
  x: number;
  y: number;
  depth: number;
};

type Stroke = {
  color: string;
  size: number;
  opacity: number;
  points: Point[];
};

type StoreData = {
  strokes: Stroke[];
  currentStroke?: Stroke;
  backgroundColor: string;
  color: string;
  opacity: number;
  size: number;
  depth: number;
  scaling: number;
  leftCtx?: CanvasRenderingContext2D;
  rightCtx?: CanvasRenderingContext2D;
};

type StoreHandlers = {
  setBackgroundColor: (backgroundColor: string) => void;
  setColor: (color: string) => void;
  setOpacity: (opacity: number) => void;
  setSize: (size: number) => void;
  setDepth: (depth: number) => void;
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
