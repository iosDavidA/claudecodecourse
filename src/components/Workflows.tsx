import { ArrowRight } from 'lucide-react'
import { useApp } from '../contexts/AppContext'

interface WorkflowCardProps {
  number: string
  title: string
  scenario: string
  steps: string[]
}

function WorkflowCard({ number, title, scenario, steps }: WorkflowCardProps) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all hover:border-amber-500/30 hover:bg-zinc-900">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 font-mono text-sm font-bold text-amber-400">
          {number}
        </span>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>

      <p className="mb-4 text-sm leading-relaxed text-zinc-400">{scenario}</p>

      <div className="space-y-2">
        {steps.map((step, i) => (
          <div key={i} className="flex items-start gap-2">
            <ArrowRight className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-amber-500/60" />
            <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-zinc-300">
              <code>{step}</code>
            </pre>
          </div>
        ))}
      </div>
    </div>
  )
}

const CONTENT = {
  ro: {
    badge: 'Practică',
    title: 'Workflow-uri reale',
    subtitle:
      'Scenarii complete de la cerință la implementare. Fiecare workflow arată succesiunea de prompturi și comenzi pentru un task real de dezvoltare.',
    workflows: [
      {
        number: '01',
        title: 'Bug fix end-to-end',
        scenario:
          'Un utilizator raportează că pagina de profil afișează date vechi după actualizare. Trebuie identificat și reparat bug-ul.',
        steps: [
          'claude',
          '> Utilizatorul vede date vechi pe /profile\n  după ce își actualizează numele.\n  Verifică dacă invalidăm cache-ul\n  după mutation-ul updateProfile.',
          '# Claude găsește problema: revalidatePath\n# lipsește din server action',
          '> Adaugă revalidatePath("/profile")\n  în updateProfile action și scrie\n  un test care verifică invalidarea.',
          '> /commit',
        ],
      },
      {
        number: '02',
        title: 'Feature nouă cu plan',
        scenario:
          'Trebuie adăugat un sistem de notificări in-app. Este un task complex care necesită planificare înainte de implementare.',
        steps: [
          'claude',
          '> /plan Adaugă sistem notificări:\n  - model Notification în Prisma\n  - API routes CRUD\n  - dropdown UI cu badge count\n  - mark as read automat la click',
          '# Revizuiezi planul, ajustezi...',
          '> Aprobat. Începe implementarea\n  pas cu pas.',
          '# Claude implementează fiecare pas,\n# creând fișiere și teste',
          '> /review',
          '> /commit',
        ],
      },
      {
        number: '03',
        title: 'Refactorizare cu worktree',
        scenario:
          'Vrei să migrezi de la REST la tRPC dar nu ești sigur dacă merită. Testezi într-un worktree izolat fără a afecta branch-ul curent.',
        steps: [
          'claude',
          '> ultrathink Analizează toate API\n  routes din app/api/ și propune\n  o migrare la tRPC. Lucrează\n  într-un worktree izolat.',
          '# Claude creează worktree temporar\n# și implementează migrarea complet',
          '# Primești branch-ul cu modificări:\n# agent/migrate-trpc-xyz',
          '> Compară diff-ul cu main și\n  listează toate breaking changes.',
          '# Decizi dacă mergi sau abandonezi',
        ],
      },
      {
        number: '04',
        title: 'Debugging cu context extern',
        scenario:
          'Un API extern returnează erori 429. Trebuie adăugat rate limiting și retry logic fără a schimba interfața existentă.',
        steps: [
          'claude',
          '> /effort high\n> API-ul Stripe returnează\n  429 Too Many Requests la volume\n  mari. Adaugă:\n  1. Rate limiter cu token bucket\n  2. Retry cu exponential backoff\n  3. Circuit breaker pt. eșecuri\n     consecutive\n  Nu modifica interfața publică\n  din lib/stripe.ts.',
          '# Claude implementează toate cele 3\n# în fișiere separate, apoi le\n# integrează în client-ul existent',
          '> Rulează npm test și arată-mi\n  rezultatele.',
          '> /commit',
        ],
      },
      {
        number: '05',
        title: 'Code review pe PR',
        scenario:
          'Un coleg a deschis un PR mare. Vrei să faci un review automat înainte de review-ul manual.',
        steps: [
          'claude',
          '> Fă review pe PR #142 din\n  GitHub. Caută:\n  - vulnerabilități de securitate\n  - probleme de performanță\n  - inconsistențe cu CLAUDE.md\n  - teste lipsă',
          '# Claude analizează diff-ul complet\n# și generează un raport structurat',
          '# Poți posta comentariile direct:\n> Postează review-ul ca comentariu\n  pe PR #142 cu severitate pt.\n  fiecare issue găsit.',
        ],
      },
      {
        number: '06',
        title: 'Sesiune headless / CI',
        scenario:
          'Rulezi Claude Code în CI/CD pentru a genera changelog sau a verifica codul automat la fiecare push.',
        steps: [
          '# În GitHub Actions workflow:',
          'claude -p "Analizează diff-ul\n  ultimului commit și generează\n  un changelog entry în format\n  Keep a Changelog." --output-format\n  stream-json',
          '# Flag -p = prompt non-interactiv\n# --output-format = parsează output',
          '# Alte use-cases CI:\nclaude -p "/review" --allowedTools\n  "Read,Grep,Glob"',
          '# Restricționezi tools-urile\n# disponibile pentru siguranță',
        ],
      },
    ],
  },
  en: {
    badge: 'Practice',
    title: 'Real-world workflows',
    subtitle:
      'Complete scenarios from requirement to implementation. Each workflow shows the sequence of prompts and commands for a real development task.',
    workflows: [
      {
        number: '01',
        title: 'End-to-end bug fix',
        scenario:
          'A user reports that the profile page shows stale data after an update. The bug needs to be identified and fixed.',
        steps: [
          'claude',
          '> User sees stale data on /profile\n  after updating their name.\n  Check if we invalidate the cache\n  after the updateProfile mutation.',
          '# Claude finds the issue: revalidatePath\n# is missing from the server action',
          '> Add revalidatePath("/profile")\n  to the updateProfile action and write\n  a test that verifies the invalidation.',
          '> /commit',
        ],
      },
      {
        number: '02',
        title: 'New feature with plan',
        scenario:
          'An in-app notification system needs to be added. It is a complex task that requires planning before implementation.',
        steps: [
          'claude',
          '> /plan Add notifications system:\n  - Notification model in Prisma\n  - CRUD API routes\n  - dropdown UI with badge count\n  - mark as read automatically on click',
          '# Review the plan, adjust...',
          '> Approved. Start implementation\n  step by step.',
          '# Claude implements each step,\n# creating files and tests',
          '> /review',
          '> /commit',
        ],
      },
      {
        number: '03',
        title: 'Refactoring with worktree',
        scenario:
          'You want to migrate from REST to tRPC but are not sure it is worth it. You test in an isolated worktree without affecting the current branch.',
        steps: [
          'claude',
          '> ultrathink Analyze all API\n  routes in app/api/ and propose\n  a migration to tRPC. Work\n  in an isolated worktree.',
          '# Claude creates a temporary worktree\n# and fully implements the migration',
          '# You receive the branch with changes:\n# agent/migrate-trpc-xyz',
          '> Compare the diff with main and\n  list all breaking changes.',
          '# Decide whether to proceed or abandon',
        ],
      },
      {
        number: '04',
        title: 'Debugging with external context',
        scenario:
          'An external API is returning 429 errors. Rate limiting and retry logic need to be added without changing the existing interface.',
        steps: [
          'claude',
          '> /effort high\n> The Stripe API returns\n  429 Too Many Requests at high\n  volumes. Add:\n  1. Rate limiter with token bucket\n  2. Retry with exponential backoff\n  3. Circuit breaker for consecutive\n     failures\n  Do not modify the public interface\n  in lib/stripe.ts.',
          '# Claude implements all 3\n# in separate files, then\n# integrates them into the existing client',
          '> Run npm test and show me\n  the results.',
          '> /commit',
        ],
      },
      {
        number: '05',
        title: 'Code review on a PR',
        scenario:
          'A colleague opened a large PR. You want to do an automatic review before the manual one.',
        steps: [
          'claude',
          '> Review PR #142 from\n  GitHub. Look for:\n  - security vulnerabilities\n  - performance issues\n  - inconsistencies with CLAUDE.md\n  - missing tests',
          '# Claude analyzes the full diff\n# and generates a structured report',
          '# You can post comments directly:\n> Post the review as a comment\n  on PR #142 with severity for\n  each issue found.',
        ],
      },
      {
        number: '06',
        title: 'Headless / CI session',
        scenario:
          'You run Claude Code in CI/CD to generate a changelog or automatically verify code on every push.',
        steps: [
          '# In GitHub Actions workflow:',
          'claude -p "Analyze the diff of\n  the last commit and generate\n  a changelog entry in\n  Keep a Changelog format." --output-format\n  stream-json',
          '# Flag -p = non-interactive prompt\n# --output-format = parse output',
          '# Other CI use-cases:\nclaude -p "/review" --allowedTools\n  "Read,Grep,Glob"',
          '# Restrict available tools\n# for safety',
        ],
      },
    ],
  },
}

export default function Workflows() {
  const { lang } = useApp()
  const c = CONTENT[lang]

  return (
    <section id="workflows" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <span className="mb-4 inline-block text-sm font-semibold tracking-widest text-amber-400 uppercase">
            {c.badge}
          </span>
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
            {c.title}
          </h2>
          <p className="mx-auto max-w-2xl text-zinc-400">
            {c.subtitle}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {c.workflows.map((wf) => (
            <WorkflowCard
              key={wf.number}
              number={wf.number}
              title={wf.title}
              scenario={wf.scenario}
              steps={wf.steps}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
