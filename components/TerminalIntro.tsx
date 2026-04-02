'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './TerminalIntro.module.css'
import { useLang } from '@/context/LanguageContext'
import { translations } from '@/data/translations'

interface Props {
  onDone: () => void
}

function delay(ms: number) {
  return new Promise<void>(r => setTimeout(r, ms))
}

export default function TerminalIntro({ onDone }: Props) {
  const { lang } = useLang()
  const outRef         = useRef<HTMLDivElement>(null)
  const skippedRef     = useRef(false)
  const startedRef     = useRef(false)
  const cleanupChoice  = useRef<(() => void) | null>(null)
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

  function waitForDialog<T extends string>(
    title: string,
    label: string,
    options: Array<{ key: string; label: string; value: T }>,
    defaultValue: T
  ): Promise<T> {
    return new Promise(resolve => {
      const box = document.createElement('div')
      box.className = styles.dialog

      // IW = inner width (spaces). Adjust this one value if box-drawing chars
      // render at a different width than spaces in the browser's fallback font.
      const IW   = 37   // space-chars width for content rows
      const DW   = 41   // dash-chars for borders (─ is narrower than space in fallback font)
      const dash = '─'.repeat(DW)
      const row  = (cls: string, text: string) =>
        `<p class="${cls}">  │${text.padEnd(IW)}│</p>`
      const rowH = (cls: string, html: string, textLen: number) => {
        const pad = '&nbsp;'.repeat(Math.max(0, IW - textLen))
        return `<p class="${cls}">  │${html}${pad}│</p>`
      }

      const optLines = options.map(o => {
        const t = `[ ${o.key} ]  ${o.label}`
        return rowH(styles.dialogLine,
          `   <button class="${styles.dialogBtn}" data-choice="${o.value}">${t}</button>`,
          3 + t.length)
      }).join('')

      box.innerHTML =
        `<p class="${styles.dialogBorder}">  ┌${dash}┐</p>` +
        rowH(styles.dialogBorder, `  <span class="${styles.dialogTitle}">${title}</span>`, 2 + title.length) +
        `<p class="${styles.dialogBorder}">  ├${dash}┤</p>` +
        row(styles.dialogBorder, '') +
        row(styles.dialogBorder, `   ${label}`) +
        row(styles.dialogBorder, '') +
        optLines +
        row(styles.dialogBorder, '') +
        row(styles.dialogHint, `   Press ${options.map(o => o.key).join(' or ')}`) +
        `<p class="${styles.dialogBorder}">  └${dash}┘</p>`

      outRef.current?.appendChild(box)
      if (outRef.current) outRef.current.scrollTop = outRef.current.scrollHeight

      function pick(value: T) {
        cleanup()
        box.querySelectorAll<HTMLButtonElement>('[data-choice]').forEach(btn => {
          btn.style.color = btn.dataset.choice === value ? '#5dba7e' : '#333330'
        })
        resolve(value)
      }

      function onKey(e: KeyboardEvent) {
        const opt = options.find(o => o.key === e.key)
        if (opt) pick(opt.value)
      }

      function onClick(e: MouseEvent) {
        const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-choice]')
        if (btn?.dataset.choice) pick(btn.dataset.choice as T)
      }

      function cleanup() {
        document.removeEventListener('keydown', onKey)
        box.removeEventListener('click', onClick)
        cleanupChoice.current = null
      }

      cleanupChoice.current = () => { cleanup(); resolve(defaultValue) }

      document.addEventListener('keydown', onKey)
      box.addEventListener('click', onClick)
    })
  }

  function finish() {
    cleanupChoice.current?.()
    skippedRef.current = true
    setVisible(false)
    setTimeout(onDone, 900)
  }

  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true

    async function run() {
      const t = translations[lang].terminalIntro

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
      print(`  portfolio v1.0.0  —  ${t.tagline}`, 'dim')
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
        `<span style="color:#5dba7e;display:inline-block;min-width:180px">decision.sh*</span>` +
        `<span style="color:#5dba7e;display:inline-block;min-width:180px">decision2.sh*</span>` +
        `<span style="color:#5dba7e;display:inline-block;min-width:180px">portfolio.sh*</span>` +
        `<span style="color:#6aabdf">private/</span>`
      )
      print('')
      await delay(900); if (skippedRef.current) return

      // decision.sh — language
      await typeCmd('./decision.sh')
      await delay(400); if (skippedRef.current) return
      print('')

      const langChoice = await waitForDialog(
        'decision.sh — language select',
        t.langDialogLabel,
        [
          { key: '1', label: 'English', value: 'en' as const },
          { key: '2', label: 'Deutsch', value: 'de' as const },
        ],
        'en' as const
      )
      if (skippedRef.current) return

      try {
        localStorage.setItem('lang', langChoice)
        document.documentElement.setAttribute('lang', langChoice)
        window.dispatchEvent(new CustomEvent('portfolio:lang-set', { detail: langChoice }))
      } catch { /* ignore */ }

      await delay(400); if (skippedRef.current) return
      print('')
      print(t.langSet(langChoice === 'en' ? 'English' : 'Deutsch'), 'green')
      await delay(800); if (skippedRef.current) return
      print('')

      // decision2.sh — theme
      await typeCmd('./decision2.sh')
      await delay(400); if (skippedRef.current) return
      print('')

      const theme = await waitForDialog(
        'decision2.sh — environment select',
        t.dialogLabel,
        [
          { key: '1', label: 'Dark Mode ', value: 'dark' as const },
          { key: '2', label: 'Light Mode', value: 'light' as const },
        ],
        'dark' as const
      )
      if (skippedRef.current) return

      try {
        localStorage.setItem('theme', theme)
        document.documentElement.setAttribute('data-theme', theme)
        window.dispatchEvent(new Event('portfolio:theme-change'))
      } catch { /* ignore */ }

      await delay(400); if (skippedRef.current) return
      print('')
      print(t.envSet(theme), 'green')
      await delay(800); if (skippedRef.current) return
      print('')

      await typeCmd('./portfolio.sh')
      await delay(400); if (skippedRef.current) return
      print('')
      print(t.mounting, 'muted')
      await delay(500); if (skippedRef.current) return
      print(t.loadingAssets, 'muted')
      await delay(500); if (skippedRef.current) return
      print(t.starting, 'muted')
      await delay(500); if (skippedRef.current) return
      print('')
      print(t.ready, 'green')
      await delay(1000); if (skippedRef.current) return

      finish()
    }
    run()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!visible) return null

  return (
    <div className={`${styles.wrap} ${!visible ? styles.fadeOut : ''}`}>
      <div className={styles.scanlines} />
      <div className={styles.output} ref={outRef} />
      <button className={styles.skip} onClick={finish}>skip →</button>
    </div>
  )
}
