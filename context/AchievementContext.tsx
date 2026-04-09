'use client'

import { createContext, useCallback, useContext, useEffect, useReducer } from 'react'

const LS_KEY = 'portfolio:achievements'

interface State {
  unlocked: Set<string>
  queue:    string[]
}

type Action =
  | { type: 'hydrate'; ids: string[] }
  | { type: 'unlock';  id:  string   }
  | { type: 'dismiss'                }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'hydrate':
      return { ...state, unlocked: new Set<string>(action.ids) }
    case 'unlock':
      if (state.unlocked.has(action.id)) return state
      return {
        unlocked: new Set<string>(Array.from(state.unlocked).concat(action.id)),
        queue:    [...state.queue, action.id],
      }
    case 'dismiss':
      return { ...state, queue: state.queue.slice(1) }
    default:
      return state
  }
}

interface AchievementContextValue {
  unlocked:     Set<string>
  currentToast: string | null
  unlock:       (id: string) => void
  dismiss:      () => void
}

const AchievementContext = createContext<AchievementContextValue>({
  unlocked:     new Set(),
  currentToast: null,
  unlock:       () => {},
  dismiss:      () => {},
})

function loadUnlocked(): Set<string> {
  try {
    if (typeof window === 'undefined') return new Set<string>()
    const raw = localStorage.getItem(LS_KEY)
    const ids = raw ? (JSON.parse(raw) as unknown) : []
    return new Set<string>(Array.isArray(ids) ? (ids as string[]) : [])
  } catch {
    return new Set<string>()
  }
}

function initState(_: null): State {
  return { unlocked: loadUnlocked(), queue: [] }
}

export function AchievementProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, null, initState)

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(Array.from(state.unlocked)))
    } catch { /* ignore */ }
  }, [state.unlocked])

  const unlock  = useCallback((id: string) => dispatch({ type: 'unlock', id }), [])
  const dismiss = useCallback(()           => dispatch({ type: 'dismiss' }),    [])

  return (
    <AchievementContext.Provider value={{
      unlocked:     state.unlocked,
      currentToast: state.queue[0] ?? null,
      unlock,
      dismiss,
    }}>
      {children}
    </AchievementContext.Provider>
  )
}

export const useAchievement = () => useContext(AchievementContext)
