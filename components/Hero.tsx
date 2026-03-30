'use client'

import { useEffect, useState } from 'react'
import styles from './Hero.module.css'

const LINES = [
  'Entwickler & Maker aus der Schweiz.',
  'Ich baue Dinge — aus Code, Filament und Neugier.',
  'Informatikstudent. Hobbybastler. Problemlöser.',
]

export default function Hero() {
  const [text, setText] = useState('')

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
    <section id="hero" className={styles.hero}>
      <div className={styles.gridLines} />
      <span className={styles.cornerText}>Portfolio — 2025</span>
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
