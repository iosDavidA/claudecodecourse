import { useState } from 'react'
import { Coins, Zap, Archive, Scissors, FileText, Eye, TrendingDown, AlertTriangle, CheckCircle, Info } from 'lucide-react'
import { CodeBlock } from './CodeBlock'
import { useApp } from '../contexts/AppContext'

type TabId = 'bazele' | 'context' | 'economii' | 'caching' | 'monitorizare'

interface Tab {
  id: TabId
  icon: React.ReactNode
}

const TABS: Tab[] = [
  { id: 'bazele',       icon: <Coins className="h-4 w-4" /> },
  { id: 'context',      icon: <Eye className="h-4 w-4" /> },
  { id: 'economii',     icon: <TrendingDown className="h-4 w-4" /> },
  { id: 'caching',      icon: <Archive className="h-4 w-4" /> },
  { id: 'monitorizare', icon: <Zap className="h-4 w-4" /> },
]

const CONTENT = {
  ro: {
    badge: 'Gestionare Tokeni',
    title: 'Gestionarea Tokenilor',
    description: 'Înțelege cum funcționează tokenii, cum să folosești prompt caching și strategii concrete pentru a reduce costurile fără să sacrifici calitatea.',
    stats: [
      { value: '1M', label: 'tokeni context',  sub: 'Sonnet 5 & Opus 4.8 (Haiku: 200K)' },
      { value: '~10%', label: 'cost cache read', sub: 'față de input normal' },
      { value: '5 min', label: 'TTL prompt cache', sub: 'durată de viață' },
      { value: '3–5×', label: 'output vs input',  sub: 'output e mai scump' },
    ],
    tabLabels: {
      bazele:       'Bazele',
      context:      'Context Window',
      economii:     'Economii',
      caching:      'Prompt Caching',
      monitorizare: 'Monitorizare',
    },
    bazele: {
      title: 'Ce sunt tokenii?',
      intro: (
        <>
          Un <span className="text-amber-400 font-medium">token</span> este unitatea de bază cu care modelele de limbaj procesează textul. Nu corespunde exact cu un cuvânt — un cuvânt comun poate fi un singur token, în timp ce un cuvânt rar sau tehnic poate fi fragmentat în mai mulți tokeni.
        </>
      ),
      stats: [
        { label: '~4 caractere', sub: '= 1 token (medie)' },
        { label: '~750 cuvinte',  sub: '≈ 1.000 tokeni' },
        { label: '1 pagină A4',   sub: '≈ 400–600 tokeni' },
      ],
      typesTitle: 'Tipuri de tokeni',
      types: [
        { tip: 'Input tokens',       desc: 'Tot ce trimiți modelului: promptul tău, conținutul fișierelor, istoricul conversației, CLAUDE.md. Sunt mai ieftini.' },
        { tip: 'Output tokens',      desc: 'Răspunsul generat de model — codul scris, explicațiile, analiza. Sunt de 3–5× mai scumpi decât input-ul.' },
        { tip: 'Cache read tokens',  desc: 'Tokeni citiți din cache (prompt caching). Costă ~10% față de input tokens obișnuiți — cel mai ieftin tip.' },
        { tip: 'Cache write tokens', desc: 'Tokeni scrisi în cache la prima utilizare. Costă ~125% față de input — investiție amortizată în cererile ulterioare.' },
      ],
      infoBox: (
        <>
          Claude Code trimite <strong>întreaga conversație</strong> la fiecare mesaj nou. Cu cât conversația e mai lungă, cu atât mai mulți tokeni de input sunt consumați la fiecare cerere.
        </>
      ),
      countTitle: 'Cum numeri tokenii',
      countCode: `# Numărare exactă cu API-ul count_tokens (gratuit)
# Nu folosi tiktoken — e tokenizer-ul OpenAI și subestimează cu 15–20%.

python3 -c "
from anthropic import Anthropic
client = Anthropic()
text = open('fisier.ts').read()
resp = client.messages.count_tokens(
    model='claude-sonnet-5',
    messages=[{'role': 'user', 'content': text}],
)
print(f'{resp.input_tokens} tokeni')
"`,
    },
    context: {
      title: 'Context Window',
      intro: (
        <>
          <span className="text-amber-400 font-medium">Context window</span> reprezintă numărul maxim de tokeni pe care un model îi poate procesa simultan — input + output la un loc. Odată umplut, Claude nu mai poate „vedea" mesajele mai vechi.
        </>
      ),
      colEquivalent: 'Echivalent',
      tableRows: [
        { model: 'Claude Opus 4.8',   ctx: '1M',   out: '128K', eq: '~2.250 pagini A4' },
        { model: 'Claude Sonnet 5',   ctx: '1M',   out: '128K', eq: '~2.250 pagini A4' },
        { model: 'Claude Haiku 4.5',  ctx: '200K', out: '64K',  eq: '~450 pagini A4' },
      ],
      tokensSuffix: 'tokeni',
      fillTitle: 'Ce umple contextul rapid',
      fillItems: [
        { item: 'Fișiere mari citite cu Read/cat',                             impact: 'Foarte mare', color: 'text-red-400' },
        { item: 'Istoricul lung al conversației',                              impact: 'Mare',        color: 'text-orange-400' },
        { item: 'Output-uri verbose din tool-uri (npm install, build logs)',   impact: 'Mare',        color: 'text-orange-400' },
        { item: 'CLAUDE.md lung cu instrucțiuni detaliate',                   impact: 'Mediu',       color: 'text-amber-400' },
        { item: 'Răspunsuri lungi cu explicații detaliate',                   impact: 'Mediu',       color: 'text-amber-400' },
        { item: 'Mesaje scurte și clare',                                     impact: 'Mic',         color: 'text-green-400' },
      ],
      warnBox: (
        <>
          Când contextul se umple, Claude Code va afișa un avertisment și va solicita <code className="text-amber-400">/compact</code> sau <code className="text-amber-400">/clear</code>. Dacă ignori, performanța degradează semnificativ.
        </>
      ),
      viewTitle: 'Vizualizarea utilizării contextului',
      viewCode: `# În conversație, poți întreba direct:
# "Câți tokeni am folosit până acum?"

# Claude Code afișează usage în statusbar (dacă e configurat)
# Sau verifică în API response:
{
  "usage": {
    "input_tokens": 12450,
    "cache_creation_input_tokens": 8200,
    "cache_read_input_tokens": 3100,
    "output_tokens": 847
  }
}`,
    },
    economii: {
      title: 'Cum să economisești tokeni',
      intro: 'Reducerea consumului de tokeni nu înseamnă să sacrifici calitatea — înseamnă să fii strategic în ce dai modelului să proceseze.',
      strategies: [
        {
          num: '01',
          colorIcon: 'rounded-lg bg-red-500/10 p-2',
          iconClass: 'h-5 w-5 text-red-400',
          icon: 'scissors' as const,
          title: '/clear — Resetează conversația',
          subtitle: 'Cel mai radical — șterge tot contextul anterior',
          body: (
            <>
              Folosește <code className="text-amber-400">/clear</code> când termini un task și treci la altul complet diferit. Conversația veche nu mai e relevantă și menținerea ei consumă tokeni degeaba.
            </>
          ),
          code: `# Când să folosești /clear:
# ✓ Am terminat de implementat feature X, acum lucrez la bug Y
# ✓ Am explorat codul, acum vreau să scriu teste
# ✓ Sesiune nouă de lucru după o pauză lungă

/clear`,
        },
        {
          num: '02',
          colorIcon: 'rounded-lg bg-blue-500/10 p-2',
          iconClass: 'h-5 w-5 text-blue-400',
          icon: 'archive' as const,
          title: '/compact — Comprimă contextul',
          subtitle: 'Rezumă conversația fără să pierzi progresul',
          body: (
            <>
              Comandă lui Claude să rezume tot ce s-a discutat într-un summary compact, înlocuind istoricul detaliat. Păstrezi contextul esențial fără să consumi tokeni pe detalii deja rezolvate.
            </>
          ),
          code: `# Când contextul e pe la 50-70% capacitate:
/compact

# Cu instrucțiuni custom despre ce să păstreze:
/compact Păstrează: lista de fișiere modificate, deciziile arhitecturale,
bug-urile rezolvate. Omite: output-urile de build, explorările inițiale.`,
        },
        {
          num: '03',
          colorIcon: 'rounded-lg bg-green-500/10 p-2',
          iconClass: 'h-5 w-5 text-green-400',
          icon: 'file' as const,
          title: 'Citire țintită a fișierelor',
          subtitle: 'Nu da tot codul — dă doar ce e relevant',
          body: 'Când ceri ajutor cu un fișier de 500 de linii dar bug-ul e pe linia 50, nu e necesar să încarci tot fișierul în context.',
          code: `# INEFICIENT — încarcă 500 linii inutile
"Citește src/components/Dashboard.tsx și repară eroarea"

# EFICIENT — indică zona problemei
"În src/components/Dashboard.tsx, liniile 45-70 (funcția handleSubmit)
aruncă o eroare de tipuri TypeScript. Repară-o."

# Sau folosește offset + limit în Read tool:
# Read liniile 40-80 din fișier, nu tot fișierul`,
        },
        {
          num: '04',
          colorIcon: 'rounded-lg bg-amber-500/10 p-2',
          iconClass: 'h-5 w-5 text-amber-400',
          icon: 'coins' as const,
          title: 'Prompturi specifice și concise',
          subtitle: 'Calitatea promptului > lungimea promptului',
          body: 'Un prompt vag forțează modelul să facă presupuneri și să genereze mai mult output exploratoriu. Un prompt specific produce direct ce ai nevoie.',
          code: `# VAGUE — generează mult output exploratoriu
"Ajută-mă cu autentificarea"

# SPECIFIC — răspuns direct, mai puțini tokeni
"Adaugă validare Zod pentru câmpul email în src/app/api/auth/route.ts.
Schema existentă e în lib/schemas.ts. Nu schimba logica de autentificare."

# LIMITEAZĂ output-ul explicit când nu ai nevoie de explicații:
"Repară doar tipul TypeScript greșit. Nu explica modificările."`,
        },
        {
          num: '05',
          colorIcon: 'rounded-lg bg-purple-500/10 p-2',
          iconClass: 'h-5 w-5 text-purple-400',
          icon: 'file' as const,
          title: 'CLAUDE.md modular',
          subtitle: 'Instrucțiuni locale per subdirector',
          body: 'În loc de un CLAUDE.md global de 200 de linii, plasează instrucțiuni specifice în subdirectoarele relevante. Claude citește CLAUDE.md ierarhic — instrucțiunile de frontend nu se încarcă când lucrezi pe backend.',
          code: `# Structură optimizată
project/
  CLAUDE.md              # Reguli globale — scurt, esențial (max 50 linii)
  src/
    components/
      CLAUDE.md          # Reguli UI/design system specifice
    api/
      CLAUDE.md          # Reguli API, auth, validare
    lib/
      CLAUDE.md          # Convenții pentru utilitare și helpers

# CLAUDE.md global minimal:
Tech: Next.js 15, TypeScript strict, Tailwind v4, Prisma 7
DB: import db from @/lib/db — nu PrismaClient direct
UI: shadcn/ui pentru toate componentele
Prețuri: Float în DB, formatPrice() pentru display`,
        },
      ],
      tipBox: (
        <>
          <strong>Regula 80/20 a tokenilor:</strong> 80% din economii vin din trei obiceiuri simple: folosește <code className="text-green-300">/clear</code> între task-uri distincte, scrie prompturi specifice cu context exact, și evită să încarci fișiere mari inutile.
        </>
      ),
    },
    caching: {
      title: 'Prompt Caching',
      intro: (
        <>
          <span className="text-amber-400 font-medium">Prompt caching</span> este o funcționalitate a API-ului Anthropic care memorează porțiuni din prompt pentru a fi reutilizate în cererile ulterioare, reducând semnificativ costul și latența.
        </>
      ),
      infoBox: (
        <>
          Claude Code folosește automat prompt caching pentru <strong>CLAUDE.md</strong>, <strong>system prompt</strong>, și <strong>tool definitions</strong>. Nu trebuie să configurezi nimic — funcționează implicit.
        </>
      ),
      stats: [
        { label: 'Cache read', sub: 'din costul input tokens obișnuiți' },
        { label: 'TTL cache',  sub: 'durata de viață a unui cache entry' },
      ],
      howTitle: 'Cum funcționează',
      steps: [
        (<>Prima cerere: tokenii din prefixul cacheable sunt <span className="text-amber-400">scrisi în cache</span> (cost 125% din input normal).</>),
        (<>Cererile ulterioare în 5 minute: prefixul identic este <span className="text-green-400">citit din cache</span> (cost 10% din input normal).</>),
        'După 5 minute de inactivitate: cache expiră, se rescrie la următoarea cerere.',
      ],
      whatTitle: 'Ce se cachează automat în Claude Code',
      cacheItems: [
        { item: 'System prompt (instrucțiunile interne ale Claude Code)', cached: true },
        { item: 'CLAUDE.md — conținutul fișierelor de instrucțiuni',      cached: true },
        { item: 'Tool definitions (lista tool-urilor disponibile)',        cached: true },
        { item: 'Mesajele noi din conversație',                           cached: false },
        { item: 'Conținutul fișierelor citite cu Read tool',              cached: false },
      ],
      cachedLabel: 'Cacheat',
      notCachedLabel: 'Nu se cachează',
      manualTitle: 'Caching manual în propriile aplicații',
      manualIntro: 'Dacă construiești cu Anthropic SDK, poți marca explicit ce să fie cacheat:',
      manualCode: `import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

const response = await client.messages.create({
  model: 'claude-sonnet-5',
  max_tokens: 1024,
  system: [
    {
      type: 'text',
      text: 'Ești un asistent expert în TypeScript.',
      // Marchează system prompt-ul pentru caching
      cache_control: { type: 'ephemeral' },
    },
  ],
  messages: [
    {
      role: 'user',
      content: [
        {
          type: 'text',
          // Documentația mare — se cachează
          text: documentatieLunga,
          cache_control: { type: 'ephemeral' },
        },
        {
          type: 'text',
          // Întrebarea specifică — NU se cachează (variabilă)
          text: intrebareaUtilizatorului,
        },
      ],
    },
  ],
})

// Verifică economiile din caching:
console.log(response.usage)
// {
//   input_tokens: 150,
//   cache_creation_input_tokens: 4200,  // prima dată
//   cache_read_input_tokens: 0,
//   output_tokens: 320
// }`,
      tipBox: (
        <>
          Pentru sesiunile de lucru lungi cu Claude Code, <strong>nu ieși din conversație inutil</strong>. Cât timp conversația e activă, CLAUDE.md și system prompt-ul sunt serve din cache la cost redus.
        </>
      ),
    },
    monitorizare: {
      title: 'Monitorizarea consumului',
      intro: 'Înțelegerea unde se duc tokenii te ajută să iei decizii mai bune despre când să optimizezi și când costul e justificat.',
      consoleIntro: 'Accesează <span class="text-amber-400">console.anthropic.com/usage</span> pentru a vedea consumul detaliat pe:',
      consoleItems: [
        'Tokeni pe tip (input / output / cache)',
        'Cost pe zi / săptămână / lună',
        'Distribuție per model',
        'Vârfuri de utilizare',
      ],
      limitsTitle: 'Configurare limite de costuri',
      limitsCode: `# În console.anthropic.com/settings/limits:
# Setează spending limits lunare pentru a evita surprize

# Exemplu limite recomandate:
# Development: $20/lună
# Production: $100/lună cu alerte la 80%

# Alerte prin email la 50%, 80%, 100% din limită`,
      estimateTitle: 'Estimare costuri per task',
      colTask: 'Task tipic',
      colTokens: 'Tokeni estimați',
      tableRows: [
        { task: 'Repară un bug simplu',         tokens: '2K–5K',     cost: '~$0.02' },
        { task: 'Adaugă o funcționalitate mică', tokens: '5K–15K',    cost: '~$0.05' },
        { task: 'Refactorizare modul mediu',     tokens: '15K–40K',   cost: '~$0.15' },
        { task: 'Feature complex cu teste',      tokens: '40K–100K',  cost: '~$0.40' },
        { task: 'Review complet codebase',       tokens: '100K–200K', cost: '~$1.00' },
      ],
      warnBox: (
        <>
          Costurile de mai sus sunt estimate pentru Sonnet 5 fără caching. Cu prompt caching activ, costul real scade cu <strong>30–60%</strong> pentru sesiunile lungi cu CLAUDE.md consistent.
        </>
      ),
      bestTitle: 'Best practices finale',
      bestItems: [
        { text: 'Folosește Haiku 4.5 pentru task-uri simple: grep, sumar, întrebări rapide', color: 'text-green-400' },
        { text: 'Reservă Opus 4.8 pentru arhitectură și decizii complexe',                   color: 'text-purple-400' },
        { text: 'Activează /compact proactiv la ~60% context, nu aștepta warning-ul',        color: 'text-blue-400' },
        { text: 'Scrie CLAUDE.md concis — fiecare linie se adaugă la fiecare request',       color: 'text-amber-400' },
        { text: 'Batch task-uri similare în aceeași sesiune pentru a amortiza cache write cost', color: 'text-green-400' },
        { text: 'Evită să ceri explicații dacă nu ai nevoie: „fix only, no explanation"',   color: 'text-blue-400' },
      ],
    },
  },
  en: {
    badge: 'Token Management',
    title: 'Token Management',
    description: 'Understand how tokens work, how to use prompt caching, and concrete strategies to reduce costs without sacrificing quality.',
    stats: [
      { value: '1M', label: 'context tokens',    sub: 'Sonnet 5 & Opus 4.8 (Haiku: 200K)' },
      { value: '~10%', label: 'cache read cost',   sub: 'vs regular input cost' },
      { value: '5 min', label: 'prompt cache TTL', sub: 'cache entry lifetime' },
      { value: '3–5×', label: 'output vs input',   sub: 'output costs more' },
    ],
    tabLabels: {
      bazele:       'Basics',
      context:      'Context Window',
      economii:     'Savings',
      caching:      'Prompt Caching',
      monitorizare: 'Monitoring',
    },
    bazele: {
      title: 'What are tokens?',
      intro: (
        <>
          A <span className="text-amber-400 font-medium">token</span> is the basic unit that language models use to process text. It does not map exactly to a word — a common word may be a single token, while a rare or technical word may be split into multiple tokens.
        </>
      ),
      stats: [
        { label: '~4 characters', sub: '= 1 token (average)' },
        { label: '~750 words',    sub: '≈ 1,000 tokens' },
        { label: '1 A4 page',     sub: '≈ 400–600 tokens' },
      ],
      typesTitle: 'Types of tokens',
      types: [
        { tip: 'Input tokens',       desc: 'Everything you send to the model: your prompt, file contents, conversation history, CLAUDE.md. They are cheaper.' },
        { tip: 'Output tokens',      desc: 'The response generated by the model — written code, explanations, analysis. They cost 3–5× more than input tokens.' },
        { tip: 'Cache read tokens',  desc: 'Tokens read from cache (prompt caching). Cost ~10% of regular input tokens — the cheapest type.' },
        { tip: 'Cache write tokens', desc: 'Tokens written to cache on first use. Cost ~125% of input — an investment amortized across subsequent requests.' },
      ],
      infoBox: (
        <>
          Claude Code sends the <strong>entire conversation</strong> with each new message. The longer the conversation, the more input tokens consumed per request.
        </>
      ),
      countTitle: 'How to count tokens',
      countCode: `# Exact count with the count_tokens API (free)
# Don't use tiktoken — it's OpenAI's tokenizer and undercounts by 15–20%.

python3 -c "
from anthropic import Anthropic
client = Anthropic()
text = open('file.ts').read()
resp = client.messages.count_tokens(
    model='claude-sonnet-5',
    messages=[{'role': 'user', 'content': text}],
)
print(f'{resp.input_tokens} tokens')
"`,
    },
    context: {
      title: 'Context Window',
      intro: (
        <>
          The <span className="text-amber-400 font-medium">context window</span> is the maximum number of tokens a model can process at once — input + output combined. Once full, Claude can no longer "see" older messages.
        </>
      ),
      colEquivalent: 'Equivalent',
      tableRows: [
        { model: 'Claude Opus 4.8',   ctx: '1M',   out: '128K', eq: '~2,250 A4 pages' },
        { model: 'Claude Sonnet 5',   ctx: '1M',   out: '128K', eq: '~2,250 A4 pages' },
        { model: 'Claude Haiku 4.5',  ctx: '200K', out: '64K',  eq: '~450 A4 pages' },
      ],
      tokensSuffix: 'tokens',
      fillTitle: 'What fills context quickly',
      fillItems: [
        { item: 'Large files read with Read/cat',                                  impact: 'Very high', color: 'text-red-400' },
        { item: 'Long conversation history',                                        impact: 'High',      color: 'text-orange-400' },
        { item: 'Verbose tool outputs (npm install, build logs)',                   impact: 'High',      color: 'text-orange-400' },
        { item: 'Long CLAUDE.md with detailed instructions',                        impact: 'Medium',    color: 'text-amber-400' },
        { item: 'Long responses with detailed explanations',                        impact: 'Medium',    color: 'text-amber-400' },
        { item: 'Short and clear messages',                                         impact: 'Low',       color: 'text-green-400' },
      ],
      warnBox: (
        <>
          When the context fills up, Claude Code will show a warning and prompt for <code className="text-amber-400">/compact</code> or <code className="text-amber-400">/clear</code>. Ignoring it significantly degrades performance.
        </>
      ),
      viewTitle: 'Viewing context usage',
      viewCode: `# You can ask directly in the conversation:
# "How many tokens have I used so far?"

# Claude Code shows usage in the statusbar (if configured)
# Or check the API response:
{
  "usage": {
    "input_tokens": 12450,
    "cache_creation_input_tokens": 8200,
    "cache_read_input_tokens": 3100,
    "output_tokens": 847
  }
}`,
    },
    economii: {
      title: 'How to save tokens',
      intro: 'Reducing token consumption does not mean sacrificing quality — it means being strategic about what you give the model to process.',
      strategies: [
        {
          num: '01',
          colorIcon: 'rounded-lg bg-red-500/10 p-2',
          iconClass: 'h-5 w-5 text-red-400',
          icon: 'scissors' as const,
          title: '/clear — Reset the conversation',
          subtitle: 'Most radical — wipes all previous context',
          body: (
            <>
              Use <code className="text-amber-400">/clear</code> when you finish a task and move on to a completely different one. The old conversation is no longer relevant and keeping it consumes tokens needlessly.
            </>
          ),
          code: `# When to use /clear:
# ✓ Finished implementing feature X, now working on bug Y
# ✓ Explored the codebase, now want to write tests
# ✓ New work session after a long break

/clear`,
        },
        {
          num: '02',
          colorIcon: 'rounded-lg bg-blue-500/10 p-2',
          iconClass: 'h-5 w-5 text-blue-400',
          icon: 'archive' as const,
          title: '/compact — Compress the context',
          subtitle: 'Summarizes the conversation without losing progress',
          body: 'Tells Claude to summarize everything discussed into a compact summary, replacing the detailed history. You keep the essential context without spending tokens on already-resolved details.',
          code: `# When context is around 50-70% capacity:
/compact

# With custom instructions about what to keep:
/compact Keep: list of modified files, architectural decisions,
resolved bugs. Skip: build outputs, initial explorations.`,
        },
        {
          num: '03',
          colorIcon: 'rounded-lg bg-green-500/10 p-2',
          iconClass: 'h-5 w-5 text-green-400',
          icon: 'file' as const,
          title: 'Targeted file reading',
          subtitle: "Don't give all the code — give only what's relevant",
          body: "When you ask for help with a 500-line file but the bug is on line 50, there's no need to load the entire file into context.",
          code: `# INEFFICIENT — loads 500 unnecessary lines
"Read src/components/Dashboard.tsx and fix the error"

# EFFICIENT — point to the problem area
"In src/components/Dashboard.tsx, lines 45-70 (handleSubmit function)
throws a TypeScript type error. Fix it."

# Or use offset + limit in the Read tool:
# Read lines 40-80 from the file, not the whole file`,
        },
        {
          num: '04',
          colorIcon: 'rounded-lg bg-amber-500/10 p-2',
          iconClass: 'h-5 w-5 text-amber-400',
          icon: 'coins' as const,
          title: 'Specific and concise prompts',
          subtitle: 'Prompt quality > prompt length',
          body: 'A vague prompt forces the model to make assumptions and generate more exploratory output. A specific prompt directly produces what you need.',
          code: `# VAGUE — generates lots of exploratory output
"Help me with authentication"

# SPECIFIC — direct response, fewer tokens
"Add Zod validation for the email field in src/app/api/auth/route.ts.
The existing schema is in lib/schemas.ts. Do not change the auth logic."

# LIMIT output explicitly when you don't need explanations:
"Fix only the wrong TypeScript type. Do not explain the changes."`,
        },
        {
          num: '05',
          colorIcon: 'rounded-lg bg-purple-500/10 p-2',
          iconClass: 'h-5 w-5 text-purple-400',
          icon: 'file' as const,
          title: 'Modular CLAUDE.md',
          subtitle: 'Local instructions per subdirectory',
          body: 'Instead of a single 200-line global CLAUDE.md, place specific instructions in the relevant subdirectories. Claude reads CLAUDE.md hierarchically — frontend instructions are not loaded when working on the backend.',
          code: `# Optimized structure
project/
  CLAUDE.md              # Global rules — short, essential (max 50 lines)
  src/
    components/
      CLAUDE.md          # UI/design system specific rules
    api/
      CLAUDE.md          # API, auth, validation rules
    lib/
      CLAUDE.md          # Conventions for utilities and helpers

# Minimal global CLAUDE.md:
Tech: Next.js 15, TypeScript strict, Tailwind v4, Prisma 7
DB: import db from @/lib/db — never PrismaClient directly
UI: shadcn/ui for all components
Prices: Float in DB, formatPrice() for display`,
        },
      ],
      tipBox: (
        <>
          <strong>The 80/20 token rule:</strong> 80% of savings come from three simple habits: use <code className="text-green-300">/clear</code> between distinct tasks, write specific prompts with exact context, and avoid loading large unnecessary files.
        </>
      ),
    },
    caching: {
      title: 'Prompt Caching',
      intro: (
        <>
          <span className="text-amber-400 font-medium">Prompt caching</span> is an Anthropic API feature that stores portions of the prompt to be reused in subsequent requests, significantly reducing cost and latency.
        </>
      ),
      infoBox: (
        <>
          Claude Code automatically uses prompt caching for <strong>CLAUDE.md</strong>, <strong>system prompt</strong>, and <strong>tool definitions</strong>. No configuration needed — it works implicitly.
        </>
      ),
      stats: [
        { label: 'Cache read', sub: 'of regular input token cost' },
        { label: 'Cache TTL',  sub: 'cache entry lifetime' },
      ],
      howTitle: 'How it works',
      steps: [
        (<>First request: tokens in the cacheable prefix are <span className="text-amber-400">written to cache</span> (cost 125% of normal input).</>),
        (<>Subsequent requests within 5 minutes: the identical prefix is <span className="text-green-400">read from cache</span> (cost 10% of normal input).</>),
        'After 5 minutes of inactivity: the cache expires and is rewritten on the next request.',
      ],
      whatTitle: 'What is cached automatically in Claude Code',
      cacheItems: [
        { item: 'System prompt (Claude Code internal instructions)',  cached: true },
        { item: 'CLAUDE.md — content of instruction files',          cached: true },
        { item: 'Tool definitions (list of available tools)',         cached: true },
        { item: 'New messages in the conversation',                   cached: false },
        { item: 'File contents read with the Read tool',              cached: false },
      ],
      cachedLabel: 'Cached',
      notCachedLabel: 'Not cached',
      manualTitle: 'Manual caching in your own apps',
      manualIntro: 'If you are building with the Anthropic SDK, you can explicitly mark what should be cached:',
      manualCode: `import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

const response = await client.messages.create({
  model: 'claude-sonnet-5',
  max_tokens: 1024,
  system: [
    {
      type: 'text',
      text: 'You are an expert TypeScript assistant.',
      // Mark the system prompt for caching
      cache_control: { type: 'ephemeral' },
    },
  ],
  messages: [
    {
      role: 'user',
      content: [
        {
          type: 'text',
          // Large documentation — gets cached
          text: longDocumentation,
          cache_control: { type: 'ephemeral' },
        },
        {
          type: 'text',
          // The specific question — NOT cached (variable)
          text: userQuestion,
        },
      ],
    },
  ],
})

// Check caching savings:
console.log(response.usage)
// {
//   input_tokens: 150,
//   cache_creation_input_tokens: 4200,  // first time
//   cache_read_input_tokens: 0,
//   output_tokens: 320
// }`,
      tipBox: (
        <>
          For long Claude Code work sessions, <strong>don't exit the conversation unnecessarily</strong>. While the conversation is active, CLAUDE.md and the system prompt are served from cache at reduced cost.
        </>
      ),
    },
    monitorizare: {
      title: 'Monitoring usage',
      intro: 'Understanding where tokens go helps you make better decisions about when to optimize and when the cost is justified.',
      consoleIntro: 'Go to <span class="text-amber-400">console.anthropic.com/usage</span> to see detailed consumption by:',
      consoleItems: [
        'Tokens by type (input / output / cache)',
        'Cost per day / week / month',
        'Distribution per model',
        'Usage peaks',
      ],
      limitsTitle: 'Setting cost limits',
      limitsCode: `# In console.anthropic.com/settings/limits:
# Set monthly spending limits to avoid surprises

# Recommended limits example:
# Development: $20/month
# Production: $100/month with alerts at 80%

# Email alerts at 50%, 80%, 100% of limit`,
      estimateTitle: 'Cost estimation per task',
      colTask: 'Typical task',
      colTokens: 'Estimated tokens',
      tableRows: [
        { task: 'Fix a simple bug',             tokens: '2K–5K',     cost: '~$0.02' },
        { task: 'Add a small feature',           tokens: '5K–15K',    cost: '~$0.05' },
        { task: 'Refactor a medium module',      tokens: '15K–40K',   cost: '~$0.15' },
        { task: 'Complex feature with tests',    tokens: '40K–100K',  cost: '~$0.40' },
        { task: 'Full codebase review',          tokens: '100K–200K', cost: '~$1.00' },
      ],
      warnBox: (
        <>
          The costs above are estimates for Sonnet 5 without caching. With prompt caching active, the real cost drops by <strong>30–60%</strong> for long sessions with a consistent CLAUDE.md.
        </>
      ),
      bestTitle: 'Final best practices',
      bestItems: [
        { text: 'Use Haiku 4.5 for simple tasks: grep, summaries, quick questions',     color: 'text-green-400' },
        { text: 'Reserve Opus 4.8 for architecture and complex decisions',               color: 'text-purple-400' },
        { text: 'Run /compact proactively at ~60% context, do not wait for the warning', color: 'text-blue-400' },
        { text: 'Keep CLAUDE.md concise — every line is added to every request',         color: 'text-amber-400' },
        { text: 'Batch similar tasks in the same session to amortize cache write cost',  color: 'text-green-400' },
        { text: 'Avoid asking for explanations when not needed: "fix only, no explanation"', color: 'text-blue-400' },
      ],
    },
  },
} as const

type StrategyIcon = 'scissors' | 'archive' | 'file' | 'coins'

function StrategyIconEl({ icon, className }: { icon: StrategyIcon; className: string }) {
  if (icon === 'scissors') return <Scissors className={className} />
  if (icon === 'archive')  return <Archive className={className} />
  if (icon === 'coins')    return <Coins className={className} />
  return <FileText className={className} />
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-6 text-2xl font-bold text-white">{children}</h2>
  )
}

function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 flex gap-3 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 text-sm text-blue-300">
      <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-400" />
      <div>{children}</div>
    </div>
  )
}

function WarnBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 flex gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-amber-300">
      <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-400" />
      <div>{children}</div>
    </div>
  )
}

function TipBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 flex gap-3 rounded-xl border border-green-500/20 bg-green-500/5 p-4 text-sm text-green-300">
      <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-400" />
      <div>{children}</div>
    </div>
  )
}

function TabBazele() {
  const { lang } = useApp()
  const c = CONTENT[lang].bazele
  const statColors = [
    { color: 'border-purple-500/30 bg-purple-500/5', tc: 'text-purple-400' },
    { color: 'border-blue-500/30 bg-blue-500/5',     tc: 'text-blue-400' },
    { color: 'border-green-500/30 bg-green-500/5',   tc: 'text-green-400' },
  ]
  const typeColors = [
    'border-blue-500/30 bg-blue-500/5 text-blue-300',
    'border-amber-500/30 bg-amber-500/5 text-amber-300',
    'border-green-500/30 bg-green-500/5 text-green-300',
    'border-purple-500/30 bg-purple-500/5 text-purple-300',
  ]
  return (
    <div>
      <SectionTitle>{c.title}</SectionTitle>
      <p className="mb-6 text-zinc-400 leading-relaxed">{c.intro}</p>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {c.stats.map((s, i) => (
          <div key={s.label} className={`rounded-xl border ${statColors[i].color} p-4 text-center`}>
            <div className={`text-2xl font-bold ${statColors[i].tc}`}>{s.label}</div>
            <div className="text-sm text-zinc-500 mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      <h3 className="mb-3 text-lg font-semibold text-white">{c.typesTitle}</h3>
      <div className="mb-6 space-y-3">
        {c.types.map((t, i) => (
          <div key={t.tip} className={`rounded-xl border ${typeColors[i]} p-4`}>
            <div className="font-semibold mb-1">{t.tip}</div>
            <div className="text-sm opacity-80">{t.desc}</div>
          </div>
        ))}
      </div>

      <InfoBox>{c.infoBox}</InfoBox>

      <h3 className="mb-3 text-lg font-semibold text-white">{c.countTitle}</h3>
      <CodeBlock code={c.countCode} />
    </div>
  )
}

function TabContext() {
  const { lang } = useApp()
  const c = CONTENT[lang].context
  return (
    <div>
      <SectionTitle>{c.title}</SectionTitle>
      <p className="mb-6 text-zinc-400 leading-relaxed">{c.intro}</p>

      <div className="mb-8 overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/50">
              <th className="px-4 py-3 text-left font-semibold text-zinc-300">Model</th>
              <th className="px-4 py-3 text-left font-semibold text-zinc-300">Context</th>
              <th className="px-4 py-3 text-left font-semibold text-zinc-300">Output max</th>
              <th className="px-4 py-3 text-left font-semibold text-zinc-300">{c.colEquivalent}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {c.tableRows.map((r) => (
              <tr key={r.model} className="bg-zinc-950 hover:bg-zinc-900/40 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-amber-400">{r.model}</td>
                <td className="px-4 py-3 text-zinc-300">{r.ctx} {c.tokensSuffix}</td>
                <td className="px-4 py-3 text-zinc-300">{r.out} {c.tokensSuffix}</td>
                <td className="px-4 py-3 text-zinc-500">{r.eq}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="mb-3 text-lg font-semibold text-white">{c.fillTitle}</h3>
      <div className="mb-6 space-y-2">
        {c.fillItems.map((r) => (
          <div key={r.item} className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/30 px-4 py-2.5">
            <span className="text-sm text-zinc-300">{r.item}</span>
            <span className={`text-xs font-semibold ${r.color}`}>{r.impact}</span>
          </div>
        ))}
      </div>

      <WarnBox>{c.warnBox}</WarnBox>

      <h3 className="mb-3 text-lg font-semibold text-white">{c.viewTitle}</h3>
      <CodeBlock code={c.viewCode} />
    </div>
  )
}

function TabEconomii() {
  const { lang } = useApp()
  const c = CONTENT[lang].economii
  return (
    <div>
      <SectionTitle>{c.title}</SectionTitle>
      <p className="mb-6 text-zinc-400 leading-relaxed">{c.intro}</p>

      <div className="mb-8 space-y-6">
        {c.strategies.map((s) => (
          <div key={s.num} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
            <div className="mb-3 flex items-center gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-400">{s.num}</span>
              <div className={s.colorIcon}>
                <StrategyIconEl icon={s.icon} className={s.iconClass} />
              </div>
              <div>
                <h3 className="font-bold text-white">{s.title}</h3>
                <p className="text-xs text-zinc-500">{s.subtitle}</p>
              </div>
            </div>
            <p className="mb-3 text-sm text-zinc-400">{s.body}</p>
            <CodeBlock code={s.code} />
          </div>
        ))}
      </div>

      <TipBox>{c.tipBox}</TipBox>
    </div>
  )
}

function TabCaching() {
  const { lang } = useApp()
  const c = CONTENT[lang].caching
  const statValues = ['~10%', '5 min']
  const statValueColors = ['text-white', 'text-white']
  return (
    <div>
      <SectionTitle>{c.title}</SectionTitle>
      <p className="mb-6 text-zinc-400 leading-relaxed">{c.intro}</p>

      <InfoBox>{c.infoBox}</InfoBox>

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4">
          <div className="mb-2 text-sm font-semibold text-green-400">{c.stats[0].label}</div>
          <div className={`text-3xl font-bold ${statValueColors[0]} mb-1`}>{statValues[0]}</div>
          <div className="text-xs text-zinc-500">{c.stats[0].sub}</div>
        </div>
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
          <div className="mb-2 text-sm font-semibold text-amber-400">{c.stats[1].label}</div>
          <div className={`text-3xl font-bold ${statValueColors[1]} mb-1`}>{statValues[1]}</div>
          <div className="text-xs text-zinc-500">{c.stats[1].sub}</div>
        </div>
      </div>

      <h3 className="mb-3 text-lg font-semibold text-white">{c.howTitle}</h3>
      <div className="mb-6 space-y-3 text-sm text-zinc-400">
        {c.steps.map((step, i) => (
          <div key={i} className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold">{i + 1}</span>
            <p>{step}</p>
          </div>
        ))}
      </div>

      <h3 className="mb-3 text-lg font-semibold text-white">{c.whatTitle}</h3>
      <div className="mb-6 space-y-2">
        {c.cacheItems.map((r) => (
          <div key={r.item} className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/30 px-4 py-2.5">
            <span className="text-sm text-zinc-300">{r.item}</span>
            <span className={`text-xs font-semibold ${r.cached ? 'text-green-400' : 'text-zinc-500'}`}>
              {r.cached ? c.cachedLabel : c.notCachedLabel}
            </span>
          </div>
        ))}
      </div>

      <h3 className="mb-3 text-lg font-semibold text-white">{c.manualTitle}</h3>
      <p className="mb-3 text-sm text-zinc-400">{c.manualIntro}</p>
      <CodeBlock code={c.manualCode} />

      <TipBox>{c.tipBox}</TipBox>
    </div>
  )
}

function TabMonitorizare() {
  const { lang } = useApp()
  const c = CONTENT[lang].monitorizare
  return (
    <div>
      <SectionTitle>{c.title}</SectionTitle>
      <p className="mb-6 text-zinc-400 leading-relaxed">{c.intro}</p>

      <h3 className="mb-3 text-lg font-semibold text-white">Anthropic Console — Usage Dashboard</h3>
      <p className="mb-4 text-sm text-zinc-400" dangerouslySetInnerHTML={{ __html: c.consoleIntro }} />
      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        {c.consoleItems.map((item) => (
          <div key={item} className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/30 px-3 py-2.5 text-sm text-zinc-300">
            <CheckCircle className="h-3.5 w-3.5 flex-shrink-0 text-green-400" />
            {item}
          </div>
        ))}
      </div>

      <h3 className="mb-3 text-lg font-semibold text-white">{c.limitsTitle}</h3>
      <CodeBlock code={c.limitsCode} />

      <h3 className="mt-6 mb-3 text-lg font-semibold text-white">{c.estimateTitle}</h3>
      <div className="mb-6 overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/50">
              <th className="px-4 py-3 text-left font-semibold text-zinc-300">{c.colTask}</th>
              <th className="px-4 py-3 text-left font-semibold text-zinc-300">{c.colTokens}</th>
              <th className="px-4 py-3 text-left font-semibold text-zinc-300">Cost Sonnet 5</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {c.tableRows.map((r) => (
              <tr key={r.task} className="bg-zinc-950 hover:bg-zinc-900/40 transition-colors">
                <td className="px-4 py-3 text-zinc-300">{r.task}</td>
                <td className="px-4 py-3 text-zinc-500 font-mono text-xs">{r.tokens}</td>
                <td className="px-4 py-3 text-amber-400 font-semibold">{r.cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <WarnBox>{c.warnBox}</WarnBox>

      <h3 className="mb-3 text-lg font-semibold text-white">{c.bestTitle}</h3>
      <div className="space-y-2">
        {c.bestItems.map((b) => (
          <div key={b.text} className="flex items-start gap-2 rounded-lg border border-zinc-800 bg-zinc-900/30 px-4 py-3 text-sm">
            <CheckCircle className={`mt-0.5 h-3.5 w-3.5 flex-shrink-0 ${b.color}`} />
            <span className="text-zinc-300">{b.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function TokenManagement() {
  const [activeTab, setActiveTab] = useState<TabId>('bazele')
  const { lang } = useApp()
  const c = CONTENT[lang]

  const renderTab = () => {
    switch (activeTab) {
      case 'bazele':       return <TabBazele />
      case 'context':      return <TabContext />
      case 'economii':     return <TabEconomii />
      case 'caching':      return <TabCaching />
      case 'monitorizare': return <TabMonitorizare />
    }
  }

  const statColors = [
    { color: 'text-purple-400', border: 'border-purple-500/20 bg-purple-500/5' },
    { color: 'text-green-400',  border: 'border-green-500/20 bg-green-500/5' },
    { color: 'text-blue-400',   border: 'border-blue-500/20 bg-blue-500/5' },
    { color: 'text-amber-400',  border: 'border-amber-500/20 bg-amber-500/5' },
  ]

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      {/* Header */}
      <div className="mb-10">
        <div className="mb-3 flex items-center gap-3">
          <div className="rounded-xl bg-amber-500/10 p-2.5">
            <Coins className="h-6 w-6 text-amber-400" />
          </div>
          <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
            {c.badge}
          </span>
        </div>
        <h1 className="mb-3 text-4xl font-bold text-white">
          {c.title}
        </h1>
        <p className="max-w-2xl text-lg text-zinc-400 leading-relaxed">
          {c.description}
        </p>
      </div>

      {/* Key numbers strip */}
      <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {c.stats.map((s, i) => (
          <div key={s.value} className={`rounded-xl border ${statColors[i].border} p-4`}>
            <div className={`text-2xl font-bold ${statColors[i].color}`}>{s.value}</div>
            <div className="mt-0.5 text-sm font-medium text-zinc-300">{s.label}</div>
            <div className="mt-0.5 text-xs text-zinc-600">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Tabs — sticky below fixed navbar, horizontal scroll on mobile */}
      <div className="sticky top-16 z-10 -mx-6 mb-0 bg-zinc-950/95 px-6 pb-3 pt-3 backdrop-blur-sm border-b border-zinc-800/60">
        <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:text-zinc-300'
              }`}
            >
              {tab.icon}
              {c.tabLabels[tab.id]}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950/50 p-6 sm:p-8">
        {renderTab()}
      </div>
    </div>
  )
}
