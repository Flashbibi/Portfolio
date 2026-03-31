'use client'

import { useEffect, useState } from 'react'
import styles from './Nav.module.css'
import { useTheme } from '@/context/ThemeContext'

interface NavProps {
  onTerminalOpen: () => void
}

export default function Nav({ onTerminalOpen }: NavProps) {
  const { theme, toggle } = useTheme()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function onScroll() {
      const scrolled = window.scrollY
      const total = document.documentElement.scrollHeight - window.innerHeight
      setProgress(total > 0 ? scrolled / total : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={styles.nav}>
      <div className={styles.progressBar} style={{ transform: `scaleX(${progress})` }} />
      <a href="#hero" className={styles.logo}>linus</a>
      <div className={styles.links}>
        <a href="#about">über mich</a>
        <a href="#projects">projekte</a>
        <a href="#contact">kontakt</a>
        <button className={styles.termBtn} onClick={onTerminalOpen} title="Terminal öffnen" aria-label="Terminal öffnen">
          <span aria-hidden="true">❯_</span>
          <span className={styles.termLabel}>terminal</span>
        </button>
        <button
          className={styles.themeToggle}
          onClick={toggle}
          aria-label={theme === 'dark' ? 'Helles Theme aktivieren' : 'Dunkles Theme aktivieren'}
        >
          {theme === 'dark' ? '[ light ]' : '[ dark ]'}
        </button>
      </div>
    </nav>
  )
}
