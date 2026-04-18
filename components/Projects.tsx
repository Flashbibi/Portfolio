'use client'

import { useState } from 'react'
import Link from 'next/link'
import { projects, type ProjectCategory } from '@/data/projects'
import styles from './Projects.module.css'
import { useLang } from '@/context/LanguageContext'
import { translations } from '@/data/translations'
import GlitchText from './GlitchText'

type Filter = 'all' | 'eth' | 'home' | ProjectCategory

function onTiltMove(e: React.MouseEvent<HTMLElement>) {
  const rect = e.currentTarget.getBoundingClientRect()
  const x = (e.clientX - rect.left) / rect.width - 0.5
  const y = (e.clientY - rect.top) / rect.height - 0.5
  e.currentTarget.style.transform = `perspective(800px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) scale(1.01)`
  e.currentTarget.style.transition = 'transform 0.08s ease'
}

function onTiltLeave(e: React.MouseEvent<HTMLElement>) {
  e.currentTarget.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)'
  e.currentTarget.style.transition = 'transform 0.5s ease'
}

export default function Projects() {
  const { lang } = useLang()
  const t = translations[lang].projects
  const [filter, setFilter] = useState<Filter>('all')

  const visible = projects.filter(p => {
    if (filter === 'all') return true
    if (filter === 'eth') return p.origin === 'eth'
    if (filter === 'home') return p.origin === 'home'
    return p.category === filter
  })

  const filterLabel: Record<Filter, string> = {
    all:      t.filters.all,
    eth:      t.filters.eth,
    home:     t.filters.home,
    software: t.filters.software,
    hardware: t.filters.hardware,
  }

  const statusLabel: Record<string, string> = {
    done:    t.status.done,
    wip:     t.status.wip,
    planned: t.status.planned,
  }

  return (
    <section id="projects" className={styles.section} data-reveal>
      <div className={styles.header}>
        <h2 className={styles.heading}>{t.heading}</h2>
        <div className={styles.filters}>
          {(['all', 'eth', 'home', 'software', 'hardware'] as Filter[]).map(f => (
            <button
              key={f}
              className={`${styles.filterBtn} ${filter === f ? styles.active : ''}`}
              onClick={() => setFilter(f)}
            >
              {filterLabel[f]}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.grid}>
        {visible.map(p => {
          const card = (
            <article
              className={`${styles.card} ${p.status === 'planned' ? styles.placeholder : ''}`}
              onMouseMove={p.status !== 'planned' ? onTiltMove : undefined}
              onMouseLeave={p.status !== 'planned' ? onTiltLeave : undefined}
            >
              <div className={styles.numLine}>
                <p className={styles.num}>— {p.num}</p>
                <span className={`${styles.badge} ${styles[p.origin]}`}>
                  {p.origin === 'eth' ? 'ETH' : 'HOME'}
                </span>
              </div>
              <h3 className={styles.title}>
                {p.title}
                {p.titleLine2 && <><br />{p.titleLine2[lang]}</>}
              </h3>
              <p className={styles.desc}>
                <GlitchText id={`home-projects-${p.id}-desc`} active={null}>
                  {p.description[lang]}
                </GlitchText>
              </p>
              {p.tags[lang].length > 0 && (
                <div className={styles.tags}>
                  {p.tags[lang].map(tag => (
                    <span key={tag} className={styles.tag}>{tag}</span>
                  ))}
                </div>
              )}
              <div className={styles.status}>
                <span className={`${styles.dot} ${styles[p.status]}`} />
                {statusLabel[p.status]}
              </div>
              <span className={styles.arrow} aria-hidden="true">↗</span>
            </article>
          )

          if (p.status === 'planned') {
            return <div key={p.id} className={styles.cardLink}>{card}</div>
          }
          return (
            <Link key={p.id} href={`/projects/${p.id}`} className={styles.cardLink}>
              {card}
            </Link>
          )
        })}
      </div>
    </section>
  )
}
