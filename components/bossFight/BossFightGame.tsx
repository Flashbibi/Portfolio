'use client'

import { useEffect, useRef } from 'react'
import { CW, CH } from '@/components/bossFight/constants'
import { GameState } from '@/components/bossFight/types'
import { createInitialState, update, draw } from '@/lib/bossFight/gameLoop'
import { loadCatSprite } from '@/lib/bossFight/catSprite'

export default function BossFightGame() {
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const stateRef     = useRef<GameState>(createInitialState())
  const keysRef      = useRef<Set<string>>(new Set())
  const rafRef       = useRef<number>(0)
  const lastTimeRef  = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.imageSmoothingEnabled = false
    loadCatSprite()
    lastTimeRef.current = performance.now()

    function onKeyDown(e: KeyboardEvent) {
      const k = e.key
      keysRef.current.add(k)

      // Restart on R when not actively playing
      if ((k === 'r' || k === 'R') && stateRef.current.mode !== 'playing') {
        stateRef.current = createInitialState()
      }

      // Prevent arrow keys / space from scrolling the page while game is open
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(k)) {
        e.preventDefault()
      }
    }

    function onKeyUp(e: KeyboardEvent) {
      keysRef.current.delete(e.key)
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup',   onKeyUp)

    function loop(now: number) {
      // dt is normalized to 1.0 at 60fps; capped at 50ms to absorb tab-unfocus spikes
      const dt = Math.min(now - lastTimeRef.current, 50) / (1000 / 60)
      lastTimeRef.current = now
      update(stateRef.current, keysRef.current, dt)
      // Edge-triggered keys are consumed by update — clear them after each frame
      keysRef.current.clear()
      draw(ctx!, stateRef.current)
      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup',   onKeyUp)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      width={CW}
      height={CH}
      style={{
        display:        'block',
        width:          CW + 'px',
        height:         CH + 'px',
        imageRendering: 'pixelated',
      }}
    />
  )
}
