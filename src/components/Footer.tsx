import { Link } from 'react-router-dom'
import { Terminal, Heart } from 'lucide-react'
import { useApp } from '../contexts/AppContext'
import { PAGES } from './PageLayout'

const footerLinks = PAGES.slice(1)

export default function Footer() {
  const { t } = useApp()

  return (
    <footer className="relative mt-8 border-t border-zinc-800/80 px-6 py-14">
      {/* gradient hairline accent */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-7 text-center">
          <Link to="/" className="group flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-500/25 bg-gradient-to-br from-amber-500/15 to-amber-500/5 text-amber-400 transition-all group-hover:border-amber-500/45">
              <Terminal className="h-4.5 w-4.5" />
            </span>
            <span className="text-base font-bold tracking-tight text-white">
              CCC <span className="font-medium text-zinc-500">— Claude Code Course</span>
            </span>
          </Link>

          <nav className="flex max-w-2xl flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {footerLinks.map((l) => (
              <Link
                key={l.path}
                to={l.path}
                className="text-xs font-medium text-zinc-500 transition-colors hover:text-amber-400"
              >
                {t.pages[l.path] ?? l.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col items-center gap-1.5 border-t border-zinc-800/60 pt-6">
            <p className="flex items-center gap-1.5 text-xs text-zinc-500">
              <Heart className="h-3 w-3 text-amber-500/70" />
              {t.footer.builtWith}
            </p>
            <p className="text-xs text-zinc-600">{t.footer.copy}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
