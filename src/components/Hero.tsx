import { ChevronRight, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'

const terminalLines = [
  { prompt: true, text: 'claude "Adaugă autentificare OAuth cu Google"' },
  { prompt: false, text: '● Analizez structura proiectului...', color: 'text-zinc-500' },
  { prompt: false, text: '● Am identificat 3 fișiere relevante', color: 'text-zinc-500' },
  { prompt: false, text: '● Creez lib/auth.ts cu NextAuth config', color: 'text-amber-400/70' },
  { prompt: false, text: '● Actualizez middleware.ts cu rute protejate', color: 'text-amber-400/70' },
  { prompt: false, text: '✓ Gata — 4 fișiere create, 1 modificat', color: 'text-green-400' },
]

export default function Hero() {
  const [visibleLines, setVisibleLines] = useState(0)
  const [showCursor, setShowCursor] = useState(false)

  useEffect(() => {
    let i = 0
    const tick = () => {
      i++
      setVisibleLines(i)
      if (i < terminalLines.length) {
        setTimeout(tick, i === 0 ? 400 : 600)
      } else {
        setTimeout(() => setShowCursor(true), 300)
      }
    }
    const start = setTimeout(tick, 800)
    return () => clearTimeout(start)
  }, [])

  return (
    <section className="relative overflow-hidden px-6 pt-32 pb-20">
      {/* Background glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-amber-500/5 blur-3xl" />

      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left: Copy */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-4 py-1.5 text-sm text-amber-400">
              <Sparkles className="h-3.5 w-3.5" />
              Curs interactiv — ediția 2026
            </div>

            <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Stăpânește{' '}
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                Claude Code
              </span>
            </h1>

            <p className="mb-8 max-w-lg text-lg leading-relaxed text-zinc-400">
              Învață să folosești Claude Code CLI pentru a genera, refactoriza și
              depana cod direct din terminal. De la comenzi de bază la moduri de
              raționament avansat — totul într-un singur ghid practic.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="#instalare"
                className="glow-amber inline-flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-3 text-sm font-semibold text-zinc-950 transition-all hover:bg-amber-400"
              >
                Începe cursul
                <ChevronRight className="h-4 w-4" />
              </a>
              <a
                href="#referinta"
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-6 py-3 text-sm font-semibold text-zinc-300 transition-all hover:border-zinc-500 hover:text-white"
              >
                Cheat Sheet →
              </a>
            </div>
          </div>

          {/* Right: Animated Terminal mock */}
          <div className="rounded-xl border border-terminal-border bg-terminal shadow-2xl shadow-black/50">
            {/* Title bar */}
            <div className="flex items-center gap-2 rounded-t-xl border-b border-terminal-border bg-terminal-header px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-red-500/80" />
              <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
              <span className="h-3 w-3 rounded-full bg-green-500/80" />
              <span className="ml-3 font-mono text-xs text-zinc-500">claude — ~/proiect</span>
            </div>

            {/* Terminal body */}
            <div className="min-h-[180px] p-5 font-mono text-sm leading-relaxed">
              {terminalLines.slice(0, visibleLines).map((line, i) => (
                <div
                  key={i}
                  className="mb-1.5 animate-fade-up"
                  style={{ animationDelay: '0ms', animationDuration: '200ms' }}
                >
                  {line.prompt ? (
                    <div className="text-zinc-300">
                      <span className="text-amber-400">$</span> {line.text}
                    </div>
                  ) : (
                    <div className={line.color}>{line.text}</div>
                  )}
                </div>
              ))}
              {showCursor && (
                <div className="mt-2 text-zinc-300">
                  <span className="text-amber-400">$</span>{' '}
                  <span className="cursor-blink inline-block h-4 w-2 bg-amber-400" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
