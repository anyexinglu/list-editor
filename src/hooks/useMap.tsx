import { useRef, useMemo } from 'react'
import { EditorContext, MapValue } from '../context/interface'

export default function useMap(): Pick<EditorContext, 'dispatch' | 'itemsMap'> {
  const mapRef = useRef<Map<number, MapValue>>(new Map())

  const register = (key: number, value: MapValue) => {
    mapRef.current.set(key, value)
  }

  const unregister = (key: number) => {
    const value = mapRef.current.get(key)
    if (value) mapRef.current.delete(key)
  }

  const clear = () => {
    mapRef.current.clear()
  }
  const dispatch = useMemo(() => {
    return { register, unregister, clear }
  }, [])

  return { itemsMap: mapRef.current, dispatch }
}
