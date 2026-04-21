'use client'

import type { CSSProperties, ReactNode } from 'react'
import styles from './SpeechBubble.module.css'

type Tail = 'bl' | 'br' | 'tl' | 'tr'

interface Props {
  children: ReactNode
  tail?: Tail
  rotate?: number
  order?: number
  className?: string
  style?: CSSProperties
}

/* Tail tip positions in viewBox units (0..100 x, 0..100 y, but we paint
   into a generous SVG area so the tail pokes outside the inner box). */
const TAIL_PATH: Record<Tail, string> = {
  'bl': 'M 14 98 L 24 98 L 20 116 Z',
  'br': 'M 76 98 L 86 98 L 80 116 Z',
  'tl': 'M 14 2  L 24 2  L 20 -16 Z',
  'tr': 'M 76 2  L 86 2  L 80 -16 Z',
}

export default function SpeechBubble({
  children,
  tail = 'bl',
  rotate = 0,
  order = 0,
  className = '',
  style,
}: Props) {
  return (
    <div
      className={[styles.bubble, styles[`tail-${tail}`], className].filter(Boolean).join(' ')}
      style={{ ['--bubble-rot' as string]: `${rotate}deg`, ...style }}
      data-ink-reveal
      data-ink-order={order}
    >
      <span className={styles.inner}>
        <span className={styles.text}>{children}</span>
      </span>
      <svg
        className={styles.svgBorder}
        viewBox="-2 -18 104 138"
        preserveAspectRatio="none"
        aria-hidden
        focusable="false"
      >
        <rect
          x="0" y="0" width="100" height="100" rx="22" ry="22"
          fill="var(--me-bubble-bg)"
          stroke="currentColor"
          strokeWidth={3}
          vectorEffect="non-scaling-stroke"
          filter="url(#me-rough)"
        />
        <path
          d={TAIL_PATH[tail]}
          fill="var(--me-bubble-bg)"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinejoin="miter"
          vectorEffect="non-scaling-stroke"
          filter="url(#me-rough)"
        />
      </svg>
    </div>
  )
}
