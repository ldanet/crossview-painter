import { useEffect } from "react";
import { CANVAS_SIZE, MAX_DEPTH, useStore } from "./store";

const Tools = () => {
  const backgroundColor = useStore((s) => s.backgroundColor);
  const color = useStore((s) => s.color);
  const size = useStore((s) => s.size);
  const opacity = useStore((s) => s.opacity);
  const depth = useStore((s) => s.depth);
  const depthGradient = useStore((s) => s.depthGradient);

  const clear = useStore((s) => s.handleClear);
  const undo = useStore((s) => s.handleUndo);
  const setBackgroundColor = useStore((s) => s.setBackgroundColor);
  const setColor = useStore((s) => s.setColor);
  const setSize = useStore((s) => s.setSize);
  const setOpacity = useStore((s) => s.setOpacity);
  const setDepth = useStore((s) => s.setDepth);
  const setDepthGradient = useStore((s) => s.setDepthGradient);

  useEffect(() => {
    const handleUndo = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "z") {
        undo();
      }
    };
    document.addEventListener("keydown", handleUndo);
    return () => {
      document.removeEventListener("keydown", handleUndo);
    };
  }, [undo]);

  useEffect(() => {
    const handleUndo = (event: any) => {
      if (event.rotation === 0 && event.scale === 1) {
        undo();
      }
    };
    document.addEventListener("gestureend", handleUndo);
    return () => {
      document.removeEventListener("gestureend", handleUndo);
    };
  }, [undo]);

  return (
    <>
      <div className=" space-x-4 my-4">
        <button
          className=" border border-neutral-300 px-4 hover:bg-neutral-600"
          onClick={undo}
        >
          Undo
        </button>
        <button
          className=" border border-neutral-300 px-4 hover:bg-neutral-600"
          onClick={clear}
        >
          Clear
        </button>
      </div>
      <div className=" flex flex-row flex-wrap">
        <div className=" space-y-1">
          <div className="flex align-middle gap-4">
            <label htmlFor="backgroundColorInput">Background color</label>
            <input
              type="color"
              id="backgroundColorInput"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
            />
          </div>
          <div className="flex align-middle gap-4">
            <label htmlFor="colorInput">Brush color</label>
            <input
              type="color"
              id="colorInput"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>
          <div className="flex align-middle gap-4">
            <label htmlFor="sizeInput">Brush size</label>
            <input
              type="range"
              id="sizeInput"
              min="1"
              max="500"
              value={size}
              onChange={(e) => setSize(parseInt(e.target.value, 10))}
            />
            <span>{size}</span>
          </div>
          <div className="flex align-middle gap-4">
            <label htmlFor="opacityInput">Brush opacity</label>
            <input
              type="range"
              id="opacityInput"
              min="0"
              max="1"
              step="any"
              value={opacity}
              onChange={(e) => setOpacity(parseFloat(e.target.value))}
            />
          </div>
        </div>
        <div>
          <div className="flex align-middle gap-4">
            <label htmlFor="depthInput">Depth</label>
            <input
              type="range"
              id="depthInput"
              min={0}
              max={MAX_DEPTH}
              value={depth}
              onChange={(e) => setDepth(parseInt(e.target.value, 10))}
            />
            <span>{Math.round(depth) - MAX_DEPTH / 2}</span>
          </div>
          <div className="flex align-middle gap-4">
            <label htmlFor="gradientInput">Depth gradient</label>
            <input
              type="range"
              id="gradientInput"
              min={-0.5}
              max={0.5}
              step="0.001"
              value={depthGradient}
              onChange={(e) => setDepthGradient(parseFloat(e.target.value))}
            />
            <span>{depthGradient.toFixed(3)}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Tools;
