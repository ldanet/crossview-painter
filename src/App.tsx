import { useEffect, useRef } from "react";
import { CANVAS_SIZE, useStore } from "./store";
import Tools from "./Tools";

function App() {
  const leftCanvas = useRef<HTMLCanvasElement>(null);
  const rightCanvas = useRef<HTMLCanvasElement>(null);

  const handleInit = useStore((s) => s.handleInit);
  const handlePress = useStore((s) => s.handlePress);
  const handleDrag = useStore((s) => s.handleDrag);
  const handleRelease = useStore((s) => s.handleRelease);
  const handleCancel = useStore((s) => s.handleCancel);

  useEffect(() => {
    if (leftCanvas.current && rightCanvas.current) {
      const leftCtx = leftCanvas.current.getContext("2d");
      const rightCtx = rightCanvas.current.getContext("2d");

      const ratio = CANVAS_SIZE / leftCanvas.current.clientWidth;
      handleInit(leftCtx!, rightCtx!, ratio);
    }
  }, []);

  return (
    <div className="">
      <header className="flex  flex-col items-center justify-center  ">
        <h1 className=" text-xl">Crossview Painter</h1>
      </header>
      <main>
        <div>
          <h2 className="">Tools</h2>
          <Tools />
        </div>
        <div>
          <h2>Canvas</h2>
          <div className="flex flex-nowrap flex-row">
            <canvas
              className="border border-neutral-300 flex-grow flex-shrink-0 aspect-square cursor-crosshair touch-none w-1/2"
              width={CANVAS_SIZE}
              height={CANVAS_SIZE}
              onMouseDown={handlePress}
              onTouchStart={handlePress}
              onMouseMove={handleDrag}
              onTouchMove={handleDrag}
              onMouseUp={handleRelease}
              onTouchEnd={handleRelease}
              onMouseOut={handleCancel}
              onTouchCancel={handleCancel}
              ref={leftCanvas}
            />
            <canvas
              className="border border-neutral-300 flex-grow flex-shrink-0 aspect-square touch-none w-1/2"
              width={CANVAS_SIZE}
              height={CANVAS_SIZE}
              onMouseDown={handlePress}
              onTouchStart={handlePress}
              onMouseMove={handleDrag}
              onTouchMove={handleDrag}
              onMouseUp={handleRelease}
              onTouchEnd={handleRelease}
              onMouseOut={handleCancel}
              onTouchCancel={handleCancel}
              ref={rightCanvas}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
