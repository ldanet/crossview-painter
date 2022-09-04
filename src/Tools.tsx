import { useEffect } from "react";
import { MAX_DEPTH, useStore } from "./store";

const Tools = () => {
  const backgroundColor = useStore((s) => s.backgroundColor);
  const color = useStore((s) => s.color);
  const size = useStore((s) => s.size);
  const opacity = useStore((s) => s.opacity);
  const depth = useStore((s) => s.depth);

  const clear = useStore((s) => s.handleClear);
  const undo = useStore((s) => s.handleUndo);
  const setBackgroundColor = useStore((s) => s.setBackgroundColor);
  const setColor = useStore((s) => s.setColor);
  const setSize = useStore((s) => s.setSize);
  const setOpacity = useStore((s) => s.setOpacity);
  const setDepth = useStore((s) => s.setDepth);

  useEffect(() => {
    const handleUndo = (event: KeyboardEvent) => {
      console.log("event: ", event);
      if ((event.ctrlKey || event.metaKey) && event.key === "z") {
        undo();
      }
    };
    document.addEventListener("keydown", handleUndo);
    return () => {
      document.removeEventListener("keydown", handleUndo);
    };
  }, [undo]);

  return (
    <>
      <h2 className="">Tools</h2>
      <div className=" space-x-4">
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
        <label htmlFor="backgroundColorInput">Background color</label>
        <input
          type="color"
          id="backgroundColorInput"
          value={backgroundColor}
          onChange={(e) => setBackgroundColor(e.target.value)}
        />
        <label htmlFor="colorInput">Brush color</label>
        <input
          type="color"
          id="colorInput"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
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
        <label htmlFor="depthInput">Depth</label>
        <input
          type="range"
          id="depthInput"
          min={0}
          max={MAX_DEPTH}
          value={depth}
          onChange={(e) => setDepth(parseInt(e.target.value, 10))}
        />
        <span>{depth}</span>
      </div>
    </>
  );
};

export default Tools;
