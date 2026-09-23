export type Lang = 'ro' | 'en'

interface TerminalLine {
  prompt: boolean
  text: string
  color?: string
}

export interface Translations {
  nav: {
    more: string
    home: string
    mobileMenu: string
  }
  footer: {
    builtWith: string
    copy: string
  }
  layout: {
    back: string
    next: string
  }
  pages: Record<string, string>
  home: {
    heroBadge: string
    heroVerb: string
    heroSubtitle: string
    heroCta: string
    heroCheatSheet: string
    heroPills: (count: number) => string[]
    stats: (count: number) => Array<{ value: string; label: string; sub: string }>
    whyTitle: string
    whySub: string
    whyCards: Array<{ title: string; desc: string }>
    courseTitle: string
    courseDesc: (count: number) => string
    courseStart: string
    ctaTitle: string
    ctaSubtitle: string
    ctaInstall: string
    ctaReasoning: string
    scenarios: TerminalLine[][]
    pageMeta: Record<string, { desc: string; badge: string }>
  }
}

const ro: Translations = {
  nav: {
    more: 'Mai mult',
    home: 'Acasă',
    mobileMenu: 'Meniu',
  },
  footer: {
    builtWith: 'Construit cu React, Tailwind CSS și Claude Code',
    copy: '2026 — Conținut educațional. Nu este un produs oficial Anthropic.',
  },
  layout: {
    back: 'Înapoi',
    next: 'Următor',
  },
  pages: {
    '/': 'Acasă',
    '/instalare': 'Instalare',
    '/rationament': 'Raționament',
    '/tools': 'Tools',
    '/comenzi': 'Comenzi',
    '/prompting': 'Prompting',
    '/modele': 'Modele',
    '/tokenuri': 'Tokenuri',
    '/automatizare': 'Automatizare',
    '/avansat': 'Avansat',
    '/skills': 'Skills',
    '/workflows': 'Workflows',
    '/proiect-complet': 'Proiect Complet',
    '/referinta': 'Cheat Sheet',
  },
  home: {
    heroBadge: 'Curs interactiv — ediția 2026',
    heroVerb: 'Stăpânește',
    heroSubtitle: 'Ghidul complet în română pentru Claude Code CLI — de la prima comandă la automatizări CI/CD, moduri de raționament avansat și arhitecturi agentic.',
    heroCta: 'Începe cursul',
    heroCheatSheet: 'Cheat Sheet →',
    heroPills: (count) => [`${count} lecții structurate`, 'Exemple de cod reale', 'Bilingv RO + EN', 'Fără placeholder-e'],
    stats: (count) => [
      { value: String(count), label: 'lecții', sub: 'de la zero la expert' },
      { value: '5',  label: 'moduri thinking', sub: 'think → ultrathink' },
      { value: '40+', label: 'exemple cod', sub: 'copy-pasteable' },
      { value: '4',  label: 'modele explicate', sub: 'Haiku / Sonnet / Opus / Fable 5' },
    ],
    whyTitle: 'De ce Claude Code?',
    whySub: 'Nu e un chatbot — e un agent cu acces direct la codul tău',
    whyCards: [
      { title: 'Agentic nativ',       desc: 'Citește, modifică și rulează fișiere autonom. Nu sugerează — execută direct.' },
      { title: 'Extended Thinking',   desc: 'think / megathink / ultrathink alocă buget de raționament intern pentru probleme complexe.' },
      { title: 'Context persistent',  desc: 'CLAUDE.md = system prompt permanent. Convențiile tale se aplică la fiecare sesiune.' },
      { title: 'Extensibil prin MCP', desc: 'Conectezi Claude la baze de date, browsere, API-uri externe prin MCP servers.' },
    ],
    courseTitle: 'Cuprins curs',
    courseDesc: (count) => `${count} lecții — parcurge în ordine sau sari direct la ce te interesează`,
    courseStart: 'Începe',
    ctaTitle: 'Gata să înceapă?',
    ctaSubtitle: 'Instalarea durează 2 minute. Primul task util în 10 minute. Fluență completă în câteva zile de practică.',
    ctaInstall: 'Instalare Claude Code',
    ctaReasoning: 'Raționament → think',
    scenarios: [
      [
        { prompt: true,  text: 'claude "Adaugă autentificare OAuth cu Google"' },
        { prompt: false, text: '● Analizez structura proiectului...', color: 'text-zinc-500' },
        { prompt: false, text: '● Identificat: Next.js 16, NextAuth v5, Prisma', color: 'text-zinc-500' },
        { prompt: false, text: '● Creez lib/auth.ts cu Google provider', color: 'text-amber-400/80' },
        { prompt: false, text: '● Actualizez middleware.ts cu rute protejate', color: 'text-amber-400/80' },
        { prompt: false, text: '✓ Gata — 3 fișiere create, 2 modificate', color: 'text-green-400' },
      ],
      [
        { prompt: true,  text: 'claude "megathink: de ce eșuează testele pe CI?"' },
        { prompt: false, text: '● Citesc jest.config.ts, GitHub Actions workflow...', color: 'text-zinc-500' },
        { prompt: false, text: '● Analizez diferențele env local vs CI...', color: 'text-zinc-500' },
        { prompt: false, text: '● Root cause: race condition în DB teardown', color: 'text-amber-400/80' },
        { prompt: false, text: '● Propun fix în tests/setup.ts linia 34', color: 'text-amber-400/80' },
        { prompt: false, text: '✓ Fix aplicat — testele vor trece pe CI', color: 'text-green-400' },
      ],
      [
        { prompt: true,  text: 'claude -p "Review securitate API routes" --output-format json' },
        { prompt: false, text: '● Scanez app/api/**/*.ts (14 fișiere)...', color: 'text-zinc-500' },
        { prompt: false, text: '● 🔴 CRITIC: SQL injection în /api/search', color: 'text-red-400' },
        { prompt: false, text: '● 🟡 WARNING: rate limit lipsă pe /api/auth', color: 'text-amber-400/80' },
        { prompt: false, text: '● 🟢 OK: CSRF tokens prezente pe toate formele', color: 'text-green-400/80' },
        { prompt: false, text: '✓ Raport JSON generat — 1 critic, 3 warnings', color: 'text-green-400' },
      ],
    ],
    pageMeta: {
      '/instalare':    { desc: 'Instalare CLI, API key, prima comandă, configurare globală', badge: 'Start' },
      '/rationament':  { desc: 'think / megathink / ultrathink — budget tokens și când să le folosești', badge: 'Core' },
      '/tools':        { desc: 'Read, Edit, Bash, Glob, Grep — cum Claude accesează fișierele tale', badge: 'Core' },
      '/comenzi':      { desc: 'Slash commands, scurtături tastatură, CLI flags esențiale', badge: 'Core' },
      '/prompting':    { desc: 'COCF framework, Plan Mode, CLAUDE.md, custom commands, anti-patterns', badge: 'Avansat' },
      '/modele':       { desc: 'Haiku, Sonnet, Opus & Fable 5 — prețuri reale, când escaladezi, configurare', badge: 'Avansat' },
      '/tokenuri':     { desc: 'Context window, prompt caching, strategii de economie a tokenilor', badge: 'Avansat' },
      '/automatizare': { desc: 'Headless mode, CI/CD pipelines, hooks, scripturi, securitate', badge: 'Pro' },
      '/avansat':      { desc: 'MCP servers, subagents, memory, funcționalități de nivel expert', badge: 'Pro' },
      '/skills':       { desc: 'Skills custom: SKILL.md, slash commands, subagent izolat, context dinamic', badge: 'Pro' },
      '/workflows':        { desc: 'Scenarii reale end-to-end: debug, feature, refactoring, review', badge: 'Pro' },
      '/proiect-complet': { desc: 'De la idee la producție: e-commerce full-stack cu model matrix complet', badge: 'Capstone' },
      '/referinta':        { desc: 'Cheat sheet complet — toate comenzile și pattern-urile la un loc', badge: 'Ref' },
    },
  },
}

const en: Translations = {
  nav: {
    more: 'More',
    home: 'Home',
    mobileMenu: 'Menu',
  },
  footer: {
    builtWith: 'Built with React, Tailwind CSS and Claude Code',
    copy: '2026 — Educational content. Not an official Anthropic product.',
  },
  layout: {
    back: 'Back',
    next: 'Next',
  },
  pages: {
    '/': 'Home',
    '/instalare': 'Installation',
    '/rationament': 'Reasoning',
    '/tools': 'Tools',
    '/comenzi': 'Commands',
    '/prompting': 'Prompting',
    '/modele': 'Models',
    '/tokenuri': 'Tokens',
    '/automatizare': 'Automation',
    '/avansat': 'Advanced',
    '/skills': 'Skills',
    '/workflows': 'Workflows',
    '/proiect-complet': 'Full Project',
    '/referinta': 'Cheat Sheet',
  },
  home: {
    heroBadge: 'Interactive course — 2026 edition',
    heroVerb: 'Master',
    heroSubtitle: 'The complete guide to Claude Code CLI — from your first command to CI/CD automation, advanced reasoning modes and agentic architectures.',
    heroCta: 'Start the course',
    heroCheatSheet: 'Cheat Sheet →',
    heroPills: (count) => [`${count} structured lessons`, 'Real code examples', 'Bilingual RO + EN', 'Free forever'],
    stats: (count) => [
      { value: String(count), label: 'lessons', sub: 'from zero to expert' },
      { value: '5',   label: 'thinking modes', sub: 'think → ultrathink' },
      { value: '40+', label: 'code examples', sub: 'copy-pasteable' },
      { value: '4',   label: 'models explained', sub: 'Haiku / Sonnet / Opus / Fable 5' },
    ],
    whyTitle: 'Why Claude Code?',
    whySub: 'Not a chatbot — an agent with direct access to your code',
    whyCards: [
      { title: 'Natively agentic',    desc: 'Reads, modifies and runs files autonomously. Doesn\'t suggest — executes directly.' },
      { title: 'Extended Thinking',   desc: 'think / megathink / ultrathink allocate internal reasoning budget for complex problems.' },
      { title: 'Persistent context',  desc: 'CLAUDE.md = permanent system prompt. Your conventions apply every session.' },
      { title: 'Extensible via MCP',  desc: 'Connect Claude to databases, browsers, external APIs via MCP servers.' },
    ],
    courseTitle: 'Course outline',
    courseDesc: (count) => `${count} lessons — go in order or jump directly to what interests you`,
    courseStart: 'Start',
    ctaTitle: 'Ready to begin?',
    ctaSubtitle: 'Installation takes 2 minutes. First useful task in 10 minutes. Full fluency in a few days of practice.',
    ctaInstall: 'Install Claude Code',
    ctaReasoning: 'Reasoning → think',
    scenarios: [
      [
        { prompt: true,  text: 'claude "Add OAuth authentication with Google"' },
        { prompt: false, text: '● Analyzing project structure...', color: 'text-zinc-500' },
        { prompt: false, text: '● Found: Next.js 16, NextAuth v5, Prisma', color: 'text-zinc-500' },
        { prompt: false, text: '● Creating lib/auth.ts with Google provider', color: 'text-amber-400/80' },
        { prompt: false, text: '● Updating middleware.ts with protected routes', color: 'text-amber-400/80' },
        { prompt: false, text: '✓ Done — 3 files created, 2 modified', color: 'text-green-400' },
      ],
      [
        { prompt: true,  text: 'claude "megathink: why are CI tests failing?"' },
        { prompt: false, text: '● Reading jest.config.ts, GitHub Actions workflow...', color: 'text-zinc-500' },
        { prompt: false, text: '● Analyzing local vs CI environment differences...', color: 'text-zinc-500' },
        { prompt: false, text: '● Root cause: race condition in DB teardown', color: 'text-amber-400/80' },
        { prompt: false, text: '● Proposing fix in tests/setup.ts line 34', color: 'text-amber-400/80' },
        { prompt: false, text: '✓ Fix applied — tests will pass on CI', color: 'text-green-400' },
      ],
      [
        { prompt: true,  text: 'claude -p "Security review API routes" --output-format json' },
        { prompt: false, text: '● Scanning app/api/**/*.ts (14 files)...', color: 'text-zinc-500' },
        { prompt: false, text: '● 🔴 CRITICAL: SQL injection in /api/search', color: 'text-red-400' },
        { prompt: false, text: '● 🟡 WARNING: rate limit missing on /api/auth', color: 'text-amber-400/80' },
        { prompt: false, text: '● 🟢 OK: CSRF tokens present on all forms', color: 'text-green-400/80' },
        { prompt: false, text: '✓ JSON report generated — 1 critical, 3 warnings', color: 'text-green-400' },
      ],
    ],
    pageMeta: {
      '/instalare':    { desc: 'CLI installation, API key, first command, global configuration', badge: 'Start' },
      '/rationament':  { desc: 'think / megathink / ultrathink — token budgets and when to use them', badge: 'Core' },
      '/tools':        { desc: 'Read, Edit, Bash, Glob, Grep — how Claude accesses your files', badge: 'Core' },
      '/comenzi':      { desc: 'Slash commands, keyboard shortcuts, essential CLI flags', badge: 'Core' },
      '/prompting':    { desc: 'COCF framework, Plan Mode, CLAUDE.md, custom commands, anti-patterns', badge: 'Advanced' },
      '/modele':       { desc: 'Haiku, Sonnet, Opus & Fable 5 — real prices, when to escalate, configuration', badge: 'Advanced' },
      '/tokenuri':     { desc: 'Context window, prompt caching, token cost strategies', badge: 'Advanced' },
      '/automatizare': { desc: 'Headless mode, CI/CD pipelines, hooks, scripts, security', badge: 'Pro' },
      '/avansat':      { desc: 'MCP servers, subagents, memory, expert-level features', badge: 'Pro' },
      '/skills':       { desc: 'Custom skills: SKILL.md, slash commands, isolated subagents, dynamic context', badge: 'Pro' },
      '/workflows':        { desc: 'Real end-to-end scenarios: debug, feature, refactoring, review', badge: 'Pro' },
      '/proiect-complet': { desc: 'Idea to production: full-stack e-commerce with complete model matrix', badge: 'Capstone' },
      '/referinta':        { desc: 'Complete cheat sheet — all commands and patterns in one place', badge: 'Ref' },
    },
  },
}

export const TRANSLATIONS: Record<Lang, Translations> = { ro, en }
