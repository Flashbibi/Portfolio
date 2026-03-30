'use client'

import { useState } from 'react'
import { projects, type ProjectCategory } from '@/data/projects'
import styles from './Projects.module.css'

type Filter = 'all' | ProjectCategory

export default function Projects() {
  const [filter, setFilter] = useState<Filter>('all')

  const visible = projects.filter(p => filter === 'all' || p.category === filter)

  return (
    <section id="projects" className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.heading}>Projekte</h2>
        <div className={styles.filters}>
          {(['all', 'software', 'hardware'] as Filter[]).map(f => (
            <button
              key={f}
              className={`${styles.filterBtn} ${filter === f ? styles.active : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'Alle' : f === 'software' ? 'Software' : 'Hardware / 3D'}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.grid}>
        {visible.map(p => (
          <article
            key={p.id}
            className={`${styles.card} ${p.status === 'planned' ? styles.placeholder : ''}`}
          >
            <p className={styles.num}>— {p.num}</p>
            <h3 className={styles.title}>
              {p.title}
              {p.titleLine2 && <><br />{p.titleLine2}</>}
            </h3>
            <p className={styles.desc}>{p.description}</p>
            {p.tags.length > 0 && (
              <div className={styles.tags}>
                {p.tags.map(t => (
                  <span key={t} className={styles.tag}>{t}</span>
                ))}
              </div>
            )}
            <div className={styles.status}>
              <span className={`${styles.dot} ${styles[p.status]}`} />
              {p.statusLabel}
            </div>
            {p.status !== 'planned' && <span className={styles.arrow} aria-hidden="true">↗</span>}
          </article>
        ))}
      </div>
    </section>
  )
}
