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
              Ich bin Linus — Informatikstudent an einer Schweizer Berufsschule
              mit einem Hang zu allem, was man selbst bauen kann. Von Software
              über 3D-gedruckte Hardware bis zu eingebetteten Systemen.
            </p>
            <p>
              Wenn ich nicht gerade code, drucke ich Teile auf meiner Creality
              K1C, schreibe Python-Skripte für Blender oder bastle an
              Elektronikprojekten mit ESP32 und Raspberry Pi.
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
