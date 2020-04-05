import * as React from 'react'
import { EVENTS } from '../constants'

const { useRef, useEffect } = React

export interface Events {
  [name: string]: string[]
}

export interface HandleEvents {
  [name: string]: (...rest: any[]) => void
}

export default function useEventListener(
  handleEvents: HandleEvents,
  getElement: () => null | HTMLElement | (Window & typeof globalThis)
) {
  const saveHandlerRef = useRef<any>()
  const element = getElement()

  useEffect(() => {
    saveHandlerRef.current = handleEvents
  }, [handleEvents])

  const keys = Object.keys(handleEvents).join(',')

  useEffect(() => {
    const element = getElement()
    if (!element || !element.addEventListener) return

    const handleKeys = keys.split(',')
    handleKeys.forEach(key => {
      EVENTS[key].forEach(eventName => {
        element.addEventListener(eventName, saveHandlerRef.current[key])
      })
    })

    return () => {
      handleKeys.forEach(key => {
        EVENTS[key].forEach(eventName => {
          element.removeEventListener(eventName, saveHandlerRef.current[key])
        })
      })
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [element, keys])
}
