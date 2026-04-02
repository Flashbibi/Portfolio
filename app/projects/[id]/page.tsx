import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { projects } from '@/data/projects'
import ProjectContent from './ProjectContent'

interface PageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const project = projects.find(p => p.id === params.id)

  if (!project) {
    return { title: 'Project — Linus' }
  }

  const titleLine2 = project.titleLine2?.en
  const title = titleLine2
    ? `${project.title} ${titleLine2} — Linus`
    : `${project.title} — Linus`

  return {
    title,
    description: project.description.en,
  }
}

export default function ProjectDetailPage({ params }: PageProps) {
  const project = projects.find(p => p.id === params.id)

  if (!project) {
    redirect('/')
  }

  return <ProjectContent project={project} />
}
