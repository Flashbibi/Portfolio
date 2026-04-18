'use client'

import styles from './Contact.module.css'
import { useLang } from '@/context/LanguageContext'
import { translations } from '@/data/translations'
import GlitchText from './GlitchText'

export default function Contact() {
  const { lang } = useLang()
  const t = translations[lang].contact

  const LINKS = [
    { label: 'linus@sommermeyer.ch', icon: '✉', href: 'mailto:linus@sommermeyer.ch' },
    { label: 'GitHub',   icon: '↗', href: 'https://github.com/Flashbibi' },
    { label: 'LinkedIn', icon: '↗', href: 'https://www.linkedin.com/in/lsommermeyer/' },
  ]

  return (
    <section id="contact" className={styles.section} data-reveal>
      <p className={styles.label}>{t.label}</p>
      <div className={styles.wrap}>
        <div>
          <h2 className={styles.heading}>
            {t.heading1}<br />
            <span>{t.heading2}</span>
          </h2>
          <p className={styles.sub}>
            <GlitchText id="home-contact-sub" active={null}>{t.sub}</GlitchText>
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
