import type { Metadata } from 'next'
import MeContent from './MeContent'

export const metadata: Metadata = {
  title: 'Me — Linus Sommermeyer',
  description: 'A more personal chapter — the person behind the code.',
  robots: { index: true, follow: true },
}

export default function MePage() {
  return <MeContent />
}
