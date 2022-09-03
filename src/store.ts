import create from "zustand";
import { Store } from "./types";

export const CANVAS_SIZE = 1000;

function isMouseEvent(
  e:
    | React.MouseEvent<HTMLCanvasElement, MouseEvent>
    | React.TouchEvent<HTMLCanvasElement>
): e is React.MouseEvent<HTMLCanvasElement, MouseEvent> {
  return e.type.startsWith("mouse");
}

export const useStore = create<Store>((set, get) => ({
  strokes: [],
  backgroundColor: "#222",
  color: "#fff",
  size: 10,
  scaling: 1,
  depth: 0,

  handleInit: (
    leftCtx: CanvasRenderingContext2D,
    rightCtx: CanvasRenderingContext2D,
    scaling
  ) => {
    leftCtx.lineCap = "round";
    leftCtx.lineJoin = "round";
    leftCtx.scale(scaling, scaling);
    rightCtx.lineCap = "round";
    rightCtx.lineJoin = "round";
    rightCtx.scale(scaling, scaling);
    set({ leftCtx, rightCtx, scaling });
  },
  handlePress: (
    e:
      | React.MouseEvent<HTMLCanvasElement, MouseEvent>
      | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const { leftCtx, rightCtx, scaling } = get();
    let x: number;
    let y: number;
    if (isMouseEvent(e)) {
      x = e.pageX;
      y = e.pageY;
    } else {
      x = e.changedTouches[0].pageX;
      y = e.changedTouches[0].pageY;
    }
    x -= leftCtx?.canvas.offsetLeft ?? 0;
    y -= leftCtx?.canvas.offsetTop ?? 0;
    x = x / scaling;
    y = y / scaling;
    set({
      currentStroke: {
        size: get().size,
        color: get().color,
        points: [{ x, y, depth: get().depth }],
      },
    });
    if (leftCtx && rightCtx) {
      leftCtx.strokeStyle = get().color;
      rightCtx.strokeStyle = get().color;
      leftCtx.lineWidth = get().size;
      rightCtx.lineWidth = get().size;
      leftCtx?.beginPath();
      rightCtx?.beginPath();
      leftCtx?.moveTo(x, y);
      rightCtx?.moveTo(x, y);
    }
  },
  handleDrag: (
    e:
      | React.MouseEvent<HTMLCanvasElement, MouseEvent>
      | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const { currentStroke } = get();
    if (!currentStroke) return;

    const { leftCtx, rightCtx, scaling } = get();
    let x: number;
    let y: number;
    if (isMouseEvent(e)) {
      x = e.pageX;
      y = e.pageY;
    } else {
      x = e.changedTouches[0].pageX;
      y = e.changedTouches[0].pageY;
    }
    x -= leftCtx?.canvas.offsetLeft ?? 0;
    y -= leftCtx?.canvas.offsetTop ?? 0;

    x = x / scaling;
    y = y / scaling;
    set({
      currentStroke: {
        ...currentStroke,
        points: [...currentStroke.points, { x, y, depth: get().depth }],
      },
    });

    leftCtx?.lineTo(x, y);
    rightCtx?.lineTo(x, y);
    leftCtx?.stroke();
    rightCtx?.stroke();
  },
  handleRelease: () => {
    const { currentStroke, strokes, leftCtx, rightCtx } = get();
    if (currentStroke) {
      set({ strokes: [...strokes, currentStroke], currentStroke: undefined });
    }
  },
  handleCancel: () => {
    get().handleRelease();
  },
  handleClear: () => {},
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

        leftCtx.beginPath();
        rightCtx.beginPath();
        stroke.points.forEach(({ x, y }, index) => {
          if (index === 0) {
            leftCtx.moveTo(x, y);
            rightCtx.moveTo(x, y);
          } else {
            leftCtx.lineTo(x, y);
            rightCtx.lineTo(x, y);
            leftCtx.stroke();
            rightCtx.stroke();
          }
        });
      });
    }
  },
}));
