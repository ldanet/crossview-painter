import create from "zustand";
import { devtools, persist } from "zustand/middleware";
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
  const boundingRect = canvas.getBoundingClientRect();
  x -= boundingRect.left + window.scrollX + 1;
  y -= boundingRect.top + window.scrollY + 1;

  x = (x * window.devicePixelRatio) / scaling;
  y = (y * window.devicePixelRatio) / scaling;
  return { x, y };
};

export const getOffset = (depth: number) => MAX_DEPTH / 2 - depth;

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

export const useStore = create<Store>()(
  devtools(
    persist((set, get) => ({
      strokes: [],

      cursorX: 0,
      cursorY: 0,

      backgroundColor: "#ffffff",
      color: "#000000",
      opacity: 1,
      size: 10,
      depth: MAX_DEPTH / 2,
      depthGradientEnabled: false,
      depthGradient: 0,

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
      toggleDepthGradient: () => {
        set({ depthGradientEnabled: !get().depthGradientEnabled });
      },
      setDepthGradient: (depthGradient) => {
        set({ depthGradient });
      },

      handleInit: (leftCtx, rightCtx, scaling) => {
        leftCtx.lineCap = "round";
        leftCtx.lineJoin = "round";
        leftCtx.scale(scaling, scaling);
        rightCtx.lineCap = "round";
        rightCtx.lineJoin = "round";
        rightCtx.scale(scaling, scaling);

        set({ leftCtx, rightCtx, scaling });
        get().redraw();
      },
      handlePress: (e) => {
        const { leftCtx, rightCtx, scaling } = get();

        if (leftCtx && rightCtx) {
          const { x, y } = eventToPoint(e, leftCtx!.canvas, scaling);
          // not drawing on canvas, ignore
          if (x > CANVAS_SIZE || y > CANVAS_SIZE) return;
          const newPoint = { x, y, depth: get().depth };
          set({
            currentStroke: {
              size: get().size,
              color: get().color,
              opacity: get().opacity,
              startingDepth: get().depth,
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
      handleMove: (e) => {
        const { currentStroke, leftCtx, rightCtx, scaling, depthGradient } =
          get();

        const { x, y } = eventToPoint(e, leftCtx!.canvas, scaling);

        set({ cursorX: x, cursorY: y });

        if (!currentStroke) return;

        if (leftCtx && rightCtx) {
          let depth = get().depth;
          let length = currentStroke.length;

          if (depthGradient) {
            const prevPoint =
              currentStroke.points[currentStroke.points.length - 1];
            const deltaX = Math.abs(x - prevPoint.x);
            const deltaY = Math.abs(x - prevPoint.x);

            const length =
              (currentStroke.length ?? 0) +
              Math.sqrt((deltaX ^ 2) + (deltaY ^ 2));
            depth = Math.min(
              Math.max(length * depthGradient + depth, 0),
              MAX_DEPTH
            );
          }

          const newPoint = { x, y, depth: depth };

          set({
            currentStroke: {
              ...currentStroke,
              length,
              points: [...currentStroke.points, newPoint],
            },
            depth,
          });

          lineTo(newPoint, leftCtx, rightCtx);

          leftCtx.stroke();
          rightCtx.stroke();
        }
      },
      handleRelease: () => {
        const { currentStroke, strokes } = get();
        if (currentStroke) {
          const { length, startingDepth, ...stroke } = currentStroke;
          set({
            strokes: [...strokes, stroke],
            currentStroke: undefined,
            depth: startingDepth,
          });
        }
        get().redraw();
      },
      handleCancel: () => {
        get().handleRelease();
      },
      handleClear: () => {
        if (get().strokes.length > 0) {
          set({
            strokes: [],
            currentStroke: undefined,
            clearedStrokes: get().strokes,
          });
          get().redraw();
        }
      },
      handleUndo: () => {
        const strokes = [...get().strokes];
        if (strokes.length > 0) {
          strokes.pop();
          set({ strokes, currentStroke: undefined });
        } else if (get().clearedStrokes) {
          set({
            strokes: get().clearedStrokes,
            currentStroke: undefined,
            clearedStrokes: undefined,
          });
        }
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
    }))
  )
);
