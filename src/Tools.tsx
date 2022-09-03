import { useStore } from "./store";

const Tools = () => {
  const clear = useStore((s) => s.handleClear);
  const undo = useStore((s) => s.handleUndo);
  return (
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
    </div>
  );
};

export default Tools;
