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
    badge: 'Familia Claude 4 & 5',
    title: 'Modele și Pricing',
    subtitle: 'Haiku, Sonnet, Opus, Fable — patru modele cu profile complet diferite. Prețuri reale, matrice de decizie, configurare per proiect și capabilități tehnice complete.',
    stats: [
      { value: '4',    label: 'modele curente',      sub: 'Haiku / Sonnet / Opus / Fable 5' },
      { value: '1M',   label: 'context window',      sub: 'toate în afară de Haiku (200K)' },
      { value: '10×',  label: 'diferență de cost',   sub: 'Haiku vs Fable 5 output' },
      { value: '90%',  label: 'task-uri cu Sonnet',  sub: 'development obișnuit' },
    ],
    tabs: ['Modele', 'Prețuri', 'Selectare', 'Configurare', 'Capabilități'],
    models: {
      badges: ['Rapid & Ieftin', 'Echilibrat', 'Maximum Opus', 'Vârf de gamă'],
      taglines: [
        'Volum mare, latență mică, cost minim',
        'Raportul calitate/cost optim — default recomandat',
        'Cel mai capabil Opus — pentru probleme care contează',
        'Raționament extrem și agenți long-horizon',
      ],
      descriptions: [
        'Cel mai rapid și cel mai ieftin model Claude. Optimizat pentru task-uri high-volume care nu necesită raționament complex. Răspunde aproape instant — ideal pentru automatizări și feedback în timp real.',
        'Excelent echilibru între inteligență, viteză și cost — aproape de calitatea Opus la coding. Gestionează 90% din task-urile de development. Adaptive thinking activ implicit, până la 128K output tokens.',
        'Cel mai capabil model Opus — raționament excepțional pentru probleme complexe, ambigue sau cu consecințe mari, la $5/$25 per MTok. Escaladarea standard când Sonnet nu e suficient.',
        'Cel mai inteligent model Anthropic disponibil public. Thinking mereu activ (nu se poate dezactiva), sesiuni agentice care rulează minute sau ore în autonomie. Îl folosești pentru problemele pe care niciun alt model nu le rezolvă.',
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
          'Development de zi cu zi',
          'Feature-uri noi de complexitate medie',
          'Code review și debugging',
          'Refactorizări moderate (2-5 fișiere)',
          'Generare teste unitare și de integrare',
        ],
        [
          'Redesign arhitectural major',
          'Migrări complexe (REST → tRPC, etc.)',
          'Debugging critic de producție fără repro',
          'Security audit și analize de risc',
          'Decizii cu impact mare de business',
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
          'Redesign arhitectural complet',
          'Probleme critice cu ambiguitate extremă',
        ],
        [
          'Completare cod simplu → Haiku',
          'Development zilnic → Sonnet',
          'Sesiuni de explorare și prototipare',
          'Generare boilerplate',
        ],
        [
          'Development zilnic → Sonnet 5',
          'Task-uri rutiniere — cost dublu față de Opus',
          'Răspunsuri rapide — turele pot dura minute',
          'Organizații cu zero data retention',
        ],
      ],
      examples: [
        `# Activare în Claude Code:
claude --model claude-haiku-4-5

# Sau în .claude/settings.json:
{ "model": "claude-haiku-4-5" }

# Ideal pentru:
> Generează getterele pentru
  interfața UserProfile.ts
> Explică în 2 linii ce face
  această funcție.`,
        `# Default în Claude Code:
claude  # Sonnet automat

# Explicit:
claude --model claude-sonnet-5

# Ideal pentru:
> Implementează pagination
  cursor-based în lib/api.ts
> think Refactorizează AuthContext
  pentru a elimina prop drilling.`,
        `# Activare:
claude --model claude-opus-4-8

# Sau în sesiune:
> /model opus

# Ideal pentru:
> ultrathink Migrează autentificarea
  de la cookies la JWT stateless,
  menținând sesiunile active.
> Analizează implicațiile de
  securitate ale acestei migrări.`,
        `# Activare:
claude --model claude-fable-5

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
      desc: 'Patru modele cu profile distincte — nu sunt variante ale aceluiași model. Fiecare e optimizat pentru o clasă diferită de probleme. Claude Fable 5 e vârful gamei: primul model din familia Claude 5, gândit pentru raționament extrem și agenți long-horizon.',
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
      desc: 'Prețurile sunt per milion de tokeni (MTok). Cu prompt caching activ, costul input scade la ~10% — esențial pentru sesiunile lungi cu CLAUDE.md consistent.',
      thContext: 'Context',
      footnote: '* Prețuri aproximative per milion tokeni (MTok) — verifică anthropic.com/pricing pentru valorile curente.',
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
          <strong className="text-green-300">Strategia Opus + Sonnet:</strong> Folosește Opus pentru <em>design și decizie</em> (50K tokeni), Sonnet pentru <em>implementare</em> (200K tokeni). Costul total: ~$4.25 față de ~$6.25 cu Opus pentru tot — economie de ~30%, și mai mare dacă escaladezi doar decizia la Fable 5.
        </>
      ),
      cacheTitle: 'Impactul prompt caching pe sesiunile lungi',
      cacheDesc: 'Într-o sesiune tipică cu CLAUDE.md de 2K tokeni și 30 de mesaje, caching-ul reduce costul de input cu ~60%.',
      noCache: 'Fără caching — 30 mesaje Sonnet',
      withCache: 'Cu caching activ — 30 mesaje Sonnet',
      noCacheRows: [
        ['CLAUDE.md × 30 cereri (2K × 30)', '60K tokeni input'],
        ['System prompt × 30', '90K tokeni'],
        ['Conversație (medie 1K/mesaj)', '30K tokeni'],
      ],
      withCacheRows: [
        ['Cache read (CLAUDE.md + system)', '150K × $0.30'],
        ['Cache write (prima dată)', '5K × $3.75'],
        ['Conversație nouă', '30K × $3.00'],
      ],
      totalInput: 'Total input cost',
      infoContent: 'Claude Code activează prompt caching automat pentru CLAUDE.md și system prompt. Nu trebuie configurat nimic — funcționează implicit la fiecare sesiune.',
      tokeni: 'tokeni',
    },
    tabSelectare: {
      title: 'Când să folosești care model',
      desc: 'Regula de bază: pornești cu Sonnet (default), escaladezi la Opus când Sonnet nu e suficient, și cobori la Haiku pentru task-uri mecanice sau high-volume.',
      decisionTitle: 'Ghid de decizie rapidă',
      qas: [
        { q: 'Completare cod, boilerplate, getter/setter, docstrings?',   a: 'Haiku',  color: 'text-green-400',  bg: 'border-green-500/20 bg-green-500/5' },
        { q: 'Explicație rapidă a unui bloc de cod?',                     a: 'Haiku',  color: 'text-green-400',  bg: 'border-green-500/20 bg-green-500/5' },
        { q: 'CI automation cu sute de fișiere procesate?',               a: 'Haiku',  color: 'text-green-400',  bg: 'border-green-500/20 bg-green-500/5' },
        { q: 'Bug fix cu stack trace clar, 1-2 fișiere?',                a: 'Sonnet', color: 'text-amber-400',  bg: 'border-amber-500/20 bg-amber-500/5' },
        { q: 'Feature nouă de complexitate medie?',                       a: 'Sonnet', color: 'text-amber-400',  bg: 'border-amber-500/20 bg-amber-500/5' },
        { q: 'Refactorizare 2-5 fișiere cu logică clară?',               a: 'Sonnet', color: 'text-amber-400',  bg: 'border-amber-500/20 bg-amber-500/5' },
        { q: 'Code review cu focus pe securitate sau performanță?',       a: 'Sonnet', color: 'text-amber-400',  bg: 'border-amber-500/20 bg-amber-500/5' },
        { q: 'Sonnet a eșuat sau răspunsul e prea vag?',                 a: 'Opus',   color: 'text-purple-400', bg: 'border-purple-500/20 bg-purple-500/5' },
        { q: 'Redesign arhitectural sau migrare de stack?',               a: 'Opus',   color: 'text-purple-400', bg: 'border-purple-500/20 bg-purple-500/5' },
        { q: 'Bug critic de producție fără reproducere clară?',          a: 'Opus',   color: 'text-purple-400', bg: 'border-purple-500/20 bg-purple-500/5' },
        { q: 'Security audit complet al unui modul critic?',              a: 'Opus',   color: 'text-purple-400', bg: 'border-purple-500/20 bg-purple-500/5' },
        { q: 'Agent long-horizon sau problemă la care Opus a eșuat?',     a: 'Fable 5', color: 'text-rose-400',  bg: 'border-rose-500/20 bg-rose-500/5' },
      ],
      matrixTitle: 'Matrice completă — scenarii vs modele',
      matrixColScenario: 'Scenariu',
      matrixRows: [
        ['Completare cod / boilerplate',         '✓ Ideal',     '✓ Merge',      '✗ Overkill'],
        ['Bug cu stack trace clar',              '○ Merge',     '✓ Ideal',      '✗ Overkill'],
        ['Feature moderată (1-3 fișiere)',        '✗ Slab',      '✓ Ideal',      '○ Inutil'],
        ['Refactorizare complexă multi-fișier',  '✗ Slab',      '✓ Bun',        '○ Escaladare'],
        ['Design arhitectural nou',               '✗ Nu',        '○ Parțial',    '✓ Ideal'],
        ['Migrare framework / stack change',      '✗ Nu',        '✗ Insuficient','✓ Ideal'],
        ['Code review de securitate',             '✗ Slab',      '✓ Bun',        '○ Audit critic'],
        ['CI pipeline / automatizare volum',      '✓ Ideal',     '○ Prea scump', '✗ Nu'],
        ['Generare teste unitare',                '○ Simple',    '✓ Ideal',      '✗ Overkill'],
        ['Debug producție fără repro',            '✗ Nu',        '○ Încearcă',   '✓ Ideal'],
      ],
      escalTitle: 'Strategia de escaladare',
      escalDesc: 'Nu mergi direct la Opus — testezi cu Sonnet primul. Dacă Sonnet eșuează, escaladezi cu același context acumulat. Economia e semnificativă.',
      escalCode: `# Pasul 1 — încearcă cu Sonnet (default)
> megathink Debughez un race condition
  în sistemul de notificări.
  Fișiere: lib/notifications.ts, workers/notify.ts

# Dacă Sonnet nu convergea la o soluție clară:
> /model opus
> Continuă analiza — suntem blocați pe
  race condition-ul din NotificationQueue.
  Soluția lui Sonnet nu era corectă pentru că [X].

# Opus rezolvă. Implementarea o faci cu Sonnet:
> /model sonnet
> Implementează soluția propusă de mai sus.
  Contextul e complet — scrie codul.`,
      tipContent: (
        <>
          Schimbând modelul în mijlocul sesiunii, contextul conversației (toate mesajele, fișierele citite) se <strong className="text-green-300">păstrează complet</strong>. Nu pierzi progresul — schimbi doar puterea de calcul.
        </>
      ),
      switchTitle: 'Schimbarea modelului în sesiune',
      switchLabel1: 'Comenzi disponibile',
      switchLabel2: 'Flux Opus → Sonnet recomandat',
      switchCode1: `# Din prompt, oricând:
> /model opus
> /model sonnet
> /model haiku

# Cu ID complet:
> /model claude-opus-4-8

# Verifică modelul activ:
> /status

# Sau prin flag la lansare:
claude --model claude-opus-4-8`,
      switchCode2: `# Opus pentru DECIZIE (costisitor, scurt):
/model opus
> ultrathink Care e cea mai bună
  arhitectură pentru sistemul X?
  Analizează 3 opțiuni.

# Sonnet pentru IMPLEMENTARE (ieftin, lung):
/model sonnet
> Implementează opțiunea 2 propusă.
  Respectă constrângerile din plan.`,
    },
    tabConfigurare: {
      title: 'Configurare model',
      desc: 'Poți seta modelul la patru niveluri: CLI flag (sesiune), settings.json (proiect), variabilă de mediu (global) sau API (programmatic). Fiecare nivel suprascrie cel anterior.',
      priorityTitle: 'Prioritate configurare (crescător)',
      priorities: [
        { level: '4 — Cel mai mic', label: 'Default hardcodat',       val: 'claude-sonnet-5',                        color: 'border-zinc-700 bg-zinc-800/30',     badge: 'text-zinc-500'  },
        { level: '3',               label: 'Variabilă de mediu',       val: 'ANTHROPIC_MODEL=claude-sonnet-5',        color: 'border-blue-500/20 bg-blue-500/5',  badge: 'text-blue-400'  },
        { level: '2',               label: '.claude/settings.json',    val: '{ "model": "claude-opus-4-8" }',           color: 'border-amber-500/20 bg-amber-500/5',badge: 'text-amber-400' },
        { level: '1 — Prioritate maximă', label: 'CLI flag --model',  val: 'claude --model claude-haiku-4-5', color: 'border-purple-500/20 bg-purple-500/5',badge: 'text-purple-400'},
      ],
      settingsTitle: '.claude/settings.json',
      settingsDesc: 'Configurat per proiect, versionat în repo. Se aplică tuturor sesiunilor din directorul respectiv.',
      settingsCode: `// .claude/settings.json
{
  "model": "claude-sonnet-5",

  // Permisiuni tool-uri (opțional):
  "permissions": {
    "allow": ["Bash(npm run *)", "Edit", "Read"],
    "deny": ["Bash(rm -rf *)"]
  },

  // Nivel de aprobare auto (opțional):
  "autoApprove": ["Read", "Glob", "Grep"]
}`,
      infoContent: (
        <>
          <code className="text-blue-300">.claude/settings.json</code> e versionat în git — toată echipa primește același model default pentru proiect. Ideal pentru a seta Haiku în pipelines CI și Sonnet în development.
        </>
      ),
      envTitle: 'Variabile de mediu',
      envCode: `# ~/.bashrc sau ~/.zshrc — model global personal:
export ANTHROPIC_MODEL="claude-sonnet-5"

# Sau per sesiune de terminal:
ANTHROPIC_MODEL=claude-haiku-4-5 claude -p "..."

# În CI/CD (GitHub Actions):
env:
  ANTHROPIC_MODEL: claude-haiku-4-5
  ANTHROPIC_API_KEY: \${{ secrets.ANTHROPIC_API_KEY }}`,
      apiTitle: 'Selectare model în Anthropic SDK',
      apiDesc: 'Dacă construiești cu API-ul direct, modelul e un parametru simplu. Combini cu extended thinking pentru control complet.',
      apiCode: `import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

// Haiku — completare rapidă, cost minim
const quickResponse = await client.messages.create({
  model: 'claude-haiku-4-5',
  max_tokens: 1024,
  messages: [{ role: 'user', content: promptSimple }],
})

// Sonnet — development obișnuit cu adaptive thinking
const devResponse = await client.messages.create({
  model: 'claude-sonnet-5',
  max_tokens: 16000,
  thinking: { type: 'adaptive' },
  output_config: { effort: 'high' },
  messages: [{ role: 'user', content: promptComplex }],
})

// Opus — decizie arhitecturală (effort maxim)
const archResponse = await client.messages.create({
  model: 'claude-opus-4-8',
  max_tokens: 16000,
  thinking: { type: 'adaptive' },
  output_config: { effort: 'xhigh' },
  messages: [{ role: 'user', content: promptCritic }],
})

// Fable 5 — probleme extreme. Thinking e mereu activ:
// omite parametrul (setarea explicită returnează 400).
const extremeResponse = await client.messages.create({
  model: 'claude-fable-5',
  max_tokens: 16000,
  output_config: { effort: 'xhigh' },
  messages: [{ role: 'user', content: promptExtrem }],
})`,
      stratTitle: 'Strategii de configurare per context',
      strats: [
        {
          ctx: 'Development local',
          where: '.claude/settings.json',
          rationale: 'Cel mai echilibrat pentru task-uri zilnice. Poți escalada la Opus din sesiune.',
        },
        {
          ctx: 'CI/CD pipelines',
          where: 'ENV var în CI config',
          rationale: 'Rulează pe sute de fișiere la fiecare push. Haiku reduce costul cu 5-10× față de Sonnet.',
        },
        {
          ctx: 'Sesiune de arhitectură',
          where: '--model flag sau /model opus',
          rationale: 'Sesiune dedicată pentru decizii mari. Schimbi înapoi la Sonnet pentru implementare.',
        },
      ],
    },
    tabCapabilitati: {
      title: 'Capabilități și limitări per model',
      desc: 'Dincolo de inteligență și cost, modelele diferă în capabilități tehnice concrete — context window, extended thinking, tool use, output maxim.',
      thCap: 'Capabilitate',
      capRows: [
        { cap: 'Context window',           h: '200K tokeni', s: '1M tokeni',   o: '1M tokeni', f: '1M tokeni' },
        { cap: 'Max output tokens',         h: '64K',         s: '128K',        o: '128K',      f: '128K' },
        { cap: 'Thinking',                  h: '✓ budget_tokens', s: '✓ adaptive + effort', o: '✓ adaptive + effort', f: '✓ mereu activ' },
        { cap: 'Tool use (Bash, Read etc)', h: '✓',           s: '✓',           o: '✓',         f: '✓' },
        { cap: 'Vision (imagini)',           h: '✓',           s: '✓',           o: '✓',         f: '✓' },
        { cap: 'Streaming',                  h: '✓',           s: '✓',           o: '✓',         f: '✓' },
        { cap: 'Prompt caching',             h: '✓',           s: '✓',           o: '✓',         f: '✓' },
        { cap: 'Batch API',                  h: '✓',           s: '✓',           o: '✓',         f: '✓' },
        { cap: 'Latență medie',              h: '~1-3s',       s: '~5-15s',      o: '~15-60s',   f: 'minute pe task grele' },
        { cap: 'Rate limit (RPM implicit)', h: 'Ridicat',     s: 'Mediu',       o: 'Scăzut',    f: 'Scăzut' },
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
          budget: 'adaptive — modelul decide singur',
          recommended: "effort: 'high' (default) / 'xhigh'",
          note: 'Adaptive thinking e activ implicit. budget_tokens returnează eroare 400 — controlezi adâncimea prin output_config.effort (low → max).',
        },
        {
          thinking: true,
          budget: 'adaptive — modelul decide singur',
          recommended: "effort: 'xhigh' pentru coding/agentic",
          note: 'Maximul de raționament din tier-ul Opus. effort xhigh e default-ul Claude Code.',
        },
        {
          thinking: true,
          budget: 'mereu activ — nu se poate dezactiva',
          recommended: "omite thinking; effort: 'low' → 'max'",
          note: 'Setarea explicită a parametrului thinking returnează 400. Chain of thought brut nu e returnat niciodată — cere display: "summarized" pentru rezumat.',
        },
      ],
      noThinking: 'Nu suportă thinking',
      budgetLabel: 'Budget:',
      recommendedLabel: 'Recomandat:',
      strategiesTitle: '10 strategii pentru cost optim',
      strategies: [
        { n: '01', title: 'Modelul potrivit pentru fiecare task',    desc: 'Haiku pentru simplu, Sonnet pentru development, Opus pentru critic. Diferența de cost: 5×–10×.' },
        { n: '02', title: '/compact proactiv la ~60% context',        desc: 'Comprimă conversația înainte de a ajunge la limită. Nu aștepta warning-ul — acționezi prea târziu.' },
        { n: '03', title: 'Context minimal dar suficient',            desc: 'Claude citește automat fișierele necesare. Nu paste cod în prompt — adaugă tokeni inutili.' },
        { n: '04', title: 'Specifică fișierele relevante',            desc: 'În loc de "analizează proiectul", spune "verifică lib/auth.ts". Elimini scanarea de fișiere irelevante.' },
        { n: '05', title: 'think proportional cu complexitatea',      desc: 'think/megathink/ultrathink: 10K/32K/128K tokeni interni. Alege minimul suficient.' },
        { n: '06', title: 'Sesiuni curate și focusate',              desc: 'O sesiune = un task sau task-uri înrudite. Schimbările de subiect acumulează context inutil.' },
        { n: '07', title: 'CLAUDE.md concis',                         desc: 'Fiecare linie din CLAUDE.md se adaugă la fiecare request. 200 linii = 200× mai mulți tokeni de input.' },
        { n: '08', title: 'Un prompt, un obiectiv',                   desc: 'Prompturi atomice produc output mai bun cu mai puțini tokeni față de prompturi cu 5 task-uri.' },
        { n: '09', title: 'Opus pentru decizie, Sonnet pentru cod',  desc: 'Opus analizează și recomandă (50K tokeni), Sonnet implementează (200K tokeni). Economie ~30%.' },
        { n: '10', title: 'Monitorizează cu /cost',                   desc: 'Rulează /cost periodic pentru a vedea consumul sesiunii. Devii conștient de pattern-urile costisitoare.' },
      ],
    },
  },
  en: {
    badge: 'Claude 4 & 5 Family',
    title: 'Models & Pricing',
    subtitle: 'Haiku, Sonnet, Opus, Fable — four models with completely different profiles. Real prices, decision matrix, per-project configuration and full technical capabilities.',
    stats: [
      { value: '4',    label: 'current models',      sub: 'Haiku / Sonnet / Opus / Fable 5' },
      { value: '1M',   label: 'context window',      sub: 'all except Haiku (200K)' },
      { value: '10×',  label: 'cost difference',     sub: 'Haiku vs Fable 5 output' },
      { value: '90%',  label: 'tasks with Sonnet',   sub: 'everyday development' },
    ],
    tabs: ['Models', 'Pricing', 'Selection', 'Configuration', 'Capabilities'],
    models: {
      badges: ['Fast & Cheap', 'Balanced', 'Maximum Opus', 'Top of range'],
      taglines: [
        'High volume, low latency, minimal cost',
        'Optimal quality/cost ratio — recommended default',
        'Most capable Opus — for problems that matter',
        'Extreme reasoning and long-horizon agents',
      ],
      descriptions: [
        'The fastest and cheapest Claude model. Optimized for high-volume tasks that don\'t require complex reasoning. Responds almost instantly — ideal for automations and real-time feedback.',
        'Excellent balance between intelligence, speed and cost — near-Opus quality on coding. Handles 90% of development tasks. Adaptive thinking on by default, up to 128K output tokens.',
        'The most capable Opus model — exceptional reasoning for complex, ambiguous or high-stakes problems, at $5/$25 per MTok. The standard escalation when Sonnet isn\'t enough.',
        'The most intelligent publicly available Anthropic model. Thinking is always on (cannot be disabled), agentic sessions that run for minutes or hours autonomously. Use it for problems no other model can solve.',
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
          'Day-to-day development',
          'New features of medium complexity',
          'Code review and debugging',
          'Moderate refactoring (2-5 files)',
          'Generating unit and integration tests',
        ],
        [
          'Major architectural redesign',
          'Complex migrations (REST → tRPC, etc.)',
          'Critical production debugging without repro',
          'Security audits and risk analysis',
          'High-impact business decisions',
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
          'Complete architectural redesign',
          'Critical problems with extreme ambiguity',
        ],
        [
          'Simple code completion → Haiku',
          'Daily development → Sonnet',
          'Exploration and prototyping sessions',
          'Boilerplate generation',
        ],
        [
          'Daily development → Sonnet 5',
          'Routine tasks — double the cost of Opus',
          'Quick answers — turns can take minutes',
          'Organizations with zero data retention',
        ],
      ],
      examples: [
        `# Enable in Claude Code:
claude --model claude-haiku-4-5

# Or in .claude/settings.json:
{ "model": "claude-haiku-4-5" }

# Ideal for:
> Generate getters for
  the UserProfile.ts interface
> Explain in 2 lines what
  this function does.`,
        `# Default in Claude Code:
claude  # Sonnet automatically

# Explicit:
claude --model claude-sonnet-5

# Ideal for:
> Implement cursor-based pagination
  in lib/api.ts
> think Refactor AuthContext
  to eliminate prop drilling.`,
        `# Enable:
claude --model claude-opus-4-8

# Or mid-session:
> /model opus

# Ideal for:
> ultrathink Migrate authentication
  from cookies to stateless JWT,
  keeping active sessions intact.
> Analyze the security implications
  of this migration.`,
        `# Enable:
claude --model claude-fable-5

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
      desc: 'Four models with distinct profiles — they are not variants of the same model. Each is optimized for a different class of problems. Claude Fable 5 is the top of the range: the first model in the Claude 5 family, built for extreme reasoning and long-horizon agents.',
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
      desc: 'Prices are per million tokens (MTok). With prompt caching active, input cost drops to ~10% — essential for long sessions with a consistent CLAUDE.md.',
      thContext: 'Context',
      footnote: '* Approximate prices per million tokens (MTok) — check anthropic.com/pricing for current values.',
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
          <strong className="text-green-300">Opus + Sonnet strategy:</strong> Use Opus for <em>design and decisions</em> (50K tokens), Sonnet for <em>implementation</em> (200K tokens). Total cost: ~$4.25 vs ~$6.25 with Opus for everything — ~30% savings, more if you only escalate the decision to Fable 5.
        </>
      ),
      cacheTitle: 'Prompt caching impact on long sessions',
      cacheDesc: 'In a typical session with a 2K token CLAUDE.md and 30 messages, caching reduces input cost by ~60%.',
      noCache: 'Without caching — 30 Sonnet messages',
      withCache: 'With caching active — 30 Sonnet messages',
      noCacheRows: [
        ['CLAUDE.md × 30 requests (2K × 30)', '60K input tokens'],
        ['System prompt × 30', '90K tokens'],
        ['Conversation (avg 1K/message)', '30K tokens'],
      ],
      withCacheRows: [
        ['Cache read (CLAUDE.md + system)', '150K × $0.30'],
        ['Cache write (first time)', '5K × $3.75'],
        ['New conversation', '30K × $3.00'],
      ],
      totalInput: 'Total input cost',
      infoContent: 'Claude Code automatically activates prompt caching for CLAUDE.md and system prompt. No configuration needed — it works implicitly every session.',
      tokeni: 'tokens',
    },
    tabSelectare: {
      title: 'When to use which model',
      desc: 'The basic rule: start with Sonnet (default), escalate to Opus when Sonnet isn\'t enough, and drop to Haiku for mechanical or high-volume tasks.',
      decisionTitle: 'Quick decision guide',
      qas: [
        { q: 'Code completion, boilerplate, getter/setter, docstrings?',    a: 'Haiku',  color: 'text-green-400',  bg: 'border-green-500/20 bg-green-500/5' },
        { q: 'Quick explanation of a code block?',                          a: 'Haiku',  color: 'text-green-400',  bg: 'border-green-500/20 bg-green-500/5' },
        { q: 'CI automation with hundreds of files processed?',             a: 'Haiku',  color: 'text-green-400',  bg: 'border-green-500/20 bg-green-500/5' },
        { q: 'Bug fix with clear stack trace, 1-2 files?',                 a: 'Sonnet', color: 'text-amber-400',  bg: 'border-amber-500/20 bg-amber-500/5' },
        { q: 'New feature of medium complexity?',                           a: 'Sonnet', color: 'text-amber-400',  bg: 'border-amber-500/20 bg-amber-500/5' },
        { q: 'Refactoring 2-5 files with clear logic?',                    a: 'Sonnet', color: 'text-amber-400',  bg: 'border-amber-500/20 bg-amber-500/5' },
        { q: 'Code review focused on security or performance?',             a: 'Sonnet', color: 'text-amber-400',  bg: 'border-amber-500/20 bg-amber-500/5' },
        { q: 'Sonnet failed or the answer is too vague?',                   a: 'Opus',   color: 'text-purple-400', bg: 'border-purple-500/20 bg-purple-500/5' },
        { q: 'Architectural redesign or stack migration?',                  a: 'Opus',   color: 'text-purple-400', bg: 'border-purple-500/20 bg-purple-500/5' },
        { q: 'Critical production bug without clear reproduction?',         a: 'Opus',   color: 'text-purple-400', bg: 'border-purple-500/20 bg-purple-500/5' },
        { q: 'Full security audit of a critical module?',                   a: 'Opus',   color: 'text-purple-400', bg: 'border-purple-500/20 bg-purple-500/5' },
        { q: 'Long-horizon agent or a problem Opus failed on?',             a: 'Fable 5', color: 'text-rose-400',  bg: 'border-rose-500/20 bg-rose-500/5' },
      ],
      matrixTitle: 'Full matrix — scenarios vs models',
      matrixColScenario: 'Scenario',
      matrixRows: [
        ['Code completion / boilerplate',       '✓ Ideal',      '✓ Works',      '✗ Overkill'],
        ['Bug with clear stack trace',          '○ Works',      '✓ Ideal',      '✗ Overkill'],
        ['Moderate feature (1-3 files)',        '✗ Weak',       '✓ Ideal',      '○ Unused'],
        ['Complex multi-file refactoring',      '✗ Weak',       '✓ Good',       '○ Escalate'],
        ['New architectural design',            '✗ No',         '○ Partial',    '✓ Ideal'],
        ['Framework / stack migration',         '✗ No',         '✗ Not enough', '✓ Ideal'],
        ['Security code review',                '✗ Weak',       '✓ Good',       '○ Critical audit'],
        ['CI pipeline / volume automation',     '✓ Ideal',      '○ Too costly', '✗ No'],
        ['Unit test generation',                '○ Simple',     '✓ Ideal',      '✗ Overkill'],
        ['Production debug without repro',      '✗ No',         '○ Try it',     '✓ Ideal'],
      ],
      escalTitle: 'Escalation strategy',
      escalDesc: "Don't go straight to Opus — test with Sonnet first. If Sonnet fails, escalate with the same accumulated context. The savings are significant.",
      escalCode: `# Step 1 — try with Sonnet (default)
> megathink Debugging a race condition
  in the notification system.
  Files: lib/notifications.ts, workers/notify.ts

# If Sonnet didn't converge on a clear solution:
> /model opus
> Continue the analysis — we're stuck on
  the race condition in NotificationQueue.
  Sonnet's solution was incorrect because [X].

# Opus solves it. Do the implementation with Sonnet:
> /model sonnet
> Implement the solution proposed above.
  Context is complete — write the code.`,
      tipContent: (
        <>
          When switching models mid-session, the conversation context (all messages, files read) is <strong className="text-green-300">fully preserved</strong>. You don't lose progress — you only switch compute power.
        </>
      ),
      switchTitle: 'Switching model mid-session',
      switchLabel1: 'Available commands',
      switchLabel2: 'Recommended Opus → Sonnet flow',
      switchCode1: `# From the prompt, at any time:
> /model opus
> /model sonnet
> /model haiku

# With full ID:
> /model claude-opus-4-8

# Check active model:
> /status

# Or via flag at launch:
claude --model claude-opus-4-8`,
      switchCode2: `# Opus for DECISION (costly, short):
/model opus
> ultrathink What is the best
  architecture for system X?
  Analyze 3 options.

# Sonnet for IMPLEMENTATION (cheap, long):
/model sonnet
> Implement option 2 as proposed.
  Respect the constraints from the plan.`,
    },
    tabConfigurare: {
      title: 'Model configuration',
      desc: 'You can set the model at four levels: CLI flag (session), settings.json (project), environment variable (global) or API (programmatic). Each level overrides the previous one.',
      priorityTitle: 'Configuration priority (ascending)',
      priorities: [
        { level: '4 — Lowest',          label: 'Hardcoded default',      val: 'claude-sonnet-5',                        color: 'border-zinc-700 bg-zinc-800/30',      badge: 'text-zinc-500'  },
        { level: '3',                    label: 'Environment variable',    val: 'ANTHROPIC_MODEL=claude-sonnet-5',        color: 'border-blue-500/20 bg-blue-500/5',   badge: 'text-blue-400'  },
        { level: '2',                    label: '.claude/settings.json',   val: '{ "model": "claude-opus-4-8" }',           color: 'border-amber-500/20 bg-amber-500/5', badge: 'text-amber-400' },
        { level: '1 — Highest priority', label: 'CLI flag --model',        val: 'claude --model claude-haiku-4-5', color: 'border-purple-500/20 bg-purple-500/5',badge: 'text-purple-400'},
      ],
      settingsTitle: '.claude/settings.json',
      settingsDesc: 'Configured per project, versioned in repo. Applies to all sessions in that directory.',
      settingsCode: `// .claude/settings.json
{
  "model": "claude-sonnet-5",

  // Tool permissions (optional):
  "permissions": {
    "allow": ["Bash(npm run *)", "Edit", "Read"],
    "deny": ["Bash(rm -rf *)"]
  },

  // Auto-approval level (optional):
  "autoApprove": ["Read", "Glob", "Grep"]
}`,
      infoContent: (
        <>
          <code className="text-blue-300">.claude/settings.json</code> is versioned in git — the whole team gets the same default model for the project. Ideal for setting Haiku in CI pipelines and Sonnet in development.
        </>
      ),
      envTitle: 'Environment variables',
      envCode: `# ~/.bashrc or ~/.zshrc — personal global model:
export ANTHROPIC_MODEL="claude-sonnet-5"

# Or per terminal session:
ANTHROPIC_MODEL=claude-haiku-4-5 claude -p "..."

# In CI/CD (GitHub Actions):
env:
  ANTHROPIC_MODEL: claude-haiku-4-5
  ANTHROPIC_API_KEY: \${{ secrets.ANTHROPIC_API_KEY }}`,
      apiTitle: 'Model selection in Anthropic SDK',
      apiDesc: 'If you build with the API directly, model is a simple parameter. Combine with extended thinking for full control.',
      apiCode: `import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

// Haiku — fast completion, minimal cost
const quickResponse = await client.messages.create({
  model: 'claude-haiku-4-5',
  max_tokens: 1024,
  messages: [{ role: 'user', content: promptSimple }],
})

// Sonnet — standard development with adaptive thinking
const devResponse = await client.messages.create({
  model: 'claude-sonnet-5',
  max_tokens: 16000,
  thinking: { type: 'adaptive' },
  output_config: { effort: 'high' },
  messages: [{ role: 'user', content: promptComplex }],
})

// Opus — architectural decision (max effort)
const archResponse = await client.messages.create({
  model: 'claude-opus-4-8',
  max_tokens: 16000,
  thinking: { type: 'adaptive' },
  output_config: { effort: 'xhigh' },
  messages: [{ role: 'user', content: promptCritic }],
})

// Fable 5 — extreme problems. Thinking is always on:
// omit the parameter (setting it explicitly returns 400).
const extremeResponse = await client.messages.create({
  model: 'claude-fable-5',
  max_tokens: 16000,
  output_config: { effort: 'xhigh' },
  messages: [{ role: 'user', content: promptExtreme }],
})`,
      stratTitle: 'Configuration strategies per context',
      strats: [
        {
          ctx: 'Local development',
          where: '.claude/settings.json',
          rationale: 'Most balanced for daily tasks. You can escalate to Opus from within the session.',
        },
        {
          ctx: 'CI/CD pipelines',
          where: 'ENV var in CI config',
          rationale: 'Runs on hundreds of files on every push. Haiku reduces cost by 5-10× vs Sonnet.',
        },
        {
          ctx: 'Architecture session',
          where: '--model flag or /model opus',
          rationale: 'Dedicated session for big decisions. Switch back to Sonnet for implementation.',
        },
      ],
    },
    tabCapabilitati: {
      title: 'Capabilities and limitations per model',
      desc: 'Beyond intelligence and cost, models differ in concrete technical capabilities — context window, extended thinking, tool use, max output.',
      thCap: 'Capability',
      capRows: [
        { cap: 'Context window',           h: '200K tokens', s: '1M tokens',   o: '1M tokens', f: '1M tokens' },
        { cap: 'Max output tokens',         h: '64K',         s: '128K',        o: '128K',      f: '128K' },
        { cap: 'Thinking',                  h: '✓ budget_tokens', s: '✓ adaptive + effort', o: '✓ adaptive + effort', f: '✓ always on' },
        { cap: 'Tool use (Bash, Read etc)', h: '✓',           s: '✓',           o: '✓',         f: '✓' },
        { cap: 'Vision (images)',           h: '✓',           s: '✓',           o: '✓',         f: '✓' },
        { cap: 'Streaming',                 h: '✓',           s: '✓',           o: '✓',         f: '✓' },
        { cap: 'Prompt caching',            h: '✓',           s: '✓',           o: '✓',         f: '✓' },
        { cap: 'Batch API',                 h: '✓',           s: '✓',           o: '✓',         f: '✓' },
        { cap: 'Avg latency',               h: '~1-3s',       s: '~5-15s',      o: '~15-60s',   f: 'minutes on hard tasks' },
        { cap: 'Rate limit (default RPM)',  h: 'High',        s: 'Medium',      o: 'Low',       f: 'Low' },
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
          budget: 'adaptive — the model decides',
          recommended: "effort: 'high' (default) / 'xhigh'",
          note: 'Adaptive thinking is on by default. budget_tokens returns a 400 error — control depth via output_config.effort (low → max).',
        },
        {
          thinking: true,
          budget: 'adaptive — the model decides',
          recommended: "effort: 'xhigh' for coding/agentic",
          note: "Maximum reasoning in the Opus tier. effort xhigh is Claude Code's default.",
        },
        {
          thinking: true,
          budget: 'always on — cannot be disabled',
          recommended: "omit thinking; effort: 'low' → 'max'",
          note: 'Setting the thinking parameter explicitly returns a 400. The raw chain of thought is never returned — request display: "summarized" for a summary.',
        },
      ],
      noThinking: "Doesn't support thinking",
      budgetLabel: 'Budget:',
      recommendedLabel: 'Recommended:',
      strategiesTitle: '10 strategies for optimal cost',
      strategies: [
        { n: '01', title: 'Right model for each task',          desc: 'Haiku for simple, Sonnet for development, Opus for critical. Cost difference: 5×–10×.' },
        { n: '02', title: '/compact proactively at ~60% context', desc: 'Compress the conversation before hitting the limit. Don\'t wait for the warning — you act too late.' },
        { n: '03', title: 'Minimal but sufficient context',      desc: 'Claude reads needed files automatically. Don\'t paste code in the prompt — it adds useless tokens.' },
        { n: '04', title: 'Specify relevant files',             desc: 'Instead of "analyze the project", say "check lib/auth.ts". You eliminate scanning irrelevant files.' },
        { n: '05', title: 'think proportional to complexity',   desc: 'think/megathink/ultrathink: 10K/32K/128K internal tokens. Choose the minimum that\'s sufficient.' },
        { n: '06', title: 'Clean and focused sessions',         desc: 'One session = one task or related tasks. Topic changes accumulate useless context.' },
        { n: '07', title: 'Concise CLAUDE.md',                  desc: 'Every line in CLAUDE.md is added to every request. 200 lines = 200× more input tokens.' },
        { n: '08', title: 'One prompt, one goal',               desc: 'Atomic prompts produce better output with fewer tokens than prompts with 5 tasks.' },
        { n: '09', title: 'Opus for decisions, Sonnet for code', desc: 'Opus analyzes and recommends (50K tokens), Sonnet implements (200K tokens). ~30% savings.' },
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
    intelligence: 85, speed: 75, costRel: 30,
    inputCost: '$3.00', outputCost: '$15.00', cacheRead: '$0.30', cacheWrite: '$3.75',
    context: '1M', maxOutput: '128K',
    thinking: true,
  },
  {
    name: 'Claude Opus 4.8',
    id: 'claude-opus-4-8',
    icon: <Brain className="h-5 w-5" />,
    color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20',
    intelligence: 95, speed: 50, costRel: 50,
    inputCost: '$5.00', outputCost: '$25.00', cacheRead: '$0.50', cacheWrite: '$6.25',
    context: '1M', maxOutput: '128K',
    thinking: true,
  },
  {
    name: 'Claude Fable 5',
    id: 'claude-fable-5',
    icon: <Sparkles className="h-5 w-5" />,
    color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20',
    intelligence: 100, speed: 40, costRel: 100,
    inputCost: '$10.00', outputCost: '$50.00', cacheRead: '$1.00', cacheWrite: '$12.50',
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
            { label: cm.compRows[1], vals: [100, 75, 50, 40],  colors: ['bg-green-500', 'bg-amber-500', 'bg-purple-500', 'bg-rose-500'] },
            { label: cm.compRows[2], vals: [10, 30, 50, 100],  colors: ['bg-green-500', 'bg-amber-500', 'bg-purple-500', 'bg-rose-500'] },
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
            <span className="flex items-center gap-1.5"><span className="h-2 w-4 rounded-full bg-purple-500" />Opus 4.8</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-4 rounded-full bg-rose-500" />Fable 5</span>
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
                <th className="px-4 py-3 text-center font-semibold text-rose-400">Fable 5</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {[
                { haiku: '~$0.001', sonnet: '~$0.007', opus: '~$0.012', fable: '~$0.024' },
                { haiku: '~$0.004', sonnet: '~$0.015', opus: '~$0.025', fable: '~$0.050' },
                { haiku: '~$0.013', sonnet: '~$0.050', opus: '~$0.085', fable: '~$0.170' },
                { haiku: '~$0.031', sonnet: '~$0.125', opus: '~$0.210', fable: '~$0.420' },
                { haiku: '~$0.094', sonnet: '~$0.375', opus: '~$0.625', fable: '~$1.250' },
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
                <span className="text-red-400">~$0.54</span>
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
            { ...cc.strats[0], model: 'claude-sonnet-5',            color: 'border-amber-500/20 bg-amber-500/5',  mc: 'text-amber-400'  },
            { ...cc.strats[1], model: 'claude-haiku-4-5',    color: 'border-green-500/20 bg-green-500/5',  mc: 'text-green-400'  },
            { ...cc.strats[2], model: 'claude-opus-4-8',              color: 'border-purple-500/20 bg-purple-500/5',mc: 'text-purple-400' },
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

  const thinkingModelNames = ['Haiku 4.5', 'Sonnet 5', 'Opus 4.8', 'Fable 5']
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
              <th className="px-4 py-3 text-center font-semibold text-purple-400">Opus 4.8</th>
              <th className="px-4 py-3 text-center font-semibold text-rose-400">Fable 5</th>
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
