import { useEffect, useRef, useState } from 'react'
import {
  Cpu, Zap, Brain, Sparkles, DollarSign, CheckCircle, XCircle,
  Lightbulb, Settings, Code2, BarChart3,
  Info, ArrowRight, Gauge,
} from 'lucide-react'
import { CodeBlock } from './CodeBlock'
import { useApp } from '../contexts/AppContext'

// ── Content ───────────────────────────────────────────────────────────────────
const CONTENT = {
  ro: {
    badge: 'Familia Claude 5 · sept. 2026',
    title: 'Modele și Pricing',
    subtitle: 'Haiku, Sonnet, Opus, Fable — patru modele cu profile complet diferite. Prețuri reale, matrice de decizie, configurare per proiect și capabilități tehnice complete.',
    stats: [
      { value: '4',        label: 'modele curente',        sub: 'Haiku 4.5 / Sonnet 5 / Opus 5.5 / Fable 5.1' },
      { value: '1M',       label: 'context window',        sub: 'toate în afară de Haiku (200K)' },
      { value: '10×',      label: 'diferență de cost',     sub: 'Haiku vs Fable 5.1 output' },
      { value: 'Opus 5.5', label: 'default în Claude Code', sub: 'effort implicit: medium' },
    ],
    tabs: ['Modele', 'Prețuri', 'Selectare', 'Configurare', 'Capabilități'],
    models: {
      badges: ['Rapid & Ieftin', 'Rapid & Capabil', 'Default recomandat', 'Vârf de gamă'],
      taglines: [
        'Volum mare, latență mică, cost minim',
        'Cea mai bună combinație viteză/inteligență la jumătate din prețul Opus',
        'Default-ul Claude Code — agentic coding și knowledge work',
        'Raționament extrem și agenți long-horizon',
      ],
      descriptions: [
        'Cel mai rapid și cel mai ieftin model Claude. Optimizat pentru task-uri high-volume care nu necesită raționament complex. Răspunde aproape instant — ideal pentru automatizări și feedback în timp real.',
        'Excelent echilibru între inteligență, viteză și cost, la $2/$10 per MTok. Alegerea bună pentru sesiuni rapide, volum mare sau subagenți. Adaptive thinking implicit (se poate dezactiva), până la 128K output tokens.',
        'Modelul implicit în Claude Code și punctul de pornire recomandat de Anthropic pentru majoritatea workload-urilor. Mai ieftin decât Opus-urile anterioare ($4/$20 per MTok), thinking mereu activ, effort implicit medium.',
        'Cel mai capabil model Anthropic disponibil public. Thinking mereu activ (nu se poate dezactiva), sesiuni agentice care rulează minute sau ore în autonomie. Îl folosești când Opus 5.5 la effort mare tot nu e suficient.',
      ],
      bestFor: [
        [
          'Completare cod simplu și boilerplate',
          'Generare getteri/setteri, interfaces',
          'Pipelines CI cu volum mare de fișiere',
          'Explicații rapide în 2-3 linii',
          'Prototipare și iterații rapide',
        ],
        [
          'Sesiuni rapide cu buget redus',
          'Feature-uri de complexitate medie',
          'Subagenți și task-uri paralele',
          'Generare teste unitare și de integrare',
          'Volum mare prin API / Batch',
        ],
        [
          'Development de zi cu zi (default)',
          'Feature-uri complexe și refactorizări multi-fișier',
          'Debugging critic de producție fără repro',
          'Redesign arhitectural și migrări',
          'Security audit și analize de risc',
        ],
        [
          'Agenți autonomi long-horizon (ore de lucru)',
          'Refactorizări masive multi-repo',
          'Research profund și analiză de ambiguitate',
          'Probleme la care Opus a eșuat',
          'Deliverables enterprise end-to-end',
        ],
      ],
      notFor: [
        [
          'Arhitecturi complexe sau ambigue',
          'Debugging multi-fișier',
          'Refactorizări care necesită context larg',
          'Analize de securitate',
        ],
        [
          'Task-uri banale repetitive → folosește Haiku',
          'Probleme ambigue unde Opus face diferența',
          'Agenți long-horizon critici',
        ],
        [
          'Completare cod simplu → Haiku',
          'Pipelines CI cu volum mare → Haiku / Sonnet',
          'Probleme la care a eșuat și la xhigh → Fable 5.1',
          'Effort max din reflex — medium e default-ul bun',
        ],
        [
          'Development zilnic → Opus 5.5',
          'Task-uri rutiniere — de 2,5× mai scump decât Opus 5.5',
          'Răspunsuri rapide — turele pot dura minute',
          'Organizații cu zero data retention',
        ],
      ],
      examples: [
        `# Activare în Claude Code:
claude --model haiku

# Sau în .claude/settings.json:
{ "model": "haiku" }

# Ideal pentru:
> Generează getterele pentru
  interfața UserProfile.ts
> Explică în 2 linii ce face
  această funcție.`,
        `# Activare:
claude --model sonnet
# sau ID complet: claude-sonnet-5

# Ideal pentru:
> Implementează pagination
  cursor-based în lib/api.ts
> Scrie teste Vitest pentru
  toate funcțiile din lib/cart.ts`,
        `# Default în Claude Code:
claude  # Opus 5.5 automat

# Explicit / în sesiune:
claude --model opus
> /model opus

# Ideal pentru:
> /effort xhigh
> Migrează autentificarea de la
  cookies la JWT stateless,
  menținând sesiunile active.`,
        `# Activare:
claude --model fable
# sau: /model best (fable dacă e disponibil)

# Ideal pentru:
> Rulează autonom: migrează întregul
  monorepo la pnpm workspaces,
  cu toate testele verzi la final.
> Analizează 6 luni de incidente
  de producție și propune un plan
  de fiabilizare prioritizat.`,
      ],
    },
    tabModele: {
      title: 'Modelele Claude actuale',
      desc: 'Patru modele cu profile distincte — nu sunt variante ale aceluiași model. Anthropic recomandă Claude Opus 5.5 ca punct de pornire pentru majoritatea workload-urilor (și e default-ul în Claude Code); Claude Fable 5.1 e vârful gamei, pentru raționament extrem și agenți long-horizon.',
      barLabels: ['Inteligență', 'Viteză', 'Cost relativ'],
      idealFor: 'Ideal pentru',
      notFor: 'Nu folosi pentru',
      thinkingYes: '✓ Da',
      thinkingNo: '✗ Nu',
      compTitle: 'Comparație vizuală',
      compRows: [
        'Inteligență / raționament',
        'Viteză de răspuns',
        'Cost relativ',
        'Max output tokens',
      ],
    },
    tabPreturi: {
      title: 'Prețuri și costuri reale',
      desc: 'Prețurile sunt per milion de tokeni (MTok). Cache read costă 10% din input (5% pe Opus 5.5, 2,5% pe Fable 5.1) — esențial pentru sesiunile lungi cu CLAUDE.md consistent. Batch API: −50% la input și output.',
      thContext: 'Context',
      footnote: '* Prețuri Claude API (first-party) verificate în sept. 2026 — cache write = scriere 5 minute. Verifică platform.claude.com/docs/en/about-claude/pricing pentru valorile curente.',
      costTitle: 'Diferența de cost per task tipic',
      tasks: [
        'Explică o funcție simplă (~2K tok)',
        'Bugfix cu stack trace clar (~5K tok)',
        'Feature nouă moderată (~20K tok)',
        'Refactorizare complexă (~50K tok)',
        'Redesign arhitectural (~150K tok)',
      ],
      tipContent: (
        <>
          <strong className="text-green-300">Strategia Opus + Sonnet:</strong> Opus 5.5 pentru <em>design și decizie</em> (50K tokeni), Sonnet 5 pentru <em>implementare</em> (200K tokeni). Costul total: ~$3.00 față de ~$5.00 cu Opus pentru tot — economie de ~40%. Adesea mai simplu: rămâi pe Opus 5.5 și coboară effort-ul la medium/low pentru partea de rutină.
        </>
      ),
      cacheTitle: 'Impactul prompt caching pe sesiunile lungi',
      cacheDesc: 'Într-o sesiune tipică cu CLAUDE.md de 2K tokeni și 30 de mesaje pe Opus 5.5 (default), caching-ul reduce costul de input cu ~75%.',
      noCache: 'Fără caching — 30 mesaje Opus 5.5',
      withCache: 'Cu caching activ — 30 mesaje Opus 5.5',
      noCacheRows: [
        ['CLAUDE.md × 30 cereri (2K × 30)', '60K tokeni input'],
        ['System prompt × 30', '90K tokeni'],
        ['Conversație (medie 1K/mesaj)', '30K tokeni'],
      ],
      withCacheRows: [
        ['Cache read (CLAUDE.md + system)', '150K × $0.20'],
        ['Cache write (prima dată)', '5K × $5.00'],
        ['Conversație nouă', '30K × $4.00'],
      ],
      totalInput: 'Total input cost',
      infoContent: 'Claude Code activează prompt caching automat pentru CLAUDE.md și system prompt. Nu trebuie configurat nimic — funcționează implicit la fiecare sesiune.',
      tokeni: 'tokeni',
    },
    tabSelectare: {
      title: 'Când să folosești care model',
      desc: 'Regula de bază în 2026: pornești cu Opus 5.5 (default, effort medium), cobori la Sonnet 5 sau Haiku pentru viteză, volum sau cost, și urci la Fable 5.1 doar când Opus la effort mare nu e suficient. Înainte să schimbi modelul, încearcă să ajustezi effort-ul.',
      decisionTitle: 'Ghid de decizie rapidă',
      qas: [
        { q: 'Completare cod, boilerplate, getter/setter, docstrings?',   a: 'Haiku',  color: 'text-green-400',  bg: 'border-green-500/20 bg-green-500/5' },
        { q: 'Explicație rapidă a unui bloc de cod?',                     a: 'Haiku',  color: 'text-green-400',  bg: 'border-green-500/20 bg-green-500/5' },
        { q: 'CI automation cu sute de fișiere procesate?',               a: 'Haiku',  color: 'text-green-400',  bg: 'border-green-500/20 bg-green-500/5' },
        { q: 'Bug fix cu stack trace clar, vrei răspuns rapid și ieftin?', a: 'Sonnet', color: 'text-amber-400',  bg: 'border-amber-500/20 bg-amber-500/5' },
        { q: 'Subagenți care citesc mult cod în paralel?',                a: 'Sonnet', color: 'text-amber-400',  bg: 'border-amber-500/20 bg-amber-500/5' },
        { q: 'Generare de teste pentru un modul existent?',               a: 'Sonnet', color: 'text-amber-400',  bg: 'border-amber-500/20 bg-amber-500/5' },
        { q: 'Feature nouă, refactorizare, code review — munca zilnică?', a: 'Opus',   color: 'text-purple-400', bg: 'border-purple-500/20 bg-purple-500/5' },
        { q: 'Redesign arhitectural sau migrare de stack?',               a: 'Opus',   color: 'text-purple-400', bg: 'border-purple-500/20 bg-purple-500/5' },
        { q: 'Bug critic de producție fără reproducere clară?',          a: 'Opus',   color: 'text-purple-400', bg: 'border-purple-500/20 bg-purple-500/5' },
        { q: 'Security audit complet al unui modul critic?',              a: 'Opus',   color: 'text-purple-400', bg: 'border-purple-500/20 bg-purple-500/5' },
        { q: 'Opus 5.5 a eșuat și la effort xhigh?',                      a: 'Fable 5.1', color: 'text-rose-400', bg: 'border-rose-500/20 bg-rose-500/5' },
        { q: 'Agent autonom care lucrează ore întregi?',                  a: 'Fable 5.1', color: 'text-rose-400', bg: 'border-rose-500/20 bg-rose-500/5' },
      ],
      matrixTitle: 'Matrice completă — scenarii vs modele',
      matrixColScenario: 'Scenariu',
      matrixRows: [
        ['Completare cod / boilerplate',         '✓ Ideal',     '✓ Merge',      '○ Overkill'],
        ['Bug cu stack trace clar',              '○ Merge',     '✓ Ideal',      '✓ Bun'],
        ['Feature moderată (1-3 fișiere)',        '✗ Slab',      '✓ Bun',        '✓ Ideal'],
        ['Refactorizare complexă multi-fișier',  '✗ Slab',      '○ Merge',      '✓ Ideal'],
        ['Design arhitectural nou',               '✗ Nu',        '○ Parțial',    '✓ Ideal'],
        ['Migrare framework / stack change',      '✗ Nu',        '○ Parțial',    '✓ Ideal'],
        ['Code review de securitate',             '✗ Slab',      '✓ Bun',        '✓ Ideal'],
        ['CI pipeline / automatizare volum',      '✓ Ideal',     '✓ Bun',        '○ Prea scump'],
        ['Generare teste unitare',                '○ Simple',    '✓ Ideal',      '✓ Bun'],
        ['Debug producție fără repro',            '✗ Nu',        '○ Încearcă',   '✓ Ideal'],
      ],
      escalTitle: 'Strategia de escaladare',
      escalDesc: 'Primul pas nu e schimbarea modelului, ci a effort-ului. Pe Opus 5.5 urci de la medium la xhigh; abia dacă tot nu converge treci la Fable 5.1 — cu același context acumulat.',
      escalCode: `# Pasul 1 — Opus 5.5 pe default (effort medium)
> Debughez un race condition în sistemul
  de notificări.
  Fișiere: lib/notifications.ts, workers/notify.ts

# Nu converge? Urci effort-ul, nu modelul:
> /effort xhigh
> Continuă analiza — soluția de mai sus nu e
  corectă pentru că [X]. Verifică ordinea
  evenimentelor din NotificationQueue.

# Tot blocat? Escaladezi la Fable 5.1:
> /model fable
> Continuă de unde am rămas.

# Rezolvat. Implementarea de rutină — înapoi:
> /model opus
> /effort medium
> Implementează soluția propusă mai sus.`,
      tipContent: (
        <>
          Schimbând modelul în mijlocul sesiunii, contextul conversației (toate mesajele, fișierele citite) se <strong className="text-green-300">păstrează complet</strong>. Nu pierzi progresul — schimbi doar puterea de calcul.
        </>
      ),
      switchTitle: 'Schimbarea modelului în sesiune',
      switchLabel1: 'Comenzi disponibile',
      switchLabel2: 'Flux Opus → Sonnet (opțional)',
      switchCode1: `# Din prompt, oricând:
> /model opus      # Opus 5.5
> /model sonnet    # Sonnet 5
> /model haiku     # Haiku 4.5
> /model fable     # Fable 5.1
> /model opusplan  # Opus în plan mode, Sonnet la execuție

# /model <nume> salvează alegerea ca default.
# Doar pentru sesiunea curentă: /model → tasta "s"

# Verifică modelul activ:
> /status

# Sau prin flag la lansare (doar acea sesiune):
claude --model opus`,
      switchCode2: `# Opus pentru DECIZIE (scurt):
/model opus
> ultrathink Care e cea mai bună
  arhitectură pentru sistemul X?
  Analizează 3 opțiuni.

# Sonnet pentru IMPLEMENTARE (lung, ~2× mai ieftin):
/model sonnet
> Implementează opțiunea 2 propusă.
  Respectă constrângerile din plan.

# Automat: /model opusplan face exact asta.`,
    },
    tabConfigurare: {
      title: 'Configurare model',
      desc: 'Poți seta modelul la mai multe niveluri: settings.json (persistent), variabilă de mediu, flag CLI sau /model în sesiune. Nivelul mai specific îl suprascrie pe cel general. Effort-ul se configurează separat, cu aceeași logică.',
      priorityTitle: 'Prioritate configurare (crescător)',
      priorities: [
        { level: '4 — Cel mai mic', label: 'Default cont / plan',      val: 'Opus 5.5 (Pro, Max, Team, Enterprise, API)', color: 'border-zinc-700 bg-zinc-800/30',     badge: 'text-zinc-500'  },
        { level: '3',               label: 'settings.json',            val: '{ "model": "opus" }',                        color: 'border-amber-500/20 bg-amber-500/5', badge: 'text-amber-400' },
        { level: '2',               label: 'Variabilă de mediu',       val: 'ANTHROPIC_MODEL=sonnet',                     color: 'border-blue-500/20 bg-blue-500/5',   badge: 'text-blue-400'  },
        { level: '1 — Prioritate maximă', label: '--model / /model',   val: 'claude --model haiku',                       color: 'border-purple-500/20 bg-purple-500/5', badge: 'text-purple-400'},
      ],
      settingsTitle: '.claude/settings.json',
      settingsDesc: 'Configurat per proiect, versionat în repo. Se aplică tuturor sesiunilor din directorul respectiv. Poți folosi alias-uri (opus, sonnet, haiku, fable) — ele urmează automat cea mai nouă versiune.',
      settingsCode: `// .claude/settings.json
{
  "model": "opus",

  // Effort implicit + override per model (opțional):
  "effortLevel": "medium",
  "modelSettings": {
    "opus": { "effort": "high" }
  },

  // Permisiuni tool-uri (opțional):
  "permissions": {
    "allow": ["Bash(npm run *)", "Edit", "Read"],
    "deny": ["Bash(rm -rf *)"]
  }
}`,
      infoContent: (
        <>
          <code className="text-blue-300">.claude/settings.json</code> e versionat în git — toată echipa primește același model default pentru proiect. Atenție: <code className="text-blue-300">/model</code> scrie alegerea în settings-urile tale de utilizator, deci devine default pentru sesiunile noi.
        </>
      ),
      envTitle: 'Variabile de mediu',
      envCode: `# Model pentru sesiunea lansată:
ANTHROPIC_MODEL=haiku claude -p "..."

# Ce model folosește fiecare alias:
export ANTHROPIC_DEFAULT_OPUS_MODEL="claude-opus-5-5"
export ANTHROPIC_DEFAULT_SONNET_MODEL="claude-sonnet-5"
export ANTHROPIC_DEFAULT_HAIKU_MODEL="claude-haiku-4-5"
export ANTHROPIC_DEFAULT_FABLE_MODEL="claude-fable-5-1"

# Model implicit pentru subagenți:
export CLAUDE_CODE_SUBAGENT_MODEL="sonnet"

# Effort global (suprascrie /effort și settings):
export CLAUDE_CODE_EFFORT_LEVEL="medium"

# În CI/CD (GitHub Actions):
env:
  ANTHROPIC_MODEL: haiku
  ANTHROPIC_API_KEY: \${{ secrets.ANTHROPIC_API_KEY }}`,
      apiTitle: 'Selectare model în Anthropic SDK',
      apiDesc: 'Dacă construiești cu API-ul direct, modelul e un parametru simplu. Adâncimea raționamentului o controlezi prin output_config.effort.',
      apiCode: `import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

// Haiku 4.5 — completare rapidă, cost minim
const quickResponse = await client.messages.create({
  model: 'claude-haiku-4-5',
  max_tokens: 1024,
  messages: [{ role: 'user', content: promptSimple }],
})

// Sonnet 5 — rapid și ieftin, adaptive thinking implicit
const devResponse = await client.messages.create({
  model: 'claude-sonnet-5',
  max_tokens: 16000,
  output_config: { effort: 'high' },
  messages: [{ role: 'user', content: promptComplex }],
})

// Opus 5.5 — default recomandat. Thinking mereu activ;
// effort implicit 'medium' — setează-l explicit când contează.
const archResponse = await client.messages.create({
  model: 'claude-opus-5-5',
  max_tokens: 16000,
  output_config: { effort: 'xhigh' },
  messages: [{ role: 'user', content: promptCritic }],
})

// Fable 5.1 — probleme extreme. Thinking mereu activ:
// omite parametrul thinking ('disabled' returnează 400).
const extremeResponse = await client.messages.create({
  model: 'claude-fable-5-1',
  max_tokens: 16000,
  output_config: { effort: 'xhigh' },
  messages: [{ role: 'user', content: promptExtrem }],
})`,
      stratTitle: 'Strategii de configurare per context',
      strats: [
        {
          ctx: 'Development local',
          where: 'default sau .claude/settings.json',
          rationale: 'Opus 5.5 pe effort medium acoperă munca zilnică. Urci effort-ul din sesiune când problema devine grea.',
        },
        {
          ctx: 'CI/CD pipelines',
          where: 'ENV var în CI config',
          rationale: 'Rulează pe sute de fișiere la fiecare push. Haiku costă de 4× mai puțin decât Opus 5.5 la output.',
        },
        {
          ctx: 'Sesiune agentică grea',
          where: '--model fable sau /model fable',
          rationale: 'Pentru task-uri de ore sau probleme la care Opus eșuează. Revii la Opus pentru implementarea de rutină.',
        },
      ],
    },
    tabCapabilitati: {
      title: 'Capabilități și limitări per model',
      desc: 'Dincolo de inteligență și cost, modelele diferă în capabilități tehnice concrete — context window, thinking, effort, output maxim.',
      thCap: 'Capabilitate',
      capRows: [
        { cap: 'Context window',           h: '200K tokeni', s: '1M tokeni',   o: '1M tokeni', f: '1M tokeni' },
        { cap: 'Max output tokens',         h: '64K',         s: '128K',        o: '128K',      f: '128K' },
        { cap: 'Thinking',                  h: '✓ budget_tokens', s: '✓ adaptive', o: '✓ mereu activ', f: '✓ mereu activ' },
        { cap: 'Effort implicit',           h: '—',           s: 'high',        o: 'medium',    f: 'high' },
        { cap: 'Knowledge cutoff',          h: 'feb. 2025',   s: 'ian. 2026',   o: 'iun. 2026', f: 'iun. 2026' },
        { cap: 'Tool use (Bash, Read etc)', h: '✓',           s: '✓',           o: '✓',         f: '✓' },
        { cap: 'Vision (imagini)',           h: '✓',           s: '✓',           o: '✓',         f: '✓' },
        { cap: 'Streaming',                  h: '✓',           s: '✓',           o: '✓',         f: '✓' },
        { cap: 'Prompt caching',             h: '✓',           s: '✓',           o: '✓',         f: '✓' },
        { cap: 'Batch API',                  h: '✓',           s: '✓',           o: '✓',         f: '✓' },
        { cap: 'Latență relativă',           h: 'Cea mai mică', s: 'Mică',       o: 'Moderată',  f: 'Mare — minute pe task grele' },
        { cap: 'Fast mode (API)',            h: '✗',           s: '✗',           o: '✓ $8/$40',  f: '✗' },
      ],
      thinkingTitle: 'Thinking — detalii per model',
      thinkingModels: [
        {
          thinking: true,
          budget: 'budget_tokens (stil clasic)',
          recommended: 'min 1.024, sub max_tokens',
          note: 'Singurul model curent care folosește încă extended thinking clasic cu budget_tokens. Nu suportă adaptive thinking sau parametrul effort.',
        },
        {
          thinking: true,
          budget: 'adaptive — se poate dezactiva',
          recommended: "effort: 'high' (default) / 'xhigh'",
          note: 'Adaptive thinking e activ implicit. budget_tokens returnează 400 — controlezi adâncimea prin output_config.effort (low → max).',
        },
        {
          thinking: true,
          budget: 'mereu activ — nu se poate dezactiva',
          recommended: "effort: 'medium' (default) → 'xhigh'",
          note: "{ type: 'disabled' } și budget_tokens returnează 400 la orice effort. Effort implicit e medium (un nivel sub Opus 5) — setează-l explicit pentru task-uri grele.",
        },
        {
          thinking: true,
          budget: 'mereu activ — nu se poate dezactiva',
          recommended: "omite thinking; effort: 'low' → 'max'",
          note: 'Doar { type: "adaptive" } sau omiterea parametrului sunt acceptate. Chain of thought brut nu e returnat niciodată — cere display: "summarized" pentru rezumat.',
        },
      ],
      noThinking: 'Nu suportă thinking',
      budgetLabel: 'Budget:',
      recommendedLabel: 'Recomandat:',
      strategiesTitle: '10 strategii pentru cost optim',
      strategies: [
        { n: '01', title: 'Modelul potrivit pentru fiecare task',    desc: 'Haiku pentru simplu, Sonnet pentru volum, Opus 5.5 pentru munca zilnică, Fable 5.1 doar pentru extreme. Diferența de cost: până la 10×.' },
        { n: '02', title: '/compact proactiv la ~60% context',        desc: 'Comprimă conversația înainte de a ajunge la limită. Nu aștepta warning-ul — acționezi prea târziu.' },
        { n: '03', title: 'Context minimal dar suficient',            desc: 'Claude citește automat fișierele necesare. Nu paste cod în prompt — adaugă tokeni inutili.' },
        { n: '04', title: 'Specifică fișierele relevante',            desc: 'În loc de "analizează proiectul", spune "verifică lib/auth.ts". Elimini scanarea de fișiere irelevante.' },
        { n: '05', title: 'Effort proporțional cu complexitatea',     desc: '/effort low → max controlează cât gândește modelul. Păstrează medium ca default și folosește ultrathink doar pe tura care contează.' },
        { n: '06', title: 'Sesiuni curate și focusate',              desc: 'O sesiune = un task sau task-uri înrudite. Schimbările de subiect acumulează context inutil.' },
        { n: '07', title: 'CLAUDE.md concis',                         desc: 'Fiecare linie din CLAUDE.md se adaugă la fiecare request. 200 linii = 200× mai mulți tokeni de input.' },
        { n: '08', title: 'Un prompt, un obiectiv',                   desc: 'Prompturi atomice produc output mai bun cu mai puțini tokeni față de prompturi cu 5 task-uri.' },
        { n: '09', title: 'Opus pentru decizie, Sonnet pentru cod',  desc: 'Opus 5.5 analizează și recomandă (50K tokeni), Sonnet 5 implementează (200K tokeni). Economie ~40% — sau /model opusplan.' },
        { n: '10', title: 'Monitorizează cu /cost',                   desc: 'Rulează /cost periodic pentru a vedea consumul sesiunii. Devii conștient de pattern-urile costisitoare.' },
      ],
    },
  },
  en: {
    badge: 'Claude 5 Family · Sep 2026',
    title: 'Models & Pricing',
    subtitle: 'Haiku, Sonnet, Opus, Fable — four models with completely different profiles. Real prices, decision matrix, per-project configuration and full technical capabilities.',
    stats: [
      { value: '4',        label: 'current models',      sub: 'Haiku 4.5 / Sonnet 5 / Opus 5.5 / Fable 5.1' },
      { value: '1M',       label: 'context window',      sub: 'all except Haiku (200K)' },
      { value: '10×',      label: 'cost difference',     sub: 'Haiku vs Fable 5.1 output' },
      { value: 'Opus 5.5', label: 'Claude Code default', sub: 'default effort: medium' },
    ],
    tabs: ['Models', 'Pricing', 'Selection', 'Configuration', 'Capabilities'],
    models: {
      badges: ['Fast & Cheap', 'Fast & Capable', 'Recommended default', 'Top of range'],
      taglines: [
        'High volume, low latency, minimal cost',
        'Best speed/intelligence combination at half the Opus price',
        'Claude Code default — agentic coding and knowledge work',
        'Extreme reasoning and long-horizon agents',
      ],
      descriptions: [
        'The fastest and cheapest Claude model. Optimized for high-volume tasks that don\'t require complex reasoning. Responds almost instantly — ideal for automations and real-time feedback.',
        'Excellent balance between intelligence, speed and cost, at $2/$10 per MTok. A good pick for fast sessions, high volume or subagents. Adaptive thinking on by default (can be disabled), up to 128K output tokens.',
        'The default model in Claude Code and Anthropic\'s recommended starting point for most workloads. Cheaper than previous Opus models ($4/$20 per MTok), thinking always on, default effort medium.',
        'The most capable publicly available Anthropic model. Thinking is always on (cannot be disabled), agentic sessions that run for minutes or hours autonomously. Use it when Opus 5.5 at high effort still falls short.',
      ],
      bestFor: [
        [
          'Simple code completion and boilerplate',
          'Generating getters/setters, interfaces',
          'CI pipelines with large file volumes',
          'Quick explanations in 2-3 lines',
          'Prototyping and rapid iterations',
        ],
        [
          'Fast, budget-conscious sessions',
          'Features of medium complexity',
          'Subagents and parallel tasks',
          'Generating unit and integration tests',
          'High volume via API / Batch',
        ],
        [
          'Day-to-day development (default)',
          'Complex features and multi-file refactoring',
          'Critical production debugging without repro',
          'Architectural redesign and migrations',
          'Security audits and risk analysis',
        ],
        [
          'Autonomous long-horizon agents (hours of work)',
          'Massive multi-repo refactors',
          'Deep research and ambiguity analysis',
          'Problems where Opus has failed',
          'End-to-end enterprise deliverables',
        ],
      ],
      notFor: [
        [
          'Complex or ambiguous architectures',
          'Multi-file debugging',
          'Refactoring requiring wide context',
          'Security analysis',
        ],
        [
          'Trivial repetitive tasks → use Haiku',
          'Ambiguous problems where Opus makes the difference',
          'Critical long-horizon agents',
        ],
        [
          'Simple code completion → Haiku',
          'High-volume CI pipelines → Haiku / Sonnet',
          'Problems it failed on even at xhigh → Fable 5.1',
          'Reflexive max effort — medium is the right default',
        ],
        [
          'Daily development → Opus 5.5',
          'Routine tasks — 2.5× the cost of Opus 5.5',
          'Quick answers — turns can take minutes',
          'Organizations with zero data retention',
        ],
      ],
      examples: [
        `# Enable in Claude Code:
claude --model haiku

# Or in .claude/settings.json:
{ "model": "haiku" }

# Ideal for:
> Generate getters for
  the UserProfile.ts interface
> Explain in 2 lines what
  this function does.`,
        `# Enable:
claude --model sonnet
# or full ID: claude-sonnet-5

# Ideal for:
> Implement cursor-based pagination
  in lib/api.ts
> Write Vitest tests for every
  function in lib/cart.ts`,
        `# Default in Claude Code:
claude  # Opus 5.5 automatically

# Explicit / mid-session:
claude --model opus
> /model opus

# Ideal for:
> /effort xhigh
> Migrate authentication from
  cookies to stateless JWT,
  keeping active sessions intact.`,
        `# Enable:
claude --model fable
# or: /model best (fable where available)

# Ideal for:
> Run autonomously: migrate the
  entire monorepo to pnpm
  workspaces, all tests green.
> Analyze 6 months of production
  incidents and propose a
  prioritized reliability plan.`,
      ],
    },
    tabModele: {
      title: 'Current Claude models',
      desc: 'Four models with distinct profiles — they are not variants of the same model. Anthropic recommends Claude Opus 5.5 as the starting point for most workloads (and it is the Claude Code default); Claude Fable 5.1 is the top of the range, for extreme reasoning and long-horizon agents.',
      barLabels: ['Intelligence', 'Speed', 'Relative cost'],
      idealFor: 'Ideal for',
      notFor: "Don't use for",
      thinkingYes: '✓ Yes',
      thinkingNo: '✗ No',
      compTitle: 'Visual comparison',
      compRows: [
        'Intelligence / reasoning',
        'Response speed',
        'Relative cost',
        'Max output tokens',
      ],
    },
    tabPreturi: {
      title: 'Real prices and costs',
      desc: 'Prices are per million tokens (MTok). A cache read costs 10% of input (5% on Opus 5.5, 2.5% on Fable 5.1) — essential for long sessions with a consistent CLAUDE.md. Batch API: −50% on input and output.',
      thContext: 'Context',
      footnote: '* Claude API (first-party) prices checked in Sep 2026 — cache write = 5-minute write. Check platform.claude.com/docs/en/about-claude/pricing for current values.',
      costTitle: 'Cost difference per typical task',
      tasks: [
        'Explain a simple function (~2K tok)',
        'Bugfix with clear stack trace (~5K tok)',
        'New moderate feature (~20K tok)',
        'Complex refactoring (~50K tok)',
        'Architectural redesign (~150K tok)',
      ],
      tipContent: (
        <>
          <strong className="text-green-300">Opus + Sonnet strategy:</strong> Opus 5.5 for <em>design and decisions</em> (50K tokens), Sonnet 5 for <em>implementation</em> (200K tokens). Total cost: ~$3.00 vs ~$5.00 with Opus for everything — ~40% savings. Often simpler: stay on Opus 5.5 and lower effort to medium/low for the routine part.
        </>
      ),
      cacheTitle: 'Prompt caching impact on long sessions',
      cacheDesc: 'In a typical session with a 2K token CLAUDE.md and 30 messages on Opus 5.5 (the default), caching reduces input cost by ~75%.',
      noCache: 'Without caching — 30 Opus 5.5 messages',
      withCache: 'With caching active — 30 Opus 5.5 messages',
      noCacheRows: [
        ['CLAUDE.md × 30 requests (2K × 30)', '60K input tokens'],
        ['System prompt × 30', '90K tokens'],
        ['Conversation (avg 1K/message)', '30K tokens'],
      ],
      withCacheRows: [
        ['Cache read (CLAUDE.md + system)', '150K × $0.20'],
        ['Cache write (first time)', '5K × $5.00'],
        ['New conversation', '30K × $4.00'],
      ],
      totalInput: 'Total input cost',
      infoContent: 'Claude Code automatically activates prompt caching for CLAUDE.md and system prompt. No configuration needed — it works implicitly every session.',
      tokeni: 'tokens',
    },
    tabSelectare: {
      title: 'When to use which model',
      desc: 'The basic rule in 2026: start with Opus 5.5 (default, effort medium), drop to Sonnet 5 or Haiku for speed, volume or cost, and move up to Fable 5.1 only when Opus at high effort is not enough. Before switching models, try adjusting effort.',
      decisionTitle: 'Quick decision guide',
      qas: [
        { q: 'Code completion, boilerplate, getter/setter, docstrings?',    a: 'Haiku',  color: 'text-green-400',  bg: 'border-green-500/20 bg-green-500/5' },
        { q: 'Quick explanation of a code block?',                          a: 'Haiku',  color: 'text-green-400',  bg: 'border-green-500/20 bg-green-500/5' },
        { q: 'CI automation with hundreds of files processed?',             a: 'Haiku',  color: 'text-green-400',  bg: 'border-green-500/20 bg-green-500/5' },
        { q: 'Bug fix with clear stack trace, want it fast and cheap?',     a: 'Sonnet', color: 'text-amber-400',  bg: 'border-amber-500/20 bg-amber-500/5' },
        { q: 'Subagents reading lots of code in parallel?',                 a: 'Sonnet', color: 'text-amber-400',  bg: 'border-amber-500/20 bg-amber-500/5' },
        { q: 'Generating tests for an existing module?',                    a: 'Sonnet', color: 'text-amber-400',  bg: 'border-amber-500/20 bg-amber-500/5' },
        { q: 'New feature, refactoring, code review — daily work?',         a: 'Opus',   color: 'text-purple-400', bg: 'border-purple-500/20 bg-purple-500/5' },
        { q: 'Architectural redesign or stack migration?',                  a: 'Opus',   color: 'text-purple-400', bg: 'border-purple-500/20 bg-purple-500/5' },
        { q: 'Critical production bug without clear reproduction?',         a: 'Opus',   color: 'text-purple-400', bg: 'border-purple-500/20 bg-purple-500/5' },
        { q: 'Full security audit of a critical module?',                   a: 'Opus',   color: 'text-purple-400', bg: 'border-purple-500/20 bg-purple-500/5' },
        { q: 'Opus 5.5 failed even at xhigh effort?',                       a: 'Fable 5.1', color: 'text-rose-400', bg: 'border-rose-500/20 bg-rose-500/5' },
        { q: 'Autonomous agent working for hours?',                         a: 'Fable 5.1', color: 'text-rose-400', bg: 'border-rose-500/20 bg-rose-500/5' },
      ],
      matrixTitle: 'Full matrix — scenarios vs models',
      matrixColScenario: 'Scenario',
      matrixRows: [
        ['Code completion / boilerplate',       '✓ Ideal',      '✓ Works',      '○ Overkill'],
        ['Bug with clear stack trace',          '○ Works',      '✓ Ideal',      '✓ Good'],
        ['Moderate feature (1-3 files)',        '✗ Weak',       '✓ Good',       '✓ Ideal'],
        ['Complex multi-file refactoring',      '✗ Weak',       '○ Works',      '✓ Ideal'],
        ['New architectural design',            '✗ No',         '○ Partial',    '✓ Ideal'],
        ['Framework / stack migration',         '✗ No',         '○ Partial',    '✓ Ideal'],
        ['Security code review',                '✗ Weak',       '✓ Good',       '✓ Ideal'],
        ['CI pipeline / volume automation',     '✓ Ideal',      '✓ Good',       '○ Too costly'],
        ['Unit test generation',                '○ Simple',     '✓ Ideal',      '✓ Good'],
        ['Production debug without repro',      '✗ No',         '○ Try it',     '✓ Ideal'],
      ],
      escalTitle: 'Escalation strategy',
      escalDesc: 'The first step is not switching models but raising effort. On Opus 5.5 go from medium to xhigh; only if it still does not converge, move to Fable 5.1 — with the same accumulated context.',
      escalCode: `# Step 1 — Opus 5.5 on default (effort medium)
> Debugging a race condition in the
  notification system.
  Files: lib/notifications.ts, workers/notify.ts

# Not converging? Raise effort, not the model:
> /effort xhigh
> Continue the analysis — the solution above is
  wrong because [X]. Check the event ordering
  in NotificationQueue.

# Still stuck? Escalate to Fable 5.1:
> /model fable
> Continue from where we left off.

# Solved. Routine implementation — back down:
> /model opus
> /effort medium
> Implement the solution proposed above.`,
      tipContent: (
        <>
          When switching models mid-session, the conversation context (all messages, files read) is <strong className="text-green-300">fully preserved</strong>. You don't lose progress — you only switch compute power.
        </>
      ),
      switchTitle: 'Switching model mid-session',
      switchLabel1: 'Available commands',
      switchLabel2: 'Opus → Sonnet flow (optional)',
      switchCode1: `# From the prompt, at any time:
> /model opus      # Opus 5.5
> /model sonnet    # Sonnet 5
> /model haiku     # Haiku 4.5
> /model fable     # Fable 5.1
> /model opusplan  # Opus in plan mode, Sonnet for execution

# /model <name> saves the choice as your default.
# This session only: /model → press "s"

# Check active model:
> /status

# Or via flag at launch (that session only):
claude --model opus`,
      switchCode2: `# Opus for DECISION (short):
/model opus
> ultrathink What is the best
  architecture for system X?
  Analyze 3 options.

# Sonnet for IMPLEMENTATION (long, ~2× cheaper):
/model sonnet
> Implement option 2 as proposed.
  Respect the constraints from the plan.

# Automatic: /model opusplan does exactly this.`,
    },
    tabConfigurare: {
      title: 'Model configuration',
      desc: 'You can set the model at several levels: settings.json (persistent), environment variable, CLI flag or /model in a session. The more specific level overrides the general one. Effort is configured separately, with the same logic.',
      priorityTitle: 'Configuration priority (ascending)',
      priorities: [
        { level: '4 — Lowest',          label: 'Account / plan default', val: 'Opus 5.5 (Pro, Max, Team, Enterprise, API)', color: 'border-zinc-700 bg-zinc-800/30',      badge: 'text-zinc-500'  },
        { level: '3',                    label: 'settings.json',          val: '{ "model": "opus" }',                        color: 'border-amber-500/20 bg-amber-500/5', badge: 'text-amber-400' },
        { level: '2',                    label: 'Environment variable',   val: 'ANTHROPIC_MODEL=sonnet',                     color: 'border-blue-500/20 bg-blue-500/5',   badge: 'text-blue-400'  },
        { level: '1 — Highest priority', label: '--model / /model',       val: 'claude --model haiku',                       color: 'border-purple-500/20 bg-purple-500/5', badge: 'text-purple-400'},
      ],
      settingsTitle: '.claude/settings.json',
      settingsDesc: 'Configured per project, versioned in repo. Applies to all sessions in that directory. You can use aliases (opus, sonnet, haiku, fable) — they automatically track the newest version.',
      settingsCode: `// .claude/settings.json
{
  "model": "opus",

  // Default effort + per-model override (optional):
  "effortLevel": "medium",
  "modelSettings": {
    "opus": { "effort": "high" }
  },

  // Tool permissions (optional):
  "permissions": {
    "allow": ["Bash(npm run *)", "Edit", "Read"],
    "deny": ["Bash(rm -rf *)"]
  }
}`,
      infoContent: (
        <>
          <code className="text-blue-300">.claude/settings.json</code> is versioned in git — the whole team gets the same default model for the project. Note: <code className="text-blue-300">/model</code> writes your choice to your user settings, so it becomes the default for new sessions.
        </>
      ),
      envTitle: 'Environment variables',
      envCode: `# Model for the launched session:
ANTHROPIC_MODEL=haiku claude -p "..."

# Which model each alias resolves to:
export ANTHROPIC_DEFAULT_OPUS_MODEL="claude-opus-5-5"
export ANTHROPIC_DEFAULT_SONNET_MODEL="claude-sonnet-5"
export ANTHROPIC_DEFAULT_HAIKU_MODEL="claude-haiku-4-5"
export ANTHROPIC_DEFAULT_FABLE_MODEL="claude-fable-5-1"

# Default model for subagents:
export CLAUDE_CODE_SUBAGENT_MODEL="sonnet"

# Global effort (overrides /effort and settings):
export CLAUDE_CODE_EFFORT_LEVEL="medium"

# In CI/CD (GitHub Actions):
env:
  ANTHROPIC_MODEL: haiku
  ANTHROPIC_API_KEY: \${{ secrets.ANTHROPIC_API_KEY }}`,
      apiTitle: 'Model selection in Anthropic SDK',
      apiDesc: 'If you build with the API directly, model is a simple parameter. You control reasoning depth via output_config.effort.',
      apiCode: `import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

// Haiku 4.5 — fast completion, minimal cost
const quickResponse = await client.messages.create({
  model: 'claude-haiku-4-5',
  max_tokens: 1024,
  messages: [{ role: 'user', content: promptSimple }],
})

// Sonnet 5 — fast and cheap, adaptive thinking by default
const devResponse = await client.messages.create({
  model: 'claude-sonnet-5',
  max_tokens: 16000,
  output_config: { effort: 'high' },
  messages: [{ role: 'user', content: promptComplex }],
})

// Opus 5.5 — recommended default. Thinking always on;
// default effort 'medium' — set it explicitly when it matters.
const archResponse = await client.messages.create({
  model: 'claude-opus-5-5',
  max_tokens: 16000,
  output_config: { effort: 'xhigh' },
  messages: [{ role: 'user', content: promptCritic }],
})

// Fable 5.1 — extreme problems. Thinking always on:
// omit the thinking parameter ('disabled' returns 400).
const extremeResponse = await client.messages.create({
  model: 'claude-fable-5-1',
  max_tokens: 16000,
  output_config: { effort: 'xhigh' },
  messages: [{ role: 'user', content: promptExtreme }],
})`,
      stratTitle: 'Configuration strategies per context',
      strats: [
        {
          ctx: 'Local development',
          where: 'default or .claude/settings.json',
          rationale: 'Opus 5.5 on medium effort covers daily work. Raise effort from within the session when a problem gets hard.',
        },
        {
          ctx: 'CI/CD pipelines',
          where: 'ENV var in CI config',
          rationale: 'Runs on hundreds of files on every push. Haiku output costs 4× less than Opus 5.5.',
        },
        {
          ctx: 'Heavy agentic session',
          where: '--model fable or /model fable',
          rationale: 'For hours-long tasks or problems Opus fails on. Switch back to Opus for routine implementation.',
        },
      ],
    },
    tabCapabilitati: {
      title: 'Capabilities and limitations per model',
      desc: 'Beyond intelligence and cost, models differ in concrete technical capabilities — context window, thinking, effort, max output.',
      thCap: 'Capability',
      capRows: [
        { cap: 'Context window',           h: '200K tokens', s: '1M tokens',   o: '1M tokens', f: '1M tokens' },
        { cap: 'Max output tokens',         h: '64K',         s: '128K',        o: '128K',      f: '128K' },
        { cap: 'Thinking',                  h: '✓ budget_tokens', s: '✓ adaptive', o: '✓ always on', f: '✓ always on' },
        { cap: 'Default effort',            h: '—',           s: 'high',        o: 'medium',    f: 'high' },
        { cap: 'Knowledge cutoff',          h: 'Feb 2025',    s: 'Jan 2026',    o: 'Jun 2026',  f: 'Jun 2026' },
        { cap: 'Tool use (Bash, Read etc)', h: '✓',           s: '✓',           o: '✓',         f: '✓' },
        { cap: 'Vision (images)',           h: '✓',           s: '✓',           o: '✓',         f: '✓' },
        { cap: 'Streaming',                 h: '✓',           s: '✓',           o: '✓',         f: '✓' },
        { cap: 'Prompt caching',            h: '✓',           s: '✓',           o: '✓',         f: '✓' },
        { cap: 'Batch API',                 h: '✓',           s: '✓',           o: '✓',         f: '✓' },
        { cap: 'Relative latency',          h: 'Lowest',      s: 'Low',         o: 'Moderate',  f: 'High — minutes on hard tasks' },
        { cap: 'Fast mode (API)',           h: '✗',           s: '✗',           o: '✓ $8/$40',  f: '✗' },
      ],
      thinkingTitle: 'Thinking — details per model',
      thinkingModels: [
        {
          thinking: true,
          budget: 'budget_tokens (classic style)',
          recommended: 'min 1,024, below max_tokens',
          note: 'The only current model still using classic extended thinking with budget_tokens. Does not support adaptive thinking or the effort parameter.',
        },
        {
          thinking: true,
          budget: 'adaptive — can be disabled',
          recommended: "effort: 'high' (default) / 'xhigh'",
          note: 'Adaptive thinking is on by default. budget_tokens returns a 400 — control depth via output_config.effort (low → max).',
        },
        {
          thinking: true,
          budget: 'always on — cannot be disabled',
          recommended: "effort: 'medium' (default) → 'xhigh'",
          note: "{ type: 'disabled' } and budget_tokens return a 400 at any effort. Default effort is medium (one level below Opus 5) — set it explicitly for hard tasks.",
        },
        {
          thinking: true,
          budget: 'always on — cannot be disabled',
          recommended: "omit thinking; effort: 'low' → 'max'",
          note: 'Only { type: "adaptive" } or omitting the parameter are accepted. The raw chain of thought is never returned — request display: "summarized" for a summary.',
        },
      ],
      noThinking: "Doesn't support thinking",
      budgetLabel: 'Budget:',
      recommendedLabel: 'Recommended:',
      strategiesTitle: '10 strategies for optimal cost',
      strategies: [
        { n: '01', title: 'Right model for each task',          desc: 'Haiku for simple, Sonnet for volume, Opus 5.5 for daily work, Fable 5.1 only for extremes. Cost difference: up to 10×.' },
        { n: '02', title: '/compact proactively at ~60% context', desc: 'Compress the conversation before hitting the limit. Don\'t wait for the warning — you act too late.' },
        { n: '03', title: 'Minimal but sufficient context',      desc: 'Claude reads needed files automatically. Don\'t paste code in the prompt — it adds useless tokens.' },
        { n: '04', title: 'Specify relevant files',             desc: 'Instead of "analyze the project", say "check lib/auth.ts". You eliminate scanning irrelevant files.' },
        { n: '05', title: 'Effort proportional to complexity',  desc: '/effort low → max controls how much the model thinks. Keep medium as the default and use ultrathink only on the turn that matters.' },
        { n: '06', title: 'Clean and focused sessions',         desc: 'One session = one task or related tasks. Topic changes accumulate useless context.' },
        { n: '07', title: 'Concise CLAUDE.md',                  desc: 'Every line in CLAUDE.md is added to every request. 200 lines = 200× more input tokens.' },
        { n: '08', title: 'One prompt, one goal',               desc: 'Atomic prompts produce better output with fewer tokens than prompts with 5 tasks.' },
        { n: '09', title: 'Opus for decisions, Sonnet for code', desc: 'Opus 5.5 analyzes and recommends (50K tokens), Sonnet 5 implements (200K tokens). ~40% savings — or /model opusplan.' },
        { n: '10', title: 'Monitor with /cost',                 desc: 'Run /cost periodically to see session consumption. You become aware of costly patterns.' },
      ],
    },
  },
} as const

// ── Animated bar ──────────────────────────────────────────────────────────────
function AnimBar({ pct, color }: { pct: number; color: string }) {
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
    <div ref={ref} className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-800">
      <div className={`h-full rounded-full transition-all duration-1000 ease-out ${color}`} style={{ width: `${w}%` }} />
    </div>
  )
}

// ── Shared helpers ────────────────────────────────────────────────────────────
function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
      <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-400" />
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

// ── Tab types ─────────────────────────────────────────────────────────────────
type TabId = 'modele' | 'preturi' | 'selectare' | 'configurare' | 'capabilitati'
interface Tab { id: TabId; label: string; icon: React.ReactNode }

// ── Model data ────────────────────────────────────────────────────────────────
interface ModelData {
  name: string; id: string
  icon: React.ReactNode
  color: string; bg: string; border: string
  intelligence: number; speed: number; costRel: number
  inputCost: string; outputCost: string; cacheRead: string; cacheWrite: string
  context: string; maxOutput: string
  thinking: boolean
}

const MODELS: ModelData[] = [
  {
    name: 'Claude Haiku 4.5',
    id: 'claude-haiku-4-5',
    icon: <Zap className="h-5 w-5" />,
    color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20',
    intelligence: 55, speed: 100, costRel: 10,
    inputCost: '$1.00', outputCost: '$5.00', cacheRead: '$0.10', cacheWrite: '$1.25',
    context: '200K', maxOutput: '64K',
    thinking: true,
  },
  {
    name: 'Claude Sonnet 5',
    id: 'claude-sonnet-5',
    icon: <Cpu className="h-5 w-5" />,
    color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20',
    intelligence: 85, speed: 75, costRel: 20,
    inputCost: '$2.00', outputCost: '$10.00', cacheRead: '$0.20', cacheWrite: '$2.50',
    context: '1M', maxOutput: '128K',
    thinking: true,
  },
  {
    name: 'Claude Opus 5.5',
    id: 'claude-opus-5-5',
    icon: <Brain className="h-5 w-5" />,
    color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20',
    intelligence: 95, speed: 55, costRel: 40,
    inputCost: '$4.00', outputCost: '$20.00', cacheRead: '$0.20', cacheWrite: '$5.00',
    context: '1M', maxOutput: '128K',
    thinking: true,
  },
  {
    name: 'Claude Fable 5.1',
    id: 'claude-fable-5-1',
    icon: <Sparkles className="h-5 w-5" />,
    color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20',
    intelligence: 100, speed: 40, costRel: 100,
    inputCost: '$10.00', outputCost: '$50.00', cacheRead: '$0.25', cacheWrite: '$12.50',
    context: '1M', maxOutput: '128K',
    thinking: true,
  },
]

// ── TAB: MODELE ───────────────────────────────────────────────────────────────
function TabModele() {
  const { lang } = useApp()
  const c = CONTENT[lang]
  const cm = c.tabModele

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-2 text-2xl font-bold text-white">{cm.title}</h2>
        <p className="text-zinc-400 leading-relaxed">{cm.desc}</p>
      </div>

      {/* Model cards */}
      <div className="grid gap-6 lg:grid-cols-2">
        {MODELS.map((m, idx) => (
          <div key={m.id} className={`flex flex-col rounded-xl border ${m.border} bg-zinc-900/50 p-6 transition-all hover:bg-zinc-900`}>
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`rounded-lg p-2.5 ${m.bg} ${m.color}`}>{m.icon}</div>
                <div>
                  <h3 className="text-lg font-bold text-white">{m.name}</h3>
                  <code className="text-xs text-zinc-600">{m.id}</code>
                </div>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${m.bg} ${m.color}`}>{c.models.badges[idx]}</span>
            </div>

            <p className={`mb-1 text-xs font-semibold ${m.color}`}>{c.models.taglines[idx]}</p>
            <p className="mb-4 flex-1 text-sm leading-relaxed text-zinc-400">{c.models.descriptions[idx]}</p>

            {/* Bars */}
            <div className="mb-4 space-y-2">
              {[
                { label: cm.barLabels[0], pct: m.intelligence, color: 'bg-purple-500' },
                { label: cm.barLabels[1], pct: m.speed,        color: 'bg-green-500' },
                { label: cm.barLabels[2], pct: m.costRel,      color: 'bg-amber-500' },
              ].map((b) => (
                <div key={b.label} className="flex items-center gap-3 text-xs">
                  <span className="w-20 text-zinc-500">{b.label}</span>
                  <AnimBar pct={b.pct} color={b.color} />
                  <span className="w-6 text-right text-zinc-600">{b.pct}</span>
                </div>
              ))}
            </div>

            {/* Context + output */}
            <div className="mb-4 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-lg bg-zinc-800/60 p-2">
                <div className="text-zinc-500">Context</div>
                <div className="mt-0.5 font-semibold text-zinc-300">{m.context}</div>
              </div>
              <div className="rounded-lg bg-zinc-800/60 p-2">
                <div className="text-zinc-500">Max output</div>
                <div className="mt-0.5 font-semibold text-zinc-300">{m.maxOutput}</div>
              </div>
              <div className={`rounded-lg p-2 ${m.thinking ? 'bg-purple-500/10' : 'bg-zinc-800/60'}`}>
                <div className="text-zinc-500">Thinking</div>
                <div className={`mt-0.5 text-xs font-semibold ${m.thinking ? 'text-purple-400' : 'text-zinc-600'}`}>
                  {m.thinking ? cm.thinkingYes : cm.thinkingNo}
                </div>
              </div>
            </div>

            {/* Best / Not for */}
            <div className="mb-4 grid gap-3 sm:grid-cols-2">
              <div>
                <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-green-400/70">{cm.idealFor}</span>
                <ul className="space-y-1">
                  {c.models.bestFor[idx].slice(0, 4).map((s) => (
                    <li key={s} className="flex items-start gap-1.5 text-xs text-zinc-400">
                      <CheckCircle className="mt-0.5 h-3 w-3 flex-shrink-0 text-green-400" />{s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-red-400/70">{cm.notFor}</span>
                <ul className="space-y-1">
                  {c.models.notFor[idx].slice(0, 4).map((s) => (
                    <li key={s} className="flex items-start gap-1.5 text-xs text-zinc-400">
                      <XCircle className="mt-0.5 h-3 w-3 flex-shrink-0 text-red-400" />{s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <CodeBlock code={c.models.examples[idx]} />
          </div>
        ))}
      </div>

      {/* Side-by-side comparison */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="mb-5 font-semibold text-white">{cm.compTitle}</h3>
        <div className="space-y-4">
          {[
            { label: cm.compRows[0], vals: [55, 85, 95, 100], colors: ['bg-green-500', 'bg-amber-500', 'bg-purple-500', 'bg-rose-500'] },
            { label: cm.compRows[1], vals: [100, 75, 55, 40],  colors: ['bg-green-500', 'bg-amber-500', 'bg-purple-500', 'bg-rose-500'] },
            { label: cm.compRows[2], vals: [10, 20, 40, 100],  colors: ['bg-green-500', 'bg-amber-500', 'bg-purple-500', 'bg-rose-500'] },
            { label: cm.compRows[3], vals: [50, 100, 100, 100], colors: ['bg-green-500', 'bg-amber-500', 'bg-purple-500', 'bg-rose-500'] },
          ].map((r) => (
            <div key={r.label}>
              <div className="mb-1.5 text-xs text-zinc-500">{r.label}</div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {r.vals.map((v, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-800">
                      <div className={`h-full rounded-full ${r.colors[i]}`} style={{ width: `${v}%` }} />
                    </div>
                    <span className="w-6 text-right text-xs text-zinc-600">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="mt-2 flex flex-wrap gap-6 text-xs">
            <span className="flex items-center gap-1.5"><span className="h-2 w-4 rounded-full bg-green-500" />Haiku 4.5</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-4 rounded-full bg-amber-500" />Sonnet 5</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-4 rounded-full bg-purple-500" />Opus 5.5</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-4 rounded-full bg-rose-500" />Fable 5.1</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── TAB: PREȚURI ──────────────────────────────────────────────────────────────
function TabPreturi() {
  const { lang } = useApp()
  const c = CONTENT[lang]
  const cp = c.tabPreturi

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-2 text-2xl font-bold text-white">{cp.title}</h2>
        <p className="text-zinc-400 leading-relaxed">{cp.desc}</p>
      </div>

      {/* Pricing table */}
      <div className="overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/60">
              <th className="px-4 py-3 text-left font-semibold text-zinc-400">Model</th>
              <th className="px-4 py-3 text-right font-semibold text-zinc-400">Input</th>
              <th className="px-4 py-3 text-right font-semibold text-zinc-400">Output</th>
              <th className="px-4 py-3 text-right font-semibold text-green-400">Cache read</th>
              <th className="px-4 py-3 text-right font-semibold text-amber-400">Cache write</th>
              <th className="px-4 py-3 text-center font-semibold text-zinc-400">{cp.thContext}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {MODELS.map((m) => (
              <tr key={m.id} className="bg-zinc-950 hover:bg-zinc-900/40 transition-colors">
                <td className="px-4 py-3">
                  <div className={`font-semibold ${m.color}`}>{m.name}</div>
                  <div className="font-mono text-xs text-zinc-600">{m.id}</div>
                </td>
                <td className="px-4 py-3 text-right font-mono text-xs text-zinc-300">{m.inputCost}<span className="text-zinc-600">/MTok</span></td>
                <td className="px-4 py-3 text-right font-mono text-xs text-zinc-300">{m.outputCost}<span className="text-zinc-600">/MTok</span></td>
                <td className="px-4 py-3 text-right font-mono text-xs text-green-400">{m.cacheRead}<span className="text-zinc-600">/MTok</span></td>
                <td className="px-4 py-3 text-right font-mono text-xs text-amber-400">{m.cacheWrite}<span className="text-zinc-600">/MTok</span></td>
                <td className="px-4 py-3 text-center text-xs text-zinc-400">{m.context} {cp.tokeni}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-zinc-600">{cp.footnote}</p>

      {/* Cost multiplier */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="mb-4 font-semibold text-white">{cp.costTitle}</h3>
        <div className="mb-6 overflow-x-auto rounded-xl border border-zinc-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/60">
                <th className="px-4 py-3 text-left font-semibold text-zinc-400">Task</th>
                <th className="px-4 py-3 text-center font-semibold text-green-400">Haiku</th>
                <th className="px-4 py-3 text-center font-semibold text-amber-400">Sonnet</th>
                <th className="px-4 py-3 text-center font-semibold text-purple-400">Opus</th>
                <th className="px-4 py-3 text-center font-semibold text-rose-400">Fable 5.1</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {[
                { haiku: '~$0.001', sonnet: '~$0.005', opus: '~$0.010', fable: '~$0.024' },
                { haiku: '~$0.004', sonnet: '~$0.010', opus: '~$0.020', fable: '~$0.050' },
                { haiku: '~$0.013', sonnet: '~$0.033', opus: '~$0.068', fable: '~$0.170' },
                { haiku: '~$0.031', sonnet: '~$0.083', opus: '~$0.168', fable: '~$0.420' },
                { haiku: '~$0.094', sonnet: '~$0.250', opus: '~$0.500', fable: '~$1.250' },
              ].map((r, i) => (
                <tr key={i} className="bg-zinc-950 hover:bg-zinc-900/30 transition-colors">
                  <td className="px-4 py-3 text-xs text-zinc-300">{cp.tasks[i]}</td>
                  <td className="px-4 py-3 text-center font-mono text-xs text-green-400">{r.haiku}</td>
                  <td className="px-4 py-3 text-center font-mono text-xs text-amber-400">{r.sonnet}</td>
                  <td className="px-4 py-3 text-center font-mono text-xs text-purple-400">{r.opus}</td>
                  <td className="px-4 py-3 text-center font-mono text-xs text-rose-400">{r.fable}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <TipBox>{cp.tipContent}</TipBox>
      </div>

      {/* Cache impact */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="mb-4 font-semibold text-white">{cp.cacheTitle}</h3>
        <p className="mb-4 text-sm text-zinc-400">{cp.cacheDesc}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
            <div className="mb-2 text-sm font-semibold text-red-300">{cp.noCache}</div>
            <div className="space-y-1 text-xs text-zinc-400">
              {cp.noCacheRows.map(([label, val]) => (
                <div key={label} className="flex justify-between"><span>{label}</span><span className="text-zinc-300">{val}</span></div>
              ))}
              <div className="mt-2 flex justify-between border-t border-zinc-700 pt-2 font-semibold">
                <span className="text-zinc-300">{cp.totalInput}</span>
                <span className="text-red-400">~$0.72</span>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4">
            <div className="mb-2 text-sm font-semibold text-green-300">{cp.withCache}</div>
            <div className="space-y-1 text-xs text-zinc-400">
              {cp.withCacheRows.map(([label, val]) => (
                <div key={label} className="flex justify-between"><span>{label}</span><span className="text-zinc-300">{val}</span></div>
              ))}
              <div className="mt-2 flex justify-between border-t border-zinc-700 pt-2 font-semibold">
                <span className="text-zinc-300">{cp.totalInput}</span>
                <span className="text-green-400">~$0.18</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-3">
          <InfoBox>{cp.infoContent}</InfoBox>
        </div>
      </div>
    </div>
  )
}

// ── TAB: SELECTARE ────────────────────────────────────────────────────────────
function TabSelectare() {
  const { lang } = useApp()
  const c = CONTENT[lang]
  const cs = c.tabSelectare

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-2 text-2xl font-bold text-white">{cs.title}</h2>
        <p className="text-zinc-400 leading-relaxed">{cs.desc}</p>
      </div>

      {/* Decision guide */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="mb-5 flex items-center gap-2 font-semibold text-white">
          <Gauge className="h-5 w-5 text-amber-400" /> {cs.decisionTitle}
        </h3>
        <div className="space-y-2">
          {cs.qas.map((r) => (
            <div key={r.q} className={`flex items-center justify-between rounded-lg border ${r.bg} px-4 py-3`}>
              <span className="text-sm text-zinc-300 flex-1 mr-4">{r.q}</span>
              <span className={`flex-shrink-0 font-bold text-sm ${r.color}`}>{r.a} →</span>
            </div>
          ))}
        </div>
      </div>

      {/* Decision matrix */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="mb-4 font-semibold text-white">{cs.matrixTitle}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">{cs.matrixColScenario}</th>
                <th className="pb-3 text-center text-xs font-semibold uppercase tracking-wider text-green-400">Haiku</th>
                <th className="pb-3 text-center text-xs font-semibold uppercase tracking-wider text-amber-400">Sonnet</th>
                <th className="pb-3 text-center text-xs font-semibold uppercase tracking-wider text-purple-400">Opus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {cs.matrixRows.map(([scenario, haiku, sonnet, opus], i) => (
                <tr key={i} className="odd:bg-zinc-800/20">
                  <td className="py-2.5 pr-4 text-xs text-zinc-400">{scenario}</td>
                  <td className={`py-2.5 text-center text-xs font-medium ${haiku.startsWith('✓') ? 'text-green-400' : haiku.startsWith('○') ? 'text-yellow-500' : 'text-zinc-600'}`}>{haiku}</td>
                  <td className={`py-2.5 text-center text-xs font-medium ${sonnet.startsWith('✓') ? 'text-amber-400' : sonnet.startsWith('○') ? 'text-yellow-500' : 'text-zinc-600'}`}>{sonnet}</td>
                  <td className={`py-2.5 text-center text-xs font-medium ${opus.startsWith('✓') ? 'text-purple-400' : opus.startsWith('○') ? 'text-yellow-500' : 'text-zinc-600'}`}>{opus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Escalation strategy */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="mb-4 flex items-center gap-2 font-semibold text-white">
          <ArrowRight className="h-5 w-5 text-amber-400" /> {cs.escalTitle}
        </h3>
        <p className="mb-4 text-sm text-zinc-400">{cs.escalDesc}</p>
        <CodeBlock code={cs.escalCode} />
        <div className="mt-3">
          <TipBox>{cs.tipContent}</TipBox>
        </div>
      </div>

      {/* Mid-session switch */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="mb-4 font-semibold text-white">{cs.switchTitle}</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <span className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-zinc-500">{cs.switchLabel1}</span>
            <CodeBlock code={cs.switchCode1} />
          </div>
          <div>
            <span className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-zinc-500">{cs.switchLabel2}</span>
            <CodeBlock code={cs.switchCode2} />
          </div>
        </div>
      </div>
    </div>
  )
}

// ── TAB: CONFIGURARE ──────────────────────────────────────────────────────────
function TabConfigurare() {
  const { lang } = useApp()
  const c = CONTENT[lang]
  const cc = c.tabConfigurare

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-2 text-2xl font-bold text-white">{cc.title}</h2>
        <p className="text-zinc-400 leading-relaxed">{cc.desc}</p>
      </div>

      {/* Priority pyramid */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="mb-4 font-semibold text-white">{cc.priorityTitle}</h3>
        <div className="space-y-2">
          {cc.priorities.map((r) => (
            <div key={r.level} className={`flex items-center gap-4 rounded-lg border ${r.color} px-4 py-3`}>
              <span className={`text-xs font-bold ${r.badge} w-36 flex-shrink-0`}>{r.level}</span>
              <span className="text-sm font-semibold text-zinc-200 w-40 flex-shrink-0">{r.label}</span>
              <code className="text-xs text-zinc-400 truncate">{r.val}</code>
            </div>
          ))}
        </div>
      </div>

      {/* settings.json */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-white">
          <Code2 className="h-5 w-5 text-amber-400" /> {cc.settingsTitle}
        </h3>
        <p className="mb-4 text-sm text-zinc-400">{cc.settingsDesc}</p>
        <CodeBlock code={cc.settingsCode} />
        <div className="mt-3">
          <InfoBox>{cc.infoContent}</InfoBox>
        </div>
      </div>

      {/* ENV var */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="mb-3 text-lg font-semibold text-white">{cc.envTitle}</h3>
        <CodeBlock code={cc.envCode} />
      </div>

      {/* API usage */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="mb-3 text-lg font-semibold text-white">{cc.apiTitle}</h3>
        <p className="mb-4 text-sm text-zinc-400">{cc.apiDesc}</p>
        <CodeBlock code={cc.apiCode} />
      </div>

      {/* Per-project strategy */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-white">{cc.stratTitle}</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { ...cc.strats[0], model: 'claude-opus-5-5',            color: 'border-purple-500/20 bg-purple-500/5', mc: 'text-purple-400' },
            { ...cc.strats[1], model: 'claude-haiku-4-5',    color: 'border-green-500/20 bg-green-500/5',  mc: 'text-green-400'  },
            { ...cc.strats[2], model: 'claude-fable-5-1',             color: 'border-rose-500/20 bg-rose-500/5',    mc: 'text-rose-400'   },
          ].map((r) => (
            <div key={r.ctx} className={`rounded-xl border ${r.color} p-4`}>
              <div className="mb-1 font-semibold text-white">{r.ctx}</div>
              <code className={`text-xs ${r.mc}`}>{r.model}</code>
              <div className="mt-1 text-[10px] text-zinc-500">via {r.where}</div>
              <p className="mt-3 text-xs text-zinc-400">{r.rationale}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── TAB: CAPABILITĂȚI ─────────────────────────────────────────────────────────
function TabCapabilitati() {
  const { lang } = useApp()
  const c = CONTENT[lang]
  const ck = c.tabCapabilitati

  const thinkingModelNames = ['Haiku 4.5', 'Sonnet 5', 'Opus 5.5', 'Fable 5.1']
  const thinkingModelColors = [
    { color: 'border-zinc-700 bg-zinc-800/30',      tc: 'text-zinc-500'  },
    { color: 'border-amber-500/20 bg-amber-500/5',  tc: 'text-amber-400' },
    { color: 'border-purple-500/20 bg-purple-500/5',tc: 'text-purple-400'},
    { color: 'border-rose-500/20 bg-rose-500/5',    tc: 'text-rose-400'  },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-2 text-2xl font-bold text-white">{ck.title}</h2>
        <p className="text-zinc-400 leading-relaxed">{ck.desc}</p>
      </div>

      {/* Capabilities matrix */}
      <div className="overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/60">
              <th className="px-4 py-3 text-left font-semibold text-zinc-400">{ck.thCap}</th>
              <th className="px-4 py-3 text-center font-semibold text-green-400">Haiku 4.5</th>
              <th className="px-4 py-3 text-center font-semibold text-amber-400">Sonnet 5</th>
              <th className="px-4 py-3 text-center font-semibold text-purple-400">Opus 5.5</th>
              <th className="px-4 py-3 text-center font-semibold text-rose-400">Fable 5.1</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {ck.capRows.map((r, i) => (
              <tr key={i} className="bg-zinc-950 hover:bg-zinc-900/30 transition-colors">
                <td className="px-4 py-3 font-medium text-zinc-300">{r.cap}</td>
                <td className={`px-4 py-3 text-center text-xs ${(r.h as string) === '✗' ? 'text-zinc-600' : (r.h as string).includes('✓') ? 'text-green-400' : 'text-green-300'}`}>{r.h}</td>
                <td className={`px-4 py-3 text-center text-xs ${(r.s as string) === '✗' ? 'text-zinc-600' : (r.s as string).includes('✓') ? 'text-amber-400' : 'text-amber-300'}`}>{r.s}</td>
                <td className={`px-4 py-3 text-center text-xs ${(r.o as string) === '✗' ? 'text-zinc-600' : (r.o as string).includes('✓') ? 'text-purple-400' : 'text-purple-300'}`}>{r.o}</td>
                <td className={`px-4 py-3 text-center text-xs ${(r.f as string) === '✗' ? 'text-zinc-600' : (r.f as string).includes('✓') ? 'text-rose-400' : 'text-rose-300'}`}>{r.f}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Extended thinking per model */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="mb-4 font-semibold text-white">{ck.thinkingTitle}</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ck.thinkingModels.map((m, idx) => (
            <div key={thinkingModelNames[idx]} className={`rounded-xl border ${thinkingModelColors[idx].color} p-4`}>
              <div className={`mb-2 font-bold ${thinkingModelColors[idx].tc}`}>{thinkingModelNames[idx]}</div>
              {m.thinking ? (
                <>
                  <div className="mb-1 text-xs text-zinc-400">{ck.budgetLabel} <span className="text-zinc-300">{m.budget}</span></div>
                  <div className="mb-2 text-xs text-zinc-400">{ck.recommendedLabel} <span className="text-zinc-300">{m.recommended}</span></div>
                </>
              ) : (
                <div className="mb-2 rounded bg-zinc-800 px-2 py-1 text-xs text-zinc-500">{ck.noThinking}</div>
              )}
              <p className="text-xs text-zinc-500">{m.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 10 strategies */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="mb-5 flex items-center gap-2 font-semibold text-white">
          <DollarSign className="h-5 w-5 text-amber-400" /> {ck.strategiesTitle}
        </h3>
        <div className="grid gap-3 md:grid-cols-2">
          {ck.strategies.map((s) => (
            <div key={s.n} className="flex items-start gap-3 rounded-lg border border-zinc-800 bg-zinc-950/50 p-4">
              <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-amber-500/10 font-mono text-xs font-bold text-amber-400">{s.n}</span>
              <div>
                <h4 className="mb-1 text-sm font-semibold text-white">{s.title}</h4>
                <p className="text-xs leading-relaxed text-zinc-400">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
export default function ModelsGuide() {
  const { lang } = useApp()
  const c = CONTENT[lang]
  const [activeTab, setActiveTab] = useState<TabId>('modele')

  const TABS: Tab[] = [
    { id: 'modele',       label: c.tabs[0], icon: <Brain className="h-4 w-4" /> },
    { id: 'preturi',      label: c.tabs[1], icon: <DollarSign className="h-4 w-4" /> },
    { id: 'selectare',    label: c.tabs[2], icon: <Gauge className="h-4 w-4" /> },
    { id: 'configurare',  label: c.tabs[3], icon: <Settings className="h-4 w-4" /> },
    { id: 'capabilitati', label: c.tabs[4], icon: <BarChart3 className="h-4 w-4" /> },
  ]

  const renderTab = () => {
    switch (activeTab) {
      case 'modele':       return <TabModele />
      case 'preturi':      return <TabPreturi />
      case 'selectare':    return <TabSelectare />
      case 'configurare':  return <TabConfigurare />
      case 'capabilitati': return <TabCapabilitati />
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      {/* Header */}
      <div className="mb-10">
        <div className="mb-3 flex items-center gap-3">
          <div className="rounded-xl bg-purple-500/10 p-2.5">
            <Cpu className="h-6 w-6 text-purple-400" />
          </div>
          <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-400">
            {c.badge}
          </span>
        </div>
        <h1 className="mb-3 text-4xl font-bold text-white">
          {c.title}
        </h1>
        <p className="max-w-2xl text-lg text-zinc-400 leading-relaxed">
          {c.subtitle}
        </p>
      </div>

      {/* Stats strip */}
      <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { ...c.stats[0], color: 'text-purple-400', border: 'border-purple-500/20 bg-purple-500/5' },
          { ...c.stats[1], color: 'text-blue-400',   border: 'border-blue-500/20 bg-blue-500/5' },
          { ...c.stats[2], color: 'text-amber-400',  border: 'border-amber-500/20 bg-amber-500/5' },
          { ...c.stats[3], color: 'text-green-400',  border: 'border-green-500/20 bg-green-500/5' },
        ].map((s) => (
          <div key={s.value} className={`rounded-xl border ${s.border} p-4`}>
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

      <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950/50 p-6 sm:p-8">
        {renderTab()}
      </div>
    </div>
  )
}
