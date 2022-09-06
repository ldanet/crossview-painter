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
  // drawing
  strokes: Stroke[];
  currentStroke?: Stroke & { startingDepth?: number; length?: number };
  clearedStrokes?: Stroke[];

  // cursor
  cursorX: number;
  cursorY: number;

  // settings
  backgroundColor: string;
  color: string;
  opacity: number;
  size: number;
  depth: number;
  depthGradientEnabled: boolean;
  depthGradient: number;

  // canvas
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
  toggleDepthGradient: () => void;
  setDepthGradient: (amount: number) => void;

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
  handleMove: (
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
