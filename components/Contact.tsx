import styles from './Contact.module.css'

interface ContactLink {
  label: string
  icon: string
  href: string
  rel: string | undefined
}

const LINKS: ContactLink[] = [
  { label: 'linus@example.com', icon: '✉', href: 'mailto:linus@example.com', rel: undefined },
  { label: 'GitHub',            icon: '↗', href: 'https://github.com/linus', rel: 'noopener noreferrer' },
  { label: 'LinkedIn',          icon: '↗', href: '#', rel: undefined },
  { label: 'CV herunterladen',  icon: '↓', href: '#', rel: undefined },
]

export default function Contact() {
  return (
    <section id="contact" className={styles.section}>
      <p className={styles.label}>04 — Kontakt</p>
      <div className={styles.wrap}>
        <div>
          <h2 className={styles.heading}>
            Lass uns<br />
            <span>reden.</span>
          </h2>
          <p className={styles.sub}>
            Ob Projekt, Idee oder einfach ein nettes Gespräch — ich freue mich
            über Nachrichten. Erreichbar per Mail oder auf GitHub.
          </p>
        </div>
        <div>
          <ul className={styles.links}>
            {LINKS.map(l => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className={styles.link}
                  target={l.href.startsWith('http') ? '_blank' : undefined}
                  rel={l.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  <span>{l.label}</span>
                  <span className={styles.icon}>{l.icon}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
