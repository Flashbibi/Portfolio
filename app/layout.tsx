import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/context/ThemeContext'

export const metadata: Metadata = {
  title: 'Linus — Portfolio',
  description: 'Informatikstudent, Maker & Entwickler aus Zürich, Schweiz.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const themeInitScript = `(() => {
    try {
      const saved = localStorage.getItem('theme')
      const theme = saved === 'light' || saved === 'dark' ? saved : 'dark'
      document.documentElement.setAttribute('data-theme', theme)
    } catch {
      document.documentElement.setAttribute('data-theme', 'dark')
    }
  })();`

  return (
    <html lang="de" data-theme="dark">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
