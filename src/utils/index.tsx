export const generateId = (() => {
  let i = 1;
  return () => {
    i++;
    return String(i);
  };
})();
