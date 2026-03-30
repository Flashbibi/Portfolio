import styles from './About.module.css'

const SKILLS = [
  { name: 'Python',          pct: 85, label: 'Stark' },
  { name: 'Java / Spring Boot', pct: 70, label: 'Gut' },
  { name: 'React / Vue.js',  pct: 65, label: 'Gut' },
  { name: 'Blender Scripting', pct: 60, label: 'Gut' },
  { name: 'ESP32 / Raspberry Pi', pct: 70, label: 'Gut' },
  { name: '3D-Druck (FDM)',  pct: 80, label: 'Stark' },
]

export default function About() {
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
              Neben dem Coden drucke ich Teile auf meiner Creality K1C,
              automatisiere Workflows mit Blender-Skripten und tüftle an
              Hardware mit ESP32 und Raspberry Pi.
            </p>
          </div>
        </div>
        <div>
          <ul className={styles.skills}>
            {SKILLS.map(s => (
              <li key={s.name} className={styles.skillRow}>
                <span className={styles.skillName}>{s.name}</span>
                <div className={styles.bar}>
                  <div className={styles.fill} style={{ width: `${s.pct}%` }} />
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
