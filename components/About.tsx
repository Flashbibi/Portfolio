import { useEffect, useRef, useState } from 'react'
import styles from './About.module.css'

const SKILLS = [
  { name: 'Python',              pct: 85, label: 'Stark' },
  { name: 'Java',                pct: 75, label: 'Gut' },
  { name: 'JavaScript',          pct: 75, label: 'Gut' },
  { name: 'SQL / MySQL',         pct: 80, label: 'Gut' },
  { name: 'REST API Design',     pct: 70, label: 'Gut' },
  { name: 'React / Vue.js',      pct: 80, label: 'Gut' },
  { name: 'Git & Docker Basics', pct: 62, label: 'Solide' },
  { name: 'Linux / Bash',        pct: 85, label: 'Stark' },
  { name: 'Blender 3D Modeling', pct: 35, label: 'Learning' },
  { name: 'ESP32 / Raspberry Pi for fun', pct: 58, label: 'Solide' },
]

export default function About() {
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
    <section id="about" className={styles.section}>
      <p className={styles.label}>02 — Über mich</p>
      <div className={styles.grid}>
        <div>
          <h2 className={styles.heading}>
            Maker,<br />
            <em>Entwickler</em>,<br />
            Bastler.
          </h2>
          <div className={styles.body}>
            <p>
              Ich bin Linus, Informatiker Fachrichtung Applikationsentwicklung
              in Ausbildung an der ETH Zürich. Ich mag Projekte, bei denen ich
              schnell von einer Idee zu einem funktionierenden Prototyp komme.
            </p>
            <p>
              Ich arbeite am liebsten an Softwareprojekten rund um Backend,
              APIs, Datenbanken und moderne Web-Apps. In meiner Freizeit
              baue ich zusätzlich kleine Hardware- und 3D-Projekte.
            </p>
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
                <span className={styles.skillLevel}>{s.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
