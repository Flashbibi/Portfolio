import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/context/ThemeContext'
import { LanguageProvider } from '@/context/LanguageContext'

export const metadata: Metadata = {
  title: 'Linus Sommermeyer — Portfolio',
  description: 'CS Apprentice & Developer from Zürich. I build things — from code, filament, and curiosity.',
  openGraph: {
    type: 'website',
    siteName: 'Linus Sommermeyer',
    title: 'Linus Sommermeyer — Portfolio',
    description: 'CS Apprentice & Developer from Zürich. I build things — from code, filament, and curiosity.',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary',
    title: 'Linus Sommermeyer — Portfolio',
    description: 'CS Apprentice & Developer from Zürich. I build things — from code, filament, and curiosity.',
  },
  robots: {
    index: true,
    follow: true,
  },
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
    <html lang="en" data-theme="dark" suppressHydrationWarning>
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
