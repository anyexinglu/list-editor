import { Events } from '../hooks/useEventListener'

export const EVENT_KEY = {
  ENTER: 'Enter',
  BACKSPACE: 'Backspace'
}

/**
 * 兼容移动端和 pc 端
 */
export const EVENTS: Events = {
  end: ['touchend', 'touchcancel', 'mouseup'],
  down: ['touchstart', 'mousedown'],
  move: ['touchmove', 'mousemove'],
  keydown: ['', 'keydown']
}
