'use client'

import { createContext, useCallback, useContext, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useLang } from '@/context/LanguageContext'
import { useAchievement } from '@/context/AchievementContext'
import { pickGlitch, glitchKey } from '@/lib/glitchEngine'
import {
  getAllSeenGlitches,
  markGlitchFound,
  markGlitchShown,
  getFoundCount,
} from '@/lib/glitchStorage'
import { REALITY_GLITCHER_THRESHOLD } from '@/data/achievements'
import type { GlitchEntry } from '@/data/glitches'
import type { GlitchActivation } from '@/components/GlitchText'

// ── Timing constants ─────────────────────────────────────────────────────────
const WAIT_MIN_MS     = 25_000
const WAIT_MAX_MS     = 45_000
const ACTIVE_MIN_MS   = 8_000
const ACTIVE_MAX_MS   = 12_000
const COOLDOWN_MIN_MS = 10_000
const COOLDOWN_MAX_MS = 20_000
const MAX_EMPTY_TRIES = 5

function rand(min: number, max: number) { return min + Math.random() * (max - min) }

// ── Registry types ───────────────────────────────────────────────────────────

interface RegisteredSource {
  id:        string
  text:      string
  setActive: (a: GlitchActivation | null) => void
}

type SchedulerState = 'idle' | 'waiting' | 'active' | 'cooldown'

// ── Context ──────────────────────────────────────────────────────────────────

interface GlitchContextValue {
  register:   (source: RegisteredSource) => void
  unregister: (id: string) => void
  onClicked:  () => void
}

const GlitchContext = createContext<GlitchContextValue>({
  register:   () => {},
  unregister: () => {},
  onClicked:  () => {},
})

// ── Hook for GlitchText ──────────────────────────────────────────────────────

export function useGlitchRegistration(
  id: string,
  text: string,
  setActive: (a: GlitchActivation | null) => void
): { onClicked: () => void } {
  const { register, unregister, onClicked } = useContext(GlitchContext)

  useEffect(() => {
    register({ id, text, setActive })
    return () => unregister(id)
  }, [id, text, setActive, register, unregister])

  return { onClicked }
}

// ── Provider ─────────────────────────────────────────────────────────────────

export function GlitchProvider({ children }: { children: React.ReactNode }) {
  const { lang }   = useLang()
  const { unlock }  = useAchievement()
  const pathname    = usePathname()

  // All mutable state lives in refs — no React re-renders needed for the scheduler.
  const registryRef   = useRef(new Map<string, RegisteredSource>())
  const stateRef      = useRef<SchedulerState>('idle')
  const timerRef      = useRef<ReturnType<typeof setTimeout> | null>(null)
  const activeIdRef   = useRef<string | null>(null)
  const activeEntryRef = useRef<GlitchEntry | null>(null)
  const emptyTriesRef = useRef(0)
  // Snapshot lang so the scheduler closure always reads the latest value.
  const langRef       = useRef(lang)
  langRef.current     = lang

  // ── Timer helpers ──────────────────────────────────────────────────────────

  function clearTimer() {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  function clearActiveGlitch() {
    if (activeIdRef.current) {
      const source = registryRef.current.get(activeIdRef.current)
      source?.setActive(null)
      // Mark as shown (seen but not clicked) so it's deprioritised
      if (activeEntryRef.current) {
        markGlitchShown(glitchKey(activeEntryRef.current, langRef.current))
      }
      activeIdRef.current  = null
      activeEntryRef.current = null
    }
  }

  function resetToIdle() {
    clearTimer()
    clearActiveGlitch()
    stateRef.current    = 'idle'
    emptyTriesRef.current = 0
  }

  // ── State transitions ──────────────────────────────────────────────────────

  function startWaiting() {
    if (registryRef.current.size === 0) { stateRef.current = 'idle'; return }
    stateRef.current = 'waiting'
    timerRef.current = setTimeout(tryActivate, rand(WAIT_MIN_MS, WAIT_MAX_MS))
  }

  function tryActivate() {
    timerRef.current = null
    const sources = Array.from(registryRef.current.values()).map(s => ({ id: s.id, text: s.text }))
    if (sources.length === 0) { stateRef.current = 'idle'; return }

    const seen   = getAllSeenGlitches()
    const result = pickGlitch(sources, langRef.current, seen)

    if (!result) {
      emptyTriesRef.current++
      if (emptyTriesRef.current >= MAX_EMPTY_TRIES) {
        stateRef.current = 'idle'
        return
      }
      stateRef.current = 'cooldown'
      timerRef.current = setTimeout(startWaiting, rand(COOLDOWN_MIN_MS / 2, COOLDOWN_MAX_MS / 2))
      return
    }

    emptyTriesRef.current = 0

    const source = registryRef.current.get(result.sourceId)
    if (!source) { startCooldown(); return }

    const activation: GlitchActivation = {
      matchStart:  result.matchStart,
      matchEnd:    result.matchEnd,
      replacement: result.entry.replacement,
      category:    result.entry.category,
    }

    source.setActive(activation)
    activeIdRef.current    = result.sourceId
    activeEntryRef.current = result.entry
    stateRef.current       = 'active'

    // Natural timeout
    timerRef.current = setTimeout(() => {
      timerRef.current = null
      clearActiveGlitch()
      startCooldown()
    }, rand(ACTIVE_MIN_MS, ACTIVE_MAX_MS))
  }

  function startCooldown() {
    stateRef.current = 'cooldown'
    timerRef.current = setTimeout(startWaiting, rand(COOLDOWN_MIN_MS, COOLDOWN_MAX_MS))
  }

  // ── Kick the scheduler when conditions change ──────────────────────────────

  function maybeStart() {
    if (stateRef.current !== 'idle') return
    if (registryRef.current.size === 0) return
    if (typeof document !== 'undefined' && document.hidden) return
    startWaiting()
  }

  // ── Registry callbacks (stable via useCallback) ────────────────────────────

  const register = useCallback((source: RegisteredSource) => {
    registryRef.current.set(source.id, source)
    // Kick the scheduler if it was idle and this is the first source.
    if (stateRef.current === 'idle') {
      // Defer to next micro-task so all sources from the same render batch register first.
      queueMicrotask(maybeStart)
    }
  }, [])

  const unregister = useCallback((id: string) => {
    registryRef.current.delete(id)
    // If the active glitch's source just unmounted, cancel it.
    if (activeIdRef.current === id) {
      clearTimer()
      activeIdRef.current    = null
      activeEntryRef.current = null
      startCooldown()
    }
  }, [])

  const onClicked = useCallback(() => {
    if (!activeEntryRef.current || !activeIdRef.current) return
    clearTimer()

    const entry = activeEntryRef.current
    const key   = glitchKey(entry, langRef.current)

    // Push null to the source so GlitchText runs its reverse animation
    const source = registryRef.current.get(activeIdRef.current)
    source?.setActive(null)
    activeIdRef.current    = null
    activeEntryRef.current = null

    // Persist as clicked (counts toward achievement)
    markGlitchFound(key)
    if (getFoundCount() >= REALITY_GLITCHER_THRESHOLD) {
      unlock('reality-glitcher')
    }

    startCooldown()
  }, [unlock])

  // ── Route change → full reset ──────────────────────────────────────────────

  useEffect(() => {
    resetToIdle()
    // Sources will re-register after mount; maybeStart is kicked from register().
  }, [pathname])

  // ── Language change while active → clear and restart ───────────────────────

  const prevLangRef = useRef(lang)
  useEffect(() => {
    if (lang === prevLangRef.current) return
    prevLangRef.current = lang
    resetToIdle()
    queueMicrotask(maybeStart)
  }, [lang])

  // ── Tab visibility ─────────────────────────────────────────────────────────

  useEffect(() => {
    function onVisibility() {
      if (document.hidden) {
        resetToIdle()
      } else {
        maybeStart()
      }
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  // ── Cleanup on unmount ─────────────────────────────────────────────────────

  useEffect(() => () => resetToIdle(), [])

  return (
    <GlitchContext.Provider value={{ register, unregister, onClicked }}>
      {children}
    </GlitchContext.Provider>
  )
}
