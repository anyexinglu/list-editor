import React from "react";
import { generateId } from "./utils";
import "./App.css";

function renderList(item: any) {
  const children = item.children || [];
  const id = generateId();

  return (
    <div className="node" id={id} key={id}>
      <div className="content-wrapper">
        <div className="bullet">
          <div className="dot" />
        </div>
        <div className="content" contentEditable>
          {item.text}
        </div>
      </div>
      {children.length ? (
        <div className="children">
          {(children || []).map((child: any) => renderList(child))}
        </div>
      ) : null}
    </div>
  );
}

const value = [
  {
    text: "我是父节点",
    children: [
      {
        text: "这是子节点的内容"
      }
    ]
  }
];

function App() {
  return (
    <div className="App node-tree">
      {value.map(item => {
        return renderList(item);
      })}
    </div>
  );
}

export default App;
