'use client'

import Link from 'next/link'
import { projects, type Project } from '@/data/projects'
import styles from './page.module.css'
import { useLang } from '@/context/LanguageContext'
import { translations } from '@/data/translations'

interface Props {
  project: Project
}

export default function ProjectContent({ project }: Props) {
  const { lang } = useLang()
  const t = translations[lang].projectDetail
  const tProjects = translations[lang].projects

  const navProjects = projects.filter(p => p.status !== 'planned')

  const statusLabel: Record<string, string> = {
    done:    tProjects.status.done,
    wip:     tProjects.status.wip,
    planned: tProjects.status.planned,
  }

  const details = project.details[lang]

  return (
    <main className={styles.page}>
      <aside className={styles.sidebar}>
        <Link href="/#projects" className={styles.back}>
          {t.back}
        </Link>

        <nav className={styles.nav}>
          {navProjects.map(item => (
            <Link
              key={item.id}
              href={`/projects/${item.id}`}
              className={`${styles.navItem} ${item.id === project.id ? styles.active : ''}`}
            >
              <span className={styles.navNum}>{item.num}</span>
              <span className={styles.navTitle}>{item.title}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <section className={styles.content}>
        <div className={styles.topline}>
          <span className={`${styles.originBadge} ${project.origin === 'eth' ? styles.eth : styles.home}`}>
            {project.origin === 'eth' ? 'ETH' : 'HOME'}
          </span>
          <span className={styles.status}>
            <span className={`${styles.dot} ${styles[project.status]}`} />
            {statusLabel[project.status]}
          </span>
        </div>

        <h1 className={styles.title}>
          {project.title}
          {project.titleLine2 && (
            <>
              <br />
              {project.titleLine2[lang]}
            </>
          )}
        </h1>

        <p className={styles.description}>{project.description[lang]}</p>

        {project.tags.length > 0 && (
          <div className={styles.tags}>
            {project.tags.map(tag => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        )}

        <ul className={styles.details}>
          {details.length > 0 ? (
            details.map(detail => <li key={detail}>{detail}</li>)
          ) : (
            <li>{t.detailsEmpty}</li>
          )}
        </ul>
      </section>
    </main>
  )
}
