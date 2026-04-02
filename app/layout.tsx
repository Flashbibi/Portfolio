import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/context/ThemeContext'
import { LanguageProvider } from '@/context/LanguageContext'

export const metadata: Metadata = {
  title: 'Linus — Portfolio',
  description: 'CS student, Maker & Developer from Zürich, Switzerland.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const initScript = `(() => {
    try {
      const theme = localStorage.getItem('theme')
      document.documentElement.setAttribute('data-theme', theme === 'light' || theme === 'dark' ? theme : 'dark')
      const lang = localStorage.getItem('lang')
      document.documentElement.setAttribute('lang', lang === 'de' ? 'de' : 'en')
    } catch {
      document.documentElement.setAttribute('data-theme', 'dark')
      document.documentElement.setAttribute('lang', 'en')
    }
  })();`

  return (
    <html lang="en" data-theme="dark">
      <head>
        <script dangerouslySetInnerHTML={{ __html: initScript }} />
      </head>
      <body>
        <ThemeProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
