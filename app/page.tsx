'use client'

import { useState } from 'react'
import TerminalIntro from '@/components/TerminalIntro'
import TerminalDrawer from '@/components/TerminalDrawer'
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Projects from '@/components/Projects'
import Contact from '@/components/Contact'
import styles from './page.module.css'

export default function Home() {
  const [introDone,   setIntroDone]   = useState(false)
  const [drawerOpen,  setDrawerOpen]  = useState(false)

  return (
    <>
      {!introDone && (
        <TerminalIntro onDone={() => setIntroDone(true)} />
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
