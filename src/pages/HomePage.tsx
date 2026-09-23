import { Link } from 'react-router-dom'
import { ChevronRight, Sparkles, Terminal, Shield, Code2, Brain, ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { PAGES } from '../components/PageLayout'
import { PageIcon } from '../components/pageIcons'
import { useApp } from '../contexts/AppContext'

// Difficulty tier per route → ember intensity (ember-dominant, no rainbow)
const TIER: Record<string, number> = {
  '/instalare': 0, '/rationament': 1, '/tools': 1, '/comenzi': 1,
  '/prompting': 2, '/modele': 2, '/tokenuri': 2,
  '/automatizare': 3, '/programare': 3, '/avansat': 3, '/skills': 3, '/workflows': 3,
  '/proiect-complet': 4, '/referinta': 0,
}
const TIER_BADGE = [
  'text-zinc-400 bg-zinc-800/70 border-zinc-700/50',
  'text-amber-300/90 bg-amber-500/[0.08] border-amber-500/20',
  'text-amber-400 bg-amber-500/[0.12] border-amber-500/25',
  'text-amber-400 bg-amber-500/[0.15] border-amber-500/35',
  'text-amber-200 bg-amber-500/20 border-amber-500/45',
]

// ── Animated terminal ─────────────────────────────────────────────────────────

interface TerminalLine {
  prompt: boolean
  text: string
  color?: string
}

function AnimatedTerminal() {
  const { t } = useApp()
  const scenarios = t.home.scenarios

  const [scenarioIdx, setScenarioIdx] = useState(0)
  const [visibleLines, setVisibleLines] = useState(0)
  const [showCursor, setShowCursor] = useState(false)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    let cancelled = false

    const runScenario = () => {
      const lines = scenarios[scenarioIdx]
      let i = 0

      const tick = () => {
        if (cancelled) return
        i++
        setVisibleLines(i)
        if (i < lines.length) {
          setTimeout(tick, i === 1 ? 500 : 650)
        } else {
          setTimeout(() => {
            if (cancelled) return
            setShowCursor(true)
            setTimeout(() => {
              if (cancelled) return
              setFading(true)
              setTimeout(() => {
                if (cancelled) return
                setFading(false)
                setVisibleLines(0)
                setShowCursor(false)
                setScenarioIdx((s) => (s + 1) % scenarios.length)
              }, 400)
            }, 2800)
          }, 200)
        }
      }

      setTimeout(tick, 600)
    }

    runScenario()
    return () => { cancelled = true }
  }, [scenarioIdx, scenarios])

  const lines: TerminalLine[] = scenarios[scenarioIdx]

  return (
    <div className="gradient-frame rounded-2xl">
      <div className={`preserve-dark overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-[var(--shadow-lux-lg)] transition-opacity duration-300 ${fading ? 'opacity-0' : 'opacity-100'}`}>
        <div className="flex items-center gap-2 border-b border-zinc-800 bg-zinc-900/80 px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-red-500/80" />
          <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <span className="h-3 w-3 rounded-full bg-green-500/80" />
          <span className="ml-3 font-mono text-xs text-zinc-500">claude — ~/project</span>
          <div className="ml-auto flex gap-1">
            {scenarios.map((_, i) => (
              <span key={i} className={`h-1.5 w-1.5 rounded-full transition-colors ${i === scenarioIdx ? 'bg-amber-400' : 'bg-zinc-700'}`} />
            ))}
          </div>
        </div>
        <div className="min-h-[210px] p-5 font-mono text-sm leading-relaxed">
          {lines.slice(0, visibleLines).map((line, i) => (
            <div key={`${scenarioIdx}-${i}`} className="mb-1.5 animate-fade-up" style={{ animationDuration: '180ms' }}>
              {line.prompt ? (
                <div className="text-zinc-200">
                  <span className="text-amber-400">$</span> <span className="text-amber-300/90">{line.text}</span>
                </div>
              ) : (
                <div className={line.color ?? 'text-zinc-400'}>{line.text}</div>
              )}
            </div>
          ))}
          {showCursor && (
            <div className="mt-2">
              <span className="text-amber-400">$</span>{' '}
              <span className="cursor-blink inline-block h-4 w-2 bg-amber-400" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

const WHY_ICONS = [
  <Terminal className="h-5 w-5" />,
  <Brain className="h-5 w-5" />,
  <Code2 className="h-5 w-5" />,
  <Shield className="h-5 w-5" />,
]

const coursePages = PAGES.slice(1)

export default function HomePage() {
  const { t } = useApp()
  const lessonCount = coursePages.length
  const stats = t.home.stats(lessonCount)
  const heroPills = t.home.heroPills(lessonCount)

  return (
    <div className="min-h-screen pt-16">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 py-20 sm:py-28">
        <div className="pointer-events-none absolute top-[-10%] left-1/2 -z-10 h-[620px] w-[920px] -translate-x-1/2 rounded-full bg-amber-500/[0.06] blur-[120px]" />
        <div className="pointer-events-none absolute top-40 left-0 -z-10 h-[320px] w-[420px] rounded-full bg-orange-500/[0.04] blur-[100px]" />

        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-14 lg:grid-cols-2">

            <div className="stagger">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/[0.07] px-4 py-1.5 text-sm text-amber-400 backdrop-blur-sm edge-light">
                <Sparkles className="h-3.5 w-3.5" />
                {t.home.heroBadge}
              </div>

              <h1 className="mb-5 text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-[4.25rem]">
                {t.home.heroVerb}{' '}
                <span className="bg-gradient-to-br from-amber-300 via-amber-400 to-orange-500 bg-clip-text text-transparent text-glow">
                  Claude Code
                </span>
              </h1>

              <p className="mb-8 max-w-lg text-lg leading-relaxed text-zinc-400">
                {t.home.heroSubtitle}
              </p>

              <div className="mb-10 flex flex-wrap gap-3.5">
                <Link
                  to="/instalare"
                  className="btn-ember inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-zinc-950"
                >
                  {t.home.heroCta}
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/referinta"
                  className="btn-ghost inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900/40 px-6 py-3 text-sm font-semibold text-zinc-300 hover:border-zinc-600 hover:bg-zinc-900 hover:text-white"
                >
                  {t.home.heroCheatSheet}
                </Link>
              </div>

              <div className="flex flex-wrap gap-2">
                {heroPills.map((f) => (
                  <span key={f} className="rounded-full border border-zinc-800 bg-zinc-900/40 px-3 py-1 text-xs font-medium text-zinc-400 backdrop-blur-sm">
                    {f}
                  </span>
                ))}
              </div>
            </div>

            <div className="animate-scale-in" style={{ animationDelay: '0.15s' }}>
              <AnimatedTerminal />
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────────────── */}
      <section className="px-6 py-6">
        <div className="mx-auto max-w-6xl">
          <div className="stagger grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((s, i) => (
              <div key={i} className="card-rise rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 text-center">
                <div className="font-mono text-3xl font-bold tracking-tight text-amber-400">{s.value}</div>
                <div className="mt-1.5 text-sm font-semibold text-zinc-200">{s.label}</div>
                <div className="mt-0.5 text-xs text-zinc-500">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CLAUDE CODE ───────────────────────────────────────────────── */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <h2 className="mb-2 text-3xl font-bold tracking-tight text-white">{t.home.whyTitle}</h2>
            <p className="text-sm text-zinc-500">{t.home.whySub}</p>
          </div>

          <div className="stagger grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {t.home.whyCards.map((card, i) => (
              <div key={card.title} className="card-rise group rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 hover:border-amber-500/30">
                <div className="mb-4 inline-flex rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-amber-400 transition-all duration-300 group-hover:border-amber-500/35 group-hover:shadow-[0_0_22px_-6px_var(--color-amber-glow)]">
                  {WHY_ICONS[i]}
                </div>
                <h3 className="mb-2 font-semibold text-white">{card.title}</h3>
                <p className="text-sm leading-relaxed text-zinc-400">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COURSE INDEX ──────────────────────────────────────────────────── */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="mb-1 text-3xl font-bold tracking-tight text-white">{t.home.courseTitle}</h2>
              <p className="text-sm text-zinc-500">{t.home.courseDesc(coursePages.length)}</p>
            </div>
            <Link to="/instalare" className="group hidden items-center gap-1.5 text-sm font-medium text-amber-400 hover:text-amber-300 sm:flex">
              {t.home.courseStart} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="stagger grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {coursePages.map((page, i) => {
              const meta = t.home.pageMeta[page.path]
              const pageLabel = t.pages[page.path] ?? page.label
              return (
                <Link
                  key={page.path}
                  to={page.path}
                  className="card-rise group flex items-start gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-amber-500/30"
                >
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-800/50 text-zinc-400 transition-all duration-300 group-hover:border-amber-500/30 group-hover:bg-amber-500/10 group-hover:text-amber-400">
                    <PageIcon path={page.path} className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="truncate font-semibold text-white">{pageLabel}</span>
                      </div>
                      {meta && (
                        <span className={`flex-shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${TIER_BADGE[TIER[page.path] ?? 0]}`}>
                          {meta.badge}
                        </span>
                      )}
                    </div>
                    {meta && (
                      <p className="text-xs leading-relaxed text-zinc-500 transition-colors group-hover:text-zinc-400">
                        {meta.desc}
                      </p>
                    )}
                  </div>

                  <span className="self-center font-mono text-xs font-medium text-zinc-700 transition-colors group-hover:text-amber-500/70">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ────────────────────────────────────────────────────── */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="gradient-frame preserve-dark relative overflow-hidden rounded-3xl border border-amber-500/15 bg-gradient-to-br from-amber-500/[0.07] via-zinc-900/60 to-zinc-950 p-10 text-center sm:p-14">
            <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-amber-500/[0.06] to-transparent" />
            <div className="pointer-events-none absolute bottom-[-30%] left-1/2 -z-10 h-64 w-[500px] -translate-x-1/2 rounded-full bg-amber-500/[0.05] blur-[100px]" />
            <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-500/25 bg-amber-500/10 text-amber-400 shadow-[0_0_30px_-8px_var(--color-amber-glow)]">
              <Terminal className="h-6 w-6" />
            </span>
            <h2 className="mb-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {t.home.ctaTitle}
            </h2>
            <p className="mx-auto mb-8 max-w-md text-zinc-400">
              {t.home.ctaSubtitle}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3.5">
              <Link
                to="/instalare"
                className="btn-ember inline-flex items-center gap-2 rounded-xl px-7 py-3 font-semibold text-zinc-950"
              >
                {t.home.ctaInstall}
                <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                to="/rationament"
                className="btn-ghost inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900/40 px-7 py-3 text-sm font-semibold text-zinc-300 hover:border-zinc-600 hover:text-white"
              >
                {t.home.ctaReasoning}
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
