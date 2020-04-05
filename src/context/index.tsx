import React, { createContext, useRef, useContext } from 'react'
import { EditorContext } from './interface'

export const context = createContext<EditorContext | undefined>(undefined)

export const EditorProvider = ({ children, value }: any) => (
  <context.Provider value={value}>{children}</context.Provider>
)

export function useBehavior(): EditorContext {
  const behavior = useRef(useContext(context))
  return behavior.current as any
}

export const useEditorContext = () => useContext(context)