'use client'

import { useEffect, useRef, useState } from 'react'
import { filesystem, fileContents, type FsNode } from '@/data/projects'
import styles from './TerminalDrawer.module.css'

interface Props {
  open: boolean
  onClose: () => void
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function getNode(path: string): FsNode | null {
  if (path === '~') return filesystem
  const parts = path.replace(/^~\/?/, '').split('/').filter(Boolean)
  let node: FsNode = filesystem
  for (const p of parts) {
    if (node.type !== 'dir' || !node.children[p]) return null
    node = node.children[p]
  }
  return node
}

export default function TerminalDrawer({ open, onClose }: Props) {
  const outRef    = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLInputElement>(null)
  const [path, setPath]       = useState('~')
  const [booted, setBooted]   = useState(false)

  // Command history
  const historyRef    = useRef<string[]>([])
  const historyIdxRef = useRef(-1)

  useEffect(() => {
    if (open) {
      if (!booted) {
        setBooted(true)
        dprint('  Willkommen zurück. Erkunde die Dateien.', 'muted')
        dprint('  Tippe  help  für eine Liste der Befehle.', 'muted')
        dprint('')
      }
      setTimeout(() => inputRef.current?.focus(), 350)
    }
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps -- mount-only: effect intentionally runs once to boot the terminal sequence.

  function dprint(text: string, cls = '') {
    const p = document.createElement('p')
    p.className = [styles.line, cls ? styles[cls] : ''].filter(Boolean).join(' ')
    p.textContent = text
    outRef.current?.appendChild(p)
    if (outRef.current) outRef.current.scrollTop = outRef.current.scrollHeight
  }

  function dprintHTML(html: string) {
    const p = document.createElement('p')
    p.className = styles.line
    p.innerHTML = html
    outRef.current?.appendChild(p)
    if (outRef.current) outRef.current.scrollTop = outRef.current.scrollHeight
  }

  function echoCmd(cmd: string) {
    dprintHTML(
      `<span class="${styles.cu}">visitor</span>` +
      `<span class="${styles.ca}">@</span>` +
      `<span class="${styles.ch}">linus-portfolio</span>` +
      `<span class="${styles.cp}">${escapeHtml(path)}</span>` +
      `<span class="${styles.cs}"> $ </span>` +
      `<span style="color:#f0ebe0">${escapeHtml(cmd)}</span>`
    )
  }

  function handleCmd(raw: string) {
    const cmd = raw.trim()
    if (!cmd) return

    // Push to history, reset index
    historyRef.current = [cmd, ...historyRef.current.slice(0, 49)]
    historyIdxRef.current = -1

    echoCmd(cmd)
    const [verb, arg = ''] = cmd.split(/\s+/)

    switch (verb) {
      case 'ls':     cmdLs(arg); break
      case 'cd':     cmdCd(arg, setPath); break
      case 'cat':    cmdCat(arg); break
      case 'pwd':    dprint(path === '~' ? '/home/visitor' : '/home/visitor/' + path.replace('~/', '')); break
      case 'whoami': dprint('visitor — curious developer', 'green'); break
      case 'clear':  if (outRef.current) outRef.current.innerHTML = ''; break
      case 'tree':   cmdTree(); break
      case 'help':   cmdHelp(); break
      default:       dprint(`bash: ${verb}: command not found  (tippe 'help')`, 'red')
    }
    dprint('')
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    const input = inputRef.current
    if (!input) return

    if (e.key === 'Enter') {
      const val = input.value
      input.value = ''
      handleCmd(val)
      return
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const history = historyRef.current
      const nextIdx = Math.min(historyIdxRef.current + 1, history.length - 1)
      historyIdxRef.current = nextIdx
      input.value = history[nextIdx] ?? ''
      // Move cursor to end
      setTimeout(() => input.setSelectionRange(input.value.length, input.value.length), 0)
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const nextIdx = historyIdxRef.current - 1
      historyIdxRef.current = nextIdx
      input.value = nextIdx < 0 ? '' : (historyRef.current[nextIdx] ?? '')
      setTimeout(() => input.setSelectionRange(input.value.length, input.value.length), 0)
      return
    }

    if (e.key === 'Tab') {
      e.preventDefault()
      handleTabComplete(input)
      return
    }
  }

  function handleTabComplete(input: HTMLInputElement) {
    const val = input.value
    const parts = val.split(/\s+/)
    const partial = parts[parts.length - 1]

    // Resolve the directory to search in
    let searchDir = path
    let prefix = ''
    const slashIdx = partial.lastIndexOf('/')
    if (slashIdx >= 0) {
      const dirPart = partial.slice(0, slashIdx)
      prefix = partial.slice(0, slashIdx + 1)
      searchDir = dirPart.startsWith('~')
        ? dirPart
        : (path === '~' ? '~/' + dirPart : path + '/' + dirPart)
    }

    const node = getNode(searchDir)
    if (!node || node.type !== 'dir') return

    const fragment = partial.slice(slashIdx + 1)
    const matches = Object.keys(node.children).filter(k =>
      k.toLowerCase().startsWith(fragment.toLowerCase())
    )

    if (matches.length === 0) return

    if (matches.length === 1) {
      const match = matches[0]
      const isDir = node.children[match].type === 'dir'
      const completed = prefix + match + (isDir ? '/' : '')
      parts[parts.length - 1] = completed
      input.value = parts.join(' ')
    } else {
      // Show possible completions
      dprint('')
      dprintHTML(
        '  ' + matches.map(m => {
          const isDir = node.children[m].type === 'dir'
          const color = isDir ? '#6aabdf' : '#f0ebe0'
          return `<span style="color:${color};display:inline-block;min-width:160px">${m}${isDir ? '/' : ''}</span>`
        }).join('')
      )
      dprint('')
    }
  }

  function cmdLs(arg: string) {
    const target = arg
      ? (arg.startsWith('~') ? arg : (path === '~' ? '~/' + arg : path + '/' + arg))
      : path
    const node = getNode(target)
    if (!node) { dprint(`ls: ${arg || '.'}: No such file or directory`, 'red'); return }
    if (node.type === 'file') { dprint(arg); return }
    const keys = Object.keys(node.children)
    if (!keys.length) { dprint('(leer)', 'dim'); return }
    const html = keys.map(k => {
      const n = node.children[k]
      if (n.type === 'dir')
        return `<span style="color:#6aabdf;display:inline-block;min-width:180px">${k}/</span>`
      if (n.type === 'file' && n.exec)
        return `<span style="color:#5dba7e;display:inline-block;min-width:180px">${k}*</span>`
      return `<span style="color:#f0ebe0;display:inline-block;min-width:180px">${k}</span>`
    }).join('')
    dprintHTML('  ' + html)
  }

  function cmdCd(arg: string, setP: (p: string) => void) {
    if (!arg || arg === '~') { setP('~'); return }
    if (arg === '..') {
      if (path === '~') return
      const parts = path.split('/')
      parts.pop()
      setP(parts.join('/') || '~')
      return
    }
    const target = arg.startsWith('~') ? arg : (path === '~' ? '~/' + arg : path + '/' + arg)
    const node = getNode(target)
    if (!node)              { dprint(`cd: ${arg}: No such file or directory`, 'red'); return }
    if (node.type !== 'dir') { dprint(`cd: ${arg}: Not a directory`, 'red'); return }
    setP(target)
  }

  function cmdCat(arg: string) {
    if (!arg) { dprint('cat: fehlender Dateiname', 'red'); return }
    const target = arg.startsWith('~') ? arg : (path === '~' ? '~/' + arg : path + '/' + arg)
    const node = getNode(target)
    if (!node)               { dprint(`cat: ${arg}: No such file or directory`, 'red'); return }
    if (node.type === 'dir') { dprint(`cat: ${arg}: Is a directory`, 'red'); return }

    // Disambiguate README.md by current path
    let key = arg
    if (arg === 'README.md') {
      if (path.includes('GLAMOS'))   key = 'README.md (GLAMOS)'
      else if (path.includes('fab')) key = 'README.md (fabricator)'
      else if (path.includes('tur')) key = 'README.md (turret)'
    }

    const content = fileContents[key] ?? fileContents[arg]
    if (content) {
      content.forEach(([t, c]) => dprint(t, c))
    } else {
      dprint('(keine Vorschau)', 'dim')
    }
  }

  function cmdTree() {
    const lines: [string, string][] = [
      ['~/linus', 'amber'],
      ['├── about.md', 'white'],
      ['├── contact.md', 'white'],
      ['├── portfolio.sh*', 'green'],
      ['└── projects/', 'blue'],
      ['    ├── GLAMOS/', 'blue'],
      ['    │   └── README.md', 'white'],
      ['    ├── fabricator/', 'blue'],
      ['    │   └── README.md', 'white'],
      ['    └── turret/', 'blue'],
      ['        ├── README.md', 'white'],
      ['        └── v8_notes.md', 'white'],
    ]
    lines.forEach(([t, c]) => dprint('  ' + t, c))
  }

  function cmdHelp() {
    dprint('Verfügbare Befehle:', 'amber')
    const cmds: [string, string][] = [
      ['ls [dir]',    'Ordnerinhalt anzeigen'],
      ['cd <dir>',    'Verzeichnis wechseln  (cd .., cd ~)'],
      ['cat <file>',  'Datei lesen'],
      ['tree',        'Gesamte Struktur anzeigen'],
      ['pwd',         'Aktuellen Pfad'],
      ['whoami',      'Wer bin ich'],
      ['clear',       'Terminal leeren'],
    ]
    cmds.forEach(([c, d]) =>
      dprintHTML(
        `  <span style="color:#f0ebe0;display:inline-block;min-width:180px">${c}</span>` +
        `<span style="color:#555548">${d}</span>`
      )
    )
    dprint('')
    dprint('  ↑ / ↓   Befehlsverlauf durchsuchen', 'muted')
    dprint('  Tab     Dateinamen vervollständigen', 'muted')
  }

  return (
    <div
      className={`${styles.drawer} ${open ? styles.open : ''}`}
      onClick={() => inputRef.current?.focus()}
    >
      <div className={styles.scanlines} />
      <div className={styles.header}>
        <span className={styles.title}>❯_ terminal — linus-portfolio</span>
        <span className={styles.hint}>tippe 'help' für Befehle</span>
        <button className={styles.close} onClick={onClose}>[ schliessen ]</button>
      </div>

      <div className={styles.output} ref={outRef} />

      <div className={styles.promptRow}>
        <span className={styles.cu}>visitor</span>
        <span className={styles.ca}>@</span>
        <span className={styles.ch}>linus-portfolio</span>
        <span className={styles.cp}>{path}</span>
        <span className={styles.cs}> $ </span>
        <input
          ref={inputRef}
          className={styles.input}
          type="text"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  )
}
