import React, { useState, useEffect, useReducer } from "react";
import reducer from "./reducer";
import { NodeValue } from "./interface";
import { generateId, addId } from "./utils";
import "./App.css";

const EVENT_KEY = {
  ENTER: "Enter",
  BACKSPACE: "Backspace"
};

function NodeList({
  item,
  dispatch
}: {
  item: NodeValue;
  dispatch: React.Dispatch<any>;
}) {
  const children = item.children || [];
  const id = item.id;

  return (
    <div className="node" id={id} key={id}>
      <div className="content-wrapper">
        <div className="bullet">
          <div className="dot" />
        </div>
        <div
          className="content"
          contentEditable
          onInput={e => {
            console.log("...onInput e", e.target, (e.target as any).innerHTML);
            // setIsEditing(true);
          }}
          onBlur={e => {
            console.log("...onBlur e", e.target, (e.target as any).innerHTML);
            dispatch({
              type: "UPDATE_NODE_VALUE",
              payload: {
                id,
                value: (e.target as any).innerHTML
              }
            });
            // setIsEditing(false);
          }}
          dangerouslySetInnerHTML={{ __html: item.value }}
          onKeyDown={e => {
            console.log("...e", e, e.key);
            if (e.key === EVENT_KEY.ENTER) {
              debugger;
              e.preventDefault();

              dispatch({
                type: "INSERT_AFTER_NODE",
                payload: {
                  id,
                  item: {
                    value: "",
                    id: generateId(),
                    children: []
                  }
                }
              });
            }
          }}
        ></div>
      </div>
      {children.length ? (
        <div className="children">
          {(children || []).map((child: NodeValue, index: number) => (
            <NodeList key={index} item={child} dispatch={dispatch} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

const defaultValue: NodeValue[] = addId([
  {
    value: "我是父节点",
    children: [
      {
        value: "这是子节点的内容"
      }
    ]
  }
]);

function App() {
  const [state, dispatch] = useReducer(reducer, {
    value: defaultValue
  });
  const value = state.value;
  return (
    <div>
      {/* <Test /> */}
      <div className="App node-tree">
        {value.map(item => {
          return <NodeList item={item} dispatch={dispatch} />;
        })}
      </div>
    </div>
  );
}

export default App;
