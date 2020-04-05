import React from 'react'
import { EVENT_KEY } from '../constants'
import { generateId, setCaretPosition } from '../utils'
import useItem from './useItem'
import { NodeListProps } from './interface'
import { NodeValue } from '../interface'

export default function NodeList(props: NodeListProps) {
  const { item, indexRef, dispatch } = props
  const children = item.children || []
  const id = item.id
  const { getItem, isSelected } = useItem({ index: indexRef.current++ })

  return (
    <div className={isSelected ? "node selected" : "node"} id={id} key={id}>
      <div className="content-wrapper" ref={getItem}>
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
            console.log('...onInput e', e.target, (e.target as any).innerHTML)
            // setIsEditing(true);
          }}
          onCopy={e => {
            console.log('oncopy', e)
          }}
          onPaste={e => {
            let paste = (
              e.clipboardData || (window as any).clipboardData
            ).getData('text')
            paste = paste.toUpperCase()
            console.log('onpaste', e, paste)

            const selection = window.getSelection() as any
            if (!selection.rangeCount) return false
            selection.deleteFromDocument()
            selection.getRangeAt(0).insertNode(document.createTextNode(paste))

            e.preventDefault()
          }}
          onBlur={e => {
            console.log('...onBlur e', e.target, (e.target as any).innerHTML)
            dispatch({
              type: 'UPDATE_NODE_VALUE',
              payload: {
                id,
                value: (e.target as any).innerHTML
              }
            })
            // setIsEditing(false);
          }}
          dangerouslySetInnerHTML={{ __html: item.value }}
          onKeyDown={e => {
            if (e.key === EVENT_KEY.ENTER) {
              e.preventDefault()
              const newId = generateId()
              dispatch({
                type: 'INSERT_AFTER_NODE',
                payload: {
                  id,
                  item: {
                    value: '',
                    id: newId,
                    children: []
                  }
                }
              })
              // TODO，改成active的store
              setTimeout(() => {
                let contentCtrl = document.getElementById(`content-${newId}`)
                setCaretPosition(contentCtrl, 0)
              }, 0)
            }
          }}
        ></div>
      </div>
      {children.length ? (
        <div className="children">
          {(children || []).map((child: NodeValue, index: number) => (
            <NodeList
              key={index}
              item={child}
              dispatch={dispatch}
              indexRef={indexRef}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
