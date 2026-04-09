'use client'

import { useEffect, useState } from 'react'
import { achievements } from '@/data/achievements'
import { useAchievement } from '@/context/AchievementContext'
import styles from './AchievementToast.module.css'

export default function AchievementToast() {
  const { currentToast, dismiss } = useAchievement()
  const [key, setKey]           = useState(0)
  const [dismissing, setDismissing] = useState(false)

  useEffect(() => {
    if (!currentToast) return
    setDismissing(false)
    setKey(k => k + 1)

    const out  = setTimeout(() => setDismissing(true), 3600)
    const done = setTimeout(() => dismiss(),           4000)
    return () => { clearTimeout(out); clearTimeout(done) }
  }, [currentToast, dismiss])

  const achievement = achievements.find(a => a.id === currentToast)
  if (!currentToast || !achievement) return null

  return (
    <div key={key} className={`${styles.toast} ${dismissing ? styles.out : styles.in}`}>
      <p className={styles.header}>Achievement Unlocked</p>
      <div className={styles.body}>
        <span className={styles.icon}>{achievement.icon}</span>
        <div>
          <p className={styles.title}>{achievement.title}</p>
          <p className={styles.desc}>{achievement.desc}</p>
        </div>
      </div>
    </div>
  )
}
