import { useState } from 'react'
import { Sparkles, FolderOpen, Terminal, Zap, BookOpen, AlertTriangle, Lightbulb, CheckCircle, Code2, GitBranch, ShieldCheck, FlaskConical, FileText, Wrench, Cpu, Filter } from 'lucide-react'
import { CodeBlock } from './CodeBlock'
import { useApp } from '../contexts/AppContext'

type TabId = 'introducere' | 'structura' | 'invocare' | 'avansat' | 'exemple'
interface Tab { id: TabId; label: string; icon: React.ReactNode }

// ── CONTENT ────────────────────────────────────────────────────────────────

interface StepItem { title: string; detail: string; color: string }
interface VsRow { tool: string; icon: string; when: string; why: string; border: string }
interface LocationRow { level: string; path: string; color: string; scope: string }
interface BuiltinItem { cmd: string; desc: string }
interface FrontmatterField { field: string; type: string; req: boolean; desc: string }
interface VarRow { var: string; desc: string }
interface AgentRow { val: string; desc: string }
interface CavemanBullet { emoji: string; text: string }

interface IntroContent {
  label: string; title: string; desc: string
  problemTitle: string; problemIntro: string
  withoutLabel: string; withoutPrompt: string; writtenManually: string
  withLabel: string; fetchLog: string; analyzeLog: string; generatedLog: string
  mechanicsTitle: string; steps: StepItem[]
  essenceLabel: string; essenceA: string; essenceB: string; essenceC: string
  vsTitle: string; vsRows: VsRow[]; vsWhen: string; vsWhy: string; vsRule: string
  invocationTitle: string
  userInvokeTitle: string; userInvokeA: string; userInvokeB: string
  claudeInvokeTitle: string; claudeInvokeA: string; claudeInvokeB: string
  userSays: string; claudeDetects: string
  disableWarnA: string; disableWarnB: string
  locationsTitle: string; locations: LocationRow[]; locationsNote: string
  builtinTitle: string; builtinDesc: string; builtinItems: BuiltinItem[]
}

interface StructuraContent {
  label: string; title: string; desc: string
  folderTitle: string; folderCode: string
  skillFormatTitle: string; skillFormatCode: string
  frontmatterTitle: string; recommendedBadge: string; fields: FrontmatterField[]
  liveReloadLabel: string; liveReloadText: string
}

interface InvocareContent {
  label: string; title: string; desc: string
  directTitle: string; directDescA: string; directDescB: string; directCode: string
  autoTitle: string; autoDescA: string; autoDescB: string
  youTypeLabel: string; youType: string; claudeDetectsLabel: string; claudeDetectsText: string
  variablesTitle: string; variables: VarRow[]
  fullExampleTitle: string; fullExampleCode: string; skillMdLabel: string; skillMdCode: string
  lifecycleLabel: string; lifecycleText: string
}

interface AvansatContent {
  label: string; title: string; desc: string
  dynInjTitle: string; dynInjDescA: string; dynInjDescB: string; dynInjDescC: string; dynInjCode: string
  multilineNote: string; multilineCode: string
  subagentTitle: string; subagentDescA: string; subagentDescB: string; subagentCode: string
  agents: AgentRow[]
  preapproveTitle: string; preapproveDescA: string; preapproveDescB: string
  withPromptLabel: string; preapprovedLabel: string
  withPromptCode: string; preapprovedCode: string
  disableModelTitle: string; disableModelDescA: string; disableModelDescB: string; disableModelCode: string
  extendedThinkingTitle: string; extendedThinkingDescA: string; extendedThinkingDescB: string; extendedThinkingCode: string
  bestPracticeLabel: string; bestPracticeText: string
}

interface ExempleContent {
  label: string; title: string; desc: string
  catLabels: Record<SkillCat, string>
  communityEmoji: string; communityTitle: string; communityDescA: string; communityDescB: string
  cavemanEmoji: string; cavemanTitle: string; cavemanDesc: string
  cavemanBullets: CavemanBullet[]
  installTitle: string; installCode: string
  bulkInstallLabel: string; bulkInstallText: string
}

interface ContentShape {
  pageLabel: string; pageTitle: string; pageDesc: string
  stats: { value: string; label: string }[]
  tabs: Record<TabId, string>
  intro: IntroContent
  structura: StructuraContent
  invocare: InvocareContent
  avansat: AvansatContent
  exemple: ExempleContent
  card: {
    hide: string; show: string; saveIn: string
    tokens: Record<'mic' | 'mediu' | 'mare', string>
  }
}

const CONTENT: Record<'ro' | 'en', ContentShape> = {
  ro: {
    pageLabel: 'Lecția 11',
    pageTitle: 'Skills în Claude Code',
    pageDesc: 'Extinde Claude cu proceduri reutilizabile personalizate — de la slash commands simple la workflow-uri avansate cu subagent izolat și injecție dinamică de context.',
    stats: [
      { value: 'SKILL.md', label: 'Fișier de bază' },
      { value: '/slash',   label: 'Invocare directă' },
      { value: '4 nivele', label: 'Scop skills' },
      { value: '26+',      label: 'Skills oficiale Anthropic' },
    ],
    tabs: {
      introducere: 'Ce sunt Skills',
      structura:   'Structura',
      invocare:    'Invocare',
      avansat:     'Avansat',
      exemple:     'Exemple',
    },
    intro: {
      label: 'Fundamente',
      title: 'Skills — Slash commands pe care le definești tu',
      desc: 'Un skill este un fișier Markdown pe care îl scrii o singură dată. De fiecare dată când tastezi /numele-lui, Claude primește automat instrucțiunile tale și le execută.',
      problemTitle: 'Problema pe care o rezolvă',
      problemIntro: 'Fără skills, repeți același prompt complex de fiecare dată. Cu skills, îl scrii o singură dată și îl chemi cu două cuvinte.',
      withoutLabel: 'Fără skill — repeți mereu',
      withoutPrompt: '"Review acest PR. Uită-te la buguri, securitate, OWASP Top 10, missing error handling, race conditions. Raportează cu CRITICAL / WARNING / SUGGESTION cu referință la fișier:linie."',
      writtenManually: '← scris manual, de fiecare dată',
      withLabel: 'Cu skill — două cuvinte',
      fetchLog: '● Fetch diff pentru PR #42...',
      analyzeLog: '● Analizez securitate OWASP...',
      generatedLog: '✓ Raport generat',
      mechanicsTitle: 'Cum funcționează mecanic',
      steps: [
        { title: 'Scrii un fișier SKILL.md', detail: 'Frontmatter YAML + instrucțiuni Markdown. Îl salvezi în ~/.claude/skills/pr-review/SKILL.md', color: 'bg-emerald-500/15 text-emerald-400' },
        { title: 'Tastezi /pr-review 42 în Claude Code', detail: 'Claude Code detectează prefixul / și găsește skill-ul corespunzător pe disc.', color: 'bg-blue-500/15 text-blue-400' },
        { title: 'Conținutul SKILL.md este injectat în conversație', detail: 'Exact ca și cum ai fi copy-pastat manual tot fișierul în chat — dar automat. Claude vede instrucțiunile și argumentul "42".', color: 'bg-purple-500/15 text-purple-400' },
        { title: 'Claude execută instrucțiunile', detail: 'Rulează tool-urile pre-aprobate (gh pr diff, gh pr view), produce raportul exact cum ai specificat.', color: 'bg-amber-500/15 text-amber-400' },
      ],
      essenceLabel: 'Esența:',
      essenceA: ' Un skill nu este cod executabil. Este un ',
      essenceB: 'prompt salvat pe disc',
      essenceC: ' pe care Claude Code îl injectează automat când îl chemi. Toată „magia" vine din instrucțiunile pe care le scrii tu în Markdown.',
      vsTitle: 'Skill vs CLAUDE.md vs prompt direct',
      vsRows: [
        { tool: 'Prompt direct', icon: '💬', when: 'Task unic, ad-hoc, pe care nu îl vei repeta', why: 'Nu merită overhead-ul de a crea un fișier', border: 'border-zinc-800' },
        { tool: 'CLAUDE.md',     icon: '📋', when: 'Fapte permanente: stack-ul proiectului, convenții de cod, reguli de naming', why: 'Mereu în context, indiferent de ce faci. Nu e invocat — e mereu prezent.', border: 'border-amber-500/20' },
        { tool: 'Skill',          icon: '⚡', when: 'Proceduri repetitive cu mai mulți pași pe care le rulezi des', why: 'Lazy-loaded (nu consumă context permanent). Invoci exact când ai nevoie.', border: 'border-emerald-500/20' },
      ],
      vsWhen: 'Când: ',
      vsWhy: 'De ce: ',
      vsRule: 'Regula practică: dacă te-ai prins că ai copy-pastat același prompt de 3+ ori → e momentul să faci un skill.',
      invocationTitle: 'Două moduri de invocare',
      userInvokeTitle: 'Tu invoci explicit',
      userInvokeA: 'Tastezi ',
      userInvokeB: ' → apare autocomplete → selectezi skill-ul.',
      claudeInvokeTitle: 'Claude invocă automat',
      claudeInvokeA: 'Claude citește câmpul ',
      claudeInvokeB: ' și detectează când cererea ta se potrivește.',
      userSays: '"poți face un review la PR-ul 42?"',
      claudeDetects: '→ Claude invocă /review-pr automat',
      disableWarnA: ' — Adaugă acest câmp pentru skills cu efecte secundare (deploy, commit, send). Astfel, Claude nu le poate rula niciodată automat — doar tu le poți invoca explicit cu ',
      disableWarnB: '.',
      locationsTitle: 'Unde salvezi un skill — ordinea de prioritate',
      locations: [
        { level: 'Enterprise', path: 'Configurat prin setări managed',         color: 'text-purple-400', scope: 'Toată organizația' },
        { level: 'Personal',    path: '~/.claude/skills/<skill-name>/SKILL.md', color: 'text-blue-400',    scope: 'Toate proiectele tale' },
        { level: 'Proiect',     path: '.claude/skills/<skill-name>/SKILL.md',   color: 'text-emerald-400', scope: 'Doar acest proiect' },
        { level: 'Plugin',      path: '<plugin>/skills/<skill-name>/SKILL.md',  color: 'text-amber-400',   scope: 'Unde e activ plugin-ul' },
        { level: 'Legacy',      path: '.claude/commands/<skill-name>.md',       color: 'text-zinc-500',    scope: 'Format vechi — funcționează' },
      ],
      locationsNote: 'Dacă două skills au același nume, nivelul cu prioritate mai mare câștigă. Modificările sunt active imediat — fără restart.',
      builtinTitle: 'Skills built-in — disponibile din prima',
      builtinDesc: 'Claude Code vine cu aceste skills pre-instalate. Sunt prompt-based, nu logică fixă — funcționează exact ca ale tale, dar sunt mereu disponibile.',
      builtinItems: [
        { cmd: '/simplify',        desc: 'Review cod pentru calitate și reutilizare' },
        { cmd: '/review',          desc: 'Review pull request complet' },
        { cmd: '/security-review', desc: 'Audit de securitate pe branch curent' },
        { cmd: '/init',            desc: 'Inițializează fișierul CLAUDE.md' },
        { cmd: '/loop',            desc: 'Rulează comenzi la intervale recurente' },
        { cmd: '/claude-api',      desc: 'Build și optimizare aplicații Claude API' },
      ],
    },
    structura: {
      label: 'Anatomie',
      title: 'Structura unui Skill',
      desc: 'Fiecare skill are un SKILL.md obligatoriu cu frontmatter YAML + conținut Markdown. Poți adăuga fișiere auxiliare în același folder.',
      folderTitle: 'Structura unui folder de skill',
      folderCode: `my-skill/\n├── SKILL.md           # Obligatoriu — instrucțiuni + frontmatter\n├── template.md        # Opțional — template pentru Claude\n├── reference.md       # Opțional — referință detaliată\n├── examples/\n│   └── sample.md      # Opțional — exemple de output\n└── scripts/\n    └── validate.sh    # Opțional — scripturi executabile`,
      skillFormatTitle: 'Formatul SKILL.md',
      skillFormatCode: `---\nname: review-pr\ndescription: Revizuiește un pull request complet cu focus pe buguri și securitate\nargument-hint: "[număr PR]"\nallowed-tools: Bash(gh pr diff) Bash(gh pr view)\n---\n\n# Review Pull Request\n\nAnalizează PR-ul $0 urmând acești pași:\n\n1. Citește diff-ul complet\n2. Identifică potențiale buguri\n3. Verifică vulnerabilități de securitate\n4. Sugerează îmbunătățiri de calitate a codului\n\nRaportează cu severitate: CRITIC / WARNING / SUGESTIE`,
      frontmatterTitle: 'Câmpuri frontmatter — referință completă',
      recommendedBadge: 'recomandat',
      fields: [
        { field: 'name',                      type: 'string',  req: false, desc: 'Numele skill-ului (devine /slash-command). Dacă lipsește, folosește numele directorului. Max 64 caractere.' },
        { field: 'description',               type: 'string',  req: true,  desc: 'Ce face skill-ul și când să fie folosit. Claude îl citește pentru auto-invocare. Max 1.536 caractere total.' },
        { field: 'when_to_use',               type: 'string',  req: false, desc: 'Context suplimentar pentru auto-invocare. Se adaugă la description. Același buget de 1.536 caractere.' },
        { field: 'argument-hint',             type: 'string',  req: false, desc: 'Hint de autocomplete pentru argumente. Ex: [issue-number] sau [filename] [format].' },
        { field: 'allowed-tools',             type: 'string',  req: false, desc: 'Tool-uri pre-aprobate (fără prompt de permisiune). Ex: Bash(git add *) Bash(git commit *). Nu restricționează — acordă pre-aprobare.' },
        { field: 'disable-model-invocation',  type: 'boolean', req: false, desc: 'true = Claude nu poate invoca automat. Doar tu cu /skill. Util pentru operații cu efecte secundare (deploy, send).' },
        { field: 'user-invocable',            type: 'boolean', req: false, desc: 'false = ascuns din meniul / și nu poate fi invocat de utilizator. Doar Claude îl poate folosi (background knowledge).' },
        { field: 'model',                     type: 'string',  req: false, desc: 'Model specific când skill-ul e activ. Suprascrie modelul sesiunii.' },
        { field: 'effort',                    type: 'string',  req: false, desc: 'Nivel de efort: low, medium, high, xhigh, max. Suprascrie setarea sesiunii.' },
        { field: 'context',                   type: 'string',  req: false, desc: 'fork = rulează în subagent izolat (fără acces la istoricul conversației).' },
        { field: 'agent',                     type: 'string',  req: false, desc: 'Tipul de subagent cu context: fork. Opțiuni: Explore, Plan, general-purpose sau custom.' },
        { field: 'paths',                     type: 'string',  req: false, desc: 'Glob patterns pentru auto-activare condiționată. Ex: src/**/*.ts. Skill-ul se auto-activează doar la fișiere matching.' },
      ],
      liveReloadLabel: 'Live reload:',
      liveReloadText: ' Modificările la skills din ~/.claude/skills/ sau .claude/skills/ sunt active imediat — fără restart. Directoarele noi necesită totuși un restart.',
    },
    invocare: {
      label: 'Utilizare',
      title: 'Cum invoci un Skill',
      desc: 'Două metode: invocare directă de tine (/ prefix) sau invocare automată de Claude pe baza descrierii. Ambele suportă argumente.',
      directTitle: 'Invocare directă',
      directDescA: 'Tastează ',
      directDescB: ' în promptul Claude Code pentru autocomplete. Selectează skill-ul și adaugă argumente.',
      directCode: `# Fără argumente\n/review-pr\n\n# Cu argumente\n/review-pr 42\n\n# Cu argumente complexe\n/translate "Bună ziua" ro en`,
      autoTitle: 'Auto-invocare de Claude',
      autoDescA: 'Claude citește câmpul ',
      autoDescB: ' pentru a decide când să încarce skill-ul automat.',
      youTypeLabel: 'Tu scrii:',
      youType: '"Poate revizui PR-ul #42?"',
      claudeDetectsLabel: 'Claude detectează:',
      claudeDetectsText: '→ Invocă automat /review-pr cu arg 42',
      variablesTitle: 'Substituții de variabile',
      variables: [
        { var: '$ARGUMENTS',          desc: 'Toate argumentele pasate skill-ului. Dacă nu apare în conținut, se adaugă automat la sfârșit.' },
        { var: '$0, $1, $2...',        desc: 'Argumente individuale indexate (0-based). Folosesc quoting shell.' },
        { var: '$ARGUMENTS[N]',        desc: 'Alternativă explicită pentru $N.' },
        { var: '${CLAUDE_SESSION_ID}', desc: 'ID-ul sesiunii curente. Util pentru logging și corelație.' },
        { var: '${CLAUDE_SKILL_DIR}',  desc: 'Directorul skill-ului. Funcționează indiferent de working directory curent.' },
      ],
      fullExampleTitle: 'Exemplu complet cu argumente',
      fullExampleCode: `# Invocare\n/translate "bună ziua" ro en\n\n# $ARGUMENTS → "bună ziua" ro en\n# $0 → bună ziua\n# $1 → ro\n# $2 → en`,
      skillMdLabel: 'SKILL.md folosește:',
      skillMdCode: `Traduce textul $0\nDin limba: $1\nÎn limba: $2\n\nPăstrează tonul și nuanțele originale.`,
      lifecycleLabel: 'Skill lifecycle:',
      lifecycleText: ' Conținutul skill-ului intră în context o singură dată la invocare. După compaction, skill-urile recente sunt păstrate (buget ~25K tokens combinat). Dacă un skill vechi dispare, re-invocă-l.',
    },
    avansat: {
      label: 'Funcționalități avansate',
      title: 'Skills — nivel expert',
      desc: 'Injecție de context dinamic, execuție în subagent izolat, pre-aprobarea tool-urilor și control granular al invocării.',
      dynInjTitle: 'Injecție dinamică de context',
      dynInjDescA: 'Folosește ',
      dynInjDescB: ' pentru a rula comenzi shell ',
      dynInjDescC: ' ca Claude să vadă skill-ul. Output-ul înlocuiește placeholder-ul — Claude primește date reale, nu template.',
      dynInjCode: `---\nname: pr-context\ndescription: Analizează un PR cu context complet\nallowed-tools: Bash(gh *)\n---\n\n## Context PR\n\n- Diff: !\`gh pr diff\`\n- Comentarii: !\`gh pr view --comments\`\n- Status CI: !\`gh pr checks\`\n\n## Task\nAnalizează calitatea acestui PR...`,
      multilineNote: 'Pentru comenzi multi-linie:',
      multilineCode: '---\nname: env-info\n---\n\n## Environment\n```!\nnode --version\nnpm --version\ngit status --short\ngit log --oneline -5\n```\n\nFolosind contextul de mai sus, propune...',
      subagentTitle: 'Execuție în subagent izolat',
      subagentDescA: ' rulează skill-ul într-un subagent care nu vede istoricul conversației. ',
      subagentDescB: 'Ideal pentru task-uri complexe, auto-conținute.',
      subagentCode: `---\nname: deep-research\ndescription: Cercetare aprofundată a unui subiect\ncontext: fork\nagent: Explore\n---\n\nCercetează $ARGUMENTS exhaustiv.\nFolosind Glob și Grep, mapează:\n- Fișierele relevante\n- Pattern-urile de cod\n- Dependințele\n\nRaportează cu exemple concrete.`,
      agents: [
        { val: 'Explore',         desc: 'Read-only: Glob, Grep, Read, WebFetch' },
        { val: 'Plan',             desc: 'Planificare și design arhitectural' },
        { val: 'general-purpose', desc: 'Access la toate tool-urile' },
      ],
      preapproveTitle: 'Pre-aprobarea tool-urilor',
      preapproveDescA: ' acordă pre-aprobarea — Claude poate rula aceste tool-uri fără prompt de permisiune. Nu ',
      preapproveDescB: ' accesul, ci elimină întreruperile pentru operații frecvente.',
      withPromptLabel: 'Cu prompt de permisiune',
      preapprovedLabel: 'Pre-aprobat',
      withPromptCode: `---\nname: git-commit\n---\n# Claude întreabă la fiecare\n# git add, git commit...`,
      preapprovedCode: `---\nname: git-commit\nallowed-tools: |\n  Bash(git add *)\n  Bash(git commit *)\n  Bash(git status)\n---\n# Claude rulează direct, fără întreruperi`,
      disableModelTitle: 'disable-model-invocation',
      disableModelDescA: 'Setează ',
      disableModelDescB: ' pentru operații cu efecte secundare. Doar tu poți invoca manual.',
      disableModelCode: `---\nname: deploy-prod\ndisable-model-invocation: true\n---\n# Claude NU va invoca automat\n# /deploy-prod — doar tu`,
      extendedThinkingTitle: 'Extended Thinking',
      extendedThinkingDescA: 'Adaugă cuvântul ',
      extendedThinkingDescB: ' oriunde în conținut pentru raționament aprofundat.',
      extendedThinkingCode: `---\nname: architecture-review\ndescription: Review arhitectural detaliat\n---\n\nUltrathink asupra acestei arhitecturi.\nAnalizează trade-off-urile...\n# "ultrathink" activează\n# extended thinking`,
      bestPracticeLabel: 'Best practice:',
      bestPracticeText: ' Păstrează SKILL.md sub 500 de linii. Documentația detaliată merge în fișiere separate din același folder — referențiază-le din skill.',
    },
    exemple: {
      label: 'Bibliotecă skills',
      title: '36 skills gata de copiat',
      desc: 'Skill-uri practice pentru fluxuri reale de development — copy-paste în ~/.claude/skills/ și invocă imediat.',
      catLabels: {
        all: 'Toate', git: 'Git', calitate: 'Calitate', testing: 'Testing',
        docs: 'Docs', dev: 'Dev', community: 'Community', caveman: 'Caveman',
      },
      communityEmoji: '🌐',
      communityTitle: 'Community Skills — de pe GitHub',
      communityDescA: 'Skills dezvoltate de comunitate și publicate pe GitHub. Testate în producție, gata de copiat direct în',
      communityDescB: '.',
      cavemanEmoji: '🪨',
      cavemanTitle: 'Caveman Skills — token minimal',
      cavemanDesc: 'Skills ultra-minimale: frontmatter scurt + 1-2 linii de instrucțiuni. Claude știe destul — nu ai nevoie de prompt lung. Ideal când vrei să economisești context sau să invoci rapid.',
      cavemanBullets: [
        { emoji: '⚡', text: 'Consum minimal de tokens' },
        { emoji: '🎯', text: 'Invocare în 1-2 cuvinte' },
        { emoji: '🔁', text: 'Funcționează pe orice codebase' },
      ],
      installTitle: 'Instalare rapidă',
      installCode: `# 1. Creează directorul skill-ului\nmkdir -p ~/.claude/skills/auto-commit\n\n# 2. Copiază conținutul SKILL.md din card-ul de mai sus, apoi:\ncat > ~/.claude/skills/auto-commit/SKILL.md << 'EOF'\n<conținut copiat>\nEOF\n\n# 3. Invocă imediat (fără restart)\n# În Claude Code, tastează:\n/auto-commit`,
      bulkInstallLabel: 'Bulk install:',
      bulkInstallText: ' Poți instala toate skill-urile dintr-o dată clonând un repo cu structura .claude/skills/ direct în proiect sau în ~/.claude/skills/ pentru acces global.',
    },
    card: {
      hide: 'Ascunde SKILL.md ▲',
      show: 'Arată SKILL.md ▼',
      saveIn: 'Salvează în:',
      tokens: { mic: 'tokens mic', mediu: 'tokens mediu', mare: 'tokens mare' },
    },
  },
  en: {
    pageLabel: 'Lesson 11',
    pageTitle: 'Skills in Claude Code',
    pageDesc: 'Extend Claude with custom reusable procedures — from simple slash commands to advanced workflows with isolated subagents and dynamic context injection.',
    stats: [
      { value: 'SKILL.md', label: 'Core file' },
      { value: '/slash',   label: 'Direct invocation' },
      { value: '4 levels', label: 'Skill scope' },
      { value: '26+',      label: 'Official Anthropic skills' },
    ],
    tabs: {
      introducere: 'What are Skills',
      structura:   'Structure',
      invocare:    'Invocation',
      avansat:     'Advanced',
      exemple:     'Examples',
    },
    intro: {
      label: 'Fundamentals',
      title: 'Skills — Slash commands you define',
      desc: 'A skill is a Markdown file you write once. Every time you type /its-name, Claude automatically receives your instructions and executes them.',
      problemTitle: 'The problem it solves',
      problemIntro: 'Without skills, you repeat the same complex prompt every time. With skills, you write it once and invoke it with two words.',
      withoutLabel: 'Without skill — repeat every time',
      withoutPrompt: '"Review this PR. Look for bugs, security, OWASP Top 10, missing error handling, race conditions. Report with CRITICAL / WARNING / SUGGESTION with file:line references."',
      writtenManually: '← written manually, every time',
      withLabel: 'With skill — two words',
      fetchLog: '● Fetching diff for PR #42...',
      analyzeLog: '● Analyzing OWASP security...',
      generatedLog: '✓ Report generated',
      mechanicsTitle: 'How it works mechanically',
      steps: [
        { title: 'Write a SKILL.md file', detail: 'YAML frontmatter + Markdown instructions. Save it in ~/.claude/skills/pr-review/SKILL.md', color: 'bg-emerald-500/15 text-emerald-400' },
        { title: 'Type /pr-review 42 in Claude Code', detail: 'Claude Code detects the / prefix and finds the matching skill on disk.', color: 'bg-blue-500/15 text-blue-400' },
        { title: 'SKILL.md content is injected into the conversation', detail: 'Exactly as if you had manually copy-pasted the entire file into chat — but automatic. Claude sees the instructions and the argument "42".', color: 'bg-purple-500/15 text-purple-400' },
        { title: 'Claude executes the instructions', detail: 'Runs pre-approved tools (gh pr diff, gh pr view), produces the report exactly as you specified.', color: 'bg-amber-500/15 text-amber-400' },
      ],
      essenceLabel: 'The essence:',
      essenceA: ' A skill is not executable code. It is a ',
      essenceB: 'prompt saved on disk',
      essenceC: ' that Claude Code injects automatically when you invoke it. All the "magic" comes from the instructions you write in Markdown.',
      vsTitle: 'Skill vs CLAUDE.md vs direct prompt',
      vsRows: [
        { tool: 'Direct prompt', icon: '💬', when: 'One-off, ad-hoc task you will not repeat', why: 'Not worth the overhead of creating a file', border: 'border-zinc-800' },
        { tool: 'CLAUDE.md',      icon: '📋', when: 'Permanent facts: project stack, code conventions, naming rules', why: 'Always in context, regardless of what you do. Not invoked — always present.', border: 'border-amber-500/20' },
        { tool: 'Skill',           icon: '⚡', when: 'Repetitive multi-step procedures you run often', why: 'Lazy-loaded (no permanent context cost). Invoke exactly when you need it.', border: 'border-emerald-500/20' },
      ],
      vsWhen: 'When: ',
      vsWhy: 'Why: ',
      vsRule: 'Practical rule: if you catch yourself copy-pasting the same prompt 3+ times → time to make a skill.',
      invocationTitle: 'Two invocation modes',
      userInvokeTitle: 'You invoke explicitly',
      userInvokeA: 'Type ',
      userInvokeB: ' → autocomplete appears → select the skill.',
      claudeInvokeTitle: 'Claude invokes automatically',
      claudeInvokeA: 'Claude reads the ',
      claudeInvokeB: ' field and detects when your request matches.',
      userSays: '"can you review PR #42?"',
      claudeDetects: '→ Claude invokes /review-pr automatically',
      disableWarnA: ' — Add this field for skills with side effects (deploy, commit, send). Claude will never run them automatically — only you can invoke them explicitly with ',
      disableWarnB: '.',
      locationsTitle: 'Where to save a skill — priority order',
      locations: [
        { level: 'Enterprise', path: 'Configured via managed settings',         color: 'text-purple-400', scope: 'Entire organization' },
        { level: 'Personal',    path: '~/.claude/skills/<skill-name>/SKILL.md', color: 'text-blue-400',    scope: 'All your projects' },
        { level: 'Project',     path: '.claude/skills/<skill-name>/SKILL.md',   color: 'text-emerald-400', scope: 'This project only' },
        { level: 'Plugin',      path: '<plugin>/skills/<skill-name>/SKILL.md',  color: 'text-amber-400',   scope: 'Where the plugin is active' },
        { level: 'Legacy',      path: '.claude/commands/<skill-name>.md',       color: 'text-zinc-500',    scope: 'Legacy format — still works' },
      ],
      locationsNote: 'If two skills share the same name, the higher-priority level wins. Changes are active immediately — no restart.',
      builtinTitle: 'Built-in skills — available out of the box',
      builtinDesc: 'Claude Code ships with these skills pre-installed. They are prompt-based, not hard-coded — they work exactly like yours, but are always available.',
      builtinItems: [
        { cmd: '/simplify',        desc: 'Code review for quality and reuse' },
        { cmd: '/review',          desc: 'Complete pull request review' },
        { cmd: '/security-review', desc: 'Security audit on current branch' },
        { cmd: '/init',            desc: 'Initializes the CLAUDE.md file' },
        { cmd: '/loop',            desc: 'Runs commands at recurring intervals' },
        { cmd: '/claude-api',      desc: 'Build and optimize Claude API applications' },
      ],
    },
    structura: {
      label: 'Anatomy',
      title: 'Skill structure',
      desc: 'Every skill requires a SKILL.md with YAML frontmatter + Markdown content. You can add auxiliary files in the same folder.',
      folderTitle: 'Skill folder structure',
      folderCode: `my-skill/\n├── SKILL.md           # Required — instructions + frontmatter\n├── template.md        # Optional — template for Claude\n├── reference.md       # Optional — detailed reference\n├── examples/\n│   └── sample.md      # Optional — output examples\n└── scripts/\n    └── validate.sh    # Optional — executable scripts`,
      skillFormatTitle: 'SKILL.md format',
      skillFormatCode: `---\nname: review-pr\ndescription: Review a pull request thoroughly with focus on bugs and security\nargument-hint: "[PR number]"\nallowed-tools: Bash(gh pr diff) Bash(gh pr view)\n---\n\n# Review Pull Request\n\nAnalyze PR $0 following these steps:\n\n1. Read the full diff\n2. Identify potential bugs\n3. Check for security vulnerabilities\n4. Suggest code quality improvements\n\nReport with severity: CRITICAL / WARNING / SUGGESTION`,
      frontmatterTitle: 'Frontmatter fields — full reference',
      recommendedBadge: 'recommended',
      fields: [
        { field: 'name',                      type: 'string',  req: false, desc: 'Skill name (becomes /slash-command). If missing, uses the directory name. Max 64 characters.' },
        { field: 'description',               type: 'string',  req: true,  desc: 'What the skill does and when to use it. Claude reads this for auto-invocation. Max 1,536 total characters.' },
        { field: 'when_to_use',               type: 'string',  req: false, desc: 'Additional context for auto-invocation. Added to description. Same 1,536-character budget.' },
        { field: 'argument-hint',             type: 'string',  req: false, desc: 'Autocomplete hint for arguments. E.g. [issue-number] or [filename] [format].' },
        { field: 'allowed-tools',             type: 'string',  req: false, desc: 'Pre-approved tools (no permission prompt). E.g. Bash(git add *) Bash(git commit *). Does not restrict — grants pre-approval.' },
        { field: 'disable-model-invocation',  type: 'boolean', req: false, desc: 'true = Claude cannot invoke automatically. Only you via /skill. Useful for operations with side effects (deploy, send).' },
        { field: 'user-invocable',            type: 'boolean', req: false, desc: 'false = hidden from the / menu and cannot be invoked by the user. Only Claude can use it (background knowledge).' },
        { field: 'model',                     type: 'string',  req: false, desc: 'Specific model when the skill is active. Overrides the session model.' },
        { field: 'effort',                    type: 'string',  req: false, desc: 'Effort level: low, medium, high, xhigh, max. Overrides the session setting.' },
        { field: 'context',                   type: 'string',  req: false, desc: 'fork = runs in an isolated subagent (no access to conversation history).' },
        { field: 'agent',                     type: 'string',  req: false, desc: 'Subagent type with context: fork. Options: Explore, Plan, general-purpose, or custom.' },
        { field: 'paths',                     type: 'string',  req: false, desc: 'Glob patterns for conditional auto-activation. E.g. src/**/*.ts. The skill auto-activates only for matching files.' },
      ],
      liveReloadLabel: 'Live reload:',
      liveReloadText: ' Changes to skills in ~/.claude/skills/ or .claude/skills/ are active immediately — no restart. New directories still require a restart.',
    },
    invocare: {
      label: 'Usage',
      title: 'How to invoke a Skill',
      desc: 'Two methods: you invoke directly (/ prefix) or Claude invokes automatically based on the description. Both support arguments.',
      directTitle: 'Direct invocation',
      directDescA: 'Type ',
      directDescB: ' in the Claude Code prompt for autocomplete. Select the skill and add arguments.',
      directCode: `# Without arguments\n/review-pr\n\n# With arguments\n/review-pr 42\n\n# With complex arguments\n/translate "Hello" en ro`,
      autoTitle: 'Claude auto-invocation',
      autoDescA: 'Claude reads the ',
      autoDescB: ' fields to decide when to load the skill automatically.',
      youTypeLabel: 'You type:',
      youType: '"Can you review PR #42?"',
      claudeDetectsLabel: 'Claude detects:',
      claudeDetectsText: '→ Auto-invokes /review-pr with arg 42',
      variablesTitle: 'Variable substitutions',
      variables: [
        { var: '$ARGUMENTS',          desc: 'All arguments passed to the skill. If not present in content, appended automatically at the end.' },
        { var: '$0, $1, $2...',        desc: 'Individual indexed arguments (0-based). Use shell quoting.' },
        { var: '$ARGUMENTS[N]',        desc: 'Explicit alternative for $N.' },
        { var: '${CLAUDE_SESSION_ID}', desc: 'Current session ID. Useful for logging and correlation.' },
        { var: '${CLAUDE_SKILL_DIR}',  desc: 'Skill directory. Works regardless of the current working directory.' },
      ],
      fullExampleTitle: 'Full example with arguments',
      fullExampleCode: `# Invocation\n/translate "hello" en ro\n\n# $ARGUMENTS → "hello" en ro\n# $0 → hello\n# $1 → en\n# $2 → ro`,
      skillMdLabel: 'SKILL.md uses:',
      skillMdCode: `Translate the text $0\nFrom language: $1\nTo language: $2\n\nPreserve the original tone and nuances.`,
      lifecycleLabel: 'Skill lifecycle:',
      lifecycleText: ' Skill content enters context once at invocation. After compaction, recent skills are kept (~25K token combined budget). If an older skill drops, re-invoke it.',
    },
    avansat: {
      label: 'Advanced features',
      title: 'Skills — expert level',
      desc: 'Dynamic context injection, execution in an isolated subagent, tool pre-approval, and fine-grained invocation control.',
      dynInjTitle: 'Dynamic context injection',
      dynInjDescA: 'Use ',
      dynInjDescB: ' to run shell commands ',
      dynInjDescC: ' Claude sees the skill. The output replaces the placeholder — Claude receives real data, not a template.',
      dynInjCode: `---\nname: pr-context\ndescription: Analyze a PR with full context\nallowed-tools: Bash(gh *)\n---\n\n## PR Context\n\n- Diff: !\`gh pr diff\`\n- Comments: !\`gh pr view --comments\`\n- CI status: !\`gh pr checks\`\n\n## Task\nAnalyze the quality of this PR...`,
      multilineNote: 'For multi-line commands:',
      multilineCode: '---\nname: env-info\n---\n\n## Environment\n```!\nnode --version\nnpm --version\ngit status --short\ngit log --oneline -5\n```\n\nUsing the context above, propose...',
      subagentTitle: 'Execution in an isolated subagent',
      subagentDescA: ' runs the skill in a subagent that does not see the conversation history. ',
      subagentDescB: 'Ideal for complex, self-contained tasks.',
      subagentCode: `---\nname: deep-research\ndescription: Deep research on a topic\ncontext: fork\nagent: Explore\n---\n\nResearch $ARGUMENTS exhaustively.\nUsing Glob and Grep, map:\n- Relevant files\n- Code patterns\n- Dependencies\n\nReport with concrete examples.`,
      agents: [
        { val: 'Explore',         desc: 'Read-only: Glob, Grep, Read, WebFetch' },
        { val: 'Plan',             desc: 'Planning and architectural design' },
        { val: 'general-purpose', desc: 'Access to all tools' },
      ],
      preapproveTitle: 'Tool pre-approval',
      preapproveDescA: ' grants pre-approval — Claude can run these tools without a permission prompt. It does not ',
      preapproveDescB: ' access; it eliminates interruptions for frequent operations.',
      withPromptLabel: 'With permission prompt',
      preapprovedLabel: 'Pre-approved',
      withPromptCode: `---\nname: git-commit\n---\n# Claude asks on every\n# git add, git commit...`,
      preapprovedCode: `---\nname: git-commit\nallowed-tools: |\n  Bash(git add *)\n  Bash(git commit *)\n  Bash(git status)\n---\n# Claude runs directly, no interruptions`,
      disableModelTitle: 'disable-model-invocation',
      disableModelDescA: 'Set ',
      disableModelDescB: ' for operations with side effects. Only you can invoke manually.',
      disableModelCode: `---\nname: deploy-prod\ndisable-model-invocation: true\n---\n# Claude will NOT auto-invoke\n# /deploy-prod — only you`,
      extendedThinkingTitle: 'Extended Thinking',
      extendedThinkingDescA: 'Add the word ',
      extendedThinkingDescB: ' anywhere in the content for deeper reasoning.',
      extendedThinkingCode: `---\nname: architecture-review\ndescription: Detailed architectural review\n---\n\nUltrathink about this architecture.\nAnalyze the trade-offs...\n# "ultrathink" activates\n# extended thinking`,
      bestPracticeLabel: 'Best practice:',
      bestPracticeText: ' Keep SKILL.md under 500 lines. Detailed documentation goes in separate files in the same folder — reference them from the skill.',
    },
    exemple: {
      label: 'Skill library',
      title: '36 ready-to-copy skills',
      desc: 'Practical skills for real development flows — copy-paste into ~/.claude/skills/ and invoke immediately.',
      catLabels: {
        all: 'All', git: 'Git', calitate: 'Quality', testing: 'Testing',
        docs: 'Docs', dev: 'Dev', community: 'Community', caveman: 'Caveman',
      },
      communityEmoji: '🌐',
      communityTitle: 'Community Skills — from GitHub',
      communityDescA: 'Skills developed by the community and published on GitHub. Production-tested, ready to copy directly into',
      communityDescB: '.',
      cavemanEmoji: '🪨',
      cavemanTitle: 'Caveman Skills — minimal tokens',
      cavemanDesc: 'Ultra-minimal skills: short frontmatter + 1-2 lines of instructions. Claude knows enough — you do not need a long prompt. Ideal when you want to save context or invoke quickly.',
      cavemanBullets: [
        { emoji: '⚡', text: 'Minimal token usage' },
        { emoji: '🎯', text: 'Invocation in 1-2 words' },
        { emoji: '🔁', text: 'Works on any codebase' },
      ],
      installTitle: 'Quick install',
      installCode: `# 1. Create the skill directory\nmkdir -p ~/.claude/skills/auto-commit\n\n# 2. Copy the SKILL.md content from the card above, then:\ncat > ~/.claude/skills/auto-commit/SKILL.md << 'EOF'\n<pasted content>\nEOF\n\n# 3. Invoke immediately (no restart)\n# In Claude Code, type:\n/auto-commit`,
      bulkInstallLabel: 'Bulk install:',
      bulkInstallText: ' You can install all skills at once by cloning a repo with the .claude/skills/ structure directly into the project or into ~/.claude/skills/ for global access.',
    },
    card: {
      hide: 'Hide SKILL.md ▲',
      show: 'Show SKILL.md ▼',
      saveIn: 'Save in:',
      tokens: { mic: 'low tokens', mediu: 'medium tokens', mare: 'large tokens' },
    },
  },
}

// ── SHARED UI HELPERS ───────────────────────────────────────────────────────

function SectionTitle({ label, title, desc }: { label: string; title: string; desc: string }) {
  return (
    <div className="mb-10 text-center">
      <span className="mb-3 inline-block text-xs font-semibold tracking-widest text-emerald-400 uppercase">{label}</span>
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

function TipBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
      <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" />
      <div className="text-sm leading-relaxed text-zinc-400">{children}</div>
    </div>
  )
}

// ── TABS ───────────────────────────────────────────────────────────────────

function TabIntroducere() {
  const { lang } = useApp()
  const c = CONTENT[lang].intro

  return (
    <div className="space-y-10">
      <SectionTitle label={c.label} title={c.title} desc={c.desc} />

      {/* Problem */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
          <Sparkles className="h-5 w-5 text-emerald-400" /> {c.problemTitle}
        </h3>
        <p className="mb-5 text-sm leading-relaxed text-zinc-400">{c.problemIntro}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-red-400/70">{c.withoutLabel}</p>
            <div className="rounded-lg border border-red-500/15 bg-red-500/5 p-4 font-mono text-xs leading-relaxed text-zinc-400">
              <span className="text-amber-400">$</span> <span className="text-zinc-300">{c.withoutPrompt}</span>
              <div className="mt-2 text-zinc-600">{c.writtenManually}</div>
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-400/70">{c.withLabel}</p>
            <div className="rounded-lg border border-emerald-500/15 bg-emerald-500/5 p-4 font-mono text-xs leading-relaxed text-zinc-400">
              <span className="text-amber-400">$</span> <span className="text-emerald-300">/pr-review 42</span>
              <div className="mt-3 text-zinc-500">{c.fetchLog}</div>
              <div className="text-zinc-500">{c.analyzeLog}</div>
              <div className="text-green-400">{c.generatedLog}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mechanics */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="mb-5 text-lg font-semibold text-white">{c.mechanicsTitle}</h3>
        <div className="space-y-3">
          {c.steps.map((step, i) => (
            <div key={i} className="flex gap-4 rounded-lg border border-zinc-800 bg-zinc-950/50 p-4">
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold ${step.color}`}>{i + 1}</span>
              <div>
                <p className="mb-1 text-sm font-semibold text-white">{step.title}</p>
                <p className="text-xs leading-relaxed text-zinc-400">{step.detail}</p>
              </div>
            </div>
          ))}
        </div>
        <InfoBox>
          <strong className="text-white">{c.essenceLabel}</strong>{c.essenceA}<strong className="text-zinc-200">{c.essenceB}</strong>{c.essenceC}
        </InfoBox>
      </div>

      {/* VS */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="mb-5 text-lg font-semibold text-white">{c.vsTitle}</h3>
        <div className="space-y-3">
          {c.vsRows.map((row) => (
            <div key={row.tool} className={`rounded-lg border ${row.border} bg-zinc-950/50 p-4`}>
              <div className="mb-2 flex items-center gap-2">
                <span className="text-lg">{row.icon}</span>
                <span className="font-semibold text-white">{row.tool}</span>
              </div>
              <p className="mb-1 text-xs text-zinc-300"><span className="text-zinc-500">{c.vsWhen}</span>{row.when}</p>
              <p className="text-xs text-zinc-500"><span className="text-zinc-600">{c.vsWhy}</span>{row.why}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-zinc-500">{c.vsRule}</p>
      </div>

      {/* Invocation modes */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">{c.invocationTitle}</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-4">
            <p className="mb-2 text-sm font-semibold text-white">{c.userInvokeTitle}</p>
            <p className="mb-3 text-xs text-zinc-400">{c.userInvokeA}<code className="text-emerald-400">/</code>{c.userInvokeB}</p>
            <div className="rounded bg-zinc-900 px-3 py-2 font-mono text-xs text-zinc-300">
              <span className="text-amber-400">$</span> /pr-review 42
            </div>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-4">
            <p className="mb-2 text-sm font-semibold text-white">{c.claudeInvokeTitle}</p>
            <p className="mb-3 text-xs text-zinc-400">{c.claudeInvokeA}<code className="text-emerald-400">description</code>{c.claudeInvokeB}</p>
            <div className="rounded bg-zinc-900 px-3 py-2 font-mono text-xs">
              <div className="text-zinc-300">{c.userSays}</div>
              <div className="mt-1 text-zinc-500">{c.claudeDetects}</div>
            </div>
          </div>
        </div>
        <WarnBox>
          <strong className="text-white">disable-model-invocation: true</strong>{c.disableWarnA}<code className="text-amber-300">/</code>{c.disableWarnB}
        </WarnBox>
      </div>

      {/* Locations */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="mb-5 text-lg font-semibold text-white">{c.locationsTitle}</h3>
        <div className="space-y-3">
          {c.locations.map((loc) => (
            <div key={loc.level} className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-950/50 px-4 py-3">
              <span className={`w-24 shrink-0 text-xs font-bold ${loc.color}`}>{loc.level}</span>
              <code className="flex-1 truncate text-xs text-zinc-300">{loc.path}</code>
              <span className="shrink-0 text-xs text-zinc-500">{loc.scope}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-zinc-500">{c.locationsNote}</p>
      </div>

      {/* Built-in */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="mb-2 text-lg font-semibold text-white">{c.builtinTitle}</h3>
        <p className="mb-5 text-sm text-zinc-400">{c.builtinDesc}</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {c.builtinItems.map((s) => (
            <div key={s.cmd} className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-3">
              <code className="mb-1 block text-sm font-bold text-emerald-400">{s.cmd}</code>
              <p className="text-xs text-zinc-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function TabStructura() {
  const { lang } = useApp()
  const c = CONTENT[lang].structura

  return (
    <div className="space-y-10">
      <SectionTitle label={c.label} title={c.title} desc={c.desc} />

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
          <FolderOpen className="h-5 w-5 text-emerald-400" /> {c.folderTitle}
        </h3>
        <CodeBlock code={c.folderCode} />
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">{c.skillFormatTitle}</h3>
        <CodeBlock code={c.skillFormatCode} />
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="mb-5 text-lg font-semibold text-white">{c.frontmatterTitle}</h3>
        <div className="space-y-3">
          {c.fields.map((f) => (
            <div key={f.field} className="rounded-lg border border-zinc-800 bg-zinc-950/50 px-4 py-3">
              <div className="mb-1 flex items-center gap-3">
                <code className="text-sm font-bold text-emerald-400">{f.field}</code>
                <span className="text-xs text-zinc-600">{f.type}</span>
                {f.req && <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 text-xs font-semibold text-emerald-400">{c.recommendedBadge}</span>}
              </div>
              <p className="text-xs leading-relaxed text-zinc-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <InfoBox>
        <strong className="text-white">{c.liveReloadLabel}</strong>{c.liveReloadText}
      </InfoBox>
    </div>
  )
}

function TabInvocare() {
  const { lang } = useApp()
  const c = CONTENT[lang].invocare

  return (
    <div className="space-y-10">
      <SectionTitle label={c.label} title={c.title} desc={c.desc} />

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-white">
            <Terminal className="h-5 w-5 text-emerald-400" /> {c.directTitle}
          </h3>
          <p className="mb-4 text-sm text-zinc-400">
            {c.directDescA}<code className="text-emerald-400">/</code>{c.directDescB}
          </p>
          <CodeBlock code={c.directCode} />
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-white">
            <Sparkles className="h-5 w-5 text-amber-400" /> {c.autoTitle}
          </h3>
          <p className="mb-4 text-sm text-zinc-400">
            {c.autoDescA}<code className="text-amber-400">description</code> & <code className="text-amber-400">when_to_use</code>{c.autoDescB}
          </p>
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-3">
            <p className="mb-1 text-xs font-semibold text-zinc-500">{c.youTypeLabel}</p>
            <p className="mb-3 text-sm text-zinc-300">{c.youType}</p>
            <p className="mb-1 text-xs font-semibold text-zinc-500">{c.claudeDetectsLabel}</p>
            <p className="text-sm text-zinc-300">{c.claudeDetectsText}</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="mb-5 text-lg font-semibold text-white">{c.variablesTitle}</h3>
        <div className="space-y-3">
          {c.variables.map((v) => (
            <div key={v.var} className="flex items-start gap-3 rounded-lg border border-zinc-800 bg-zinc-950/50 px-4 py-3">
              <code className="w-52 shrink-0 text-xs font-bold text-emerald-400">{v.var}</code>
              <p className="text-xs leading-relaxed text-zinc-400">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">{c.fullExampleTitle}</h3>
        <CodeBlock code={c.fullExampleCode} />
        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold text-zinc-500">{c.skillMdLabel}</p>
          <CodeBlock code={c.skillMdCode} />
        </div>
      </div>

      <WarnBox>
        <strong className="text-white">{c.lifecycleLabel}</strong>{c.lifecycleText}
      </WarnBox>
    </div>
  )
}

function TabAvansat() {
  const { lang } = useApp()
  const c = CONTENT[lang].avansat

  return (
    <div className="space-y-10">
      <SectionTitle label={c.label} title={c.title} desc={c.desc} />

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
          <Code2 className="h-5 w-5 text-emerald-400" /> {c.dynInjTitle}
        </h3>
        <p className="mb-4 text-sm text-zinc-400">
          {c.dynInjDescA}<code className="rounded bg-zinc-800 px-1 text-emerald-400">!`command`</code>{c.dynInjDescB}<strong className="text-white">{lang === 'ro' ? 'înainte' : 'before'}</strong>{c.dynInjDescC}
        </p>
        <CodeBlock code={c.dynInjCode} />
        <div className="mt-4">
          <p className="mb-2 text-xs text-zinc-500">{c.multilineNote}</p>
          <CodeBlock code={c.multilineCode} />
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
          <Zap className="h-5 w-5 text-purple-400" /> {c.subagentTitle}
        </h3>
        <p className="mb-4 text-sm text-zinc-400">
          <code className="text-purple-400">context: fork</code>{c.subagentDescA}{c.subagentDescB}
        </p>
        <CodeBlock code={c.subagentCode} />
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {c.agents.map((a) => (
            <div key={a.val} className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-3">
              <code className="mb-1 block text-xs font-bold text-purple-400">{a.val}</code>
              <p className="text-xs text-zinc-400">{a.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">{c.preapproveTitle}</h3>
        <p className="mb-4 text-sm text-zinc-400">
          <code className="text-emerald-400">allowed-tools</code>{c.preapproveDescA}<strong className="text-white">{lang === 'ro' ? 'restricționează' : 'restrict'}</strong>{c.preapproveDescB}
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">{c.withPromptLabel}</p>
            <CodeBlock code={c.withPromptCode} />
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold text-emerald-400/70 uppercase tracking-wider">{c.preapprovedLabel}</p>
            <CodeBlock code={c.preapprovedCode} />
          </div>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
          <h3 className="mb-3 text-base font-semibold text-white">{c.disableModelTitle}</h3>
          <p className="mb-3 text-sm text-zinc-400">{c.disableModelDescA}<code className="text-amber-400">true</code>{c.disableModelDescB}</p>
          <CodeBlock code={c.disableModelCode} />
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
          <h3 className="mb-3 text-base font-semibold text-white">{c.extendedThinkingTitle}</h3>
          <p className="mb-3 text-sm text-zinc-400">{c.extendedThinkingDescA}<code className="text-purple-400">ultrathink</code>{c.extendedThinkingDescB}</p>
          <CodeBlock code={c.extendedThinkingCode} />
        </div>
      </div>

      <TipBox>
        <strong className="text-white">{c.bestPracticeLabel}</strong>{c.bestPracticeText}
      </TipBox>
    </div>
  )
}

// ── SKILLS DATA ────────────────────────────────────────────────────────────

type SkillCat = 'all' | 'git' | 'calitate' | 'testing' | 'docs' | 'dev' | 'community' | 'caveman'

interface SkillEntry {
  name: string
  cat: SkillCat
  catLabel: string
  catColor: string
  desc: string
  descEn?: string
  code: string
  tokens: 'mic' | 'mediu' | 'mare'
}

const CAT_LABEL_EN: Partial<Record<SkillCat, string>> = {
  calitate: 'Quality',
}

const ALL_SKILLS: SkillEntry[] = [
  // ── GIT ──────────────────────────────────────────────────────────────────────
  {
    name: 'auto-commit',
    cat: 'git', catLabel: 'Git', catColor: 'bg-orange-500/15 text-orange-400',
    desc: 'Generează automat un commit message semantic din staged diff.',
    descEn: 'Automatically generates a semantic commit message from the staged diff.',
    tokens: 'mic',
    code: `---
name: auto-commit
description: Generate a semantic commit message from staged diff and commit.
  Use when user wants to commit staged changes without writing the message.
disable-model-invocation: true
allowed-tools: Bash(git diff --staged) Bash(git commit *) Bash(git status)
---

Run \`git diff --staged\` to see what is staged.

Write a commit message following Conventional Commits:
  <type>(<scope>): <short description>  ← max 72 chars

Types: feat / fix / refactor / docs / test / chore / perf / style
Scope: optional, the module or file area changed

Rules:
- Present tense, imperative mood ("add", not "added")
- No period at end of subject line
- If the change is complex, add a blank line then a body (what + why)

Then run: git commit -m "<message>"`,
  },
  {
    name: 'pr-review',
    cat: 'git', catLabel: 'Git', catColor: 'bg-orange-500/15 text-orange-400',
    desc: 'Revizuiește complet un PR cu focus pe buguri, securitate și calitate.',
    descEn: 'Fully reviews a PR with focus on bugs, security, and quality.',
    tokens: 'mediu',
    code: `---
name: pr-review
description: Review a pull request for bugs, security issues, and code quality.
  Use when reviewing a PR number or branch diff. Trigger on "review PR", "check PR".
argument-hint: "[PR number or branch name]"
allowed-tools: Bash(gh pr diff *) Bash(gh pr view *) Bash(gh pr checks *) Read Glob Grep
---

Review PR $0.

Fetch context:
- Diff: run \`gh pr diff $0\`
- Description: run \`gh pr view $0\`
- CI status: run \`gh pr checks $0\`

Analyze and report in this exact format:

## PR Review — #$0

### 🔴 CRITIC (blockers — must fix before merge)
List each critical issue with file:line reference.

### 🟡 WARNING (should fix, not blockers)
List issues that should be addressed.

### 🟢 SUGGESTIONS (optional improvements)
Nice-to-have improvements.

### ✅ Summary
One paragraph overall assessment + merge recommendation.`,
  },
  {
    name: 'pr-description',
    cat: 'git', catLabel: 'Git', catColor: 'bg-orange-500/15 text-orange-400',
    desc: 'Generează o descriere completă de PR din git log și diff față de main.',
    descEn: 'Generates a complete PR description from git log and diff against main.',
    tokens: 'mic',
    code: `---
name: pr-description
description: Generate a complete pull request description from git log and diff.
  Use when opening a PR and needing a description. Trigger on "create PR", "PR description".
disable-model-invocation: true
allowed-tools: Bash(git log *) Bash(git diff *) Bash(git status) Bash(gh pr create *)
---

Gather context:
- Commits: \`git log main..HEAD --oneline\`
- Full diff stats: \`git diff main..HEAD --stat\`
- Changed files: \`git diff main..HEAD --name-only\`

Write a PR description:

## Summary
2-4 bullet points describing WHAT changed and WHY.

## Changes
- List key technical changes grouped by area

## Test plan
- [ ] Manual testing steps
- [ ] Edge cases checked

Keep it concise. Focus on the "why", not the "what" (the diff shows the what).`,
  },

  // ── CALITATE ─────────────────────────────────────────────────────────────────
  {
    name: 'code-review',
    cat: 'calitate', catLabel: 'Calitate', catColor: 'bg-purple-500/15 text-purple-400',
    desc: 'Code review detaliat cu severitate CRITIC / WARNING / SUGESTIE.',
    descEn: 'Detailed code review with CRITICAL / WARNING / SUGGESTION severity.',
    tokens: 'mediu',
    code: `---
name: code-review
description: Perform a thorough code review of a file or function with severity ratings.
  Use when asked to review code quality, spot bugs, or improve a file.
argument-hint: "[file path or function name]"
allowed-tools: Read Glob Grep
---

Review the code in $ARGUMENTS.

Read the relevant files. Then produce a structured review:

## Code Review — $ARGUMENTS

### 🔴 CRITIC — Bugs & correctness issues
Concrete issues that cause wrong behavior or crashes. Include file:line.

### 🟡 WARNING — Design & maintainability
Naming, complexity, coupling, missing error handling, unclear logic.

### 🟢 SUGGESTIONS — Style & polish
Minor improvements, readability, conventions.

### 💡 Positive highlights
What is done well (always include at least one).

Be specific. Quote the problematic code. Suggest the fix, don't just name the problem.`,
  },
  {
    name: 'security-audit',
    cat: 'calitate', catLabel: 'Calitate', catColor: 'bg-purple-500/15 text-purple-400',
    desc: 'Audit de securitate OWASP Top 10 pe întregul codebase sau pe un fișier.',
    descEn: 'OWASP Top 10 security audit on the full codebase or a single file.',
    tokens: 'mare',
    code: `---
name: security-audit
description: Run a security audit checking for OWASP Top 10 vulnerabilities.
  Use when asked to audit security, find vulnerabilities, or before shipping to production.
argument-hint: "[path or 'all' for full codebase]"
allowed-tools: Read Glob Grep Bash(find *)
---

Security audit target: $ARGUMENTS

Scan for these vulnerability classes (OWASP Top 10):

1. **Injection** — SQL, NoSQL, command injection via user input
2. **Broken Auth** — weak session management, exposed tokens, no rate limiting
3. **Sensitive Data Exposure** — secrets in code, unencrypted storage, logging PII
4. **XXE / SSRF** — external entity processing, server-side request forgery
5. **Broken Access Control** — missing auth checks, IDOR, privilege escalation
6. **Security Misconfiguration** — default creds, verbose errors, open CORS
7. **XSS** — reflected, stored, DOM-based cross-site scripting
8. **Insecure Deserialization** — untrusted data deserialization
9. **Known Vulnerabilities** — outdated deps with CVEs
10. **Insufficient Logging** — missing audit trail for sensitive operations

Report format:
## Security Audit

### 🚨 Critical vulnerabilities (fix immediately)
### ⚠️ High severity
### 📋 Medium severity
### ✅ Passed checks`,
  },
  {
    name: 'refactor',
    cat: 'calitate', catLabel: 'Calitate', catColor: 'bg-purple-500/15 text-purple-400',
    desc: 'Refactorizare sistematică: reduce complexitatea, elimină duplicarea, păstrează comportamentul.',
    descEn: 'Systematic refactoring: reduces complexity, removes duplication, preserves behavior.',
    tokens: 'mediu',
    code: `---
name: refactor
description: Systematically refactor code to reduce complexity and duplication
  while preserving behavior. Use when code smells, is hard to read, or too complex.
argument-hint: "[file or function to refactor]"
allowed-tools: Read Edit Glob Grep
---

Refactor: $ARGUMENTS

Before touching any code:
1. Read the target file(s) fully
2. Identify: duplication, long functions (>40 lines), deep nesting (>3 levels),
   unclear names, mixed concerns, missing abstractions

Refactoring plan:
- List every change you will make and why
- Confirm no behavior changes (same inputs → same outputs)

Apply changes:
- One logical change at a time
- Keep functions focused (single responsibility)
- Improve names — avoid abbreviations
- Extract helpers only when used 2+ times

After refactoring:
- Verify the logic is equivalent
- Note if any tests need updating`,
  },
  {
    name: 'perf-audit',
    cat: 'calitate', catLabel: 'Calitate', catColor: 'bg-purple-500/15 text-purple-400',
    desc: 'Analizează performanța codului: N+1 queries, re-renders inutile, algoritmi lent.',
    descEn: 'Analyzes code performance: N+1 queries, unnecessary re-renders, slow algorithms.',
    tokens: 'mediu',
    code: `---
name: perf-audit
description: Audit code performance: find N+1 queries, unnecessary re-renders,
  slow algorithms, and memory leaks. Use on "slow", "performance", "optimize".
argument-hint: "[file, component, or API route]"
allowed-tools: Read Glob Grep
---

Performance audit: $ARGUMENTS

Check these categories:

**Database**
- N+1 query patterns (loop with DB call inside)
- Missing indexes on filtered/sorted columns
- Fetching more data than needed (SELECT *)
- Missing pagination

**React / Frontend**
- Components re-rendering on every parent render
- Missing useMemo / useCallback for expensive computations
- Large bundle — dynamic imports missing
- Images not lazy-loaded or not sized correctly

**Algorithms**
- O(n²) or worse where O(n log n) is possible
- Linear search on large arrays (use Map/Set instead)
- Synchronous operations that should be async

**Memory**
- Event listeners not cleaned up
- Closures holding large objects alive
- Cache with no eviction policy

Report each finding with: location, impact (High/Med/Low), and concrete fix.`,
  },

  // ── TESTING ──────────────────────────────────────────────────────────────────
  {
    name: 'write-tests',
    cat: 'testing', catLabel: 'Testing', catColor: 'bg-blue-500/15 text-blue-400',
    desc: 'Generează unit tests complete pentru un fișier sau funcție — happy path + edge cases.',
    descEn: 'Generates complete unit tests for a file or function — happy path + edge cases.',
    tokens: 'mediu',
    code: `---
name: write-tests
description: Generate comprehensive unit tests for a file or function including
  happy path, edge cases, and error handling. Use when asked to "add tests", "test this".
argument-hint: "[file path or function name]"
allowed-tools: Read Glob Grep Edit
---

Write unit tests for: $ARGUMENTS

First, read the source file to understand:
- What the function/module does
- Its inputs, outputs, and side effects
- Existing tests (if any) to avoid duplication

Test coverage required:
1. **Happy path** — typical correct usage
2. **Edge cases** — empty input, zero, null, boundary values
3. **Error cases** — invalid input, network failure, missing data
4. **Type variants** — different valid input types if applicable

Use the testing framework already in the project (check package.json).
Follow the naming convention: describe('<module>', () => { it('<behavior>', ...) })

Each test must:
- Have a clear name describing the expected behavior
- Be independent (no shared mutable state)
- Assert one thing per test (single assertion principle)
- Be readable without needing to read the source`,
  },
  {
    name: 'fix-flaky',
    cat: 'testing', catLabel: 'Testing', catColor: 'bg-blue-500/15 text-blue-400',
    desc: 'Diagnostichează și repară teste intermitente (race conditions, timeouts, ordering).',
    descEn: 'Diagnoses and fixes flaky tests (race conditions, timeouts, ordering).',
    tokens: 'mediu',
    code: `---
name: fix-flaky
description: Diagnose and fix flaky tests — tests that sometimes pass and sometimes fail.
  Use when a test fails intermittently, on CI but not locally, or randomly.
argument-hint: "[test file or test name]"
allowed-tools: Read Glob Grep Edit Bash(git log *)
---

Diagnose flaky test: $ARGUMENTS

Read the test file and the code it tests. Look for these root causes:

**Race conditions**
- Async operations without proper await
- Timers (setTimeout, setInterval) with hardcoded delays
- Tests not waiting for async state to settle

**Test isolation failures**
- Shared mutable state between tests (module-level variables)
- Tests that depend on execution order
- Missing beforeEach cleanup / afterEach teardown
- Database not reset between tests

**Environment sensitivity**
- Hardcoded timestamps or dates
- File system paths that differ across machines
- Network calls that should be mocked
- Environment variables not set in test env

**Fix strategy:**
1. Make the test fail reliably first (if intermittent, increase iterations)
2. Identify the exact non-deterministic element
3. Apply the fix (proper await, mock, isolation, cleanup)
4. Verify: run the test 10 times, all must pass`,
  },
  {
    name: 'e2e-playwright',
    cat: 'testing', catLabel: 'Testing', catColor: 'bg-blue-500/15 text-blue-400',
    desc: 'Scrie teste Playwright E2E pentru un user flow — navigare, interacțiuni, assertions.',
    descEn: 'Writes Playwright E2E tests for a user flow — navigation, interactions, assertions.',
    tokens: 'mare',
    code: `---
name: e2e-playwright
description: Write Playwright end-to-end tests for a user flow or page.
  Use when asked for E2E tests, browser tests, or integration tests with a real UI.
argument-hint: "[page URL or user flow description]"
allowed-tools: Read Glob Grep Edit
---

Write Playwright E2E tests for: $ARGUMENTS

Check the project for existing Playwright config (playwright.config.ts).
Read any existing tests for conventions.

Each test should cover a complete user flow:
1. Navigate to the relevant page
2. Perform actions as a real user would
3. Assert visible outcomes (text, URL, DOM state)

Best practices to follow:
- Use \`page.getByRole()\`, \`page.getByLabel()\`, \`page.getByText()\` — not CSS selectors
- Wait with \`page.waitForLoadState('networkidle')\` before inspecting dynamic content
- Use \`expect(locator).toBeVisible()\` not \`toHaveCount(1)\`
- Group with \`test.describe()\`, one flow per \`test()\`
- Add \`test.beforeEach()\` for common setup (login, navigate)
- Screenshot on failure is automatic — don't add manual screenshots

Cover:
- Happy path (golden flow)
- Error state (invalid input, failed action)
- Accessibility (keyboard navigation, focus management)`,
  },

  // ── DOCS ─────────────────────────────────────────────────────────────────────
  {
    name: 'gen-readme',
    cat: 'docs', catLabel: 'Docs', catColor: 'bg-teal-500/15 text-teal-400',
    desc: 'Generează README.md complet din structura codebase-ului și package.json.',
    descEn: 'Generates a full README.md from the codebase structure and package.json.',
    tokens: 'mare',
    code: `---
name: gen-readme
description: Generate a comprehensive README.md by reading the codebase structure,
  package.json, and existing docs. Use on "create README", "write README", "document project".
allowed-tools: Read Glob Grep Bash(ls *) Bash(cat package.json)
---

Generate a README.md for this project.

Gather context first:
- \`cat package.json\` — name, description, scripts, dependencies
- \`ls -la\` — project structure
- Read existing README if present (for what to keep)
- Glob for entry points: \`src/index.*\`, \`src/main.*\`, \`src/app.*\`
- Read any existing docs in \`docs/\` or \`*.md\` files

README structure:
# Project Name
> One-line tagline

## What it does
2-3 sentence description. Who is it for, what problem does it solve.

## Quick start
\`\`\`bash
# Install
npm install
# Run
npm run dev
\`\`\`

## Features
Bullet list of key capabilities.

## Project structure
\`\`\`
src/
  ...
\`\`\`

## Configuration
Key environment variables with descriptions.

## Scripts
Table: script name | what it does.

## Contributing
Brief guide.

Be accurate — only include information that exists in the codebase.`,
  },
  {
    name: 'gen-docs',
    cat: 'docs', catLabel: 'Docs', catColor: 'bg-teal-500/15 text-teal-400',
    desc: 'Documentează o funcție sau modul cu JSDoc/TSDoc bazat pe implementarea reală.',
    descEn: 'Documents a function or module with JSDoc/TSDoc based on the actual implementation.',
    tokens: 'mic',
    code: `---
name: gen-docs
description: Generate accurate JSDoc/TSDoc documentation for a function, class, or module.
  Use when asked to document, add JSDoc, or explain a function's API.
argument-hint: "[function name or file path]"
allowed-tools: Read Grep Edit
---

Document: $ARGUMENTS

Read the actual implementation. Do not guess — only document what the code actually does.

For each function/method, write:
\`\`\`typescript
/**
 * One-sentence summary of what this function does.
 *
 * Longer description only if the behavior is non-obvious:
 * - Explain side effects
 * - Note important constraints or invariants
 * - Explain WHY, not WHAT (the code shows the what)
 *
 * @param name - What this parameter controls. Include valid range if numeric.
 * @returns What is returned and in what cases. Mention null/undefined returns.
 * @throws {ErrorType} When this error is thrown and why.
 *
 * @example
 * const result = myFunction('input', { option: true })
 * // result → expected output
 */
\`\`\`

Rules:
- Never repeat what the type system already says
- Don't document trivial getters/setters
- Add @example for non-obvious usage
- Keep it under 10 lines unless the function is complex`,
  },
  {
    name: 'explain-arch',
    cat: 'docs', catLabel: 'Docs', catColor: 'bg-teal-500/15 text-teal-400',
    desc: 'Mapează arhitectura codebase-ului: layers, fluxul datelor, dependențe cheie.',
    descEn: 'Maps the codebase architecture: layers, data flow, key dependencies.',
    tokens: 'mare',
    code: `---
name: explain-arch
description: Map and explain the codebase architecture: layers, data flow, key dependencies.
  Use when asked to understand the codebase, onboard to a project, or explain architecture.
context: fork
agent: Explore
allowed-tools: Read Glob Grep
---

Map the architecture of this codebase.

Explore:
1. Entry points (main, index, app files)
2. Directory structure and what each folder contains
3. Key modules and their responsibilities
4. How data flows from input to output
5. External dependencies (APIs, databases, services)
6. Configuration and environment setup

Produce a written architecture overview:

## Architecture Overview

### Stack
List tech stack with purpose of each.

### Directory structure
Annotated tree of important paths.

### Data flow
Step-by-step: how a request/action moves through the system.

### Key modules
Table: module | responsibility | main files.

### External dependencies
What external services/APIs are integrated and how.

### Entry points
How to start the app, what happens on startup.`,
  },

  // ── DEV ──────────────────────────────────────────────────────────────────────
  {
    name: 'debug',
    cat: 'dev', catLabel: 'Dev', catColor: 'bg-red-500/15 text-red-400',
    desc: 'Workflow sistematic de debugging: reproduce → izolează → root cause → fix.',
    descEn: 'Systematic debugging workflow: reproduce → isolate → root cause → fix.',
    tokens: 'mediu',
    code: `---
name: debug
description: Systematic debugging workflow: reproduce, isolate root cause, and fix.
  Use when something is broken, throws an error, or behaves unexpectedly.
argument-hint: "[error message, symptom, or file]"
allowed-tools: Read Glob Grep Edit Bash(git log *) Bash(git diff *)
---

Debug: $ARGUMENTS

Step 1 — Understand the symptom
- What is the expected behavior?
- What actually happens?
- Is it always reproducible or intermittent?

Step 2 — Gather evidence
- Read error messages and stack traces carefully
- Find the relevant code paths
- Check recent changes: \`git log --oneline -10\`

Step 3 — Isolate the root cause
- Narrow to the smallest failing case
- Check: data? logic? environment? timing? dependency?
- Eliminate assumptions — verify each hypothesis

Step 4 — Fix
- Address root cause, not just the symptom
- Do not use try/catch to silence errors
- If the fix is a workaround, note it with a TODO comment

Step 5 — Verify
- Confirm the original symptom is gone
- Check adjacent code for similar bugs
- Consider if a test would have caught this`,
  },
  {
    name: 'new-feature',
    cat: 'dev', catLabel: 'Dev', catColor: 'bg-red-500/15 text-red-400',
    desc: 'Planifică și implementează o funcționalitate nouă cu analiză de impact și test plan.',
    descEn: 'Plans and implements a new feature with impact analysis and a test plan.',
    tokens: 'mare',
    code: `---
name: new-feature
description: Plan and implement a new feature with impact analysis and test plan.
  Use when starting a new feature, user story, or product requirement.
argument-hint: "[feature description]"
allowed-tools: Read Glob Grep Edit
---

Implement feature: $ARGUMENTS

Phase 1 — Analysis (do this before writing any code)
1. Read existing related code to understand the codebase patterns
2. Identify what needs to change: files, models, APIs, UI
3. List risks and edge cases
4. Define the acceptance criteria

Phase 2 — Design
Write a brief implementation plan:
- New files to create
- Existing files to modify (and what changes)
- Data model changes (if any)
- API contract (if adding endpoints)

Get alignment before implementing if the scope is large.

Phase 3 — Implement
- Follow existing patterns in the codebase
- Keep functions small and focused
- Add types for everything (no \`any\`)
- Handle errors at boundaries

Phase 4 — Test
- Write tests for the new behavior
- Verify existing tests still pass
- Test edge cases identified in Phase 1`,
  },
  {
    name: 'api-design',
    cat: 'dev', catLabel: 'Dev', catColor: 'bg-red-500/15 text-red-400',
    desc: 'Proiectează un REST API: endpoints, request/response types, error codes, validare.',
    descEn: 'Designs a REST API: endpoints, request/response types, error codes, validation.',
    tokens: 'mediu',
    code: `---
name: api-design
description: Design a REST API with endpoints, request/response schemas, and error handling.
  Use when creating new API routes or reviewing existing API design.
argument-hint: "[resource or feature name]"
allowed-tools: Read Glob Grep
---

Design REST API for: $ARGUMENTS

Read existing API routes first for conventions (method naming, error format, auth pattern).

Produce an API design document:

## API Design — $ARGUMENTS

### Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET    | /resource      | List all (with pagination) |
| GET    | /resource/:id  | Get one |
| POST   | /resource      | Create |
| PUT    | /resource/:id  | Full update |
| PATCH  | /resource/:id  | Partial update |
| DELETE | /resource/:id  | Delete |

### Request schema
\`\`\`typescript
interface CreateResourceBody { ... }
\`\`\`

### Response schema
\`\`\`typescript
interface ResourceResponse { ... }
\`\`\`

### Error responses
| Status | When |
|--------|------|
| 400 | Invalid input |
| 401 | Not authenticated |
| 403 | Not authorized |
| 404 | Resource not found |
| 409 | Conflict |
| 422 | Validation failed |

### Auth & rate limiting requirements`,
  },
  {
    name: 'dep-audit',
    cat: 'dev', catLabel: 'Dev', catColor: 'bg-red-500/15 text-red-400',
    desc: 'Auditează dependențele proiectului: CVE-uri, versiuni depășite, upgrade path.',
    descEn: 'Audits project dependencies: CVEs, outdated versions, upgrade path.',
    tokens: 'mic',
    code: `---
name: dep-audit
description: Audit project dependencies for CVEs, outdated versions, and upgrade paths.
  Use on "check dependencies", "audit packages", "outdated libs".
disable-model-invocation: true
allowed-tools: Bash(npm audit *) Bash(npm outdated) Bash(cat package.json) Bash(pip list *) Read
---

Run dependency audit:

For Node.js projects:
1. \`npm audit --json\` — get CVE report
2. \`npm outdated\` — see outdated packages

For Python projects:
1. \`pip list --outdated\` — outdated packages
2. \`pip-audit\` — CVE scan (if installed)

Analyze results and report:

## Dependency Audit

### 🔴 Critical CVEs (fix immediately)
Package | CVE | Severity | Fix version

### 🟡 High severity CVEs
Package | CVE | Affected version | Upgrade to

### 📦 Significantly outdated (major version behind)
Package | Current | Latest | Breaking changes?

### ✅ Upgrade recommendations
Prioritized list with estimated effort.

For each critical issue: provide the exact upgrade command.`,
  },

  // ── META / AVANSAT ────────────────────────────────────────────────────────────
  {
    name: 'arch-review',
    cat: 'dev', catLabel: 'Dev', catColor: 'bg-red-500/15 text-red-400',
    desc: 'Review arhitectural cu ultrathink — scalabilitate, coupling, trade-offs.',
    descEn: 'Architectural review with ultrathink — scalability, coupling, trade-offs.',
    tokens: 'mare',
    code: `---
name: arch-review
description: Deep architectural review focusing on scalability, coupling, and trade-offs.
  Use when evaluating system design, planning major refactors, or architectural decisions.
argument-hint: "[system or module to review]"
context: fork
agent: Explore
allowed-tools: Read Glob Grep
---

Ultrathink about the architecture of: $ARGUMENTS

Explore the codebase thoroughly. Then evaluate:

**Coupling & Cohesion**
- Are modules appropriately isolated?
- Which dependencies are forced vs. natural?
- Would a change in module A ripple unexpectedly to B?

**Scalability**
- Where are the bottlenecks (DB, CPU, I/O, memory)?
- What breaks first at 10× current load?
- Is state shared in ways that prevent horizontal scaling?

**Complexity**
- What is the hardest part to understand and why?
- Where is accidental vs. essential complexity?

**Testability**
- Can units be tested in isolation?
- What requires integration test coverage?

**Trade-offs**
- What architectural decisions were made and why?
- What would you do differently with today's knowledge?

Produce a written assessment with specific, actionable recommendations.`,
  },
  {
    name: 'skill-creator',
    cat: 'dev', catLabel: 'Dev', catColor: 'bg-red-500/15 text-red-400',
    desc: 'Meta-skill: creează un skill nou optimizat, cu test cases și evaluare.',
    descEn: 'Meta-skill: creates a new optimized skill with test cases and evaluation.',
    tokens: 'mediu',
    code: `---
name: skill-creator
description: Create a new Claude Code skill with proper frontmatter, instructions,
  and test cases. Use when asked to create, write, or build a new skill.
argument-hint: "[what the skill should do]"
disable-model-invocation: true
allowed-tools: Bash(mkdir *) Bash(cat *) Read Edit
---

Create a skill that does: $ARGUMENTS

Step 1 — Define the skill
- What is the trigger (when should Claude invoke this automatically)?
- What arguments does it take?
- What tools does it need?
- Does it have side effects? (→ disable-model-invocation: true)

Step 2 — Write SKILL.md
Location: ~/.claude/skills/<skill-name>/SKILL.md

Frontmatter:
- name: lowercase-hyphenated
- description: pushy about when to trigger (Claude tends to undertrigger)
- argument-hint: if it takes args
- allowed-tools: minimum set needed
- disable-model-invocation: true if side effects

Content:
- Clear step-by-step instructions
- Output format expected
- Edge cases to handle

Step 3 — Validate
Create 2-3 test prompts a user might actually send.
Confirm the description would trigger correctly.
Confirm the instructions produce the right output.

Step 4 — Create the file
\`mkdir -p ~/.claude/skills/<name> && cat > ~/.claude/skills/<name>/SKILL.md << 'EOF'\n<content>\nEOF\``,
  },
]

const CAVEMAN_SKILLS: SkillEntry[] = [
  {
    name: 'fix',
    cat: 'caveman', catLabel: 'Caveman', catColor: 'bg-amber-500/15 text-amber-400',
    desc: 'Minimal. "Fix this." — Claude știe destul. Zero overhead de prompt.',
    descEn: 'Minimal. "Fix this." — Claude knows enough. Zero prompt overhead.',
    tokens: 'mic',
    code: `---
name: fix
description: Fix the bug or error in the current context. Use on "fix", "broken", "error".
---

Fix $ARGUMENTS

If no arguments: fix whatever is broken in the current context.`,
  },
  {
    name: 'why',
    cat: 'caveman', catLabel: 'Caveman', catColor: 'bg-amber-500/15 text-amber-400',
    desc: 'Root cause analysis în 3 cuvinte de invocare. Fără ceremony.',
    descEn: 'Root cause analysis in 3 invocation words. No ceremony.',
    tokens: 'mic',
    code: `---
name: why
description: Explain why something is broken or not working as expected.
  Use on "why", "explain error", "what causes".
---

Investigate and explain: $ARGUMENTS

Find the root cause. Be direct and specific.`,
  },
  {
    name: 'doc',
    cat: 'caveman', catLabel: 'Caveman', catColor: 'bg-amber-500/15 text-amber-400',
    desc: 'Documentează un simbol. Un câmp. O funcție. Rapid.',
    descEn: 'Documents a symbol. A field. A function. Fast.',
    tokens: 'mic',
    code: `---
name: doc
description: Add documentation to a function, class, or file. Use on "document", "add docs".
argument-hint: "[function or file]"
---

Document $ARGUMENTS with accurate JSDoc/TSDoc.
Read the implementation first. Document only what the code actually does.`,
  },
  {
    name: 'test',
    cat: 'caveman', catLabel: 'Caveman', catColor: 'bg-amber-500/15 text-amber-400',
    desc: 'Scrie un test. Fără boilerplate, fără configurare, instant.',
    descEn: 'Writes a test. No boilerplate, no setup, instant.',
    tokens: 'mic',
    code: `---
name: test
description: Write a unit test for a function or file. Use on "write test", "add test", "test this".
argument-hint: "[function or file]"
---

Write a unit test for $ARGUMENTS

Use the testing framework in this project. Cover happy path and one error case.`,
  },
  {
    name: 'safe',
    cat: 'caveman', catLabel: 'Caveman', catColor: 'bg-amber-500/15 text-amber-400',
    desc: 'Security check instant. 5 cuvinte. Claude scanează și raportează.',
    descEn: 'Instant security check. 5 words. Claude scans and reports.',
    tokens: 'mic',
    code: `---
name: safe
description: Quick security check on a file or function. Use on "is this safe", "security check".
argument-hint: "[file or code area]"
---

Security check: $ARGUMENTS

Scan for: injection, auth bypass, exposed secrets, unvalidated input, insecure patterns.
Report: UNSAFE (with why) or SAFE.`,
  },
  {
    name: 'rethink',
    cat: 'caveman', catLabel: 'Caveman', catColor: 'bg-amber-500/15 text-amber-400',
    desc: 'Ultrathink scurt. Reconsideră abordarea curentă fără instrucțiuni extra.',
    descEn: 'Short ultrathink. Reconsider the current approach without extra instructions.',
    tokens: 'mic',
    code: `---
name: rethink
description: Step back and reconsider the current approach with fresh eyes.
  Use when stuck, when the solution feels wrong, or to explore alternatives.
---

Ultrathink about $ARGUMENTS

Step back. Ignore the current implementation. What is the simplest correct solution?
What assumptions are we making that might be wrong?`,
  },
]

const COMMUNITY_SKILLS: SkillEntry[] = [
  {
    name: 'caveman',
    cat: 'community', catLabel: 'Community', catColor: 'bg-emerald-500/15 text-emerald-400',
    desc: 'Switches Claude to terse, caveman-style responses for the whole session. Cuts token usage ~75%.',
    tokens: 'mic',
    code: `---
name: caveman
description: Switch to ultra-compressed terse communication for this session.
  Drops articles, filler, pleasantries, hedging. Full technical accuracy preserved.
  Use when you want short, direct answers with no fluff.
disable-model-invocation: true
---

From now on, respond in caveman style for ALL messages this session.

Rules:
- Drop articles (a, an, the) when unambiguous
- Drop filler: "I think", "It appears", "Please note", "Of course", "Certainly"
- Drop pleasantries: no greetings, affirmations ("Great question!"), sign-offs
- Drop hedging: no "might", "could potentially", "perhaps" — unless genuinely uncertain
- Fragments OK: "Use async/await." not "You should consider using async/await."
- Short synonyms: "use" not "utilize", "fix" not "remediate", "start" not "initiate"
- Lists beat prose. Code beats explanation. Numbers beat vague estimates.
- Skip obvious context — assume user knows their codebase.

Exception: security warnings and irreversible/destructive operations → full sentences.

Start immediately. No acknowledgement needed.`,
  },
  {
    name: 'git-worktree',
    cat: 'community', catLabel: 'Community', catColor: 'bg-emerald-500/15 text-emerald-400',
    desc: 'Creates and manages git worktrees for parallel feature development on isolated branches.',
    tokens: 'mic',
    code: `---
name: git-worktree
description: Create and manage git worktrees for parallel development on multiple branches.
  Use on "worktree", "parallel branch", "isolate branch", "work on two branches at once".
argument-hint: "[branch name]"
allowed-tools: Bash(git worktree *) Bash(git branch *) Bash(git status) Bash(ls *)
disable-model-invocation: true
---

Manage git worktree for: $ARGUMENTS

Step 1 — Determine worktree directory
- Preferred: .worktrees/<branch-name>  (add .worktrees/ to .gitignore first)
- Fallback: ../$(basename $(pwd))-<branch-name>

Step 2 — Create worktree
New branch:      git worktree add .worktrees/$0 -b $0
Existing branch: git worktree add .worktrees/$0 $0

Step 3 — Setup in new worktree
cd .worktrees/$0
Run project setup: npm install | cargo build | poetry install | go mod download

Step 4 — Verify
git worktree list
→ Confirm new worktree shows with correct branch and path.

Work normally. Each worktree is fully independent — changes don't affect each other.

Cleanup when done: git worktree remove .worktrees/$0`,
  },
  {
    name: 'changelog',
    cat: 'community', catLabel: 'Community', catColor: 'bg-emerald-500/15 text-emerald-400',
    desc: 'Generates user-facing release notes from git commit history, translating dev language to benefit language.',
    tokens: 'mic',
    code: `---
name: changelog
description: Generate a user-facing changelog from git commit history between tags or ranges.
  Use on "changelog", "release notes", "what changed since v", "write CHANGELOG".
argument-hint: "[version tag or from..to range]"
allowed-tools: Bash(git log *) Bash(git tag *) Bash(git describe *)
disable-model-invocation: true
---

Generate changelog for: $ARGUMENTS

Gather history:
- git log $(git describe --tags --abbrev=0)..HEAD --oneline --no-merges
- Or range: git log $0 --oneline --no-merges
- Tags: git tag --sort=-version:refname | head -5

Write a user-facing changelog:

## [version] — YYYY-MM-DD

### ✨ New Features
User-visible capabilities. Translate dev language → user benefit.
Example: "feat: add cursor pagination" → "Products list now loads instantly with infinite scroll"

### 🐛 Bug Fixes
Issues resolved. Focus on the symptom fixed, not the technical cause.

### ⚡ Improvements
Performance, UX, reliability improvements users will notice.

### 🔒 Security
Security fixes. Don't expose vulnerability details.

### ⚠️ Breaking Changes
API/interface changes requiring user action. Always include migration steps.

Rules:
- SKIP: chore, refactor, test, ci, style commits (internal only)
- Translate technical language into user benefits
- Group related commits into single entries
- Each entry: what changed + why it matters`,
  },
  {
    name: 'docker-first',
    cat: 'community', catLabel: 'Community', catColor: 'bg-emerald-500/15 text-emerald-400',
    desc: 'Enforces Docker-first dev: all Node/Python/Go commands run inside containers, never on host.',
    tokens: 'mic',
    code: `---
name: docker-first
description: Enforce Docker-first development. All runtime commands execute inside containers.
  Use on "run in docker", "containerize workflow", "docker environment", "never run on host".
disable-model-invocation: true
allowed-tools: Bash(docker *) Read
---

Enforce Docker-first development for this session.

BLOCKED on host (never run these directly):
  npm, yarn, pnpm, npx, bun
  node, nodemon, ts-node, tsx
  python, python3, pip, pipenv, poetry
  cargo, go run, mvn, gradle

CORRECT format — always prefix with docker exec:
  docker exec <container-name> <command>

Examples:
  npm install       →  docker exec myapp npm install
  npm test          →  docker exec myapp npm test
  python manage.py  →  docker exec myapp python manage.py migrate
  cargo build       →  docker exec myapp cargo build

Pre-flight check before each command:
  docker ps --filter name=<container> --format "{{.Status}}"
  → Must show "Up". If down: docker compose up -d first.

Node modules: always in named Docker volumes (never bind-mounted from host).

If no container running: ask user for container name before proceeding.`,
  },
  {
    name: 'create-pr',
    cat: 'community', catLabel: 'Community', catColor: 'bg-emerald-500/15 text-emerald-400',
    desc: 'Creates a structured PR with active-voice title, Why/Approach/How description. No AI attribution.',
    tokens: 'mic',
    code: `---
name: create-pr
description: Create a well-structured pull request with active-voice title and full description.
  Use on "open PR", "create PR", "make a PR", "submit PR", "push PR".
disable-model-invocation: true
allowed-tools: Bash(git log *) Bash(git diff *) Bash(gh pr create *) Bash(gh pr edit *)
---

Create pull request for current branch.

Gather context:
- git log main..HEAD --oneline
- git diff main..HEAD --stat

Title format (required):
  <Verb> <what> [to/in/for <context>]
  ✅ "Add OAuth login with Google"
  ✅ "Fix race condition in session middleware"
  ✅ "Refactor product catalog API"
  ❌ "WIP", "fixes", "changes", "updates"
  Rules: active voice, imperative mood, ≤72 chars, no period at end.

Description structure:

## Why
One paragraph: what problem does this solve? What was broken or missing?

## Approach
How was it solved? Key architectural or technical decisions.

## How it works
Technical summary of what changed and why. Include caveats or known limitations.

## Links
- Issue: #<number>
- Docs: <url if applicable>

Then run: gh pr create --title "<title>" --body "<description>"

Do NOT include:
- Co-authorship or AI attribution lines
- "Generated with Claude Code" or similar
- Incremental changelogs`,
  },
  {
    name: 'jira',
    cat: 'community', catLabel: 'Community', catColor: 'bg-emerald-500/15 text-emerald-400',
    desc: 'Creates, searches and updates JIRA issues via REST API with JQL support.',
    tokens: 'mediu',
    code: `---
name: jira
description: Create, search, and manage JIRA issues, sprints, and projects via the REST API.
  Use on "create JIRA ticket", "JIRA issue", "find in JIRA", "update JIRA", "JIRA sprint".
argument-hint: "[create|search|update] [details]"
allowed-tools: Bash(curl *) Bash(jq *)
---

Manage JIRA: $ARGUMENTS

Requirements:
  JIRA_URL=https://your-domain.atlassian.net
  JIRA_TOKEN=<personal-access-token>
  JIRA_EMAIL=your@email.com

Base URL: $JIRA_URL/rest/api/3/

--- CREATE issue ---
curl -u $JIRA_EMAIL:$JIRA_TOKEN -X POST \
  $JIRA_URL/rest/api/3/issue \
  -H "Content-Type: application/json" \
  -d '{"fields":{"project":{"key":"PROJ"},"summary":"<title>",
       "issuetype":{"name":"Story"},"description":{"type":"doc","version":1,
       "content":[{"type":"paragraph","content":[{"type":"text","text":"<body>"}]}]}}}'

Issuetype: Story | Bug | Task | Epic | Sub-task

--- SEARCH with JQL ---
curl -u $JIRA_EMAIL:$JIRA_TOKEN \
  "$JIRA_URL/rest/api/3/search?jql=<query>&maxResults=20" | jq '.issues[]|{key,summary:.fields.summary}'

Useful JQL queries:
  project=PROJ AND status="In Progress"
  assignee=currentUser() AND sprint in openSprints()
  created>=-7d AND issuetype=Bug ORDER BY priority DESC

--- TRANSITION (change status) ---
1. Get transitions: GET /issue/<key>/transitions
2. POST /issue/<key>/transitions  body: {"transition":{"id":"<id>"}}`,
  },
  {
    name: 'linear',
    cat: 'community', catLabel: 'Community', catColor: 'bg-emerald-500/15 text-emerald-400',
    desc: 'Creates and manages Linear issues and projects via CLI or MCP. Enforces label conventions.',
    tokens: 'mic',
    code: `---
name: linear
description: Create and manage Linear issues, projects, and teams.
  Use on "create Linear issue", "Linear ticket", "update Linear status", "Linear project".
argument-hint: "[create|search|update] [details]"
allowed-tools: Bash(linear *) Bash(curl *)
---

Manage Linear: $ARGUMENTS

Tool priority: Linear MCP (if available) > linear CLI > GraphQL API

--- SETUP ---
npm install -g @linear/cli
linear auth login

--- CREATE issue ---
linear issue create \
  --title "<title>" \
  --team <TEAM-KEY> \
  --description "<body>"

Labels: exactly ONE type label (Bug / Feature / Improvement) + 1-2 domain labels.
Always assign to a project if one exists: --project <project-id>

--- SEARCH ---
linear issue list --team <team> --state "In Progress"
linear issue list --filter "assignee:me,state:todo"

--- UPDATE ---
linear issue edit <issue-id> --state "In Review" --priority urgent

--- CREATE project (do this before creating issues under it) ---
linear project create --name "<name>" --team <team> --state "planned"

--- GraphQL API ---
POST https://api.linear.app/graphql
Header: Authorization: <LINEAR_API_KEY>
mutation { issueCreate(input:{teamId:"<id>",title:"<t>",description:"<d>"}){issue{id}}}`,
  },
  {
    name: 'type-gen',
    cat: 'community', catLabel: 'Community', catColor: 'bg-emerald-500/15 text-emerald-400',
    desc: 'Generates TypeScript interfaces from JSON samples, API responses, or OpenAPI specs.',
    tokens: 'mic',
    code: `---
name: type-gen
description: Generate TypeScript types from JSON, API responses, or OpenAPI specs.
  Use on "generate types from JSON", "type this response", "create interface from API",
  "TypeScript types for", "openapi types".
argument-hint: "[JSON file, API URL, or OpenAPI spec path]"
allowed-tools: Read Bash(curl *) Bash(npx json-to-ts *) Bash(npx openapi-typescript *)
---

Generate TypeScript types for: $ARGUMENTS

Strategy by input:

JSON FILE or pasted JSON:
  npx json-to-ts < input.json
  Or: curl <api-endpoint> | npx json-to-ts

OPENAPI / SWAGGER spec:
  npx openapi-typescript <spec-url-or-file> -o src/types/api.ts

MANUAL (complex nested JSON):
  Read structure, infer types by hand.

Output conventions — always follow these:
  interface UserResponse {
    id: string           // IDs are always string, never number
    createdAt: string    // ISO 8601 dates as string, not Date
    email: string
    role: 'admin' | 'user' | 'guest'  // union literals, not string for enums
    count: number
    metadata?: Record<string, unknown>  // unknown not any
    tags: string[]
    address: {           // inline nested objects
      city: string
      country: string
    }
  }

Rules:
- No \`any\` — use \`unknown\` for truly unknown shapes
- Optional fields: \`field?\` not \`field: T | undefined\`
- Dates: string (ISO) not Date object (JSON has no Date type)
- IDs: string not number
- Export all top-level interfaces`,
  },
  {
    name: 'release',
    cat: 'community', catLabel: 'Community', catColor: 'bg-emerald-500/15 text-emerald-400',
    desc: 'Bumps version, updates CHANGELOG, commits, tags, and optionally publishes. Asks before publish.',
    tokens: 'mediu',
    code: `---
name: release
description: Bump version, update changelog, commit, tag, and prepare for publishing.
  Use on "release version", "bump version", "prepare release", "tag v", "publish".
argument-hint: "[major|minor|patch or exact version like 1.2.3]"
disable-model-invocation: true
allowed-tools: Bash(npm version *) Bash(git tag *) Bash(git log *) Bash(git push *) Bash(node *) Read Edit
---

Prepare release: $ARGUMENTS

Step 1 — Determine version bump
  major: breaking changes  |  minor: new features  |  patch: bug fixes only
  Current: node -p "require('./package.json').version"
  Or: git describe --tags --abbrev=0

Step 2 — Generate changelog entry
  git log $(git describe --tags --abbrev=0)..HEAD --oneline --no-merges
  Summarize into user-facing bullet points.
  Prepend to CHANGELOG.md under ## [new-version] — $(date +%Y-%m-%d)

Step 3 — Bump version (no auto-commit)
  npm version $0 --no-git-tag-version

Step 4 — Commit and tag
  git add package.json CHANGELOG.md
  git commit -m "chore: release v$(node -p \"require('./package.json').version\")"
  git tag v$(node -p "require('./package.json').version")

Step 5 — Push
  git push origin main --tags

Step 6 — Publish ⚠️ STOP HERE
  Ask user for explicit confirmation before running npm publish.
  Publishing is irreversible without going through unpublish process.`,
  },
  {
    name: 'explain-error',
    cat: 'community', catLabel: 'Community', catColor: 'bg-emerald-500/15 text-emerald-400',
    desc: 'Explains any error message: root cause, why it happens, and exact fix steps.',
    tokens: 'mic',
    code: `---
name: explain-error
description: Explain an error message: root cause, context, and exact fix.
  Use on "what does this error mean", "explain this error", "why am I getting",
  "what is this exception", "stack trace help".
argument-hint: "[paste error message or stack trace]"
allowed-tools: Read Glob Grep
---

Explain this error: $ARGUMENTS

Structure your response:

## What happened
One sentence: what went wrong.

## Why it happens
The root cause — what condition triggers this error. Be specific.

## Where to look
File(s) and line range most likely responsible. Read them if needed.

## Fix
Exact steps to resolve. Show code diff if applicable.

## Prevention
How to avoid this class of error in the future (guard clause, type check, validation, etc.)

Rules:
- Don't just describe the error message — explain the underlying cause
- If multiple possible causes exist, list them ranked by likelihood
- Always suggest a concrete fix, not just "check your configuration"
- If you need to read files to give a precise answer, do so before responding`,
  },
]

const CAT_TAB_ICONS: Record<SkillCat, React.ReactNode> = {
  all:       <Filter className="h-3.5 w-3.5" />,
  git:       <GitBranch className="h-3.5 w-3.5" />,
  calitate:  <ShieldCheck className="h-3.5 w-3.5" />,
  testing:   <FlaskConical className="h-3.5 w-3.5" />,
  docs:      <FileText className="h-3.5 w-3.5" />,
  dev:       <Wrench className="h-3.5 w-3.5" />,
  community: <Sparkles className="h-3.5 w-3.5" />,
  caveman:   <Cpu className="h-3.5 w-3.5" />,
}

const CAT_ORDER: SkillCat[] = ['all', 'git', 'calitate', 'testing', 'docs', 'dev', 'community', 'caveman']

const TOKEN_BADGE: Record<SkillEntry['tokens'], string> = {
  mic:   'bg-emerald-500/15 text-emerald-400',
  mediu: 'bg-amber-500/15 text-amber-400',
  mare:  'bg-red-500/15 text-red-400',
}

// ── SKILL CARD ─────────────────────────────────────────────────────────────

function SkillCard({ skill }: { skill: SkillEntry }) {
  const [open, setOpen] = useState(false)
  const { lang } = useApp()
  const c = CONTENT[lang].card
  const catLabel = lang === 'en' ? (CAT_LABEL_EN[skill.cat] ?? skill.catLabel) : skill.catLabel
  const desc = lang === 'en' && skill.descEn ? skill.descEn : skill.desc
  const tokenLabel = c.tokens[skill.tokens]

  return (
    <div className={`rounded-xl border transition-all ${open ? 'border-emerald-500/30 bg-zinc-900/80' : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'}`}>
      <button
        className="w-full p-4 text-left"
        onClick={() => setOpen((v) => !v)}
        type="button"
      >
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <code className="text-base font-bold text-emerald-400">/{skill.name}</code>
          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${skill.catColor}`}>{catLabel}</span>
          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${TOKEN_BADGE[skill.tokens]}`}>{tokenLabel}</span>
        </div>
        <p className="text-xs leading-relaxed text-zinc-400">{desc}</p>
        <p className="mt-2 text-xs text-zinc-600">{open ? c.hide : c.show}</p>
      </button>
      {open && (
        <div className="border-t border-zinc-800 px-4 pb-4 pt-3">
          <CodeBlock code={skill.code} />
          <p className="mt-2 text-xs text-zinc-600">
            {c.saveIn} <code className="text-zinc-500">~/.claude/skills/{skill.name}/SKILL.md</code>
          </p>
        </div>
      )}
    </div>
  )
}

// ── EXEMPLE TAB ────────────────────────────────────────────────────────────

function TabExemple() {
  const { lang } = useApp()
  const c = CONTENT[lang].exemple
  const [cat, setCat] = useState<SkillCat>('all')

  const mainSkills = cat === 'all' ? ALL_SKILLS : ALL_SKILLS.filter((s) => s.cat === cat)
  const communitySkills = cat === 'all' ? COMMUNITY_SKILLS : cat === 'community' ? COMMUNITY_SKILLS : []
  const showCaveman = cat === 'all' || cat === 'caveman'

  return (
    <div className="space-y-10">
      <SectionTitle label={c.label} title={c.title} desc={c.desc} />

      {/* Category filter */}
      <div className="overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        <div className="inline-flex gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900/50 p-1.5">
          {CAT_ORDER.map((id) => (
            <button
              key={id}
              onClick={() => setCat(id)}
              type="button"
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                cat === id
                  ? 'bg-emerald-500 text-zinc-950'
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              {CAT_TAB_ICONS[id]}{c.catLabels[id]}
            </button>
          ))}
        </div>
      </div>

      {/* Main skills grid */}
      {mainSkills.length > 0 && (
        <div className="space-y-3">
          {mainSkills.map((s) => <SkillCard key={s.name} skill={s} />)}
        </div>
      )}

      {/* Community section */}
      {communitySkills.length > 0 && (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/3 p-6">
          <div className="mb-5">
            <div className="mb-2 flex items-center gap-3">
              <span className="text-2xl">{c.communityEmoji}</span>
              <h3 className="text-lg font-bold text-white">{c.communityTitle}</h3>
            </div>
            <p className="text-sm text-zinc-400">
              {c.communityDescA}
              <code className="ml-1 rounded bg-zinc-800 px-1 py-0.5 text-xs text-emerald-400">~/.claude/skills/</code>{c.communityDescB}
            </p>
          </div>
          <div className="space-y-3">
            {communitySkills.map((s) => <SkillCard key={s.name} skill={s} />)}
          </div>
        </div>
      )}

      {/* Caveman section */}
      {showCaveman && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/3 p-6">
          <div className="mb-5">
            <div className="mb-2 flex items-center gap-3">
              <span className="text-2xl">{c.cavemanEmoji}</span>
              <h3 className="text-lg font-bold text-white">{c.cavemanTitle}</h3>
            </div>
            <p className="text-sm text-zinc-400">{c.cavemanDesc}</p>
          </div>
          <div className="mb-4 grid gap-2 sm:grid-cols-3">
            {c.cavemanBullets.map((b) => (
              <div key={b.text} className="flex items-center gap-2 rounded-lg border border-amber-500/15 bg-amber-500/5 px-3 py-2">
                <span>{b.emoji}</span>
                <span className="text-xs text-zinc-400">{b.text}</span>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            {CAVEMAN_SKILLS.map((s) => <SkillCard key={s.name} skill={s} />)}
          </div>
        </div>
      )}

      {/* Install instructions */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
          <Terminal className="h-5 w-5 text-emerald-400" /> {c.installTitle}
        </h3>
        <CodeBlock code={c.installCode} />
        <TipBox>
          <strong className="text-white">{c.bulkInstallLabel}</strong>{c.bulkInstallText}
        </TipBox>
      </div>
    </div>
  )
}

// ── MAIN ───────────────────────────────────────────────────────────────────

export default function SkillsGuide() {
  const [active, setActive] = useState<TabId>('introducere')
  const { lang } = useApp()
  const c = CONTENT[lang]

  const TABS: Tab[] = [
    { id: 'introducere', label: c.tabs.introducere, icon: <Sparkles className="h-4 w-4" /> },
    { id: 'structura',   label: c.tabs.structura,   icon: <FolderOpen className="h-4 w-4" /> },
    { id: 'invocare',    label: c.tabs.invocare,    icon: <Terminal className="h-4 w-4" /> },
    { id: 'avansat',     label: c.tabs.avansat,     icon: <Zap className="h-4 w-4" /> },
    { id: 'exemple',     label: c.tabs.exemple,     icon: <BookOpen className="h-4 w-4" /> },
  ]

  return (
    <section className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <span className="mb-4 inline-block text-sm font-semibold tracking-widest text-emerald-400 uppercase">{c.pageLabel}</span>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">{c.pageTitle}</h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-zinc-400">
            {c.pageDesc}
          </p>
        </div>

        {/* Stats strip */}
        <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {c.stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 text-center">
              <p className="mb-1 text-xl font-bold text-emerald-400">{s.value}</p>
              <p className="text-xs text-zinc-500">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="sticky top-16 z-10 mb-8 overflow-x-auto backdrop-blur-sm" style={{ scrollbarWidth: 'none' }}>
          <div className="inline-flex min-w-full gap-1 rounded-xl border border-zinc-800 bg-zinc-900/90 p-1.5 sm:grid sm:grid-cols-5">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className={`flex items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                  active === tab.id
                    ? 'bg-emerald-500 text-zinc-950 shadow-lg'
                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
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
          {active === 'introducere' && <TabIntroducere />}
          {active === 'structura'   && <TabStructura />}
          {active === 'invocare'    && <TabInvocare />}
          {active === 'avansat'     && <TabAvansat />}
          {active === 'exemple'     && <TabExemple />}
        </div>
      </div>
    </section>
  )
}
