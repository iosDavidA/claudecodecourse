import { useState } from 'react'
import {
  FileText, FilePen, FileEdit, Terminal, Search, ScanSearch,
  Globe, Clipboard, Info, Shield, CheckCircle, AlertTriangle,
  Layers, FolderSearch, Zap, ChevronRight, Lock, Unlock,
} from 'lucide-react'
import { CodeBlock } from './CodeBlock'
import { useApp } from '../contexts/AppContext'

type TabId = 'overview' | 'fisiere' | 'cautare' | 'executie' | 'permisiuni'

interface Tab { id: TabId; label: string; icon: React.ReactNode }

// ── CONTENT ─────────────────────────────────────────────────────────────────

const CONTENT = {
  ro: {
    badge: 'Motorul intern',
    title: 'Sistemul de Tools',
    desc: 'Claude Code nu răspunde doar cu text — execută acțiuni reale prin „tools". Fiecare tool are un scop precis, permisiuni configurabile și un cost diferit de tokeni. Înțelegerea lor te ajută să scrii prompt-uri mai eficiente.',
    stats: [
      { value: '9',    label: 'tools disponibile',    sub: 'Read, Write, Edit, Bash…',       color: 'text-blue-400',  border: 'border-blue-500/20 bg-blue-500/5' },
      { value: '4',    label: 'categorii',             sub: 'fișiere, căutare, shell, web',    color: 'text-green-400', border: 'border-green-500/20 bg-green-500/5' },
      { value: 'auto', label: 'read-only aprobate',    sub: 'Read, Glob, Grep fără prompt',    color: 'text-amber-400', border: 'border-amber-500/20 bg-amber-500/5' },
      { value: 'json', label: 'configurare permisiuni',sub: '.claude/settings.json',           color: 'text-purple-400',border: 'border-purple-500/20 bg-purple-500/5' },
    ],
    tabLabels: {
      overview:    'Prezentare',
      fisiere:     'Fișiere',
      cautare:     'Căutare',
      executie:    'Shell & Web',
      permisiuni:  'Permisiuni',
    },
    overview: {
      title: 'Cum funcționează tool-urile',
      intro: 'Când scrii un prompt, Claude analizează cererea și decide ce tool(uri) să apeleze. Fiecare apel de tool apare ca o notificare în terminal — poți aproba, refuza sau configura permisiuni permanente.',
      howBox: 'Claude alege tool-urile automat, în ordine logică: mai întâi Read (înțelege contextul), apoi Grep/Glob (localizează), apoi Edit/Write (modifică), și Bash (verifică cu teste).',
      categories: [
        {
          name: 'Fișiere',
          color: 'text-blue-400',
          bg: 'bg-blue-500/10 border-blue-500/20',
          tools: ['Read', 'Write', 'Edit'],
          desc: 'Citire, creare și modificare de fișiere pe disc.',
        },
        {
          name: 'Căutare',
          color: 'text-green-400',
          bg: 'bg-green-500/10 border-green-500/20',
          tools: ['Glob', 'Grep'],
          desc: 'Localizarea fișierelor și a conținutului după pattern.',
        },
        {
          name: 'Shell',
          color: 'text-red-400',
          bg: 'bg-red-500/10 border-red-500/20',
          tools: ['Bash'],
          desc: 'Execuție comenzi, teste, build-uri, operații git.',
        },
        {
          name: 'Web & Planificare',
          color: 'text-purple-400',
          bg: 'bg-purple-500/10 border-purple-500/20',
          tools: ['WebFetch', 'WebSearch', 'TodoWrite'],
          desc: 'Acces la resurse externe și gestionarea task-urilor.',
        },
      ],
      allTools: [
        { name: 'Read',         cat: 'fișiere', catColor: 'bg-blue-500/10 text-blue-400',    desc: 'Citește conținutul unui fișier. Suportă text, imagini, PDF, Jupyter.' },
        { name: 'Write',        cat: 'fișiere', catColor: 'bg-blue-500/10 text-blue-400',    desc: 'Creează sau suprascrie complet un fișier. Trimite conținut integral.' },
        { name: 'Edit',         cat: 'fișiere', catColor: 'bg-blue-500/10 text-blue-400',    desc: 'Înlocuire exactă de string — trimite doar diff-ul, nu tot fișierul.' },
        { name: 'Bash',         cat: 'shell',   catColor: 'bg-red-500/10 text-red-400',      desc: 'Execută comenzi shell. Cel mai puternic tool — necesită permisiune.' },
        { name: 'Glob',         cat: 'căutare', catColor: 'bg-green-500/10 text-green-400',  desc: 'Găsește fișiere după pattern glob, sortate după data modificării.' },
        { name: 'Grep',         cat: 'căutare', catColor: 'bg-green-500/10 text-green-400',  desc: 'Caută conținut în fișiere cu regex (bazat pe ripgrep).' },
        { name: 'WebFetch',     cat: 'web',     catColor: 'bg-purple-500/10 text-purple-400',desc: 'Accesează o URL și returnează conținutul paginii.' },
        { name: 'WebSearch',    cat: 'web',     catColor: 'bg-purple-500/10 text-purple-400',desc: 'Caută pe web și returnează rezultate relevante.' },
        { name: 'TodoWrite',    cat: 'planif.', catColor: 'bg-amber-500/10 text-amber-400',  desc: 'Creează și gestionează task-uri pentru sesiunea curentă.' },
      ],
    },
    fisiere: {
      title: 'Tools pentru fișiere',
      intro: 'Read, Write și Edit formează trioul principal cu care Claude interacționează cu codul tău. Ordinea lor contează — Claude citește întotdeauna înainte să modifice.',
      workflowTitle: 'Workflow tipic',
      workflowSteps: [
        { step: '1', label: 'Read', desc: 'Înțelege structura existentă', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
        { step: '2', label: 'Analiză', desc: 'Identifică locul modificării', color: 'bg-zinc-700/50 text-zinc-400 border-zinc-600/30' },
        { step: '3', label: 'Edit / Write', desc: 'Aplică modificarea', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
        { step: '4', label: 'Bash', desc: 'Verifică cu teste/build', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
      ],
      tools: [
        {
          name: 'Read',
          icon: 'FileText',
          badge: 'read-only',
          badgeColor: 'bg-green-500/10 text-green-400',
          desc: 'Citește conținutul unui fișier de pe disc. Claude folosește Read pentru a analiza codul existent înainte de orice modificare. Suportă fișiere text, imagini (PNG/JPG), PDF-uri și notebook-uri Jupyter.',
          tip: 'Read este aprobat automat în modul default — nu necesită confirmare. Poți restricționa accesul în settings.json.',
          tipType: 'info' as const,
          code: `# Citire simplă
Read("src/lib/auth.ts")

# Restricționare acces (settings.json)
{
  "permissions": {
    "deny": ["Read(/etc/*)", "Read(~/.ssh/*)"]
  }
}`,
        },
        {
          name: 'Write',
          icon: 'FilePen',
          badge: 'suprascrie',
          badgeColor: 'bg-orange-500/10 text-orange-400',
          desc: 'Creează un fișier nou sau suprascrie complet unul existent. Write trimite conținutul integral — folosit pentru fișiere noi sau rescrierea completă. Nu face diff, nu merge — înlocuiește tot.',
          tip: 'Folosește Edit pentru modificări punctuale. Write e costisitor (trimite tot fișierul) și ireversibil dacă nu ai git.',
          tipType: 'warn' as const,
          code: `# Crează un fișier nou
Write("src/utils/format.ts", \`
export function formatPrice(n: number) {
  return n.toFixed(2) + ' RON'
}
\`)

# Write suprascrie fără confirmare suplimentară
# dacă permisiunea de Write e acordată`,
        },
        {
          name: 'Edit',
          icon: 'FileEdit',
          badge: 'eficient',
          badgeColor: 'bg-blue-500/10 text-blue-400',
          desc: 'Înlocuire exactă de string într-un fișier — trimite doar diff-ul, nu tot fișierul. Mult mai eficient decât Write pentru modificări mici. Necesită citire prealabilă cu Read.',
          tip: 'Strings-ul vechi trebuie să fie unic în fișier. Dacă există duplicate, Edit va eșua — adaugă mai mult context.',
          tipType: 'info' as const,
          code: `# Modificare exactă (old_string trebuie să fie unică)
Edit(
  file: "src/api/users.ts",
  old_string: "return null",
  new_string: "return { error: 'User not found' }"
)

# Pentru redenumire globală, folosești replace_all: true
Edit(
  file: "src/types.ts",
  old_string: "userId: number",
  new_string: "userId: string",
  replace_all: true
)`,
        },
      ],
      vsTitle: 'Edit vs Write — când să folosești fiecare',
      vsRows: [
        { criteria: 'Modificare punctuală',   edit: true,  write: false },
        { criteria: 'Fișier nou',              edit: false, write: true  },
        { criteria: 'Rescrierea completă',     edit: false, write: true  },
        { criteria: 'Eficiență tokeni',        edit: true,  write: false },
        { criteria: 'Redenumire variabile',    edit: true,  write: false },
        { criteria: 'Adăugare secțiune nouă',  edit: true,  write: false },
      ],
    },
    cautare: {
      title: 'Tools de căutare',
      intro: 'Glob și Grep sunt instrumentele de navigare în codebase. Glob găsește fișiere după structură, Grep găsește conținut după pattern. Combinate, permit lui Claude să localizeze rapid orice în proiect.',
      tools: [
        {
          name: 'Glob',
          desc: 'Găsește fișiere după pattern glob. Returnează path-urile sortate după data modificării. Rapid și eficient — nu citește conținutul, doar listează fișierele potrivite.',
          code: `# Fișiere TypeScript în src/
Glob("src/**/*.tsx")

# Toate fișierele de test
Glob("**/*.test.ts")

# Fișiere de configurare (multiple extensii)
Glob("**/config.{js,ts,json}")

# Migrări Prisma
Glob("prisma/migrations/**/*.sql")

# Fișiere dintr-un director specific
Glob("src/components/**/*.tsx")`,
          patterns: [
            { pattern: '**/*.tsx',       desc: 'Toate fișierele .tsx recursiv' },
            { pattern: 'src/**',         desc: 'Tot ce e în src/' },
            { pattern: '*.{ts,js}',      desc: 'TS sau JS în directorul curent' },
            { pattern: '**/index.ts',    desc: 'Fișiere index.ts din orice director' },
            { pattern: '!**/*.test.*',   desc: 'Exclude fișierele de test' },
          ],
        },
        {
          name: 'Grep',
          desc: 'Caută conținut în fișiere cu regex (bazat pe ripgrep). Returnează fișierele cu match sau conținutul liniilor. Mult mai rapid decât citirea manuală a fiecărui fișier.',
          code: `# Găsește toate folosirile unui hook
Grep("useState", type: "ts")

# Caută TODO/FIXME în tot src/
Grep("TODO|FIXME", glob: "src/**", output: "content")

# Găsește importuri Prisma
Grep("import.*prisma", output: "files_with_matches")

# Regex complet: funcții async
Grep("async function \\w+\\(", type: "ts")

# Caută cu context (3 linii înainte și după)
Grep("throw new Error", context: 3)`,
          modes: [
            { mode: 'files_with_matches', desc: 'Returnează doar path-urile fișierelor (default)' },
            { mode: 'content',            desc: 'Returnează liniile cu match' },
            { mode: 'count',              desc: 'Numărul de match-uri per fișier' },
          ],
        },
      ],
      comboTitle: 'Glob + Grep — combinația perfectă',
      comboDesc: 'Primul pas este Glob pentru a găsi fișierele relevante, al doilea Grep pentru a localiza exact linia. Claude face asta automat.',
      comboCode: `# Scenariu: găsește toate componentele care folosesc useAuth
# Pasul 1 — Claude găsește componentele React
Glob("src/components/**/*.tsx")
# → [Header.tsx, Sidebar.tsx, UserMenu.tsx, ...]

# Pasul 2 — filtrează cele care importă useAuth
Grep("useAuth", glob: "src/components/**/*.tsx")
# → src/components/Header.tsx
# → src/components/UserMenu.tsx

# Pasul 3 — citește doar fișierele relevante
Read("src/components/Header.tsx")`,
    },
    executie: {
      title: 'Shell, Web & Planificare',
      intro: 'Bash este cel mai puternic tool — poate rula orice comandă. WebFetch și WebSearch aduc informații externe. TodoWrite/Task organizează lucrul complex cu mai mulți pași.',
      bash: {
        name: 'Bash',
        badge: '⚠ permisiune necesară',
        badgeColor: 'bg-red-500/10 text-red-400',
        desc: 'Execută comenzi shell în terminalul curent. Poate rula teste, instala pachete, executa scripturi, face operații git. Cel mai puternic și cel mai riscant tool.',
        warnBox: 'Bash poate executa orice comandă pe sistemul tău. Configurează permisiuni granulare (Bash(npm *), Bash(git *)) — nu acorda permisiune globală fără să înțelegi riscurile.',
        code: `# Operații comune aprobate de Claude
Bash("npm run test -- --watch=false")
Bash("npm run build")
Bash("git diff --staged")
Bash("git log --oneline -10")
Bash("npx prisma migrate dev --name add_users")

# Verificare înainte de a scrie cod
Bash("cat package.json | grep -i vite")
Bash("ls -la src/components/")`,
        useCases: [
          { label: 'Rulare teste',      cmd: 'npm run test',      color: 'text-green-400' },
          { label: 'Build verificare',  cmd: 'npm run build',     color: 'text-blue-400' },
          { label: 'Git operations',    cmd: 'git diff / log',    color: 'text-amber-400' },
          { label: 'Package install',   cmd: 'npm install pkg',   color: 'text-purple-400' },
          { label: 'DB migrations',     cmd: 'prisma migrate dev',color: 'text-red-400' },
        ],
      },
      web: {
        fetchName: 'WebFetch',
        searchName: 'WebSearch',
        fetchDesc: 'Accesează o URL și returnează conținutul paginii (text/HTML). Util pentru citirea documentației, verificarea unui API endpoint, sau accesul la fișiere raw externe.',
        searchDesc: 'Efectuează o căutare web și returnează rezultatele relevante. Claude folosește WebSearch automat când trebuie să găsească soluții la erori sau informații actualizate.',
        fetchCode: `# Citire documentație pachet
WebFetch("https://docs.prisma.io/orm/reference/...")

# Fișier raw de pe GitHub
WebFetch("https://raw.githubusercontent.com/org/repo/main/config.json")

# Verificare API endpoint
WebFetch("https://api.example.com/health")`,
        searchCode: `# Claude caută automat când detectează o eroare necunoscută:
> De ce primesc "Cannot find module @prisma/client"?

● WebSearch("prisma client not found after generate solution")
● Am găsit — trebuie să rulezi npx prisma generate după instalare.

# Sau explicit:
> Caută cea mai recentă versiune stabilă de Vite`,
      },
      todo: {
        name: 'TodoWrite / Task',
        desc: 'Permite lui Claude să urmărească progresul unui task complex cu mai mulți pași. Apare ca listă vizuală în terminal și îl ajută să nu piardă contextul în sesiunile lungi.',
        infoBox: 'Claude creează task-uri automat pentru implementări mari. Nu trebuie să ceri explicit — dacă taskul are 3+ pași, Claude planifică singur.',
        code: `# Claude planifică automat pentru task-uri complexe:
> Adaugă autentificare cu JWT la API-ul meu

● TaskCreate: Analizează structura actuală a API-ului    [pending]
● TaskCreate: Instalează jsonwebtoken + bcrypt           [pending]
● TaskCreate: Creează middleware de autentificare        [pending]
● TaskCreate: Protejează endpoint-urile existente        [pending]
● TaskCreate: Scrie teste pentru auth flow               [pending]

→ TaskUpdate: "Analizează structura" → in_progress
→ Read("src/api/")... Read("package.json")...
→ TaskUpdate: "Analizează structura" → completed ✓
→ TaskUpdate: "Instalează jsonwebtoken" → in_progress`,
      },
    },
    permisiuni: {
      title: 'Sistemul de permisiuni',
      intro: 'Fiecare tool poate fi aprobat permanent, refuzat sau restricționat prin pattern-uri în `.claude/settings.json`. Permisiunile granulare te lasă să acorzi acces Bash pentru npm, dar nu pentru rm sau curl.',
      levels: [
        { level: 'Auto-aprobate',   desc: 'Nu necesită confirmare — Read, Glob, Grep, WebFetch, WebSearch', color: 'text-green-400', bg: 'bg-green-500/5 border-green-500/20' },
        { level: 'Prompt per apel', desc: 'Necesită aprobare manuală la fiecare apel — Bash, Write, Edit (default)', color: 'text-amber-400', bg: 'bg-amber-500/5 border-amber-500/20' },
        { level: 'Allow permanent', desc: 'Odată aprobat în settings.json, nu mai apare prompt-ul', color: 'text-blue-400', bg: 'bg-blue-500/5 border-blue-500/20' },
        { level: 'Deny (blocat)',   desc: 'Tool-ul este refuzat complet — nu poate fi apelat', color: 'text-red-400', bg: 'bg-red-500/5 border-red-500/20' },
      ],
      configTitle: 'Configurare settings.json',
      configCode: `// .claude/settings.json
{
  "permissions": {
    "allow": [
      "Bash(npm run *)",
      "Bash(npm install *)",
      "Bash(git status)",
      "Bash(git diff *)",
      "Bash(git log *)",
      "Bash(git add *)",
      "Bash(git commit *)",
      "Bash(npx prisma *)"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Bash(curl *)",
      "Bash(wget *)",
      "Read(/etc/*)",
      "Read(~/.ssh/*)",
      "Read(~/.aws/*)"
    ]
  }
}`,
      patternsTitle: 'Pattern-uri de permisiuni comune',
      patterns: [
        { pattern: 'Bash(npm *)',      effect: 'Allow',  desc: 'Toate comenzile npm (install, run, build)' },
        { pattern: 'Bash(git *)',      effect: 'Allow',  desc: 'Toate comenzile git (log, diff, add, commit)' },
        { pattern: 'Bash(npx *)',      effect: 'Allow',  desc: 'Executare binare cu npx' },
        { pattern: 'Bash(rm -rf *)',   effect: 'Deny',   desc: 'Blochează ștergerea recursivă — risc maxim' },
        { pattern: 'Read(~/.ssh/*)',   effect: 'Deny',   desc: 'Protejează cheile SSH de la citire' },
        { pattern: 'Bash(curl *)',     effect: 'Deny',   desc: 'Blochează request-uri HTTP neautorizate' },
      ],
      modesTitle: 'Moduri de rulare',
      modes: [
        { name: '--dangerously-skip-permissions', desc: 'Aprobă automat orice tool fără prompt. Folosit în CI/CD. Niciodată în sesiuni interactive cu cod sensibil.', color: 'text-red-400' },
        { name: 'Default (interactiv)',           desc: 'Claude cere confirmare pentru tool-uri cu impact. Recomandat pentru dezvoltare normală.', color: 'text-green-400' },
        { name: 'settings.json allowlist',        desc: 'Cel mai bun echilibru — aprobă automat tool-urile comune de lucru, blochează operațiile periculoase.', color: 'text-blue-400' },
      ],
    },
  },
  en: {
    badge: 'Internal engine',
    title: 'The Tools System',
    desc: 'Claude Code doesn\'t just respond with text — it executes real actions through "tools". Each tool has a precise purpose, configurable permissions, and a different token cost. Understanding them helps you write more effective prompts.',
    stats: [
      { value: '9',    label: 'available tools',      sub: 'Read, Write, Edit, Bash…',        color: 'text-blue-400',  border: 'border-blue-500/20 bg-blue-500/5' },
      { value: '4',    label: 'categories',            sub: 'files, search, shell, web',        color: 'text-green-400', border: 'border-green-500/20 bg-green-500/5' },
      { value: 'auto', label: 'read-only approved',    sub: 'Read, Glob, Grep without prompt',  color: 'text-amber-400', border: 'border-amber-500/20 bg-amber-500/5' },
      { value: 'json', label: 'permission config',     sub: '.claude/settings.json',             color: 'text-purple-400',border: 'border-purple-500/20 bg-purple-500/5' },
    ],
    tabLabels: {
      overview:    'Overview',
      fisiere:     'Files',
      cautare:     'Search',
      executie:    'Shell & Web',
      permisiuni:  'Permissions',
    },
    overview: {
      title: 'How tools work',
      intro: 'When you write a prompt, Claude analyzes the request and decides which tool(s) to call. Each tool call appears as a notification in the terminal — you can approve, deny, or configure permanent permissions.',
      howBox: 'Claude selects tools automatically, in logical order: first Read (understand context), then Grep/Glob (locate), then Edit/Write (modify), and Bash (verify with tests).',
      categories: [
        {
          name: 'Files',
          color: 'text-blue-400',
          bg: 'bg-blue-500/10 border-blue-500/20',
          tools: ['Read', 'Write', 'Edit'],
          desc: 'Reading, creating and modifying files on disk.',
        },
        {
          name: 'Search',
          color: 'text-green-400',
          bg: 'bg-green-500/10 border-green-500/20',
          tools: ['Glob', 'Grep'],
          desc: 'Locating files and content by pattern.',
        },
        {
          name: 'Shell',
          color: 'text-red-400',
          bg: 'bg-red-500/10 border-red-500/20',
          tools: ['Bash'],
          desc: 'Executing commands, tests, builds, git operations.',
        },
        {
          name: 'Web & Planning',
          color: 'text-purple-400',
          bg: 'bg-purple-500/10 border-purple-500/20',
          tools: ['WebFetch', 'WebSearch', 'TodoWrite'],
          desc: 'Access to external resources and task management.',
        },
      ],
      allTools: [
        { name: 'Read',         cat: 'files',    catColor: 'bg-blue-500/10 text-blue-400',    desc: 'Reads a file\'s contents. Supports text, images, PDF, Jupyter.' },
        { name: 'Write',        cat: 'files',    catColor: 'bg-blue-500/10 text-blue-400',    desc: 'Creates or completely overwrites a file. Sends full content.' },
        { name: 'Edit',         cat: 'files',    catColor: 'bg-blue-500/10 text-blue-400',    desc: 'Exact string replacement — sends only the diff, not the whole file.' },
        { name: 'Bash',         cat: 'shell',    catColor: 'bg-red-500/10 text-red-400',      desc: 'Executes shell commands. The most powerful tool — requires permission.' },
        { name: 'Glob',         cat: 'search',   catColor: 'bg-green-500/10 text-green-400',  desc: 'Finds files by glob pattern, sorted by modification date.' },
        { name: 'Grep',         cat: 'search',   catColor: 'bg-green-500/10 text-green-400',  desc: 'Searches file contents with regex (based on ripgrep).' },
        { name: 'WebFetch',     cat: 'web',      catColor: 'bg-purple-500/10 text-purple-400',desc: 'Accesses a URL and returns the page content.' },
        { name: 'WebSearch',    cat: 'web',      catColor: 'bg-purple-500/10 text-purple-400',desc: 'Performs a web search and returns relevant results.' },
        { name: 'TodoWrite',    cat: 'planning', catColor: 'bg-amber-500/10 text-amber-400',  desc: 'Creates and manages task lists for the current session.' },
      ],
    },
    fisiere: {
      title: 'File tools',
      intro: 'Read, Write and Edit form the main trio Claude uses to interact with your code. Their order matters — Claude always reads before modifying.',
      workflowTitle: 'Typical workflow',
      workflowSteps: [
        { step: '1', label: 'Read', desc: 'Understand existing structure', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
        { step: '2', label: 'Analysis', desc: 'Identify the change location', color: 'bg-zinc-700/50 text-zinc-400 border-zinc-600/30' },
        { step: '3', label: 'Edit / Write', desc: 'Apply the change', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
        { step: '4', label: 'Bash', desc: 'Verify with tests/build', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
      ],
      tools: [
        {
          name: 'Read',
          icon: 'FileText',
          badge: 'read-only',
          badgeColor: 'bg-green-500/10 text-green-400',
          desc: 'Reads the contents of a file from disk. Claude uses Read to analyze existing code before any changes. Supports text files, images (PNG/JPG), PDFs, and Jupyter notebooks.',
          tip: 'Read is auto-approved in default mode — no confirmation needed. You can restrict access in settings.json.',
          tipType: 'info' as const,
          code: `# Simple read
Read("src/lib/auth.ts")

# Restrict access (settings.json)
{
  "permissions": {
    "deny": ["Read(/etc/*)", "Read(~/.ssh/*)"]
  }
}`,
        },
        {
          name: 'Write',
          icon: 'FilePen',
          badge: 'overwrites',
          badgeColor: 'bg-orange-500/10 text-orange-400',
          desc: 'Creates a new file or completely overwrites an existing one. Write sends the full content — used for new files or complete rewrites. No diff, no merge — replaces everything.',
          tip: 'Use Edit for targeted changes. Write is expensive (sends the entire file) and irreversible without git.',
          tipType: 'warn' as const,
          code: `# Create a completely new file
Write("src/utils/format.ts", \`
export function formatPrice(n: number) {
  return n.toFixed(2) + ' RON'
}
\`)

# Write overwrites without additional confirmation
# once the Write permission is granted`,
        },
        {
          name: 'Edit',
          icon: 'FileEdit',
          badge: 'efficient',
          badgeColor: 'bg-blue-500/10 text-blue-400',
          desc: 'Exact string replacement in a file — sends only the diff, not the entire file. Much more efficient than Write for small changes. Requires prior reading with Read.',
          tip: 'The old string must be unique in the file. If duplicates exist, Edit will fail — add more surrounding context.',
          tipType: 'info' as const,
          code: `# Exact replacement (old_string must be unique)
Edit(
  file: "src/api/users.ts",
  old_string: "return null",
  new_string: "return { error: 'User not found' }"
)

# Global rename with replace_all: true
Edit(
  file: "src/types.ts",
  old_string: "userId: number",
  new_string: "userId: string",
  replace_all: true
)`,
        },
      ],
      vsTitle: 'Edit vs Write — when to use each',
      vsRows: [
        { criteria: 'Targeted change',         edit: true,  write: false },
        { criteria: 'New file',                edit: false, write: true  },
        { criteria: 'Complete rewrite',        edit: false, write: true  },
        { criteria: 'Token efficiency',        edit: true,  write: false },
        { criteria: 'Variable renaming',       edit: true,  write: false },
        { criteria: 'Adding a new section',    edit: true,  write: false },
      ],
    },
    cautare: {
      title: 'Search tools',
      intro: 'Glob and Grep are the codebase navigation tools. Glob finds files by structure, Grep finds content by pattern. Combined, they allow Claude to quickly locate anything in your project.',
      tools: [
        {
          name: 'Glob',
          desc: 'Finds files by glob pattern. Returns paths sorted by modification date. Fast and efficient — does not read content, only lists matching files.',
          code: `# TypeScript files in src/
Glob("src/**/*.tsx")

# All test files
Glob("**/*.test.ts")

# Config files (multiple extensions)
Glob("**/config.{js,ts,json}")

# Prisma migrations
Glob("prisma/migrations/**/*.sql")

# Files in a specific directory
Glob("src/components/**/*.tsx")`,
          patterns: [
            { pattern: '**/*.tsx',       desc: 'All .tsx files recursively' },
            { pattern: 'src/**',         desc: 'Everything inside src/' },
            { pattern: '*.{ts,js}',      desc: 'TS or JS in current directory' },
            { pattern: '**/index.ts',    desc: 'index.ts files in any directory' },
            { pattern: '!**/*.test.*',   desc: 'Exclude test files' },
          ],
        },
        {
          name: 'Grep',
          desc: 'Searches file contents with regex (based on ripgrep). Returns files with matches or line content. Much faster than manually reading each file.',
          code: `# Find all usages of a hook
Grep("useState", type: "ts")

# Search TODO/FIXME in all src/
Grep("TODO|FIXME", glob: "src/**", output: "content")

# Find Prisma imports
Grep("import.*prisma", output: "files_with_matches")

# Full regex: async functions
Grep("async function \\w+\\(", type: "ts")

# Search with context (3 lines before and after)
Grep("throw new Error", context: 3)`,
          modes: [
            { mode: 'files_with_matches', desc: 'Returns only file paths (default)' },
            { mode: 'content',            desc: 'Returns matching lines' },
            { mode: 'count',              desc: 'Number of matches per file' },
          ],
        },
      ],
      comboTitle: 'Glob + Grep — the perfect combination',
      comboDesc: 'First Glob finds the relevant files, then Grep locates the exact line. Claude does this automatically.',
      comboCode: `# Scenario: find all components using useAuth
# Step 1 — Claude finds React components
Glob("src/components/**/*.tsx")
# → [Header.tsx, Sidebar.tsx, UserMenu.tsx, ...]

# Step 2 — filter those that import useAuth
Grep("useAuth", glob: "src/components/**/*.tsx")
# → src/components/Header.tsx
# → src/components/UserMenu.tsx

# Step 3 — read only the relevant files
Read("src/components/Header.tsx")`,
    },
    executie: {
      title: 'Shell, Web & Planning',
      intro: 'Bash is the most powerful tool — it can run any command. WebFetch and WebSearch bring in external information. TodoWrite/Task organizes complex multi-step work.',
      bash: {
        name: 'Bash',
        badge: '⚠ permission required',
        badgeColor: 'bg-red-500/10 text-red-400',
        desc: 'Executes shell commands in the current terminal. Can run tests, install packages, execute scripts, and perform git operations. The most powerful and most risky tool.',
        warnBox: 'Bash can execute any command on your system. Configure granular permissions (Bash(npm *), Bash(git *)) — do not grant global permission without understanding the risks.',
        code: `# Common operations approved by Claude
Bash("npm run test -- --watch=false")
Bash("npm run build")
Bash("git diff --staged")
Bash("git log --oneline -10")
Bash("npx prisma migrate dev --name add_users")

# Verification before writing code
Bash("cat package.json | grep -i vite")
Bash("ls -la src/components/")`,
        useCases: [
          { label: 'Run tests',        cmd: 'npm run test',      color: 'text-green-400' },
          { label: 'Build verify',     cmd: 'npm run build',     color: 'text-blue-400' },
          { label: 'Git operations',   cmd: 'git diff / log',    color: 'text-amber-400' },
          { label: 'Package install',  cmd: 'npm install pkg',   color: 'text-purple-400' },
          { label: 'DB migrations',    cmd: 'prisma migrate dev', color: 'text-red-400' },
        ],
      },
      web: {
        fetchName: 'WebFetch',
        searchName: 'WebSearch',
        fetchDesc: 'Accesses a URL and returns the page content (text/HTML). Useful for reading documentation, checking an API endpoint, or accessing raw external files.',
        searchDesc: 'Performs a web search and returns relevant results. Claude uses WebSearch automatically when it needs to find solutions to errors or up-to-date information.',
        fetchCode: `# Read package documentation
WebFetch("https://docs.prisma.io/orm/reference/...")

# Raw file from GitHub
WebFetch("https://raw.githubusercontent.com/org/repo/main/config.json")

# Check API endpoint
WebFetch("https://api.example.com/health")`,
        searchCode: `# Claude searches automatically when it detects an unknown error:
> Why am I getting "Cannot find module @prisma/client"?

● WebSearch("prisma client not found after generate solution")
● Found it — you need to run npx prisma generate after install.

# Or explicitly:
> Find the latest stable version of Vite`,
      },
      todo: {
        name: 'TodoWrite / Task',
        desc: 'Allows Claude to track progress on a complex multi-step task. Appears as a visual list in the terminal and helps it maintain context in long sessions.',
        infoBox: 'Claude creates tasks automatically for large implementations. No need to ask explicitly — if a task has 3+ steps, Claude plans automatically.',
        code: `# Claude plans automatically for complex tasks:
> Add JWT authentication to my API

● TaskCreate: Analyze current API structure          [pending]
● TaskCreate: Install jsonwebtoken + bcrypt          [pending]
● TaskCreate: Create authentication middleware       [pending]
● TaskCreate: Protect existing endpoints             [pending]
● TaskCreate: Write tests for auth flow              [pending]

→ TaskUpdate: "Analyze API structure" → in_progress
→ Read("src/api/")... Read("package.json")...
→ TaskUpdate: "Analyze API structure" → completed ✓
→ TaskUpdate: "Install jsonwebtoken" → in_progress`,
      },
    },
    permisiuni: {
      title: 'The permissions system',
      intro: 'Each tool can be permanently approved, denied, or restricted using patterns in `.claude/settings.json`. Granular permissions let you allow Bash for npm but not for rm or curl.',
      levels: [
        { level: 'Auto-approved',     desc: 'No confirmation needed — Read, Glob, Grep, WebFetch, WebSearch', color: 'text-green-400', bg: 'bg-green-500/5 border-green-500/20' },
        { level: 'Prompt per call',   desc: 'Requires manual approval on each call — Bash, Write, Edit (default)', color: 'text-amber-400', bg: 'bg-amber-500/5 border-amber-500/20' },
        { level: 'Allow permanent',   desc: 'Once approved in settings.json, the prompt no longer appears', color: 'text-blue-400', bg: 'bg-blue-500/5 border-blue-500/20' },
        { level: 'Deny (blocked)',    desc: 'The tool is completely refused — cannot be called', color: 'text-red-400', bg: 'bg-red-500/5 border-red-500/20' },
      ],
      configTitle: 'Configuring settings.json',
      configCode: `// .claude/settings.json
{
  "permissions": {
    "allow": [
      "Bash(npm run *)",
      "Bash(npm install *)",
      "Bash(git status)",
      "Bash(git diff *)",
      "Bash(git log *)",
      "Bash(git add *)",
      "Bash(git commit *)",
      "Bash(npx prisma *)"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Bash(curl *)",
      "Bash(wget *)",
      "Read(/etc/*)",
      "Read(~/.ssh/*)",
      "Read(~/.aws/*)"
    ]
  }
}`,
      patternsTitle: 'Common permission patterns',
      patterns: [
        { pattern: 'Bash(npm *)',      effect: 'Allow',  desc: 'All npm commands (install, run, build)' },
        { pattern: 'Bash(git *)',      effect: 'Allow',  desc: 'All git commands (log, diff, add, commit)' },
        { pattern: 'Bash(npx *)',      effect: 'Allow',  desc: 'Execute binaries with npx' },
        { pattern: 'Bash(rm -rf *)',   effect: 'Deny',   desc: 'Block recursive deletion — maximum risk' },
        { pattern: 'Read(~/.ssh/*)',   effect: 'Deny',   desc: 'Protect SSH keys from being read' },
        { pattern: 'Bash(curl *)',     effect: 'Deny',   desc: 'Block unauthorized HTTP requests' },
      ],
      modesTitle: 'Run modes',
      modes: [
        { name: '--dangerously-skip-permissions', desc: 'Auto-approves any tool without prompt. Used in CI/CD. Never in interactive sessions with sensitive code.', color: 'text-red-400' },
        { name: 'Default (interactive)',          desc: 'Claude asks for confirmation for impactful tools. Recommended for normal development.', color: 'text-green-400' },
        { name: 'settings.json allowlist',        desc: 'Best balance — auto-approves common work tools, blocks dangerous operations.', color: 'text-blue-400' },
      ],
    },
  },
}

// ── TABS ────────────────────────────────────────────────────────────────────

const TABS_RO: Tab[] = [
  { id: 'overview',   label: 'Prezentare', icon: <Layers className="h-4 w-4" /> },
  { id: 'fisiere',    label: 'Fișiere',    icon: <FileText className="h-4 w-4" /> },
  { id: 'cautare',    label: 'Căutare',    icon: <FolderSearch className="h-4 w-4" /> },
  { id: 'executie',   label: 'Shell & Web',icon: <Terminal className="h-4 w-4" /> },
  { id: 'permisiuni', label: 'Permisiuni', icon: <Shield className="h-4 w-4" /> },
]

const TABS_EN: Tab[] = [
  { id: 'overview',   label: 'Overview',    icon: <Layers className="h-4 w-4" /> },
  { id: 'fisiere',    label: 'Files',        icon: <FileText className="h-4 w-4" /> },
  { id: 'cautare',    label: 'Search',       icon: <FolderSearch className="h-4 w-4" /> },
  { id: 'executie',   label: 'Shell & Web',  icon: <Terminal className="h-4 w-4" /> },
  { id: 'permisiuni', label: 'Permissions',  icon: <Shield className="h-4 w-4" /> },
]

// ── SMALL HELPERS ────────────────────────────────────────────────────────────

function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
      <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-400" />
      <p className="text-sm leading-relaxed text-zinc-300">{children}</p>
    </div>
  )
}

function WarnBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
      <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-400" />
      <p className="text-sm leading-relaxed text-zinc-300">{children}</p>
    </div>
  )
}

// ── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function ToolsSystem() {
  const { lang } = useApp()
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const c = CONTENT[lang]
  const tabs = lang === 'ro' ? TABS_RO : TABS_EN

  return (
    <section className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-10 text-center">
          <span className="mb-3 inline-block rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-blue-400">
            {c.badge}
          </span>
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">{c.title}</h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-zinc-400">{c.desc}</p>
        </div>

        {/* Stats strip */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {c.stats.map((s) => (
            <div key={s.label} className={`rounded-xl border p-4 ${s.border}`}>
              <div className={`text-2xl font-bold tabular-nums ${s.color}`}>{s.value}</div>
              <div className="mt-0.5 text-xs font-medium text-white">{s.label}</div>
              <div className="mt-0.5 text-[11px] text-zinc-500">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Sticky tabs */}
        <div className="sticky top-16 z-10 mb-6 overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/90 backdrop-blur" style={{ scrollbarWidth: 'none' }}>
          <div className="flex min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 whitespace-nowrap px-5 py-3.5 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-400 text-blue-400'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-6 sm:p-8">

          {/* ── OVERVIEW ── */}
          {activeTab === 'overview' && (() => {
            const t = c.overview
            return (
              <div className="space-y-8">
                <div>
                  <h2 className="mb-2 text-xl font-semibold text-white">{t.title}</h2>
                  <p className="text-sm leading-relaxed text-zinc-400">{t.intro}</p>
                </div>
                <InfoBox>{t.howBox}</InfoBox>

                {/* Category grid */}
                <div className="grid gap-3 sm:grid-cols-2">
                  {t.categories.map((cat) => (
                    <div key={cat.name} className={`rounded-xl border p-4 ${cat.bg}`}>
                      <div className={`mb-1 text-sm font-semibold ${cat.color}`}>{cat.name}</div>
                      <div className="mb-2 flex flex-wrap gap-1.5">
                        {cat.tools.map((tool) => (
                          <span key={tool} className="rounded-md bg-zinc-900/60 px-2 py-0.5 text-xs font-mono text-zinc-300">{tool}</span>
                        ))}
                      </div>
                      <p className="text-xs text-zinc-400">{cat.desc}</p>
                    </div>
                  ))}
                </div>

                {/* All tools table */}
                <div>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500">
                    {lang === 'ro' ? 'Toate tool-urile' : 'All tools'}
                  </h3>
                  <div className="divide-y divide-zinc-800 rounded-xl border border-zinc-800 overflow-hidden">
                    {t.allTools.map((tool) => (
                      <div key={tool.name} className="flex items-start gap-3 px-4 py-3 hover:bg-zinc-900/40 transition-colors">
                        <code className="mt-0.5 min-w-[90px] text-sm font-semibold text-white">{tool.name}</code>
                        <span className={`mt-0.5 min-w-[72px] rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${tool.catColor}`}>{tool.cat}</span>
                        <p className="text-sm text-zinc-400">{tool.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })()}

          {/* ── FISIERE ── */}
          {activeTab === 'fisiere' && (() => {
            const t = c.fisiere
            return (
              <div className="space-y-8">
                <div>
                  <h2 className="mb-2 text-xl font-semibold text-white">{t.title}</h2>
                  <p className="text-sm leading-relaxed text-zinc-400">{t.intro}</p>
                </div>

                {/* Workflow steps */}
                <div>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500">{t.workflowTitle}</h3>
                  <div className="flex flex-wrap items-center gap-2">
                    {t.workflowSteps.map((step, i) => (
                      <div key={step.label} className="flex items-center gap-2">
                        <div className={`flex flex-col items-center rounded-xl border px-4 py-3 text-center ${step.color}`}>
                          <span className="text-xs opacity-60">{step.step}</span>
                          <span className="text-sm font-semibold">{step.label}</span>
                          <span className="text-xs opacity-70">{step.desc}</span>
                        </div>
                        {i < t.workflowSteps.length - 1 && (
                          <ChevronRight className="h-4 w-4 text-zinc-600" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tool deep-dives */}
                <div className="space-y-6">
                  {t.tools.map((tool) => (
                    <div key={tool.name} className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {tool.name === 'Read'  && <FileText className="h-5 w-5 text-blue-400" />}
                          {tool.name === 'Write' && <FilePen  className="h-5 w-5 text-blue-400" />}
                          {tool.name === 'Edit'  && <FileEdit className="h-5 w-5 text-blue-400" />}
                          <span className="text-base font-semibold text-white">{tool.name}</span>
                        </div>
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${tool.badgeColor}`}>
                          {tool.badge}
                        </span>
                      </div>
                      <p className="mb-3 text-sm leading-relaxed text-zinc-400">{tool.desc}</p>
                      {tool.tipType === 'info'
                        ? <div className="mb-4"><InfoBox>{tool.tip}</InfoBox></div>
                        : <div className="mb-4"><WarnBox>{tool.tip}</WarnBox></div>
                      }
                      <CodeBlock code={tool.code} />
                    </div>
                  ))}
                </div>

                {/* Edit vs Write table */}
                <div>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500">{t.vsTitle}</h3>
                  <div className="overflow-hidden rounded-xl border border-zinc-800">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-zinc-800 bg-zinc-900/60">
                          <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                            {lang === 'ro' ? 'Criteriu' : 'Criteria'}
                          </th>
                          <th className="px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-blue-400">Edit</th>
                          <th className="px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-blue-400">Write</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/60">
                        {t.vsRows.map((row) => (
                          <tr key={row.criteria} className="hover:bg-zinc-900/30 transition-colors">
                            <td className="px-4 py-2.5 text-zinc-300">{row.criteria}</td>
                            <td className="px-4 py-2.5 text-center">
                              {row.edit
                                ? <CheckCircle className="mx-auto h-4 w-4 text-green-400" />
                                : <span className="text-zinc-700">—</span>}
                            </td>
                            <td className="px-4 py-2.5 text-center">
                              {row.write
                                ? <CheckCircle className="mx-auto h-4 w-4 text-green-400" />
                                : <span className="text-zinc-700">—</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )
          })()}

          {/* ── CAUTARE ── */}
          {activeTab === 'cautare' && (() => {
            const t = c.cautare
            return (
              <div className="space-y-8">
                <div>
                  <h2 className="mb-2 text-xl font-semibold text-white">{t.title}</h2>
                  <p className="text-sm leading-relaxed text-zinc-400">{t.intro}</p>
                </div>

                {t.tools.map((tool, i) => (
                  <div key={tool.name} className="space-y-4">
                    <div className="flex items-center gap-3">
                      {i === 0
                        ? <Search className="h-5 w-5 text-green-400" />
                        : <ScanSearch className="h-5 w-5 text-green-400" />}
                      <h3 className="text-lg font-semibold text-white">{tool.name}</h3>
                    </div>
                    <p className="text-sm leading-relaxed text-zinc-400">{tool.desc}</p>
                    <CodeBlock code={tool.code} />

                    {i === 0 && (
                      <div>
                        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                          {lang === 'ro' ? 'Pattern-uri comune' : 'Common patterns'}
                        </h4>
                        <div className="divide-y divide-zinc-800 rounded-xl border border-zinc-800 overflow-hidden">
                          {tool.patterns?.map((p) => (
                            <div key={p.pattern} className="flex items-center gap-4 px-4 py-2.5">
                              <code className="min-w-[160px] text-xs text-green-400">{p.pattern}</code>
                              <span className="text-xs text-zinc-400">{p.desc}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {i === 1 && (
                      <div>
                        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                          {lang === 'ro' ? 'Moduri de output' : 'Output modes'}
                        </h4>
                        <div className="divide-y divide-zinc-800 rounded-xl border border-zinc-800 overflow-hidden">
                          {tool.modes?.map((m) => (
                            <div key={m.mode} className="flex items-center gap-4 px-4 py-2.5">
                              <code className="min-w-[180px] text-xs text-green-400">{m.mode}</code>
                              <span className="text-xs text-zinc-400">{m.desc}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {i < t.tools.length - 1 && <hr className="border-zinc-800" />}
                  </div>
                ))}

                {/* Combo */}
                <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-5">
                  <h3 className="mb-1 text-sm font-semibold text-green-400">{t.comboTitle}</h3>
                  <p className="mb-4 text-xs text-zinc-400">{t.comboDesc}</p>
                  <CodeBlock code={t.comboCode} />
                </div>
              </div>
            )
          })()}

          {/* ── EXECUTIE ── */}
          {activeTab === 'executie' && (() => {
            const t = c.executie
            return (
              <div className="space-y-8">
                <div>
                  <h2 className="mb-2 text-xl font-semibold text-white">{t.title}</h2>
                  <p className="text-sm leading-relaxed text-zinc-400">{t.intro}</p>
                </div>

                {/* Bash */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Terminal className="h-5 w-5 text-red-400" />
                      <h3 className="text-lg font-semibold text-white">{t.bash.name}</h3>
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${t.bash.badgeColor}`}>
                      {t.bash.badge}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-zinc-400">{t.bash.desc}</p>
                  <WarnBox>{t.bash.warnBox}</WarnBox>
                  <CodeBlock code={t.bash.code} />
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
                    {t.bash.useCases.map((uc) => (
                      <div key={uc.label} className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-3">
                        <div className={`text-xs font-medium ${uc.color}`}>{uc.label}</div>
                        <code className="mt-1 block text-[11px] text-zinc-500">{uc.cmd}</code>
                      </div>
                    ))}
                  </div>
                </div>

                <hr className="border-zinc-800" />

                {/* WebFetch + WebSearch */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-purple-400" />
                      <h3 className="text-base font-semibold text-white">{t.web.fetchName}</h3>
                    </div>
                    <p className="text-sm leading-relaxed text-zinc-400">{t.web.fetchDesc}</p>
                    <CodeBlock code={t.web.fetchCode} />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-purple-400" />
                      <h3 className="text-base font-semibold text-white">{t.web.searchName}</h3>
                    </div>
                    <p className="text-sm leading-relaxed text-zinc-400">{t.web.searchDesc}</p>
                    <CodeBlock code={t.web.searchCode} />
                  </div>
                </div>

                <hr className="border-zinc-800" />

                {/* TodoWrite */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Clipboard className="h-5 w-5 text-amber-400" />
                    <h3 className="text-base font-semibold text-white">{t.todo.name}</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-zinc-400">{t.todo.desc}</p>
                  <InfoBox>{t.todo.infoBox}</InfoBox>
                  <CodeBlock code={t.todo.code} />
                </div>
              </div>
            )
          })()}

          {/* ── PERMISIUNI ── */}
          {activeTab === 'permisiuni' && (() => {
            const t = c.permisiuni
            return (
              <div className="space-y-8">
                <div>
                  <h2 className="mb-2 text-xl font-semibold text-white">{t.title}</h2>
                  <p className="text-sm leading-relaxed text-zinc-400">{t.intro}</p>
                </div>

                {/* Permission levels */}
                <div className="grid gap-3 sm:grid-cols-2">
                  {t.levels.map((lvl) => (
                    <div key={lvl.level} className={`flex items-start gap-3 rounded-xl border p-4 ${lvl.bg}`}>
                      {lvl.color === 'text-green-400' && <Unlock className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-400" />}
                      {lvl.color === 'text-amber-400' && <Zap     className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-400" />}
                      {lvl.color === 'text-blue-400'  && <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-400" />}
                      {lvl.color === 'text-red-400'   && <Lock    className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400" />}
                      <div>
                        <div className={`text-sm font-semibold ${lvl.color}`}>{lvl.level}</div>
                        <p className="mt-0.5 text-xs leading-relaxed text-zinc-400">{lvl.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* settings.json config */}
                <div>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500">{t.configTitle}</h3>
                  <CodeBlock code={t.configCode} />
                </div>

                {/* Patterns table */}
                <div>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500">{t.patternsTitle}</h3>
                  <div className="overflow-hidden rounded-xl border border-zinc-800">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-zinc-800 bg-zinc-900/60">
                          <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">Pattern</th>
                          <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                            {lang === 'ro' ? 'Efect' : 'Effect'}
                          </th>
                          <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                            {lang === 'ro' ? 'Descriere' : 'Description'}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/60">
                        {t.patterns.map((p) => (
                          <tr key={p.pattern} className="hover:bg-zinc-900/30 transition-colors">
                            <td className="px-4 py-2.5">
                              <code className="text-xs text-blue-300">{p.pattern}</code>
                            </td>
                            <td className="px-4 py-2.5">
                              <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${
                                p.effect === 'Allow' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                              }`}>
                                {p.effect}
                              </span>
                            </td>
                            <td className="px-4 py-2.5 text-xs text-zinc-400">{p.desc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Run modes */}
                <div>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500">{t.modesTitle}</h3>
                  <div className="space-y-2">
                    {t.modes.map((mode) => (
                      <div key={mode.name} className="flex items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
                        <div className={`mt-0.5 h-2 w-2 flex-shrink-0 rounded-full ${
                          mode.color === 'text-red-400' ? 'bg-red-400' : mode.color === 'text-green-400' ? 'bg-green-400' : 'bg-blue-400'
                        }`} />
                        <div>
                          <code className={`text-xs font-semibold ${mode.color}`}>{mode.name}</code>
                          <p className="mt-0.5 text-xs leading-relaxed text-zinc-400">{mode.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })()}

        </div>
      </div>
    </section>
  )
}
