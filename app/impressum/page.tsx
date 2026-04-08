import type { Metadata } from 'next'
import Link from 'next/link'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Impressum — Linus Sommermeyer',
  robots: { index: false, follow: false },
}

export default function Impressum() {
  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <Link href="/" className={styles.back}>← zurück</Link>

        <h1 className={styles.heading}>Impressum</h1>

        <section className={styles.section}>
          <h2 className={styles.sub}>Angaben gemäss § 5 TMG / Art. 12 DSG</h2>
          <p>Linus Sommermeyer</p>
          <p>Zürich, Schweiz</p>
          <p>
            E-Mail:{' '}
            <a href="mailto:linus.sommermeyer@lernende.ethz.ch" className={styles.link}>
              linus.sommermeyer@lernende.ethz.ch
            </a>
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sub}>Hinweis</h2>
          <p>
            Diese Website ist ein persönliches, nicht-kommerzielles Portfolio-Projekt.
            Es werden keine Produkte oder Dienstleistungen verkauft.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sub}>Haftung für Inhalte</h2>
          <p>
            Die Inhalte dieser Website wurden mit grösster Sorgfalt erstellt.
            Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte
            kann jedoch keine Gewähr übernommen werden.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sub}>Externe Links</h2>
          <p>
            Diese Website enthält Links zu externen Websites Dritter (GitHub, LinkedIn),
            auf deren Inhalte kein Einfluss besteht. Für die Inhalte der verlinkten Seiten
            ist stets der jeweilige Anbieter verantwortlich.
          </p>
        </section>
      </div>
    </main>
  )
}
