'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './TerminalIntro.module.css'

interface Props {
  onDone: () => void
}

function delay(ms: number) {
  return new Promise<void>(r => setTimeout(r, ms))
}

export default function TerminalIntro({ onDone }: Props) {
  const outRef    = useRef<HTMLDivElement>(null)
  const skippedRef = useRef(false)
  const startedRef = useRef(false)
  const [visible, setVisible] = useState(true)

  function print(text: string, cls = '') {
    const p = document.createElement('p')
    p.className = [styles.line, cls ? styles[cls] : ''].filter(Boolean).join(' ')
    p.textContent = text
    outRef.current?.appendChild(p)
    if (outRef.current) outRef.current.scrollTop = outRef.current.scrollHeight
  }

  async function typeCmd(text: string, ms = 90) {
    const p = document.createElement('p')
    p.className = styles.line
    p.innerHTML =
      `<span class="${styles.cu}">visitor</span>` +
      `<span class="${styles.ca}">@</span>` +
      `<span class="${styles.ch}">linus-portfolio</span>` +
      `<span class="${styles.cp}">:~/linus</span>` +
      `<span class="${styles.cs}"> $ </span>` +
      `<span id="ts"></span>`
    outRef.current?.appendChild(p)
    const span = p.querySelector<HTMLSpanElement>('#ts')!
    for (let i = 0; i <= text.length; i++) {
      if (skippedRef.current) return
      span.textContent = text.slice(0, i)
      await delay(ms)
    }
  }

  function printHTML(html: string) {
    const p = document.createElement('p')
    p.className = styles.line
    p.innerHTML = html
    outRef.current?.appendChild(p)
    if (outRef.current) outRef.current.scrollTop = outRef.current.scrollHeight
  }

  function finish() {
    skippedRef.current = true
    setVisible(false)
    setTimeout(onDone, 900)
  }

  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true

    async function run() {
      await delay(300)
      if (skippedRef.current) return

      print('')
      print('  ██╗     ██╗███╗   ██╗██╗   ██╗███████╗', 'amber')
      print('  ██║     ██║████╗  ██║██║   ██║██╔════╝', 'amber')
      print('  ██║     ██║██╔██╗ ██║██║   ██║███████╗', 'amber')
      print('  ██║     ██║██║╚██╗██║██║   ██║╚════██║', 'amber')
      print('  ███████╗██║██║ ╚████║╚██████╔╝███████║', 'amber')
      print('  ╚══════╝╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚══════╝', 'amber')
      print('')
      print('  portfolio v1.0.0  —  zürich, schweiz', 'dim')
      print('')

      await delay(800); if (skippedRef.current) return
      print('  [  OK  ] Filesystem mounted.', 'green')
      await delay(400); if (skippedRef.current) return
      print('  [  OK  ] Shell ready.', 'green')
      await delay(700); if (skippedRef.current) return
      print('')
      print('─────────────────────────────────────────────', 'dim')
      print('')
      await delay(900); if (skippedRef.current) return

      await typeCmd('ls')
      await delay(350); if (skippedRef.current) return
      printHTML(`  <span style="color:#6aabdf">linus/</span>`)
      print('')
      await delay(750); if (skippedRef.current) return

      await typeCmd('cd linus')
      await delay(500); if (skippedRef.current) return
      print('')

      await typeCmd('ls')
      await delay(350); if (skippedRef.current) return
      printHTML(
        `  <span style="color:#f0ebe0;display:inline-block;min-width:180px">about.md</span>` +
        `<span style="color:#f0ebe0;display:inline-block;min-width:180px">contact.md</span>` +
        `<span style="color:#6aabdf;display:inline-block;min-width:180px">projects/</span>` +
        `<span style="color:#5dba7e">portfolio.sh*</span>`
      )
      print('')
      await delay(900); if (skippedRef.current) return

      await typeCmd('./portfolio.sh')
      await delay(400); if (skippedRef.current) return
      print('')
      print('  Mounting portfolio...', 'muted')
      await delay(500); if (skippedRef.current) return
      print('  Loading assets...', 'muted')
      await delay(500); if (skippedRef.current) return
      print('  Starting...', 'muted')
      await delay(500); if (skippedRef.current) return
      print('')
      print('  [  OK  ] Portfolio ready. Opening...', 'green')
      await delay(1000); if (skippedRef.current) return

      finish()
    }
    run()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps -- mount-only: effect intentionally runs once to boot the terminal sequence.

  if (!visible) return null

  return (
    <div className={`${styles.wrap} ${!visible ? styles.fadeOut : ''}`}>
      <div className={styles.scanlines} />
      <div className={styles.output} ref={outRef} />
      <button className={styles.skip} onClick={finish}>skip →</button>
    </div>
  )
}
