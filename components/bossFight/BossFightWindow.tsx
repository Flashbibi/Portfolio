'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './BossFightWindow.module.css'
import { useAchievement } from '@/context/AchievementContext'

interface Props {
  onClose: () => void
  children?: React.ReactNode
}

export default function BossFightWindow({ onClose, children }: Props) {
  const windowRef      = useRef<HTMLDivElement>(null)
  const [pos, setPos]  = useState({ x: 0, y: 0 })
  const [visible, setVisible] = useState(false)
  const { unlock }     = useAchievement()

  useEffect(() => { unlock('bug-hunter') }, [unlock])

  useEffect(() => {
    const el = windowRef.current
    if (!el) return
    setPos({
      x: Math.max(0, (window.innerWidth - el.offsetWidth) / 2),
      y: Math.max(0, (window.innerHeight - el.offsetHeight) / 2),
    })
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true))
    })
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleClose() {
    setVisible(false)
    setTimeout(onClose, 200)
  }

  function onTitleBarMouseDown(e: React.MouseEvent) {
    e.preventDefault()
    const startX = e.clientX
    const startY = e.clientY
    const origX = pos.x
    const origY = pos.y

    function onMouseMove(ev: MouseEvent) {
      const el = windowRef.current
      if (!el) return
      const dx = ev.clientX - startX
      const dy = ev.clientY - startY
      const newX = Math.max(0, Math.min(window.innerWidth - el.offsetWidth, origX + dx))
      const newY = Math.max(0, Math.min(window.innerHeight - 32, origY + dy))
      setPos({ x: newX, y: newY })
    }

    function onMouseUp() {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      document.body.style.userSelect = ''
    }

    document.body.style.userSelect = 'none'
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  return (
    <>
      <div className={styles.backdrop} />
      <div
        ref={windowRef}
        className={`${styles.window} ${visible ? styles.visible : ''}`}
        style={{ left: pos.x, top: pos.y }}
        role="dialog"
        aria-modal="true"
        aria-label="bug-hunter.exe"
      >
        <div className={styles.titleBar} onMouseDown={onTitleBarMouseDown}>
          <span className={styles.titleText}>bug-hunter.exe</span>
          <button className={styles.closeBtn} onClick={handleClose} aria-label="Close">✕</button>
        </div>
        <div className={styles.body}>
          {children}
        </div>
      </div>
    </>
  )
}
