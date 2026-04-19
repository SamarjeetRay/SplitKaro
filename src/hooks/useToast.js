// ─── TOAST HOOK ───────────────────────────────────────────────────
// [L62] useState — stores current toast message (null = hidden)
// [L75] useCallback — memoizes showToast so it doesn't recreate on re-render
// [L55] Event Loop — setTimeout defers the dismiss to the macro-task queue
//
// Custom hooks: extract reusable stateful logic OUT of components.
// Naming convention: always starts with "use" — required by React.

import { useState, useCallback } from 'react'  // [L61] named imports

export function useToast(duration = 2500) {  // [L47] default parameter
  const [msg, setMsg] = useState(null)   // [L62] useState with null initial value

  // [L75] useCallback — stable reference, avoids unnecessary re-renders
  // without this, showToast would be a NEW function on every render
  const showToast = useCallback((message) => {
    setMsg(message)
    // [L55] setTimeout — macro-task queue, runs after current call stack clears
    setTimeout(() => setMsg(null), duration)
  }, [duration])   // [L68] dependency: only recreate if duration changes

  return [msg, showToast]  // [L44] returning array (like useState) — destructurable
}
