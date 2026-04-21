'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import styles from './page.module.css'
import { useLang } from '@/context/LanguageContext'
import { translations } from '@/data/translations'
import { useAchievement } from '@/context/AchievementContext'
import { useScrollReveal } from '@/components/me/useScrollReveal'
import MangaPanel from '@/components/me/MangaPanel'
import NarrationBox from '@/components/me/NarrationBox'
import SpeechBubble from '@/components/me/SpeechBubble'
import Sticker from '@/components/me/Sticker'
import Sfx from '@/components/me/Sfx'
import RoughDefs from '@/components/me/RoughDefs'
import {
  getMePanelsBySection,
  type MePanelConfig,
  type MePanelSlot,
} from '@/data/me-panels'
import { meNow } from '@/data/now'

type MeTrans = (typeof translations)['en']['me']

/** Slot → CSS class. Single dense 12×11 grid, 41 panels + 2 narrations. */
const SLOT_CLASS: Record<MePanelSlot, string> = {
  p1:  styles.slotP1,  p2:  styles.slotP2,  p3:  styles.slotP3,
  p4:  styles.slotP4,  p5:  styles.slotP5,  p6:  styles.slotP6,
  p7:  styles.slotP7,  p8:  styles.slotP8,  p9:  styles.slotP9,
  p10: styles.slotP10, p11: styles.slotP11, p12: styles.slotP12,
  p13: styles.slotP13, p14: styles.slotP14, p15: styles.slotP15,
  p16: styles.slotP16, p17: styles.slotP17, p18: styles.slotP18,
  p19: styles.slotP19, p20: styles.slotP20, p21: styles.slotP21,
  p22: styles.slotP22, p23: styles.slotP23, p24: styles.slotP24,
  p25: styles.slotP25, p26: styles.slotP26, p27: styles.slotP27,
  p28: styles.slotP28, p29: styles.slotP29, p30: styles.slotP30,
  p31: styles.slotP31, p32: styles.slotP32, p33: styles.slotP33,
  p34: styles.slotP34, p35: styles.slotP35, p36: styles.slotP36,
  p37: styles.slotP37, p38: styles.slotP38, p39: styles.slotP39,
  p40: styles.slotP40, p41: styles.slotP41,
}

function panelProps(cfg: MePanelConfig, t: MeTrans) {
  return {
    order: cfg.order,
    placeholder: cfg.placeholder,
    cut: cfg.cut,
    halftone: cfg.halftone,
    image: cfg.image,
    imageAlt: cfg.imageAlt ?? '',
    imagePriority: cfg.priority ?? false,
    caption: cfg.captionKey ? t.panels[cfg.captionKey] : undefined,
    captionPos: cfg.captionPos,
    label: cfg.labelKey ? t.labels[cfg.labelKey] : undefined,
    labelPos: cfg.labelPos,
    hideLabelUntilHover: cfg.hideLabelUntilHover,
    hoverSfx: cfg.hoverSfxKey ? t.panels[cfg.hoverSfxKey] : undefined,
    hoverSfxPos: cfg.hoverSfxPos,
    className: SLOT_CLASS[cfg.slot],
  }
}

export default function MeContent() {
  const { lang, toggle: toggleLang } = useLang()
  const t = translations[lang].me
  const { unlock } = useAchievement()
  const endRef = useRef<HTMLElement | null>(null)

  useScrollReveal()

  /* Chapter Read — fires when the end panel enters the viewport, i.e. the
     reader actually scrolled to the bottom of the chapter. */
  useEffect(() => {
    const el = endRef.current
    if (!el || typeof window === 'undefined' || !('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            unlock('chapter-read')
            observer.disconnect()
            break
          }
        }
      },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [unlock])

  const spread = getMePanelsBySection('spread')

  return (
    <main className={styles.page}>
      <RoughDefs />

      <div className={styles.topBar}>
        <Link href="/" className={styles.backLink}>{t.back}</Link>
        <button
          className={styles.langBtn}
          onClick={toggleLang}
          aria-label={lang === 'en' ? 'Deutsch' : 'English'}
        >
          {lang === 'en' ? '[ DE ]' : '[ EN ]'}
        </button>
      </div>

      {/* ── Intro chapter ─────────────────────────────────────────── */}
      <section className={styles.intro}>
        <div className={styles.introChapter} data-ink-reveal data-ink-order={0}>
          {t.intro.chapter}
        </div>

        <div className={styles.introGrid}>
          <div className={styles.introTitle}>
            <h1 className={styles.name} data-ink-reveal data-ink-order={1}>
              <span className={styles.nameLine}>{t.intro.nameLine1}</span>
              <span className={styles.nameLine2}>{t.intro.nameLine2}</span>
            </h1>
            <p className={styles.tagline} data-ink-reveal data-ink-order={2}>
              {t.intro.tagline}
            </p>
          </div>

          <NarrationBox label="// bio.txt" rotate={0} order={3} flush>
            {t.intro.bio}
          </NarrationBox>
        </div>
      </section>

      {/* ── Manga spread — dense 41-panel double-page ──────────────── */}
      <section className={styles.spread}>
        {spread.map(cfg => (
          <MangaPanel key={cfg.id} {...panelProps(cfg, t)} />
        ))}

        <NarrationBox
          label="// note.01"
          rotate={0}
          order={20}
          flush
          className={styles.slotN1}
        >
          {t.narration.n1}
        </NarrationBox>

        <NarrationBox
          label="// interests.txt"
          rotate={0}
          order={35}
          flush
          className={styles.slotN2}
        >
          {t.narration.interests}
        </NarrationBox>

        {/* Permanent SFX — bleeding over row folds for atmosphere */}
        <Sfx size="xl" rotate={-7} variant="ink" order={42} className={styles.spreadBleedSfx}>
          {t.permanentSfx.wham}
        </Sfx>
        <Sfx size="lg" rotate={6} variant="ink" order={43} className={styles.spreadBleedSfx2}>
          {t.permanentSfx.krak}
        </Sfx>
        <Sfx size="lg" rotate={-5} variant="ink" order={44} className={styles.spreadBleedSfx3}>
          {t.permanentSfx.whoosh}
        </Sfx>

        {/* Speech bubbles — sparse, 2 total */}
        <SpeechBubble tail="br" rotate={-2} order={45} className={styles.bubbleTop}>
          {t.speech.s1}
        </SpeechBubble>
        <SpeechBubble tail="bl" rotate={3} order={46} className={styles.bubbleMid}>
          {t.speech.s2}
        </SpeechBubble>

        {/* Stickers — pinned to specific corners, floating over the grid */}
        <Sticker variant="paper" shape="burst" rotate={-8} order={47} className={styles.stickerShonen}>
          {t.stickers.shonen}
        </Sticker>
        <Sticker variant="ink" shape="tag" rotate={4} order={48} className={styles.stickerEsp}>
          {t.stickers.esp32}
        </Sticker>
        <Sticker variant="paper" shape="circle" rotate={-5} order={49} className={styles.stickerCoffee}>
          {t.stickers.coffee}
        </Sticker>
        <Sticker variant="paper" shape="tag" rotate={-7} order={50} className={styles.stickerLinux}>
          {t.stickers.linux}
        </Sticker>
        <Sticker variant="ink" shape="burst" rotate={5} order={51} className={styles.stickerTrails}>
          {t.stickers.trails}
        </Sticker>
        <Sticker variant="paper" shape="star" rotate={9} order={52} className={styles.stickerSince}>
          {t.stickers.since}
        </Sticker>
      </section>

      {/* ── Now section ───────────────────────────────────────────── */}
      <section className={styles.nowSection}>
        <div className={styles.nowBox} data-ink-reveal data-ink-order={1}>
          <div className={styles.nowHeader}>
            <span className={styles.nowLabel}>{t.now.label}</span>
            <h2 className={styles.nowHeading}>{t.now.heading}</h2>
          </div>
          <dl className={styles.nowList}>
            <div className={styles.nowRow}>
              <dt>{t.now.reading}</dt>
              <dd>{meNow.reading}</dd>
            </div>
            <div className={styles.nowRow}>
              <dt>{t.now.playing}</dt>
              <dd>{meNow.playing}</dd>
            </div>
            <div className={styles.nowRow}>
              <dt>{t.now.building}</dt>
              <dd>{meNow.building}</dd>
            </div>
            <div className={styles.nowRow}>
              <dt>{t.now.listening}</dt>
              <dd>{meNow.listening}</dd>
            </div>
            <div className={styles.nowRow}>
              <dt>{t.now.learning}</dt>
              <dd>{meNow.learning}</dd>
            </div>
          </dl>
          <div className={styles.nowInkCover} aria-hidden />
        </div>
      </section>

      {/* ── End of chapter — inverted black panel ──────────────────── */}
      <section className={styles.end} ref={endRef}>
        <span className={styles.endLabel} data-ink-reveal data-ink-order={0}>
          {t.end.label}
        </span>

        <Sfx size="xl" rotate={-3} variant="ink" order={1} className={styles.endSfx}>
          {t.end.chapter}
        </Sfx>

        <div className={styles.endLinks}>
          <Link href="/" className={styles.endLink} data-ink-reveal data-ink-order={2}>
            {t.end.backToPortfolio}
          </Link>
          <Link href="/#contact" className={styles.endLink} data-ink-reveal data-ink-order={3}>
            {t.end.backToGuestbook}
          </Link>
          <a
            href={`mailto:${t.end.contact}`}
            className={`${styles.endLink} ${styles.endContact}`}
            data-ink-reveal
            data-ink-order={4}
          >
            {t.end.sayHi} <code>{t.end.contact}</code>
          </a>
        </div>
      </section>
    </main>
  )
}
