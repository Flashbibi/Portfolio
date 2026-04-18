'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import styles from './GlitchText.module.css'
import { useGlitchRegistration } from '@/context/GlitchContext'

function useDomTheme(): 'dark' | 'light' {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  useEffect(() => {
    const read = () => {
      const v = document.documentElement.getAttribute('data-theme')
      setTheme(v === 'light' ? 'light' : 'dark')
    }
    read()
    const observer = new MutationObserver(read)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [])
  return theme
}

export interface GlitchActivation {
  matchStart:  number
  matchEnd:    number
  replacement: string
  category:    'miau' | 'insights' | 'absurd'
}

interface Props {
  children:       string
  id:             string
  active?:        GlitchActivation | null
  onClickGlitch?: () => void
}

type Phase = 'idle' | 'corrupt' | 'morph' | 'settle' | 'exiting'

const SCRAMBLE = '█▓▒░!@#$%&*?><÷±~^'
function rndStr(len: number): string {
  return Array.from({ length: Math.max(1, len) }, () =>
    SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)]
  ).join('')
}

const PHASE_CLASS: Record<Phase, string> = {
  idle:    '',
  corrupt: styles.pCorrupt,
  morph:   styles.pMorph,
  settle:  styles.pSettle,
  exiting: styles.pExiting,
}

const GLOW: Record<'dark' | 'light', Record<GlitchActivation['category'], { gw: string; gs: string }>> = {
  dark: {
    miau:     { gw: 'rgba(106,171,223,0.90)', gs: 'rgba(106,171,223,0.40)' },
    insights: { gw: 'rgba(106,171,223,0.90)', gs: 'rgba(106,171,223,0.40)' },
    absurd:   { gw: 'rgba(106,171,223,0.90)', gs: 'rgba(106,171,223,0.40)' },
  },
  light: {
    miau:     { gw: 'rgba(160,100, 15,0.75)', gs: 'rgba(160,100, 15,0.30)' },
    insights: { gw: 'rgba(140,125, 10,0.75)', gs: 'rgba(140,125, 10,0.30)' },
    absurd:   { gw: 'rgba(160, 65, 20,0.75)', gs: 'rgba(160, 65, 20,0.30)' },
  },
}

export default function GlitchText({ children, id, active = null, onClickGlitch }: Props) {
  if (process.env.NODE_ENV !== 'production' && typeof children !== 'string') {
    console.warn(`[GlitchText] id="${id}": children must be a plain string`)
  }

  const theme = useDomTheme()

  // Registry-driven activation from GlitchProvider scheduler
  const [registeredActive, setRegisteredActive] = useState<GlitchActivation | null>(null)
  const { onClicked } = useGlitchRegistration(id, children, setRegisteredActive)
  const resolvedActive = active ?? registeredActive

  // Animation state
  const [phase,       setPhase]       = useState<Phase>('idle')
  const [displayText, setDisplayText] = useState('')
  const [minWidth,    setMinWidth]    = useState<number | null>(null)
  const [captured,    setCaptured]    = useState<GlitchActivation | null>(null)
  const capturedRef   = useRef<GlitchActivation | null>(null)

  const phaseRef    = useRef<Phase>('idle')
  const timersRef   = useRef<ReturnType<typeof setTimeout>[]>([])
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const measureRef  = useRef<HTMLSpanElement>(null)

  // ── Helpers ────────────────────────────────────────────────────────────────
  function clearAll() {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
  }

  function scramble(len: number) {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => setDisplayText(rndStr(len)), 30)
  }

  function stopScramble() {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
  }

  // ── Measure original word width after corrupt phase renders measureRef ─────
  useLayoutEffect(() => {
    if (phase === 'idle' || minWidth !== null || !measureRef.current) return
    const w = measureRef.current.getBoundingClientRect().width
    if (w > 0) setMinWidth(w)
  })

  // ── Phase state machine ────────────────────────────────────────────────────
  useEffect(() => {
    if (resolvedActive) {
      clearAll()
      capturedRef.current = resolvedActive
      setCaptured(resolvedActive)
      setMinWidth(null)

      const origLen = resolvedActive.matchEnd - resolvedActive.matchStart
      phaseRef.current = 'corrupt'
      setPhase('corrupt')
      scramble(origLen)

      const t1 = setTimeout(() => {
        stopScramble()
        phaseRef.current = 'morph'
        setPhase('morph')
        scramble(resolvedActive.replacement.length)

        const t2 = setTimeout(() => {
          stopScramble()
          setDisplayText(resolvedActive.replacement)
          phaseRef.current = 'settle'
          setPhase('settle')
        }, 100)
        timersRef.current.push(t2)
      }, 150)
      timersRef.current.push(t1)

    } else if (phaseRef.current !== 'idle') {
      clearAll()
      const cap = capturedRef.current
      if (!cap) {
        phaseRef.current = 'idle'
        setPhase('idle')
        return
      }

      const origLen = cap.matchEnd - cap.matchStart
      phaseRef.current = 'exiting'
      setPhase('exiting')
      scramble(origLen)

      const t1 = setTimeout(() => {
        stopScramble()
        phaseRef.current = 'idle'
        setPhase('idle')
        setCaptured(null)
        capturedRef.current = null
        setMinWidth(null)
        setDisplayText('')
      }, 200)
      timersRef.current.push(t1)
    }

    return clearAll
  }, [resolvedActive])   // eslint-disable-line react-hooks/exhaustive-deps

  // ── Interaction handlers ───────────────────────────────────────────────────
  function handleMouseDown(e: React.MouseEvent) {
    e.stopPropagation()
  }

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation()
    e.preventDefault()
    onClickGlitch?.()
    onClicked()
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      e.stopPropagation()
      onClickGlitch?.()
      onClicked()
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  if (phase === 'idle') return <>{children}</>

  const curr   = captured!
  const before = children.slice(0, curr.matchStart)
  const orig   = children.slice(curr.matchStart, curr.matchEnd)
  const after  = children.slice(curr.matchEnd)

  const spanText = phase === 'settle' ? curr.replacement : (displayText || orig)
  const isClickable = phase === 'settle'
  const glow = GLOW[theme][curr.category]

  return (
    <>
      {before}
      <span ref={measureRef} className={styles.measure} aria-hidden="true">{orig}</span>
      <span
        className={`${styles.glitch} ${PHASE_CLASS[phase]}`}
        style={{
          '--gw': glow.gw,
          '--gs': glow.gs,
          ...(minWidth != null ? { minWidth: `${minWidth}px` } : {}),
        } as React.CSSProperties}
        role={isClickable ? 'button' : undefined}
        tabIndex={isClickable ? 0 : undefined}
        aria-label={isClickable ? 'glitched word — click to reveal' : undefined}
        onMouseDown={isClickable ? handleMouseDown : undefined}
        onClick={isClickable ? handleClick : undefined}
        onKeyDown={isClickable ? handleKeyDown : undefined}
        data-original={orig}
      >
        {spanText}
      </span>
      {after}
    </>
  )
}
