'use client'

import Image from 'next/image'
import type { CSSProperties, ReactNode } from 'react'
import styles from './MangaPanel.module.css'

export type PanelCut =
  | 'none' | 'tl-br' | 'tr-bl' | 'notch-tl' | 'notch-br'
  | 'slash-top' | 'slash-bottom' | 'wedge-r' | 'wedge-l'
  | 'trap-tall'
  | 'diag-ul' | 'diag-lr'
  | 'trap-narrow-b' | 'trap-wide-b'
  | 'split-top' | 'split-bottom'
  | 'diag-split-l' | 'diag-split-r'
  /* Blade cuts — one side shears hard toward the opposite corner */
  | 'blade-r' | 'blade-l'
export type SfxPos   = 'tl' | 'tr' | 'bl' | 'br' | 'center'
export type Placeholder = 'a' | 'b' | 'c' | 'd' | 'e'

interface Props {
  children?: ReactNode
  order?: number
  className?: string
  style?: CSSProperties
  cut?: PanelCut
  /** Big categorial tag rendered as a library-style label on the frame. */
  label?: string
  labelPos?: SfxPos
  /** On small panels the label hides until hover — appears with the hoverSfx. */
  hideLabelUntilHover?: boolean
  caption?: string
  captionPos?: SfxPos
  sfx?: string
  sfxPos?: SfxPos
  sfxRotate?: number
  hoverSfx?: string
  hoverSfxPos?: SfxPos
  placeholder?: Placeholder
  halftone?: boolean
  /** Image path relative to /public. When set, an <Image fill> is rendered. */
  image?: string
  imageAlt?: string
  imagePriority?: boolean
  /** Rough sizes hint — panels span roughly one third of viewport on desktop. */
  imageSizes?: string
  /** Bleeds 4% past grid boundaries — hero/splash panels only. */
  bleed?: boolean
  /** Hides the SVG ink border — for full-bleed strip panels. */
  frameless?: boolean
}

/* clip-path polygon strings (CSS). Share geometry with SVG points below. */
const CLIPS: Record<PanelCut, string> = {
  'none':           '',
  'tl-br':          'polygon(10% 0, 100% 0, 100% 90%, 90% 100%, 0 100%, 0 10%)',
  'tr-bl':          'polygon(0 0, 90% 0, 100% 10%, 100% 100%, 10% 100%, 0 90%)',
  'notch-tl':       'polygon(34% 0, 100% 0, 100% 100%, 0 100%, 0 28%)',
  'notch-br':       'polygon(0 0, 100% 0, 100% 72%, 66% 100%, 0 100%)',
  'slash-top':      'polygon(0 16%, 100% 0, 100% 100%, 0 100%)',
  'slash-bottom':   'polygon(0 0, 100% 0, 100% 84%, 0 100%)',
  'wedge-r':        'polygon(0 0, 100% 20%, 100% 80%, 0 100%)',
  'wedge-l':        'polygon(0 20%, 100% 0, 100% 100%, 0 80%)',
  'trap-tall':      'polygon(25% 0, 75% 0, 100% 100%, 0 100%)',
  'diag-ul':        'polygon(0 0, 100% 0, 100% 15%, 15% 100%, 0 100%)',
  'diag-lr':        'polygon(100% 15%, 100% 100%, 15% 100%)',
  'trap-narrow-b':  'polygon(0 0, 82% 0, 18% 100%, 0 100%)',
  'trap-wide-b':    'polygon(82% 0, 100% 0, 100% 100%, 18% 100%)',
  'split-top':      'polygon(0 0, 100% 0, 100% 70%, 0 30%)',
  'split-bottom':   'polygon(0 30%, 100% 70%, 100% 100%, 0 100%)',
  'diag-split-l':   'polygon(0 0, 20% 0, 80% 100%, 0 100%)',
  'diag-split-r':   'polygon(20% 0, 100% 0, 100% 100%, 80% 100%)',
  'blade-r':        'polygon(0 0, 100% 0, 82% 100%, 0 100%)',
  'blade-l':        'polygon(0 0, 100% 0, 100% 100%, 18% 100%)',
}

const SVG_POINTS: Record<PanelCut, string> = {
  'none':           '0,0 100,0 100,100 0,100',
  'tl-br':          '10,0 100,0 100,90 90,100 0,100 0,10',
  'tr-bl':          '0,0 90,0 100,10 100,100 10,100 0,90',
  'notch-tl':       '34,0 100,0 100,100 0,100 0,28',
  'notch-br':       '0,0 100,0 100,72 66,100 0,100',
  'slash-top':      '0,16 100,0 100,100 0,100',
  'slash-bottom':   '0,0 100,0 100,84 0,100',
  'wedge-r':        '0,0 100,20 100,80 0,100',
  'wedge-l':        '0,20 100,0 100,100 0,80',
  'trap-tall':      '25,0 75,0 100,100 0,100',
  'diag-ul':        '0,0 100,0 100,15 15,100 0,100',
  'diag-lr':        '100,15 100,100 15,100',
  'trap-narrow-b':  '0,0 82,0 18,100 0,100',
  'trap-wide-b':    '82,0 100,0 100,100 18,100',
  'split-top':      '0,0 100,0 100,70 0,30',
  'split-bottom':   '0,30 100,70 100,100 0,100',
  'diag-split-l':   '0,0 20,0 80,100 0,100',
  'diag-split-r':   '20,0 100,0 100,100 80,100',
  'blade-r':        '0,0 100,0 82,100 0,100',
  'blade-l':        '0,0 100,0 100,100 18,100',
}

export default function MangaPanel({
  children,
  order = 0,
  className = '',
  style,
  cut = 'none',
  label,
  labelPos = 'tl',
  hideLabelUntilHover = false,
  caption,
  captionPos = 'tl',
  sfx,
  sfxPos = 'br',
  sfxRotate = -6,
  hoverSfx,
  hoverSfxPos = 'tr',
  placeholder,
  halftone = true,
  image,
  imageAlt = '',
  imagePriority = false,
  imageSizes = '(max-width: 900px) 100vw, 40vw',
  bleed = false,
  frameless = false,
}: Props) {
  const isCut = cut !== 'none'
  const clipStyle: CSSProperties = isCut ? { clipPath: CLIPS[cut] } : {}

  const mediaContent = children
    ?? (image
      ? <Image src={image} alt={imageAlt} fill sizes={imageSizes} priority={imagePriority} />
      : (placeholder && <div className={`${styles.placeholder} ${styles[`ph-${placeholder}`]}`} />)
    )

  return (
    <div
      className={[
        styles.panel,
        hideLabelUntilHover && label ? styles.hideLabel : '',
        bleed ? styles.bleed : '',
        className,
      ].filter(Boolean).join(' ')}
      style={style}
      data-ink-reveal
      data-ink-order={order}
    >
      <div className={styles.frame} style={clipStyle}>
        <div className={styles.content}>{mediaContent}</div>
        {halftone && <div className={styles.halftone} aria-hidden />}
        <div className={styles.inkCover} aria-hidden />
      </div>

      {!frameless && <svg
        className={styles.svgBorder}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
        focusable="false"
      >
        <polygon
          points={SVG_POINTS[cut]}
          fill="none"
          stroke="currentColor"
          strokeWidth={3.2}
          strokeLinejoin="miter"
          vectorEffect="non-scaling-stroke"
          filter="url(#me-rough)"
        />
        <polygon
          points={SVG_POINTS[cut]}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinejoin="miter"
          vectorEffect="non-scaling-stroke"
          filter="url(#me-rough-soft)"
          opacity={0.75}
        />
      </svg>}

      {caption && (
        <span className={`${styles.caption} ${styles[`pos-${captionPos}`]}`}>{caption}</span>
      )}
      {label && (
        <span className={`${styles.label} ${styles[`pos-${labelPos}`]}`}>{label}</span>
      )}
      {sfx && (
        <span
          className={`${styles.sfx} ${styles[`sfx-${sfxPos}`]}`}
          style={{ ['--sfx-rot' as string]: `${sfxRotate}deg` }}
          aria-hidden
        >
          {sfx}
        </span>
      )}
      {hoverSfx && (
        <span
          className={`${styles.hoverSfx} ${styles[`sfx-${hoverSfxPos}`]}`}
          aria-hidden
        >
          {hoverSfx}
        </span>
      )}
    </div>
  )
}
