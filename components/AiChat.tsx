'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { marked } from 'marked'
import styles from './AiChat.module.css'
import { useLang } from '@/context/LanguageContext'
import { translations } from '@/data/translations'

// Configure marked for inline-friendly output
marked.setOptions({ breaks: true })

interface Message {
  role: 'user' | 'assistant'
  content: string
  error?: boolean
}

interface Props {
  open: boolean
  onClose: () => void
  terminalOpen?: boolean
}

const LS_KEY = 'aichat_messages'
const MAX_USER_MESSAGES = 20
const MAX_INPUT_LENGTH = 500

function loadMessages(): Message[] | null {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return null
    return JSON.parse(raw) as Message[]
  } catch {
    return null
  }
}

function saveMessages(msgs: Message[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(msgs))
  } catch { /* ignore quota errors */ }
}

export default function AiChat({ open, onClose, terminalOpen = false }: Props) {
  const { lang } = useLang()
  const t = translations[lang].chat

  const makeWelcome = useCallback(
    (): Message => ({ role: 'assistant', content: t.welcome }),
    [t.welcome]
  )

  // All state starts from SSR-safe defaults, localStorage is loaded after mount
  const [messages, setMessages]     = useState<Message[]>(() => [makeWelcome()])
  const [input, setInput]           = useState('')
  const [loading, setLoading]       = useState(false)
  const [remaining, setRemaining]   = useState<number | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(true)

  const bottomRef   = useRef<HTMLDivElement>(null)
  const messagesRef = useRef<HTMLDivElement>(null)
  const inputRef    = useRef<HTMLInputElement>(null)

  // Load persisted state from localStorage after mount (client-only)
  useEffect(() => {
    const saved = loadMessages()
    if (saved && saved.length > 1) {
      setMessages(saved)
      setShowSuggestions(false)
    }
    const savedRemaining = localStorage.getItem('aichat_remaining')
    if (savedRemaining !== null) setRemaining(Number(savedRemaining))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Persist messages to localStorage
  useEffect(() => {
    saveMessages(messages)
  }, [messages])

  // Reset welcome message on language change (only if conversation is fresh)
  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && prev[0].role === 'assistant') {
        return [makeWelcome()]
      }
      return prev
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang])

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Focus input when opened
  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  // Escape to close
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  // Add copy buttons to code blocks after render
  useEffect(() => {
    const container = messagesRef.current
    if (!container) return

    container.querySelectorAll<HTMLElement>('pre').forEach(pre => {
      if (pre.querySelector('.ai-copy-btn')) return
      const btn = document.createElement('button')
      btn.textContent = 'copy'
      btn.className = 'ai-copy-btn'
      btn.onclick = () => {
        const code = pre.querySelector('code')?.textContent ?? pre.textContent ?? ''
        navigator.clipboard.writeText(code).then(() => {
          btn.textContent = t.copied
          setTimeout(() => { btn.textContent = 'copy' }, 2000)
        })
      }
      pre.appendChild(btn)
    })
  }, [messages, t.copied])

  function clearChat() {
    const fresh = [makeWelcome()]
    setMessages(fresh)
    setShowSuggestions(true)
    saveMessages(fresh)
    // Keep remaining counter — it's server-side, clearing chat doesn't reset it
  }

  const userMessageCount = messages.filter(m => m.role === 'user').length
  const limitReached = userMessageCount >= MAX_USER_MESSAGES

  async function send(text?: string) {
    const txt = (text ?? input).trim()
    if (!txt || loading || limitReached) return

    const userMsg: Message = { role: 'user', content: txt }
    const next = [...messages, userMsg]
    setMessages(next)
    setInput('')
    setLoading(true)
    setShowSuggestions(false)

    // Placeholder for streaming response
    const placeholder: Message = { role: 'assistant', content: '' }
    setMessages(prev => [...prev, placeholder])

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: next.map(m => ({ role: m.role, content: m.content })),
        }),
      })

      const rem = res.headers.get('X-RateLimit-Remaining')
      if (rem !== null) {
        setRemaining(Number(rem))
        localStorage.setItem('aichat_remaining', rem)
      }

      if (res.status === 429) {
        setMessages(prev => [
          ...prev.slice(0, -1),
          { role: 'assistant', content: t.rateLimited, error: true },
        ])
        setLoading(false)
        return
      }

      if (!res.ok || !res.body) throw new Error()

      const reader  = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      const flush = (char: string) =>
        new Promise<void>(resolve => {
          setTimeout(() => {
            setMessages(prev => {
              const last = prev[prev.length - 1]
              return [...prev.slice(0, -1), { ...last, content: last.content + char }]
            })
            resolve()
          }, 8)
        })

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        // Drain buffer char by char
        while (buffer.length > 0) {
          await flush(buffer[0])
          buffer = buffer.slice(1)
        }
      }
    } catch {
      setMessages(prev => [
        ...prev.slice(0, -1),
        { role: 'assistant', content: t.error, error: true },
      ])
    } finally {
      setLoading(false)
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter') send()
  }

  return (
    <div
      className={`${styles.chat} ${open ? styles.open : ''}`}
      role="dialog"
      aria-label="AI Chat"
    >
      {/* Scanline overlay */}
      <div className={styles.scanlines} aria-hidden />

      {/* Header */}
      <div className={styles.header}>
        <span className={styles.title}>{t.header}</span>
        <div className={styles.headerActions}>
          {remaining !== null && (
            <span className={styles.rateLimit}>{remaining}/{20}</span>
          )}
          <button className={styles.clearBtn} onClick={clearChat} aria-label="Clear chat">
            [ {t.clear} ]
          </button>
          <button className={styles.close} onClick={onClose} aria-label="Schliessen">
            [ x ]
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className={styles.messages} ref={messagesRef}>
        {messages.map((msg, i) =>
          msg.role === 'user' ? (
            <p key={i} className={styles.userMsg}>
              <span className={styles.userPrefix}>&gt;&nbsp;</span>
              {msg.content}
            </p>
          ) : (
            <div key={i} className={`${styles.assistantMsg} ${msg.error ? styles.errorMsg : ''}`}>
              <span className={styles.assistantPrefix}>cat$&nbsp;</span>
              {loading && i === messages.length - 1 && msg.content === '' ? (
                <span className={styles.loadingCursor}>▋▋▋</span>
              ) : (
                <span
                  className={styles.markdownContent}
                  dangerouslySetInnerHTML={{ __html: marked.parse(msg.content) as string }}
                />
              )}
            </div>
          )
        )}

        {/* Suggestion chips */}
        {showSuggestions && !loading && (
          <div className={styles.suggestions}>
            {t.suggestions.map((s, i) => (
              <button key={i} className={styles.suggestionChip} onClick={() => send(s)}>
                {s}
              </button>
            ))}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input row */}
      <div className={styles.promptRow}>
        <span className={styles.promptSymbol}>&gt;&nbsp;</span>
        <input
          ref={inputRef}
          className={styles.input}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          disabled={loading || limitReached}
          placeholder={limitReached ? (lang === 'de' ? 'Limit erreicht — Chat leeren zum Fortfahren' : 'Limit reached — clear chat to continue') : t.placeholder}
          maxLength={MAX_INPUT_LENGTH}
          autoComplete="off"
          spellCheck={false}
        />
      </div>
    </div>
  )
}
