'use client'

import { useEffect, useState } from 'react'
import { achievements } from '@/data/achievements'
import { useAchievement } from '@/context/AchievementContext'
import styles from './AchievementsSection.module.css'

const SS_KEY = 'portfolio:achievements-reveal'

export default function AchievementsSection() {
  const { unlocked } = useAchievement()
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    try {
      setShowAll(sessionStorage.getItem(SS_KEY) === 'true')
    } catch { /* ignore */ }
  }, [])

  function toggleShowAll() {
    const next = !showAll
    setShowAll(next)
    try {
      sessionStorage.setItem(SS_KEY, String(next))
    } catch { /* ignore */ }
  }

  const visible = showAll
    ? achievements
    : achievements.filter(a => unlocked.has(a.id))

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <span className={styles.label}>Achievements</span>
        <span className={styles.count}>{unlocked.size} / {achievements.length}</span>
      </div>

      {visible.length === 0 && (
        <p className={styles.empty}>No achievements unlocked yet.</p>
      )}

      <div className={styles.grid}>
        {visible.map(a => {
          const isUnlocked = unlocked.has(a.id)
          return (
            <div
              key={a.id}
              className={`${styles.card} ${isUnlocked ? styles.unlocked : styles.locked}`}
            >
              <span className={styles.icon}>{isUnlocked ? a.icon : '?'}</span>
              <div className={styles.info}>
                <span className={styles.title}>{a.title}</span>
                <span className={styles.desc}>{isUnlocked ? a.desc : '???'}</span>
              </div>
            </div>
          )
        })}
      </div>

      <button className={styles.toggle} onClick={toggleShowAll}>
        {showAll ? '[ hide locked ]' : `[ show all ${achievements.length} ]`}
      </button>
    </div>
  )
}
