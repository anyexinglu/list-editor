import { NodeValue } from '../interface'

export interface NodeListProps {
  item: NodeValue
  indexRef: React.MutableRefObject<number>
  dispatch: React.Dispatch<any>
}

export interface ContainerProps {
  value: NodeValue[]
}
