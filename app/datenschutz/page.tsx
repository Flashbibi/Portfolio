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
            <a href="mailto:linus@sommermeyer.ch" className={styles.link}>
              linus@sommermeyer.ch
            </a>
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sub}>2. Grundsatz</h2>
          <p>
            Diese Website ist ein persönliches Portfolio ohne Werbung, Analyse-Tools oder
            Tracking. Es werden nur jene Daten verarbeitet, die für den Betrieb der
            interaktiven Funktionen (Gästebuch, KI-Chat, Besucherzähler) technisch
            notwendig sind. Die nachfolgenden Abschnitte beschreiben dies im Detail.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sub}>3. Hosting (Vercel)</h2>
          <p>
            Diese Website wird bei <strong>Vercel Inc.</strong> (San Francisco, USA) gehostet.
            Bei jedem Seitenaufruf kann Vercel technische Zugriffsdaten (IP-Adresse,
            Zeitstempel, aufgerufene URL, Browser-Typ) in Server-Logs speichern. Diese
            Verarbeitung liegt im berechtigten Interesse des sicheren Betriebs der Website.
            Auf diese Logs habe ich keinen aktiven Zugriff.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sub}>4. IP-Adresse & Rate Limiting</h2>
          <p>
            Um Missbrauch zu verhindern, werden IP-Adressen beim Nutzen folgender Funktionen
            kurzfristig gespeichert:
          </p>
          <ul className={styles.list}>
            <li><strong>KI-Chat:</strong> max. 20 Anfragen pro Stunde — TTL 1 Stunde</li>
            <li><strong>Gästebuch:</strong> max. 3 Einträge pro Stunde — TTL 1 Stunde</li>
            <li><strong>Besucherzähler (who):</strong> aktive Besucher der letzten 2 Minuten — TTL 2 Minuten</li>
          </ul>
          <p>
            Die Speicherung erfolgt ausschliesslich als Hash-Key in der Redis-Datenbank
            (Upstash, s. Abschnitt 7) und wird nach Ablauf der jeweiligen TTL automatisch
            gelöscht. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse
            am Schutz vor Missbrauch).
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sub}>5. Gästebuch</h2>
          <p>
            Wenn Sie über den Terminal-Befehl <code>sign &lt;Nachricht&gt;</code> einen
            Gästebucheintrag hinterlassen, wird Ihre Nachricht zusammen mit einem Zeitstempel
            gespeichert. Es wird kein Name, keine E-Mail-Adresse und keine IP-Adresse im
            Eintrag selbst gespeichert.
          </p>
          <p>
            Vor der Speicherung wird die Nachricht auf unangemessene Inhalte geprüft
            (s. Abschnitt 6). Es werden maximal 100 Einträge gespeichert; ältere Einträge
            werden automatisch überschrieben. Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO
            (Einwilligung durch aktives Absenden). Sie können die Löschung Ihres Eintrags
            jederzeit per E-Mail beantragen.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sub}>6. KI-Funktionen (Anthropic)</h2>
          <p>
            Diese Website nutzt das KI-Modell <strong>Claude</strong> von{' '}
            <strong>Anthropic, PBC</strong> (San Francisco, USA) für zwei Zwecke:
          </p>
          <ul className={styles.list}>
            <li>
              <strong>KI-Chat:</strong> Ihre eingegebenen Nachrichten und der bisherige
              Chatverlauf (max. letzte 10 Nachrichten) werden zur Verarbeitung an Anthropic
              übermittelt.
            </li>
            <li>
              <strong>Gästebuch-Moderation:</strong> Jede Gästebuchnachricht wird vor der
              Speicherung zur Inhaltsprüfung an Anthropic übermittelt.
            </li>
          </ul>
          <p>
            Anthropic verarbeitet diese Daten gemäss ihrer{' '}
            <a
              href="https://www.anthropic.com/privacy"
              className={styles.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              Datenschutzerklärung
            </a>
            . Es handelt sich um eine Drittland-Übermittlung in die USA. Rechtsgrundlage:
            Art. 6 Abs. 1 lit. a DSGVO (Einwilligung durch aktive Nutzung der jeweiligen
            Funktion).
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sub}>7. Datenbankdienstleister (Upstash Redis)</h2>
          <p>
            Für die Speicherung von Gästebucheinträgen, Rate-Limiting-Daten und dem
            Besucherzähler wird <strong>Upstash, Inc.</strong> als Auftragsverarbeiter
            eingesetzt. Die Datenbank ist in der Region <strong>EU-West</strong> gehostet
            (Frankfurt, Deutschland). Die Datenverarbeitung erfolgt auf Basis eines
            Auftragsverarbeitungsvertrags gemäss Art. 28 DSGVO.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sub}>8. Lokaler Speicher (localStorage)</h2>
          <p>
            Diese Website speichert folgende Daten ausschliesslich lokal in Ihrem Browser.
            Es werden dabei keine Daten an einen Server übertragen:
          </p>
          <ul className={styles.list}>
            <li><code>theme</code> — gewähltes Farbschema (hell / dunkel)</li>
            <li><code>lang</code> — gewählte Sprache (DE / EN)</li>
            <li><code>portfolio:intro-seen</code> — ob das Intro bereits angezeigt wurde</li>
            <li><code>portfolio:achievements</code> — freigeschaltete Achievements im Terminal-Game</li>
            <li><code>portfolio:visited-projects</code> — besuchte Projektseiten (für Achievement-Tracking)</li>
            <li><code>aichat_messages</code> — lokaler KI-Chat-Verlauf</li>
            <li><code>aichat_remaining</code> — verbleibende KI-Chat-Anfragen (Anzeige)</li>
          </ul>
          <p>
            Diese Daten verbleiben auf Ihrem Gerät und können jederzeit über die
            Browser-Einstellungen gelöscht werden.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sub}>9. Schriftarten (Web Fonts)</h2>
          <p>
            Diese Website verwendet die Schriftarten <em>Space Mono</em> und{' '}
            <em>Cormorant Garamond</em>. Die Schriftdateien werden beim Build-Prozess
            heruntergeladen und direkt von diesem Server ausgeliefert (<code>next/font</code>).
            Es findet keine Verbindung zu Google-Servern statt.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sub}>10. Externe Links</h2>
          <p>
            Diese Website enthält Links zu GitHub und LinkedIn. Sobald Sie diese Links
            anklicken, gelten die Datenschutzbestimmungen der jeweiligen Anbieter.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sub}>11. Ihre Rechte</h2>
          <p>
            Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung
            der Verarbeitung Ihrer personenbezogenen Daten sowie das Recht auf
            Datenübertragbarkeit. Für Anfragen wenden Sie sich an:{' '}
            <a href="mailto:linus@sommermeyer.ch" className={styles.link}>
              linus@sommermeyer.ch
            </a>
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sub}>12. Anwendbares Recht</h2>
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
