import { useRef, useState } from "react";
import { CANVAS_SIZE, getOffset, useStore } from "./store";

const Renderer = () => {
  const resultCanvas = useRef<HTMLCanvasElement>(null);
  const renderCanvas = useRef<HTMLCanvasElement>(null);
  const [hasRender, setHasRender] = useState(false);

  const handleRender = () => {
    const canvasCtx = renderCanvas.current?.getContext("2d");
    const resultCtx = resultCanvas.current?.getContext("2d");
    if (renderCanvas.current && canvasCtx && resultCtx) {
      const { strokes, backgroundColor } = useStore.getState();
      canvasCtx.fillStyle = backgroundColor;
      canvasCtx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      canvasCtx.fillStyle = "transparent";

      canvasCtx.lineCap = "round";
      canvasCtx.lineJoin = "round";

      strokes.forEach((stroke) => {
        canvasCtx.strokeStyle = stroke.color;
        canvasCtx.lineWidth = stroke.size;
        canvasCtx.globalAlpha = stroke.opacity;

        canvasCtx.beginPath();
        stroke.points.forEach(({ x, y }, index) => {
          if (index === 0) {
            canvasCtx.moveTo(x, y);
          }
          if (index !== 0 || stroke.points.length === 1) {
            canvasCtx.lineTo(x, y);
          }
        });
        canvasCtx.stroke();
      });

      resultCtx.drawImage(renderCanvas.current, 0, 0);

      canvasCtx.fillStyle = backgroundColor;
      canvasCtx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      canvasCtx.fillStyle = "transparent";

      strokes.forEach((stroke) => {
        canvasCtx.strokeStyle = stroke.color;
        canvasCtx.lineWidth = stroke.size;
        canvasCtx.globalAlpha = stroke.opacity;
        canvasCtx.beginPath();
        stroke.points.forEach(({ x, y, depth }, index) => {
          if (index === 0) {
            canvasCtx.moveTo(x + getOffset(depth), y);
          }
          if (index !== 0 || stroke.points.length === 1) {
            canvasCtx.lineTo(x + getOffset(depth), y);
          }
        });
        canvasCtx.stroke();
      });

      resultCtx.drawImage(renderCanvas.current, CANVAS_SIZE, 0);
      setHasRender(true);
    }
  };
  return (
    <>
      <button
        className=" border border-neutral-300 px-4 hover:bg-neutral-600 my-4"
        onClick={handleRender}
      >
        Render
      </button>
      <div className={hasRender ? "flex" : "hidden"}>
        <canvas
          className="w-full"
          ref={resultCanvas}
          width={CANVAS_SIZE * 2}
          height={CANVAS_SIZE}
        />
      </div>
      <canvas
        className="hidden"
        ref={renderCanvas}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
      />
    </>
  );
};

export default Renderer;
