import { useState } from 'react'
import { Terminal, Keyboard, Flag, Package, Play, Hash, Shield, ChevronRight } from 'lucide-react'
import { useApp } from '../contexts/AppContext'

// ─── Types ────────────────────────────────────────────────────────────────────

type CmdCat = 'toate' | 'session' | 'memorie' | 'tools' | 'review' | 'utilitar'
type FlagGrp = 'toate' | 'mode' | 'model' | 'safety' | 'context' | 'conv'

interface SlashCmd {
  cmd: string
  args?: string
  desc: string
  detail: string
  cat: Exclude<CmdCat, 'toate'>
  example?: string
}

interface CliFlag {
  flag: string
  short?: string
  arg?: string
  desc: string
  example: string
  grp: Exclude<FlagGrp, 'toate'>
  danger?: boolean
}

interface Shortcut {
  keys: string[]
  action: string
  when: string
}

interface StepItem {
  step: string
  title: string
  code: string
  note: string
}

interface BpItem {
  tip: string
  detail: string
}

interface ExampleCmd {
  name: string
  desc: string
  content: string
}

interface PatternItem {
  label: string
  code: string
}

interface StdinPattern {
  desc: string
  code: string
}

interface ModeItem {
  name: string
  color: string
  badge: string
  how: string
  desc: string
  when: string[]
}

interface ExecMode {
  name: string
  color: string
  badge: string
  desc: string
  when: string
}

interface OutputFormat {
  format: string
  label: string
  color: string
  use: string
  output: string
}

interface EscStep {
  label: string
  sub: string
  highlight?: boolean
}

// ─── Bilingual content ────────────────────────────────────────────────────────

const CONTENT = {
  ro: {
    badge: 'Referință CLI',
    title: 'Comenzi & CLI Flags',
    desc: 'Referința completă pentru slash commands built-in, flags CLI, scurtături de tastatură, custom commands și moduri de execuție — de la sesiune interactivă la CI/CD headless.',
    stats: [
      { val: '20+', label: 'slash commands',  sub: 'built-in',             color: 'text-amber-400' },
      { val: '13+', label: 'CLI flags',        sub: 'pentru scripturi',     color: 'text-purple-400' },
      { val: '8',   label: 'shortcuts',        sub: 'tastatură esențiale',  color: 'text-blue-400' },
      { val: '3',   label: 'formate output',   sub: 'text / json / stream', color: 'text-green-400' },
    ],
    tabLabels: {
      slash:     'Slash Commands',
      flags:     'CLI Flags',
      shortcuts: 'Scurtături',
      custom:    'Custom Commands',
      moduri:    'Moduri & Output',
    },
    securityNote: {
      title: 'Notă de securitate',
      body: ' și ',
      suffix: ' execută toate acțiunile fără confirmare. Folosește-le exclusiv în containere Docker, CI/CD izolat sau medii de test — niciodată în development pe mașina ta personală cu date sensibile.',
    },
    catLabels: {
      toate:    'Toate',
      session:  'Sesiune',
      memorie:  'Memorie',
      tools:    'Tools',
      review:   'Review',
      utilitar: 'Utilitar',
    } as Record<CmdCat, string>,
    grpLabels: {
      toate:   'Toate',
      mode:    'Mod execuție',
      model:   'Model & limite',
      safety:  'Securitate',
      context: 'Context',
      conv:    'Conversație',
    } as Record<FlagGrp, string>,
    slash: {
      howTitle: 'Cum funcționează slash commands',
      howBody: 'Tastezi ',
      howMid: ' și autocompletul afișează toate comenzile disponibile — atât cele built-in cât și custom commands din ',
      howEnd: '. Comenzile nu consumă tokeni suplimentari față de acțiunile pe care le declanșează.',
      stats: [
        { key: '20+', label: ' comenzi built-in' },
        { key: 'Tab', label: ' pentru autocomplete' },
        { key: '/help', label: ' listează toate' },
        { key: '∞', label: ' custom commands' },
      ],
      countSuffix: ' comenzi',
      patternsTitle: 'Combinații frecvente',
      patterns: [
        {
          label: 'Sesiune lungă → compactare',
          code: '> /cost      # verifici consumul\n> /compact   # rezumi istoricul\n> /cost      # confirmi economisirea',
        },
        {
          label: 'Schimb task → context nou',
          code: '> # Am terminat auth, trec la UI\n> /clear\n> "Creează pagina de dashboard"',
        },
        {
          label: 'Review automat înainte de commit',
          code: '> /review\n> # Adresezi problemele găsite\n> /compact    # dacă sesiunea e lungă\n> "git commit -m fix(auth): ..."',
        },
        {
          label: 'Debug cu model mai puternic',
          code: '> /model claude-opus-4-8\n> "megathink: de ce eșuează testele pe CI?"\n> /model claude-sonnet-5  # revin',
        },
      ] as PatternItem[],
    },
    flags: {
      syntaxTitle: 'CLI flags — sintaxa generală',
      syntaxCode: `claude [flags] [prompt]
claude -p "prompt" --output-format json
claude --model claude-opus-4-8 --verbose
claude -c "continuă task-ul"

# Verifică lista completă cu:
claude --help`,
      settingsNote: 'Flags-urile de sesiune (--model, --verbose) pot fi setate și permanent în ',
      countSuffix: ' flags',
      scriptsTitle: 'Scripturi reale cu CLI flags',
      scripts: [
        {
          label: 'Pre-commit hook — review securitate',
          code: `#!/bin/bash
# .git/hooks/pre-commit
DIFF=$(git diff --cached)
RESULT=$(echo "$DIFF" | claude -p \\
  "Găsește probleme de securitate în acest diff: $DIFF" \\
  --output-format json \\
  --allowedTools "")

ISSUES=$(echo "$RESULT" | jq -r '.result')
if echo "$ISSUES" | grep -q "CRITIC"; then
  echo "❌ Probleme de securitate găsite:"
  echo "$ISSUES"
  exit 1
fi`,
        },
        {
          label: 'CI/CD — generare changelog automat',
          code: `# .github/workflows/release.yml
- name: Generate changelog
  run: |
    COMMITS=$(git log --oneline v$PREV_VERSION..HEAD)
    claude -p "Generează un changelog profesional din aceste commit-uri:
    $COMMITS
    Format: ### Features, ### Fixes, ### Breaking Changes" \\
      --output-format text \\
      --model claude-haiku-4-5 \\
      --dangerously-skip-permissions \\
      > CHANGELOG_NEW.md`,
        },
        {
          label: 'Batch processing — documentare funcții',
          code: `#!/bin/bash
# Documentează toate funcțiile dintr-un director
for file in src/**/*.ts; do
  echo "Procesez: $file"
  claude -p "Adaugă JSDoc la funcțiile fără documentație din $file.
  Modifică fișierul direct." \\
    --max-turns 5 \\
    --allowedTools "Read,Edit" \\
    --append-system-prompt "Păstrează stilul existent."
done`,
        },
      ] as PatternItem[],
    },
    shortcuts: {
      items: [
        { keys: ['Esc'],       action: 'Întrerupe execuția curentă',            when: 'Claude lucrează — oprire imediată, poți redirecta fără a pierde contextul' },
        { keys: ['Shift', 'Tab'], action: 'Ciclează modurile: Normal → Plan → Auto-accept', when: 'Oricând în conversație — schimbă comportamentul de execuție' },
        { keys: ['Ctrl', 'C'], action: 'Forțează ieșire din Claude Code',       when: 'Aplicația nu răspunde sau vrei să ieși imediat' },
        { keys: ['↑'],         action: 'Mesaj anterior din istoricul input-urilor', when: 'Câmpul de input gol — parcurgi prompt-urile anterioare' },
        { keys: ['↓'],         action: 'Mesaj următor din istoricul input-urilor', when: 'Navighezi înapoi spre cel mai recent mesaj' },
        { keys: ['Tab'],       action: 'Autocomplete @ referință sau / comandă', when: 'Ai tastat @ sau / — completează calea fișierului sau comanda' },
        { keys: ['Ctrl', 'J'], action: 'Linie nouă fără a trimite mesajul',     when: 'Prompt multi-linie — Enter ar trimite, Ctrl+J adaugă newline' },
        { keys: ['Ctrl', 'R'], action: 'Caută în istoricul comenzilor shell',   when: 'La promptul terminalului, înainte de a porni claude' },
      ] as Shortcut[],
      modesTitle: 'Modurile de execuție — ciclu cu ',
      modes: [
        {
          name: 'Normal',
          color: 'text-amber-400 border-amber-500/30 bg-amber-500/5',
          badge: 'DEFAULT',
          desc: 'Claude cere confirmare înainte de fiecare acțiune cu impact: scriere fișiere, comenzi Bash, operații distructive.',
          when: 'Lucrul zilnic — siguranță maximă',
        },
        {
          name: 'Plan Mode',
          color: 'text-purple-400 border-purple-500/30 bg-purple-500/5',
          badge: 'PLAN',
          desc: 'Claude elaborează un plan complet de execuție înainte de a face orice modificare. Approbi sau respingi planul în întregime.',
          when: 'Task-uri complexe cu mulți pași — verifici intenția înainte',
        },
        {
          name: 'Auto-accept',
          color: 'text-green-400 border-green-500/30 bg-green-500/5',
          badge: 'AUTO',
          desc: 'Claude execută toate acțiunile fără confirmare. Rapid, dar risc de modificări nedorite. Echivalent cu --dangerously-skip-permissions în sesiune.',
          when: 'Task-uri repetitive bine înțelese, medii de test',
        },
      ] as ExecMode[],
      escTitle: 'Fluxul Escape — cel mai important shortcut',
      escSteps: [
        { label: 'Claude lucrează',    sub: 'execută pași' },
        { label: 'Apesi Esc',          sub: 'oprire imediată', highlight: true },
        { label: 'Claude se oprește',  sub: 'fișierele safe' },
        { label: 'Dai instrucțiuni noi', sub: 'redirect task' },
        { label: 'Claude continuă',    sub: 'direcție nouă' },
      ] as EscStep[],
      escNote: 'Spre deosebire de Ctrl+C care forțează ieșirea, ',
      escNoteStrong: 'Esc',
      escNoteSuffix: ' oprește execuția păstrând contextul conversației. Poți redirecta Claude fără a reporni sesiunea.',
    },
    custom: {
      whatTitle: 'Ce sunt custom slash commands',
      whatBody: 'Fișiere ',
      whatMid: ' plasate în ',
      whatMid2: ' devin automat comenzi ',
      whatMid3: '. Conținutul fișierului este promptul care se trimite lui Claude. Variabila ',
      whatEnd: ' primește tot ce tastezi după numele comenzii.',
      structLabel: 'Structura de fișiere',
      anatomyLabel: 'Anatomia unui command file',
      stepsTitle: 'Crearea unui custom command — pas cu pas',
      steps: [
        {
          step: '01', title: 'Creează directorul',
          code: 'mkdir -p .claude/commands',
          note: 'Sau ~/.claude/commands/ pentru comenzi disponibile în orice proiect.',
        },
        {
          step: '02', title: 'Scrie fișierul .md',
          code: `# .claude/commands/review.md
Efectuează un code review pe $ARGUMENTS.

Verifică în ordine:
1. **Securitate** — injection, auth bypass, date expuse
2. **Tipuri TypeScript** — any, assertions, non-null unsafe
3. **Logică** — edge cases, race conditions, null derefs
4. **Performanță** — N+1 queries, re-renders inutile

Răspunde structurat cu severitate: 🔴 CRITIC / 🟡 WARNING / 🟢 OK`,
          note: '$ARGUMENTS va fi înlocuit cu ce tastezi după /review.',
        },
        {
          step: '03', title: 'Folosește comanda',
          code: '> /review src/auth/middleware.ts\n> /review src/api/  # sau un director întreg',
          note: 'Claude primește promptul cu $ARGUMENTS înlocuit și execută.',
        },
        {
          step: '04', title: 'Adaugă metadate opționale',
          code: `---
description: "Review securitate și calitate cod"
allowed-tools: Read,Grep,Glob,Bash
---`,
          note: 'allowed-tools restricționează ce tool-uri poate folosi comanda.',
        },
      ] as StepItem[],
      examplesTitle: 'Exemple de comenzi gata de folosit',
      examples: [
        {
          name: 'commit.md → /commit',
          desc: 'Generează mesaj de commit convențional',
          content: `Generează un mesaj de commit pentru modificările staged.

Analizează \`git diff --staged\` și urmează Conventional Commits:
- feat: funcționalitate nouă
- fix: bug fix
- refactor: refactorizare fără schimbare de comportament
- docs: documentație
- test: teste

Format: <tip>(<scope>): <descriere scurtă>

Opțional corp cu detalii dacă modificările sunt complexe.
Limbă: română pentru proiectele interne, engleză pentru open-source.`,
        },
        {
          name: 'debug.md → /debug $ARGUMENTS',
          desc: 'Analiză profundă a unei erori sau fișier',
          content: `Analizează și rezolvă problema: $ARGUMENTS

Proces de debug:
1. Citește fișierele relevante din context
2. Identifică root cause-ul exact (nu simptomele)
3. Verifică dacă problema apare și în alte locuri similare
4. Propune fix minim care nu introduce regressionuri
5. Sugerează un test care ar preveni regresia

Nu face modificări până nu explici cauza și fix-ul propus.`,
        },
        {
          name: 'standup.md → /standup',
          desc: 'Rezumat zilnic din istoricul git',
          content: `Generează un rezumat stand-up din activitatea recentă.

Analizează git log --since="24 hours ago" --oneline și CHANGELOG recent.

Format:
**Ieri:** [ce am terminat]
**Azi:** [ce planific]
**Blocat:** [dacă e ceva]

Ton: profesional, concis, fără jargon tehnic excesiv.
Limbă: română.`,
        },
      ] as ExampleCmd[],
      bpTitle: 'Best practices pentru custom commands',
      bp: [
        { tip: 'Specifică formatul output-ului', detail: 'Claude produce output inconsistent dacă nu specifici formatul dorit (JSON, markdown structurat, text simplu).' },
        { tip: 'Folosește @referințe pentru context', detail: 'Include @src/types.ts sau @CLAUDE.md în commandul care are nevoie de context specific din proiect.' },
        { tip: 'Restrânge allowed-tools', detail: 'O comandă de analiză nu are nevoie de Bash sau Write. Restrânge tool-urile pentru mai multă securitate și viteză.' },
        { tip: 'Versioned în repository', detail: '.claude/commands/ se commit-ează împreună cu codul. Toată echipa beneficiază de aceleași comenzi standardizate.' },
        { tip: 'Comenzi atomice, nu monolitice', detail: 'O comandă = un lucru bine definit. /review pentru review, /commit pentru commit — nu una care le face pe ambele.' },
        { tip: 'Testează cu --verbose', detail: 'claude --verbose /comanda-ta afișează exact ce prompt a primit Claude și ce tool-uri a apelat.' },
      ] as BpItem[],
    },
    moduri: {
      modesTitle: 'Modurile de rulare Claude Code',
      modes: [
        {
          name: 'Interactiv',
          color: 'border-amber-500/30 bg-amber-500/5',
          badge: 'text-amber-400 bg-amber-500/15',
          how: 'claude',
          desc: 'REPL conversațional cu UI complet. Claude citește fișiere, execută comenzi și raportează în timp real. Poți întrerupe (Esc) și redirecta oricând.',
          when: ['Dezvoltare activă', 'Debug interactiv', 'Explorare codebase', 'Task-uri multi-pas'],
        },
        {
          name: 'Headless / -p',
          color: 'border-purple-500/30 bg-purple-500/5',
          badge: 'text-purple-400 bg-purple-500/15',
          how: 'claude -p "prompt"',
          desc: 'Mod non-interactiv: primește un prompt, execută și iese. Returnează output-ul în stdout. Ideal pentru automatizare și pipe-uri.',
          when: ['CI/CD pipelines', 'Scripturi shell', 'Cron jobs', 'Pre-commit hooks'],
        },
        {
          name: 'Pipe / stdin',
          color: 'border-blue-500/30 bg-blue-500/5',
          badge: 'text-blue-400 bg-blue-500/15',
          how: 'echo "..." | claude -p -',
          desc: 'Acceptă input din stdin. Combini cu alte comenzi Unix. Procesează output-ul altor procese sau fișiere mari.',
          when: ['Procesare output CLI', 'Analiză logs', 'Transformare date', 'Batch files'],
        },
      ] as ModeItem[],
      outputTitle: 'Formate output — --output-format',
      formats: [
        {
          format: 'text',
          label: 'Text simplu',
          color: 'text-amber-400',
          use: 'Consum uman, redirectare în fișiere, README-uri',
          output: `Funcția \`validateEmail\` nu
tratează adresele internaționale
(ex: utilisateur@domaine.fr).

Recomand adăugarea regex-ului
RFC 5322 pentru validare completă.`,
        },
        {
          format: 'json',
          label: 'JSON complet',
          color: 'text-purple-400',
          use: 'Procesare programatică, logging structurat, API',
          output: `{
  "result": "Funcția ...",
  "model": "claude-sonnet-5",
  "inputTokens": 1240,
  "outputTokens": 87,
  "durationMs": 2341,
  "stopReason": "end_turn"
}`,
        },
        {
          format: 'stream-json',
          label: 'Streaming JSON',
          color: 'text-blue-400',
          use: 'Progress live, dashboard, procesare incrementală',
          output: `{"type":"start","model":"..."}
{"type":"text","delta":"Funcția"}
{"type":"text","delta":" validate"}
{"type":"text","delta":"Email..."}
{"type":"end","tokens":{"in":1240}}`,
        },
      ] as OutputFormat[],
      formatExamples: [
        { cmd: 'claude -p "..." --output-format text > out.txt',                                                                                            label: 'text → fișier' },
        { cmd: 'claude -p "..." --output-format json | jq .result',                                                                                        label: 'json → jq' },
        { cmd: "claude -p \"...\" --output-format stream-json | while IFS= read -r line; do echo \"$line\" | jq -r '.delta // empty'; done",               label: 'stream → live' },
      ] as { cmd: string; label: string }[],
      stdinTitle: 'Patternuri stdin — pipe cu alte comenzi',
      stdinPatterns: [
        { desc: 'Analizează output-ul unui build eșuat',      code: 'npm run build 2>&1 | claude -p "Explică erorile și propune fix-uri"' },
        { desc: 'Rezumă logs de erori din producție',         code: 'tail -n 500 /var/log/app.log | claude -p "Grupează erorile, identifică pattern-urile și prioritizează"' },
        { desc: 'Review diff înainte de push',                code: 'git diff main..HEAD | claude -p "Code review: securitate, tipuri, logică" --output-format json | jq .result' },
        { desc: 'Documentează output-ul unui script',         code: 'cat src/utils/*.ts | claude -p "Generează documentație Markdown pentru toate funcțiile exportate"' },
        { desc: 'Traduce mesaje de eroare pentru utilizatori', code: 'cat errors.json | claude -p "Transformă aceste mesaje tehnice în mesaje prietenoase pentru utilizatori, în română"' },
      ] as StdinPattern[],
    },
    cmds: [
      // session
      {
        cmd: '/clear', desc: 'Șterge tot istoricul conversației',
        detail: 'Eliberează complet contextul acumulat. Claude uită toate mesajele anterioare, pornești cu 0 tokeni folosiți. Folosește când schimbi complet task-ul sau vrei un slate curat.',
        cat: 'session',
        example: '> /clear\nContext eliberat. Tokeni activi: 0\nPoți începe o nouă sarcină.',
      },
      {
        cmd: '/compact', args: '[instrucțiuni focus]', desc: 'Rezumă istoricul salvând contextul',
        detail: 'Înlocuiește conversația lungă cu un rezumat concentrat. Opțional specifici ce informații să fie reținute. Economisești 70–90% din tokeni față de istoricul complet.',
        cat: 'session',
        example: '> /compact Reține doar deciziile arhitecturale\nCompactat: 18.4k → 1.2k tokeni',
      },
      {
        cmd: '/cost', desc: 'Afișează consumul de tokeni și costul estimat',
        detail: 'Breakdown complet al sesiunii: input / output / cache, rata de cache hit și costul total în USD. Esențial pentru monitorizarea bugetului pe task-uri lungi.',
        cat: 'session',
        example: '> /cost\nInput:  45.2k  ($0.14)\nOutput:  8.1k  ($0.12)\nCached: 38.0k  ($0.04)\nTotal estimat: $0.30',
      },
      {
        cmd: '/exit', desc: 'Iese din Claude Code (alias: /quit)',
        detail: 'Sesiunea și istoricul conversației se salvează automat. Poți reveni cu claude --continue sau claude -c.',
        cat: 'session',
      },
      // memorie
      {
        cmd: '/init', desc: 'Generează CLAUDE.md pentru proiectul curent',
        detail: 'Scanează structura directorului, detectează framework, limbaj, ORM și generează un CLAUDE.md de bază cu convenții auto-detectate. Rezultatul trebuie revizuit și completat manual.',
        cat: 'memorie',
        example: '> /init\nDetectat: Next.js 15 + TypeScript + Prisma 7\nGenerat CLAUDE.md (312 car.) — revizuiește!',
      },
      {
        cmd: '/memory', desc: 'Deschide CLAUDE.md în editor pentru editare',
        detail: 'Deschide fișierul CLAUDE.md activ în $EDITOR. Modificările sunt detectate instant și aplicate în conversația curentă fără restart.',
        cat: 'memorie',
      },
      // tools
      {
        cmd: '/model', args: '[model-id]', desc: 'Vizualizează sau schimbă modelul activ',
        detail: 'Fără argument: afișează modelul curent și alternativele disponibile. Cu argument: comutare instantanee în sesiune, fără a modifica settings.json.',
        cat: 'tools',
        example: '> /model claude-opus-4-8\nSchimbat: claude-sonnet-5 → claude-opus-4-8\nCost: ↑1,7× input · ↑1,7× output',
      },
      {
        cmd: '/permissions', desc: 'Gestionează permisiunile tool-urilor',
        detail: 'Listează toate tool-urile cu statusul curent (allow / ask / deny) și permite modificarea on-the-fly fără restart de sesiune.',
        cat: 'tools',
      },
      {
        cmd: '/approved-tools', desc: 'Vizualizează tool-urile aprobate',
        detail: 'Arată tool-urile built-in și MCP cu statusul lor. Include și tool-urile din serverele MCP conectate, spre deosebire de /permissions.',
        cat: 'tools',
      },
      {
        cmd: '/mcp', desc: 'Gestionează serverele MCP conectate',
        detail: 'Listează conexiunile MCP active, tool-urile disponibile de la fiecare server, statusul conexiunii și erorile de configurare. Indispensabil la debug MCP.',
        cat: 'tools',
        example: '> /mcp\n● github   (connected) — 8 tools\n● postgres (connected) — 3 tools\n○ slack    (error)     — auth failed',
      },
      // review
      {
        cmd: '/review', desc: 'Code review automat pe modificările curente',
        detail: 'Analizează diff-ul față de main / branch de bază. Verifică securitate, tipuri TypeScript, bug-uri potențiale, convenții de stil și probleme de performanță.',
        cat: 'review',
        example: '> /review\n🔴 auth.ts:42 — SQL injection potențial\n🟡 api.ts:18  — Promise netratat\n🟢 model.ts   — tipuri corecte',
      },
      {
        cmd: '/pr_comments', args: '<nr-PR>', desc: 'Importă comentariile unui Pull Request GitHub',
        detail: 'Preia comentariile unui PR și le adaugă în context. Claude poate adresa fiecare comentariu și genera fix-urile corespunzătoare.',
        cat: 'review',
        example: '> /pr_comments 247\nImportat 8 comentarii din PR #247\n> "Adresează toate comentariile"',
      },
      {
        cmd: '/plan', desc: 'Toggle Plan Mode (echivalent Shift+Tab)',
        detail: 'Activează / dezactivează Plan Mode. Claude propune un plan detaliat de execuție înainte de a face orice modificare. Tu approvi sau respingi planul.',
        cat: 'review',
      },
      // utilitar
      {
        cmd: '/help', desc: 'Listează toate comenzile disponibile',
        detail: 'Arată comenzile built-in și custom commands din .claude/commands/ cu descriere scurtă. Include și comenzile MCP dacă sunt conectate servere.',
        cat: 'utilitar',
      },
      {
        cmd: '/status', desc: 'Status conexiune și configurare',
        detail: 'Afișează: model activ, API key (parțial mascat), directoare permise, versiunea Claude Code și serverele MCP configurate.',
        cat: 'utilitar',
      },
      {
        cmd: '/doctor', desc: 'Diagnostichează instalarea Claude Code',
        detail: 'Verifică: versiunea Node.js, existența API key, permisiunile de fișiere, configurarea PATH și conectivitatea la api.anthropic.com.',
        cat: 'utilitar',
      },
      {
        cmd: '/login', desc: 'Schimbă contul Anthropic activ',
        detail: 'Util pentru lucrul cu mai multe organizații sau conturi. Suprascrie ANTHROPIC_API_KEY pentru sesiunea curentă.',
        cat: 'utilitar',
      },
      {
        cmd: '/vim', desc: 'Toggle keybinding-uri Vim în câmpul de input',
        detail: 'Activează navigarea Vim (hjkl, i, Esc, /, etc.) în input. Nu afectează editarea fișierelor din proiect.',
        cat: 'utilitar',
      },
      {
        cmd: '/terminal-setup', desc: 'Configurează integrarea terminalului',
        detail: 'Instalează shell hooks pentru iTerm2, Wezterm sau Ghost Terminal: notificări, titluri ferestre dinamice, culori per-status.',
        cat: 'utilitar',
      },
      {
        cmd: '/bug', desc: 'Raportează un bug în Claude Code',
        detail: 'Deschide formularul de raportare cu context auto-atașat: versiune, OS, ultimele acțiuni, logs relevante. Ajunge direct la echipa Anthropic.',
        cat: 'utilitar',
      },
    ] as SlashCmd[],
    flagItems: [
      // mode
      {
        flag: '--print', short: '-p', arg: '"prompt"',
        desc: 'Mod non-interactiv: procesează promptul și iese imediat. Esențial pentru CI/CD, scripturi shell și pipe-uri.',
        example: 'claude -p "Rezumă CHANGELOG.md" > summary.txt',
        grp: 'mode',
      },
      {
        flag: '--output-format', arg: 'text|json|stream-json',
        desc: 'Formatul răspunsului în mod headless. json include metadate complete (tokeni, model, durată). stream-json: un obiect JSON per linie — ideal pentru procesare în timp real.',
        example: 'claude -p "Review src/" --output-format json | jq .result',
        grp: 'mode',
      },
      {
        flag: '--verbose',
        desc: 'Output extins: afișează tool calls, timing, token count live și raționamentul intern al fiecărui pas.',
        example: 'claude --verbose "Debug timeout-ul din server.ts"',
        grp: 'mode',
      },
      // model
      {
        flag: '--model', short: '-m', arg: 'model-id',
        desc: 'Selectează modelul pentru sesiunea curentă. Suprascrie settings.json doar pentru această rulare.',
        example: 'claude -m claude-opus-4-8 "Proiectează arhitectura microserviciilor"',
        grp: 'model',
      },
      {
        flag: '--max-turns', arg: 'N',
        desc: 'Numărul maxim de iterații agentic. Claude se oprește după N pași și returnează ce a realizat până atunci.',
        example: 'claude -p "Refactorizează src/" --max-turns 15',
        grp: 'model',
      },
      // safety
      {
        flag: '--dangerously-skip-permissions',
        desc: 'Sare TOATE confirmările de permisiune. Execută orice comandă Bash, scrie orice fișier fără confirmare umană. Numai în medii izolate.',
        example: '# Numai în container Docker sau CI izolat\nclaude -p "npm ci && npm test" \\\n  --dangerously-skip-permissions',
        grp: 'safety',
        danger: true,
      },
      {
        flag: '--allowedTools', arg: '"t1,t2,..."',
        desc: 'Whitelist de tool-uri permise. Claude poate folosi DOAR tool-urile listate. Toate celelalte sunt blocate implicit.',
        example: 'claude -p "Analizează codul" \\\n  --allowedTools "Read,Grep,Glob"',
        grp: 'safety',
      },
      {
        flag: '--disallowedTools', arg: '"t1,t2,..."',
        desc: 'Blacklist de tool-uri interzise explicit. Restul rămân disponibile. Mai puțin restrictiv decât --allowedTools.',
        example: 'claude -p "Explică fluxul" \\\n  --disallowedTools "Bash,Write,Edit"',
        grp: 'safety',
      },
      // context
      {
        flag: '--add-dir', arg: 'path',
        desc: 'Adaugă un director suplimentar la lista de căi permise. Claude poate citi / scrie fișiere și din acel path.',
        example: 'claude --add-dir /shared/libs \\\n  "Analizează dependențele comune"',
        grp: 'context',
      },
      {
        flag: '--system-prompt', arg: '"text"',
        desc: 'Înlocuiește COMPLET system prompt-ul default. Elimină toate instrucțiunile built-in. Folosește cu atenție — piezi comportamentele de siguranță.',
        example: 'claude --system-prompt \\\n  "Ești expert Rust. Răspunzi doar în RO." \\\n  -p "Explică ownership"',
        grp: 'context',
      },
      {
        flag: '--append-system-prompt', arg: '"text"',
        desc: 'Adaugă instrucțiuni la system prompt-ul default fără a-l înlocui. Metoda recomandată față de --system-prompt.',
        example: 'claude --append-system-prompt \\\n  "Folosește TypeScript strict." \\\n  -p "Creează un model User"',
        grp: 'context',
      },
      // conv
      {
        flag: '--continue', short: '-c',
        desc: 'Continuă cea mai recentă conversație. Restaurează contextul, istoricul și starea din sesiunea anterioară.',
        example: 'claude -c "Verifică dacă testele trec acum"',
        grp: 'conv',
      },
      {
        flag: '--resume', arg: 'session-id',
        desc: 'Continuă o conversație specifică după ID (nu neapărat cea mai recentă). ID-ul apare în /status.',
        example: 'claude --resume sess_abc123 \\\n  "Continuă cu pasul 3 din plan"',
        grp: 'conv',
      },
    ] as CliFlag[],
  },
  en: {
    badge: 'CLI Reference',
    title: 'Commands & CLI Flags',
    desc: 'Complete reference for built-in slash commands, CLI flags, keyboard shortcuts, custom commands and execution modes — from interactive session to headless CI/CD.',
    stats: [
      { val: '20+', label: 'slash commands',   sub: 'built-in',              color: 'text-amber-400' },
      { val: '13+', label: 'CLI flags',         sub: 'for scripts',           color: 'text-purple-400' },
      { val: '8',   label: 'shortcuts',         sub: 'essential keyboard',    color: 'text-blue-400' },
      { val: '3',   label: 'output formats',    sub: 'text / json / stream',  color: 'text-green-400' },
    ],
    tabLabels: {
      slash:     'Slash Commands',
      flags:     'CLI Flags',
      shortcuts: 'Shortcuts',
      custom:    'Custom Commands',
      moduri:    'Modes & Output',
    },
    securityNote: {
      title: 'Security Note',
      body: ' and ',
      suffix: ' execute all actions without confirmation. Use them exclusively in Docker containers, isolated CI/CD or test environments — never in local development with sensitive data.',
    },
    catLabels: {
      toate:    'All',
      session:  'Session',
      memorie:  'Memory',
      tools:    'Tools',
      review:   'Review',
      utilitar: 'Utility',
    } as Record<CmdCat, string>,
    grpLabels: {
      toate:   'All',
      mode:    'Execution mode',
      model:   'Model & limits',
      safety:  'Security',
      context: 'Context',
      conv:    'Conversation',
    } as Record<FlagGrp, string>,
    slash: {
      howTitle: 'How slash commands work',
      howBody: 'Type ',
      howMid: ' and autocomplete shows all available commands — both built-in and custom commands from ',
      howEnd: '. Commands do not consume extra tokens beyond the actions they trigger.',
      stats: [
        { key: '20+',   label: ' built-in commands' },
        { key: 'Tab',   label: ' for autocomplete' },
        { key: '/help', label: ' lists all' },
        { key: '∞',     label: ' custom commands' },
      ],
      countSuffix: ' commands',
      patternsTitle: 'Common combinations',
      patterns: [
        {
          label: 'Long session → compact',
          code: '> /cost      # check usage\n> /compact   # summarize history\n> /cost      # confirm savings',
        },
        {
          label: 'Switch task → fresh context',
          code: '> # Finished auth, moving to UI\n> /clear\n> "Create the dashboard page"',
        },
        {
          label: 'Auto-review before commit',
          code: '> /review\n> # Address found issues\n> /compact    # if session is long\n> "git commit -m fix(auth): ..."',
        },
        {
          label: 'Debug with a stronger model',
          code: '> /model claude-opus-4-8\n> "megathink: why do tests fail on CI?"\n> /model claude-sonnet-5  # switch back',
        },
      ] as PatternItem[],
    },
    flags: {
      syntaxTitle: 'CLI flags — general syntax',
      syntaxCode: `claude [flags] [prompt]
claude -p "prompt" --output-format json
claude --model claude-opus-4-8 --verbose
claude -c "continue the task"

# Check the full list with:
claude --help`,
      settingsNote: 'Session flags (--model, --verbose) can also be set permanently in ',
      countSuffix: ' flags',
      scriptsTitle: 'Real-world scripts with CLI flags',
      scripts: [
        {
          label: 'Pre-commit hook — security review',
          code: `#!/bin/bash
# .git/hooks/pre-commit
DIFF=$(git diff --cached)
RESULT=$(echo "$DIFF" | claude -p \\
  "Find security issues in this diff: $DIFF" \\
  --output-format json \\
  --allowedTools "")

ISSUES=$(echo "$RESULT" | jq -r '.result')
if echo "$ISSUES" | grep -q "CRITICAL"; then
  echo "❌ Security issues found:"
  echo "$ISSUES"
  exit 1
fi`,
        },
        {
          label: 'CI/CD — automatic changelog generation',
          code: `# .github/workflows/release.yml
- name: Generate changelog
  run: |
    COMMITS=$(git log --oneline v$PREV_VERSION..HEAD)
    claude -p "Generate a professional changelog from these commits:
    $COMMITS
    Format: ### Features, ### Fixes, ### Breaking Changes" \\
      --output-format text \\
      --model claude-haiku-4-5 \\
      --dangerously-skip-permissions \\
      > CHANGELOG_NEW.md`,
        },
        {
          label: 'Batch processing — document functions',
          code: `#!/bin/bash
# Document all functions in a directory
for file in src/**/*.ts; do
  echo "Processing: $file"
  claude -p "Add JSDoc to undocumented functions in $file.
  Edit the file directly." \\
    --max-turns 5 \\
    --allowedTools "Read,Edit" \\
    --append-system-prompt "Preserve the existing style."
done`,
        },
      ] as PatternItem[],
    },
    shortcuts: {
      items: [
        { keys: ['Esc'],          action: 'Interrupt current execution',               when: 'Claude is working — immediate stop, you can redirect without losing context' },
        { keys: ['Shift', 'Tab'], action: 'Cycle modes: Normal → Plan → Auto-accept',  when: 'Anytime in conversation — changes execution behaviour' },
        { keys: ['Ctrl', 'C'],    action: 'Force-quit Claude Code',                    when: 'Application is unresponsive or you want to exit immediately' },
        { keys: ['↑'],            action: 'Previous message from input history',       when: 'Input field empty — scroll through previous prompts' },
        { keys: ['↓'],            action: 'Next message from input history',           when: 'Navigate back toward the most recent message' },
        { keys: ['Tab'],          action: 'Autocomplete @ reference or / command',     when: 'Typed @ or / — completes file path or command' },
        { keys: ['Ctrl', 'J'],    action: 'New line without sending the message',      when: 'Multi-line prompt — Enter would send, Ctrl+J adds newline' },
        { keys: ['Ctrl', 'R'],    action: 'Search shell command history',              when: 'At the terminal prompt, before launching claude' },
      ] as Shortcut[],
      modesTitle: 'Execution modes — cycle with ',
      modes: [
        {
          name: 'Normal',
          color: 'text-amber-400 border-amber-500/30 bg-amber-500/5',
          badge: 'DEFAULT',
          desc: 'Claude asks for confirmation before each impactful action: file writes, Bash commands, destructive operations.',
          when: 'Daily work — maximum safety',
        },
        {
          name: 'Plan Mode',
          color: 'text-purple-400 border-purple-500/30 bg-purple-500/5',
          badge: 'PLAN',
          desc: 'Claude produces a full execution plan before making any changes. You approve or reject the plan as a whole.',
          when: 'Complex multi-step tasks — verify intent first',
        },
        {
          name: 'Auto-accept',
          color: 'text-green-400 border-green-500/30 bg-green-500/5',
          badge: 'AUTO',
          desc: 'Claude executes all actions without confirmation. Fast, but risk of unwanted changes. Equivalent to --dangerously-skip-permissions in session.',
          when: 'Well-understood repetitive tasks, test environments',
        },
      ] as ExecMode[],
      escTitle: 'The Escape flow — the most important shortcut',
      escSteps: [
        { label: 'Claude working',      sub: 'executing steps' },
        { label: 'Press Esc',           sub: 'immediate stop', highlight: true },
        { label: 'Claude stops',        sub: 'files are safe' },
        { label: 'Give new instructions', sub: 'redirect task' },
        { label: 'Claude continues',    sub: 'new direction' },
      ] as EscStep[],
      escNote: 'Unlike Ctrl+C which forces an exit, ',
      escNoteStrong: 'Esc',
      escNoteSuffix: ' stops execution while preserving conversation context. You can redirect Claude without restarting the session.',
    },
    custom: {
      whatTitle: 'What are custom slash commands',
      whatBody: '',
      whatMid: ' files placed in ',
      whatMid2: ' automatically become ',
      whatMid3: ' commands. The file content is the prompt sent to Claude. The ',
      whatEnd: ' variable receives everything you type after the command name.',
      structLabel: 'File structure',
      anatomyLabel: 'Anatomy of a command file',
      stepsTitle: 'Creating a custom command — step by step',
      steps: [
        {
          step: '01', title: 'Create the directory',
          code: 'mkdir -p .claude/commands',
          note: 'Or ~/.claude/commands/ for commands available in any project.',
        },
        {
          step: '02', title: 'Write the .md file',
          code: `# .claude/commands/review.md
Perform a code review on $ARGUMENTS.

Check in order:
1. **Security** — injection, auth bypass, exposed data
2. **TypeScript types** — any, assertions, non-null unsafe
3. **Logic** — edge cases, race conditions, null derefs
4. **Performance** — N+1 queries, unnecessary re-renders

Reply structured with severity: 🔴 CRITICAL / 🟡 WARNING / 🟢 OK`,
          note: '$ARGUMENTS will be replaced with whatever you type after /review.',
        },
        {
          step: '03', title: 'Use the command',
          code: '> /review src/auth/middleware.ts\n> /review src/api/  # or an entire directory',
          note: 'Claude receives the prompt with $ARGUMENTS replaced and executes.',
        },
        {
          step: '04', title: 'Add optional metadata',
          code: `---
description: "Security and code quality review"
allowed-tools: Read,Grep,Glob,Bash
---`,
          note: 'allowed-tools restricts which tools the command can use.',
        },
      ] as StepItem[],
      examplesTitle: 'Ready-to-use command examples',
      examples: [
        {
          name: 'commit.md → /commit',
          desc: 'Generate a conventional commit message',
          content: `Generate a commit message for staged changes.

Analyze \`git diff --staged\` and follow Conventional Commits:
- feat: new feature
- fix: bug fix
- refactor: refactoring without behaviour change
- docs: documentation
- test: tests

Format: <type>(<scope>): <short description>

Optional body with details if changes are complex.
Language: Romanian for internal projects, English for open-source.`,
        },
        {
          name: 'debug.md → /debug $ARGUMENTS',
          desc: 'Deep analysis of an error or file',
          content: `Analyze and fix the issue: $ARGUMENTS

Debug process:
1. Read relevant files from context
2. Identify the exact root cause (not symptoms)
3. Check if the problem occurs in other similar places
4. Propose a minimal fix that does not introduce regressions
5. Suggest a test that would prevent regression

Do not make changes until you explain the cause and proposed fix.`,
        },
        {
          name: 'standup.md → /standup',
          desc: 'Daily summary from git history',
          content: `Generate a stand-up summary from recent activity.

Analyze git log --since="24 hours ago" --oneline and recent CHANGELOG.

Format:
**Yesterday:** [what I finished]
**Today:** [what I plan]
**Blocked:** [anything blocking]

Tone: professional, concise, no excessive technical jargon.
Language: English.`,
        },
      ] as ExampleCmd[],
      bpTitle: 'Best practices for custom commands',
      bp: [
        { tip: 'Specify the output format', detail: 'Claude produces inconsistent output if you do not specify the desired format (JSON, structured markdown, plain text).' },
        { tip: 'Use @references for context', detail: 'Include @src/types.ts or @CLAUDE.md in commands that need project-specific context.' },
        { tip: 'Restrict allowed-tools', detail: 'An analysis command does not need Bash or Write. Restrict tools for better security and speed.' },
        { tip: 'Version in the repository', detail: '.claude/commands/ is committed together with the code. The whole team benefits from the same standardised commands.' },
        { tip: 'Atomic, not monolithic commands', detail: 'One command = one well-defined thing. /review for reviewing, /commit for committing — not one that does both.' },
        { tip: 'Test with --verbose', detail: 'claude --verbose /your-command shows exactly what prompt Claude received and which tools it called.' },
      ] as BpItem[],
    },
    moduri: {
      modesTitle: 'Claude Code execution modes',
      modes: [
        {
          name: 'Interactive',
          color: 'border-amber-500/30 bg-amber-500/5',
          badge: 'text-amber-400 bg-amber-500/15',
          how: 'claude',
          desc: 'Conversational REPL with full UI. Claude reads files, executes commands and reports in real time. You can interrupt (Esc) and redirect at any time.',
          when: ['Active development', 'Interactive debugging', 'Codebase exploration', 'Multi-step tasks'],
        },
        {
          name: 'Headless / -p',
          color: 'border-purple-500/30 bg-purple-500/5',
          badge: 'text-purple-400 bg-purple-500/15',
          how: 'claude -p "prompt"',
          desc: 'Non-interactive mode: receives a prompt, executes and exits. Returns output to stdout. Ideal for automation and pipes.',
          when: ['CI/CD pipelines', 'Shell scripts', 'Cron jobs', 'Pre-commit hooks'],
        },
        {
          name: 'Pipe / stdin',
          color: 'border-blue-500/30 bg-blue-500/5',
          badge: 'text-blue-400 bg-blue-500/15',
          how: 'echo "..." | claude -p -',
          desc: 'Accepts input from stdin. Combine with other Unix commands. Processes output from other processes or large files.',
          when: ['CLI output processing', 'Log analysis', 'Data transformation', 'Batch files'],
        },
      ] as ModeItem[],
      outputTitle: 'Output formats — --output-format',
      formats: [
        {
          format: 'text',
          label: 'Plain text',
          color: 'text-amber-400',
          use: 'Human consumption, redirect to files, READMEs',
          output: `The \`validateEmail\` function does not
handle international addresses
(e.g. utilisateur@domaine.fr).

I recommend adding the
RFC 5322 regex for full validation.`,
        },
        {
          format: 'json',
          label: 'Full JSON',
          color: 'text-purple-400',
          use: 'Programmatic processing, structured logging, API',
          output: `{
  "result": "The function ...",
  "model": "claude-sonnet-5",
  "inputTokens": 1240,
  "outputTokens": 87,
  "durationMs": 2341,
  "stopReason": "end_turn"
}`,
        },
        {
          format: 'stream-json',
          label: 'Streaming JSON',
          color: 'text-blue-400',
          use: 'Live progress, dashboard, incremental processing',
          output: `{"type":"start","model":"..."}
{"type":"text","delta":"The function"}
{"type":"text","delta":" validate"}
{"type":"text","delta":"Email..."}
{"type":"end","tokens":{"in":1240}}`,
        },
      ] as OutputFormat[],
      formatExamples: [
        { cmd: 'claude -p "..." --output-format text > out.txt',                                                                                             label: 'text → file' },
        { cmd: 'claude -p "..." --output-format json | jq .result',                                                                                         label: 'json → jq' },
        { cmd: "claude -p \"...\" --output-format stream-json | while IFS= read -r line; do echo \"$line\" | jq -r '.delta // empty'; done",                label: 'stream → live' },
      ] as { cmd: string; label: string }[],
      stdinTitle: 'stdin patterns — pipe with other commands',
      stdinPatterns: [
        { desc: 'Analyze output of a failed build',           code: 'npm run build 2>&1 | claude -p "Explain the errors and propose fixes"' },
        { desc: 'Summarize production error logs',            code: 'tail -n 500 /var/log/app.log | claude -p "Group errors, identify patterns and prioritise"' },
        { desc: 'Review diff before push',                    code: 'git diff main..HEAD | claude -p "Code review: security, types, logic" --output-format json | jq .result' },
        { desc: 'Document output of a script',               code: 'cat src/utils/*.ts | claude -p "Generate Markdown documentation for all exported functions"' },
        { desc: 'Translate error messages for users',        code: 'cat errors.json | claude -p "Turn these technical messages into friendly user-facing messages in English"' },
      ] as StdinPattern[],
    },
    cmds: [
      // session
      {
        cmd: '/clear', desc: 'Clear all conversation history',
        detail: 'Completely frees accumulated context. Claude forgets all previous messages, you start with 0 tokens used. Use when switching tasks entirely or wanting a clean slate.',
        cat: 'session',
        example: '> /clear\nContext cleared. Active tokens: 0\nYou can start a new task.',
      },
      {
        cmd: '/compact', args: '[focus instructions]', desc: 'Summarise history while saving context',
        detail: 'Replaces the long conversation with a focused summary. Optionally specify which information to retain. Saves 70–90% of tokens compared to full history.',
        cat: 'session',
        example: '> /compact Keep only architectural decisions\nCompacted: 18.4k → 1.2k tokens',
      },
      {
        cmd: '/cost', desc: 'Show token usage and estimated cost',
        detail: 'Full session breakdown: input / output / cache, cache hit rate and total cost in USD. Essential for budget monitoring on long tasks.',
        cat: 'session',
        example: '> /cost\nInput:  45.2k  ($0.14)\nOutput:  8.1k  ($0.12)\nCached: 38.0k  ($0.04)\nEstimated total: $0.30',
      },
      {
        cmd: '/exit', desc: 'Exit Claude Code (alias: /quit)',
        detail: 'Session and conversation history are saved automatically. You can return with claude --continue or claude -c.',
        cat: 'session',
      },
      // memorie
      {
        cmd: '/init', desc: 'Generate CLAUDE.md for the current project',
        detail: 'Scans the directory structure, detects framework, language, ORM and generates a base CLAUDE.md with auto-detected conventions. The result should be reviewed and completed manually.',
        cat: 'memorie',
        example: '> /init\nDetected: Next.js 15 + TypeScript + Prisma 7\nGenerated CLAUDE.md (312 chars) — review it!',
      },
      {
        cmd: '/memory', desc: 'Open CLAUDE.md in the editor for editing',
        detail: 'Opens the active CLAUDE.md file in $EDITOR. Changes are detected instantly and applied to the current conversation without restarting.',
        cat: 'memorie',
      },
      // tools
      {
        cmd: '/model', args: '[model-id]', desc: 'View or change the active model',
        detail: 'Without argument: shows current model and available alternatives. With argument: instant switch in session, without modifying settings.json.',
        cat: 'tools',
        example: '> /model claude-opus-4-8\nSwitched: claude-sonnet-5 → claude-opus-4-8\nCost: ↑1,7× input · ↑1,7× output',
      },
      {
        cmd: '/permissions', desc: 'Manage tool permissions',
        detail: 'Lists all tools with their current status (allow / ask / deny) and allows on-the-fly modification without session restart.',
        cat: 'tools',
      },
      {
        cmd: '/approved-tools', desc: 'View approved tools',
        detail: 'Shows built-in and MCP tools with their status. Also includes tools from connected MCP servers, unlike /permissions.',
        cat: 'tools',
      },
      {
        cmd: '/mcp', desc: 'Manage connected MCP servers',
        detail: 'Lists active MCP connections, available tools from each server, connection status and configuration errors. Indispensable for MCP debugging.',
        cat: 'tools',
        example: '> /mcp\n● github   (connected) — 8 tools\n● postgres (connected) — 3 tools\n○ slack    (error)     — auth failed',
      },
      // review
      {
        cmd: '/review', desc: 'Automatic code review on current changes',
        detail: 'Analyses the diff against main / base branch. Checks security, TypeScript types, potential bugs, style conventions and performance issues.',
        cat: 'review',
        example: '> /review\n🔴 auth.ts:42 — potential SQL injection\n🟡 api.ts:18  — unhandled Promise\n🟢 model.ts   — types correct',
      },
      {
        cmd: '/pr_comments', args: '<PR-number>', desc: 'Import comments from a GitHub Pull Request',
        detail: 'Fetches PR comments and adds them to context. Claude can address each comment and generate the corresponding fixes.',
        cat: 'review',
        example: '> /pr_comments 247\nImported 8 comments from PR #247\n> "Address all comments"',
      },
      {
        cmd: '/plan', desc: 'Toggle Plan Mode (equivalent to Shift+Tab)',
        detail: 'Activates / deactivates Plan Mode. Claude proposes a detailed execution plan before making any change. You approve or reject the plan.',
        cat: 'review',
      },
      // utilitar
      {
        cmd: '/help', desc: 'List all available commands',
        detail: 'Shows built-in commands and custom commands from .claude/commands/ with a short description. Also includes MCP commands if servers are connected.',
        cat: 'utilitar',
      },
      {
        cmd: '/status', desc: 'Connection and configuration status',
        detail: 'Shows: active model, API key (partially masked), allowed directories, Claude Code version and configured MCP servers.',
        cat: 'utilitar',
      },
      {
        cmd: '/doctor', desc: 'Diagnose Claude Code installation',
        detail: 'Checks: Node.js version, API key presence, file permissions, PATH configuration and connectivity to api.anthropic.com.',
        cat: 'utilitar',
      },
      {
        cmd: '/login', desc: 'Switch active Anthropic account',
        detail: 'Useful for working with multiple organisations or accounts. Overrides ANTHROPIC_API_KEY for the current session.',
        cat: 'utilitar',
      },
      {
        cmd: '/vim', desc: 'Toggle Vim keybindings in the input field',
        detail: 'Enables Vim navigation (hjkl, i, Esc, /, etc.) in the input. Does not affect file editing within the project.',
        cat: 'utilitar',
      },
      {
        cmd: '/terminal-setup', desc: 'Configure terminal integration',
        detail: 'Installs shell hooks for iTerm2, Wezterm or Ghost Terminal: notifications, dynamic window titles, per-status colours.',
        cat: 'utilitar',
      },
      {
        cmd: '/bug', desc: 'Report a bug in Claude Code',
        detail: 'Opens the report form with auto-attached context: version, OS, last actions, relevant logs. Goes directly to the Anthropic team.',
        cat: 'utilitar',
      },
    ] as SlashCmd[],
    flagItems: [
      // mode
      {
        flag: '--print', short: '-p', arg: '"prompt"',
        desc: 'Non-interactive mode: processes the prompt and exits immediately. Essential for CI/CD, shell scripts and pipes.',
        example: 'claude -p "Summarise CHANGELOG.md" > summary.txt',
        grp: 'mode',
      },
      {
        flag: '--output-format', arg: 'text|json|stream-json',
        desc: 'Response format in headless mode. json includes full metadata (tokens, model, duration). stream-json: one JSON object per line — ideal for real-time processing.',
        example: 'claude -p "Review src/" --output-format json | jq .result',
        grp: 'mode',
      },
      {
        flag: '--verbose',
        desc: 'Extended output: shows tool calls, timing, live token count and the internal reasoning for each step.',
        example: 'claude --verbose "Debug the timeout in server.ts"',
        grp: 'mode',
      },
      // model
      {
        flag: '--model', short: '-m', arg: 'model-id',
        desc: 'Select the model for the current session. Overrides settings.json only for this run.',
        example: 'claude -m claude-opus-4-8 "Design the microservices architecture"',
        grp: 'model',
      },
      {
        flag: '--max-turns', arg: 'N',
        desc: 'Maximum number of agentic iterations. Claude stops after N steps and returns what it has accomplished so far.',
        example: 'claude -p "Refactor src/" --max-turns 15',
        grp: 'model',
      },
      // safety
      {
        flag: '--dangerously-skip-permissions',
        desc: 'Skips ALL permission confirmations. Executes any Bash command, writes any file without human confirmation. Only in isolated environments.',
        example: '# Only in Docker container or isolated CI\nclaude -p "npm ci && npm test" \\\n  --dangerously-skip-permissions',
        grp: 'safety',
        danger: true,
      },
      {
        flag: '--allowedTools', arg: '"t1,t2,..."',
        desc: 'Whitelist of allowed tools. Claude can use ONLY the listed tools. All others are blocked implicitly.',
        example: 'claude -p "Analyse the code" \\\n  --allowedTools "Read,Grep,Glob"',
        grp: 'safety',
      },
      {
        flag: '--disallowedTools', arg: '"t1,t2,..."',
        desc: 'Explicit blacklist of forbidden tools. The rest remain available. Less restrictive than --allowedTools.',
        example: 'claude -p "Explain the flow" \\\n  --disallowedTools "Bash,Write,Edit"',
        grp: 'safety',
      },
      // context
      {
        flag: '--add-dir', arg: 'path',
        desc: 'Add an extra directory to the list of allowed paths. Claude can read / write files from that path too.',
        example: 'claude --add-dir /shared/libs \\\n  "Analyse common dependencies"',
        grp: 'context',
      },
      {
        flag: '--system-prompt', arg: '"text"',
        desc: 'Completely replaces the default system prompt. Removes all built-in instructions. Use carefully — you lose safety behaviours.',
        example: 'claude --system-prompt \\\n  "You are a Rust expert. Reply only in EN." \\\n  -p "Explain ownership"',
        grp: 'context',
      },
      {
        flag: '--append-system-prompt', arg: '"text"',
        desc: 'Appends instructions to the default system prompt without replacing it. Recommended over --system-prompt.',
        example: 'claude --append-system-prompt \\\n  "Use strict TypeScript." \\\n  -p "Create a User model"',
        grp: 'context',
      },
      // conv
      {
        flag: '--continue', short: '-c',
        desc: 'Continue the most recent conversation. Restores context, history and state from the previous session.',
        example: 'claude -c "Check if tests pass now"',
        grp: 'conv',
      },
      {
        flag: '--resume', arg: 'session-id',
        desc: 'Continue a specific conversation by ID (not necessarily the most recent). The ID appears in /status.',
        example: 'claude --resume sess_abc123 \\\n  "Continue with step 3 of the plan"',
        grp: 'conv',
      },
    ] as CliFlag[],
  },
}

// ─── Helper sub-components ────────────────────────────────────────────────────

function Pill({ text, active, onClick }: { text: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
        active
          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
          : 'bg-zinc-800/60 text-zinc-400 border border-zinc-700/50 hover:text-zinc-200'
      }`}
    >
      {text}
    </button>
  )
}

function CmdCard({ c, catLabel }: { c: SlashCmd; catLabel: string }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="font-mono text-sm font-bold text-amber-400">{c.cmd}</span>
          {c.args && (
            <span className="ml-1 font-mono text-xs text-zinc-500">{c.args}</span>
          )}
        </div>
        <span className="shrink-0 rounded-full bg-zinc-800/80 px-2 py-0.5 text-[10px] text-zinc-500">
          {catLabel}
        </span>
      </div>
      <p className="text-sm font-medium text-white">{c.desc}</p>
      <p className="text-xs leading-relaxed text-zinc-500">{c.detail}</p>
      {c.example && (
        <pre className="rounded-lg bg-zinc-950 border border-zinc-800 p-3 font-mono text-xs text-zinc-400 overflow-x-auto leading-relaxed">
          {c.example}
        </pre>
      )}
    </div>
  )
}

function FlagCard({ f, dangerLabel }: { f: CliFlag; dangerLabel: string }) {
  return (
    <div className={`rounded-xl border p-4 flex flex-col gap-3 ${
      f.danger ? 'border-red-500/30 bg-red-500/5' : 'border-zinc-800 bg-zinc-900/40'
    }`}>
      <div className="flex items-start gap-2 flex-wrap">
        <span className={`font-mono text-sm font-bold ${f.danger ? 'text-red-400' : 'text-amber-400'}`}>
          {f.flag}
        </span>
        {f.short && (
          <span className="font-mono text-xs text-zinc-500 self-center">/ {f.short}</span>
        )}
        {f.arg && (
          <span className="font-mono text-xs text-purple-400 self-center">{f.arg}</span>
        )}
        {f.danger && (
          <span className="ml-auto shrink-0 rounded-full bg-red-500/15 border border-red-500/30 px-2 py-0.5 text-[10px] font-bold text-red-400">
            {dangerLabel}
          </span>
        )}
      </div>
      <p className="text-xs leading-relaxed text-zinc-400">{f.desc}</p>
      <pre className="rounded-lg bg-zinc-950 border border-zinc-800 p-3 font-mono text-xs text-zinc-400 overflow-x-auto leading-relaxed">
        {f.example}
      </pre>
    </div>
  )
}

// ─── Tab components ───────────────────────────────────────────────────────────

function TabSlash() {
  const { lang } = useApp()
  const c = CONTENT[lang]
  const [cat, setCat] = useState<CmdCat>('toate')
  const cats = Object.keys(c.catLabels) as CmdCat[]
  const visible = cat === 'toate' ? c.cmds : c.cmds.filter((cmd) => cmd.cat === cat)

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
        <h3 className="mb-2 text-sm font-semibold text-white">{c.slash.howTitle}</h3>
        <p className="text-sm leading-relaxed text-zinc-400">
          {c.slash.howBody}<span className="font-mono text-amber-400">/</span>{c.slash.howMid}
          <span className="font-mono text-amber-300">.claude/commands/</span>{c.slash.howEnd}
        </p>
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-zinc-500">
          {c.slash.stats.map((s) => (
            <span key={s.key}><span className="text-amber-400">{s.key}</span>{s.label}</span>
          ))}
        </div>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {cats.map((cat_) => (
          <Pill key={cat_} text={c.catLabels[cat_]} active={cat === cat_} onClick={() => setCat(cat_)} />
        ))}
        <span className="ml-auto text-xs text-zinc-600 self-center">{visible.length}{c.slash.countSuffix}</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {visible.map((cmd) => <CmdCard key={cmd.cmd} c={cmd} catLabel={c.catLabels[cmd.cat]} />)}
      </div>

      {/* Quick patterns */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
        <h3 className="mb-4 text-sm font-semibold text-white">{c.slash.patternsTitle}</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {c.slash.patterns.map((p) => (
            <div key={p.label} className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-3">
              <p className="mb-2 text-xs font-semibold text-zinc-300">{p.label}</p>
              <pre className="font-mono text-xs text-zinc-500 leading-relaxed overflow-x-auto">{p.code}</pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function TabFlags() {
  const { lang } = useApp()
  const c = CONTENT[lang]
  const [grp, setGrp] = useState<FlagGrp>('toate')
  const grps = Object.keys(c.grpLabels) as FlagGrp[]
  const visible = grp === 'toate' ? c.flagItems : c.flagItems.filter((f) => f.grp === grp)
  const dangerLabel = lang === 'ro' ? '⚠ PERICOL' : '⚠ DANGER'

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
        <h3 className="mb-2 text-sm font-semibold text-white">{c.flags.syntaxTitle}</h3>
        <pre className="font-mono text-sm leading-relaxed text-zinc-400 overflow-x-auto">
          {c.flags.syntaxCode}
        </pre>
        <p className="mt-3 text-xs text-zinc-600">
          {c.flags.settingsNote}
          <span className="font-mono text-amber-400">~/.claude/settings.json</span>.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {grps.map((g) => (
          <Pill key={g} text={c.grpLabels[g]} active={grp === g} onClick={() => setGrp(g)} />
        ))}
        <span className="ml-auto text-xs text-zinc-600 self-center">{visible.length}{c.flags.countSuffix}</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {visible.map((f) => <FlagCard key={f.flag} f={f} dangerLabel={dangerLabel} />)}
      </div>

      {/* Real-world scripts */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
        <h3 className="mb-4 text-sm font-semibold text-white">{c.flags.scriptsTitle}</h3>
        <div className="space-y-4">
          {c.flags.scripts.map((s) => (
            <div key={s.label} className="rounded-lg border border-zinc-800 bg-zinc-900/30">
              <div className="border-b border-zinc-800 px-4 py-2">
                <span className="text-xs font-semibold text-zinc-300">{s.label}</span>
              </div>
              <pre className="overflow-x-auto p-4 font-mono text-xs text-zinc-400 leading-relaxed">{s.code}</pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function TabShortcuts() {
  const { lang } = useApp()
  const c = CONTENT[lang]

  return (
    <div className="space-y-6">
      {/* Visual shortcut cards */}
      <div className="grid gap-3 sm:grid-cols-2">
        {c.shortcuts.items.map((s) => (
          <div key={s.keys.join('+')} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 flex gap-4 items-start">
            <div className="flex shrink-0 flex-wrap gap-1">
              {s.keys.map((k) => (
                <kbd key={k} className="inline-flex items-center justify-center rounded-md border border-zinc-600 bg-zinc-800 px-2 py-1 font-mono text-xs font-bold text-zinc-200 shadow-sm">
                  {k}
                </kbd>
              ))}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{s.action}</p>
              <p className="mt-0.5 text-xs text-zinc-500">{s.when}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Execution modes */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
        <h3 className="mb-4 text-sm font-semibold text-white">
          {c.shortcuts.modesTitle}
          <kbd className="rounded-md border border-zinc-600 bg-zinc-800 px-1.5 py-0.5 font-mono text-xs">Shift+Tab</kbd>
        </h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {c.shortcuts.modes.map((m) => (
            <div key={m.name} className={`rounded-xl border p-4 ${m.color}`}>
              <div className="mb-2 flex items-center justify-between">
                <span className="font-bold text-sm">{m.name}</span>
                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${m.color}`}>{m.badge}</span>
              </div>
              <p className="text-xs leading-relaxed text-zinc-400">{m.desc}</p>
              <p className="mt-2 text-[10px] text-zinc-600 italic">{m.when}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Esc flow */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
        <h3 className="mb-3 text-sm font-semibold text-amber-400">{c.shortcuts.escTitle}</h3>
        <div className="flex items-start gap-3">
          <div className="grid grid-cols-5 gap-2 flex-1 items-center">
            {c.shortcuts.escSteps.map((step, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className={`rounded-lg border p-2 text-center text-xs font-semibold w-full ${
                  step.highlight
                    ? 'border-amber-500/40 bg-amber-500/15 text-amber-300'
                    : 'border-zinc-700 bg-zinc-800/60 text-zinc-300'
                }`}>
                  {step.label}
                </div>
                <span className="text-[10px] text-zinc-600">{step.sub}</span>
                {i < 4 && <ChevronRight className="h-3 w-3 text-zinc-700 hidden sm:block" />}
              </div>
            ))}
          </div>
        </div>
        <p className="mt-3 text-xs text-zinc-500">
          {c.shortcuts.escNote}<strong className="text-zinc-300">{c.shortcuts.escNoteStrong}</strong>{c.shortcuts.escNoteSuffix}
        </p>
      </div>
    </div>
  )
}

function TabCustom() {
  const { lang } = useApp()
  const c = CONTENT[lang]

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
        <h3 className="mb-3 text-sm font-semibold text-white">{c.custom.whatTitle}</h3>
        <p className="text-sm leading-relaxed text-zinc-400 mb-4">
          {c.custom.whatBody}<span className="font-mono text-amber-400">.md</span>{c.custom.whatMid}
          <span className="font-mono text-amber-400">.claude/commands/</span>{c.custom.whatMid2}
          <span className="font-mono text-amber-400">/nume-fisier</span>{c.custom.whatMid3}
          <span className="font-mono text-amber-400">$ARGUMENTS</span>{c.custom.whatEnd}
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-semibold text-zinc-400">{c.custom.structLabel}</p>
            <pre className="rounded-lg bg-zinc-900 border border-zinc-800 p-3 font-mono text-xs text-zinc-400 leading-relaxed">
{`proiect/
├── .claude/
│   ├── commands/          # Project commands
│   │   ├── review.md      → /review
│   │   ├── commit.md      → /commit
│   │   └── debug.md       → /debug
│   └── CLAUDE.md
└── src/

~/.claude/
└── commands/              # Personal commands
    ├── standup.md         → /standup
    └── refactor.md        → /refactor`}
            </pre>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold text-zinc-400">{c.custom.anatomyLabel}</p>
            <pre className="rounded-lg bg-zinc-900 border border-zinc-800 p-3 font-mono text-xs text-zinc-400 leading-relaxed">
{`---
description: "Short description"
allowed-tools: Read,Grep,Glob
---

# The actual prompt

Analyse $ARGUMENTS and:
1. Check security
2. Check TS types
3. Suggest improvements

@src/types.ts for context.`}
            </pre>
          </div>
        </div>
      </div>

      {/* Step-by-step */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
        <h3 className="mb-4 text-sm font-semibold text-white">{c.custom.stepsTitle}</h3>
        <div className="space-y-3">
          {c.custom.steps.map((s) => (
            <div key={s.step} className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500/15 font-mono text-xs font-bold text-amber-400">
                {s.step}
              </div>
              <div className="flex-1 min-w-0">
                <p className="mb-1.5 text-sm font-semibold text-white">{s.title}</p>
                <pre className="rounded-lg bg-zinc-900 border border-zinc-800 p-3 font-mono text-xs text-zinc-400 overflow-x-auto leading-relaxed mb-1.5">{s.code}</pre>
                <p className="text-xs text-zinc-600">{s.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Example commands */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
        <h3 className="mb-4 text-sm font-semibold text-white">{c.custom.examplesTitle}</h3>
        <div className="space-y-4">
          {c.custom.examples.map((ex) => (
            <div key={ex.name} className="rounded-lg border border-zinc-800 bg-zinc-900/30">
              <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2">
                <span className="font-mono text-xs font-bold text-amber-400">{ex.name}</span>
                <span className="text-xs text-zinc-500">{ex.desc}</span>
              </div>
              <pre className="overflow-x-auto p-4 font-mono text-xs text-zinc-400 leading-relaxed">{ex.content}</pre>
            </div>
          ))}
        </div>
      </div>

      {/* Best practices */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
        <h3 className="mb-3 text-sm font-semibold text-white">{c.custom.bpTitle}</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {c.custom.bp.map((bp) => (
            <div key={bp.tip} className="flex gap-3">
              <div className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-amber-500/20 flex items-center justify-center">
                <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-200">{bp.tip}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{bp.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function TabModuri() {
  const { lang } = useApp()
  const c = CONTENT[lang]

  return (
    <div className="space-y-6">
      {/* Modes comparison */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
        <h3 className="mb-4 text-sm font-semibold text-white">{c.moduri.modesTitle}</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          {c.moduri.modes.map((m) => (
            <div key={m.name} className={`rounded-xl border p-4 ${m.color}`}>
              <div className="mb-3 flex items-center justify-between">
                <span className="font-bold text-sm text-white">{m.name}</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${m.badge}`}>{m.how}</span>
              </div>
              <p className="text-xs leading-relaxed text-zinc-400 mb-3">{m.desc}</p>
              <ul className="space-y-1">
                {m.when.map((w) => (
                  <li key={w} className="flex items-center gap-1.5 text-xs text-zinc-500">
                    <div className="h-1 w-1 rounded-full bg-zinc-600" />{w}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Output format comparison */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
        <h3 className="mb-4 text-sm font-semibold text-white">{c.moduri.outputTitle}</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          {c.moduri.formats.map((f) => (
            <div key={f.format} className="rounded-xl border border-zinc-800 bg-zinc-900/40">
              <div className="border-b border-zinc-800 px-4 py-2.5 flex items-center justify-between">
                <span className={`font-mono text-sm font-bold ${f.color}`}>{f.format}</span>
                <span className="text-xs text-zinc-500">{f.label}</span>
              </div>
              <div className="p-3">
                <p className="mb-2 text-xs text-zinc-500">{f.use}</p>
                <pre className="font-mono text-xs text-zinc-400 leading-relaxed overflow-x-auto">{f.output}</pre>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {c.moduri.formatExamples.map((ex) => (
            <div key={ex.label} className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5">
              <p className="mb-1 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">{ex.label}</p>
              <pre className="font-mono text-xs text-zinc-400 overflow-x-auto">{ex.cmd}</pre>
            </div>
          ))}
        </div>
      </div>

      {/* Stdin patterns */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
        <h3 className="mb-4 text-sm font-semibold text-white">{c.moduri.stdinTitle}</h3>
        <div className="space-y-3">
          {c.moduri.stdinPatterns.map((p) => (
            <div key={p.desc} className="flex gap-3 items-start">
              <div className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-amber-500/15 flex items-center justify-center">
                <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="mb-1 text-xs font-semibold text-zinc-300">{p.desc}</p>
                <pre className="rounded-lg bg-zinc-900 border border-zinc-800 p-2.5 font-mono text-xs text-zinc-400 overflow-x-auto">{p.code}</pre>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

const TABS = [
  { id: 'slash',     icon: <Hash className="h-3.5 w-3.5" /> },
  { id: 'flags',     icon: <Flag className="h-3.5 w-3.5" /> },
  { id: 'shortcuts', icon: <Keyboard className="h-3.5 w-3.5" /> },
  { id: 'custom',    icon: <Package className="h-3.5 w-3.5" /> },
  { id: 'moduri',    icon: <Play className="h-3.5 w-3.5" /> },
] as const

type TabId = typeof TABS[number]['id']

export default function CliCommands() {
  const { lang } = useApp()
  const c = CONTENT[lang]
  const [tab, setTab] = useState<TabId>('slash')

  return (
    <div className="px-6 py-10">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
            <Terminal className="h-3 w-3" />
            {c.badge}
          </div>
          <h1 className="mb-3 text-3xl font-bold text-white sm:text-4xl">
            {c.title}
          </h1>
          <p className="max-w-2xl text-zinc-400 leading-relaxed">
            {c.desc}
          </p>
        </div>

        {/* Stats strip */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {c.stats.map((s) => (
            <div key={s.val} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 text-center">
              <div className={`text-2xl font-bold ${s.color}`}>{s.val}</div>
              <div className="mt-0.5 text-sm font-semibold text-zinc-200">{s.label}</div>
              <div className="mt-0.5 text-xs text-zinc-600">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Sticky tabs */}
        <div
          className="sticky top-16 z-10 -mx-6 mb-6 border-b border-zinc-800/60 bg-zinc-950/90 px-6 backdrop-blur"
          style={{ WebkitBackdropFilter: 'blur(12px)' }}
        >
          <div
            className="flex gap-1 overflow-x-auto py-3"
            style={{ scrollbarWidth: 'none' }}
          >
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                  tab === t.id
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {t.icon}
                {c.tabLabels[t.id]}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-5 sm:p-6">
          {tab === 'slash'     && <TabSlash />}
          {tab === 'flags'     && <TabFlags />}
          {tab === 'shortcuts' && <TabShortcuts />}
          {tab === 'custom'    && <TabCustom />}
          {tab === 'moduri'    && <TabModuri />}
        </div>

        {/* Security note */}
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4">
          <Shield className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-400">{c.securityNote.title}</p>
            <p className="mt-0.5 text-xs leading-relaxed text-zinc-400">
              <span className="font-mono text-red-400">--dangerously-skip-permissions</span>{c.securityNote.body}
              <span className="font-mono text-red-400">Auto-accept mode</span>{c.securityNote.suffix}
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
