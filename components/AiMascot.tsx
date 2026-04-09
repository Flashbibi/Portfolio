'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './AiMascot.module.css'

const MESSAGES = [
  "Psst... schau dir mal die Projekte an 👀",
  "Written in Space Mono since 2025.",
  "3D-Druck um 2 Uhr nachts ist völlig normal.",
  "cat about.md // empfohlen",
  "Ich bin aus Pixeln gemacht. Respekt.",
  "sudo apt-get install coffee",
  "Der Turret ist... sagen wir, ein Hobbyprojekt.",
  "Linus tippt gerade irgendwo Code.",
  "Have you tried turning it off and on again?",
  "print('Hallo Welt') war der Anfang von allem.",
]

// Sprite sheet: 256×320 px, 32×32 per frame, 8 cols × 10 rows
const FRAME_SIZE   = 32
const DISPLAY_SIZE = 128
const WALK_SPEED   = 1.5

const ANIMS = {
  idle:     { y:   0, frames: 4, ms: 150 },  // row 1
  lookup:   { y:  32, frames: 4, ms: 150 },  // row 2 — look up
  sit:      { y:  64, frames: 4, ms: 250 },  // row 3
  look:     { y:  96, frames: 4, ms: 180 },  // row 4
  walk:     { y: 128, frames: 8, ms: 100 },  // row 5
  struggle: { y: 128, frames: 8, ms:  40 },  // row 5 fast — grabbed
  fall:     { y: 288, frames: 8, ms:  80 },  // row 10 — falling
} as const
type AnimKey = keyof typeof ANIMS

const IDLE_ANIMS: AnimKey[] = ['idle', 'sit', 'look']

function buildSheet(img: HTMLImageElement): HTMLCanvasElement {
  const sheet  = document.createElement('canvas')
  sheet.width  = img.naturalWidth
  sheet.height = img.naturalHeight
  const ctx    = sheet.getContext('2d')!
  ctx.drawImage(img, 0, 0)

  const W = sheet.width, H = sheet.height
  const imageData = ctx.getImageData(0, 0, W, H)
  const d         = imageData.data

  const isBg  = new Uint8Array(W * H)
  const queue: number[] = []

  const tryAdd = (x: number, y: number) => {
    const ni = y * W + x
    if (isBg[ni]) return
    const pi = ni * 4
    if (d[pi] + d[pi + 1] + d[pi + 2] < 90) { isBg[ni] = 1; queue.push(ni) }
  }

  for (let x = 0; x < W; x++) { tryAdd(x, 0); tryAdd(x, H - 1) }
  for (let y = 1; y < H - 1; y++) { tryAdd(0, y); tryAdd(W - 1, y) }

  while (queue.length) {
    const idx = queue.pop()!
    const cx = idx % W, cy = (idx / W) | 0
    if (cx > 0)     tryAdd(cx - 1, cy)
    if (cx < W - 1) tryAdd(cx + 1, cy)
    if (cy > 0)     tryAdd(cx, cy - 1)
    if (cy < H - 1) tryAdd(cx, cy + 1)
  }

  for (let i = 0; i < d.length; i += 4) {
    if (isBg[i >> 2]) { d[i + 3] = 0; continue }
    const t  = (d[i] + d[i + 1] + d[i + 2]) / 765
    d[i]     = Math.round(t * 0xd4 + (1 - t) * 0x2d)
    d[i + 1] = Math.round(t * 0xa8 + (1 - t) * 0x1f)
    d[i + 2] = Math.round(t * 0x43 + (1 - t) * 0x00)
    d[i + 3] = 255
  }

  ctx.putImageData(imageData, 0, 0)
  return sheet
}

interface Props {
  onClick:  () => void
  chatOpen: boolean
}

export default function AiMascot({ onClick, chatOpen }: Props) {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const tintedRef  = useRef<HTMLCanvasElement | null>(null)

  // Animation
  const animRef     = useRef<AnimKey>('idle')
  const prevAnimRef = useRef<AnimKey>('idle')
  const frameIdxRef = useRef(0)
  const lastTickRef = useRef(0)
  const rafRef      = useRef<number>(0)

  // Auto-walk
  const posXRef       = useRef(-1)
  const targetXRef    = useRef(-1)
  const movingRef     = useRef(false)
  const dirRef        = useRef<1 | -1>(1)
  const pauseUntilRef = useRef(0)


  // Drag
  const onClickRef       = useRef(onClick)
  useEffect(() => { onClickRef.current = onClick }, [onClick])
  const isDraggingRef    = useRef(false)
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dragOffsetXRef   = useRef(0)
  const dragOffsetYRef   = useRef(0)
  const [isDragging, setIsDragging] = useState(false)

  // Hover
  const hoveredRef = useRef(false)
  const [hovered, setHovered] = useState(false)

  // Speech bubble
  const timerRef  = useRef<ReturnType<typeof setTimeout> | null>(null)
  const bubbleRef = useRef<HTMLDivElement>(null)
  const [bubble, setBubble] = useState<string | null>(null)

  // ── Load sprite ────────────────────────────────────────────────────────────
  useEffect(() => {
    const img = new Image()
    img.src    = '/cat-sprite.png'
    img.onload = () => { tintedRef.current = buildSheet(img) }
  }, [])

  // ── Init position ──────────────────────────────────────────────────────────
  useEffect(() => {
    const margin = 32
    const startX = window.innerWidth - DISPLAY_SIZE - margin
    posXRef.current    = startX
    targetXRef.current = startX
    if (wrapperRef.current) {
      wrapperRef.current.style.left  = `${startX}px`
      wrapperRef.current.style.right = 'auto'
    }
    pauseUntilRef.current = Date.now() + 2000 + Math.random() * 3000
    pickTarget()
  }, [])

  function pickTarget() {
    const margin = 20
    const max    = window.innerWidth - DISPLAY_SIZE - margin
    targetXRef.current = margin + Math.random() * (max - margin)
  }


  // ── Drag ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const remPx = () => parseFloat(getComputedStyle(document.documentElement).fontSize)
    const LONG_PRESS_MS = 150

    // Track whether mousedown originated on the cat
    const onCatRef = { current: false }

    function startPress(clientX: number, clientY: number) {
      const w = wrapperRef.current
      if (!w) return
      onCatRef.current = true

      const rect = w.getBoundingClientRect()
      dragOffsetXRef.current = clientX - rect.left
      dragOffsetYRef.current = clientY - rect.top

      // Start long-press timer
      longPressTimerRef.current = setTimeout(() => {
        longPressTimerRef.current = null
        isDraggingRef.current = true
        setIsDragging(true)
        animRef.current   = 'struggle'
        movingRef.current = false
        if (w) w.style.transition = 'none'
      }, LONG_PRESS_MS)
    }

    function movePress(clientX: number, clientY: number) {
      if (!isDraggingRef.current) return
      const w = wrapperRef.current
      if (!w) return

      const newX       = clientX - dragOffsetXRef.current
      const naturalTop = window.innerHeight - remPx() * 2 - DISPLAY_SIZE
      const newTop     = clientY - dragOffsetYRef.current
      posXRef.current   = newX
      w.style.left      = `${newX}px`
      w.style.transform = `translateY(${newTop - naturalTop}px)`
    }

    function endPress() {
      if (!onCatRef.current) return
      onCatRef.current = false

      // Cancel long-press timer if still pending
      if (longPressTimerRef.current !== null) {
        clearTimeout(longPressTimerRef.current)
        longPressTimerRef.current = null
        // Released before long-press fired → it's a click
        onClickRef.current()
        return
      }

      if (!isDraggingRef.current) return

      // End drag → fall animation
      isDraggingRef.current = false
      setIsDragging(false)
      animRef.current = 'fall'

      const w = wrapperRef.current
      if (w) {
        w.style.transition = 'transform 0.4s ease-in'
        w.style.transform  = 'translateY(0)'
      }

      // Clamp X, resume walk from dropped position
      const margin  = 20
      const clamped = Math.max(margin, Math.min(window.innerWidth - DISPLAY_SIZE - margin, posXRef.current))
      posXRef.current    = clamped
      targetXRef.current = clamped
      if (w) w.style.left = `${clamped}px`

      // Block walk loop until fall animation finishes
      const fallDuration = ANIMS.fall.frames * ANIMS.fall.ms
      pauseUntilRef.current = Date.now() + fallDuration

      setTimeout(() => {
        if (!isDraggingRef.current) {
          const pick = IDLE_ANIMS[Math.floor(Math.random() * IDLE_ANIMS.length)]
          animRef.current       = pick
          pauseUntilRef.current = Date.now() + 1000 + Math.random() * 2000
        }
      }, fallDuration)
    }

    function onMouseDown(e: MouseEvent) { startPress(e.clientX, e.clientY) }
    function onMouseMove(e: MouseEvent) { movePress(e.clientX, e.clientY) }
    function onMouseUp()               { endPress() }
    function onTouchStart(e: TouchEvent) { startPress(e.touches[0].clientX, e.touches[0].clientY) }
    function onTouchMove(e: TouchEvent)  { e.preventDefault(); movePress(e.touches[0].clientX, e.touches[0].clientY) }
    function onTouchEnd()               { endPress() }

    const w = wrapperRef.current
    w?.addEventListener('mousedown',  onMouseDown)
    w?.addEventListener('touchstart', onTouchStart, { passive: false })
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup',   onMouseUp)
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend',  onTouchEnd)

    return () => {
      w?.removeEventListener('mousedown',  onMouseDown)
      w?.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup',   onMouseUp)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend',  onTouchEnd)
    }
  }, [])

  // ── Main render + walk loop ────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    ctx.imageSmoothingEnabled = false

    function tick(timestamp: number) {
      const now = Date.now()

      // Auto-walk (blocked while hovering or dragging)
      if (posXRef.current >= 0 && !hoveredRef.current && !isDraggingRef.current) {
        if (now >= pauseUntilRef.current) {
          const dx = targetXRef.current - posXRef.current
          if (Math.abs(dx) < WALK_SPEED) {
            posXRef.current       = targetXRef.current
            movingRef.current     = false
            animRef.current       = IDLE_ANIMS[Math.floor(Math.random() * IDLE_ANIMS.length)]
            pauseUntilRef.current = now + 1500 + Math.random() * 4000
            pickTarget()
          } else {
            dirRef.current    = dx > 0 ? 1 : -1
            posXRef.current  += dirRef.current * WALK_SPEED
            movingRef.current = true
            animRef.current   = 'walk'
          }
          if (wrapperRef.current) {
            wrapperRef.current.style.left = `${posXRef.current}px`
          }
        } else if (movingRef.current) {
          movingRef.current = false
          animRef.current   = IDLE_ANIMS[Math.floor(Math.random() * IDLE_ANIMS.length)]
        }
      }


      // Reset frame on anim change
      if (animRef.current !== prevAnimRef.current) {
        prevAnimRef.current = animRef.current
        frameIdxRef.current = 0
        lastTickRef.current = timestamp
      }

      // Advance frame
      const anim = ANIMS[animRef.current]
      if (timestamp - lastTickRef.current > anim.ms) {
        lastTickRef.current = timestamp
        frameIdxRef.current = (frameIdxRef.current + 1) % anim.frames
      }

      // Sync bubble position to cat center
      if (bubbleRef.current && posXRef.current >= 0) {
        bubbleRef.current.style.left = `${posXRef.current + 20}px`
      }

      // Draw
      ctx.clearRect(0, 0, DISPLAY_SIZE, DISPLAY_SIZE)
      if (tintedRef.current) {
        const sx       = frameIdxRef.current * FRAME_SIZE
        const flipLeft = movingRef.current && dirRef.current === -1 && !isDraggingRef.current

        if (flipLeft) {
          ctx.save()
          ctx.translate(DISPLAY_SIZE, 0)
          ctx.scale(-1, 1)
          ctx.drawImage(tintedRef.current, sx, anim.y, FRAME_SIZE, FRAME_SIZE, 0, 0, DISPLAY_SIZE, DISPLAY_SIZE)
          ctx.restore()
        } else {
          ctx.drawImage(tintedRef.current, sx, anim.y, FRAME_SIZE, FRAME_SIZE, 0, 0, DISPLAY_SIZE, DISPLAY_SIZE)
        }
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  // ── Speech bubble schedule ─────────────────────────────────────────────────
  useEffect(() => {
    function scheduleNext() {
      const delay = 30_000 + Math.random() * 30_000
      timerRef.current = setTimeout(() => {
        const msg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)]
        setBubble(msg)
        timerRef.current = setTimeout(() => {
          setBubble(null)
          scheduleNext()
        }, 5500)
      }, delay)
    }
    scheduleNext()
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [])

  return (
    <>
      <div
        ref={bubbleRef}
        key={bubble}
        className={styles.bubble}
        style={{ visibility: bubble && !chatOpen ? 'visible' : 'hidden' }}
      >
        {bubble}
      </div>
      <div
        ref={wrapperRef}
        className={`${styles.wrapper} ${isDragging ? styles.dragging : ''}`}
        style={{ bottom: '2rem', right: '2rem' }}
        onMouseEnter={() => { hoveredRef.current = true;  setHovered(true)  }}
        onMouseLeave={() => { hoveredRef.current = false; setHovered(false) }}
        role="button"
        aria-label="Chat öffnen"
      >
        <canvas
          ref={canvasRef}
          className={`${styles.canvas} ${hovered ? styles.canvasHovered : ''}`}
          width={DISPLAY_SIZE}
          height={DISPLAY_SIZE}
        />
      </div>
    </>
  )
}

export { FRAME_SIZE, DISPLAY_SIZE }
