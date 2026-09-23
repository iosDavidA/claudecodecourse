import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useApp } from '../contexts/AppContext'
import { PageIcon } from './pageIcons'

export interface PageMeta {
  path: string
  label: string
  emoji: string
}

export const PAGES: PageMeta[] = [
  { path: '/',             label: 'Acasă',        emoji: '🏠' },
  { path: '/instalare',   label: 'Instalare',     emoji: '⚙️' },
  { path: '/rationament', label: 'Raționament',   emoji: '🧠' },
  { path: '/tools',       label: 'Tools',         emoji: '🔧' },
  { path: '/comenzi',     label: 'Comenzi',       emoji: '⌨️' },
  { path: '/prompting',   label: 'Prompting',     emoji: '✍️' },
  { path: '/modele',      label: 'Modele',        emoji: '🤖' },
  { path: '/tokenuri',    label: 'Tokenuri',      emoji: '🪙' },
  { path: '/automatizare', label: 'Automatizare', emoji: '⚡' },
  { path: '/programare',  label: 'Programare',    emoji: '⏰' },
  { path: '/avansat',     label: 'Avansat',       emoji: '🚀' },
  { path: '/skills',      label: 'Skills',        emoji: '⚡' },
  { path: '/workflows',        label: 'Workflows',        emoji: '🔄' },
  { path: '/proiect-complet', label: 'Proiect Complet',  emoji: '🏗️' },
  { path: '/referinta',       label: 'Cheat Sheet',      emoji: '📋' },
]

interface PageLayoutProps {
  children: React.ReactNode
  currentPath: string
}

export default function PageLayout({ children, currentPath }: PageLayoutProps) {
  const idx = PAGES.findIndex((p) => p.path === currentPath)
  const prev = idx > 0 ? PAGES[idx - 1] : null
  const next = idx < PAGES.length - 1 ? PAGES[idx + 1] : null
  const { t } = useApp()

  const label = (page: PageMeta) => t.pages[page.path] ?? page.label

  return (
    <div className="min-h-screen pt-16">
      {children}

      <div className="mx-auto max-w-6xl px-6 pb-16">
        <div className="mt-4 flex items-center justify-between gap-4 border-t border-zinc-800 pt-8">
          {prev ? (
            <Link
              to={prev.path}
              className="card-rise group flex items-center gap-3.5 rounded-2xl border border-zinc-800 bg-zinc-900/50 px-5 py-3.5 text-sm hover:border-amber-500/40"
            >
              <ChevronLeft className="h-4 w-4 flex-shrink-0 text-zinc-500 transition-all group-hover:-translate-x-0.5 group-hover:text-amber-400" />
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-zinc-800/70 text-zinc-400 transition-colors group-hover:bg-amber-500/15 group-hover:text-amber-400">
                <PageIcon path={prev.path} className="h-4 w-4" />
              </span>
              <span className="hidden sm:block">
                <span className="block text-[11px] font-medium uppercase tracking-wider text-zinc-600">{t.layout.back}</span>
                <span className="block font-semibold text-zinc-300 group-hover:text-white">{label(prev)}</span>
              </span>
            </Link>
          ) : (
            <div />
          )}

          <div className="hidden items-center gap-1.5 sm:flex">
            {PAGES.map((p) => (
              <Link
                key={p.path}
                to={p.path}
                title={label(p)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  p.path === currentPath
                    ? 'w-7 bg-gradient-to-r from-amber-400 to-amber-500 shadow-[0_0_10px_-1px_var(--color-amber-glow)]'
                    : 'w-1.5 bg-zinc-700 hover:w-3 hover:bg-zinc-500'
                }`}
              />
            ))}
          </div>

          {next ? (
            <Link
              to={next.path}
              className="card-rise group flex items-center gap-3.5 rounded-2xl border border-zinc-800 bg-zinc-900/50 px-5 py-3.5 text-sm hover:border-amber-500/40"
            >
              <span className="hidden text-right sm:block">
                <span className="block text-[11px] font-medium uppercase tracking-wider text-zinc-600">{t.layout.next}</span>
                <span className="block font-semibold text-zinc-300 group-hover:text-white">{label(next)}</span>
              </span>
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-zinc-800/70 text-zinc-400 transition-colors group-hover:bg-amber-500/15 group-hover:text-amber-400">
                <PageIcon path={next.path} className="h-4 w-4" />
              </span>
              <ChevronRight className="h-4 w-4 flex-shrink-0 text-zinc-500 transition-all group-hover:translate-x-0.5 group-hover:text-amber-400" />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  )
}
