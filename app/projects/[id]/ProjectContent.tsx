'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { projects, type Project } from '@/data/projects'
import { EXPLORER_PROJECTS, LS_VISITED } from '@/data/achievements'
import type { ProjectPage } from '@/lib/markdown'
import styles from './page.module.css'
import { useLang } from '@/context/LanguageContext'
import { useAchievement } from '@/context/AchievementContext'
import { translations } from '@/data/translations'
import AchievementsSection from '@/components/AchievementsSection'

const ModelViewer = dynamic(() => import('@/components/ModelViewer'), { ssr: false })

interface Props {
  project: Project
  pages: ProjectPage[]
}

export default function ProjectContent({ project, pages }: Props) {
  const { lang } = useLang()
  const { unlock } = useAchievement()
  const t = translations[lang].projectDetail

  useEffect(() => {
    try {
      const raw     = localStorage.getItem(LS_VISITED)
      const visited = new Set<string>(raw ? JSON.parse(raw) as string[] : [])
      visited.add(project.id)
      localStorage.setItem(LS_VISITED, JSON.stringify(Array.from(visited)))
      if (EXPLORER_PROJECTS.every(id => visited.has(id))) unlock('explorer')
    } catch { /* ignore */ }
  }, [project.id, unlock])
  const tProjects = translations[lang].projects

  const [activePage, setActivePage] = useState(0)

  const navProjects = projects.filter(p => p.status !== 'planned')

  const statusLabel: Record<string, string> = {
    done:    tProjects.status.done,
    wip:     tProjects.status.wip,
    planned: tProjects.status.planned,
  }

  const currentPage = pages[activePage]
  const hasPages = pages.length > 0

  return (
    <main className={styles.page}>
      <aside className={styles.sidebar}>
        <Link href="/#projects" className={styles.back}>
          {t.back}
        </Link>

        {/* Pages within this project */}
        {hasPages && (
          <nav className={styles.pageNav}>
            <span className={styles.pageNavLabel}>{project.title}</span>
            {pages.map((page, i) => (
              <button
                key={page.slug}
                className={`${styles.pageNavItem} ${i === activePage ? styles.active : ''}`}
                onClick={() => setActivePage(i)}
              >
                {page.title}
              </button>
            ))}
          </nav>
        )}

        {/* Other projects */}
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

        <div className={styles.tags}>
          {project.tags[lang].map(tag => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>

        {hasPages ? (
          <>
            {currentPage.model && (
              <ModelViewer model={currentPage.model} />
            )}
            {currentPage.type === 'achievements' ? (
              <AchievementsSection />
            ) : (
              <article
                className={styles.markdown}
                dangerouslySetInnerHTML={{ __html: currentPage.html }}
              />
            )}
          </>
        ) : (
          <p className={styles.description}>{t.detailsEmpty}</p>
        )}
      </section>
    </main>
  )
}
