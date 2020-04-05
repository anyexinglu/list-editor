import { NodeValue } from "./interface";

interface EditorState {
  value: NodeValue[];
}

type ActionType =
  | "INSERT_AFTER_NODE"
  | "UPDATE_NODE_VALUE"
  | "UPDATE_VALUE"
  | "UPDATE_STORE";

interface Action {
  type: ActionType;
  payload: any;
}

const replaceNode = (
  nodes: NodeValue[],
  id: string,
  nodeValue: string
): NodeValue[] => {
  return [...nodes].map((item: NodeValue) => {
    if (item.id === id) {
      return {
        ...item,
        value: nodeValue,
      };
    } else if (item.children) {
      return {
        ...item,
        children: replaceNode(item.children, id, nodeValue),
      };
    }
    return item;
  });
};

const insertAfterNode = (
  nodes: NodeValue[],
  id: string,
  nodeItem: NodeValue,
  layer: number = 0
): NodeValue[] => {
  // TODO 处理浅拷贝问题
  let cloneValue = [...nodes];
  cloneValue.forEach((cloneItem, index) => {
    if (cloneItem.id === id) {
      cloneValue.splice(index + 1, 0, nodeItem);
    } else if (cloneItem.children) {
      cloneValue.splice(index, 1, {
        ...cloneItem,
        children: insertAfterNode(cloneItem.children, id, nodeItem, layer + 1),
      });
    }
  });
  return cloneValue;
  // console.log("...value", value, cloneValue);
  // return cloneValue;
};

export default function reducer(
  state: EditorState,
  action: Action
): EditorState {
  switch (action.type) {
    case "UPDATE_NODE_VALUE": {
      const { id, value: nodeValue } = action.payload;
      let newValue: NodeValue[] = replaceNode(state.value, id, nodeValue);

      return {
        ...state,
        value: newValue,
      };
    }
    case "INSERT_AFTER_NODE": {
      const { id, item } = action.payload;
      let newValue: NodeValue[] = insertAfterNode(state.value, id, item);

      // setValue(value => {
      //   let cloneValue = [...value];
      //   cloneValue.forEach((cloneItem, index) => {
      //     if (cloneItem.id === id) {
      //       cloneValue.splice(index + 1, 0, {
      //         value: "",
      //         id: generateId(),
      //         children: []
      //       });
      //     }
      //   });
      //   console.log("...value", value, cloneValue);
      //   return cloneValue;
      // });

      return {
        ...state,
        value: newValue,
      };
    }
    case "UPDATE_VALUE": {
      const { value } = action.payload;
      return {
        ...state,
        value,
      };
    }
    case "UPDATE_STORE": {
      const payload = action.payload;
      return {
        ...state,
        ...payload,
      };
    }
    default: {
      return state;
    }
  }
}
