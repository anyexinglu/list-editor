import { NodeValue } from "../interface";

export { setCaretPosition } from "./Cursor";

export const generateId = (() => {
  let i = 0;
  return () => {
    i++;
    return String(i);
  };
})();

export const addId = (nodes: NodeValue[]) => {
  return nodes.map(item => {
    let result = {
      ...item
    };
    if (!("id" in item)) {
      result.id = generateId();
    }
    if (result.children) {
      result.children = addId(result.children);
    }

    return result;
  });
};
