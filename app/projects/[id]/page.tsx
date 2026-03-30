import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { projects } from '@/data/projects'
import styles from './page.module.css'

interface PageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const project = projects.find(p => p.id === params.id)

  if (!project) {
    return {
      title: 'Projekt — Linus',
    }
  }

  const title = project.titleLine2
    ? `${project.title} ${project.titleLine2} — Linus`
    : `${project.title} — Linus`

  return {
    title,
    description: project.description,
  }
}

export default function ProjectDetailPage({ params }: PageProps) {
  const project = projects.find(p => p.id === params.id)

  if (!project) {
    redirect('/')
  }

  const navProjects = projects.filter(p => p.status !== 'planned')

  return (
    <main className={styles.page}>
      <aside className={styles.sidebar}>
        <Link href="/#projects" className={styles.back}>
          ← zurück
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
            {project.statusLabel}
          </span>
        </div>

        <h1 className={styles.title}>
          {project.title}
          {project.titleLine2 && (
            <>
              <br />
              {project.titleLine2}
            </>
          )}
        </h1>

        <p className={styles.description}>{project.description}</p>

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
          {project.details.length > 0 ? (
            project.details.map(detail => <li key={detail}>{detail}</li>)
          ) : (
            <li>Details folgen bald.</li>
          )}
        </ul>
      </section>
    </main>
  )
}
