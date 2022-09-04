export const debounce = <Args extends any[], R>(
  fn: (...args: Args) => R,
  ms = 300
) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: unknown, ...args: Args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};
