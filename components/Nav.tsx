'use client'

import { useEffect, useState } from 'react'
import styles from './Nav.module.css'
import { useTheme } from '@/context/ThemeContext'
import { useLang } from '@/context/LanguageContext'
import { useAchievement } from '@/context/AchievementContext'
import { translations } from '@/data/translations'

interface NavProps {
  onTerminalOpen: () => void
}

export default function Nav({ onTerminalOpen }: NavProps) {
  const { theme, toggle } = useTheme()
  const { lang, toggle: toggleLang } = useLang()
  const { unlock } = useAchievement()
  const t = translations[lang].nav
  const [progress, setProgress] = useState(0)
  const [active, setActive] = useState('')

  useEffect(() => {
    function onScroll() {
      const scrolled = window.scrollY
      const total = document.documentElement.scrollHeight - window.innerHeight
      setProgress(total > 0 ? scrolled / total : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sections = ['about', 'projects', 'contact']
    function update() {
      const scrollY = window.scrollY + window.innerHeight * 0.4
      let current = ''
      for (const id of sections) {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= scrollY) current = id
      }
      setActive(current)
    }
    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <nav className={styles.nav}>
      <div className={styles.progressBar} style={{ transform: `scaleX(${progress})` }} />
      <a href="#hero" className={styles.logo}>linus</a>
      <div className={styles.links}>
        <a href="#about"    className={active === 'about'    ? styles.active : ''}>{t.about}</a>
        <a href="/me"       className={styles.meLink}>{t.me}</a>
        <a href="#projects" className={active === 'projects' ? styles.active : ''}>{t.projects}</a>
        <a href="#contact"  className={active === 'contact'  ? styles.active : ''}>{t.contact}</a>
        <button className={styles.termBtn} onClick={onTerminalOpen} title={t.openTerminal} aria-label={t.openTerminal}>
          <span aria-hidden="true">❯_</span>
          <span className={styles.termLabel}>{t.terminal}</span>
        </button>
        <button
          className={styles.themeToggle}
          onClick={toggle}
          aria-label={theme === 'dark' ? t.lightTheme : t.darkTheme}
        >
          {theme === 'dark' ? '[ light ]' : '[ dark ]'}
        </button>
        <button
          className={styles.themeToggle}
          onClick={() => { toggleLang(); unlock('bilingual') }}
          aria-label={lang === 'en' ? 'Deutsch' : 'English'}
        >
          {lang === 'en' ? '[ DE ]' : '[ EN ]'}
        </button>
      </div>
    </nav>
  )
}
