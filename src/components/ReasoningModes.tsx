import { useState, useEffect, useRef } from 'react'
import {
  Brain, Zap, Flame, Cpu, BookOpen, Code2, Lightbulb, Settings,
  AlertTriangle, CheckCircle, XCircle, ArrowRight, GitBranch, Info,
} from 'lucide-react'
import { CodeBlock } from './CodeBlock'
import { useApp } from '../contexts/AppContext'

type TabId = 'moduri' | 'exemple' | 'api' | 'strategii'

interface Tab { id: TabId; label: string; icon: React.ReactNode }

// ── CONTENT ────────────────────────────────────────────────────────────────
// Modelul actual (sept. 2026): adaptive thinking + effort. Claude Code recunoaște
// un singur keyword (ultrathink); think / megathink sunt text obișnuit.

const CONTENT = {
  ro: {
    badge: 'Adaptive Thinking & Effort',
    title: 'Moduri de Raționament',
    desc: 'Modelele actuale gândesc adaptiv — decid singure cât raționează. Tu controlezi adâncimea prin nivelul de effort (/effort) și, pentru o singură tură, prin keyword-ul ultrathink. Cum le alegi, cum le folosești în API și când să le eviți.',
    stats: [
      { value: '5',       label: 'niveluri effort',   sub: 'low / medium / high / xhigh / max',     color: 'text-purple-400', border: 'border-purple-500/20 bg-purple-500/5' },
      { value: 'medium',  label: 'effort implicit',   sub: 'Opus 5.5 — default în Claude Code',     color: 'text-amber-400',  border: 'border-amber-500/20 bg-amber-500/5' },
      { value: '1',       label: 'keyword recunoscut', sub: 'ultrathink — restul e text normal',    color: 'text-blue-400',   border: 'border-blue-500/20 bg-blue-500/5' },
      { value: 'adaptiv', label: 'thinking',          sub: 'modelul decide singur cât gândește',    color: 'text-green-400',  border: 'border-green-500/20 bg-green-500/5' },
    ],
    tabLabels: {
      moduri:    'Moduri',
      exemple:   'Exemple',
      api:       'API',
      strategii: 'Strategii',
    },
    tab1: {
      heading: 'Cum controlezi raționamentul în Claude Code',
      intro: 'Modelele actuale folosesc ',
      introAccent: 'adaptive thinking',
      introEnd: ': nu mai aloci un buget fix de tokeni — modelul decide singur cât gândește, iar tu îi setezi nivelul de efort. Ai trei pârghii: effort-ul sesiunii (/effort), keyword-ul ultrathink pentru o singură tură și alegerea modelului.',
      infoBox: 'Tokenii de gândire se facturează ca output, chiar dacă nu apar în răspuns. Effort mai mare = mai mult raționament, mai multe tool call-uri, cost și latență mai mari. Pe Opus 5.5 și Fable 5.1 thinking-ul nu se poate dezactiva — effort-ul e singurul control.',
      budgetBarLabel: 'Scara de effort (adâncime relativă)',
      budgetNote: '* Niveluri relative, nu bugete fixe de tokeni. Dacă un model nu suportă nivelul ales, Claude Code coboară la cel mai apropiat nivel inferior (ex. xhigh → high pe Opus 4.6).',
      effortBars: [
        { level: 'low',    sub: 'rapid, concis',               pct: 15 },
        { level: 'medium', sub: 'default Opus 5.5',            pct: 35 },
        { level: 'high',   sub: 'default Sonnet 5 · Fable 5.1', pct: 60 },
        { level: 'xhigh',  sub: 'coding complex, agentic',     pct: 80 },
        { level: 'max',    sub: 'fără plafon — atenție',       pct: 100 },
      ],
      setTitle: 'Cum setezi effort-ul',
      setCode: `# În sesiune
> /effort              # slider interactiv
> /effort xhigh        # setare directă
> /effort auto         # revine la default-ul modelului

# La pornire (doar pentru sesiunea lansată)
claude --effort high

# Global — suprascrie /effort și settings
export CLAUDE_CODE_EFFORT_LEVEL=high

# .claude/settings.json
{
  "effortLevel": "medium",
  "modelSettings": { "opus": { "effort": "high" } }
}

# Frontmatter în skill / subagent
---
effort: high
---`,
      comparisonTitle: 'Comparație completă',
      tableHeader: 'Criteriu',
      tableRows: [
        { label: 'Aplicare',          v: ['Toată sesiunea', 'Toată sesiunea', 'O singură tură'] },
        { label: 'Cum activezi',      v: ['/effort medium', '/effort xhigh', 'ultrathink în prompt'] },
        { label: 'Timp răspuns',      v: ['Rapid', 'Moderat', 'Lent'] },
        { label: 'Cost relativ',      v: ['Bază', 'Ridicat', 'Ridicat, dar punctual'] },
        { label: 'Adâncime analiză',  v: ['Suficientă', 'Extinsă', 'Maximă pe tură'] },
        { label: 'Tool calls',        v: ['Puține, consolidate', 'Multe, cu verificări', 'Cât e nevoie'] },
        { label: 'Utilizare zilnică', v: ['Frecvent', 'Sesiuni grele', 'Rar, țintit'] },
      ],
      cardLabels: { scope: 'Aplicare', speed: 'Viteză', extraCost: 'Cost', idealFor: 'Ideal pentru' },
    },
    tab2: {
      heading: 'Exemple reale de utilizare',
      intro: 'Alegerea nivelului corect depinde de complexitatea problemei, nu de preferință. Iată scenarii concrete cu justificarea alegerii.',
      contextLabel: 'Context',
      promptLabel: 'Prompt folosit',
      whyPrefix: 'De ce ',
      chainingTitle: 'Ajustare progresivă a efortului',
      chainingDesc: 'Pornești cu ',
      chainingMid: ' pentru explorare, urci la ',
      chainingEnd: ' când problema devine grea, sau folosești ',
      chainingFinal: ' pentru o singură decizie critică — fără să rămâi blocat pe un nivel scump.',
      chainingCode: `# Pasul 1 — explorare ieftină (default Opus 5.5)
> /effort medium
> Explică arhitectura modulului de auth
  și identifică potențialele puncte slabe.

# Pasul 2 — problema e grea: urci effort-ul
> /effort xhigh
> Acum că știm că problema e în token refresh,
  implementează o soluție robustă pentru
  race condition-ul identificat.

# Pasul 3 — o decizie critică, o singură tură
> ultrathink Soluția de mai sus are impact pe
  mobile clients. Redesenează să fie
  backwards compatible cu clienții v1.

# Revii la nivelul economic pentru rutină
> /effort medium`,
      chainingInfo: 'Contextul conversației se păstrează când schimbi effort-ul. Schimbarea poate invalida prompt cache-ul — Claude Code te avertizează când se întâmplă. ultrathink nu modifică setarea sesiunii.',
    },
    tab3: {
      heading: 'Thinking și effort în Anthropic API',
      intro: 'În Claude Code, ',
      introAccent: '/effort și ultrathink',
      introMid: ' sunt comenzi de interfață. În API, adâncimea o controlezi prin output_config.effort, iar modul de gândire prin parametrul ',
      introEnd: '. Pe modelele actuale thinking-ul e adaptiv — modelul decide singur cât gândește.',
      basicTitle: 'Configurare de bază (adaptive thinking + effort)',
      basicCode: `import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

const response = await client.messages.create({
  model: 'claude-opus-5-5',
  max_tokens: 16000,
  // Opus 5.5 / Fable 5.1: thinking e mereu activ — poți omite parametrul.
  // display: 'summarized' → primești un rezumat (implicit textul vine gol)
  thinking: { type: 'adaptive', display: 'summarized' },
  output_config: { effort: 'high' },  // low | medium (default) | high | xhigh | max
  messages: [
    {
      role: 'user',
      content: 'Refactorizează această funcție pentru early returns: ...',
    },
  ],
})

// ⚠️ { type: 'disabled' } → 400 pe Opus 5.5 și Fable 5.1
// ⚠️ Stilul vechi { type: 'enabled', budget_tokens: N } → 400
//    pe toate modelele actuale, cu excepția Haiku 4.5.

// Răspunsul conține blocuri separate: thinking + text
for (const block of response.content) {
  if (block.type === 'thinking') {
    console.log('Rezumat gândire:', block.thinking)
  }
  if (block.type === 'text') {
    console.log('Răspuns final:', block.text)
  }
}`,
      budgetTitle: 'Claude Code → echivalent API',
      budgetNote: '* budget_tokens (thinking clasic) mai funcționează pe Haiku 4.5 și, ca tranziție, pe Opus 4.6 / Sonnet 4.6. Pe Sonnet 5, Opus 4.7+, Opus 5 / 5.5 și Fable 5 / 5.1 returnează 400.',
      budgetTableHeaders: ['În Claude Code', 'Echivalent API', 'Notă'],
      budgetRows: [
        { kw: '/effort medium', api: "effort: 'medium'",        note: 'Default pe Opus 5.5' },
        { kw: '/effort xhigh',  api: "effort: 'xhigh'",         note: 'Recomandat pentru coding și agenți' },
        { kw: 'ultrathink',     api: 'instrucțiune în prompt',  note: 'Doar tura curentă; effort-ul rămâne neschimbat' },
      ],
      streamingTitle: 'Streaming cu adaptive thinking',
      streamingCode: `const stream = client.messages.stream({
  model: 'claude-sonnet-5',
  max_tokens: 16000,
  // display: 'summarized' — altfel textul thinking vine gol
  thinking: { type: 'adaptive', display: 'summarized' },
  messages: [{ role: 'user', content: promptul }],
})

for await (const event of stream) {
  if (event.type === 'content_block_start') {
    if (event.content_block.type === 'thinking') {
      process.stdout.write('\\n[Gândire...] ')
    }
  }
  if (event.type === 'content_block_delta') {
    if (event.delta.type === 'thinking_delta') {
      // Afișează progresul gândirii (opțional)
      process.stdout.write('.')
    }
    if (event.delta.type === 'text_delta') {
      process.stdout.write(event.delta.text)
    }
  }
}`,
      multiTitle: 'Multi-turn — păstrarea blocurilor de gândire',
      multiDesc: 'Într-o conversație multi-turn, trimite înapoi blocurile ',
      multiEnd: ' exact cum le-ai primit — adaugă tot response.content, nu doar textul. Pe Opus 5.5 și Fable 5.1 blocurile sunt legate de model și de conversație ("preserved thinking").',
      multiCode: `// Primul turn
const turn1 = await client.messages.create({
  model: 'claude-opus-5-5',
  max_tokens: 16000,
  messages: [{ role: 'user', content: 'Analizează arhitectura...' }],
})

// Al doilea turn — include TOATE blocurile din turn1
const turn2 = await client.messages.create({
  model: 'claude-opus-5-5',
  max_tokens: 16000,
  messages: [
    { role: 'user',      content: 'Analizează arhitectura...' },
    { role: 'assistant', content: turn1.content }, // ← include thinking blocks
    { role: 'user',      content: 'Acum implementează soluția propusă.' },
  ],
})`,
      warnPrefix: 'Blocurile ',
      warnBox: ' din istoric nu se modifică și nu se reordonează. Tratează conversația ca append-only — altfel riști ',
      warnEnd: '.',
      compatTitle: 'Compatibilitate modele',
      compatModels: [
        { model: 'claude-fable-5-1',  ok: true, note: 'Thinking mereu activ · effort low→max (default high) · cel mai capabil' },
        { model: 'claude-opus-5-5',   ok: true, note: 'Thinking mereu activ · effort default medium · default în Claude Code' },
        { model: 'claude-sonnet-5',   ok: true, note: 'Adaptive implicit, se poate dezactiva · effort default high' },
        { model: 'claude-haiku-4-5',  ok: true, note: 'Doar stilul clasic: enabled + budget_tokens, fără effort' },
      ],
    },
    tab4: {
      heading: 'Strategii de utilizare',
      intro: 'Effort-ul nu face un prompt prost să devină bun. Structura și contextul din prompt rămân esențiale — raționamentul extins amplifică un prompt bun, nu suplinește un prompt vag.',
      decisionTitle: 'Ghid de decizie rapidă',
      decisions: [
        { q: 'Task clar, izolat într-un fișier, vrei răspuns rapid?',      a: '/effort low',                  color: 'border-zinc-700 bg-zinc-800/40',       ac: 'text-zinc-300' },
        { q: 'Development zilnic: feature-uri, bugfix-uri, teste?',          a: '/effort medium (default)',     color: 'border-blue-500/20 bg-blue-500/5',     ac: 'text-blue-400 font-bold' },
        { q: 'Cauza nu e evidentă sau implică multe fișiere?',               a: '/effort high · xhigh',         color: 'border-purple-500/20 bg-purple-500/5', ac: 'text-purple-400 font-bold' },
        { q: 'O singură decizie critică într-o sesiune altfel ușoară?',      a: 'ultrathink',                   color: 'border-amber-500/20 bg-amber-500/5',   ac: 'text-amber-400 font-bold' },
        { q: 'Problemă la care Opus eșuează, sesiune agentică de ore?',      a: '/model fable + /effort xhigh', color: 'border-rose-500/20 bg-rose-500/5',     ac: 'text-rose-400 font-bold' },
      ],
      promptingTitle: 'Cum să scrii prompturi eficiente cu raționament extins',
      promptingItems: [
        {
          label: 'Specifică constrângerile explicit',
          code: `# Bine — Claude știe ce NU poate schimba
> /effort xhigh
> Refactorizează AuthService fără a schimba
  interfața publică (metode publice și tipurile
  lor). Backwards compatibility e obligatorie —
  există 3 consumatori externi.`,
        },
        {
          label: 'Dă context despre ce ai încercat deja',
          code: `# Bine — evită să reparcurgă direcții moarte
> Am încercat să măresc timeout-ul la 30s și
  să adaug retry logic, dar testele tot eșuează
  intermitent. Problema pare în ordinea de
  teardown. Investighează altă direcție.`,
        },
        {
          label: 'Cere explicit documentarea deciziilor',
          code: `# Util cu ultrathink — vrei să înțelegi
> ultrathink Implementează soluția și pentru
  fiecare decizie de design majoră, explică
  alternativele considerate și de ce ai ales
  această abordare.`,
        },
      ],
      antiTitle: 'Anti-patternuri comune',
      antiPatterns: [
        { bad: 'effort max sau ultrathink pe orice prompt', fix: 'max e predispus la overthinking și costă mult. Pe Opus 5.5, medium rezolvă majoritatea task-urilor zilnice — urcă doar când vezi că e nevoie.' },
        { bad: 'Scrii "think hard" sau "megathink" crezând că activează ceva', fix: 'Claude Code recunoaște doar ultrathink. Restul e text obișnuit — folosește /effort pentru a schimba adâncimea pe sesiune.' },
        { bad: 'Prompt vag + effort mare, în speranța că "va fi mai bun"', fix: 'Raționamentul extins nu compensează lipsa de context. Un prompt specific pe medium bate un prompt vag pe max.' },
        { bad: 'Rămâi pe xhigh după ce ai rezolvat partea grea', fix: 'Revino la /effort medium pentru implementarea de rutină — plătești mai puțin pentru aceeași calitate pe task-uri simple.' },
      ],
      checklistTitle: 'Checklist înainte de a urca effort-ul',
      checklist: [
        'Am specificat fișierele și contextul relevant în prompt?',
        'Am menționat constrângerile (ce NU poate fi schimbat)?',
        'Am indicat ce am încercat deja, dacă e un debugging task?',
        'Complexitatea problemei justifică costul și timpul în plus?',
        'Am ales nivelul minim suficient, nu cel maxim disponibil?',
      ],
    },
    modes: [
      {
        tagline: 'Nivelul zilnic — rapid și economic',
        description: 'Default-ul Claude Opus 5.5 în Claude Code. Modelul gândește adaptiv, dar rămâne concis: mai puține tool call-uri, răspunsuri directe, cost redus. Pentru task-uri triviale poți coborî la low.',
        useCases: [
          'Feature-uri și bugfix-uri obișnuite',
          'Generare de teste unitare',
          'Explicarea unui bloc de cod',
          'Bug cu stack trace explicit',
          'Refactorizări cu logică clară',
        ],
      },
      {
        tagline: 'Raționament extins pe toată sesiunea',
        description: 'Claude explorează mai multe ipoteze, verifică mai atent și face mai multe tool call-uri înainte să tragă concluzii. high e default pe Sonnet 5 și Fable 5.1; xhigh e recomandat pentru coding complex și sesiuni agentice lungi.',
        useCases: [
          'Debugging multi-fișier cu cauze necunoscute',
          'Design de API-uri cu constrângeri de compatibilitate',
          'Migrări de scheme de baze de date',
          'Optimizări de performanță (profiling + fix)',
          'Code review cu impact de securitate',
        ],
      },
      {
        tagline: 'O tură la adâncime maximă — pentru decizii critice',
        description: 'Keyword în prompt: Claude Code îl recunoaște și adaugă o instrucțiune de raționament mai profund doar pentru acea tură, fără să schimbe effort-ul sesiunii. E singurul keyword recunoscut — "think", "think hard" sau "megathink" sunt text obișnuit.',
        useCases: [
          'Decizie de arhitectură într-o sesiune altfel ușoară',
          'Migrare între framework-uri majore',
          'Bug critic de producție fără reproducere',
          'Algoritm de complexitate ridicată',
          'Security audit al unui modul critic',
        ],
      },
    ],
    scenarios: [
      {
        title: 'Refactorizare cu early returns',
        context: 'Funcție de 40 de linii cu if/else adânc imbricat. Logica e clară, vrei cod mai lizibil.',
        why: 'Problema e bine definită, fișierul e izolat. Default-ul medium e suficient — nu plătești raționament de care nu ai nevoie.',
      },
      {
        title: 'Debugging intermittent CI failure',
        context: 'Testele de integrare eșuează în ~30% din rulări pe CI, trec mereu local. Nu ai stack trace consistent.',
        why: 'Cauză necunoscută, mai multe ipoteze, explorare pe mai multe ture. xhigh pe toată sesiunea evaluează sistematic fiecare direcție.',
      },
      {
        title: 'Migrare Stripe API v2 → v3',
        context: 'Modul de plăți critic în producție, trebuie migrat la Stripe v3 fără downtime. Webhook-urile existente trebuie să rămână funcționale.',
        why: 'O decizie de strategie cu impact de producție. ultrathink pe tura de planificare, apoi implementarea pe effort-ul normal.',
      },
      {
        title: 'Security audit modul de autentificare',
        context: 'Modul de auth implementat acum 2 ani, niciodată auditat. Vrei să identifici vulnerabilități înainte de un pentest extern.',
        why: 'Domeniu cu impact ridicat de securitate. ultrathink asigură că nicio clasă de vulnerabilitate nu e omisă în analiza inițială.',
      },
    ],
  },
  en: {
    badge: 'Adaptive Thinking & Effort',
    title: 'Reasoning Modes',
    desc: 'Current models think adaptively — they decide on their own how much to reason. You control depth through the effort level (/effort) and, for a single turn, the ultrathink keyword. How to choose, how to use them in the API, and when to avoid them.',
    stats: [
      { value: '5',        label: 'effort levels',     sub: 'low / medium / high / xhigh / max',   color: 'text-purple-400', border: 'border-purple-500/20 bg-purple-500/5' },
      { value: 'medium',   label: 'default effort',    sub: 'Opus 5.5 — Claude Code default',      color: 'text-amber-400',  border: 'border-amber-500/20 bg-amber-500/5' },
      { value: '1',        label: 'recognized keyword', sub: 'ultrathink — the rest is plain text', color: 'text-blue-400',   border: 'border-blue-500/20 bg-blue-500/5' },
      { value: 'adaptive', label: 'thinking',          sub: 'the model decides how much to think', color: 'text-green-400',  border: 'border-green-500/20 bg-green-500/5' },
    ],
    tabLabels: {
      moduri:    'Modes',
      exemple:   'Examples',
      api:       'API',
      strategii: 'Strategies',
    },
    tab1: {
      heading: 'How you control reasoning in Claude Code',
      intro: 'Current models use ',
      introAccent: 'adaptive thinking',
      introEnd: ': you no longer allocate a fixed token budget — the model decides how much to think, and you set its effort level. You have three levers: session effort (/effort), the ultrathink keyword for a single turn, and your choice of model.',
      infoBox: 'Thinking tokens are billed as output, even though they do not appear in the response. Higher effort = more reasoning, more tool calls, higher cost and latency. On Opus 5.5 and Fable 5.1 thinking cannot be disabled — effort is the only control.',
      budgetBarLabel: 'Effort scale (relative depth)',
      budgetNote: '* Relative levels, not fixed token budgets. If a model does not support the chosen level, Claude Code falls back to the nearest lower level (e.g. xhigh → high on Opus 4.6).',
      effortBars: [
        { level: 'low',    sub: 'fast, concise',               pct: 15 },
        { level: 'medium', sub: 'Opus 5.5 default',            pct: 35 },
        { level: 'high',   sub: 'Sonnet 5 · Fable 5.1 default', pct: 60 },
        { level: 'xhigh',  sub: 'complex coding, agentic',     pct: 80 },
        { level: 'max',    sub: 'no ceiling — careful',        pct: 100 },
      ],
      setTitle: 'How to set effort',
      setCode: `# In a session
> /effort              # interactive slider
> /effort xhigh        # set directly
> /effort auto         # back to the model default

# At startup (only for that session)
claude --effort high

# Global — overrides /effort and settings
export CLAUDE_CODE_EFFORT_LEVEL=high

# .claude/settings.json
{
  "effortLevel": "medium",
  "modelSettings": { "opus": { "effort": "high" } }
}

# Skill / subagent frontmatter
---
effort: high
---`,
      comparisonTitle: 'Full comparison',
      tableHeader: 'Criterion',
      tableRows: [
        { label: 'Scope',           v: ['Whole session', 'Whole session', 'A single turn'] },
        { label: 'How to enable',   v: ['/effort medium', '/effort xhigh', 'ultrathink in prompt'] },
        { label: 'Response time',   v: ['Fast', 'Moderate', 'Slow'] },
        { label: 'Relative cost',   v: ['Baseline', 'High', 'High, but targeted'] },
        { label: 'Analysis depth',  v: ['Sufficient', 'Extended', 'Maximum for the turn'] },
        { label: 'Tool calls',      v: ['Few, consolidated', 'Many, with checks', 'As needed'] },
        { label: 'Daily usage',     v: ['Frequent', 'Hard sessions', 'Rare, targeted'] },
      ],
      cardLabels: { scope: 'Scope', speed: 'Speed', extraCost: 'Cost', idealFor: 'Ideal for' },
    },
    tab2: {
      heading: 'Real-world usage examples',
      intro: 'Choosing the right level depends on problem complexity, not preference. Here are concrete scenarios with justification for the choice.',
      contextLabel: 'Context',
      promptLabel: 'Prompt used',
      whyPrefix: 'Why ',
      chainingTitle: 'Progressive effort adjustment',
      chainingDesc: 'Start with ',
      chainingMid: ' for exploration, move up to ',
      chainingEnd: ' when the problem gets hard, or use ',
      chainingFinal: ' for a single critical decision — without getting stuck on an expensive level.',
      chainingCode: `# Step 1 — cheap exploration (Opus 5.5 default)
> /effort medium
> Explain the architecture of the auth module
  and identify potential weak points.

# Step 2 — the problem is hard: raise effort
> /effort xhigh
> Now that we know the issue is in token refresh,
  implement a robust solution for the
  identified race condition.

# Step 3 — one critical decision, one turn
> ultrathink The solution above impacts mobile
  clients. Redesign it to be backwards
  compatible with v1 clients.

# Back to the economical level for routine work
> /effort medium`,
      chainingInfo: 'Conversation context is preserved when you change effort. The change may invalidate the prompt cache — Claude Code warns you when that happens. ultrathink does not change the session setting.',
    },
    tab3: {
      heading: 'Thinking and effort in the Anthropic API',
      intro: 'In Claude Code, ',
      introAccent: '/effort and ultrathink',
      introMid: ' are interface commands. In the API you control depth via output_config.effort, and the thinking mode via the ',
      introEnd: ' parameter. On current models thinking is adaptive — the model decides how much to think.',
      basicTitle: 'Basic configuration (adaptive thinking + effort)',
      basicCode: `import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

const response = await client.messages.create({
  model: 'claude-opus-5-5',
  max_tokens: 16000,
  // Opus 5.5 / Fable 5.1: thinking is always on — you can omit the parameter.
  // display: 'summarized' → you get a summary (by default the text is empty)
  thinking: { type: 'adaptive', display: 'summarized' },
  output_config: { effort: 'high' },  // low | medium (default) | high | xhigh | max
  messages: [
    {
      role: 'user',
      content: 'Refactor this function to use early returns: ...',
    },
  ],
})

// ⚠️ { type: 'disabled' } → 400 on Opus 5.5 and Fable 5.1
// ⚠️ The old { type: 'enabled', budget_tokens: N } style → 400
//    on every current model except Haiku 4.5.

// Response contains separate blocks: thinking + text
for (const block of response.content) {
  if (block.type === 'thinking') {
    console.log('Thinking summary:', block.thinking)
  }
  if (block.type === 'text') {
    console.log('Final response:', block.text)
  }
}`,
      budgetTitle: 'Claude Code → API equivalent',
      budgetNote: '* budget_tokens (classic thinking) still works on Haiku 4.5 and, transitionally, on Opus 4.6 / Sonnet 4.6. On Sonnet 5, Opus 4.7+, Opus 5 / 5.5 and Fable 5 / 5.1 it returns a 400.',
      budgetTableHeaders: ['In Claude Code', 'API equivalent', 'Note'],
      budgetRows: [
        { kw: '/effort medium', api: "effort: 'medium'",       note: 'Default on Opus 5.5' },
        { kw: '/effort xhigh',  api: "effort: 'xhigh'",        note: 'Recommended for coding and agents' },
        { kw: 'ultrathink',     api: 'instruction in prompt',  note: 'Current turn only; effort stays unchanged' },
      ],
      streamingTitle: 'Streaming with adaptive thinking',
      streamingCode: `const stream = client.messages.stream({
  model: 'claude-sonnet-5',
  max_tokens: 16000,
  // display: 'summarized' — otherwise thinking text comes back empty
  thinking: { type: 'adaptive', display: 'summarized' },
  messages: [{ role: 'user', content: thePrompt }],
})

for await (const event of stream) {
  if (event.type === 'content_block_start') {
    if (event.content_block.type === 'thinking') {
      process.stdout.write('\\n[Thinking...] ')
    }
  }
  if (event.type === 'content_block_delta') {
    if (event.delta.type === 'thinking_delta') {
      // Show thinking progress (optional)
      process.stdout.write('.')
    }
    if (event.delta.type === 'text_delta') {
      process.stdout.write(event.delta.text)
    }
  }
}`,
      multiTitle: 'Multi-turn — preserving thinking blocks',
      multiDesc: 'In a multi-turn conversation, send the ',
      multiEnd: ' blocks back exactly as you received them — append the whole response.content, not just the text. On Opus 5.5 and Fable 5.1 blocks are bound to the model and the conversation ("preserved thinking").',
      multiCode: `// First turn
const turn1 = await client.messages.create({
  model: 'claude-opus-5-5',
  max_tokens: 16000,
  messages: [{ role: 'user', content: 'Analyze the architecture...' }],
})

// Second turn — include ALL blocks from turn1
const turn2 = await client.messages.create({
  model: 'claude-opus-5-5',
  max_tokens: 16000,
  messages: [
    { role: 'user',      content: 'Analyze the architecture...' },
    { role: 'assistant', content: turn1.content }, // ← include thinking blocks
    { role: 'user',      content: 'Now implement the proposed solution.' },
  ],
})`,
      warnPrefix: 'The ',
      warnBox: ' blocks in history must not be edited or reordered. Treat the conversation as append-only — otherwise you risk ',
      warnEnd: '.',
      compatTitle: 'Model compatibility',
      compatModels: [
        { model: 'claude-fable-5-1',  ok: true, note: 'Thinking always on · effort low→max (default high) · most capable' },
        { model: 'claude-opus-5-5',   ok: true, note: 'Thinking always on · default effort medium · Claude Code default' },
        { model: 'claude-sonnet-5',   ok: true, note: 'Adaptive by default, can be disabled · default effort high' },
        { model: 'claude-haiku-4-5',  ok: true, note: 'Classic style only: enabled + budget_tokens, no effort' },
      ],
    },
    tab4: {
      heading: 'Usage strategies',
      intro: 'Effort does not turn a poor prompt into a good one. Structure and context in your prompt remain essential — extended reasoning amplifies a good prompt, it does not compensate for a vague one.',
      decisionTitle: 'Quick decision guide',
      decisions: [
        { q: 'Clear task, isolated to one file, you want a fast answer?',     a: '/effort low',                  color: 'border-zinc-700 bg-zinc-800/40',       ac: 'text-zinc-300' },
        { q: 'Everyday development: features, bugfixes, tests?',             a: '/effort medium (default)',     color: 'border-blue-500/20 bg-blue-500/5',     ac: 'text-blue-400 font-bold' },
        { q: 'Root cause is unclear or spans many files?',                   a: '/effort high · xhigh',         color: 'border-purple-500/20 bg-purple-500/5', ac: 'text-purple-400 font-bold' },
        { q: 'One critical decision in an otherwise light session?',         a: 'ultrathink',                   color: 'border-amber-500/20 bg-amber-500/5',   ac: 'text-amber-400 font-bold' },
        { q: 'A problem Opus fails on, or an hours-long agentic session?',   a: '/model fable + /effort xhigh', color: 'border-rose-500/20 bg-rose-500/5',     ac: 'text-rose-400 font-bold' },
      ],
      promptingTitle: 'How to write effective prompts with extended reasoning',
      promptingItems: [
        {
          label: 'Specify constraints explicitly',
          code: `# Good — Claude knows what it CANNOT change
> /effort xhigh
> Refactor AuthService without changing the
  public interface (public methods and their
  types). Backwards compatibility is required —
  there are 3 external consumers.`,
        },
        {
          label: 'Give context about what you already tried',
          code: `# Good — avoids revisiting dead ends
> I already tried increasing the timeout to 30s
  and adding retry logic, but tests still fail
  intermittently. The issue seems to be in the
  teardown order. Investigate a different angle.`,
        },
        {
          label: 'Explicitly ask for decision documentation',
          code: `# Useful with ultrathink — you want to understand
> ultrathink Implement the solution and for each
  major design decision, explain the alternatives
  considered and why you chose this approach.`,
        },
      ],
      antiTitle: 'Common anti-patterns',
      antiPatterns: [
        { bad: 'effort max or ultrathink on every prompt', fix: 'max is prone to overthinking and costs a lot. On Opus 5.5, medium handles most daily tasks — only go higher when you see it is needed.' },
        { bad: 'Writing "think hard" or "megathink" thinking it activates something', fix: 'Claude Code only recognizes ultrathink. The rest is plain text — use /effort to change depth for the session.' },
        { bad: 'Vague prompt + high effort, hoping it "will be better"', fix: 'Extended reasoning does not compensate for missing context. A specific prompt on medium beats a vague prompt on max.' },
        { bad: 'Staying on xhigh after the hard part is solved', fix: 'Go back to /effort medium for routine implementation — you pay less for the same quality on simple tasks.' },
      ],
      checklistTitle: 'Checklist before raising effort',
      checklist: [
        'Did I specify the relevant files and context in the prompt?',
        'Did I mention constraints (what CANNOT be changed)?',
        'Did I indicate what I already tried, if it is a debugging task?',
        'Does the problem complexity justify the extra cost and time?',
        'Did I choose the minimum sufficient level, not the maximum available?',
      ],
    },
    modes: [
      {
        tagline: 'The everyday level — fast and economical',
        description: "Claude Opus 5.5's default in Claude Code. The model thinks adaptively but stays concise: fewer tool calls, direct answers, lower cost. For trivial tasks you can drop to low.",
        useCases: [
          'Regular features and bugfixes',
          'Generating unit tests',
          'Explaining a code block',
          'Bug with an explicit stack trace',
          'Refactoring with clear logic',
        ],
      },
      {
        tagline: 'Extended reasoning for the whole session',
        description: 'Claude explores more hypotheses, checks more carefully and makes more tool calls before drawing conclusions. high is the default on Sonnet 5 and Fable 5.1; xhigh is recommended for complex coding and long agentic sessions.',
        useCases: [
          'Multi-file debugging with unknown root cause',
          'API design with compatibility constraints',
          'Database schema migrations',
          'Performance optimizations (profiling + fix)',
          'Code review with security impact',
        ],
      },
      {
        tagline: 'One turn at maximum depth — for critical decisions',
        description: 'A keyword in the prompt: Claude Code recognizes it and adds a deeper-reasoning instruction for that turn only, without changing the session effort. It is the only recognized keyword — "think", "think hard" or "megathink" are plain text.',
        useCases: [
          'Architecture decision in an otherwise light session',
          'Migration between major frameworks',
          'Critical production bug without reproduction',
          'High-complexity algorithm',
          'Security audit of a critical module',
        ],
      },
    ],
    scenarios: [
      {
        title: 'Refactoring with early returns',
        context: 'A 40-line function with deeply nested if/else. The logic is clear, you want more readable code.',
        why: 'The problem is well-defined and the file is isolated. The medium default is enough — you do not pay for reasoning you do not need.',
      },
      {
        title: 'Debugging intermittent CI failure',
        context: 'Integration tests fail in ~30% of CI runs but always pass locally. No consistent stack trace.',
        why: 'Unknown root cause, multiple hypotheses, exploration over several turns. xhigh for the whole session evaluates each direction systematically.',
      },
      {
        title: 'Stripe API v2 → v3 migration',
        context: 'Critical payments module in production, must be migrated to Stripe v3 with zero downtime. Existing webhooks must remain functional.',
        why: 'A strategy decision with production impact. ultrathink on the planning turn, then implementation at the normal effort level.',
      },
      {
        title: 'Authentication module security audit',
        context: 'Auth module implemented 2 years ago, never audited. You want to identify vulnerabilities before an external pentest.',
        why: 'High-impact security domain. ultrathink makes sure no vulnerability class is missed in the initial analysis.',
      },
    ],
  },
} as const

// ── Static mode metadata (language-independent) ────────────────────────────

type ModeIcon = 'zap' | 'brain' | 'flame'

interface ModeStatic {
  keyword: string
  name: string
  icon: ModeIcon
  scope: Record<'ro' | 'en', string>
  speed: Record<'ro' | 'en', string>
  cost: Record<'ro' | 'en', string>
  color: string
  bgColor: string
  borderColor: string
}

const MODES_STATIC: ModeStatic[] = [
  {
    keyword: '/effort medium',
    name: 'Effort low · medium',
    icon: 'zap',
    scope: { ro: 'sesiune', en: 'session' },
    speed: { ro: 'rapid', en: 'fast' },
    cost:  { ro: 'bază', en: 'baseline' },
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/25',
  },
  {
    keyword: '/effort xhigh',
    name: 'Effort high · xhigh',
    icon: 'brain',
    scope: { ro: 'sesiune', en: 'session' },
    speed: { ro: 'moderat', en: 'moderate' },
    cost:  { ro: 'ridicat', en: 'high' },
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/25',
  },
  {
    keyword: 'ultrathink',
    name: 'Ultrathink',
    icon: 'flame',
    scope: { ro: 'o tură', en: 'one turn' },
    speed: { ro: 'lent', en: 'slow' },
    cost:  { ro: 'punctual', en: 'targeted' },
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/25',
  },
]

// ── Static scenario metadata (language-independent) ────────────────────────

interface ScenarioStatic {
  mode: string
  modeColor: string
  prompt: string
}

const SCENARIOS_STATIC: ScenarioStatic[] = [
  {
    mode: 'effort medium',
    modeColor: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    prompt: `> Refactorizează funcția validateUser din\n  src/lib/auth.ts pentru a folosi early returns\n  în loc de if/else imbricat. Păstrează\n  același comportament extern.`,
  },
  {
    mode: 'effort xhigh',
    modeColor: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    prompt: `> /effort xhigh\n> Testele din tests/integration/\n  eșuează intermitent pe CI (GitHub Actions)\n  dar trec local. Verifică:\n  - Race conditions în setup/teardown\n  - Dependențe de ordine între teste\n  - Diferențe de timeout CI vs local\n  - State global între test suites`,
  },
  {
    mode: 'ultrathink',
    modeColor: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    prompt: `> ultrathink Migrează modulul de plăți\n  (src/lib/payments/) de la Stripe API v2\n  la v3. Cerințe critice:\n  1. Zero downtime — migrare incrementală\n  2. Backwards compatibility pe webhook-uri\n  3. Rollback plan dacă ceva eșuează\n  4. Actualizare teste existente\n  Documentează fiecare decizie de design.`,
  },
  {
    mode: 'ultrathink',
    modeColor: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    prompt: `> ultrathink Fă un security audit complet al\n  src/app/api/auth/ — verifică:\n  - SQL injection / NoSQL injection\n  - Timing attacks pe comparații de token\n  - Session fixation / CSRF\n  - Rate limiting lipsă\n  - Secrets hardcodate sau loguri cu date sensibile\n  Prioritizează vulnerabilitățile după severitate CVSS.`,
  },
]

// ── Shared helpers ─────────────────────────────────────────────────────────

function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
      <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-400" />
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
function TipBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-green-500/20 bg-green-500/5 p-4">
      <Lightbulb className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-400" />
      <div className="text-sm leading-relaxed text-zinc-400">{children}</div>
    </div>
  )
}

function ModeIconFor({ icon, className }: { icon: ModeIcon; className: string }) {
  if (icon === 'zap') return <Zap className={className} />
  if (icon === 'brain') return <Brain className={className} />
  return <Flame className={className} />
}

// ── Animated bar ───────────────────────────────────────────────────────────

function AnimBar({ pct, color, label, sublabel }: { pct: number; color: string; label: string; sublabel: string }) {
  const [w, setW] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTimeout(() => setW(pct), 150); obs.disconnect() }
    }, { threshold: 0.4 })
    obs.observe(el); return () => obs.disconnect()
  }, [pct])
  return (
    <div ref={ref} className="flex items-center gap-4">
      <div className="w-40 text-right">
        <span className="text-sm font-mono font-semibold text-zinc-300">{label}</span>
        <div className="text-xs text-zinc-600">{sublabel}</div>
      </div>
      <div className="h-3 flex-1 overflow-hidden rounded-full bg-zinc-800">
        <div className={`h-full rounded-full transition-all duration-1000 ease-out ${color}`} style={{ width: `${w}%` }} />
      </div>
    </div>
  )
}

const EFFORT_BAR_COLORS = [
  'bg-zinc-500',
  'bg-blue-500',
  'bg-purple-500',
  'bg-gradient-to-r from-purple-500 to-amber-500',
  'bg-gradient-to-r from-amber-500 to-orange-500',
]

// ── TAB: MODURI / MODES ────────────────────────────────────────────────────

function TabModuri() {
  const { lang } = useApp()
  const c = CONTENT[lang]
  const t = c.tab1

  return (
    <div className="space-y-10">
      {/* Intro */}
      <div>
        <h2 className="mb-3 text-2xl font-bold text-white">{t.heading}</h2>
        <p className="mb-4 text-zinc-400 leading-relaxed">
          {t.intro}<span className="text-amber-400 font-medium">{t.introAccent}</span>{t.introEnd}
        </p>
        <InfoBox>{t.infoBox}</InfoBox>
      </div>

      {/* Mode cards */}
      <div className="grid gap-5 lg:grid-cols-3">
        {MODES_STATIC.map((m, i) => {
          const mLocale = c.modes[i]
          return (
            <div key={m.keyword} className={`flex flex-col rounded-xl border ${m.borderColor} bg-zinc-900/50 p-6 transition-all hover:bg-zinc-900`}>
              <div className="mb-4 flex items-center gap-3">
                <div className={`rounded-lg p-2.5 ${m.bgColor}`}>
                  <ModeIconFor icon={m.icon} className={`h-5 w-5 ${m.color}`} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{m.name}</h3>
                  <code className={`text-xs font-mono ${m.color}`}>{m.keyword}</code>
                </div>
              </div>

              <p className={`mb-3 text-xs font-semibold ${m.color}`}>{mLocale.tagline}</p>
              <p className="mb-4 flex-1 text-sm leading-relaxed text-zinc-400">{mLocale.description}</p>

              <div className="mb-4 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded-lg bg-zinc-800/60 px-2 py-2">
                  <div className="text-zinc-500">{t.cardLabels.scope}</div>
                  <div className="mt-0.5 font-semibold text-zinc-300">{m.scope[lang]}</div>
                </div>
                <div className="rounded-lg bg-zinc-800/60 px-2 py-2">
                  <div className="text-zinc-500">{t.cardLabels.speed}</div>
                  <div className="mt-0.5 font-semibold text-zinc-300">{m.speed[lang]}</div>
                </div>
                <div className="rounded-lg bg-zinc-800/60 px-2 py-2">
                  <div className="text-zinc-500">{t.cardLabels.extraCost}</div>
                  <div className="mt-0.5 font-semibold text-zinc-300">{m.cost[lang]}</div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-green-400/70 mb-1.5">{t.cardLabels.idealFor}</div>
                {mLocale.useCases.slice(0, 3).map((u) => (
                  <div key={u} className="flex items-start gap-1.5 text-xs text-zinc-400">
                    <CheckCircle className="mt-0.5 h-3 w-3 flex-shrink-0 text-green-400" />{u}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Effort ladder */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <div className="mb-5 flex items-center gap-2">
          <Cpu className="h-4 w-4 text-amber-400" />
          <span className="font-semibold text-white">{t.budgetBarLabel}</span>
        </div>
        <div className="space-y-5">
          {t.effortBars.map((b, i) => (
            <AnimBar key={b.level} pct={b.pct} color={EFFORT_BAR_COLORS[i]} label={b.level} sublabel={b.sub} />
          ))}
        </div>
        <p className="mt-4 text-xs text-zinc-600">{t.budgetNote}</p>
      </div>

      {/* How to set effort */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
          <Settings className="h-5 w-5 text-amber-400" />
          {t.setTitle}
        </h3>
        <CodeBlock code={t.setCode} />
      </div>

      {/* Comparison table */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-white">{t.comparisonTitle}</h3>
        <div className="overflow-x-auto rounded-xl border border-zinc-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/60">
                <th className="px-4 py-3 text-left font-semibold text-zinc-400">{t.tableHeader}</th>
                {MODES_STATIC.map((m) => (
                  <th key={m.keyword} className={`px-4 py-3 text-center font-semibold ${m.color}`}>{m.name}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {t.tableRows.map((r) => (
                <tr key={r.label} className="bg-zinc-950 hover:bg-zinc-900/30 transition-colors">
                  <td className="px-4 py-3 text-zinc-400">{r.label}</td>
                  <td className="px-4 py-3 text-center font-mono text-xs text-blue-300">{r.v[0]}</td>
                  <td className="px-4 py-3 text-center font-mono text-xs text-purple-300">{r.v[1]}</td>
                  <td className="px-4 py-3 text-center font-mono text-xs text-amber-300">{r.v[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ── TAB: EXEMPLE / EXAMPLES ────────────────────────────────────────────────

function TabExemple() {
  const { lang } = useApp()
  const c = CONTENT[lang]
  const t = c.tab2
  const [active, setActive] = useState(0)
  const s = SCENARIOS_STATIC[active]
  const sLocale = c.scenarios[active]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-2 text-2xl font-bold text-white">{t.heading}</h2>
        <p className="text-zinc-400 leading-relaxed">{t.intro}</p>
      </div>

      {/* Scenario selector */}
      <div className="grid gap-3 sm:grid-cols-2">
        {SCENARIOS_STATIC.map((sc, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`rounded-xl border p-4 text-left transition-all ${
              active === i
                ? 'border-amber-500/40 bg-amber-500/5'
                : 'border-zinc-800 bg-zinc-900/30 hover:border-zinc-700'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-sm font-semibold text-zinc-200">{c.scenarios[i].title}</span>
              <span className={`flex-shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold ${sc.modeColor}`}>
                {sc.mode}
              </span>
            </div>
            <p className="mt-1.5 text-xs text-zinc-500 line-clamp-2">{c.scenarios[i].context}</p>
          </button>
        ))}
      </div>

      {/* Active scenario detail */}
      <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">{sLocale.title}</h3>
          <span className={`rounded-full border px-3 py-1 text-xs font-bold ${s.modeColor}`}>{s.mode}</span>
        </div>

        <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-4">
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">{t.contextLabel}</div>
          <p className="text-sm text-zinc-300">{sLocale.context}</p>
        </div>

        <div>
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">{t.promptLabel}</div>
          <CodeBlock code={s.prompt} />
        </div>

        <TipBox>
          <strong className="text-green-300">{t.whyPrefix}{s.mode}?</strong> {sLocale.why}
        </TipBox>
      </div>

      {/* Chaining example */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
          <ArrowRight className="h-5 w-5 text-amber-400" />
          {t.chainingTitle}
        </h3>
        <p className="mb-4 text-sm text-zinc-400">
          {t.chainingDesc}<code className="text-blue-400">/effort medium</code>{t.chainingMid}<code className="text-purple-400">/effort xhigh</code>{t.chainingEnd}<code className="text-amber-400">ultrathink</code>{t.chainingFinal}
        </p>
        <CodeBlock code={t.chainingCode} />
        <InfoBox>{t.chainingInfo}</InfoBox>
      </div>
    </div>
  )
}

// ── TAB: API ───────────────────────────────────────────────────────────────

function TabApi() {
  const { lang } = useApp()
  const c = CONTENT[lang]
  const t = c.tab3

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-2 text-2xl font-bold text-white">{t.heading}</h2>
        <p className="text-zinc-400 leading-relaxed">
          {t.intro}<code className="text-amber-400">{t.introAccent}</code>{t.introMid}<code className="text-amber-400">thinking</code>{t.introEnd}
        </p>
      </div>

      {/* Basic API usage */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">{t.basicTitle}</h3>
        <CodeBlock code={t.basicCode} />
      </div>

      {/* Claude Code → API mapping */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-white">{t.budgetTitle}</h3>
        <div className="overflow-x-auto rounded-xl border border-zinc-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/60">
                {t.budgetTableHeaders.map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-semibold text-zinc-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {t.budgetRows.map((r) => (
                <tr key={r.kw} className="bg-zinc-950 hover:bg-zinc-900/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-amber-400">{r.kw}</td>
                  <td className="px-4 py-3 font-mono text-zinc-300">{r.api}</td>
                  <td className="px-4 py-3 text-zinc-500">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-zinc-600">{t.budgetNote}</p>
      </div>

      {/* Streaming */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">{t.streamingTitle}</h3>
        <CodeBlock code={t.streamingCode} />
      </div>

      {/* Multi-turn with thinking */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">{t.multiTitle}</h3>
        <p className="mb-3 text-sm text-zinc-400">
          {t.multiDesc}<code className="text-amber-400">thinking</code>{t.multiEnd}
        </p>
        <CodeBlock code={t.multiCode} />
        <WarnBox>
          {t.warnPrefix}<code className="text-amber-300">thinking</code>{t.warnBox}<code className="text-amber-300">400 invalid_request_error</code>{t.warnEnd}
        </WarnBox>
      </div>

      {/* Model compatibility */}
      <div>
        <h3 className="mb-3 text-lg font-semibold text-white">{t.compatTitle}</h3>
        <div className="space-y-2">
          {t.compatModels.map((r) => (
            <div key={r.model} className="flex items-center justify-between gap-4 rounded-lg border border-zinc-800 bg-zinc-900/30 px-4 py-3">
              <div className="flex items-center gap-2">
                {r.ok
                  ? <CheckCircle className="h-4 w-4 text-green-400" />
                  : <XCircle className="h-4 w-4 text-red-400" />}
                <code className="text-sm text-zinc-300">{r.model}</code>
              </div>
              <span className="text-right text-xs text-zinc-500">{r.note}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── TAB: STRATEGII / STRATEGIES ────────────────────────────────────────────

function TabStrategii() {
  const { lang } = useApp()
  const c = CONTENT[lang]
  const t = c.tab4

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-2 text-2xl font-bold text-white">{t.heading}</h2>
        <p className="text-zinc-400 leading-relaxed">{t.intro}</p>
      </div>

      {/* Decision guide */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="mb-5 flex items-center gap-2 text-lg font-semibold text-white">
          <GitBranch className="h-5 w-5 text-amber-400" />
          {t.decisionTitle}
        </h3>
        <div className="space-y-3">
          {t.decisions.map((r) => (
            <div key={r.q} className={`flex items-center justify-between rounded-lg border ${r.color} px-4 py-3`}>
              <span className="text-sm text-zinc-300 flex-1 mr-4">{r.q}</span>
              <span className={`flex-shrink-0 text-sm ${r.ac}`}>→ {r.a}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Prompting tips */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-white">{t.promptingTitle}</h3>
        <div className="space-y-4">
          {t.promptingItems.map((item) => (
            <div key={item.label} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
              <div className="mb-3 flex items-center gap-2 text-green-400 font-semibold text-sm">
                <CheckCircle className="h-4 w-4" /> {item.label}
              </div>
              <CodeBlock code={item.code} />
            </div>
          ))}
        </div>
      </div>

      {/* Anti-patterns */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-white">{t.antiTitle}</h3>
        <div className="space-y-3">
          {t.antiPatterns.map((ap) => (
            <div key={ap.bad} className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
              <div className="flex items-start gap-2 mb-2">
                <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400" />
                <span className="text-sm text-red-300">{ap.bad}</span>
              </div>
              <div className="flex items-start gap-2 ml-6">
                <ArrowRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-400" />
                <span className="text-sm text-zinc-400">{ap.fix}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary checklist */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-6">
        <h3 className="mb-4 flex items-center gap-2 font-semibold text-white">
          <Lightbulb className="h-5 w-5 text-amber-400" />
          {t.checklistTitle}
        </h3>
        <div className="space-y-2">
          {t.checklist.map((item) => (
            <div key={item} className="flex items-center gap-2 text-sm text-zinc-400">
              <CheckCircle className="h-3.5 w-3.5 flex-shrink-0 text-amber-400/70" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── ROOT COMPONENT ─────────────────────────────────────────────────────────

export default function ReasoningModes() {
  const { lang } = useApp()
  const c = CONTENT[lang]
  const [activeTab, setActiveTab] = useState<TabId>('moduri')

  const TABS: Tab[] = [
    { id: 'moduri',     label: c.tabLabels.moduri,    icon: <Brain className="h-4 w-4" /> },
    { id: 'exemple',   label: c.tabLabels.exemple,   icon: <BookOpen className="h-4 w-4" /> },
    { id: 'api',       label: c.tabLabels.api,        icon: <Code2 className="h-4 w-4" /> },
    { id: 'strategii', label: c.tabLabels.strategii,  icon: <GitBranch className="h-4 w-4" /> },
  ]

  const renderTab = () => {
    switch (activeTab) {
      case 'moduri':     return <TabModuri />
      case 'exemple':    return <TabExemple />
      case 'api':        return <TabApi />
      case 'strategii':  return <TabStrategii />
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      {/* Header */}
      <div className="mb-10">
        <div className="mb-3 flex items-center gap-3">
          <div className="rounded-xl bg-purple-500/10 p-2.5">
            <Brain className="h-6 w-6 text-purple-400" />
          </div>
          <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-400">
            {c.badge}
          </span>
        </div>
        <h1 className="mb-3 text-4xl font-bold text-white">
          {c.title}
        </h1>
        <p className="max-w-2xl text-lg text-zinc-400 leading-relaxed">
          {c.desc}
        </p>
      </div>

      {/* Key stats strip */}
      <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {c.stats.map((s) => (
          <div key={s.value + s.label} className={`rounded-xl border ${s.border} p-4`}>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="mt-0.5 text-sm font-medium text-zinc-300">{s.label}</div>
            <div className="mt-0.5 text-xs text-zinc-600">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Sticky tabs */}
      <div className="sticky top-16 z-10 -mx-6 mb-0 bg-zinc-950/95 px-6 pb-3 pt-3 backdrop-blur-sm border-b border-zinc-800/60">
        <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:text-zinc-300'
              }`}
            >
              {tab.icon}
              {tab.label}
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
