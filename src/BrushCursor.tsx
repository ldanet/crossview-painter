import { CANVAS_SIZE, getOffset, useStore } from "./store";

type BrushCursorProps = { side: "left" | "right" };
const BrushCursor = ({ side }: BrushCursorProps) => {
  const cursorX = useStore((s) => s.cursorX);
  const y = useStore((s) => s.cursorY);
  const depth = useStore((s) => s.depth);
  const size = useStore((s) => s.size);

  const x = cursorX + (side === "right" ? getOffset(depth) : 0);
  return (
    <svg
      className="h-full w-full pointer-events-none absolute top-0 left-0"
      viewBox={`0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}`}
    >
      <circle
        className=" stroke-[6] stroke-white fill-transparent"
        cx={x}
        cy={y}
        r={size / 2}
      />
      <circle
        className=" stroke-[3] stroke-black  fill-transparent"
        cx={x}
        cy={y}
        r={size / 2}
      />
    </svg>
  );
};

export default BrushCursor;
