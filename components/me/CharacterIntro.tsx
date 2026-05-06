'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { meSubjects } from '@/data/me-subjects'
import type { MeSubject } from '@/data/me-panels'
import styles from './CharacterIntro.module.css'

interface Props {
  subject: MeSubject | null
  fallbackImage?: string
  fallbackObjectPosition?: string
  onClose: () => void
}

const APPEARED_DELAY_MS = 1700
const TYPEWRITER_CHAR_MS = 40

const SPARKLES = [
  { top: '6%',  left: '12%', delay: 0.95, scale: 1.0  },
  { top: '18%', left: '78%', delay: 1.00, scale: 0.85 },
  { top: '52%', left: '8%',  delay: 1.05, scale: 0.7  },
  { top: '60%', left: '88%', delay: 1.08, scale: 0.95 },
  { top: '34%', left: '50%', delay: 1.12, scale: 0.6  },
]

export default function CharacterIntro({ subject, fallbackImage, fallbackObjectPosition, onClose }: Props) {
  const [typed, setTyped] = useState('')
  const [done, setDone] = useState(false)

  const intro = subject ? meSubjects[subject] : null
  const fullText = intro ? `A wild ${intro.name} appeared!` : ''

  useEffect(() => {
    if (!subject) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [subject, onClose])

  useEffect(() => {
    if (!subject || !fullText) {
      setTyped('')
      setDone(false)
      return
    }
    setTyped('')
    setDone(false)
    const start = setTimeout(() => {
      let i = 0
      const tick = setInterval(() => {
        i++
        setTyped(fullText.slice(0, i))
        if (i >= fullText.length) {
          clearInterval(tick)
          setDone(true)
        }
      }, TYPEWRITER_CHAR_MS)
    }, APPEARED_DELAY_MS)
    return () => { clearTimeout(start) }
  }, [subject, fullText])

  return (
    <AnimatePresence>
      {subject && intro && (
        <motion.div
          key="character-intro"
          className={styles.overlay}
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          role="dialog"
          aria-label={`${intro.name} encounter`}
        >
          <div className={styles.behindTemplate} aria-hidden />

          <div className={styles.scene}>
            {/* Pre-drawn battle UI: HP boxes, platforms, dialog box */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/scene/Pokemon_Blank_Template.jpg"
              alt=""
              className={styles.template}
              aria-hidden
            />

            {/* Wild Pokémon photo on the upper-right platform */}
            <motion.div
              className={styles.wildHero}
              initial={{ opacity: 0, y: -100, scale: 0.55 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 320, damping: 14, mass: 0.9, delay: 0.7 }}
            >
              <Image
                src={intro.heroImage ?? fallbackImage ?? ''}
                alt={intro.name}
                fill
                sizes="(max-width: 700px) 25vw, 18vw"
                style={{
                  objectFit: 'cover',
                  objectPosition: intro.heroObjectPosition ?? fallbackObjectPosition ?? 'center',
                }}
                priority
              />

              <div className={styles.sparkles} aria-hidden>
                {SPARKLES.map((s, i) => (
                  <motion.div
                    key={i}
                    className={styles.sparkle}
                    style={{ top: s.top, left: s.left }}
                    initial={{ opacity: 0, scale: 0, rotate: 0 }}
                    animate={{
                      opacity: [0, 1, 1, 0],
                      scale: [0, s.scale * 1.2, s.scale, 0],
                      rotate: [0, 90, 180, 270],
                    }}
                    transition={{ duration: 0.7, delay: s.delay, times: [0, 0.3, 0.7, 1], ease: 'easeOut' }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Player Pokémon photo on the lower-left platform */}
            {intro.playerImage && (
              <motion.div
                className={styles.playerHero}
                initial={{ opacity: 0, y: -80, scale: 0.55 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 320, damping: 14, mass: 0.9, delay: 1.05 }}
              >
                <Image
                  src={intro.playerImage}
                  alt={intro.playerName ?? 'You'}
                  fill
                  sizes="(max-width: 700px) 35vw, 26vw"
                  style={{
                    objectFit: 'cover',
                    objectPosition: intro.playerObjectPosition ?? 'center',
                  }}
                />
              </motion.div>
            )}

            {/* HP-box overlays — names + level numbers */}
            <motion.span
              className={`${styles.hpText} ${styles.wildName}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.45 }}
            >
              {intro.name}
            </motion.span>
            <motion.span
              className={`${styles.hpText} ${styles.wildLevel}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.45 }}
            >
              {intro.level ?? 4}
            </motion.span>

            {intro.playerName && (
              <>
                <motion.span
                  className={`${styles.hpText} ${styles.playerName}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.85 }}
                >
                  {intro.playerName}
                </motion.span>
                <motion.span
                  className={`${styles.hpText} ${styles.playerLevel}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.85 }}
                >
                  {intro.playerLevel ?? 5}
                </motion.span>
              </>
            )}

            {/* Dialog text inside the teal callout */}
            <div className={styles.dialogText}>
              {typed}
              {!done && <span className={styles.cursorCaret} aria-hidden />}
              {done && <span className={styles.dialogArrow} aria-hidden>▼</span>}
            </div>
          </div>

          {/* Entry transition */}
          <motion.div
            className={styles.diamonds}
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 0, scale: 1.6 }}
            transition={{ duration: 0.55, delay: 0.15, ease: 'easeOut' }}
            aria-hidden
          />
          <motion.div
            className={styles.flash}
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            aria-hidden
          />

          <motion.div
            className={styles.dismiss}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 3.5 }}
            aria-hidden
          >
            click anywhere · esc
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
