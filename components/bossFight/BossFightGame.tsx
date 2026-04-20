'use client'

import { useEffect, useRef } from 'react'
import { CW, CH } from '@/components/bossFight/constants'
import { GameState } from '@/components/bossFight/types'
import { createInitialState, createPlayingState, update, draw } from '@/lib/bossFight/gameLoop'
import { loadCatSprite } from '@/lib/bossFight/catSprite'
import { useAchievement } from '@/context/AchievementContext'

export default function BossFightGame() {
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const stateRef     = useRef<GameState>(createInitialState())
  const keysRef      = useRef<Set<string>>(new Set())
  const rafRef       = useRef<number>(0)
  const lastTimeRef  = useRef<number>(0)
  const heldRef      = useRef<Set<string>>(new Set())
  const pausedRef    = useRef<boolean>(false)
  const { unlock }   = useAchievement()
  const unlockRef    = useRef(unlock)
  unlockRef.current  = unlock

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
      heldRef.current.add(k)

      // Restart on R only from end states — start screen uses SPACE
      if ((k === 'r' || k === 'R') &&
          (stateRef.current.mode === 'gameover' || stateRef.current.mode === 'victory')) {
        stateRef.current = createPlayingState()
      }

      // Prevent arrow keys / space from scrolling the page while game is open
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(k)) {
        e.preventDefault()
      }
    }

    function onKeyUp(e: KeyboardEvent) {
      keysRef.current.delete(e.key)
      heldRef.current.delete(e.key)
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup',   onKeyUp)

    function loop(now: number) {
      // dt is normalized to 1.0 at 60fps; capped at 50ms to absorb tab-unfocus spikes
      const dt = Math.min(now - lastTimeRef.current, 50) / (1000 / 60)
      lastTimeRef.current = now
      // Re-add SPACE each frame while held, so shooting is continuous
      if (heldRef.current.has(' ')) keysRef.current.add(' ')
      update(stateRef.current, keysRef.current, dt, (id) => unlockRef.current(id))
      // Edge-triggered keys are consumed by update — clear them after each frame
      keysRef.current.clear()
      draw(ctx!, stateRef.current)
      rafRef.current = requestAnimationFrame(loop)
    }

    // Pause loop when tab is hidden to prevent deltaTime explosion on return
    function onVisibilityChange() {
      if (document.hidden) {
        cancelAnimationFrame(rafRef.current)
        pausedRef.current = true
      } else if (pausedRef.current) {
        pausedRef.current       = false
        lastTimeRef.current     = performance.now()
        rafRef.current          = requestAnimationFrame(loop)
      }
    }

    document.addEventListener('visibilitychange', onVisibilityChange)

    rafRef.current = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup',   onKeyUp)
      document.removeEventListener('visibilitychange', onVisibilityChange)
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
        cursor:         'crosshair',
      }}
    />
  )
}
