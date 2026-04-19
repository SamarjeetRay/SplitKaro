// ─── APP CONTEXT ──────────────────────────────────────────────────
// [L69] useContext Hook — createContext + useContext pattern
// [L68] useEffect Hook — side effect for persisting state
// [L47] Classes & Default Parameters — createContext(null) default
//
// Global state provider using React Context + useReducer.
// This replaces Redux for this project size — same pattern, no extra lib.
// Every component can access state/dispatch via useAppContext().

import React, { createContext, useContext, useReducer, useEffect } from 'react'  // [L61] React imports
import { groupReducer, loadPersistedState, persistState } from './groupReducer'

// [L69] createContext — creates a context object with null default
const AppContext = createContext(null)

// [L69] Context Provider — wraps entire app to share state globally
export function AppProvider({ children }) {
  // [L72] useReducer — like Redux but built into React, no extra lib needed
  const [state, dispatch] = useReducer(groupReducer, null, loadPersistedState)

  // [L68] useEffect — runs after every render when state changes
  // Persists data to localStorage so it survives page refreshes
  useEffect(() => {
    persistState(state)
  }, [state])   // [L68] dependency array — only re-run if state changes

  return (
    // [L69] Provider — injects value prop accessible to ALL children
    <AppContext.Provider value={{ state, dispatch }}>
      {children}   {/* [L64] children prop pattern */}
    </AppContext.Provider>
  )
}

// [L69] Custom hook — clean encapsulation of useContext
// Throwing an error here gives a clear developer experience
export function useAppContext() {
  const ctx = useContext(AppContext)   // [L69] useContext consumes the context
  if (!ctx) throw new Error('useAppContext must be used within AppProvider')
  return ctx
}

// [L74] useMemo pattern (used at call sites) — derived selector
export function useActiveGroup() {
  const { state } = useAppContext()
  return state.groups.find(g => g.id === state.activeGroupId) ?? null  // [L41] nullish coalescing
}

// ─── THEME CONTEXT ────────────────────────────────────────────────
// [L62] useState — simple boolean state for light/dark toggle
// [L68] useEffect — syncs theme class to <html> element (DOM side effect)
const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [dark, setDark] = React.useState(() => {  // [L62] lazy initializer function
    // [L57] localStorage access — read saved preference
    const saved = localStorage.getItem('splitkaro_theme')
    if (saved) return saved === 'dark'
    // [L55] Event Loop / browser API — matchMedia
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  // [L68] useEffect — DOM side effect, not pure React
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
    localStorage.setItem('splitkaro_theme', dark ? 'dark' : 'light')
  }, [dark])

  const toggle = () => setDark(d => !d)   // [L62] functional update pattern

  return (
    <ThemeContext.Provider value={{ dark, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

// [L69] Custom hook for theme
export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
