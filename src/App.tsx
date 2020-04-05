import React, { useState, useEffect, useReducer } from "react";
import reducer from "./reducer";
import useContainer from './nodes/useContainer';
import NodeList from './nodes/NodeList';
import { NodeValue } from "./interface";
import { generateId, addId, setCaretPosition } from "./utils";

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
          spellCheck="false"
          autoCapitalize="off"
          contentEditable
          id={`content-${id}`}
          onInput={e => {
            console.log("...onInput e", e.target, (e.target as any).innerHTML);
            // setIsEditing(true);
          }}
          onCopy={e => {
            console.log("oncopy", e);
          }}
          onPaste={e => {
            let paste = (
              e.clipboardData || (window as any).clipboardData
            ).getData("text");
            paste = paste.toUpperCase();
            console.log("onpaste", e, paste);

            const selection = window.getSelection() as any;
            if (!selection.rangeCount) return false;
            selection.deleteFromDocument();
            selection.getRangeAt(0).insertNode(document.createTextNode(paste));

            e.preventDefault();
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
            if (e.key === EVENT_KEY.ENTER) {
              e.preventDefault();
              const newId = generateId();
              dispatch({
                type: "INSERT_AFTER_NODE",
                payload: {
                  id,
                  item: {
                    value: "",
                    id: newId,
                    children: []
                  }
                }
              });
              // TODO，改成active的store
              setTimeout(() => {
                let contentCtrl = document.getElementById(`content-${newId}`);
                setCaretPosition(contentCtrl, 0);
              }, 0);
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
    value: '我是父节点',
    children: [
      {
        value: '这是子节点的内容'
      }
    ]
  }
])

function App() {
  const indexRef = useRef(0)
  indexRef.current = 0
  const [state, dispatch] = useReducer(reducer, {
    value: defaultValue
  })
  const value = state.value

  const { EditorProvider, context } = useContainer({value})

  return (
    <EditorProvider value={context}>
      {/* <Test /> */}
      <div className="App node-tree">
        {value.map(item => {
          return (
            <NodeList item={item} dispatch={dispatch} indexRef={indexRef} />
          )
        })}
      </div>
    </EditorProvider>
  )
}

export default App
