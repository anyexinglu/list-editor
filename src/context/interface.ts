export interface EditorContext {
  /**
   * 存储每一个 item 的信息
   */
  itemsMap: Map<number, MapValue>
  /**
   * dispatch
   */
  dispatch: Dispatch

  /**
   * 选中元素(跨行选中)
   */
  selectedItem: number[]
}

export interface Dispatch {
  register: (key: number, value: MapValue) => void
  unregister: (key: number) => void
  clear: () => void
}

export interface MapValue {
  // 具体节点信息
  node: HTMLElement
  // index 当前的下标
  index: number
}
