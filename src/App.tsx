import { useCallback, useEffect, useRef } from "react";
import { CANVAS_SIZE, useStore } from "./store";
import Tools from "./Tools";
import { debounce } from "./utils";

function App() {
  const leftCanvas = useRef<HTMLCanvasElement>(null);
  const rightCanvas = useRef<HTMLCanvasElement>(null);

  const backgroundColor = useStore((s) => s.backgroundColor);

  const handleInit = useStore((s) => s.handleInit);
  const handlePress = useStore((s) => s.handlePress);
  const handleDrag = useStore((s) => s.handleDrag);
  const handleRelease = useStore((s) => s.handleRelease);
  const handleCancel = useStore((s) => s.handleCancel);

  const handleResize = useCallback(() => {
    if (leftCanvas.current && rightCanvas.current) {
      leftCanvas.current.width =
        leftCanvas.current.clientWidth * window.devicePixelRatio;
      leftCanvas.current.height =
        leftCanvas.current.clientHeight * window.devicePixelRatio;

      rightCanvas.current.width =
        rightCanvas.current.clientWidth * window.devicePixelRatio;
      rightCanvas.current.height =
        rightCanvas.current.clientHeight * window.devicePixelRatio;

      const leftCtx = leftCanvas.current.getContext("2d");
      const rightCtx = rightCanvas.current.getContext("2d");

      const ratio = leftCanvas.current.width / CANVAS_SIZE;
      handleInit(leftCtx!, rightCtx!, ratio);
    }
  }, [handleInit]);

  useEffect(() => {
    handleResize();
    const resizeObserver = new ResizeObserver(
      debounce(() => {
        handleResize();
      })
    );
    resizeObserver.observe(leftCanvas.current!);
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className="p-8">
      <header className="flex  flex-col items-center justify-center  ">
        <h1 className=" text-xl">Crossview Painter</h1>
      </header>
      <main>
        <div>
          <h2>Canvas</h2>
          <div className="flex flex-nowrap flex-row  space-x-2">
            <canvas
              className="border border-neutral-300 flex-grow flex-shrink-0 aspect-square cursor-crosshair touch-none select-none w-1/2"
              style={{ backgroundColor }}
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
              className="border border-neutral-300 flex-grow flex-shrink-0 aspect-square w-1/2"
              style={{ backgroundColor }}
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
          <div className=" text-left">
            <Tools />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
