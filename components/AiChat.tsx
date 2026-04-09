'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './AiChat.module.css'
import { useLang } from '@/context/LanguageContext'
import { translations } from '@/data/translations'

interface Message {
  role: 'user' | 'assistant'
  content: string
  error?: boolean
}

interface Props {
  open: boolean
  onClose: () => void
}

export default function AiChat({ open, onClose }: Props) {
  const { lang } = useLang()
  const t = translations[lang].chat
  const welcome: Message = { role: 'assistant', content: t.welcome }
  const [messages, setMessages] = useState<Message[]>([welcome])
  const [input, setInput]       = useState('')
  const [loading, setLoading]   = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLInputElement>(null)

  // Reset welcome message on language change
  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && prev[0].role === 'assistant') {
        return [{ role: 'assistant', content: t.welcome }]
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

  async function send() {
    const text = input.trim()
    if (!text || loading) return

    const userMsg: Message = { role: 'user', content: text }
    const next = [...messages, userMsg]
    setMessages(next)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: next.map(m => ({ role: m.role, content: m.content })),
        }),
      })

      if (!res.ok) throw new Error()
      const { reply } = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch {
      setMessages(prev => [
        ...prev,
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
    <div className={`${styles.chat} ${open ? styles.open : ''}`} role="dialog" aria-label="AI Chat">
      {/* Scanline overlay */}
      <div className={styles.scanlines} aria-hidden />

      {/* Header */}
      <div className={styles.header}>
        <span className={styles.title}>{t.header}</span>
        <button className={styles.close} onClick={onClose} aria-label="Schliessen">
          [ x ]
        </button>
      </div>

      {/* Messages */}
      <div className={styles.messages}>
        {messages.map((msg, i) =>
          msg.role === 'user' ? (
            <p key={i} className={styles.userMsg}>
              <span className={styles.userPrefix}>&gt;&nbsp;</span>
              {msg.content}
            </p>
          ) : (
            <p key={i} className={`${styles.assistantMsg} ${msg.error ? styles.errorMsg : ''}`}>
              <span className={styles.assistantPrefix}>cat$&nbsp;</span>
              {msg.content}
            </p>
          )
        )}

        {loading && (
          <p className={styles.assistantMsg}>
            <span className={styles.assistantPrefix}>cat$&nbsp;</span>
            <span className={styles.loadingCursor}>▋▋▋</span>
          </p>
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
          disabled={loading}
          placeholder={t.placeholder}
          autoComplete="off"
          spellCheck={false}
        />
      </div>
    </div>
  )
}
