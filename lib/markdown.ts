import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'

export interface ProjectPage {
  slug: string
  title: string
  order: number
  model?: string
  type?: string
  html: string
}

const CONTENT_DIR = path.join(process.cwd(), 'content', 'projects')

export function getProjectPages(projectId: string): ProjectPage[] {
  const dir = path.join(CONTENT_DIR, projectId)

  if (!fs.existsSync(dir)) return []

  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'))

  const pages = files.map(file => {
    const slug = file.replace(/\.md$/, '')
    const raw = fs.readFileSync(path.join(dir, file), 'utf-8')
    const { data, content } = matter(raw)

    return {
      slug,
      title: (data.title as string) ?? slug,
      order: (data.order as number) ?? 99,
      model: data.model as string | undefined,
      type: data.type as string | undefined,
      html: marked(content) as string,
    }
  })

  return pages.sort((a, b) => a.order - b.order)
}
