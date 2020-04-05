import React, { useState, useRef } from 'react'
import { EditorProvider } from '../context'
import useMap from '../hooks/useMap'
import useEventListener from '../hooks/useEventListener'
import { getItem, getPosition, useIndexMap, getItemRect } from '../utils/nodes'
import { addListener, removeListener } from '../utils/eventLIstener'
import { ContainerProps } from './interface'
import { MapValue } from '../context/interface'

export default function useContainer(props: ContainerProps) {
  const { value } = props
  const { itemsMap, dispatch } = useMap()
  const [selectedItem, setSelectedItem] = useState<number[]>([]) // 为了跨行选中 存储目前选中的元素
  const dragItemRef = useRef<MapValue | null>(null)
  const mouseDownPositionRef = useRef({ x: 0, y: 0 })

  const indexMap = useIndexMap(value)

  const handleDown = (
    event: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>
  ) => {
    const dragItem = getItem(event, itemsMap)
    // 点击的时候初始化选中状态
    setSelectedItem([])
    if (dragItem) {
      const position = getPosition(event)
      dragItemRef.current = dragItem
      mouseDownPositionRef.current = position
      addListener(
        {
          move: handleMove
        },
        () => (typeof window !== 'undefined' ? window : null)
      )
    }
  }

  const handleMove = (
    event: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>
  ) => {
    const dragItem = dragItemRef.current
    const dragItemRect = getItemRect(dragItem)
    const selected = []

    if (!dragItem || !dragItemRect) {
      return
    }

    const newPosition = getPosition(event)

    // 鼠标是否移出选中元素
    if (
      newPosition.y > dragItemRect.bottom ||
      newPosition.y < dragItemRect.top
    ) {
      selected.push(dragItem.index)
    }

    itemsMap.forEach(targetItem => {
      const targetItemRect = getItemRect(targetItem)
      if (targetItemRect && targetItem.index !== dragItem.index) {
        const targetItemMiddle =
          (targetItemRect.top + targetItemRect.bottom) / 2
        // 鼠标是否移入目标元素
        if (
          (targetItemMiddle > mouseDownPositionRef.current.y &&
            targetItemMiddle < newPosition.y) ||
          (targetItemMiddle < mouseDownPositionRef.current.y &&
            targetItemMiddle > newPosition.y)
        ) {
          selected.push(targetItem.index)
        }
      }
    })
    setSelectedItem(selected)
  }

  const handleEnd = () => {
    dragItemRef.current = null
    indexMap.current = {}
    removeListener({ move: handleMove }, () =>
      typeof window !== 'undefined' ? window : null
    )
  }

  useEventListener(
    {
      down: handleDown
    },
    () => (typeof window !== 'undefined' ? window : null)
  )

  useEventListener({ end: handleEnd }, () =>
    typeof window !== 'undefined' ? window : null
  )

  return {
    EditorProvider,
    context: { itemsMap, dispatch, selectedItem }
  }
}
