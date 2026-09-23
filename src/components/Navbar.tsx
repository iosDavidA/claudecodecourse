import { NavLink, Link } from 'react-router-dom'
import { Terminal, Menu, X, ChevronDown, Sun, Moon } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { PAGES } from './PageLayout'
import { PageIcon } from './pageIcons'
import { useApp } from '../contexts/AppContext'

const PRIMARY_COUNT = 3
const navLinks = PAGES.slice(1)
const primaryLinks = navLinks.slice(0, PRIMARY_COUNT)
const overflowLinks = navLinks.slice(PRIMARY_COUNT)

function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])
  return scrolled
}

function PrimaryLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink to={to} className="group relative py-1 text-sm font-medium">
      {({ isActive }) => (
        <>
          <span className={`flex items-center gap-1.5 transition-colors duration-200 ${
            isActive ? 'text-amber-400' : 'text-zinc-400 group-hover:text-zinc-100'
          }`}>
            {children}
          </span>
          <span className={`absolute -bottom-0.5 left-0 h-px rounded-full bg-gradient-to-r from-amber-400 to-amber-400/0 transition-all duration-300 ${
            isActive ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-60'
          }`} />
        </>
      )}
    </NavLink>
  )
}

function OverflowDropdown() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { t } = useApp()

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const isAnyActive = overflowLinks.some((l) => window.location.pathname === l.path)

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1 py-1 text-sm font-medium transition-colors duration-200 ${
          isAnyActive ? 'text-amber-400' : 'text-zinc-400 hover:text-zinc-100'
        }`}
      >
        {t.nav.more}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="animate-scale-in absolute right-0 top-full z-50 mt-3 w-60 origin-top-right rounded-2xl border border-zinc-800 bg-zinc-950/95 p-1.5 shadow-[var(--shadow-lux-lg)] backdrop-blur-xl edge-light">
          {overflowLinks.map((l) => (
            <NavLink
              key={l.path}
              to={l.path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors duration-200 ${
                  isActive ? 'bg-amber-500/10 text-amber-400' : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-100'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg transition-colors duration-200 ${
                    isActive ? 'bg-amber-500/15 text-amber-400' : 'bg-zinc-800/70 text-zinc-500 group-hover:text-amber-400'
                  }`}>
                    <PageIcon path={l.path} className="h-3.5 w-3.5" />
                  </span>
                  <span className="font-medium">{t.pages[l.path] ?? l.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { theme, toggleTheme, lang, toggleLang, t } = useApp()
  const scrolled = useScrolled()

  return (
    <nav className={`fixed top-0 z-50 w-full transition-all duration-300 ${
      scrolled
        ? 'border-b border-zinc-800/70 bg-zinc-950/80 backdrop-blur-xl'
        : 'border-b border-transparent bg-zinc-950/30 backdrop-blur-md'
    }`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <Link to="/" className="group flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-500/25 bg-gradient-to-br from-amber-500/15 to-amber-500/5 text-amber-400 transition-all duration-300 group-hover:border-amber-500/45 group-hover:shadow-[0_0_18px_-4px_var(--color-amber-glow)]">
            <Terminal className="h-4.5 w-4.5" />
          </span>
          <span className="flex items-baseline gap-2">
            <span className="text-lg font-bold tracking-tight text-white">CCC</span>
            <span className="hidden text-xs font-medium text-zinc-500 sm:inline">Claude Code Course</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-7 xl:flex">
          {primaryLinks.map((l) => (
            <PrimaryLink key={l.path} to={l.path}>
              {t.pages[l.path] ?? l.label}
            </PrimaryLink>
          ))}
          {overflowLinks.length > 0 && <OverflowDropdown />}
        </div>

        {/* Controls: lang + theme + mobile toggle */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 rounded-xl border border-zinc-800 bg-zinc-900/40 p-1 backdrop-blur-sm">
            <button
              onClick={toggleLang}
              className="btn-ghost rounded-lg px-2.5 py-1 text-xs font-bold text-zinc-400 hover:bg-zinc-800/70 hover:text-amber-400"
              title={lang === 'ro' ? 'Switch to English' : 'Schimbă în Română'}
            >
              {lang === 'ro' ? 'RO' : 'EN'}
            </button>
            <span className="h-4 w-px bg-zinc-800" />
            <button
              onClick={toggleTheme}
              className="btn-ghost rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800/70 hover:text-amber-400"
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="btn-ghost rounded-lg border border-zinc-800 bg-zinc-900/40 p-1.5 text-zinc-300 xl:hidden"
            aria-label={t.nav.mobileMenu}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="animate-fade-in border-t border-zinc-800/80 bg-zinc-950/95 px-4 py-3 backdrop-blur-xl xl:hidden">
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-300 transition-colors hover:bg-zinc-800/60 hover:text-amber-400"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-800/70 text-zinc-500">
              <PageIcon path="/" className="h-3.5 w-3.5" />
            </span>
            {t.nav.home}
          </Link>
          {navLinks.map((l) => (
            <NavLink
              key={l.path}
              to={l.path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                  isActive ? 'bg-amber-500/10 text-amber-400' : 'text-zinc-300 hover:bg-zinc-800/60 hover:text-amber-400'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                    isActive ? 'bg-amber-500/15 text-amber-400' : 'bg-zinc-800/70 text-zinc-500'
                  }`}>
                    <PageIcon path={l.path} className="h-3.5 w-3.5" />
                  </span>
                  {t.pages[l.path] ?? l.label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  )
}
