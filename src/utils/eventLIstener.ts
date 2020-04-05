import { EVENTS } from '../constants'

export interface HandleEvents {
  [name: string]: (...rest: any[]) => void
}

export const addListener = (
  handleEvents: HandleEvents,
  getElement: () => null | HTMLElement | (Window & typeof globalThis)
) => {
  const keys = Object.keys(handleEvents).join(',')
  const element = getElement()
  if (!element || !element.addEventListener) return

  const handleKeys = keys.split(',')
  handleKeys.forEach(key => {
    EVENTS[key].forEach(eventName => {
      element.addEventListener(eventName, handleEvents[key])
    })
  })
}

export const removeListener = (
  handleEvents: HandleEvents,
  getElement: () => null | HTMLElement | (Window & typeof globalThis)
) => {
  const keys = Object.keys(handleEvents).join(',')
  const element = getElement()
  if (!element || !element.removeEventListener) return

  const handleKeys = keys.split(',')
  handleKeys.forEach(key => {
    EVENTS[key].forEach(eventName => {
      element.removeEventListener(eventName, handleEvents[key])
    })
  })
}
