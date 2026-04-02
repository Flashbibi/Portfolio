'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './not-found.module.css'

export default function NotFound() {
  const path = usePathname() ?? '/unknown'

  return (
    <div className={styles.root}>
      <div className={styles.terminal}>

        <div className={styles.line}>
          <span className={styles.user}>visitor</span>
          <span className={styles.at}>@</span>
          <span className={styles.host}>linus-portfolio</span>
          <span className={styles.path}>:~/linus</span>
          <span className={styles.sep}> $ </span>
          <span className={styles.cmd}>cat {path}</span>
        </div>

        <p className={styles.error}>cat: {path}: No such file or directory</p>

        <p className={styles.hint}>// exit 1 — this page does not exist.</p>

        <div className={styles.promptLine}>
          <span className={styles.user}>visitor</span>
          <span className={styles.at}>@</span>
          <span className={styles.host}>linus-portfolio</span>
          <span className={styles.path}>:~/linus</span>
          <span className={styles.sep}> $ </span>
          <Link href="/" className={styles.homeLink}>cd ~</Link>
          <span className={styles.cursor} />
        </div>

      </div>
    </div>
  )
}
