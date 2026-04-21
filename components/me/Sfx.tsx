'use client'

import type { CSSProperties, ReactNode } from 'react'
import styles from './Sfx.module.css'

type Variant = 'ink' | 'accent' | 'ghost'

interface Props {
  children: ReactNode
  variant?: Variant
  size?: 'sm' | 'md' | 'lg' | 'xl'
  rotate?: number
  order?: number
  className?: string
  style?: CSSProperties
}

export default function Sfx({
  children,
  variant = 'ink',
  size = 'md',
  rotate = -6,
  order = 0,
  className = '',
  style,
}: Props) {
  return (
    <span
      className={[
        styles.sfx,
        styles[`v-${variant}`],
        styles[`size-${size}`],
        className,
      ].filter(Boolean).join(' ')}
      style={{ ['--sfx-rot' as string]: `${rotate}deg`, ...style }}
      data-ink-reveal
      data-ink-order={order}
      aria-hidden
    >
      {children}
    </span>
  )
}
