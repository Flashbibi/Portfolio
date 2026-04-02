'use client'

import { useEffect, useState } from 'react'
import TerminalIntro from '@/components/TerminalIntro'
import TerminalDrawer from '@/components/TerminalDrawer'
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Projects from '@/components/Projects'
import Contact from '@/components/Contact'
import styles from './page.module.css'
import { useLang } from '@/context/LanguageContext'
import { translations } from '@/data/translations'

const INTRO_SEEN_KEY = 'portfolio:intro-seen'

export default function Home() {
  const { lang, isGlitching } = useLang()
  const t = translations[lang].footer
  const [introDone,   setIntroDone]   = useState(false)
  const [drawerOpen,  setDrawerOpen]  = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem(INTRO_SEEN_KEY) === '1') {
      setIntroDone(true)
    }
  }, [])

useEffect(() => {
    if (!introDone) return
    const els = document.querySelectorAll('[data-reveal]')
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('revealed'); observer.unobserve(e.target) }
      }),
      { threshold: 0.1 }
    )
    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [introDone])

  function handleIntroDone() {
    sessionStorage.setItem(INTRO_SEEN_KEY, '1')
    setIntroDone(true)
  }

  return (
    <>
      {!introDone && (
        <TerminalIntro onDone={handleIntroDone} />
      )}

      <div className={`${styles.portfolio} ${introDone ? styles.visible : ''}`}>
        <div data-chroma={isGlitching ? '' : undefined}>
          <Nav onTerminalOpen={() => setDrawerOpen(true)} />
          <Hero />
          <About />
          <Projects />
          <Contact />
          <footer className={styles.footer}>
            <span>{t.location}</span>
            <span>Next.js · TypeScript · CSS Modules</span>
            <span>© {new Date().getFullYear()}</span>
          </footer>
        </div>
      </div>

      <TerminalDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

    </>
  )
}
