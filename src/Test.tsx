import React from "react";

const { useState, useEffect } = React;

export default function Test() {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState("这是一段文字");
  useEffect(() => {
    let timer = setTimeout(() => {
      setValue("撒的方式度过的时光");
    }, 3000);
    return () => {
      clearTimeout(timer);
    };
  }, []);
  return (
    <div
      contentEditable
      onInput={e => {
        console.log("...onInput e", e.target, (e.target as any).innerHTML);
        setIsEditing(true);
      }}
      onBlur={e => {
        console.log("...onBlur e", e.target, (e.target as any).innerHTML);
        setValue((e.target as any).innerHTML);
        setIsEditing(false);
      }}
      dangerouslySetInnerHTML={{ __html: value }}
    ></div>
  );
}
