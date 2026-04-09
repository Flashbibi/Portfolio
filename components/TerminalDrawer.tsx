'use client'

import { useEffect, useRef, useState } from 'react'
import { filesystem, getFileContent, type FsNode } from '@/data/projects'
import styles from './TerminalDrawer.module.css'
import { useLang } from '@/context/LanguageContext'
import { translations } from '@/data/translations'
import type { Lang } from '@/context/LanguageContext'

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
  const { lang } = useLang()
  const langRef = useRef<Lang>(lang)
  useEffect(() => { langRef.current = lang }, [lang])

  const outRef    = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLInputElement>(null)
  const [path, setPath]     = useState('~')
  const [booted, setBooted] = useState(false)
  const [height, setHeight] = useState(420)

  function startResize(startY: number) {
    const startHeight = height
    const onMove = (clientY: number) => {
      const newHeight = Math.max(180, Math.min(window.innerHeight * 0.9, startHeight + (startY - clientY)))
      setHeight(newHeight)
    }
    const onMouseMove = (ev: MouseEvent) => onMove(ev.clientY)
    const onTouchMove = (ev: TouchEvent) => onMove(ev.touches[0].clientY)
    const onEnd = () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onEnd)
      document.removeEventListener('touchmove', onTouchMove)
      document.removeEventListener('touchend', onEnd)
      document.body.style.userSelect = ''
    }
    document.body.style.userSelect = 'none'
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onEnd)
    document.addEventListener('touchmove', onTouchMove, { passive: true })
    document.addEventListener('touchend', onEnd)
  }

  function onHandleMouseDown(e: React.MouseEvent) {
    e.preventDefault()
    startResize(e.clientY)
  }

  function onHandleTouchStart(e: React.TouchEvent) {
    startResize(e.touches[0].clientY)
  }

  const historyRef    = useRef<string[]>([])
  const historyIdxRef = useRef(-1)

  useEffect(() => {
    if (open) {
      if (!booted) {
        setBooted(true)
        const t = translations[langRef.current].terminal
        dprint(t.welcome, 'muted')
        dprint(t.helpHint, 'muted')
        dprint('')
      }
      setTimeout(() => inputRef.current?.focus(), 350)
    }
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

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

    historyRef.current = [cmd, ...historyRef.current.slice(0, 49)]
    historyIdxRef.current = -1

    echoCmd(cmd)
    const [verb, arg = ''] = cmd.split(/\s+/)

    switch (verb) {
      case 'ls':     cmdLs(arg); break
      case 'cd':     cmdCd(arg, setPath); break
      case 'cat':    cmdCat(arg); break
      case 'dog':    cmdDog(arg); break
      case 'pwd':    dprint(path === '~' ? '/home/visitor' : '/home/visitor/' + path.replace('~/', '')); break
      case 'whoami':   dprint('visitor — curious developer', 'green'); break
      case 'clear':    if (outRef.current) outRef.current.innerHTML = ''; break
      case 'tree':     cmdTree(); break
      case 'help':     cmdHelp(); break
      case 'neofetch': cmdNeofetch(); break
      case 'sudo':     cmdSudo(cmd.slice(5).trim()); return
      default:       dprint(translations[langRef.current].terminal.commandNotFound(verb), 'red')
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
    if (!keys.length) { dprint(translations[langRef.current].terminal.empty, 'dim'); return }
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

  function dprintVideo(src: string) {
    const wrapper = document.createElement('div')
    wrapper.className = styles.line
    const video = document.createElement('video')
    video.src = src
    video.controls = true
    video.autoplay = true
    video.muted = true
    video.style.cssText = 'max-width:320px;display:block;margin-top:0.5rem;border:1px solid #333;'
    video.addEventListener('canplay', () => { video.muted = false })
    wrapper.appendChild(video)
    outRef.current?.appendChild(wrapper)
    if (outRef.current) outRef.current.scrollTop = outRef.current.scrollHeight
  }

  function cmdCat(arg: string) {
    const t = translations[langRef.current].terminal
    if (!arg) { dprint(t.catMissing, 'red'); return }
    const target = arg.startsWith('~') ? arg : (path === '~' ? '~/' + arg : path + '/' + arg)
    const node = getNode(target)
    if (!node)               { dprint(`cat: ${arg}: No such file or directory`, 'red'); return }
    if (node.type === 'dir') { dprint(`cat: ${arg}: Is a directory`, 'red'); return }

    let key = arg
    if (arg === 'README.md') {
      if (path.includes('GLAMOS'))   key = 'README.md (GLAMOS)'
      else if (path.includes('fab')) key = 'README.md (fabricator)'
      else if (path.includes('tur')) key = 'README.md (turret)'
    }

    const content = getFileContent(key, langRef.current) ?? getFileContent(arg, langRef.current)
    if (content) {
      content.forEach(([txt, cls]) => {
        if (txt.startsWith('__VIDEO__:')) {
          dprintVideo(txt.slice('__VIDEO__:'.length))
        } else {
          dprint(txt, cls)
        }
      })
    } else {
      dprint(t.noPreview, 'dim')
    }
  }

  function cmdDog(arg: string) {
    const t = translations[langRef.current].terminal
    if (!arg) { dprint(t.dogMissing, 'red'); return }
    const target = arg.startsWith('~') ? arg : (path === '~' ? '~/' + arg : path + '/' + arg)
    const node = getNode(target)
    if (!node)               { dprint(`dog: ${arg}: No such file or directory`, 'red'); return }
    if (node.type === 'dir') { dprint(`dog: ${arg}: Is a directory`, 'red'); return }
    if (!path.includes('private') || arg !== 'secrets.md') {
      dprint(t.dogWrongDir, 'red'); return
    }
    const l = langRef.current
    dprint('# ultra_secrets.md', 'amber')
    dprint('')
    dprint(l === 'de' ? 'du hast wirklich gesucht. respekt.' : 'you really searched hard. respect.', 'white')
    dprint('')
    dprint(l === 'de' ? '  🐶  ultra geheime aufzeichnung #001' : '  🐶  ultra secret recording #001', 'green')
    dprint('')
    const wrapper = document.createElement('div')
    wrapper.className = styles.line
    const img = document.createElement('img')
    img.src = '/Ultra%20Secret.jpg'
    img.alt = 'ultra secret'
    img.style.cssText = 'max-width:320px;display:block;margin-top:0.5rem;border:1px solid #333;'
    wrapper.appendChild(img)
    outRef.current?.appendChild(wrapper)
    if (outRef.current) outRef.current.scrollTop = outRef.current.scrollHeight
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
    lines.forEach(([txt, cls]) => dprint('  ' + txt, cls))
  }

  function cmdSudo(args: string) {
    const isRmRf = /^rm\s+(-rf|-r\s+-f|-f\s+-r)\s+(\/|~|\*|\.)/.test(args)
    if (!isRmRf) {
      dprint(`sudo: ${args.split(' ')[0] || 'command'}: command not found`, 'red')
      dprint('')
      return
    }

    const hasNoPreserve = args.includes('--no-preserve-root')

    if (!hasNoPreserve) {
      const lines: Array<[string, string, number]> = [
        ['[sudo] password for visitor: ', '',      0],
        ['••••••••',                       'dim',   700],
        ['',                               '',      1400],
        ["rm: it is dangerous to operate recursively on '/'",    'red',   1600],
        ["rm: use --no-preserve-root to override this failsafe", 'muted', 1950],
        ['',                               '',      2300],
      ]
      lines.forEach(([text, cls, ms]) => setTimeout(() => dprint(text, cls), ms))
      return
    }

    // Direct --no-preserve-root call
    const lines: Array<[string, string, number]> = [
      ['[sudo] password for visitor: ', '',      0],
      ['••••••••',                       'dim',   700],
      ['',                               '',      1400],
      ['rm: removing \'/bin\'',          'dim',   1600],
      ['rm: removing \'/boot\'',         'dim',   1900],
      ['rm: removing \'/etc\'',          'dim',   2150],
      ['rm: removing \'/lib\'',          'dim',   2370],
      ['rm: removing \'/lib64\'',        'dim',   2560],
      ['rm: removing \'/home\'',         'dim',   2720],
      ['rm: removing \'/usr\'',          'dim',   2850],
      ['rm: cannot remove \'/proc/1/fd/0\': Operation not permitted', 'muted', 3050],
      ['rm: cannot remove \'/proc/1/fd/1\': Operation not permitted', 'muted', 3200],
    ]
    lines.forEach(([text, cls, ms]) => setTimeout(() => dprint(text, cls), ms))
    // Silence — then the system dies
    setTimeout(() => window.dispatchEvent(new CustomEvent('rm-rf')), 3800)
  }

  function cmdNeofetch() {
    const a = '#d4a843'  // amber  — art
    const b = '#6aabdf'  // blue   — keys
    const d = '#555548'  // dim    — separators
    const w = '#f0ebe0'  // white  — values

    const art = [
      '  ┌──────────────────┐  ',
      '  │  ❯_              │  ',
      '  │                  │  ',
      '  │   ≋  ≋  ≋  ≋    │  ',
      '  │                  │  ',
      '  └──────────────────┘  ',
      '   ────────────────────  ',
      '   ██████████████████   ',
      '                        ',
      '                        ',
      '                        ',
      '                        ',
      '                        ',
    ]

    const info = [
      `<span style="color:${b}">visitor</span><span style="color:${d}">@</span><span style="color:${b}">linus-portfolio</span>`,
      `<span style="color:${d}">────────────────────────────</span>`,
      `<span style="color:${b}">OS</span><span style="color:${d}">:</span>       <span style="color:${w}">Zürich 24.04 LTS</span>`,
      `<span style="color:${b}">Host</span><span style="color:${d}">:</span>     <span style="color:${w}">linus-portfolio</span>`,
      `<span style="color:${b}">Kernel</span><span style="color:${d}">:</span>   <span style="color:${w}">6.6.87-portfolio #1</span>`,
      `<span style="color:${b}">Uptime</span><span style="color:${d}">:</span>   <span style="color:${w}">since 2024</span>`,
      `<span style="color:${b}">Shell</span><span style="color:${d}">:</span>    <span style="color:${w}">space-mono 4.0</span>`,
      `<span style="color:${b}">Terminal</span><span style="color:${d}">:</span> <span style="color:${w}">❯_ drawer v1.0</span>`,
      `<span style="color:${b}">CPU</span><span style="color:${d}">:</span>      <span style="color:${w}">Brain @ 3.2 thoughts/s</span>`,
      `<span style="color:${b}">GPU</span><span style="color:${d}">:</span>      <span style="color:${w}">Eyes (integrated)</span>`,
      `<span style="color:${b}">Memory</span><span style="color:${d}">:</span>   <span style="color:${w}">Kaffee / Kaffee</span>`,
      ``,
      [
        '#e05c5c','#d4a843','#5dba7e','#6aabdf','#a07fd4','#f0ebe0','#555548','#0c0d12',
      ].map(c => `<span style="color:${c}">███</span>`).join(''),
    ]

    const rows = Math.max(art.length, info.length)
    for (let i = 0; i < rows; i++) {
      const left = art[i] ?? '                        '
      const right = info[i] ?? ''
      dprintHTML(`<span style="color:${a};white-space:pre">${left}</span>${right}`)
    }
  }

  function cmdHelp() {
    const t = translations[langRef.current].terminal
    dprint(t.helpHeader, 'amber')
    t.commands.forEach(([c, d]) =>
      dprintHTML(
        `  <span style="color:#f0ebe0;display:inline-block;min-width:180px">${c}</span>` +
        `<span style="color:#555548">${d}</span>`
      )
    )
    dprint('')
    dprint(t.historyHint, 'muted')
    dprint(t.tabHint, 'muted')
  }

  const tNav = translations[lang].terminal

  return (
    <div
      className={`${styles.drawer} ${open ? styles.open : ''}`}
      style={{ height }}
      onClick={() => inputRef.current?.focus()}
    >
      <div className={styles.handle} onMouseDown={onHandleMouseDown} onTouchStart={onHandleTouchStart} onClick={e => e.stopPropagation()} />
      <div className={styles.scanlines} />
      <div className={styles.header}>
        <span className={styles.title}>❯_ terminal — linus-portfolio</span>
        <span className={styles.hint}>{tNav.headerHint}</span>
        <button className={styles.close} onClick={onClose}>{tNav.closeBtn}</button>
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
          autoCapitalize="none"
          spellCheck={false}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  )
}
