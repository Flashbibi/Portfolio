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

const INTRO_SEEN_KEY = 'portfolio:intro-seen'

export default function Home() {
  const [introDone,   setIntroDone]   = useState(false)
  const [drawerOpen,  setDrawerOpen]  = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem(INTRO_SEEN_KEY) === '1') {
      setIntroDone(true)
    }
  }, [])

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
        <Nav onTerminalOpen={() => setDrawerOpen(true)} />
        <Hero />
        <About />
        <Projects />
        <Contact />
        <footer className={styles.footer}>
          <span>Linus — Zürich, Schweiz</span>
          <span>Next.js · TypeScript · CSS Modules</span>
          <span>© {new Date().getFullYear()}</span>
        </footer>
      </div>

      <TerminalDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  )
}
