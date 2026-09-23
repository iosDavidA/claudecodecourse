import { useState, useEffect, useRef } from 'react'
import {
  Brain, Zap, Flame, Cpu, BookOpen, Code2, Lightbulb,
  AlertTriangle, CheckCircle, XCircle, ArrowRight, GitBranch, Info,
} from 'lucide-react'
import { CodeBlock } from './CodeBlock'
import { useApp } from '../contexts/AppContext'

type TabId = 'moduri' | 'exemple' | 'api' | 'strategii'

interface Tab { id: TabId; label: string; icon: React.ReactNode }

// ── CONTENT ────────────────────────────────────────────────────────────────

const CONTENT = {
  ro: {
    badge: 'Extended Thinking',
    title: 'Moduri de Raționament',
    desc: 'Claude Code suportă trei moduri de gândire extinsă — fiecare alocă un buget diferit de tokeni interni pentru analiză înainte de răspuns. Cum să le alegi, cum să le folosești în API și când să le eviți.',
    stats: [
      { value: '3',    label: 'moduri CLI',          sub: 'think / megathink / ultrathink', color: 'text-purple-400', border: 'border-purple-500/20 bg-purple-500/5' },
      { value: 'adaptiv', label: 'thinking în API',  sub: 'modelul decide singur cât gândește', color: 'text-amber-400',  border: 'border-amber-500/20 bg-amber-500/5' },
      { value: '5',    label: 'niveluri effort',     sub: 'low / medium / high / xhigh / max', color: 'text-blue-400',   border: 'border-blue-500/20 bg-blue-500/5' },
      { value: '4+',   label: 'modele suportate',    sub: 'Sonnet 5, Opus 4.6+, Fable 5',  color: 'text-green-400',  border: 'border-green-500/20 bg-green-500/5' },
    ],
    tabLabels: {
      moduri:    'Moduri',
      exemple:   'Exemple',
      api:       'API',
      strategii: 'Strategii',
    },
    tab1: {
      heading: 'Extended Thinking — cum funcționează',
      intro: 'Când folosești un keyword de raționament, Claude nu răspunde imediat. În schimb alocă un ',
      introAccent: 'buget de tokeni interni',
      introEnd: ' pe care îi folosește exclusiv pentru gândire — explorând presupuneri, identificând edge case-uri, comparând abordări. Acești tokeni nu apar în răspunsul final.',
      infoBox: 'Budget tokens sunt separate de output tokens. Un răspuns scurt poate costa mulți tokeni de gândire internă. Costul total = input + budget + output.',
      budgetBarLabel: 'Buget de raționament intern',
      budgetNote: '* Budget tokens sunt procesați intern și nu apar în răspunsul vizibil final.',
      comparisonTitle: 'Comparație completă',
      tableHeader: 'Criteriu',
      tableRows: [
        { label: 'Budget tokens',   v: ['~10K', '~32K', '~128K'] },
        { label: 'Timp răspuns',    v: ['~5s',  '~20s', '60s+']  },
        { label: 'Cost relativ',    v: ['+15%', '+60%', '+300%'] },
        { label: 'Adâncime analiză',v: ['Bazic', 'Extins', 'Exhaustiv'] },
        { label: 'Backtracking',    v: ['Rar', 'Moderat', 'Intensiv'] },
        { label: 'Multi-fișier',    v: ['Limitat', 'Bun', 'Excelent'] },
        { label: 'Utilizare zilnică',v: ['Frecvent', 'Selectiv', 'Rar'] },
      ],
      cardLabels: { speed: 'Viteză', extraCost: 'Cost extra', idealFor: 'Ideal pentru' },
    },
    tab2: {
      heading: 'Exemple reale de utilizare',
      intro: 'Alegerea modului corect depinde de complexitatea problemei, nu de preferință. Iată scenarii concrete cu justificarea alegerii.',
      contextLabel: 'Context',
      promptLabel: 'Prompt folosit',
      whyPrefix: 'De ce ',
      chainingTitle: 'Înlănțuire progresivă de moduri',
      chainingDesc: 'Poți folosi mai întâi ',
      chainingMid: ' pentru explorare, apoi ',
      chainingEnd: ' sau ',
      chainingFinal: ' pentru implementare când înțelegi mai bine problema.',
      chainingCode: `# Pasul 1 — înțelege problema (ieftin)
> think Explică arhitectura modulului de auth
  și identifică potențialele puncte slabe.

# Pasul 2 — după ce ai contextul, mergi adânc
> megathink Acum că știm că problema e în
  token refresh logic, implementează o soluție
  robustă pentru race condition-ul identificat.

# Pasul 3 — dacă soluția e complexă și critică
> ultrathink Soluția de mai sus are impact pe
  mobile clients. Redesenează să fie
  backwards compatible cu clienții v1.`,
      chainingInfo: 'Fiecare mesaj nou în conversație beneficiază de contextul acumulat. Think-ul din pasul 1 e deja în context când faci megathink în pasul 2 — nu pierzi informație.',
    },
    tab3: {
      heading: 'Extended Thinking în Anthropic API',
      intro: 'Keyword-urile ',
      introAccent: 'think/megathink/ultrathink',
      introMid: ' sunt shortcuts de Claude Code. În API-ul modern (Sonnet 5, Opus 4.8, Fable 5), thinking-ul e adaptiv — modelul decide singur cât gândește — iar adâncimea o controlezi prin effort și parametrul ',
      introEnd: '.',
      basicTitle: 'Configurare de bază (adaptive thinking)',
      basicCode: `import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

const response = await client.messages.create({
  model: 'claude-sonnet-5',
  max_tokens: 16000,
  thinking: { type: 'adaptive' },     // modelul decide cât gândește
  output_config: { effort: 'high' },  // low | medium | high | xhigh | max
  messages: [
    {
      role: 'user',
      content: 'Refactorizează această funcție pentru early returns: ...',
    },
  ],
})

// ⚠️ Stilul vechi { type: 'enabled', budget_tokens: N } returnează
// eroare 400 pe Sonnet 5 / Opus 4.7+ — rămâne doar pe modelele vechi.

// Răspunsul conține blocuri separate: thinking + text
for (const block of response.content) {
  if (block.type === 'thinking') {
    console.log('Gândire internă:', block.thinking)
  }
  if (block.type === 'text') {
    console.log('Răspuns final:', block.text)
  }
}`,
      budgetTitle: 'Mapare keyword → effort (API modern)',
      budgetNote: '* budget_tokens funcționează doar pe modelele mai vechi (Haiku 4.5, Opus 4.6 și anterioare) și trebuie să fie sub max_tokens. Pe Sonnet 5 / Opus 4.7+ returnează 400.',
      budgetTableHeaders: ['Keyword CLI', 'Echivalent API modern', 'Modele vechi (budget_tokens)'],
      streamingTitle: 'Streaming cu adaptive thinking',
      streamingCode: `const stream = await client.messages.stream({
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
      // Afișează gândirea în timp real (opțional)
      process.stdout.write('.')
    }
    if (event.delta.type === 'text_delta') {
      process.stdout.write(event.delta.text)
    }
  }
}`,
      multiTitle: 'Multi-turn — păstrarea blocurilor de gândire',
      multiDesc: 'Într-o conversație multi-turn, trebuie să incluzi blocurile ',
      multiEnd: ' din răspunsurile anterioare înapoi în history. Altfel API-ul returnează eroare.',
      multiCode: `// Primul turn
const turn1 = await client.messages.create({
  model: 'claude-sonnet-5',
  max_tokens: 16000,
  thinking: { type: 'adaptive' },
  messages: [{ role: 'user', content: 'Analizează arhitectura...' }],
})

// Al doilea turn — include TOATE blocurile din turn1
const turn2 = await client.messages.create({
  model: 'claude-sonnet-5',
  max_tokens: 16000,
  thinking: { type: 'adaptive' },
  messages: [
    { role: 'user',      content: 'Analizează arhitectura...' },
    { role: 'assistant', content: turn1.content }, // ← include thinking blocks
    { role: 'user',      content: 'Acum implementează soluția propusă.' },
  ],
})`,
      warnBox: ' din history nu pot fi modificate. Dacă le omiti sau le alterezi, API-ul returnează ',
      warnEnd: '.',
      compatTitle: 'Compatibilitate modele',
      compatModels: [
        { model: 'claude-fable-5',    ok: true,  note: 'Thinking mereu activ — omite parametrul thinking complet' },
        { model: 'claude-opus-4-8',   ok: true,  note: 'Adaptive + effort (până la xhigh/max) — best pentru ultrathink' },
        { model: 'claude-sonnet-5',   ok: true,  note: 'Adaptive implicit — raport optim cost/calitate' },
        { model: 'claude-haiku-4-5',  ok: true,  note: 'Doar stilul clasic: enabled + budget_tokens, fără effort' },
      ],
    },
    tab4: {
      heading: 'Strategii de utilizare',
      intro: 'Modul de raționament nu face un prompt prost să devină bun. Structura și contextul din prompt rămân esențiale — gândirea extinsă amplifică un prompt bun, nu suplinește un prompt vag.',
      decisionTitle: 'Ghid de decizie rapidă',
      decisions: [
        { q: 'Știu exact ce vreau și problema e izolată într-un fișier?',    a: 'Fără keyword sau think',       color: 'border-zinc-700 bg-zinc-800/40',       ac: 'text-zinc-300' },
        { q: 'Problema e clară dar implică mai multe funcții?',               a: 'think',                        color: 'border-blue-500/20 bg-blue-500/5',     ac: 'text-blue-400 font-bold' },
        { q: 'Cauza nu e evidentă sau implică mai multe fișiere?',            a: 'megathink',                    color: 'border-purple-500/20 bg-purple-500/5', ac: 'text-purple-400 font-bold' },
        { q: 'Decizie arhitecturală, securitate, sau impact în producție?',   a: 'ultrathink',                   color: 'border-amber-500/20 bg-amber-500/5',   ac: 'text-amber-400 font-bold' },
        { q: 'Timp de răspuns critic sau iterații rapide?',                   a: 'Niciun keyword — răspuns direct', color: 'border-zinc-700 bg-zinc-800/40',    ac: 'text-zinc-300' },
      ],
      promptingTitle: 'Cum să scrii prompturi eficiente cu thinking',
      promptingItems: [
        {
          label: 'Specifică constrângerile explicit',
          code: `# Bine — Claude știe ce NU poate schimba
> megathink Refactorizează AuthService fără
  a schimba interfața publică (metode publice
  și tipurile lor). Backwards compatibility
  e obligatorie — există 3 consumatori externi.`,
        },
        {
          label: 'Dă context despre ce ai încercat deja',
          code: `# Bine — evită să reparcurgă direcții moarte
> megathink Am încercat să măresc timeout-ul
  la 30s și să adaug retry logic, dar testele
  tot eșuează intermitent. Problema pare
  în ordinea de teardown. Investighează
  altă direcție.`,
        },
        {
          label: 'Cere explicit documentarea deciziilor',
          code: `# Util pentru ultrathink — vrei să înțelegi
> ultrathink Implementează soluția și pentru
  fiecare decizie de design majoră, explică
  alternativele considerate și de ce ai ales
  această abordare.`,
        },
      ],
      antiTitle: 'Anti-patternuri comune',
      antiPatterns: [
        { bad: 'ultrathink pe orice prompt, indiferent de complexitate', fix: 'Rezervă ultrathink pentru probleme cu impact real. Think rezolvă 80% din task-uri zilnice.' },
        { bad: 'Prompt vag + ultrathink în speranța că "va fi mai bun"', fix: 'Gândirea extinsă nu compensează lipsa de context. Un prompt specific cu think bate un prompt vag cu ultrathink.' },
        { bad: 'Ignorarea răspunsului și re-trimiterea cu un mod mai mare', fix: 'Dacă think nu a rezolvat problema, citește răspunsul — poate problema e alta. Adaugă context înainte de a escala modul.' },
        { bad: 'Folosirea ultrathink în iterații rapide de prototipare', fix: 'La prototipare vrei feedback rapid. Folosește think sau fără keyword, apoi ultrathink doar pentru versiunea finală.' },
      ],
      checklistTitle: 'Checklist înainte de a folosi un mod de raționament',
      checklist: [
        'Am specificat fișierele și contextul relevant în prompt?',
        'Am menționat constrângerile (ce NU poate fi schimbat)?',
        'Am indicat ce am încercat deja, dacă e un debugging task?',
        'Complexitatea problemei justifică costul și timpul în plus?',
        'Am ales modul minim suficient, nu cel maxim disponibil?',
      ],
    },
    modes: [
      {
        keyword: 'think',
        tagline: 'Gândire de bază — pentru task-uri clare',
        description: 'Alocă un buget de ~10.000 tokeni interni pentru raționament step-by-step. Claude verifică presupunerile, explorează 2-3 abordări și alege direct. Vizibil ca progres, nu ca gândire în vorbire.',
        useCases: [
          'Refactorizare funcții cu logică clară',
          'Generare de teste unitare',
          'Explicarea unui bloc de cod',
          'Bug cu stack trace explicit',
          'Conversii de tipuri TypeScript',
        ],
      },
      {
        keyword: 'megathink',
        tagline: 'Raționament extins — pentru probleme complexe',
        description: 'Cu 32.000 tokeni de gândire internă, Claude explorează arbori de decizie mai largi, compară trade-off-uri între abordări, și face backtracking când o direcție nu converge. Ideal pentru probleme cu dependențe multiple.',
        useCases: [
          'Debugging multi-fișier cu cauze necunoscute',
          'Design de API-uri cu considerații de compatibilitate',
          'Migrări de scheme de baze de date',
          'Optimizări de performanță (profiling + fix)',
          'Code review cu impact de securitate',
        ],
      },
      {
        keyword: 'ultrathink',
        tagline: 'Analiză exhaustivă — pentru decizii critice',
        description: 'Bugetul maxim de raționament. Claude generează și evaluează sistematic strategii multiple, anticipează efecte secundare, și produce soluții robuste cu documentare a deciziilor. Folosit rar, justificat prin complexitate.',
        useCases: [
          'Redesign complet de arhitectură',
          'Migrare între framework-uri majore',
          'Bug critic de producție fără reproducere',
          'Implementare algoritm de complexitate ridicată',
          'Security audit al unui modul critic',
        ],
      },
    ],
    scenarios: [
      {
        title: 'Refactorizare cu early returns',
        context: 'Funcție de 40 de linii cu if/else adânc imbricat. Logica e clară, vrei cod mai lizibil.',
        why: 'Problema e bine definită, fișierul e izolat. Think e suficient — nu ai nevoie de analiză exhaustivă.',
      },
      {
        title: 'Debugging intermittent CI failure',
        context: 'Testele de integrare eșuează în ~30% din rulări pe CI, trec mereu local. Nu ai stack trace consistent.',
        why: 'Cauza necunoscută, mai multe ipoteze posibile, necesită explorare sistematică. Megathink evaluează toate direcțiile.',
      },
      {
        title: 'Migrare Stripe API v2 → v3',
        context: 'Modul de plăți critic în producție, trebuie migrat la Stripe v3 fără downtime. Webhook-urile existente trebuie să rămână funcționale.',
        why: 'Impact de producție, mai multe sisteme interdependente, risc de regresie. Ultrathink generează și evaluează mai multe strategii de migrare.',
      },
      {
        title: 'Security audit modul de autentificare',
        context: 'Modul de auth implementat acum 2 ani, niciodată auditat. Vrei să identifici vulnerabilități înainte de un pentest extern.',
        why: 'Domeniu cu impact ridicat de securitate. Ultrathink asigură că nicio clasă de vulnerabilitate nu e omisă.',
      },
    ],
  },
  en: {
    badge: 'Extended Thinking',
    title: 'Reasoning Modes',
    desc: 'Claude Code supports three extended thinking modes — each allocates a different budget of internal tokens for analysis before responding. How to choose them, how to use them in the API, and when to avoid them.',
    stats: [
      { value: '3',    label: 'CLI modes',          sub: 'think / megathink / ultrathink', color: 'text-purple-400', border: 'border-purple-500/20 bg-purple-500/5' },
      { value: 'adaptive', label: 'thinking in API', sub: 'the model decides how much to think', color: 'text-amber-400',  border: 'border-amber-500/20 bg-amber-500/5' },
      { value: '5',    label: 'effort levels',      sub: 'low / medium / high / xhigh / max', color: 'text-blue-400',   border: 'border-blue-500/20 bg-blue-500/5' },
      { value: '4+',   label: 'supported models',   sub: 'Sonnet 5, Opus 4.6+, Fable 5',  color: 'text-green-400',  border: 'border-green-500/20 bg-green-500/5' },
    ],
    tabLabels: {
      moduri:    'Modes',
      exemple:   'Examples',
      api:       'API',
      strategii: 'Strategies',
    },
    tab1: {
      heading: 'Extended Thinking — how it works',
      intro: 'When you use a reasoning keyword, Claude does not respond immediately. Instead it allocates an ',
      introAccent: 'internal token budget',
      introEnd: ' used exclusively for thinking — exploring assumptions, identifying edge cases, comparing approaches. These tokens do not appear in the final response.',
      infoBox: 'Budget tokens are separate from output tokens. A short response may cost many internal thinking tokens. Total cost = input + budget + output.',
      budgetBarLabel: 'Internal reasoning budget',
      budgetNote: '* Budget tokens are processed internally and do not appear in the visible final response.',
      comparisonTitle: 'Full comparison',
      tableHeader: 'Criterion',
      tableRows: [
        { label: 'Budget tokens',    v: ['~10K', '~32K', '~128K'] },
        { label: 'Response time',    v: ['~5s',  '~20s', '60s+']  },
        { label: 'Relative cost',    v: ['+15%', '+60%', '+300%'] },
        { label: 'Analysis depth',   v: ['Basic', 'Extended', 'Exhaustive'] },
        { label: 'Backtracking',     v: ['Rare', 'Moderate', 'Intensive'] },
        { label: 'Multi-file',       v: ['Limited', 'Good', 'Excellent'] },
        { label: 'Daily usage',      v: ['Frequent', 'Selective', 'Rare'] },
      ],
      cardLabels: { speed: 'Speed', extraCost: 'Extra cost', idealFor: 'Ideal for' },
    },
    tab2: {
      heading: 'Real-world usage examples',
      intro: 'Choosing the right mode depends on problem complexity, not preference. Here are concrete scenarios with justification for the choice.',
      contextLabel: 'Context',
      promptLabel: 'Prompt used',
      whyPrefix: 'Why ',
      chainingTitle: 'Progressive mode chaining',
      chainingDesc: 'You can start with ',
      chainingMid: ' for exploration, then use ',
      chainingEnd: ' or ',
      chainingFinal: ' for implementation once you understand the problem better.',
      chainingCode: `# Step 1 — understand the problem (cheap)
> think Explain the architecture of the auth module
  and identify potential weak points.

# Step 2 — once you have context, go deep
> megathink Now that we know the issue is in the
  token refresh logic, implement a robust solution
  for the identified race condition.

# Step 3 — if the solution is complex and critical
> ultrathink The solution above impacts mobile clients.
  Redesign to be backwards compatible with v1 clients.`,
      chainingInfo: 'Each new message in the conversation benefits from accumulated context. The think from step 1 is already in context when you megathink in step 2 — no information is lost.',
    },
    tab3: {
      heading: 'Extended Thinking in the Anthropic API',
      intro: 'The keywords ',
      introAccent: 'think/megathink/ultrathink',
      introMid: ' are Claude Code shortcuts. In the modern API (Sonnet 5, Opus 4.8, Fable 5), thinking is adaptive — the model decides how much to think — and you control depth via effort and the ',
      introEnd: ' parameter.',
      basicTitle: 'Basic configuration (adaptive thinking)',
      basicCode: `import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

const response = await client.messages.create({
  model: 'claude-sonnet-5',
  max_tokens: 16000,
  thinking: { type: 'adaptive' },     // the model decides how much to think
  output_config: { effort: 'high' },  // low | medium | high | xhigh | max
  messages: [
    {
      role: 'user',
      content: 'Refactor this function to use early returns: ...',
    },
  ],
})

// ⚠️ The old style { type: 'enabled', budget_tokens: N } returns
// a 400 error on Sonnet 5 / Opus 4.7+ — it only remains on older models.

// Response contains separate blocks: thinking + text
for (const block of response.content) {
  if (block.type === 'thinking') {
    console.log('Internal thinking:', block.thinking)
  }
  if (block.type === 'text') {
    console.log('Final response:', block.text)
  }
}`,
      budgetTitle: 'Keyword → effort mapping (modern API)',
      budgetNote: '* budget_tokens only works on older models (Haiku 4.5, Opus 4.6 and earlier) and must be below max_tokens. On Sonnet 5 / Opus 4.7+ it returns a 400.',
      budgetTableHeaders: ['CLI Keyword', 'Modern API equivalent', 'Older models (budget_tokens)'],
      streamingTitle: 'Streaming with adaptive thinking',
      streamingCode: `const stream = await client.messages.stream({
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
      // Display thinking in real time (optional)
      process.stdout.write('.')
    }
    if (event.delta.type === 'text_delta') {
      process.stdout.write(event.delta.text)
    }
  }
}`,
      multiTitle: 'Multi-turn — preserving thinking blocks',
      multiDesc: 'In a multi-turn conversation, you must include the ',
      multiEnd: ' blocks from previous responses back in history. Otherwise the API returns an error.',
      multiCode: `// First turn
const turn1 = await client.messages.create({
  model: 'claude-sonnet-5',
  max_tokens: 16000,
  thinking: { type: 'adaptive' },
  messages: [{ role: 'user', content: 'Analyze the architecture...' }],
})

// Second turn — include ALL blocks from turn1
const turn2 = await client.messages.create({
  model: 'claude-sonnet-5',
  max_tokens: 16000,
  thinking: { type: 'adaptive' },
  messages: [
    { role: 'user',      content: 'Analyze the architecture...' },
    { role: 'assistant', content: turn1.content }, // ← include thinking blocks
    { role: 'user',      content: 'Now implement the proposed solution.' },
  ],
})`,
      warnBox: ' blocks in history cannot be modified. If you omit or alter them, the API returns ',
      warnEnd: '.',
      compatTitle: 'Model compatibility',
      compatModels: [
        { model: 'claude-fable-5',    ok: true,  note: 'Thinking always on — omit the thinking parameter entirely' },
        { model: 'claude-opus-4-8',   ok: true,  note: 'Adaptive + effort (up to xhigh/max) — best for ultrathink' },
        { model: 'claude-sonnet-5',   ok: true,  note: 'Adaptive by default — optimal cost/quality ratio' },
        { model: 'claude-haiku-4-5',  ok: true,  note: 'Classic style only: enabled + budget_tokens, no effort' },
      ],
    },
    tab4: {
      heading: 'Usage strategies',
      intro: 'Reasoning mode does not turn a poor prompt into a good one. Structure and context in your prompt remain essential — extended thinking amplifies a good prompt, it does not compensate for a vague one.',
      decisionTitle: 'Quick decision guide',
      decisions: [
        { q: 'I know exactly what I want and the problem is isolated to one file?', a: 'No keyword or think',        color: 'border-zinc-700 bg-zinc-800/40',       ac: 'text-zinc-300' },
        { q: 'Problem is clear but involves multiple functions?',                   a: 'think',                     color: 'border-blue-500/20 bg-blue-500/5',     ac: 'text-blue-400 font-bold' },
        { q: 'Root cause is unclear or spans multiple files?',                      a: 'megathink',                 color: 'border-purple-500/20 bg-purple-500/5', ac: 'text-purple-400 font-bold' },
        { q: 'Architectural decision, security, or production impact?',             a: 'ultrathink',                color: 'border-amber-500/20 bg-amber-500/5',   ac: 'text-amber-400 font-bold' },
        { q: 'Response time is critical or you need rapid iterations?',             a: 'No keyword — direct answer', color: 'border-zinc-700 bg-zinc-800/40',       ac: 'text-zinc-300' },
      ],
      promptingTitle: 'How to write effective prompts with thinking',
      promptingItems: [
        {
          label: 'Specify constraints explicitly',
          code: `# Good — Claude knows what it CANNOT change
> megathink Refactor AuthService without
  changing the public interface (public methods
  and their types). Backwards compatibility
  is required — there are 3 external consumers.`,
        },
        {
          label: 'Give context about what you already tried',
          code: `# Good — avoids revisiting dead ends
> megathink I already tried increasing the timeout
  to 30s and adding retry logic, but tests still
  fail intermittently. The issue seems to be in
  the teardown order. Investigate a different angle.`,
        },
        {
          label: 'Explicitly ask for decision documentation',
          code: `# Useful for ultrathink — you want to understand
> ultrathink Implement the solution and for each
  major design decision, explain the alternatives
  considered and why you chose this approach.`,
        },
      ],
      antiTitle: 'Common anti-patterns',
      antiPatterns: [
        { bad: 'ultrathink on every prompt regardless of complexity', fix: 'Reserve ultrathink for problems with real impact. Think solves 80% of daily tasks.' },
        { bad: 'Vague prompt + ultrathink hoping it "will be better"', fix: 'Extended thinking does not compensate for missing context. A specific prompt with think beats a vague prompt with ultrathink.' },
        { bad: 'Ignoring the response and resending with a higher mode', fix: 'If think did not solve the problem, read the response — the problem might be different. Add context before escalating the mode.' },
        { bad: 'Using ultrathink in rapid prototyping iterations', fix: 'During prototyping you want fast feedback. Use think or no keyword, then ultrathink only for the final version.' },
      ],
      checklistTitle: 'Checklist before using a reasoning mode',
      checklist: [
        'Did I specify the relevant files and context in the prompt?',
        'Did I mention constraints (what CANNOT be changed)?',
        'Did I indicate what I already tried, if it is a debugging task?',
        'Does the problem complexity justify the extra cost and time?',
        'Did I choose the minimum sufficient mode, not the maximum available?',
      ],
    },
    modes: [
      {
        keyword: 'think',
        tagline: 'Basic thinking — for clear tasks',
        description: 'Allocates a budget of ~10,000 internal tokens for step-by-step reasoning. Claude checks assumptions, explores 2-3 approaches and chooses directly. Visible as progress, not as thinking out loud.',
        useCases: [
          'Refactoring functions with clear logic',
          'Generating unit tests',
          'Explaining a code block',
          'Bug with an explicit stack trace',
          'TypeScript type conversions',
        ],
      },
      {
        keyword: 'megathink',
        tagline: 'Extended reasoning — for complex problems',
        description: 'With 32,000 internal thinking tokens, Claude explores wider decision trees, compares trade-offs between approaches, and backtracks when a direction does not converge. Ideal for problems with multiple dependencies.',
        useCases: [
          'Multi-file debugging with unknown root cause',
          'API design with compatibility considerations',
          'Database schema migrations',
          'Performance optimizations (profiling + fix)',
          'Code review with security impact',
        ],
      },
      {
        keyword: 'ultrathink',
        tagline: 'Exhaustive analysis — for critical decisions',
        description: 'Maximum reasoning budget. Claude systematically generates and evaluates multiple strategies, anticipates side effects, and produces robust solutions with decision documentation. Used rarely, justified by complexity.',
        useCases: [
          'Complete architecture redesign',
          'Migration between major frameworks',
          'Critical production bug without reproduction',
          'High-complexity algorithm implementation',
          'Security audit of a critical module',
        ],
      },
    ],
    scenarios: [
      {
        title: 'Refactoring with early returns',
        context: 'A 40-line function with deeply nested if/else. The logic is clear, you want more readable code.',
        why: 'The problem is well-defined and the file is isolated. Think is sufficient — no exhaustive analysis needed.',
      },
      {
        title: 'Debugging intermittent CI failure',
        context: 'Integration tests fail in ~30% of CI runs but always pass locally. No consistent stack trace.',
        why: 'Unknown root cause, multiple possible hypotheses, requires systematic exploration. Megathink evaluates all directions.',
      },
      {
        title: 'Stripe API v2 → v3 migration',
        context: 'Critical payments module in production, must be migrated to Stripe v3 with zero downtime. Existing webhooks must remain functional.',
        why: 'Production impact, multiple interdependent systems, regression risk. Ultrathink generates and evaluates multiple migration strategies.',
      },
      {
        title: 'Authentication module security audit',
        context: 'Auth module implemented 2 years ago, never audited. You want to identify vulnerabilities before an external pentest.',
        why: 'High-impact security domain. Ultrathink ensures no vulnerability class is missed.',
      },
    ],
  },
} as const

// ── Static mode metadata (language-independent) ────────────────────────────

interface ModeStatic {
  keyword: string
  name: string
  budget: string
  budgetRaw: number
  speed: string
  costMultiplier: string
  color: string
  bgColor: string
  borderColor: string
  barColor: string
}

const MODES_STATIC: ModeStatic[] = [
  {
    keyword: 'think',
    name: 'Think',
    budget: '~10K tokens',
    budgetRaw: 8,
    speed: '~5s',
    costMultiplier: '+15%',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/25',
    barColor: 'bg-blue-500',
  },
  {
    keyword: 'megathink',
    name: 'Megathink',
    budget: '~32K tokens',
    budgetRaw: 25,
    speed: '~20s',
    costMultiplier: '+60%',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/25',
    barColor: 'bg-purple-500',
  },
  {
    keyword: 'ultrathink',
    name: 'Ultrathink',
    budget: '~128K tokens',
    budgetRaw: 100,
    speed: '60s+',
    costMultiplier: '+300%',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/25',
    barColor: 'bg-gradient-to-r from-amber-500 to-orange-500',
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
    mode: 'think',
    modeColor: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    prompt: `> think Refactorizează funcția validateUser din\n  src/lib/auth.ts pentru a folosi early returns\n  în loc de if/else imbricat. Păstrează\n  același comportament extern.`,
  },
  {
    mode: 'megathink',
    modeColor: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    prompt: `> megathink Testele din tests/integration/\n  eșuează intermitent pe CI (GitHub Actions)\n  dar trec local. Verifică:\n  - Race conditions în setup/teardown\n  - Dependențe de ordine între teste\n  - Diferențe de timeout CI vs local\n  - State global între test suites`,
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
      <div className="w-28 text-right">
        <span className="text-sm font-mono font-semibold text-zinc-300">{label}</span>
        <div className="text-xs text-zinc-600">{sublabel}</div>
      </div>
      <div className="h-3 flex-1 overflow-hidden rounded-full bg-zinc-800">
        <div className={`h-full rounded-full transition-all duration-1000 ease-out ${color}`} style={{ width: `${w}%` }} />
      </div>
      <span className="w-14 text-right font-mono text-xs text-zinc-500">{sublabel.includes('K') ? sublabel : `${pct}%`}</span>
    </div>
  )
}

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
                  {m.keyword === 'think' && <Zap className={`h-5 w-5 ${m.color}`} />}
                  {m.keyword === 'megathink' && <Brain className={`h-5 w-5 ${m.color}`} />}
                  {m.keyword === 'ultrathink' && <Flame className={`h-5 w-5 ${m.color}`} />}
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
                  <div className="text-zinc-500">Budget</div>
                  <div className="mt-0.5 font-semibold text-zinc-300">{m.budget}</div>
                </div>
                <div className="rounded-lg bg-zinc-800/60 px-2 py-2">
                  <div className="text-zinc-500">{t.cardLabels.speed}</div>
                  <div className="mt-0.5 font-semibold text-zinc-300">{m.speed}</div>
                </div>
                <div className="rounded-lg bg-zinc-800/60 px-2 py-2">
                  <div className="text-zinc-500">{t.cardLabels.extraCost}</div>
                  <div className="mt-0.5 font-semibold text-zinc-300">{m.costMultiplier}</div>
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

      {/* Animated comparison */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <div className="mb-5 flex items-center gap-2">
          <Cpu className="h-4 w-4 text-amber-400" />
          <span className="font-semibold text-white">{t.budgetBarLabel}</span>
        </div>
        <div className="space-y-5">
          <AnimBar pct={8}   color="bg-blue-500"   label="think"      sublabel="~10K tokens" />
          <AnimBar pct={25}  color="bg-purple-500" label="megathink"  sublabel="~32K tokens" />
          <AnimBar pct={100} color="bg-gradient-to-r from-amber-500 to-orange-500" label="ultrathink" sublabel="~128K tokens" />
        </div>
        <p className="mt-4 text-xs text-zinc-600">{t.budgetNote}</p>
      </div>

      {/* Comparison table */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-white">{t.comparisonTitle}</h3>
        <div className="overflow-x-auto rounded-xl border border-zinc-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/60">
                <th className="px-4 py-3 text-left font-semibold text-zinc-400">{t.tableHeader}</th>
                <th className="px-4 py-3 text-center font-semibold text-blue-400">think</th>
                <th className="px-4 py-3 text-center font-semibold text-purple-400">megathink</th>
                <th className="px-4 py-3 text-center font-semibold text-amber-400">ultrathink</th>
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
          {t.chainingDesc}<code className="text-blue-400">think</code>{t.chainingMid}<code className="text-purple-400">megathink</code>{t.chainingEnd}<code className="text-amber-400">ultrathink</code>{t.chainingFinal}
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

      {/* Budget mapping */}
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
              {[
                { kw: 'think',      budget: "effort: 'medium'",         maxTok: 'budget_tokens: 10,000' },
                { kw: 'megathink',  budget: "effort: 'high'",           maxTok: 'budget_tokens: 32,000' },
                { kw: 'ultrathink', budget: "effort: 'xhigh' / 'max'",  maxTok: 'budget_tokens: 100,000+' },
              ].map((r) => (
                <tr key={r.kw} className="bg-zinc-950 hover:bg-zinc-900/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-amber-400">{r.kw}</td>
                  <td className="px-4 py-3 font-mono text-zinc-300">{r.budget}</td>
                  <td className="px-4 py-3 text-zinc-500">{r.maxTok}</td>
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
          Blocurile <code className="text-amber-300">thinking</code>{t.warnBox}<code className="text-amber-300">400 Invalid request</code>{t.warnEnd}
        </WarnBox>
      </div>

      {/* Model compatibility */}
      <div>
        <h3 className="mb-3 text-lg font-semibold text-white">{t.compatTitle}</h3>
        <div className="space-y-2">
          {t.compatModels.map((r) => (
            <div key={r.model} className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/30 px-4 py-3">
              <div className="flex items-center gap-2">
                {r.ok
                  ? <CheckCircle className="h-4 w-4 text-green-400" />
                  : <XCircle className="h-4 w-4 text-red-400" />}
                <code className="text-sm text-zinc-300">{r.model}</code>
              </div>
              <span className="text-xs text-zinc-500">{r.note}</span>
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

      {/* Prompting tips for thinking modes */}
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
