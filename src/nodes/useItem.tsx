import React, { useEffect, useRef } from 'react'
import { useBehavior, useEditorContext } from '../context'

export default function useItem(props: any) {
  const itemRef: React.MutableRefObject<HTMLElement | null> = useRef(null)
  const { index } = props
  const { selectedItem } = useEditorContext() || {}

  const behavior = useBehavior()

  useEffect(() => {
    if (behavior) {
      const current = behavior.itemsMap.get(index)
      const mapValue = {
        node: itemRef.current as HTMLElement,
        index
      }
      if (current) {
        behavior.dispatch.unregister(index)
      }
      behavior.dispatch.register(index, mapValue)
    }
    return () => {
      behavior.dispatch.unregister(index)
    }
  }, [behavior, index])

  const getItem = (node: HTMLElement | null) => {
    itemRef.current = node
  }

  /**
   * 判断当前item是否被选中
   */
  const getIsSelected = () => selectedItem && selectedItem.indexOf(index) > -1

  return {
    getItem,
    isSelected: getIsSelected()
  }
}
