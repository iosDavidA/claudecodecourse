import { useState } from 'react'
import {
  CalendarClock, Repeat, Monitor, Cloud, AlarmClock, Webhook, GitPullRequest,
  Info, Lightbulb, AlertTriangle, CheckCircle, ArrowRight, ListChecks, Terminal,
} from 'lucide-react'
import { CodeBlock } from './CodeBlock'
import { useApp } from '../contexts/AppContext'

// ── Types ─────────────────────────────────────────────────────────────────────
// Surse: code.claude.com/docs/en/scheduled-tasks, /desktop-scheduled-tasks, /routines (sept. 2026)

type TabId = 'prezentare' | 'loop' | 'desktop' | 'cloud' | 'exemple'
type ToolKind = 'loop' | 'desktop' | 'cloud'

interface Stat { value: string; label: string; sub: string }
interface CompareRow { label: string; v: [string, string, string] }
interface Pick { q: string; a: ToolKind }
interface TitledText { title: string; desc: string }
interface Snippet { label: string; code: string }
interface ModeRow { input: string; example: string; what: string }
interface CronRow { expr: string; meaning: string }
interface ToolRow { name: string; purpose: string }
interface Recipe { title: string; tool: ToolKind; why: string; code: string }

interface SchedContent {
  badge: string
  title: string
  desc: string
  stats: Stat[]
  tabs: [string, string, string, string, string]
  toolNames: Record<ToolKind, string>
  overview: {
    title: string
    intro: string
    compareTitle: string
    colOption: string
    rows: CompareRow[]
    pickTitle: string
    picks: Pick[]
    related: TitledText[]
    relatedTitle: string
  }
  loop: {
    title: string
    intro: string
    modesTitle: string
    modeHeaders: [string, string, string]
    modes: ModeRow[]
    snippets: Snippet[]
    loopMdTitle: string
    loopMdDesc: string
    loopMdCode: string
    stopTitle: string
    stopDesc: string
    remindTitle: string
    remindDesc: string
    remindCode: string
    manageTitle: string
    manageDesc: string
    manageCode: string
    toolsHeaders: [string, string]
    tools: ToolRow[]
    cronTitle: string
    cronHeaders: [string, string]
    cron: CronRow[]
    cronNote: string
    rulesTitle: string
    rules: TitledText[]
    limitsTitle: string
    limits: string[]
    disableNote: string
  }
  desktop: {
    title: string
    intro: string
    createTitle: string
    createSteps: string[]
    fieldsTitle: string
    fields: TitledText[]
    scheduleTitle: string
    schedules: TitledText[]
    customCode: string
    runTitle: string
    runItems: string[]
    missedTitle: string
    missedDesc: string
    missedCode: string
    permTitle: string
    permDesc: string
    worktreeNote: string
    manageTitle: string
    manageItems: string[]
    diskTitle: string
    diskDesc: string
    diskCode: string
  }
  cloud: {
    title: string
    intro: string
    previewNote: string
    partsTitle: string
    parts: TitledText[]
    createTitle: string
    createCode: string
    triggersTitle: string
    triggers: TitledText[]
    apiTitle: string
    apiDesc: string
    apiCode: string
    apiWarn: string
    githubTitle: string
    githubDesc: string
    githubFilters: string[]
    manageTitle: string
    manageCode: string
    limitsTitle: string
    limits: string[]
    statusWarn: string
  }
  examples: {
    title: string
    intro: string
    whenLabel: string
    recipes: Recipe[]
    promptTitle: string
    promptDesc: string
    promptGood: string
    promptTips: string[]
  }
}

// ── Content ───────────────────────────────────────────────────────────────────
const CONTENT: Record<'ro' | 'en', SchedContent> = {
  ro: {
    badge: 'Lecția 9',
    title: 'Task-uri programate',
    desc: 'Claude poate lucra singur la un interval sau la o oră fixă: verifică un deploy la 5 minute, face review la PR-uri în fiecare dimineață sau pornește un agent în cloud când apare o alertă. Trei mecanisme — /loop, task-uri Desktop și Routines — cu reguli diferite.',
    stats: [
      { value: '3',     label: 'mecanisme',         sub: '/loop · Desktop · Routines (cloud)' },
      { value: '1 min', label: 'interval minim local', sub: '/loop și Desktop (cloud: 1 oră)' },
      { value: '7 zile', label: 'expirare /loop',    sub: 'task-urile recurente se șterg singure' },
      { value: '50',    label: 'task-uri / sesiune', sub: 'limita pentru /loop și cron' },
    ],
    tabs: ['Prezentare', '/loop', 'Desktop', 'Routines (cloud)', 'Exemple'],
    toolNames: { loop: '/loop', desktop: 'Desktop', cloud: 'Routine' },
    overview: {
      title: 'Trei moduri de a programa munca',
      intro: 'Diferența esențială e unde rulează și ce trebuie să rămână pornit. /loop trăiește în sesiunea deschisă, task-urile Desktop rulează pe calculatorul tău fără sesiune deschisă, iar Routines rulează în cloud-ul Anthropic chiar și cu laptopul închis.',
      compareTitle: 'Comparație',
      colOption: 'Criteriu',
      rows: [
        { label: 'Unde rulează',                v: ['Local, în sesiunea curentă', 'Local, pe calculatorul tău', 'Cloud (Anthropic)'] },
        { label: 'Calculatorul trebuie pornit', v: ['Da', 'Da (și aplicația deschisă)', 'Nu'] },
        { label: 'Sesiune deschisă necesară',   v: ['Da', 'Nu', 'Nu'] },
        { label: 'Supraviețuiește restartului', v: ['Parțial (--resume)', 'Da', 'Da'] },
        { label: 'Acces la fișiere locale',     v: ['Da', 'Da', 'Nu — clonă nouă a repo-ului'] },
        { label: 'MCP / conectori',             v: ['Moștenite din sesiune', 'Config local + conectori', 'Conectori per routine'] },
        { label: 'Cereri de permisiune',        v: ['Ca în sesiune', 'Configurabil per task', 'Nu — rulează autonom'] },
        { label: 'Interval minim',              v: ['1 minut', '1 minut', '1 oră'] },
        { label: 'Declanșatori',                v: ['Timp', 'Timp / manual', 'Timp, API, evenimente GitHub'] },
      ],
      pickTitle: 'Ce folosesc?',
      picks: [
        { q: 'Vreau să urmăresc un deploy / build / PR cât lucrez acum?',            a: 'loop' },
        { q: 'Vreau un reminder peste 45 de minute în sesiunea curentă?',            a: 'loop' },
        { q: 'Task zilnic care are nevoie de fișierele sau tool-urile mele locale?', a: 'desktop' },
        { q: 'Audit de dependențe în fiecare luni, pe mașina mea?',                  a: 'desktop' },
        { q: 'Trebuie să ruleze și când laptopul e închis?',                         a: 'cloud' },
        { q: 'Vreau să pornească la o alertă (API) sau la un PR nou (GitHub)?',       a: 'cloud' },
      ],
      relatedTitle: 'Înrudite, dar diferite',
      related: [
        { title: '/goal', desc: 'Nu e un program orar: Claude continuă tură după tură până e îndeplinită o condiție. Bun când știi „ce” vrei, nu „când”.' },
        { title: 'GitHub Actions cu schedule', desc: 'Claude în CI, cu trigger cron în workflow. Detalii în lecția Automatizare & CI/CD.' },
        { title: 'Hooks', desc: 'Reacționează la evenimente din sesiune (edit, stop, notificare) — nu la timp.' },
      ],
    },
    loop: {
      title: '/loop — programare în sesiunea curentă',
      intro: '/loop rulează un prompt din nou și din nou cât timp sesiunea e deschisă. E cel mai rapid mod de a „pune Claude de pază” peste un deploy, un build lung sau un PR. Intervalul și promptul sunt amândouă opționale.',
      modesTitle: 'Ce îi dai → ce face',
      modeHeaders: ['Ce îi dai', 'Exemplu', 'Ce se întâmplă'],
      modes: [
        { input: 'Interval + prompt', example: '/loop 5m check the deploy', what: 'Rulează la interval fix (convertit în cron).' },
        { input: 'Doar prompt',       example: '/loop check the deploy',    what: 'Claude alege singur pauza după fiecare iterație (1 min – 1 oră).' },
        { input: 'Nimic / doar interval', example: '/loop',                 what: 'Rulează promptul de mentenanță încorporat sau loop.md.' },
      ],
      snippets: [
        {
          label: 'Interval fix — unități s, m, h, d',
          code: `> /loop 5m verifică dacă deploy-ul s-a terminat și spune-mi ce s-a întâmplat

# Intervalul poate fi și la final:
> /loop rulează testele de integrare every 2 hours

# Poți rula un skill la fiecare iterație:
> /loop 20m /review-pr 1234`,
        },
        {
          label: 'Self-paced — Claude alege intervalul',
          code: `> /loop verifică dacă CI a trecut și rezolvă comentariile de review

# După fiecare iterație Claude afișează pauza aleasă și motivul:
# scurtă cât CI rulează, lungă când PR-ul e liniștit.`,
        },
        {
          label: 'Fără prompt — mentenanță',
          code: `> /loop        # interval ales dinamic
> /loop 15m    # interval fix

# La fiecare iterație, în ordine:
# 1. continuă munca neterminată din conversație
# 2. PR-ul branch-ului curent: review, CI picat, conflicte
# 3. curățenie (bug hunt, simplificare) dacă nu e nimic altceva`,
        },
      ],
      loopMdTitle: 'Promptul implicit: loop.md',
      loopMdDesc: 'Înlocuiește promptul de mentenanță cu instrucțiunile tale. Claude caută întâi .claude/loop.md (proiect), apoi ~/.claude/loop.md (utilizator). Se aplică doar la /loop fără prompt; modificările intră de la următoarea iterație. Maxim 25.000 bytes.',
      loopMdCode: `<!-- .claude/loop.md -->
Verifică PR-ul pentru release/next. Dacă CI e roșu, citește log-ul
job-ului care a picat, diagnostichează și împinge un fix minim.
Dacă au apărut comentarii noi de review, rezolvă-le pe fiecare.
Dacă totul e verde și liniștit, spune asta într-un rând.`,
      stopTitle: 'Oprire',
      stopDesc: 'Esc oprește un /loop self-paced cât așteaptă următoarea iterație. Claude îl poate opri și singur când task-ul e gata. Loop-urile cu interval fix rulează până le anulezi sau până expiră (7 zile).',
      remindTitle: 'Reminder o singură dată',
      remindDesc: 'Pentru un singur declanșator nu ai nevoie de /loop — descrie în limbaj natural. Task-ul rulează o dată și se șterge.',
      remindCode: `> remind me at 3pm to push the release branch
> in 45 minutes, check whether the integration tests passed`,
      manageTitle: 'Listare și anulare',
      manageDesc: 'Întrebi în limbaj natural; în spate Claude folosește trei tool-uri. Fiecare task are un ID de 8 caractere.',
      manageCode: `> what scheduled tasks do I have?
> cancel the deploy check job`,
      toolsHeaders: ['Tool', 'Rol'],
      tools: [
        { name: 'CronCreate', purpose: 'Creează un task: expresie cron cu 5 câmpuri, promptul, recurent sau o singură dată.' },
        { name: 'CronList',   purpose: 'Listează task-urile cu ID, program și prompt.' },
        { name: 'CronDelete', purpose: 'Anulează un task după ID.' },
      ],
      cronTitle: 'Expresii cron (ora locală)',
      cronHeaders: ['Expresie', 'Înseamnă'],
      cron: [
        { expr: '*/5 * * * *',  meaning: 'La fiecare 5 minute' },
        { expr: '0 * * * *',    meaning: 'La fiecare oră, fix' },
        { expr: '7 * * * *',    meaning: 'La fiecare oră, la minutul 7' },
        { expr: '0 9 * * *',    meaning: 'Zilnic la 9:00' },
        { expr: '0 9 * * 1-5',  meaning: 'Zilele lucrătoare la 9:00' },
        { expr: '30 14 15 3 *', meaning: '15 martie, 14:30' },
      ],
      cronNote: 'Câmpuri: minut oră zi-lună lună zi-săptămână. Duminică = 0 sau 7. Nu sunt suportate L, W, ? sau alias-uri ca MON / JAN.',
      rulesTitle: 'Cum rulează',
      rules: [
        { title: 'Între ture', desc: 'Un task scadent așteaptă să termine Claude răspunsul curent — nu întrerupe.' },
        { title: 'Jitter', desc: 'Task-urile recurente pot porni cu până la 30 min întârziere (sau jumătate din interval, sub o oră). Pentru precizie, evită :00 și :30 — ex. 3 9 * * *.' },
        { title: 'Expiră în 7 zile', desc: 'Un task recurent rulează o ultimă dată după 7 zile și se șterge. Pentru ceva durabil folosește Desktop sau Routines.' },
        { title: 'Fără recuperare', desc: 'Dacă Claude a fost ocupat, un task întârziat rulează o singură dată, nu pentru fiecare interval ratat.' },
      ],
      limitsTitle: 'Limitări',
      limits: [
        'Rulează doar cât Claude Code e pornit și liber; dacă închizi terminalul, se opresc.',
        'O conversație nouă șterge toate task-urile. --resume / --continue le restaurează pe cele create cu CronCreate care nu au expirat.',
        'Un /loop self-paced nu se restaurează la resume — pornește-l din nou.',
        'Maxim 50 de task-uri programate per sesiune.',
      ],
      disableNote: 'Dezactivare completă: CLAUDE_CODE_DISABLE_CRON=1 — /loop și tool-urile cron dispar, iar task-urile existente nu mai rulează.',
    },
    desktop: {
      title: 'Task-uri programate în Claude Code Desktop',
      intro: 'Aplicația Desktop pornește automat o sesiune nouă la ora aleasă — fără să ții o sesiune deschisă. Rulează pe calculatorul tău, deci are acces la fișiere, tool-uri și servere MCP locale. Potrivit pentru code review zilnic, audit de dependențe sau un briefing de dimineață.',
      createTitle: 'Creare',
      createSteps: [
        'În tab-ul Code, deschide Routines (din sidebar sau din meniul More).',
        'Apasă New routine și alege Local (Cloud creează o Routine în cloud).',
        'Completează câmpurile, alege folderul de lucru și programul.',
        'Apasă Run now o dată ca să aprobi permisiunile de care are nevoie.',
      ],
      fieldsTitle: 'Câmpuri',
      fields: [
        { title: 'Name', desc: 'Identificator unic; devine numele folderului pe disc (kebab-case).' },
        { title: 'Description', desc: 'Rezumat scurt, afișat în listă.' },
        { title: 'Instructions', desc: 'Promptul rulat la fiecare execuție, plus modul de permisiuni, modelul, folderul și opțiunea de worktree izolat.' },
        { title: 'Schedule', desc: 'Frecvența — vezi mai jos.' },
      ],
      scheduleTitle: 'Opțiuni de program',
      schedules: [
        { title: 'Manual', desc: 'Fără program — rulează doar la Run now.' },
        { title: 'Hourly', desc: 'În fiecare oră.' },
        { title: 'Daily', desc: 'Zilnic, implicit la 9:00 ora locală.' },
        { title: 'Weekdays', desc: 'Ca Daily, fără sâmbătă și duminică.' },
        { title: 'Weekly', desc: 'O zi și o oră pe săptămână.' },
      ],
      customCode: `# Interval pe care picker-ul nu-l are — ceri direct în orice sesiune Desktop:
> schedule a task to run all the tests every 6 hours

# Sau creezi task-ul direct din conversație:
> set up a daily code review that runs every morning at 9am
> remind me at 3pm tomorrow to check the deploy   # o singură dată`,
      runTitle: 'Cum rulează',
      runItems: [
        'Desktop verifică programul în fiecare minut cât aplicația e deschisă.',
        'Fiecare task pornește cu o mică întârziere constantă (câteva minute) ca să nu lovească toate API-ul simultan.',
        'Primești o notificare, iar sesiunea apare în sidebar la secțiunea Scheduled.',
        'Rulează doar cu aplicația deschisă și calculatorul treaz — activează Keep computer awake în Settings → Desktop app → General.',
      ],
      missedTitle: 'Rulări ratate',
      missedDesc: 'La pornire sau la trezirea calculatorului, Desktop verifică ultimele 7 zile și face o singură rulare de recuperare pentru cea mai recentă oră ratată. Un task de la 9:00 poate rula deci la 23:00 — pune gărzi în prompt.',
      missedCode: `Revizuiește doar commit-urile de azi. Dacă e după ora 17:00,
nu mai face review — scrie doar un rezumat cu ce s-a ratat.`,
      permTitle: 'Permisiuni',
      permDesc: 'Fiecare task are propriul mod de permisiuni; regulile allow din ~/.claude/settings.json se aplică și aici. În modul Manual, un tool neaprobat blochează rularea până răspunzi. Soluția: Run now după creare și „always allow” pentru fiecare tool — rulările viitoare le aprobă automat.',
      worktreeNote: 'Implicit, task-ul lucrează pe starea curentă a folderului, inclusiv modificări necomise. Activează worktree ca fiecare rulare să aibă propriul Git worktree izolat.',
      manageTitle: 'Administrare (pagina task-ului)',
      manageItems: [
        'Run now — rulează imediat.',
        'Active / Paused — pune pe pauză fără să ștergi.',
        'Edit — instrucțiuni, program, folder, model.',
        'History — toate rulările, inclusiv cele sărite și motivul (calculator adormit, rulare anterioară încă activă etc.).',
        'Always allowed — vezi și revocă permisiunile salvate.',
        'Delete — șterge task-ul; opțional și fișierele de pe disc.',
      ],
      diskTitle: 'Pe disc',
      diskDesc: 'Promptul e salvat ca skill. Poți edita fișierul direct; schimbarea se aplică la următoarea rulare. Programul, folderul, modelul și starea nu sunt în fișier — le schimbi din Edit. Un task își poate modifica singur programul prin tool-ul MCP update_scheduled_task.',
      diskCode: `~/.claude/scheduled-tasks/<task-name>/SKILL.md

---
name: dependency-audit
description: Audit săptămânal al dependențelor
---
Rulează npm outdated și npm audit. Pentru fiecare pachet
cu vulnerabilitate high/critical, propune versiunea sigură...`,
    },
    cloud: {
      title: 'Routines — agenți programați în cloud',
      intro: 'O routine este o configurație salvată — prompt, unul sau mai multe repo-uri, conectori — care rulează automat pe infrastructura Anthropic. Merge și cu laptopul închis și poate porni la oră fixă, la un apel API sau la un eveniment GitHub.',
      previewNote: 'Research preview — comportamentul și limitele se pot schimba. Disponibil pe Pro, Max, Team și Enterprise; cere login cu cont claude.ai (nu API key, Bedrock sau Vertex).',
      partsTitle: 'Din ce e făcută',
      parts: [
        { title: 'Prompt + model', desc: 'Trebuie să fie complet autonom: ce face și cum arată succesul. Modelul se alege în formular.' },
        { title: 'Repo-uri', desc: 'Clonate la fiecare rulare din branch-ul implicit. Claude împinge pe branch-uri claude/*; branch-urile protejate sunt refuzate.' },
        { title: 'Environment', desc: 'Acces la rețea (implicit Trusted — doar allowlist), variabile de mediu și un setup script cache-uit.' },
        { title: 'Conectori', desc: 'Toți conectorii tăi sunt incluși implicit — scoate-i pe cei inutili, fiindcă Claude îi poate folosi fără aprobare.' },
      ],
      createTitle: 'Creare din CLI cu /schedule',
      createCode: `# Recurent — Claude te întreabă de repo, program și prompt:
> /schedule daily PR review at 9am

# O singură dată (nu consumă din limita zilnică):
> /schedule tomorrow at 9am, summarize yesterday's merged PRs
> /schedule in 2 weeks, open a cleanup PR that removes the feature flag

# Sau din web: claude.ai/code/routines → New routine
# Sau din Desktop: Routines → New routine → Cloud`,
      triggersTitle: 'Declanșatori (se pot combina)',
      triggers: [
        { title: 'Schedule', desc: 'Hourly, daily, weekdays, weekly sau o singură dată la o oră anume. Cron personalizat cu /schedule update. Minim o oră.' },
        { title: 'API', desc: 'Endpoint HTTP dedicat, cu token bearer. Adăugat doar din web. Util pentru alerte și pipeline-uri de deploy.' },
        { title: 'GitHub', desc: 'Pull request (opened, closed, labeled...) sau release. Cere Claude GitHub App instalată pe repo.' },
      ],
      apiTitle: 'Pornire prin API',
      apiDesc: 'Câmpul text ajunge la routine împachetat ca date nesigure (<routine-fire-payload>). Promptul routine-ului trebuie să spună explicit ce face cu el — altfel textul e ignorat ca instrucțiune.',
      apiCode: `curl -X POST https://api.anthropic.com/v1/claude_code/routines/trig_.../fire \\
  -H "Authorization: Bearer sk-ant-oat01-..." \\
  -H "anthropic-beta: experimental-cc-routine-2026-04-01" \\
  -H "anthropic-version: 2023-06-01" \\
  -H "Content-Type: application/json" \\
  -d '{"text": "Alertă Sentry SEN-4521 în producție. Stack trace atașat."}'

# Răspuns: { "type": "routine_fire",
#            "claude_code_session_url": "https://claude.ai/code/session_..." }`,
      apiWarn: 'Token-ul se afișează o singură dată — păstrează-l într-un secret store. Endpoint-ul e sub header beta și se poate schimba.',
      githubTitle: 'Filtre pentru pull request-uri',
      githubDesc: 'Toate condițiile trebuie să se potrivească. Operatori: equals, contains, starts with, is one of, is not one of, matches regex (regex-ul se aplică pe tot câmpul — folosește .*hotfix.*).',
      githubFilters: ['Author', 'Title', 'Body', 'Base branch', 'Head branch', 'Labels', 'Is draft', 'Is merged'],
      manageTitle: 'Administrare din CLI',
      manageCode: `> /schedule list      # toate routine-urile
> /schedule update    # modifică (inclusiv cron personalizat)
> /schedule run       # rulează acum

# Diagnostic din istoricul rulărilor:
> /schedule why did my nightly review do nothing this morning?

# Trigger GitHub pe o routine existentă:
> /schedule add a GitHub trigger to my nightly review
  for pull requests opened in acme/webapp`,
      limitsTitle: 'De știut',
      limits: [
        'Consumă din abonament ca o sesiune normală, plus o limită zilnică de rulări per cont (rulările one-off nu intră în ea).',
        'Routine-urile sunt ale contului tău: commit-urile, PR-urile și acțiunile prin conectori apar în numele tău.',
        'Rulează fără cereri de permisiune — limitează repo-urile, rețeaua și conectorii la strictul necesar.',
        'Dacă GitHub se deconectează, rulările se sar până la 72 de ore; după aceea routine-ul se oprește.',
        'Owner-ii Team / Enterprise pot dezactiva Routines pentru toată organizația.',
      ],
      statusWarn: 'Status verde în lista de rulări = sesiunea a pornit și s-a terminat fără eroare de infrastructură, NU că task-ul a reușit. Deschide rularea și citește transcriptul.',
    },
    examples: {
      title: 'Rețete practice',
      intro: 'Scenarii reale, fiecare cu mecanismul potrivit. Promptul contează mai mult decât programul: un task programat rulează fără tine, deci trebuie să fie complet.',
      whenLabel: 'De ce așa',
      recipes: [
        {
          title: 'Urmărești un deploy',
          tool: 'loop',
          why: 'Durează minute, ai nevoie de sesiunea curentă și nu vrei nimic persistent.',
          code: `> /loop 3m verifică statusul deploy-ului pe Vercel.
  Când e READY, deschide / și /modele și confirmă
  că pagina se încarcă. Dacă e ERROR, citește log-ul
  de build și spune-mi cauza. Apoi oprește loop-ul.`,
        },
        {
          title: 'Babysitting pe un PR',
          tool: 'loop',
          why: 'Self-paced: Claude verifică des cât CI rulează și rar când PR-ul e liniștit.',
          code: `> /loop verifică PR-ul #42: dacă CI a picat,
  repară și împinge; dacă au apărut comentarii de
  review, rezolvă-le. Oprește-te când e aprobat.`,
        },
        {
          title: 'Code review de dimineață',
          tool: 'desktop',
          why: 'Are nevoie de repo-ul local și de tool-urile tale; rulează zilnic fără sesiune deschisă.',
          code: `# Desktop → Routines → New routine → Local
# Schedule: Weekdays, 9:00 · Worktree: activat
Revizuiește commit-urile din ultimele 24h de pe main.
Semnalează: bug-uri probabile, lipsă de teste, secrete
în cod. Scrie un raport scurt în reports/review-<data>.md.
Dacă e după 12:00, fă doar rezumatul.`,
        },
        {
          title: 'Audit săptămânal de dependențe',
          tool: 'desktop',
          why: 'Rulează npm local; permisiunile se aprobă o dată cu Run now.',
          code: `# Schedule: Weekly, luni 10:00
Rulează npm outdated și npm audit. Pentru fiecare
vulnerabilitate high/critical propune upgrade-ul minim
sigur și rulează testele. Nu face commit — lasă
modificările pe un branch deps/<data> pentru review.`,
        },
        {
          title: 'Review nocturn al PR-urilor, în cloud',
          tool: 'cloud',
          why: 'Trebuie să ruleze și cu laptopul închis; lucrează pe o clonă curată.',
          code: `> /schedule every weekday at 22:00, review open PRs
  in iosDavidA/claudecodecourse against CLAUDE.md
  rules and leave a summary comment on each`,
        },
        {
          title: 'Triaj automat al alertelor',
          tool: 'cloud',
          why: 'Pornește prin API din tool-ul de monitoring; promptul spune explicit să folosească payload-ul.',
          code: `Prompt routine:
Investighează alerta din blocul routine-fire-payload.
Corelează stack trace-ul cu commit-urile recente,
deschide un draft PR cu fix-ul propus și pune în
descriere link-ul către alertă.`,
        },
      ],
      promptTitle: 'Cum scrii promptul unui task programat',
      promptDesc: 'Nu ești acolo să clarifici. Promptul trebuie să spună ce face, unde, cum arată succesul și ce face când nu are ce face.',
      promptGood: `Verifică PR-urile deschise pe main (nu draft-urile).
Pentru fiecare: rulează testele, citește diff-ul, lasă
un comentariu cu probleme concrete (fișier:linie).
Succes = fiecare PR are un comentariu nou sau „LGTM”.
Dacă nu e niciun PR deschis, scrie „Nimic de revizuit”
și oprește-te. Nu face merge și nu împinge pe main.`,
      promptTips: [
        'Scope clar: ce repo, ce branch, ce fișiere.',
        'Criteriu de succes verificabil.',
        'Ce face când nu e nimic de făcut (altfel improvizează).',
        'Ce NU are voie să facă: merge, push pe main, ștergeri.',
        'Gărzi de timp pentru rulările întârziate.',
      ],
    },
  },
  en: {
    badge: 'Lesson 9',
    title: 'Scheduled tasks',
    desc: 'Claude can work on its own at an interval or at a fixed time: check a deploy every 5 minutes, review PRs every morning, or start a cloud agent when an alert fires. Three mechanisms — /loop, Desktop tasks and Routines — each with different rules.',
    stats: [
      { value: '3',      label: 'mechanisms',          sub: '/loop · Desktop · Routines (cloud)' },
      { value: '1 min',  label: 'min. local interval', sub: '/loop and Desktop (cloud: 1 hour)' },
      { value: '7 days', label: '/loop expiry',        sub: 'recurring tasks delete themselves' },
      { value: '50',     label: 'tasks / session',     sub: 'limit for /loop and cron' },
    ],
    tabs: ['Overview', '/loop', 'Desktop', 'Routines (cloud)', 'Examples'],
    toolNames: { loop: '/loop', desktop: 'Desktop', cloud: 'Routine' },
    overview: {
      title: 'Three ways to schedule work',
      intro: 'The key difference is where it runs and what must stay on. /loop lives in the open session, Desktop tasks run on your computer without an open session, and Routines run in Anthropic\'s cloud even with your laptop closed.',
      compareTitle: 'Comparison',
      colOption: 'Criterion',
      rows: [
        { label: 'Runs on',                   v: ['Local, current session', 'Local, your computer', 'Cloud (Anthropic)'] },
        { label: 'Computer must be on',       v: ['Yes', 'Yes (and the app open)', 'No'] },
        { label: 'Open session required',     v: ['Yes', 'No', 'No'] },
        { label: 'Survives restart',          v: ['Partly (--resume)', 'Yes', 'Yes'] },
        { label: 'Access to local files',     v: ['Yes', 'Yes', 'No — fresh repo clone'] },
        { label: 'MCP / connectors',          v: ['Inherited from session', 'Local config + connectors', 'Connectors per routine'] },
        { label: 'Permission prompts',        v: ['As in the session', 'Configurable per task', 'No — runs autonomously'] },
        { label: 'Minimum interval',          v: ['1 minute', '1 minute', '1 hour'] },
        { label: 'Triggers',                  v: ['Time', 'Time / manual', 'Time, API, GitHub events'] },
      ],
      pickTitle: 'Which one do I use?',
      picks: [
        { q: 'I want to watch a deploy / build / PR while I work?',             a: 'loop' },
        { q: 'I want a reminder in 45 minutes in this session?',                a: 'loop' },
        { q: 'A daily task that needs my local files or tools?',                a: 'desktop' },
        { q: 'A dependency audit every Monday, on my machine?',                 a: 'desktop' },
        { q: 'It must run even when my laptop is closed?',                      a: 'cloud' },
        { q: 'It should start on an alert (API) or a new PR (GitHub)?',         a: 'cloud' },
      ],
      relatedTitle: 'Related, but different',
      related: [
        { title: '/goal', desc: 'Not a schedule: Claude keeps going turn after turn until a condition is met. Good when you know "what", not "when".' },
        { title: 'GitHub Actions with schedule', desc: 'Claude in CI with a cron trigger in the workflow. See the Automation & CI/CD lesson.' },
        { title: 'Hooks', desc: 'React to session events (edit, stop, notification) — not to time.' },
      ],
    },
    loop: {
      title: '/loop — scheduling inside the current session',
      intro: '/loop runs a prompt over and over while the session stays open. It is the fastest way to "put Claude on watch" over a deploy, a long build or a PR. Both the interval and the prompt are optional.',
      modesTitle: 'What you give it → what it does',
      modeHeaders: ['You provide', 'Example', 'What happens'],
      modes: [
        { input: 'Interval + prompt', example: '/loop 5m check the deploy', what: 'Runs on a fixed interval (converted to cron).' },
        { input: 'Prompt only',       example: '/loop check the deploy',    what: 'Claude picks the delay after each iteration (1 min – 1 hour).' },
        { input: 'Nothing / interval only', example: '/loop',               what: 'Runs the built-in maintenance prompt or loop.md.' },
      ],
      snippets: [
        {
          label: 'Fixed interval — units s, m, h, d',
          code: `> /loop 5m check if the deployment finished and tell me what happened

# The interval can also trail the prompt:
> /loop run the integration tests every 2 hours

# You can re-run a skill each iteration:
> /loop 20m /review-pr 1234`,
        },
        {
          label: 'Self-paced — Claude picks the interval',
          code: `> /loop check whether CI passed and address any review comments

# After each iteration Claude prints the chosen delay and why:
# short while CI runs, long once the PR goes quiet.`,
        },
        {
          label: 'No prompt — maintenance',
          code: `> /loop        # dynamically chosen interval
> /loop 15m    # fixed interval

# Each iteration, in order:
# 1. continue unfinished work from the conversation
# 2. the current branch's PR: reviews, failed CI, conflicts
# 3. cleanup (bug hunt, simplification) when nothing else is pending`,
        },
      ],
      loopMdTitle: 'The default prompt: loop.md',
      loopMdDesc: 'Replaces the maintenance prompt with your own instructions. Claude looks for .claude/loop.md (project) first, then ~/.claude/loop.md (user). It only applies to /loop without a prompt; edits take effect on the next iteration. Max 25,000 bytes.',
      loopMdCode: `<!-- .claude/loop.md -->
Check the release/next PR. If CI is red, pull the failing job log,
diagnose, and push a minimal fix. If new review comments have
arrived, address each one. If everything is green and quiet,
say so in one line.`,
      stopTitle: 'Stopping',
      stopDesc: 'Esc stops a self-paced /loop while it waits for the next iteration. Claude can also stop it by itself once the task is done. Fixed-interval loops run until you cancel them or they expire (7 days).',
      remindTitle: 'One-time reminder',
      remindDesc: 'For a single fire you do not need /loop — describe it in natural language. The task runs once and deletes itself.',
      remindCode: `> remind me at 3pm to push the release branch
> in 45 minutes, check whether the integration tests passed`,
      manageTitle: 'Listing and cancelling',
      manageDesc: 'Ask in natural language; behind the scenes Claude uses three tools. Every task has an 8-character ID.',
      manageCode: `> what scheduled tasks do I have?
> cancel the deploy check job`,
      toolsHeaders: ['Tool', 'Purpose'],
      tools: [
        { name: 'CronCreate', purpose: 'Creates a task: 5-field cron expression, the prompt, recurring or one-shot.' },
        { name: 'CronList',   purpose: 'Lists tasks with ID, schedule and prompt.' },
        { name: 'CronDelete', purpose: 'Cancels a task by ID.' },
      ],
      cronTitle: 'Cron expressions (local time)',
      cronHeaders: ['Expression', 'Meaning'],
      cron: [
        { expr: '*/5 * * * *',  meaning: 'Every 5 minutes' },
        { expr: '0 * * * *',    meaning: 'Every hour on the hour' },
        { expr: '7 * * * *',    meaning: 'Every hour at minute 7' },
        { expr: '0 9 * * *',    meaning: 'Daily at 9:00' },
        { expr: '0 9 * * 1-5',  meaning: 'Weekdays at 9:00' },
        { expr: '30 14 15 3 *', meaning: 'March 15, 14:30' },
      ],
      cronNote: 'Fields: minute hour day-of-month month day-of-week. Sunday = 0 or 7. L, W, ? and aliases like MON / JAN are not supported.',
      rulesTitle: 'How it runs',
      rules: [
        { title: 'Between turns', desc: 'A due task waits for Claude to finish the current response — it never interrupts.' },
        { title: 'Jitter', desc: 'Recurring tasks may fire up to 30 min late (or half the interval, below one hour). For precision avoid :00 and :30 — e.g. 3 9 * * *.' },
        { title: 'Expires in 7 days', desc: 'A recurring task fires one last time after 7 days and deletes itself. For something durable use Desktop or Routines.' },
        { title: 'No catch-up', desc: 'If Claude was busy, a late task fires once, not once per missed interval.' },
      ],
      limitsTitle: 'Limitations',
      limits: [
        'Runs only while Claude Code is running and idle; closing the terminal stops it.',
        'A new conversation clears all tasks. --resume / --continue restores tasks created with CronCreate that have not expired.',
        'A self-paced /loop is not restored on resume — start it again.',
        'At most 50 scheduled tasks per session.',
      ],
      disableNote: 'Disable entirely: CLAUDE_CODE_DISABLE_CRON=1 — /loop and the cron tools disappear and existing tasks stop firing.',
    },
    desktop: {
      title: 'Scheduled tasks in Claude Code Desktop',
      intro: 'The Desktop app automatically starts a new session at the time you choose — no open session needed. It runs on your computer, so it has access to local files, tools and MCP servers. A good fit for a daily code review, a dependency audit or a morning briefing.',
      createTitle: 'Creating one',
      createSteps: [
        'In the Code tab, open Routines (from the sidebar or the More menu).',
        'Click New routine and choose Local (Cloud creates a cloud Routine).',
        'Fill in the fields, pick the working folder and the schedule.',
        'Click Run now once to approve the permissions it needs.',
      ],
      fieldsTitle: 'Fields',
      fields: [
        { title: 'Name', desc: 'Unique identifier; becomes the folder name on disk (kebab-case).' },
        { title: 'Description', desc: 'Short summary shown in the list.' },
        { title: 'Instructions', desc: 'The prompt run each time, plus the permission mode, model, folder and the isolated-worktree option.' },
        { title: 'Schedule', desc: 'The frequency — see below.' },
      ],
      scheduleTitle: 'Schedule options',
      schedules: [
        { title: 'Manual', desc: 'No schedule — runs only on Run now.' },
        { title: 'Hourly', desc: 'Every hour.' },
        { title: 'Daily', desc: 'Daily, 9:00 local time by default.' },
        { title: 'Weekdays', desc: 'Like Daily, skipping Saturday and Sunday.' },
        { title: 'Weekly', desc: 'One day and time per week.' },
      ],
      customCode: `# An interval the picker lacks — just ask in any Desktop session:
> schedule a task to run all the tests every 6 hours

# Or create the task straight from a conversation:
> set up a daily code review that runs every morning at 9am
> remind me at 3pm tomorrow to check the deploy   # one-time`,
      runTitle: 'How it runs',
      runItems: [
        'Desktop checks the schedule every minute while the app is open.',
        'Each task starts with a small constant delay (a few minutes) so they do not all hit the API at once.',
        'You get a notification and the session shows up in the sidebar under Scheduled.',
        'Runs only with the app open and the computer awake — enable Keep computer awake in Settings → Desktop app → General.',
      ],
      missedTitle: 'Missed runs',
      missedDesc: 'On startup or wake, Desktop checks the last 7 days and runs exactly one catch-up for the most recent missed time. A 9:00 task may therefore run at 23:00 — put guardrails in the prompt.',
      missedCode: `Only review today's commits. If it's after 5pm,
skip the review and just post a summary of what was missed.`,
      permTitle: 'Permissions',
      permDesc: 'Each task has its own permission mode; allow rules from ~/.claude/settings.json apply too. In Manual mode an unapproved tool stalls the run until you answer. The fix: Run now after creating it and "always allow" each tool — future runs approve them automatically.',
      worktreeNote: 'By default the task works on the folder\'s current state, including uncommitted changes. Enable worktree to give each run its own isolated Git worktree.',
      manageTitle: 'Managing (task page)',
      manageItems: [
        'Run now — run immediately.',
        'Active / Paused — pause without deleting.',
        'Edit — instructions, schedule, folder, model.',
        'History — every run, including skipped ones and why (computer asleep, previous run still active, etc.).',
        'Always allowed — review and revoke saved approvals.',
        'Delete — remove the task; optionally its files on disk too.',
      ],
      diskTitle: 'On disk',
      diskDesc: 'The prompt is stored as a skill. You can edit the file directly; changes apply on the next run. Schedule, folder, model and state are not in the file — change them via Edit. A task can reschedule itself with the update_scheduled_task MCP tool.',
      diskCode: `~/.claude/scheduled-tasks/<task-name>/SKILL.md

---
name: dependency-audit
description: Weekly dependency audit
---
Run npm outdated and npm audit. For each package with
a high/critical vulnerability, propose the safe version...`,
    },
    cloud: {
      title: 'Routines — scheduled agents in the cloud',
      intro: 'A routine is a saved configuration — prompt, one or more repositories, connectors — that runs automatically on Anthropic infrastructure. It works with your laptop closed and can start at a fixed time, on an API call or on a GitHub event.',
      previewNote: 'Research preview — behavior and limits may change. Available on Pro, Max, Team and Enterprise; requires a claude.ai login (not an API key, Bedrock or Vertex).',
      partsTitle: 'What it is made of',
      parts: [
        { title: 'Prompt + model', desc: 'Must be fully self-contained: what to do and what success looks like. The model is chosen in the form.' },
        { title: 'Repositories', desc: 'Cloned on every run from the default branch. Claude pushes to claude/* branches; protected branches are rejected.' },
        { title: 'Environment', desc: 'Network access (Trusted by default — allowlist only), environment variables and a cached setup script.' },
        { title: 'Connectors', desc: 'All your connectors are included by default — remove the unneeded ones, since Claude can use them without approval.' },
      ],
      createTitle: 'Creating from the CLI with /schedule',
      createCode: `# Recurring — Claude asks about repo, schedule and prompt:
> /schedule daily PR review at 9am

# One-off (does not count toward the daily cap):
> /schedule tomorrow at 9am, summarize yesterday's merged PRs
> /schedule in 2 weeks, open a cleanup PR that removes the feature flag

# Or on the web: claude.ai/code/routines → New routine
# Or in Desktop: Routines → New routine → Cloud`,
      triggersTitle: 'Triggers (can be combined)',
      triggers: [
        { title: 'Schedule', desc: 'Hourly, daily, weekdays, weekly or a single run at a set time. Custom cron via /schedule update. Minimum one hour.' },
        { title: 'API', desc: 'Dedicated HTTP endpoint with a bearer token. Added from the web only. Useful for alerts and deploy pipelines.' },
        { title: 'GitHub', desc: 'Pull request (opened, closed, labeled...) or release. Requires the Claude GitHub App on the repo.' },
      ],
      apiTitle: 'Starting via API',
      apiDesc: 'The text field reaches the routine wrapped as untrusted data (<routine-fire-payload>). The routine prompt must say explicitly what to do with it — otherwise the text is not treated as instructions.',
      apiCode: `curl -X POST https://api.anthropic.com/v1/claude_code/routines/trig_.../fire \\
  -H "Authorization: Bearer sk-ant-oat01-..." \\
  -H "anthropic-beta: experimental-cc-routine-2026-04-01" \\
  -H "anthropic-version: 2023-06-01" \\
  -H "Content-Type: application/json" \\
  -d '{"text": "Sentry alert SEN-4521 fired in prod. Stack trace attached."}'

# Response: { "type": "routine_fire",
#             "claude_code_session_url": "https://claude.ai/code/session_..." }`,
      apiWarn: 'The token is shown only once — keep it in a secret store. The endpoint is behind a beta header and may change.',
      githubTitle: 'Pull request filters',
      githubDesc: 'All conditions must match. Operators: equals, contains, starts with, is one of, is not one of, matches regex (the regex tests the whole field — use .*hotfix.*).',
      githubFilters: ['Author', 'Title', 'Body', 'Base branch', 'Head branch', 'Labels', 'Is draft', 'Is merged'],
      manageTitle: 'Managing from the CLI',
      manageCode: `> /schedule list      # all routines
> /schedule update    # change one (including custom cron)
> /schedule run       # run now

# Diagnose from run history:
> /schedule why did my nightly review do nothing this morning?

# GitHub trigger on an existing routine:
> /schedule add a GitHub trigger to my nightly review
  for pull requests opened in acme/webapp`,
      limitsTitle: 'Good to know',
      limits: [
        'Draws down your subscription like a normal session, plus a daily run cap per account (one-off runs are exempt).',
        'Routines belong to your account: commits, PRs and connector actions appear as you.',
        'Runs without permission prompts — scope repos, network and connectors to what is strictly needed.',
        'If GitHub disconnects, runs are skipped for up to 72 hours; after that the routine turns off.',
        'Team / Enterprise Owners can disable Routines for the whole organization.',
      ],
      statusWarn: 'A green status in the run list = the session started and exited without an infrastructure error, NOT that the task succeeded. Open the run and read the transcript.',
    },
    examples: {
      title: 'Practical recipes',
      intro: 'Real scenarios, each with the right mechanism. The prompt matters more than the schedule: a scheduled task runs without you, so it must be complete.',
      whenLabel: 'Why this way',
      recipes: [
        {
          title: 'Watching a deploy',
          tool: 'loop',
          why: 'Takes minutes, needs the current session, nothing should persist.',
          code: `> /loop 3m check the Vercel deploy status.
  When it is READY, open / and /modele and confirm
  the page loads. If it is ERROR, read the build log
  and tell me the cause. Then stop the loop.`,
        },
        {
          title: 'Babysitting a PR',
          tool: 'loop',
          why: 'Self-paced: Claude checks often while CI runs and rarely once the PR is quiet.',
          code: `> /loop check PR #42: if CI failed, fix it and
  push; if new review comments arrived, address
  them. Stop once it is approved.`,
        },
        {
          title: 'Morning code review',
          tool: 'desktop',
          why: 'Needs the local repo and your tools; runs daily without an open session.',
          code: `# Desktop → Routines → New routine → Local
# Schedule: Weekdays, 9:00 · Worktree: on
Review the last 24h of commits on main. Flag likely
bugs, missing tests and secrets in code. Write a short
report to reports/review-<date>.md.
If it is after 12:00, only write the summary.`,
        },
        {
          title: 'Weekly dependency audit',
          tool: 'desktop',
          why: 'Runs npm locally; permissions are approved once via Run now.',
          code: `# Schedule: Weekly, Monday 10:00
Run npm outdated and npm audit. For each high/critical
vulnerability propose the smallest safe upgrade and run
the tests. Do not commit — leave the changes on a
deps/<date> branch for review.`,
        },
        {
          title: 'Nightly PR review, in the cloud',
          tool: 'cloud',
          why: 'Must run with the laptop closed; works on a clean clone.',
          code: `> /schedule every weekday at 22:00, review open PRs
  in iosDavidA/claudecodecourse against CLAUDE.md
  rules and leave a summary comment on each`,
        },
        {
          title: 'Automatic alert triage',
          tool: 'cloud',
          why: 'Started via API from the monitoring tool; the prompt explicitly says to use the payload.',
          code: `Routine prompt:
Investigate the alert in the routine-fire-payload block.
Correlate the stack trace with recent commits, open a
draft PR with the proposed fix and link the alert in
the description.`,
        },
      ],
      promptTitle: 'How to write the prompt for a scheduled task',
      promptDesc: 'You are not there to clarify. The prompt must say what to do, where, what success looks like and what to do when there is nothing to do.',
      promptGood: `Check the open PRs against main (not drafts).
For each: run the tests, read the diff, leave a comment
with concrete issues (file:line).
Success = every PR has a new comment or "LGTM".
If there are no open PRs, write "Nothing to review"
and stop. Do not merge and do not push to main.`,
      promptTips: [
        'Clear scope: which repo, which branch, which files.',
        'A verifiable success criterion.',
        'What to do when there is nothing to do (otherwise it improvises).',
        'What it must NOT do: merge, push to main, deletions.',
        'Time guardrails for delayed runs.',
      ],
    },
  },
}

// ── Static styling per mechanism ─────────────────────────────────────────────
const TOOL_STYLE: Record<ToolKind, { text: string; badge: string; icon: React.ReactNode }> = {
  loop:    { text: 'text-amber-400', badge: 'border-amber-500/30 bg-amber-500/10 text-amber-400', icon: <Repeat className="h-4 w-4" /> },
  desktop: { text: 'text-blue-400',  badge: 'border-blue-500/30 bg-blue-500/10 text-blue-400',    icon: <Monitor className="h-4 w-4" /> },
  cloud:   { text: 'text-teal-400',  badge: 'border-teal-500/30 bg-teal-500/10 text-teal-400',    icon: <Cloud className="h-4 w-4" /> },
}
const TOOL_ORDER: ToolKind[] = ['loop', 'desktop', 'cloud']

// ── Shared helpers ────────────────────────────────────────────────────────────
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
function Section({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
      <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
        {icon}{title}
      </h3>
      {children}
    </div>
  )
}
function TabHeader({ title, intro }: { title: string; intro: string }) {
  return (
    <div>
      <h2 className="mb-2 text-2xl font-bold text-white">{title}</h2>
      <p className="leading-relaxed text-zinc-400">{intro}</p>
    </div>
  )
}
function Bullets({ items, icon = 'check' }: { items: string[]; icon?: 'check' | 'arrow' }) {
  return (
    <ul className="space-y-2">
      {items.map((it) => (
        <li key={it} className="flex items-start gap-2 text-sm text-zinc-400">
          {icon === 'check'
            ? <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-teal-400" />
            : <ArrowRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-teal-400" />}
          {it}
        </li>
      ))}
    </ul>
  )
}
function CardGrid({ items, cols = 'sm:grid-cols-2' }: { items: TitledText[]; cols?: string }) {
  return (
    <div className={`grid gap-3 ${cols}`}>
      {items.map((it) => (
        <div key={it.title} className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-4">
          <div className="mb-1 font-mono text-sm font-semibold text-teal-400">{it.title}</div>
          <p className="text-xs leading-relaxed text-zinc-400">{it.desc}</p>
        </div>
      ))}
    </div>
  )
}
function SimpleTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-800 bg-zinc-900/60">
            {headers.map((h) => <th key={h} className="px-4 py-3 text-left font-semibold text-zinc-400">{h}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/50">
          {rows.map((r) => (
            <tr key={r.join('|')} className="bg-zinc-950 transition-colors hover:bg-zinc-900/30">
              <td className="px-4 py-3 font-mono text-xs text-teal-300">{r[0]}</td>
              {r.slice(1).map((cell) => <td key={cell} className="px-4 py-3 text-xs text-zinc-400">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── TAB: PREZENTARE ───────────────────────────────────────────────────────────
function TabPrezentare({ c }: { c: SchedContent }) {
  const o = c.overview
  return (
    <div className="space-y-8">
      <TabHeader title={o.title} intro={o.intro} />

      <div className="overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/60">
              <th className="px-4 py-3 text-left font-semibold text-zinc-400">{o.colOption}</th>
              {TOOL_ORDER.map((k) => (
                <th key={k} className={`px-4 py-3 text-center font-semibold ${TOOL_STYLE[k].text}`}>
                  <span className="inline-flex items-center gap-1.5">{TOOL_STYLE[k].icon}{c.toolNames[k]}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {o.rows.map((r) => (
              <tr key={r.label} className="bg-zinc-950 transition-colors hover:bg-zinc-900/30">
                <td className="px-4 py-3 text-zinc-400">{r.label}</td>
                {r.v.map((cell, i) => (
                  <td key={i} className="px-4 py-3 text-center text-xs text-zinc-300">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Section title={o.pickTitle} icon={<ListChecks className="h-5 w-5 text-teal-400" />}>
        <div className="space-y-2">
          {o.picks.map((p) => (
            <div key={p.q} className="flex items-center justify-between gap-4 rounded-lg border border-zinc-800 bg-zinc-950/40 px-4 py-3">
              <span className="flex-1 text-sm text-zinc-300">{p.q}</span>
              <span className={`inline-flex flex-shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${TOOL_STYLE[p.a].badge}`}>
                {TOOL_STYLE[p.a].icon}{c.toolNames[p.a]}
              </span>
            </div>
          ))}
        </div>
      </Section>

      <div>
        <h3 className="mb-4 text-lg font-semibold text-white">{o.relatedTitle}</h3>
        <CardGrid items={o.related} cols="sm:grid-cols-3" />
      </div>
    </div>
  )
}

// ── TAB: /LOOP ────────────────────────────────────────────────────────────────
function TabLoop({ c }: { c: SchedContent }) {
  const l = c.loop
  return (
    <div className="space-y-8">
      <TabHeader title={l.title} intro={l.intro} />

      <div>
        <h3 className="mb-4 text-lg font-semibold text-white">{l.modesTitle}</h3>
        <SimpleTable headers={[l.modeHeaders[1], l.modeHeaders[0], l.modeHeaders[2]]} rows={l.modes.map((m) => [m.example, m.input, m.what])} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {l.snippets.map((s) => (
          <div key={s.label}>
            <span className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-zinc-500">{s.label}</span>
            <CodeBlock code={s.code} />
          </div>
        ))}
      </div>

      <Section title={l.loopMdTitle}>
        <p className="mb-4 text-sm text-zinc-400">{l.loopMdDesc}</p>
        <CodeBlock code={l.loopMdCode} label=".claude/loop.md" />
      </Section>

      <div className="grid gap-4 md:grid-cols-2">
        <Section title={l.remindTitle} icon={<AlarmClock className="h-5 w-5 text-teal-400" />}>
          <p className="mb-4 text-sm text-zinc-400">{l.remindDesc}</p>
          <CodeBlock code={l.remindCode} />
        </Section>
        <Section title={l.manageTitle} icon={<ListChecks className="h-5 w-5 text-teal-400" />}>
          <p className="mb-4 text-sm text-zinc-400">{l.manageDesc}</p>
          <CodeBlock code={l.manageCode} />
        </Section>
      </div>

      <SimpleTable headers={[...l.toolsHeaders]} rows={l.tools.map((t) => [t.name, t.purpose])} />

      <InfoBox><strong className="text-blue-300">{l.stopTitle}:</strong> {l.stopDesc}</InfoBox>

      <div>
        <h3 className="mb-4 text-lg font-semibold text-white">{l.cronTitle}</h3>
        <SimpleTable headers={[...l.cronHeaders]} rows={l.cron.map((r) => [r.expr, r.meaning])} />
        <p className="mt-2 text-xs text-zinc-600">{l.cronNote}</p>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold text-white">{l.rulesTitle}</h3>
        <CardGrid items={l.rules} />
      </div>

      <Section title={l.limitsTitle} icon={<AlertTriangle className="h-5 w-5 text-amber-400" />}>
        <Bullets items={l.limits} icon="arrow" />
      </Section>

      <WarnBox>{l.disableNote}</WarnBox>
    </div>
  )
}

// ── TAB: DESKTOP ──────────────────────────────────────────────────────────────
function TabDesktop({ c }: { c: SchedContent }) {
  const d = c.desktop
  return (
    <div className="space-y-8">
      <TabHeader title={d.title} intro={d.intro} />

      <div className="grid gap-4 md:grid-cols-2">
        <Section title={d.createTitle} icon={<Monitor className="h-5 w-5 text-blue-400" />}>
          <ol className="space-y-2">
            {d.createSteps.map((s, i) => (
              <li key={s} className="flex items-start gap-3 text-sm text-zinc-400">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-blue-500/10 font-mono text-xs font-bold text-blue-400">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
        </Section>
        <Section title={d.fieldsTitle}>
          <CardGrid items={d.fields} cols="grid-cols-1" />
        </Section>
      </div>

      <Section title={d.scheduleTitle} icon={<CalendarClock className="h-5 w-5 text-blue-400" />}>
        <div className="mb-4">
          <CardGrid items={d.schedules} cols="sm:grid-cols-5" />
        </div>
        <CodeBlock code={d.customCode} />
      </Section>

      <Section title={d.runTitle}>
        <Bullets items={d.runItems} />
      </Section>

      <Section title={d.missedTitle}>
        <p className="mb-4 text-sm text-zinc-400">{d.missedDesc}</p>
        <CodeBlock code={d.missedCode} />
      </Section>

      <Section title={d.permTitle}>
        <p className="mb-4 text-sm text-zinc-400">{d.permDesc}</p>
        <TipBox>{d.worktreeNote}</TipBox>
      </Section>

      <div className="grid gap-4 md:grid-cols-2">
        <Section title={d.manageTitle}>
          <Bullets items={d.manageItems} icon="arrow" />
        </Section>
        <Section title={d.diskTitle}>
          <p className="mb-4 text-sm text-zinc-400">{d.diskDesc}</p>
          <CodeBlock code={d.diskCode} label="SKILL.md" />
        </Section>
      </div>
    </div>
  )
}

// ── TAB: ROUTINES (CLOUD) ─────────────────────────────────────────────────────
function TabCloud({ c }: { c: SchedContent }) {
  const r = c.cloud
  return (
    <div className="space-y-8">
      <TabHeader title={r.title} intro={r.intro} />
      <InfoBox>{r.previewNote}</InfoBox>

      <div>
        <h3 className="mb-4 text-lg font-semibold text-white">{r.partsTitle}</h3>
        <CardGrid items={r.parts} cols="sm:grid-cols-2 lg:grid-cols-4" />
      </div>

      <Section title={r.createTitle} icon={<Terminal className="h-5 w-5 text-teal-400" />}>
        <CodeBlock code={r.createCode} />
      </Section>

      <div>
        <h3 className="mb-4 text-lg font-semibold text-white">{r.triggersTitle}</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {r.triggers.map((t, i) => (
            <div key={t.title} className="rounded-xl border border-teal-500/20 bg-teal-500/5 p-4">
              <div className="mb-2 flex items-center gap-2 font-semibold text-teal-400">
                {i === 0 && <CalendarClock className="h-4 w-4" />}
                {i === 1 && <Webhook className="h-4 w-4" />}
                {i === 2 && <GitPullRequest className="h-4 w-4" />}
                {t.title}
              </div>
              <p className="text-xs leading-relaxed text-zinc-400">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <Section title={r.apiTitle} icon={<Webhook className="h-5 w-5 text-teal-400" />}>
        <p className="mb-4 text-sm text-zinc-400">{r.apiDesc}</p>
        <CodeBlock code={r.apiCode} label="bash" />
        <div className="mt-3"><WarnBox>{r.apiWarn}</WarnBox></div>
      </Section>

      <Section title={r.githubTitle} icon={<GitPullRequest className="h-5 w-5 text-teal-400" />}>
        <p className="mb-4 text-sm text-zinc-400">{r.githubDesc}</p>
        <div className="flex flex-wrap gap-2">
          {r.githubFilters.map((f) => (
            <span key={f} className="rounded-md border border-zinc-700 bg-zinc-800/60 px-2.5 py-1 font-mono text-xs text-zinc-300">{f}</span>
          ))}
        </div>
      </Section>

      <Section title={r.manageTitle}>
        <CodeBlock code={r.manageCode} />
      </Section>

      <Section title={r.limitsTitle}>
        <Bullets items={r.limits} icon="arrow" />
      </Section>

      <WarnBox>{r.statusWarn}</WarnBox>
    </div>
  )
}

// ── TAB: EXEMPLE ──────────────────────────────────────────────────────────────
function TabExemple({ c }: { c: SchedContent }) {
  const e = c.examples
  return (
    <div className="space-y-8">
      <TabHeader title={e.title} intro={e.intro} />

      <div className="grid gap-5 lg:grid-cols-2">
        {e.recipes.map((rec) => (
          <div key={rec.title} className="flex flex-col rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
            <div className="mb-3 flex items-start justify-between gap-3">
              <h3 className="font-semibold text-white">{rec.title}</h3>
              <span className={`inline-flex flex-shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${TOOL_STYLE[rec.tool].badge}`}>
                {TOOL_STYLE[rec.tool].icon}{c.toolNames[rec.tool]}
              </span>
            </div>
            <p className="mb-4 flex-1 text-xs text-zinc-500">
              <span className="font-semibold text-zinc-400">{e.whenLabel}: </span>{rec.why}
            </p>
            <CodeBlock code={rec.code} />
          </div>
        ))}
      </div>

      <Section title={e.promptTitle} icon={<Lightbulb className="h-5 w-5 text-amber-400" />}>
        <p className="mb-4 text-sm text-zinc-400">{e.promptDesc}</p>
        <div className="grid gap-4 md:grid-cols-2">
          <CodeBlock code={e.promptGood} />
          <Bullets items={e.promptTips} />
        </div>
      </Section>
    </div>
  )
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
export default function SchedulingGuide() {
  const { lang } = useApp()
  const c = CONTENT[lang]
  const [activeTab, setActiveTab] = useState<TabId>('prezentare')

  const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'prezentare', label: c.tabs[0], icon: <CalendarClock className="h-4 w-4" /> },
    { id: 'loop',       label: c.tabs[1], icon: <Repeat className="h-4 w-4" /> },
    { id: 'desktop',    label: c.tabs[2], icon: <Monitor className="h-4 w-4" /> },
    { id: 'cloud',      label: c.tabs[3], icon: <Cloud className="h-4 w-4" /> },
    { id: 'exemple',    label: c.tabs[4], icon: <ListChecks className="h-4 w-4" /> },
  ]

  const renderTab = () => {
    switch (activeTab) {
      case 'prezentare': return <TabPrezentare c={c} />
      case 'loop':       return <TabLoop c={c} />
      case 'desktop':    return <TabDesktop c={c} />
      case 'cloud':      return <TabCloud c={c} />
      case 'exemple':    return <TabExemple c={c} />
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      {/* Header */}
      <div className="mb-10">
        <div className="mb-3 flex items-center gap-3">
          <div className="rounded-xl bg-teal-500/10 p-2.5">
            <CalendarClock className="h-6 w-6 text-teal-400" />
          </div>
          <span className="rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-400">
            {c.badge}
          </span>
        </div>
        <h1 className="mb-3 text-4xl font-bold text-white">{c.title}</h1>
        <p className="max-w-2xl text-lg leading-relaxed text-zinc-400">{c.desc}</p>
      </div>

      {/* Stats strip */}
      <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {c.stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-teal-500/20 bg-teal-500/5 p-4">
            <div className="text-2xl font-bold text-teal-400">{s.value}</div>
            <div className="mt-0.5 text-sm font-medium text-zinc-300">{s.label}</div>
            <div className="mt-0.5 text-xs text-zinc-600">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Sticky tabs */}
      <div className="sticky top-16 z-10 -mx-6 mb-0 border-b border-zinc-800/60 bg-zinc-950/95 px-6 pb-3 pt-3 backdrop-blur-sm">
        <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'border border-teal-500/30 bg-teal-500/20 text-teal-400'
                  : 'border border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300'
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
