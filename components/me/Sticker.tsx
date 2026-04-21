'use client'

import type { CSSProperties, ReactNode } from 'react'
import styles from './Sticker.module.css'

type Variant = 'accent' | 'ink' | 'paper'
type Shape   = 'star' | 'burst' | 'circle' | 'tag'

interface Props {
  children: ReactNode
  variant?: Variant
  shape?: Shape
  rotate?: number
  order?: number
  className?: string
  style?: CSSProperties
}

export default function Sticker({
  children,
  variant = 'accent',
  shape = 'burst',
  rotate = -8,
  order = 0,
  className = '',
  style,
}: Props) {
  return (
    <span
      className={[
        styles.sticker,
        styles[`v-${variant}`],
        styles[`s-${shape}`],
        className,
      ].filter(Boolean).join(' ')}
      style={{ ['--sticker-rot' as string]: `${rotate}deg`, ...style }}
      data-ink-reveal
      data-ink-order={order}
    >
      <span className={styles.label}>{children}</span>
    </span>
  )
}
