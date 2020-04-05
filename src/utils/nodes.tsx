import * as React from 'react'
import { MapValue } from '../context/interface'

const { useRef } = React

type ObjArr = {
  [key: string]: any
}[]

interface Obj {
  [key: string]: any
}

interface GetPositionResult {
  // 横向坐标
  x: number
  // 纵向坐标
  y: number
}

/**
 * path计算
 * @param path 当前标签
 * @param count 向前或者向后移动的位数
 * @param level 哪个层级要移动（默认末位）
 */
export const calculatePath = (path: string, count: number, level?: number) => {
  const pathArr = path.split('-')
  level = level !== undefined ? level : pathArr.length - 1
  const target = pathArr.splice(level, 1)[0]
  const newVal = target ? `${Number(target) + count}` : '0'
  pathArr.splice(level, 0, newVal)
  return pathArr.join('-')
}

/**
 * 获取点击的 item
 * @param event
 * @param map
 */
export function getItem(
  event: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>,
  map: Map<number, MapValue>
): null | MapValue {
  const target = event.target
  let result = null

  let node = target
  while (node && !result) {
    // eslint-disable-next-line no-loop-func
    map.forEach(m => {
      if (m.node === node) {
        result = m
      }
    })
    node = (node as any).parentNode
  }
  return result
}

/**
 * 获取滚动条高度
 */
function getScrollTop() {
  let scrollTop = 0
  let scrollLeft = 0
  if (document.documentElement && document.documentElement.scrollTop) {
    scrollTop = document.documentElement.scrollTop
    scrollLeft = document.documentElement.scrollLeft
  } else if (document.body) {
    scrollTop = document.body.scrollTop
    scrollLeft = document.body.scrollLeft
  }
  return { scrollTop, scrollLeft }
}

/**
 * 获取鼠标或手指的位置
 * @param event
 */
export function getPosition(
  event: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>
): GetPositionResult {
  const touchEvent = event as React.TouchEvent<HTMLElement>
  const mouseEvent = event as React.MouseEvent<HTMLElement>

  const { scrollTop, scrollLeft } = getScrollTop()

  if (touchEvent.touches && touchEvent.touches.length) {
    return {
      x: touchEvent.touches[0].pageX - scrollLeft,
      y: touchEvent.touches[0].pageY - scrollTop
    }
  } else if (touchEvent.changedTouches && touchEvent.changedTouches.length) {
    return {
      x: touchEvent.changedTouches[0].pageX - scrollLeft,
      y: touchEvent.changedTouches[0].pageY - scrollTop
    }
  } else {
    return {
      x: mouseEvent.pageX - scrollLeft,
      y: mouseEvent.pageY - scrollTop
    }
  }
}

/**
 * 递归遍历数据
 * @param dataSource 源数据
 * @param orderRef 当前序号
 * @param acc 用于存储结果
 * @param path 当前结构路径
 * @param parentChildrenIndices 子代
 */
function recursionDataSource(
  dataSource: {
    [key: string]: any
  }[],
  indexRef: React.MutableRefObject<number>,
  acc = {},
  path?: string,
  parentChildrenIndices?: number[]
) {
  let currentPath = path ? `${path}-` : ''
  return dataSource.reduce((acc, data) => {
    parentChildrenIndices && parentChildrenIndices.push(indexRef.current)
    currentPath = calculatePath(currentPath, 1)
    const childrenIndices = data.children && []
    acc[indexRef.current] = childrenIndices
      ? { value: data.value, path: currentPath, childrenIndices }
      : { value: data.value, path: currentPath }
    indexRef.current++
    // 如果存在子节点，递归遍历各层级关系
    childrenIndices &&
      recursionDataSource(
        data.children,
        indexRef,
        acc,
        currentPath,
        childrenIndices
      )
    return acc
  }, acc)
}

/**
 * 将原始数据转成内部格式
 * @param dataSource 原始数据
 */
export function useIndexMap(dataSource: any) {
  const indexMap = useRef<{ [key: string]: any }>({})
  const indexRef = useRef<number>(0)

  indexRef.current = 0
  indexMap.current = recursionDataSource(dataSource, indexRef)

  return indexMap
}

export const getItemRect = (mapValue: MapValue | null | undefined) => {
  return (mapValue && mapValue.node.getBoundingClientRect()) || null
}
