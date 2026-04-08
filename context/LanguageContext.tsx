'use client'

import { createContext, useContext, useEffect, useRef, useState } from 'react'

export type Lang = 'en' | 'de'

interface LangContextValue {
  lang: Lang
  isGlitching: boolean
  toggle: () => void
}

const LangContext = createContext<LangContextValue>({
  lang: 'en',
  isGlitching: false,
  toggle: () => {},
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang]          = useState<Lang>('en')
  const [isGlitching, setGlitch] = useState(false)
  const isFirstRender            = useRef(true)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('lang')
      if (saved === 'en' || saved === 'de') setLang(saved as Lang)
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    function onSet(e: Event) {
      const l = (e as CustomEvent<string>).detail
      if (l === 'en' || l === 'de') setLang(l as Lang)
    }
    window.addEventListener('portfolio:lang-set', onSet)
    return () => window.removeEventListener('portfolio:lang-set', onSet)
  }, [])

  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return }
    document.documentElement.setAttribute('lang', lang)
    try {
      localStorage.setItem('lang', lang)
    } catch { /* ignore */ }
  }, [lang])

  const toggle = () => {
    if (isGlitching) return
    setGlitch(true)
    setTimeout(() => setLang(l => (l === 'en' ? 'de' : 'en')), 100)
    setTimeout(() => setGlitch(false), 610)
  }

  return (
    <LangContext.Provider value={{ lang, isGlitching, toggle }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => useContext(LangContext)
