import { useState } from 'react'
import { Terminal, GitBranch, Webhook, FileCode, ShieldCheck, AlertTriangle, Lightbulb, CheckCircle, ChevronRight } from 'lucide-react'
import { CodeBlock } from './CodeBlock'
import { useApp } from '../contexts/AppContext'

type TabId = 'headless' | 'cicd' | 'hooks' | 'scripturi' | 'securitate'
interface Tab { id: TabId; label: string; icon: React.ReactNode }

interface OutputFormat { format: string; title: string; desc: string }
interface Flag { flag: string; desc: string }
interface CicdItem { n: string; name: string; desc: string; emoji: string }
interface HookType { name: string; color: string; desc: string }
interface Recipe { title: string; emoji: string; desc: string }
interface Script { emoji: string; title: string; desc: string }
interface CostItem { n: string; tip: string; desc: string }

interface HeadlessContent {
  label: string
  title: string
  desc: string
  syntaxTitle: string
  outputTitle: string
  outputFormats: OutputFormat[]
  flagsTitle: string
  flags: Flag[]
  exitCodesNote: string
}

interface CicdContent {
  label: string
  title: string
  desc: string
  items: CicdItem[]
  apiKeyNote: string
}

interface HooksContent {
  label: string
  title: string
  desc: string
  hookTypes: HookType[]
  recipesTitle: string
  recipes: Recipe[]
}

interface ScripturiContent {
  label: string
  title: string
  desc: string
  scripts: Script[]
  tipNote: string
}

interface SecuritateContent {
  label: string
  title: string
  desc: string
  leastPrivTitle: string
  leastPrivDesc: string
  dangerLabel: string
  safeLabel: string
  apiKeyTitle: string
  costTitle: string
  costItems: CostItem[]
  checklistTitle: string
  checklist: string[]
}

interface ContentShape {
  pageLabel: string
  pageTitle: string
  pageDesc: string
  tabs: Record<TabId, string>
  headless: HeadlessContent
  cicd: CicdContent
  hooks: HooksContent
  scripturi: ScripturiContent
  securitate: SecuritateContent
}

const CONTENT: Record<'ro' | 'en', ContentShape> = {
  ro: {
    pageLabel: 'Lecția 8',
    pageTitle: 'Automatizare cu Claude Code',
    pageDesc: 'De la CI/CD pipelines la scripturi shell, hooks event-driven și securitate în medii automatizate.',
    tabs: {
      headless: 'Headless Mode',
      cicd: 'CI/CD',
      hooks: 'Hooks',
      scripturi: 'Scripturi',
      securitate: 'Securitate',
    },
    headless: {
      label: 'Non-interactiv',
      title: 'Headless Mode — Claude ca subprocess',
      desc: 'Flagul -p transformă Claude Code într-un subprocess scriptabil: un singur prompt, un singur răspuns. Baza oricărei automatizări.',
      syntaxTitle: 'Sintaxa de bază',
      outputTitle: 'Formate de output',
      outputFormats: [
        { format: '--output-format text', title: 'Text (default)', desc: 'Uman-lizibil. Markdown, cod, explicații.' },
        { format: '--output-format json', title: 'JSON', desc: 'Structurat cu metadata: tokeni, model, date.' },
        { format: '--output-format stream-json', title: 'Stream JSON', desc: 'Un event per linie. Real-time progress tracking.' },
      ],
      flagsTitle: 'Flaguri esențiale',
      flags: [
        { flag: '--max-turns N', desc: 'Limitează iterații agentice. Previne runaway jobs.' },
        { flag: '--allowedTools X,Y,Z', desc: 'Doar tools-urile specificate. Sigur în CI.' },
        { flag: '--output-format json', desc: 'Răspuns structurat pentru parsing.' },
        { flag: '--no-stream', desc: 'Răspunsul complet din o dată.' },
      ],
      exitCodesNote: '0 = succes, 1 = eroare, 2 = max-turns depășit. Poți folosi în bash condiționale.',
    },
    cicd: {
      label: 'Integrare continuă',
      title: 'Claude Code în CI/CD pipelines',
      desc: 'Automatizează code review, quality gates, documentație — la fiecare commit.',
      items: [
        { n: '01', name: 'PR Review automat', desc: 'Pe fiecare PR: analiza diff-ului, raport de CRITIC/WARNING/SUGESTIE', emoji: '🔍' },
        { n: '02', name: 'Quality Gate', desc: 'Merge blocat dacă găsește vulnerabilități critice', emoji: '🛡️' },
        { n: '03', name: 'Changelog automat', desc: 'Generează CHANGELOG pe baza commit history', emoji: '📝' },
        { n: '04', name: 'Security audit zilnic', desc: 'Raport periodic cu detectarea de secrets și vulnerabilități', emoji: '⚠️' },
      ],
      apiKeyNote: 'Folosește GitHub Secrets sau GitLab CI/CD Variables. Niciodată hardcodat în workflow files.',
    },
    hooks: {
      label: 'Event-driven',
      title: 'Hooks — automatizare la momente-cheie',
      desc: 'Hook-urile rulează comenzi shell la fiecare tool call. Fără intervenție manuală.',
      hookTypes: [
        { name: 'PreToolUse', color: 'text-blue-400', desc: 'Înainte de orice tool call' },
        { name: 'PostToolUse', color: 'text-green-400', desc: 'După un tool call' },
        { name: 'Stop', color: 'text-amber-400', desc: 'La finalizarea sesiunii' },
        { name: 'SubagentStop', color: 'text-purple-400', desc: 'La finalizarea subagentului' },
      ],
      recipesTitle: 'Rețete de hook-uri',
      recipes: [
        { title: 'Auto-format la scriere', emoji: '✨', desc: 'Prettier rulează automat pe orice fișier scris' },
        { title: 'Auto-test la scriere în src/', emoji: '✅', desc: 'Vitest rulează și raportează erorile imediat' },
        { title: 'TypeScript check la fiecare .ts', emoji: '🔍', desc: 'tsc verifică tipurile după editare' },
        { title: 'Audit log pe toate operațiile', emoji: '📋', desc: 'Timestamp + session ID pentru fiecare acțiune' },
        { title: 'Blocare fișiere critice', emoji: '🚫', desc: 'Previne modificări la .env, config, migrations' },
      ],
    },
    scripturi: {
      label: 'Shell automation',
      title: 'Scripturi shell cu Claude Code',
      desc: 'Claude ca bloc de bază în bash — batch processing, generare automată, monitorizare.',
      scripts: [
        { emoji: '🧪', title: 'Generare teste pentru fișiere noi', desc: 'Bash loop care apelează claude pt fiecare .ts nou adăugat' },
        { emoji: '🔐', title: 'Security audit zilnic', desc: 'Cron job care generează raport de vulnerabilități' },
        { emoji: '🔄', title: 'Batch migration', desc: 'Aplică același transform pe mai multe fișiere' },
        { emoji: '📝', title: 'Generare PR description', desc: 'din git log + diff stats, crează PR cu gh cli' },
        { emoji: '📦', title: 'Monitorizare dependențe', desc: 'Verific daily cu npm audit, trimite alerte' },
      ],
      tipNote: 'bash loops cu claude -p apeluri. Ideal pt batch processing: iterezi pe fișiere/PRs și aplici Claude pe fiecare.',
    },
    securitate: {
      label: 'Best practices',
      title: 'Securitate în medii automatizate',
      desc: 'Automation fără controale = risc major. Apără-te cu least privilege.',
      leastPrivTitle: 'Least Privilege',
      leastPrivDesc: 'Claude ar trebui să aibă acces DOAR la ce e necesar. Un job de review nu are nevoie de Write.',
      dangerLabel: 'Periculos',
      safeLabel: 'Sigur',
      apiKeyTitle: 'API Key Management',
      costTitle: 'Cost Control',
      costItems: [
        { n: '1', tip: '--max-turns N', desc: 'Limitează iterații agentice' },
        { n: '2', tip: 'Haiku pentru volume', desc: 'De 2-4× mai ieftin decât Sonnet 5 / Opus 5.5' },
        { n: '3', tip: '--allowedTools restrictiv', desc: 'Reduce fișiere citite' },
        { n: '4', tip: 'Timeout pe CI job', desc: '2-3 min pentru detect runaway' },
      ],
      checklistTitle: 'Checklist siguritate:',
      checklist: [
        'API key din secrets, nu hardcodat',
        '--allowedTools explicit',
        '--max-turns setat',
        'Fișiere critice în blocklist',
        'Timeout pe CI job',
        'Logging tokeni pentru monitorizare cost',
      ],
    },
  },
  en: {
    pageLabel: 'Lesson 8',
    pageTitle: 'Automation with Claude Code',
    pageDesc: 'From CI/CD pipelines to shell scripts, event-driven hooks and security in automated environments.',
    tabs: {
      headless: 'Headless Mode',
      cicd: 'CI/CD',
      hooks: 'Hooks',
      scripturi: 'Scripts',
      securitate: 'Security',
    },
    headless: {
      label: 'Non-interactive',
      title: 'Headless Mode — Claude as subprocess',
      desc: 'The -p flag turns Claude Code into a scriptable subprocess: one prompt, one response. The foundation of any automation.',
      syntaxTitle: 'Basic syntax',
      outputTitle: 'Output formats',
      outputFormats: [
        { format: '--output-format text', title: 'Text (default)', desc: 'Human-readable. Markdown, code, explanations.' },
        { format: '--output-format json', title: 'JSON', desc: 'Structured with metadata: tokens, model, dates.' },
        { format: '--output-format stream-json', title: 'Stream JSON', desc: 'One event per line. Real-time progress tracking.' },
      ],
      flagsTitle: 'Essential flags',
      flags: [
        { flag: '--max-turns N', desc: 'Limit agentic iterations. Prevents runaway jobs.' },
        { flag: '--allowedTools X,Y,Z', desc: 'Only the specified tools. Safe in CI.' },
        { flag: '--output-format json', desc: 'Structured response for parsing.' },
        { flag: '--no-stream', desc: 'Full response all at once.' },
      ],
      exitCodesNote: '0 = success, 1 = error, 2 = max-turns exceeded. Usable in bash conditionals.',
    },
    cicd: {
      label: 'Continuous integration',
      title: 'Claude Code in CI/CD pipelines',
      desc: 'Automate code review, quality gates, documentation — on every commit.',
      items: [
        { n: '01', name: 'Automatic PR Review', desc: 'On every PR: diff analysis, CRITICAL/WARNING/SUGGESTION report', emoji: '🔍' },
        { n: '02', name: 'Quality Gate', desc: 'Merge blocked if critical vulnerabilities are found', emoji: '🛡️' },
        { n: '03', name: 'Automatic Changelog', desc: 'Generates CHANGELOG from commit history', emoji: '📝' },
        { n: '04', name: 'Daily security audit', desc: 'Periodic report detecting secrets and vulnerabilities', emoji: '⚠️' },
      ],
      apiKeyNote: 'Use GitHub Secrets or GitLab CI/CD Variables. Never hardcoded in workflow files.',
    },
    hooks: {
      label: 'Event-driven',
      title: 'Hooks — automation at key moments',
      desc: 'Hooks run shell commands on every tool call. No manual intervention.',
      hookTypes: [
        { name: 'PreToolUse', color: 'text-blue-400', desc: 'Before any tool call' },
        { name: 'PostToolUse', color: 'text-green-400', desc: 'After a tool call' },
        { name: 'Stop', color: 'text-amber-400', desc: 'When the session ends' },
        { name: 'SubagentStop', color: 'text-purple-400', desc: 'When a subagent finishes' },
      ],
      recipesTitle: 'Hook recipes',
      recipes: [
        { title: 'Auto-format on write', emoji: '✨', desc: 'Prettier runs automatically on every written file' },
        { title: 'Auto-test on write in src/', emoji: '✅', desc: 'Vitest runs and reports errors immediately' },
        { title: 'TypeScript check on every .ts', emoji: '🔍', desc: 'tsc verifies types after editing' },
        { title: 'Audit log on all operations', emoji: '📋', desc: 'Timestamp + session ID for every action' },
        { title: 'Block critical files', emoji: '🚫', desc: 'Prevents changes to .env, config, migrations' },
      ],
    },
    scripturi: {
      label: 'Shell automation',
      title: 'Shell scripts with Claude Code',
      desc: 'Claude as a building block in bash — batch processing, automatic generation, monitoring.',
      scripts: [
        { emoji: '🧪', title: 'Generate tests for new files', desc: 'Bash loop that calls claude for each new .ts file added' },
        { emoji: '🔐', title: 'Daily security audit', desc: 'Cron job that generates a vulnerability report' },
        { emoji: '🔄', title: 'Batch migration', desc: 'Applies the same transform across multiple files' },
        { emoji: '📝', title: 'Generate PR description', desc: 'From git log + diff stats, creates PR with gh cli' },
        { emoji: '📦', title: 'Dependency monitoring', desc: 'Daily check with npm audit, sends alerts' },
      ],
      tipNote: 'bash loops with claude -p calls. Ideal for batch processing: iterate over files/PRs and apply Claude to each.',
    },
    securitate: {
      label: 'Best practices',
      title: 'Security in automated environments',
      desc: 'Automation without controls = major risk. Defend yourself with least privilege.',
      leastPrivTitle: 'Least Privilege',
      leastPrivDesc: 'Claude should have access ONLY to what is needed. A review job does not need Write.',
      dangerLabel: 'Dangerous',
      safeLabel: 'Safe',
      apiKeyTitle: 'API Key Management',
      costTitle: 'Cost Control',
      costItems: [
        { n: '1', tip: '--max-turns N', desc: 'Limit agentic iterations' },
        { n: '2', tip: 'Haiku for volume', desc: '2-4× cheaper than Sonnet 5 / Opus 5.5' },
        { n: '3', tip: '--allowedTools restrictive', desc: 'Reduces files read' },
        { n: '4', tip: 'Timeout on CI job', desc: '2-3 min to detect runaway' },
      ],
      checklistTitle: 'Security checklist:',
      checklist: [
        'API key from secrets, not hardcoded',
        '--allowedTools explicit',
        '--max-turns set',
        'Critical files in blocklist',
        'Timeout on CI job',
        'Token logging for cost monitoring',
      ],
    },
  },
}

function SectionTitle({ label, title, desc }: { label: string; title: string; desc: string }) {
  return (
    <div className="mb-10 text-center">
      <span className="mb-3 inline-block text-xs font-semibold tracking-widest text-amber-400 uppercase">{label}</span>
      <h2 className="mb-3 text-2xl font-bold text-white sm:text-3xl">{title}</h2>
      <p className="mx-auto max-w-2xl text-sm leading-relaxed text-zinc-400">{desc}</p>
    </div>
  )
}

function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
      <Lightbulb className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-400" />
      <div className="text-sm leading-relaxed text-zinc-400">{children}</div>
    </div>
  )
}

function WarnBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
      <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-400" />
      <div className="text-sm leading-relaxed text-zinc-400">{children}</div>
    </div>
  )
}

function TabHeadless() {
  const { lang } = useApp()
  const c = CONTENT[lang].headless

  return (
    <div className="space-y-10">
      <SectionTitle label={c.label} title={c.title} desc={c.desc} />

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
          <Terminal className="h-5 w-5 text-amber-400" /> {c.syntaxTitle}
        </h3>
        <CodeBlock code={'# Interactive (default)\nclaude\n\n# Headless — single prompt\nclaude -p "What does this file do?"\n\n# With specific tools\nclaude -p "Analyze errors" \\\n  --allowedTools "Read,Bash"\n\n# With iteration limit\nclaude -p "Fix bugs" --max-turns 5'} />
      </div>

      <div>
        <h3 className="mb-5 text-lg font-semibold text-white">{c.outputTitle}</h3>
        <div className="grid gap-5 lg:grid-cols-3">
          {c.outputFormats.map((f) => (
            <div key={f.format} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
              <code className="mb-2 block text-xs font-bold text-amber-400">{f.format}</code>
              <h4 className="mb-2 text-base font-semibold text-white">{f.title}</h4>
              <p className="text-xs text-zinc-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="mb-5 text-lg font-semibold text-white">{c.flagsTitle}</h3>
        <div className="space-y-2">
          {c.flags.map((f) => (
            <div key={f.flag} className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-950/50 px-3 py-2">
              <code className="text-xs font-bold text-amber-400">{f.flag}</code>
              <span className="text-xs text-zinc-500">{f.desc}</span>
            </div>
          ))}
        </div>
      </div>

      <InfoBox>
        <strong className="text-white">Exit codes:</strong> {c.exitCodesNote}
      </InfoBox>
    </div>
  )
}

function TabCicd() {
  const { lang } = useApp()
  const c = CONTENT[lang].cicd

  return (
    <div className="space-y-10">
      <SectionTitle label={c.label} title={c.title} desc={c.desc} />

      <div className="space-y-6">
        {c.items.map((item) => (
          <div key={item.n} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="mb-3 flex items-center gap-3">
              <span className="text-2xl">{item.emoji}</span>
              <div>
                <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                <p className="text-xs text-zinc-500">{item.desc}</p>
              </div>
            </div>
            <p className="text-sm text-zinc-400">
              {lang === 'ro' ? 'Configurație în ' : 'Configuration in '}
              <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs text-amber-400">.github/workflows/</code>
              {lang === 'ro' ? ' (GitHub) sau ' : ' (GitHub) or '}
              <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs text-amber-400">.gitlab-ci.yml</code>
              {' (GitLab)'}
            </p>
          </div>
        ))}
      </div>

      <WarnBox>
        <strong className="text-white">API Key:</strong> {c.apiKeyNote}
      </WarnBox>
    </div>
  )
}

function TabHooks() {
  const { lang } = useApp()
  const c = CONTENT[lang].hooks

  return (
    <div className="space-y-10">
      <SectionTitle label={c.label} title={c.title} desc={c.desc} />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {c.hookTypes.map((h) => (
          <div key={h.name} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
            <code className={`mb-2 block text-sm font-bold ${h.color}`}>{h.name}</code>
            <p className="text-xs text-zinc-400">{h.desc}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">{c.recipesTitle}</h3>
        {c.recipes.map((r) => (
          <div key={r.title} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
            <h4 className="mb-1 flex items-center gap-2 text-base font-semibold text-white">
              <span>{r.emoji}</span> {r.title}
            </h4>
            <p className="text-sm text-zinc-400">{r.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function TabScripturi() {
  const { lang } = useApp()
  const c = CONTENT[lang].scripturi

  return (
    <div className="space-y-10">
      <SectionTitle label={c.label} title={c.title} desc={c.desc} />

      <div className="space-y-5">
        {c.scripts.map((s) => (
          <div key={s.title} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
            <h4 className="mb-2 flex items-center gap-2 text-base font-semibold text-white">
              <span className="text-2xl">{s.emoji}</span> {s.title}
            </h4>
            <p className="text-sm text-zinc-400">{s.desc}</p>
          </div>
        ))}
      </div>

      <InfoBox>
        <strong className="text-white">{lang === 'ro' ? 'Tipul de script:' : 'Script type:'}</strong> {c.tipNote}
      </InfoBox>
    </div>
  )
}

function TabSecuritate() {
  const { lang } = useApp()
  const c = CONTENT[lang].securitate

  return (
    <div className="space-y-10">
      <SectionTitle label={c.label} title={c.title} desc={c.desc} />

      <div className="space-y-6">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
            <ShieldCheck className="h-5 w-5 text-amber-400" /> {c.leastPrivTitle}
          </h3>
          <p className="mb-4 text-sm text-zinc-400">{c.leastPrivDesc}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-red-400/70">{c.dangerLabel}</span>
              <CodeBlock code='claude -p "Review PR"\n# Has access to EVERYTHING' />
            </div>
            <div>
              <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-green-400/70">{c.safeLabel}</span>
              <CodeBlock code='claude -p "Review PR" \\\n  --allowedTools "Read,Glob,Grep"' />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">{c.apiKeyTitle}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/5 p-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400" />
              <ul className="space-y-1 text-xs text-zinc-400">
                {lang === 'ro' ? (
                  <>
                    <li>❌ Hardcodat în scripts</li>
                    <li>❌ Commitat în git</li>
                    <li>❌ Un key pentru toate proiectele</li>
                  </>
                ) : (
                  <>
                    <li>❌ Hardcoded in scripts</li>
                    <li>❌ Committed to git</li>
                    <li>❌ One key for all projects</li>
                  </>
                )}
              </ul>
            </div>
            <div className="flex items-start gap-2 rounded-lg border border-green-500/20 bg-green-500/5 p-3">
              <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-400" />
              <ul className="space-y-1 text-xs text-zinc-400">
                {lang === 'ro' ? (
                  <>
                    <li>✓ GitHub Secrets / GitLab Variables</li>
                    <li>✓ AWS Secrets Manager</li>
                    <li>✓ Key per proiect, rotire 90 zile</li>
                  </>
                ) : (
                  <>
                    <li>✓ GitHub Secrets / GitLab Variables</li>
                    <li>✓ AWS Secrets Manager</li>
                    <li>✓ Key per project, rotate every 90 days</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">{c.costTitle}</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {c.costItems.map((s) => (
              <div key={s.n} className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-3">
                <p className="text-xs font-semibold text-white">{s.tip}</p>
                <p className="text-xs text-zinc-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <WarnBox>
        <strong className="text-white">{c.checklistTitle}</strong>
        <ul className="mt-2 space-y-1 text-sm">
          {c.checklist.map((item) => (
            <li key={item} className="flex items-center gap-2 text-zinc-400">
              <ChevronRight className="h-3 w-3 flex-shrink-0 text-amber-400" />
              {item}
            </li>
          ))}
        </ul>
      </WarnBox>
    </div>
  )
}

export default function AutomationGuide() {
  const [active, setActive] = useState<TabId>('headless')
  const { lang } = useApp()
  const c = CONTENT[lang]

  const TABS: Tab[] = [
    { id: 'headless', label: c.tabs.headless, icon: <Terminal className="h-4 w-4" /> },
    { id: 'cicd', label: c.tabs.cicd, icon: <GitBranch className="h-4 w-4" /> },
    { id: 'hooks', label: c.tabs.hooks, icon: <Webhook className="h-4 w-4" /> },
    { id: 'scripturi', label: c.tabs.scripturi, icon: <FileCode className="h-4 w-4" /> },
    { id: 'securitate', label: c.tabs.securitate, icon: <ShieldCheck className="h-4 w-4" /> },
  ]

  return (
    <section className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <span className="mb-4 inline-block text-sm font-semibold tracking-widest text-amber-400 uppercase">{c.pageLabel}</span>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">{c.pageTitle}</h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-zinc-400">
            {c.pageDesc}
          </p>
        </div>

        <div className="mb-8 overflow-x-auto">
          <div className="inline-flex min-w-full gap-1 rounded-xl border border-zinc-800 bg-zinc-900/50 p-1.5 sm:grid sm:grid-cols-5">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className={`flex items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                  active === tab.id
                    ? 'bg-amber-500 text-zinc-950 shadow-lg'
                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          {active === 'headless' && <TabHeadless />}
          {active === 'cicd' && <TabCicd />}
          {active === 'hooks' && <TabHooks />}
          {active === 'scripturi' && <TabScripturi />}
          {active === 'securitate' && <TabSecuritate />}
        </div>
      </div>
    </section>
  )
}
