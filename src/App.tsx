import React, { useReducer, useRef } from 'react'
import reducer from './reducer'
import useContainer from './nodes/useContainer'
import NodeList from './nodes/NodeList'
import { NodeValue } from './interface'
import { addId } from './utils'

import './App.css'

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
