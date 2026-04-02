'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './About.module.css'
import { useLang } from '@/context/LanguageContext'
import { translations } from '@/data/translations'

type SkillLevel = 'strong' | 'good' | 'solid' | 'learning'

const SKILLS: { name: string; pct: number; level: SkillLevel }[] = [
  { name: 'Python',                    pct: 85, level: 'strong'   },
  { name: 'Java',                      pct: 75, level: 'good'     },
  { name: 'JavaScript',                pct: 75, level: 'good'     },
  { name: 'SQL / MySQL',               pct: 80, level: 'good'     },
  { name: 'REST API Design',           pct: 70, level: 'good'     },
  { name: 'React / Vue.js',            pct: 80, level: 'good'     },
  { name: 'Git & Docker Basics',       pct: 62, level: 'solid'    },
  { name: 'Linux / Bash',              pct: 85, level: 'strong'   },
  { name: 'Blender 3D Modeling',       pct: 35, level: 'learning' },
  { name: 'ESP32 / Raspberry Pi for fun', pct: 58, level: 'solid' },
]

export default function About() {
  const { lang } = useLang()
  const t = translations[lang].about
  const skillsRef = useRef<HTMLUListElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = skillsRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect() } },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="about" className={styles.section} data-reveal>
      <p className={styles.label}>{t.label}</p>
      <div className={styles.grid}>
        <div>
          <h2 className={styles.heading}>
            {t.heading1}<br />
            <em>{t.heading2}</em>,<br />
            {t.heading3}
          </h2>
          <div className={styles.body}>
            <p>{t.bio1}</p>
            <p>{t.bio2}</p>
          </div>
        </div>
        <div>
          <ul className={styles.skills} ref={skillsRef}>
            {SKILLS.map(s => (
              <li key={s.name} className={styles.skillRow}>
                <span className={styles.skillName}>{s.name}</span>
                <div className={styles.bar}>
                  <div className={styles.fill} style={{ width: inView ? `${s.pct}%` : '0%' }} />
                </div>
                <span className={styles.skillLevel}>{t.skills[s.level]}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
