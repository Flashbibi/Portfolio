'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './DestructionOverlay.module.css'

interface Props {
  active: boolean
}


export default function DestructionOverlay({ active }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef    = useRef<number>(0)
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    if (!active) return

    setPhase(0)

    const PHASE4_START_MS = 9100
    const BLACKOUT_DURATION_MS = 2500
    const PANIC_DURATION_MS = 8000

    const set = (ms: number, fn: () => void) => setTimeout(fn, ms)
    const html = document.documentElement

    // All offsets are absolute from the moment active becomes true
    const t1 = set(800,   () => { setPhase(1); html.setAttribute('data-destroying', '1') })
    const t2 = set(4800,  () => { setPhase(2); html.setAttribute('data-destroying', '2') })
    const t3 = set(7300,  () => { setPhase(3) })
    const t4 = set(PHASE4_START_MS, () => { setPhase(4); html.setAttribute('data-destroying', '3') })
    const t5 = set(PHASE4_START_MS + BLACKOUT_DURATION_MS, () => { setPhase(5) })
    const t6 = set(PHASE4_START_MS + BLACKOUT_DURATION_MS + PANIC_DURATION_MS, () => {
      html.removeAttribute('data-destroying')
      window.location.reload()
    })

    return () => {
      [t1, t2, t3, t4, t5, t6].forEach(clearTimeout)
      html.removeAttribute('data-destroying')
    }
  }, [active])

  // Canvas GPU-artifact loop for phase 3 only — ramps up over 5s
  useEffect(() => {
    cancelAnimationFrame(rafRef.current)
    if (!active || phase !== 3) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight

    const startTime = performance.now()
    const duration  = 1800 // matches the wait before phase 4

    function draw(now: number) {
      if (!canvas || !ctx) return
      const w = canvas.width
      const h = canvas.height

      // t: 0 at start → 1 at end (ease-in curve so it starts slow)
      const raw = Math.min((now - startTime) / duration, 1)
      const t   = raw * raw  // quadratic ease-in

      ctx.clearRect(0, 0, w, h)

      // Horizontal displacement bands (grayscale — real GPU artifact look)
      const numBands = Math.floor(1 + t * 14)
      for (let i = 0; i < numBands; i++) {
        const y      = Math.random() * h
        const bh     = Math.random() * (4 + t * 20) + 1
        const offset = (Math.random() - 0.5) * (t * 120)
        const lum    = Math.floor(160 + Math.random() * 95)
        const alpha  = (0.05 + Math.random() * 0.4) * t
        ctx.fillStyle = `rgba(${lum},${lum},${lum},${alpha})`
        ctx.fillRect(offset, y, w, bh)
      }

      // Blocky noise patches
      const numBlocks = Math.floor(t * 12)
      for (let i = 0; i < numBlocks; i++) {
        const bx  = Math.random() * w
        const by  = Math.random() * h
        const bw  = Math.random() * (50 + t * 200) + 10
        const bh2 = Math.random() * 5 + 1
        const lum = Math.floor(Math.random() * 255)
        ctx.fillStyle = `rgba(${lum},${lum},${lum},${(0.1 + Math.random() * 0.5) * t})`
        ctx.fillRect(bx, by, bw, bh2)
      }

      // Green channel flash — only appears towards the end
      if (t > 0.5 && Math.random() < t * 0.15) {
        const gy = Math.random() * h
        ctx.fillStyle = `rgba(80,220,80,${Math.random() * 0.4 * t})`
        ctx.fillRect(0, gy, w, Math.random() * 3 + 1)
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(rafRef.current)
  }, [active, phase])

  if (!active) return null

  return (
    <>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        style={{ opacity: phase === 3 ? 1 : 0 }}
      />

      {/* Blackout starts hard and remains as the panic background */}
      {phase >= 4 && <div className={styles.blackout} />}

      {phase >= 5 && (
        <div className={styles.panic}>
          <p className={styles.pDim}>[  0.000000] Linux version 6.6.87-portfolio (gcc version 13.3.0)</p>
          <p className={styles.pDim}>[  0.000000] Command line: BOOT_IMAGE=/vmlinuz root=/dev/sda1</p>
          <p className={styles.pLine}>&nbsp;</p>
          <p className={styles.pLine}>[  4.218341] Kernel panic - not syncing: Attempted to kill init!</p>
          <p className={styles.pLine}>[  4.218342] CPU: 0 PID: 1 Comm: init Not tainted 6.6.87 #1</p>
          <p className={styles.pLine}>[  4.218343] Hardware name: linus-portfolio/portfolio, BIOS 2.0</p>
          <p className={styles.pDim}>&nbsp;</p>
          <p className={styles.pDim}>[  4.218344] Call Trace:</p>
          <p className={styles.pDim}>[  4.218345]  &lt;TASK&gt;</p>
          <p className={styles.pDim}>[  4.218346]  dump_stack_lvl+0x4a/0x60</p>
          <p className={styles.pDim}>[  4.218347]  panic+0x10e/0x2d0</p>
          <p className={styles.pDim}>[  4.218348]  do_exit+0x8a4/0xb20</p>
          <p className={styles.pDim}>[  4.218349]  do_group_exit+0x33/0xa0</p>
          <p className={styles.pDim}>[  4.218350]  get_signal+0x174/0x840</p>
          <p className={styles.pLine}>&nbsp;</p>
          <p className={styles.pLine}>[  4.218351] ---[ end Kernel panic - not syncing: Attempted to kill init! ]---</p>
          <p className={styles.pLine}>&nbsp;</p>
          <p className={styles.pAmber}>[  7.000000] reboot: System halted — press any key to restart</p>
        </div>
      )}
    </>
  )
}
