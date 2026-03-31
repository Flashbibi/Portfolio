'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './Hero.module.css'

const LINES = [
  'Entwickler & Maker aus der Schweiz.',
  'Ich baue Dinge — aus Code, Filament und Neugier.',
  'Informatikstudent. Hobbybastler. Problemlöser.',
]

export default function Hero() {
  const [text, setText] = useState('')
  const [mouse, setMouse] = useState({ x: -9999, y: -9999 })
  const heroRef = useRef<HTMLElement>(null)

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      const rect = heroRef.current?.getBoundingClientRect()
      if (!rect) return
      setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    }
    function onMouseLeave() {
      setMouse({ x: -9999, y: -9999 })
    }
    const el = heroRef.current
    el?.addEventListener('mousemove', onMouseMove)
    el?.addEventListener('mouseleave', onMouseLeave)
    return () => {
      el?.removeEventListener('mousemove', onMouseMove)
      el?.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  useEffect(() => {
    let li = 0, ci = 0, deleting = false
    let timer: ReturnType<typeof setTimeout>

    function tick() {
      const line = LINES[li]
      if (!deleting) {
        setText(line.slice(0, ++ci))
        if (ci === line.length) { deleting = true; timer = setTimeout(tick, 2200); return }
      } else {
        setText(line.slice(0, --ci))
        if (ci === 0) { deleting = false; li = (li + 1) % LINES.length }
      }
      timer = setTimeout(tick, deleting ? 30 : 55)
    }

    timer = setTimeout(tick, 800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section id="hero" className={styles.hero} ref={heroRef}>
      <div className={styles.gridLines} />
      <div
        className={styles.spotlight}
        style={{ background: `radial-gradient(700px circle at ${mouse.x}px ${mouse.y}px, var(--spotlight-color), transparent 70%)` }}
      />
      <span className={styles.cornerText}>Portfolio — {new Date().getFullYear()}</span>
      <p className={styles.index}>01 — Willkommen</p>
      <h1 className={styles.name} data-text="Linus">Linus</h1>
      <p className={styles.sub}>
        {text}
        <span className={styles.cursor} />
      </p>
      <p className={styles.scroll}>Scroll</p>
    </section>
  )
}
