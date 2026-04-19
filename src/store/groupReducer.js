// ─── GROUP REDUCER ────────────────────────────────────────────────
// [L72] Redux Toolkit pattern — useReducer manages all state mutations here
// [L44] Reference Types — state is a plain object, spread to avoid mutation
// [L41] switch-case — conditionals for action types
//
// Pure function: same input ALWAYS gives same output — no side effects.
// All state changes go through dispatch() → reducer → new state object.

export const initialState = {
  groups: [],           // [L44] Array of group objects
  activeGroupId: null,  // [L40] null — valid data type in JS
}

// [L57] Async / localStorage — read persisted data on startup
export function loadPersistedState() {
  try {
    const raw = localStorage.getItem('splitkaro_v1')  // [L57] synchronous storage API
    return raw ? JSON.parse(raw) : initialState       // [L48] JSON built-in object
  } catch {
    return initialState  // [L50] Error handling — graceful fallback
  }
}

// [L57] localStorage.setItem — save after every dispatch
export function persistState(state) {
  try {
    localStorage.setItem('splitkaro_v1', JSON.stringify(state))  // [L48] JSON.stringify
  } catch { /* ignore quota errors */ }   // [L50] Error handling
}

// ─── PURE REDUCER ─────────────────────────────────────────────────
// [L72] useReducer pattern — (state, action) => newState
// NEVER mutate state directly — always return a NEW object (spread)
export function groupReducer(state, action) {
  switch (action.type) {  // [L41] switch/case — conditional branching

    // [L44] Spread operator on array — immutable array append
    case 'CREATE_GROUP': {
      const newGroup = {
        id: crypto.randomUUID(),        // [L48] crypto built-in
        name: action.payload.name,
        members: action.payload.members,
        expenses: [],
        createdAt: new Date().toISOString(),  // [L48] Date built-in
      }
      return {
        ...state,                            // [L44] object spread — copy existing state
        groups: [...state.groups, newGroup], // [L44] array spread — immutable push
        activeGroupId: newGroup.id,
      }
    }

    // [L44] Array.filter — returns NEW array excluding deleted group
    case 'DELETE_GROUP': {
      const groups = state.groups.filter(g => g.id !== action.payload)  // [L43] arrow fn
      const activeGroupId = state.activeGroupId === action.payload
        ? (groups[0]?.id ?? null)   // [L41] optional chaining + nullish coalescing
        : state.activeGroupId
      return { ...state, groups, activeGroupId }
    }

    // [L72] Action dispatch — simple state field update
    case 'SET_ACTIVE_GROUP':
      return { ...state, activeGroupId: action.payload }

    // [L44] Array.map — transforms matching group, leaves others unchanged
    case 'ADD_EXPENSE': {
      const groups = state.groups.map(g =>
        g.id !== state.activeGroupId ? g : {
          ...g,
          expenses: [
            ...g.expenses,
            {
              id: crypto.randomUUID(),
              description: action.payload.description,
              amount: Number(action.payload.amount),  // [L40] type coercion
              paidBy: action.payload.paidBy,
              splitAmong: action.payload.splitAmong,
              date: new Date().toISOString(),
            }
          ]
        }
      )
      return { ...state, groups }
    }

    // [L44] Array.filter inside Array.map — nested immutable update
    case 'DELETE_EXPENSE': {
      const groups = state.groups.map(g =>
        g.id !== state.activeGroupId ? g : {
          ...g,
          expenses: g.expenses.filter(e => e.id !== action.payload)
        }
      )
      return { ...state, groups }
    }

    case 'ADD_MEMBER': {
      const groups = state.groups.map(g =>
        g.id !== state.activeGroupId ? g : {
          ...g,
          members: [...g.members, action.payload]
        }
      )
      return { ...state, groups }
    }

    default:
      return state  // [L41] Always return state for unknown actions
  }
}
