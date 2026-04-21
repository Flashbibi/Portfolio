'use client'

import type { CSSProperties, ReactNode } from 'react'
import styles from './NarrationBox.module.css'

interface Props {
  label?: string
  children: ReactNode
  order?: number
  rotate?: number
  flush?: boolean
  className?: string
  style?: CSSProperties
}

export default function NarrationBox({
  label,
  children,
  order = 0,
  rotate = 0,
  flush = false,
  className = '',
  style,
}: Props) {
  return (
    <aside
      className={[styles.box, flush ? styles.flush : '', className].filter(Boolean).join(' ')}
      style={{ ['--box-rot' as string]: flush ? '0deg' : `${rotate}deg`, ...style }}
      data-ink-reveal
      data-ink-order={order}
    >
      <div className={styles.inner}>
        {label && <span className={styles.label}>{label}</span>}
        <div className={styles.body}>{children}</div>
      </div>
      <svg
        className={styles.svgBorder}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
        focusable="false"
      >
        <rect
          x="0"
          y="0"
          width="100"
          height="100"
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          vectorEffect="non-scaling-stroke"
          filter="url(#me-rough)"
        />
        <rect
          x="0"
          y="0"
          width="100"
          height="100"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.4}
          vectorEffect="non-scaling-stroke"
          filter="url(#me-rough-soft)"
          opacity={0.7}
        />
      </svg>
      <div className={styles.inkCover} aria-hidden />
    </aside>
  )
}
