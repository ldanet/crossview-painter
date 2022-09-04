import create from "zustand";
import { Point, Store } from "./types";

export const CANVAS_SIZE = 2000;
export const MAX_DEPTH = 200;

function isMouseEvent(
  e:
    | React.MouseEvent<HTMLCanvasElement, MouseEvent>
    | React.TouchEvent<HTMLCanvasElement>
): e is React.MouseEvent<HTMLCanvasElement, MouseEvent> {
  return e.type.startsWith("mouse");
}

const eventToPoint = (
  e:
    | React.MouseEvent<HTMLCanvasElement, MouseEvent>
    | React.TouchEvent<HTMLCanvasElement>,
  canvas: HTMLCanvasElement,
  scaling: number
) => {
  let x: number;
  let y: number;
  if (isMouseEvent(e)) {
    x = e.pageX;
    y = e.pageY;
  } else {
    x = e.changedTouches[0].pageX;
    y = e.changedTouches[0].pageY;
  }
  x -= (canvas.offsetLeft ?? 1) + 1;
  y -= (canvas.offsetTop ?? 1) + 1;

  x = (x * window.devicePixelRatio) / scaling;
  y = (y * window.devicePixelRatio) / scaling;
  return { x, y };
};

const getOffset = (depth: number) => MAX_DEPTH / 2 - depth;

const lineTo = (
  { x, y, depth }: Point,
  leftCtx: CanvasRenderingContext2D,
  rightCtx: CanvasRenderingContext2D
) => {
  leftCtx.lineTo(x, y);
  rightCtx.lineTo(x + getOffset(depth), y);
};
const moveTo = (
  { x, y, depth }: Point,
  leftCtx: CanvasRenderingContext2D,
  rightCtx: CanvasRenderingContext2D
) => {
  leftCtx.moveTo(x, y);
  rightCtx.moveTo(x + getOffset(depth), y);
};

export const useStore = create<Store>((set, get) => ({
  strokes: [],
  backgroundColor: "#ffffff",
  color: "#000000",
  opacity: 1,
  size: 10,
  depth: MAX_DEPTH / 2,
  scaling: 1,

  setBackgroundColor: (backgroundColor) => {
    set({ backgroundColor });
  },
  setColor: (color) => {
    set({ color });
  },
  setOpacity: (opacity) => {
    set({ opacity });
  },
  setSize: (size) => {
    set({ size });
  },
  setDepth: (depth) => {
    set({ depth });
  },

  handleInit: (leftCtx, rightCtx, scaling) => {
    leftCtx.lineCap = "round";
    leftCtx.lineJoin = "round";
    leftCtx.scale(scaling, scaling);
    rightCtx.lineCap = "round";
    rightCtx.lineJoin = "round";
    rightCtx.scale(scaling, scaling);

    set({ leftCtx, rightCtx, scaling });
  },
  handlePress: (e) => {
    const { leftCtx, rightCtx, scaling } = get();

    if (leftCtx && rightCtx) {
      const { x, y } = eventToPoint(e, leftCtx!.canvas, scaling);
      const newPoint = { x, y, depth: get().depth };
      set({
        currentStroke: {
          size: get().size,
          color: get().color,
          opacity: get().opacity,
          points: [newPoint],
        },
      });
      leftCtx.strokeStyle = get().color;
      rightCtx.strokeStyle = get().color;
      leftCtx.lineWidth = get().size;
      rightCtx.lineWidth = get().size;
      rightCtx.strokeStyle = get().color;
      leftCtx.globalAlpha = get().opacity;
      rightCtx.globalAlpha = get().opacity;
      leftCtx.beginPath();
      rightCtx.beginPath();
      moveTo(newPoint, leftCtx, rightCtx);
    }
  },
  handleDrag: (e) => {
    const { currentStroke } = get();
    if (!currentStroke) return;

    const { leftCtx, rightCtx, scaling } = get();
    if (leftCtx && rightCtx) {
      const { x, y } = eventToPoint(e, leftCtx!.canvas, scaling);
      const newPoint = { x, y, depth: get().depth };

      set({
        currentStroke: {
          ...currentStroke,
          points: [...currentStroke.points, newPoint],
        },
      });

      lineTo(newPoint, leftCtx, rightCtx);

      leftCtx.stroke();
      rightCtx.stroke();
    }
  },
  handleRelease: () => {
    const { currentStroke, strokes } = get();
    if (currentStroke) {
      set({ strokes: [...strokes, currentStroke], currentStroke: undefined });
    }
    get().redraw();
  },
  handleCancel: () => {
    get().handleRelease();
  },
  handleClear: () => {
    set({ strokes: [], currentStroke: undefined });
    get().redraw();
  },
  handleUndo: () => {
    const strokes = [...get().strokes];
    strokes.pop();
    set({ strokes, currentStroke: undefined });
    get().redraw();
  },
  redraw: () => {
    const { leftCtx, rightCtx, strokes } = get();
    if (leftCtx && rightCtx) {
      leftCtx?.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      rightCtx?.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      strokes.forEach((stroke) => {
        leftCtx.strokeStyle = stroke.color;
        rightCtx.strokeStyle = stroke.color;
        leftCtx.lineWidth = stroke.size;
        rightCtx.lineWidth = stroke.size;

        leftCtx.globalAlpha = stroke.opacity;
        rightCtx.globalAlpha = stroke.opacity;

        leftCtx.beginPath();
        rightCtx.beginPath();
        stroke.points.forEach((point, index) => {
          if (index === 0) {
            moveTo(point, leftCtx, rightCtx);
          }
          if (index !== 0 || stroke.points.length === 1) {
            lineTo(point, leftCtx, rightCtx);
          }
        });
        leftCtx.stroke();
        rightCtx.stroke();
      });
    }
  },
}));
