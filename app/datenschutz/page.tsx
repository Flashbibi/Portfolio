import type { Metadata } from 'next'
import Link from 'next/link'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Datenschutzerklärung — Linus Sommermeyer',
  robots: { index: false, follow: false },
}

export default function Datenschutz() {
  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <Link href="/" className={styles.back}>← zurück</Link>

        <h1 className={styles.heading}>Datenschutzerklärung</h1>

        <section className={styles.section}>
          <h2 className={styles.sub}>1. Verantwortlicher</h2>
          <p>
            Linus Sommermeyer, Zürich, Schweiz<br />
            E-Mail:{' '}
            <a href="mailto:linus.sommermeyer@lernende.ethz.ch" className={styles.link}>
              linus.sommermeyer@lernende.ethz.ch
            </a>
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sub}>2. Grundsatz</h2>
          <p>
            Diese Website erhebt keine personenbezogenen Daten, setzt keine Cookies,
            verwendet kein Tracking, keine Analyse-Tools und keine Werbung.
            Es werden keine Daten an Dritte weitergegeben.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sub}>3. Schriftarten (Web Fonts)</h2>
          <p>
            Diese Website verwendet die Schriftarten <em>Space Mono</em> und{' '}
            <em>Cormorant Garamond</em>. Die Schriftdateien werden beim Build-Prozess
            heruntergeladen und direkt von diesem Server ausgeliefert (<code>next/font</code>).
            Es findet dabei keine Verbindung zu Google-Servern statt.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sub}>4. Lokaler Speicher (localStorage / sessionStorage)</h2>
          <p>
            Diese Website speichert folgende Einstellungen ausschliesslich lokal
            in Ihrem Browser — es werden keine Daten an einen Server übertragen:
          </p>
          <ul className={styles.list}>
            <li><code>theme</code> — Ihr gewähltes Farbschema (hell / dunkel)</li>
            <li><code>lang</code> — Ihre gewählte Sprache (DE / EN)</li>
            <li><code>portfolio:intro-seen</code> — Ob das Intro bereits angezeigt wurde (Session)</li>
          </ul>
          <p>
            Diese Daten verbleiben lokal auf Ihrem Gerät und können jederzeit über
            die Browser-Einstellungen gelöscht werden.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sub}>5. Server-Logs</h2>
          <p>
            Beim Besuch dieser Website kann der Hosting-Anbieter technische Zugriffsdaten
            (IP-Adresse, Zeitstempel, aufgerufene Seiten) in Server-Logs speichern.
            Diese Daten werden nicht von mir erhoben oder ausgewertet.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sub}>6. Externe Links</h2>
          <p>
            Diese Website enthält Links zu GitHub und LinkedIn. Sobald Sie diese Links
            anklicken, gelten die Datenschutzbestimmungen der jeweiligen Anbieter.
            Auf deren Datenverarbeitung besteht kein Einfluss.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sub}>7. Ihre Rechte</h2>
          <p>
            Sie haben das Recht auf Auskunft, Berichtigung und Löschung Ihrer Daten.
            Da diese Website keine personenbezogenen Daten erhebt, sind diese Rechte
            hier nicht anwendbar. Bei Fragen wenden Sie sich an die oben genannte
            E-Mail-Adresse.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sub}>8. Anwendbares Recht</h2>
          <p>
            Es gilt das Schweizer Datenschutzgesetz (DSG) sowie, soweit anwendbar,
            die Datenschutz-Grundverordnung (DSGVO) der Europäischen Union.
          </p>
          <p className={styles.date}>Stand: April 2026</p>
        </section>
      </div>
    </main>
  )
}
