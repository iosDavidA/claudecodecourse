import { createContext, useContext, useEffect, useState } from 'react'
import type { Lang, Translations } from '../i18n/translations'
import { TRANSLATIONS } from '../i18n/translations'

type Theme = 'dark' | 'light'

interface AppContextType {
  theme: Theme
  toggleTheme: () => void
  lang: Lang
  toggleLang: () => void
  t: Translations
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() =>
    (localStorage.getItem('ccc-theme') as Theme) ?? 'dark'
  )
  const [lang, setLang] = useState<Lang>(() =>
    (localStorage.getItem('ccc-lang') as Lang) ?? 'ro'
  )

  useEffect(() => {
    const html = document.documentElement
    html.classList.toggle('light', theme === 'light')
    html.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('ccc-theme', theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.lang = lang
    localStorage.setItem('ccc-lang', lang)
  }, [lang])

  return (
    <AppContext.Provider value={{
      theme,
      toggleTheme: () => setTheme(prev => prev === 'dark' ? 'light' : 'dark'),
      lang,
      toggleLang: () => setLang(prev => prev === 'ro' ? 'en' : 'ro'),
      t: TRANSLATIONS[lang],
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
