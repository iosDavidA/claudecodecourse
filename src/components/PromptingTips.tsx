import { useState } from 'react'
import {
  BookOpen, Code2, ShieldX, LayoutTemplate,
  CheckCircle, Lightbulb, AlertTriangle,
  Layers, Brain, Tag, RefreshCw, FileText,
  Terminal, Zap, Hash, AtSign, MousePointer, Settings,
  XCircle, Info,
} from 'lucide-react'
import { CodeBlock } from './CodeBlock'
import { useApp } from '../contexts/AppContext'

// ─── Types ───────────────────────────────────────────────────────────────────

type TabId = 'anatomie' | 'interactiune' | 'patternuri' | 'claudemd' | 'antipatterns' | 'template'
type Lang = 'ro' | 'en'

interface Tab { id: TabId; label: string; icon: React.ReactNode }

// ─── Content ─────────────────────────────────────────────────────────────────

const CONTENT = {
  ro: {
    badge: 'Prompting pentru Claude Code',
    title: 'Arta Prompting-ului în Claude Code',
    desc: 'Tehnici specifice arhitecturii agentice a Claude Code — de la anatomia unui prompt eficient la Plan Mode, custom commands, CLAUDE.md și anti-patternuri critice.',
    stats: [
      { value: '4',    label: 'componente COCF',  sub: 'Context, Obiectiv, Constrângeri, Format', color: 'text-amber-400',  border: 'border-amber-500/20 bg-amber-500/5' },
      { value: 'Plan', label: 'Mode — zero cod',  sub: 'Shift+Tab sau /plan înainte de execuție',  color: 'text-purple-400', border: 'border-purple-500/20 bg-purple-500/5' },
      { value: '/cmd', label: 'custom commands',  sub: 'prompturi reutilizabile în .claude/',      color: 'text-blue-400',   border: 'border-blue-500/20 bg-blue-500/5' },
      { value: '10',   label: 'anti-patternuri',  sub: 'cauzele a 90% din frustrări',             color: 'text-red-400',    border: 'border-red-500/20 bg-red-500/5' },
    ],
    tabLabels: {
      anatomie:     'Anatomie',
      interactiune: 'Interacțiune CC',
      patternuri:   'Patternuri',
      claudemd:     'CLAUDE.md',
      antipatterns: 'Anti-patterns',
      template:     'Template-uri',
    },
    diffBadge: { essential: 'Esențial', intermediate: 'Intermediar', advanced: 'Avansat' },
    anatomie: {
      title: 'Anatomia promptului eficient',
      desc: 'Un prompt bun pentru Claude Code are 4 componente. Cu cât sunt mai multe prezente, cu atât rezultatul e mai precis și mai previzibil — mai puțin back-and-forth.',
      cocf: [
        { letter: 'C', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',   name: 'Context',       desc: 'Ce știe Claude: fișierele relevante, framework-ul, eroarea exactă, ce ai deja încercat.' },
        { letter: 'O', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', name: 'Obiectiv',      desc: 'Ce vrei să se întâmple exact: comportamentul dorit, output-ul așteptat, criteriile de succes.' },
        { letter: 'C', color: 'text-red-400 bg-red-500/10 border-red-500/20',      name: 'Constrângeri',  desc: 'Ce NU trebuie atins: fișiere intangibile, API-uri de păstrat, dependențe interzise.' },
        { letter: 'F', color: 'text-green-400 bg-green-500/10 border-green-500/20', name: 'Format',        desc: 'Cum să structureze output-ul: comentarii, teste, pași numerotați, tipuri TypeScript.' },
      ],
      exampleTitle: 'Exemplu complet — framework C.O.C.F. aplicat',
      exampleCode: `# CONTEXT:
# Stack: Next.js 16 App Router + NextAuth v5
# Problemă: utilizatorii rămân logați după ștergerea contului
# Fișiere relevante: lib/auth.ts, app/api/delete-account/route.ts

# OBIECTIV:
Invalidează imediat toate sesiunile active după ștergerea contului.

# CONSTRÂNGERI:
- Nu modifica schema bazei de date
- Păstrează endpoint-ul /api/delete-account neschimbat
- Nu adăuga dependențe noi

# FORMAT:
Modifică fișierele existente cu comentariu scurt
la logica cheie.`,
      exampleChecks: ['Context ✓', 'Obiectiv ✓', 'Constrângeri ✓', 'Format ✓'],
      scaleTitle: 'Câte componente ai nevoie?',
      scale: [
        { components: 'C',         score: 25,  color: 'bg-red-500',    note: 'Rezultate imprevizibile' },
        { components: 'C + O',     score: 50,  color: 'bg-yellow-500', note: 'OK pentru task-uri simple' },
        { components: 'C + O + C', score: 75,  color: 'bg-blue-500',   note: 'Recomandat pentru cod de producție' },
        { components: 'C+O+C+F',   score: 100, color: 'bg-green-500',  note: 'Output precis și predictibil' },
      ],
      vagueLabel: 'Prea vag — Claude ghicește',
      vagueCode: `> fixează bug-ul de login`,
      specificLabel: 'Specific — Claude execută direct',
      specificCode: `> Utilizatorii primesc 401 la POST /api/auth/login.
Verifică middleware/auth.ts linia 42 —
suspectez că JWT_SECRET nu e inclus în
token payload. Păstrează interfața publică.`,
    },
    interactiune: {
      title: 'Interacțiune specifică Claude Code',
      desc: 'Claude Code nu e un chatbot — e un agent cu acces la fișiere, terminal și browsere. Aceste mecanisme sunt unice față de orice alt tool AI și îți dau control precis asupra a ce și cum execută.',
      fileRef: {
        title: 'Referințe de fișiere cu @',
        subtitle: 'Ghidează Claude exact spre codul relevant',
        desc: 'Menționând un fișier în prompt, Claude îl citește automat înainte de a răspunde. Nu mai trebuie să copiezi cod în prompt — Claude știe să citească direct din proiect.',
        explicitLabel: 'Referință explicită',
        explicitCode: `> Citește src/lib/auth.ts și explică
  fluxul de refresh token.

> Compară implementarea din
  src/hooks/useUser.ts cu
  src/hooks/useAuth.ts și
  identifică duplicarea.`,
        lineLabel: 'Referință cu linie specifică',
        lineCode: `> În src/lib/payments.ts, funcția
  processPayment() de la linia 45
  aruncă TypeError. Repară fără
  să schimbi signatura funcției.

> Liniile 120-150 din
  components/Dashboard.tsx au
  un memory leak. Identifică-l.`,
        tip: <>Claude citește automat fișierele menționate. Nu e nevoie de <code className="text-green-300">cat fișier.ts</code> sau de copiat codul — menționează calea și Claude se ocupă.</>,
      },
      planMode: {
        title: 'Plan Mode — aprobă înainte de execuție',
        subtitle: 'Shift+Tab sau /plan — cel mai important mod de lucru',
        desc: <>Plan Mode forțează Claude să descrie exact ce va face — fișiere de modificat, logica propusă, riscuri — <strong className="text-white">înainte</strong> de a scrie o singură linie de cod. Tu aprobi sau respingi planul.</>,
        steps: [
          { step: '01', label: 'Activezi',       desc: 'Shift+Tab (toggle) sau scrii /plan în prompt', icon: <MousePointer className="h-4 w-4" /> },
          { step: '02', label: 'Claude planifică', desc: 'Listează fișiere, abordare, edge cases — fără cod', icon: <Brain className="h-4 w-4" /> },
          { step: '03', label: 'Tu decizi',       desc: 'Aprobi, corectezi planul, sau îl respingi complet', icon: <CheckCircle className="h-4 w-4" /> },
        ],
        code: `# Activare prin /plan în prompt:
> /plan Implementează autentificare Google OAuth.
  Stack: Next.js 16, NextAuth v5, Prisma 7.

# Claude răspunde cu plan, NU cod:
# "Voi modifica:
#   1. lib/auth.ts — adaug Google provider
#   2. middleware.ts — protejez rutele
#   3. .env.example — adaug variabilele necesare
#   Risc: Google Client ID trebuie generat în Console"

# Tu răspunzi:
> Planul arată bine, dar pentru middleware
  folosește matcher pattern în loc de
  liste statice. Implementează.`,
        warn: 'Folosește Plan Mode pentru orice task cu impact pe mai mult de 2 fișiere. Costul unui plan respins e zero — costul unui cod greșit implementat e o sesiune întreagă de remediat.',
      },
      slashCommands: {
        title: 'Custom Slash Commands',
        subtitle: 'Prompturi reutilizabile în .claude/commands/',
        desc: <>Orice fișier <code className="text-amber-400">.md</code> din <code className="text-amber-400">.claude/commands/</code> devine un slash command disponibil în orice sesiune. Elimini repetarea acelorași prompturi pentru task-uri recurente.</>,
        createLabel: 'Creare command',
        createCode: `# Structura de fișiere:
.claude/
  commands/
    bug.md        → /bug
    review.md     → /review
    migrate.md    → /migrate
    test.md       → /test

# Conținut .claude/commands/bug.md:
Analizează bug-ul descris mai jos.
Citește fișierele implicate, identifică
root cause-ul și propune fix minim.

Format răspuns:
- Root cause (1 linie)
- Fix propus cu justificare
- Fișiere de modificat
- Riscuri ale fix-ului

Bug: $ARGUMENTS`,
        useLabel: 'Utilizare în sesiune',
        useCode: `# Utilizezi cu:
> /bug Utilizatorii primesc 401 la login
  dupa refresh token. Stack: Next.js,
  NextAuth v5. Fișier: lib/auth.ts

# Sau pentru review:
> /review src/app/api/payments/route.ts
  Focus: securitate și error handling

# Project-level commands (shared cu echipa):
.claude/commands/     # în repo, versionat

# User-level commands (personale):
~/.claude/commands/   # global, orice proiect`,
      },
      memory: {
        title: 'Quick Memory cu #',
        subtitle: 'Salvează fapte în CLAUDE.md din conversație',
        desc: <>Prefixul <code className="text-green-400">#</code> la începutul unui mesaj îi spune lui Claude să salveze informația respectivă în CLAUDE.md pentru sesiunile viitoare — fără să întrerupă fluxul de lucru.</>,
        code: `# Salvează o decizie arhitecturală:
> # Folosim cursor-based pagination peste tot,
  nu offset. Motiv: performanță pe tabele mari.

# Salvează o convenție:
> # Toate API routes returnează { data, error }
  niciodată null direct.

# Salvează un context de proiect:
> # Proiectul are 3 environments: dev, staging, prod.
  DB-ul de staging se resetează zilnic.

# Claude confirmă și adaugă în CLAUDE.md automat.
# La sesiunile viitoare, știe deja aceste detalii.`,
        info: <>Combină <code className="text-blue-300">#</code> memory cu CLAUDE.md manual pentru un sistem complet: <code className="text-blue-300">#</code> pentru decizii descoperite în sesiune, CLAUDE.md pentru reguli fundamentale scrise deliberat.</>,
      },
      steering: {
        title: 'Steering mid-execuție',
        subtitle: 'Esc → redirectare, fără să pierzi progresul',
        desc: <>Claude Code e agentic — execută pași autonomi. Dacă observi că merge într-o direcție greșită, poți întrerupe cu <kbd className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs text-zinc-300">Esc</kbd> și corecta fără să pierzi contextul acumulat.</>,
        scenarios: [
          { scenario: 'Înainte de o modificare periculoasă', action: 'Esc', followup: '> Nu modifica schema Prisma — rezolvă fără migrare.', color: 'border-red-500/20 bg-red-500/5' },
          { scenario: 'Claude citește prea multe fișiere',   action: 'Esc', followup: '> Concentrează-te doar pe src/lib/auth.ts, nu e nevoie de restul.', color: 'border-amber-500/20 bg-amber-500/5' },
          { scenario: 'Abordarea aleasă nu e cea dorită',    action: 'Esc', followup: '> Oprește. Folosește strategia B cu Redis, nu soluția cu în-memory cache.', color: 'border-blue-500/20 bg-blue-500/5' },
        ],
      },
      xml: {
        title: 'XML pentru prompturi complexe',
        subtitle: 'Structurare semantică pentru task-uri multi-parte',
        desc: 'Claude a fost antrenat extensiv cu XML și interpretează tag-urile ca delimitatori semantici. Un prompt în XML e mai precis și mai puțin ambiguu decât text liber, mai ales pentru task-uri cu mai multe componente.',
        freeLabel: 'Text liber — ambiguu',
        freeCode: `> Avem Next.js cu Prisma. Vreau OAuth
  cu Google. Nu modifica schema DB.
  Folosește next-auth. Adaugă middleware.`,
        xmlLabel: 'XML — precis și structurat',
        xmlCode: `> <context>
  Next.js 16 App Router, Prisma 7,
  autentificare inexistentă momentan
</context>
<task>
  Implementează OAuth Google cu next-auth v5
</task>
<constraints>
  <never>Modifica schema Prisma</never>
  <never>Adaugă dependențe în afara next-auth</never>
</constraints>
<deliverables>
  <file>lib/auth.ts — config NextAuth</file>
  <file>middleware.ts — rute protejate</file>
</deliverables>`,
      },
    },
    patternuri: {
      title: 'Patternuri pentru development',
      desc: <>Template-uri testate pentru scenariile cele mai frecvente. Copiază, completează câmpurile marcate cu <code className="text-amber-400">[ ]</code> și trimite direct.</>,
      templateLabel: 'Template prompt',
      resultLabel: 'Ce face Claude',
      cards: [
        {
          title: 'Bug Fix Pattern',
          desc: 'Template complet cu tot contextul. Cu cât mai mult context, cu atât mai puțin back-and-forth.',
          template: `Comportament așteptat:
[Ce ar trebui să se întâmple]

Comportament actual:
[Ce se întâmplă + eroarea exactă]

Pași de reproducere:
1. [Pasul 1]
2. [Pasul 2]

Fișiere implicate:
- [cale/fișier.ts] — [rolul lui]

Am încercat deja:
[Ce ai testat fără succes]

Constrângeri:
- Nu modifica [X]`,
          result: `✓ Citește fișierele menționate
✓ Identifică root cause-ul
✓ Propune fix minim și precis
✓ Explică de ce s-a produs bug-ul`,
        },
        {
          title: 'Feature Request Pattern',
          desc: 'User story + comportament tehnic + edge cases — evită iterații suplimentare.',
          template: `Feature: [Titlu scurt]

User story:
Ca [tip utilizator], vreau să [acțiune]
pentru a [beneficiu].

Comportament tehnic:
- [Detaliu 1]
- [Detaliu 2]

Fișiere de creat/modificat:
- [fișier nou sau existent]

Edge cases:
- [Cazul special 1]
- [Cazul special 2]

INTERZIS:
- Nu adăuga [X]
- Păstrează [Y] neschimbat`,
          result: `✓ Planifică implementarea
✓ Identifică toate fișierele afectate
✓ Gestionează edge cases specificate
✓ Rămâne în limitele constrângerilor`,
        },
        {
          title: 'Refactoring Pattern',
          desc: 'Refactorizări sigure care nu schimbă comportamentul. Constrângerile fac Claude conservator.',
          template: `Refactorizează [funcție/componentă]
din [cale/fișier.ts].

Motivație:
[Ex: cod duplicat, complexitate mare]

Obiectiv specific:
[Ex: extrage logica X într-un helper,
reduce complexitatea ciclomatică]

PĂSTREAZĂ INTACT (obligatoriu):
- Interfața publică (tipuri, parametri)
- Comportamentul observabil extern
- [Altele critice]

Verificare: după refactorizare rulează
[ex: npx tsc --noEmit && npm test]`,
          result: `✓ Citește codul existent complet
✓ Refactorizează fără a schimba API-ul
✓ Menține toate comportamentele
✓ Rulează verificarea specificată`,
        },
        {
          title: 'Code Review Pattern',
          desc: 'Review structurat cu focus specific — mai eficient decât /review generic.',
          template: `Review pe [fișier/funcție].

Context PR:
[Ce face schimbarea și de ce]

Focus pe:
☐ Securitate (OWASP Top 10)
☐ Type safety (no any, nulls)
☐ Error handling (try/catch)
☐ Performance (N+1, memory leaks)
☐ Consistență cu CLAUDE.md

Format:
🔴 CRITIC — blochează merge-ul
🟡 WARNING — necesită discuție
🟢 SUGESTIE — opțional`,
          result: `✓ Issues grupate pe severitate
✓ Line numbers specifice
✓ Sugestii concrete de fix
✓ Justificare pentru fiecare issue`,
        },
        {
          title: 'Architecture Consultation Pattern',
          desc: 'Analiză înainte de implementare. Plan Mode îl împiedică să scrie cod prematur.',
          template: `[Activează Plan Mode: Shift+Tab sau /plan]

Vreau să implementez [feature/sistem].

Context tehnic:
- Stack: [tehnologii]
- Scală: [utilizatori/date estimate]
- Constrângeri: [timp, complexitate]

Opțiuni la care mă gândesc:
A) [Opțiunea A] — [scurtă descriere]
B) [Opțiunea B] — [scurtă descriere]

Întrebări:
1. Care e mai ușor de menținut?
2. Cum afectează performanța?

IMPORTANT: Nu scrie cod. Analizează.`,
          result: `✓ Analizează obiectiv fiecare opțiune
✓ Listează pro/contra concret
✓ Recomandă cu justificare clară
✓ NU scrie cod fără aprobare`,
        },
        {
          title: 'Test Generation Pattern',
          desc: 'Generare de teste cu coverage complet. Specifică ce nu trebuie mockat.',
          template: `Generează teste pentru [funcție/componentă]
din [cale/fișier.ts].

Framework: [Vitest / Jest / Playwright]
Tip: [unit / integrare / e2e]

Cazuri obligatorii:
1. Happy path: [fluxul normal]
2. Error cases: [erori așteptate]
3. Edge cases: [null, empty, extremes]

Mock-uri necesare:
- [DB / API extern / timer]

NU mocka:
- [Ex: baza de date în teste de integrare]

Naming: describe('[fn]'), it('should...')`,
          result: `✓ Citește implementarea existentă
✓ Generează toate cazurile cerute
✓ Adaugă mocks corecte
✓ Respectă convențiile de naming`,
        },
      ],
    },
    claudemd: {
      title: 'CLAUDE.md — System Prompt Persistent',
      desc: 'CLAUDE.md este automat inclus la fiecare sesiune nouă — e practic un system prompt permanent. Un CLAUDE.md bine scris elimină 80% din prompturile repetitive și asigură consistența pe termen lung, indiferent cine din echipă lucrează.',
      hierarchyTitle: 'Ierarhia CLAUDE.md',
      hierarchyDesc: 'Claude citește CLAUDE.md ierarhic — de la global la local. Fișierele locale pot suprascrie sau completa regulile globale.',
      hierarchy: [
        { path: '~/.claude/CLAUDE.md',       label: 'Global — personal',   desc: 'Preferințe personale, tools preferate, stilul de cod. Nu e versionat.', color: 'border-purple-500/20 bg-purple-500/5', badge: 'text-purple-400 bg-purple-500/10' },
        { path: 'project/CLAUDE.md',          label: 'Proiect — shared',    desc: 'Reguli de proiect, stack tehnic, convenții. Versionat în repo — toată echipa îl primește.', color: 'border-amber-500/20 bg-amber-500/5', badge: 'text-amber-400 bg-amber-500/10' },
        { path: 'project/src/api/CLAUDE.md',  label: 'Subdirector — local', desc: 'Reguli specifice modulului. Încărcat doar când lucrezi în acel subdirector.', color: 'border-blue-500/20 bg-blue-500/5', badge: 'text-blue-400 bg-blue-500/10' },
      ],
      hierarchyInfo: 'Subdirectoarele cu CLAUDE.md propriu sunt ideale pentru monorepo-uri — regulile de frontend nu se încarcă când lucrezi pe backend și invers. Economisești tokeni și reduci zgomotul.',
      structureTitle: 'Structura unui CLAUDE.md eficient',
      weakLabel: 'CLAUDE.md slab',
      weakCode: `# Proiect
Utilizează TypeScript.
Folosește Prisma pentru baza de date.
Baza de date este PostgreSQL.`,
      weakNote: 'Prea generic. Nu ajută Claude să ia decizii specifice.',
      strongLabel: 'CLAUDE.md puternic',
      strongCode: `# Stack: Next.js 16 + Prisma 7 + Neon

## Reguli stricte
- No \`any\` — niciodată, folosește unknown
- IDs sunt string (cuid), nu number
- Prețuri ca Float în DB, formatPrice() display
- import db DOAR din @/lib/db

## Error handling obligatoriu
Orice async → try/catch
API routes → { error: '...' } cu status HTTP

## Ce NU faci fără să întrebi
- Nu șterge cod funcțional
- Nu adaugă dependențe noi
- Nu modifici schema Prisma

## Cum rulezi dev
npm run dev (port 3001)`,
      importTitle: 'Import de fișiere în CLAUDE.md',
      importDesc: <>Poți include alte fișiere în CLAUDE.md cu sintaxa <code className="text-amber-400">@path/to/file</code>. Util pentru a include schema Prisma, exemple de cod sau documente tehnice fără a le duplica.</>,
      importCode: `# CLAUDE.md cu imports

## Schema bazei de date
@prisma/schema.prisma

## Exemple de API routes corecte
@docs/api-examples.md

## Tipuri globale
@src/types/global.d.ts

# Claude va citi automat fișierele incluse
# la fiecare sesiune nouă.`,
      importTip: <>Nu include fișiere mari (sute de linii) în CLAUDE.md — se adaugă la <strong className="text-green-300">fiecare request</strong> ca input tokens. Include doar ce e cu adevărat necesar pentru deciziile de cod zilnice.</>,
      sectionsTitle: 'Secțiuni recomandate',
      sections: [
        { section: 'Stack tehnic',          desc: 'Framework, versiuni, librării cheie și motivul alegerii lor',           must: true },
        { section: 'Reguli de cod',          desc: 'Tipuri obligatorii, pattern-uri de import, naming conventions',          must: true },
        { section: 'Error handling',         desc: 'Cum se gestionează erorile în proiect (API routes, async, etc.)',        must: true },
        { section: 'Ce NU face Claude',      desc: 'Restricții explicite: cod care nu se șterge, fișiere intangibile',       must: true },
        { section: 'Comenzi dev',            desc: 'npm run dev, build, test — Claude le rulează automat când e nevoie',     must: false },
        { section: 'Structura proiectului',  desc: 'Unde stau paginile, componentele, hooks — ghid rapid de navigare',      must: false },
        { section: 'Convenții de commit',    desc: 'Format conventional commits, branch naming dacă e relevant',             must: false },
        { section: 'Decizii arhitecturale',  desc: 'De ce e ales X față de Y — evită întrebări repetitive',                 must: false },
      ],
    },
    antipatterns: {
      title: 'Anti-patternuri Claude Code',
      desc: 'Acestea sunt cauzele a 90% din frustrările cu Claude Code. Toate au soluție simplă — recunoaște-le înainte de a trimite promptul.',
      problemLabel: 'Problemă',
      solutionLabel: 'Soluție',
      cards: [
        { number: '01', title: 'Prompt vag fără context', bad: `fixează bug-ul de autentificare`, fix: `Utilizatorii primesc 401 la POST /api/auth/login.\nVerifică middleware/auth.ts linia 42 —\nsuspectez că JWT nu include "role".\nPăstrează interfața funcției.`, why: 'Claude nu știe ce bug, unde e, sau comportamentul așteptat. Descrie simptomul, nu diagnosticul.' },
        { number: '02', title: 'Task-uri multiple simultan', bad: `refactorizează codul și adaugă teste\nși fixează performanța și actualizează docs`, fix: `Pasul 1: Refactorizează fetchUsers()\ndin lib/api.ts — extrage paginarea.\n\n[Verifici, abia apoi:]\nPasul 2: Adaugă teste pentru helper.`, why: 'Claude poate omite sub-task-uri sau le face superficial. Un task per mesaj, maximum.' },
        { number: '03', title: 'Fără Plan Mode pe task-uri mari', bad: `implementează sistem de notificări\ncu email, push și in-app`, fix: `/plan Implementează sistem notificări:\nemail (Resend), push (Firebase),\nin-app (DB). Stack: Next.js + Prisma.\nListează fișierele afectate.`, why: 'Fără plan, Claude poate implementa 3 ore de cod în direcția greșită. Plan Mode costă 30 de secunde.' },
        { number: '04', title: 'Fără constrângeri pe cod existent', bad: `adaugă cache la funcția getUsers()`, fix: `Adaugă cache Redis la getUsers()\ndin lib/users.ts.\n\nPăstrează intact:\n- Signatura funcției (parametri, return)\n- Comportamentul cu DB offline\n- Toate apelurile existente`, why: 'Fără constrângeri, Claude poate redenumi, refactoriza cod adiacent sau schimba signatura.' },
        { number: '05', title: 'Sesiune poluată cu context vechi', bad: `[după 30+ mesaje și 3 feature-uri]\nrefactorizează autentificarea`, fix: `/clear\n\n[Sesiune nouă:]\nRefactorizează auth flow din\nmiddleware.ts + lib/auth.ts.\nContext: [descriere fresh]`, why: 'O sesiune lungă acumulează contradicții. Claude poate folosi decizii vechi irelevante pentru noul task.' },
        { number: '06', title: 'ultrathink pe task-uri simple', bad: `ultrathink adaugă câmpul\n"updatedAt" la modelul User`, fix: `Adaugă câmpul updatedAt DateTime\n@updatedAt la modelul User din\nprisma/schema.prisma.`, why: 'ultrathink cere raționament maxim pe tura respectivă — plătești mult mai mulți tokeni de output. Rezervă-l pentru probleme cu impact arhitectural real.' },
        { number: '07', title: 'Fără menționarea stack-ului', bad: `adaugă autentificare la proiect`, fix: `Stack: Next.js 16 App Router\nORM: Prisma 7, DB: Neon\nInstalat deja: next-auth@5\n\nAdaugă OAuth Google.\nNu adăuga alte dependențe.`, why: 'Claude poate alege o librărie incompatibilă sau o abordare care se bate cu ce ai deja instalat.' },
        { number: '08', title: 'Nu verifici diff-ul înainte de accept', bad: `[Acceptă automat toate modificările\nfără a citi diff-ul]`, fix: `Înainte de a continua, afișează\nun summary al fișierelor modificate\nși ce s-a schimbat în fiecare.`, why: 'Claude poate face modificări colaterale neanticipate. Verifică întotdeauna diff-ul înainte de commit.' },
        { number: '09', title: 'Cerere de "îmbunătățire" fără criterii', bad: `îmbunătățește această componentă`, fix: `Îmbunătățește UserCard.tsx:\n- Reduce re-render-uri cu memo()\n- Extrage formatDate() într-un helper\n- Adaugă loading skeleton\nNu schimba props-urile existente.`, why: '"Îmbunătățire" e subiectivă. Claude va face modificări arbitrare care pot strica alte lucruri.' },
        { number: '10', title: 'Ignorezi CLAUDE.md sau nu îl ai', bad: `[Fiecare sesiune începi cu:\n"Proiectul folosește Next.js, TypeScript strict,\nPrisma, no any, prețuri ca Float..."]`, fix: `# Scrie o singură dată în CLAUDE.md:\nStack: Next.js 16, Prisma 7, Neon\nNo any. IDs string. Prețuri Float.\nImportă db din @/lib/db.\n\n# Și nu mai repeți niciodată.`, why: 'Fără CLAUDE.md, repeți contextul în fiecare sesiune. Investiția de 30 de minute se amortizează în zile.' },
      ],
    },
    template: {
      title: 'Template-uri gata de folosit',
      desc: <>Completează câmpurile între <code className="text-amber-400">[ ]</code> și trimite direct. Salvează-le în <code className="text-amber-400">.claude/commands/</code> pentru acces rapid cu slash commands.</>,
      saveTip: 'Salvează template-urile ca custom commands',
      saveTipDesc: <>Pune fiecare template într-un fișier <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs text-amber-400">.claude/commands/</code> și devine disponibil instant ca slash command în orice sesiune.</>,
      saveCode: `mkdir -p .claude/commands

# Salvează template-ul bug fix:
cp bug-template.md .claude/commands/bug.md

# Utilizare imediată în sesiune:
> /bug Utilizatorii primesc 401 la login
  după refresh token. Fișier: lib/auth.ts

# Versionează .claude/commands/ în git
# — toată echipa beneficiază de aceleași comenzi`,
      cards: [
        {
          title: '🐛 Bug Fix Complet',
          subtitle: 'Pentru orice bug de producție',
          code: `# Comportament așteptat:
[Ce ar trebui să se întâmple]

# Comportament actual:
[Ce se întâmplă + eroarea exactă]

# Pași de reproducere:
1. [Navighez la URL]
2. [Execut acțiunea X]
3. [Se produce eroarea]

# Fișiere implicate:
- [cale/fișier.ts] — [de ce e relevant]

# Am încercat deja:
[Ce ai testat fără succes]

# Constrângeri:
- Nu modifica [X]
- Păstrează [Y]`,
        },
        {
          title: '✨ Feature Nouă',
          subtitle: 'Cu user story și edge cases',
          code: `# Feature: [Titlu]

# User story:
Ca [tip utilizator],
vreau să [acțiune]
pentru a [beneficiu].

# Comportament tehnic:
- [Detaliu 1]
- [Detaliu 2]

# Fișiere de creat/modificat:
- [fișier]

# Edge cases:
- [Cazul special 1]
- [Cazul special 2]

# INTERZIS:
- [Ce nu ai voie să atingi]`,
        },
        {
          title: '🔄 Refactoring Sigur',
          subtitle: 'Fără modificarea comportamentului',
          code: `# Refactorizează:
[funcție/componentă] din [fișier.ts]

# Motivație:
[De ce — ex: cod duplicat, complexitate]

# Obiectiv specific:
[Ex: extrage helper, reduce nesting]

# PĂSTREAZĂ INTACT (OBLIGATORIU):
- Interfața publică (tipuri, parametri)
- Comportamentul observabil
- [Altele critice]

# Verificare:
[ex: npm test && npx tsc --noEmit]`,
        },
        {
          title: '🔍 Code Review Structurat',
          subtitle: 'Cu focus și severitate',
          code: `# Review [fișier sau PR #N]

# Context PR:
[Ce face schimbarea și de ce]

# Focus pe:
☐ Securitate (OWASP Top 10)
☐ Type safety (no any, nulls)
☐ Error handling (try/catch)
☐ Performance (N+1, memory)
☐ Consistență cu CLAUDE.md

# Format:
🔴 CRITIC → [fix concret]
🟡 WARNING → [sugestie]
🟢 NICE-TO-HAVE → [observație]`,
        },
        {
          title: '🏗️ Consultare Arhitecturală',
          subtitle: 'Decizie înainte de implementare',
          code: `[Activează Plan Mode: Shift+Tab]

# Vreau să implementez:
[Feature/sistem complex]

# Context tehnic:
- Stack: [tehnologii]
- Scală: [dimensiunea aplicației]
- Constrângeri: [timp, complexitate]

# Opțiuni:
A) [Opțiunea A]
B) [Opțiunea B]

# IMPORTANT: Nu scrie cod.
# Analizează și recomandă.`,
        },
        {
          title: '🧪 Generare Teste',
          subtitle: 'Coverage complet cu edge cases',
          code: `# Generează teste pentru:
[funcție] din [fișier.ts]

# Framework: [Vitest/Jest]
# Tip: [unit / integrare]

# Cazuri obligatorii:
1. Happy path: [fluxul normal]
2. Error: [erori așteptate]
3. Edge: [null, empty, extremes]

# Mock-uri:
- [DB / API extern]

# NU mocka:
- [baza de date în integrare]`,
        },
      ],
    },
  },
  en: {
    badge: 'Prompting for Claude Code',
    title: 'The Art of Prompting in Claude Code',
    desc: 'Techniques specific to Claude Code\'s agentic architecture — from the anatomy of an effective prompt to Plan Mode, custom commands, CLAUDE.md and critical anti-patterns.',
    stats: [
      { value: '4',    label: 'COCF components',  sub: 'Context, Objective, Constraints, Format', color: 'text-amber-400',  border: 'border-amber-500/20 bg-amber-500/5' },
      { value: 'Plan', label: 'Mode — zero code', sub: 'Shift+Tab or /plan before execution',      color: 'text-purple-400', border: 'border-purple-500/20 bg-purple-500/5' },
      { value: '/cmd', label: 'custom commands',  sub: 'reusable prompts in .claude/',             color: 'text-blue-400',   border: 'border-blue-500/20 bg-blue-500/5' },
      { value: '10',   label: 'anti-patterns',    sub: 'causes of 90% of frustrations',            color: 'text-red-400',    border: 'border-red-500/20 bg-red-500/5' },
    ],
    tabLabels: {
      anatomie:     'Anatomy',
      interactiune: 'CC Interaction',
      patternuri:   'Patterns',
      claudemd:     'CLAUDE.md',
      antipatterns: 'Anti-patterns',
      template:     'Templates',
    },
    diffBadge: { essential: 'Essential', intermediate: 'Intermediate', advanced: 'Advanced' },
    anatomie: {
      title: 'Anatomy of an effective prompt',
      desc: 'A good Claude Code prompt has 4 components. The more present, the more precise and predictable the result — less back-and-forth.',
      cocf: [
        { letter: 'C', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',   name: 'Context',      desc: 'What Claude knows: relevant files, framework, exact error, what you\'ve already tried.' },
        { letter: 'O', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', name: 'Objective',    desc: 'What you want to happen exactly: desired behavior, expected output, success criteria.' },
        { letter: 'C', color: 'text-red-400 bg-red-500/10 border-red-500/20',      name: 'Constraints',  desc: 'What must NOT be touched: off-limits files, APIs to preserve, forbidden dependencies.' },
        { letter: 'F', color: 'text-green-400 bg-green-500/10 border-green-500/20', name: 'Format',       desc: 'How to structure the output: comments, tests, numbered steps, TypeScript types.' },
      ],
      exampleTitle: 'Full example — C.O.C.F. framework applied',
      exampleCode: `# CONTEXT:
# Stack: Next.js 16 App Router + NextAuth v5
# Problem: users remain logged in after account deletion
# Relevant files: lib/auth.ts, app/api/delete-account/route.ts

# OBJECTIVE:
Immediately invalidate all active sessions after account deletion.

# CONSTRAINTS:
- Do not modify the database schema
- Keep the /api/delete-account endpoint unchanged
- Do not add new dependencies

# FORMAT:
Modify existing files with a short comment
at the key logic.`,
      exampleChecks: ['Context ✓', 'Objective ✓', 'Constraints ✓', 'Format ✓'],
      scaleTitle: 'How many components do you need?',
      scale: [
        { components: 'C',         score: 25,  color: 'bg-red-500',    note: 'Unpredictable results' },
        { components: 'C + O',     score: 50,  color: 'bg-yellow-500', note: 'OK for simple tasks' },
        { components: 'C + O + C', score: 75,  color: 'bg-blue-500',   note: 'Recommended for production code' },
        { components: 'C+O+C+F',   score: 100, color: 'bg-green-500',  note: 'Precise and predictable output' },
      ],
      vagueLabel: 'Too vague — Claude guesses',
      vagueCode: `> fix the login bug`,
      specificLabel: 'Specific — Claude executes directly',
      specificCode: `> Users get 401 on POST /api/auth/login.
Check middleware/auth.ts line 42 —
I suspect JWT_SECRET is not included in
the token payload. Keep the public interface.`,
    },
    interactiune: {
      title: 'Claude Code-specific interaction',
      desc: 'Claude Code is not a chatbot — it\'s an agent with access to files, terminal and browsers. These mechanisms are unique compared to any other AI tool and give you precise control over what and how it executes.',
      fileRef: {
        title: 'File references with @',
        subtitle: 'Guide Claude exactly to the relevant code',
        desc: 'By mentioning a file in the prompt, Claude reads it automatically before responding. No need to copy code into the prompt — Claude knows how to read directly from the project.',
        explicitLabel: 'Explicit reference',
        explicitCode: `> Read src/lib/auth.ts and explain
  the refresh token flow.

> Compare the implementation in
  src/hooks/useUser.ts with
  src/hooks/useAuth.ts and
  identify the duplication.`,
        lineLabel: 'Reference with specific line',
        lineCode: `> In src/lib/payments.ts, the
  processPayment() function at line 45
  throws a TypeError. Fix it without
  changing the function signature.

> Lines 120-150 in
  components/Dashboard.tsx have
  a memory leak. Identify it.`,
        tip: <>Claude reads the mentioned files automatically. No need for <code className="text-green-300">cat file.ts</code> or copying code — mention the path and Claude handles it.</>,
      },
      planMode: {
        title: 'Plan Mode — approve before execution',
        subtitle: 'Shift+Tab or /plan — the most important working mode',
        desc: <>Plan Mode forces Claude to describe exactly what it will do — files to modify, proposed logic, risks — <strong className="text-white">before</strong> writing a single line of code. You approve or reject the plan.</>,
        steps: [
          { step: '01', label: 'Activate',       desc: 'Shift+Tab (toggle) or type /plan in the prompt', icon: <MousePointer className="h-4 w-4" /> },
          { step: '02', label: 'Claude plans',   desc: 'Lists files, approach, edge cases — no code',    icon: <Brain className="h-4 w-4" /> },
          { step: '03', label: 'You decide',     desc: 'Approve, correct the plan, or reject it entirely', icon: <CheckCircle className="h-4 w-4" /> },
        ],
        code: `# Activate via /plan in the prompt:
> /plan Implement Google OAuth authentication.
  Stack: Next.js 16, NextAuth v5, Prisma 7.

# Claude responds with a plan, NOT code:
# "I will modify:
#   1. lib/auth.ts — add Google provider
#   2. middleware.ts — protect routes
#   3. .env.example — add required variables
#   Risk: Google Client ID must be generated in Console"

# You respond:
> The plan looks good, but for middleware
  use a matcher pattern instead of
  static lists. Implement it.`,
        warn: 'Use Plan Mode for any task affecting more than 2 files. The cost of a rejected plan is zero — the cost of wrongly implemented code is an entire session to remediate.',
      },
      slashCommands: {
        title: 'Custom Slash Commands',
        subtitle: 'Reusable prompts in .claude/commands/',
        desc: <>Any <code className="text-amber-400">.md</code> file in <code className="text-amber-400">.claude/commands/</code> becomes a slash command available in any session. Eliminates repeating the same prompts for recurring tasks.</>,
        createLabel: 'Create command',
        createCode: `# File structure:
.claude/
  commands/
    bug.md        → /bug
    review.md     → /review
    migrate.md    → /migrate
    test.md       → /test

# Content of .claude/commands/bug.md:
Analyze the bug described below.
Read the involved files, identify
the root cause and propose a minimal fix.

Response format:
- Root cause (1 line)
- Proposed fix with justification
- Files to modify
- Risks of the fix

Bug: $ARGUMENTS`,
        useLabel: 'Usage in session',
        useCode: `# Use with:
> /bug Users get 401 at login
  after refresh token. Stack: Next.js,
  NextAuth v5. File: lib/auth.ts

# Or for review:
> /review src/app/api/payments/route.ts
  Focus: security and error handling

# Project-level commands (shared with team):
.claude/commands/     # in repo, versioned

# User-level commands (personal):
~/.claude/commands/   # global, any project`,
      },
      memory: {
        title: 'Quick Memory with #',
        subtitle: 'Save facts to CLAUDE.md from conversation',
        desc: <>The <code className="text-green-400">#</code> prefix at the start of a message tells Claude to save that information in CLAUDE.md for future sessions — without interrupting the workflow.</>,
        code: `# Save an architectural decision:
> # We use cursor-based pagination everywhere,
  not offset. Reason: performance on large tables.

# Save a convention:
> # All API routes return { data, error }
  never null directly.

# Save project context:
> # The project has 3 environments: dev, staging, prod.
  The staging DB resets daily.

# Claude confirms and adds to CLAUDE.md automatically.
# In future sessions, it already knows these details.`,
        info: <>Combine <code className="text-blue-300">#</code> memory with manual CLAUDE.md for a complete system: <code className="text-blue-300">#</code> for decisions discovered in session, CLAUDE.md for fundamental rules written deliberately.</>,
      },
      steering: {
        title: 'Steering mid-execution',
        subtitle: 'Esc → redirect, without losing progress',
        desc: <>Claude Code is agentic — it executes steps autonomously. If you notice it going in the wrong direction, you can interrupt with <kbd className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs text-zinc-300">Esc</kbd> and correct without losing accumulated context.</>,
        scenarios: [
          { scenario: 'Before a dangerous modification', action: 'Esc', followup: '> Don\'t modify the Prisma schema — solve it without migration.', color: 'border-red-500/20 bg-red-500/5' },
          { scenario: 'Claude reads too many files',     action: 'Esc', followup: '> Focus only on src/lib/auth.ts, no need for the rest.', color: 'border-amber-500/20 bg-amber-500/5' },
          { scenario: 'The chosen approach is not desired', action: 'Esc', followup: '> Stop. Use strategy B with Redis, not the in-memory cache solution.', color: 'border-blue-500/20 bg-blue-500/5' },
        ],
      },
      xml: {
        title: 'XML for complex prompts',
        subtitle: 'Semantic structuring for multi-part tasks',
        desc: 'Claude has been extensively trained with XML and interprets tags as semantic delimiters. An XML prompt is more precise and less ambiguous than free text, especially for tasks with multiple components.',
        freeLabel: 'Free text — ambiguous',
        freeCode: `> We have Next.js with Prisma. I want OAuth
  with Google. Don't modify the DB schema.
  Use next-auth. Add middleware.`,
        xmlLabel: 'XML — precise and structured',
        xmlCode: `> <context>
  Next.js 16 App Router, Prisma 7,
  no authentication currently
</context>
<task>
  Implement Google OAuth with next-auth v5
</task>
<constraints>
  <never>Modify Prisma schema</never>
  <never>Add dependencies outside next-auth</never>
</constraints>
<deliverables>
  <file>lib/auth.ts — NextAuth config</file>
  <file>middleware.ts — protected routes</file>
</deliverables>`,
      },
    },
    patternuri: {
      title: 'Patterns for development',
      desc: <>Tested templates for the most common scenarios. Copy, fill in the fields marked with <code className="text-amber-400">[ ]</code> and send directly.</>,
      templateLabel: 'Prompt template',
      resultLabel: 'What Claude does',
      cards: [
        {
          title: 'Bug Fix Pattern',
          desc: 'Complete template with full context. The more context, the less back-and-forth.',
          template: `Expected behavior:
[What should happen]

Actual behavior:
[What happens + exact error]

Reproduction steps:
1. [Step 1]
2. [Step 2]

Involved files:
- [path/file.ts] — [its role]

Already tried:
[What you tested without success]

Constraints:
- Do not modify [X]`,
          result: `✓ Reads the mentioned files
✓ Identifies the root cause
✓ Proposes a minimal and precise fix
✓ Explains why the bug occurred`,
        },
        {
          title: 'Feature Request Pattern',
          desc: 'User story + technical behavior + edge cases — avoids additional iterations.',
          template: `Feature: [Short title]

User story:
As a [user type], I want to [action]
so that [benefit].

Technical behavior:
- [Detail 1]
- [Detail 2]

Files to create/modify:
- [new or existing file]

Edge cases:
- [Special case 1]
- [Special case 2]

FORBIDDEN:
- Do not add [X]
- Keep [Y] unchanged`,
          result: `✓ Plans the implementation
✓ Identifies all affected files
✓ Handles specified edge cases
✓ Stays within constraints`,
        },
        {
          title: 'Refactoring Pattern',
          desc: 'Safe refactoring that doesn\'t change behavior. Constraints make Claude conservative.',
          template: `Refactor [function/component]
from [path/file.ts].

Motivation:
[E.g.: duplicated code, high complexity]

Specific objective:
[E.g.: extract logic X into a helper,
reduce cyclomatic complexity]

KEEP INTACT (mandatory):
- Public interface (types, parameters)
- Externally observable behavior
- [Other critical items]

Verification: after refactoring run
[e.g.: npx tsc --noEmit && npm test]`,
          result: `✓ Reads the existing code fully
✓ Refactors without changing the API
✓ Maintains all behaviors
✓ Runs the specified verification`,
        },
        {
          title: 'Code Review Pattern',
          desc: 'Structured review with specific focus — more effective than generic /review.',
          template: `Review on [file/function].

PR context:
[What the change does and why]

Focus on:
☐ Security (OWASP Top 10)
☐ Type safety (no any, nulls)
☐ Error handling (try/catch)
☐ Performance (N+1, memory leaks)
☐ Consistency with CLAUDE.md

Format:
🔴 CRITICAL — blocks merge
🟡 WARNING — needs discussion
🟢 SUGGESTION — optional`,
          result: `✓ Issues grouped by severity
✓ Specific line numbers
✓ Concrete fix suggestions
✓ Justification for each issue`,
        },
        {
          title: 'Architecture Consultation Pattern',
          desc: 'Analysis before implementation. Plan Mode prevents premature code writing.',
          template: `[Activate Plan Mode: Shift+Tab or /plan]

I want to implement [feature/system].

Technical context:
- Stack: [technologies]
- Scale: [estimated users/data]
- Constraints: [time, complexity]

Options I'm considering:
A) [Option A] — [brief description]
B) [Option B] — [brief description]

Questions:
1. Which is easier to maintain?
2. How does it affect performance?

IMPORTANT: Do not write code. Analyze.`,
          result: `✓ Objectively analyzes each option
✓ Lists concrete pros/cons
✓ Recommends with clear justification
✓ Does NOT write code without approval`,
        },
        {
          title: 'Test Generation Pattern',
          desc: 'Test generation with full coverage. Specify what must not be mocked.',
          template: `Generate tests for [function/component]
from [path/file.ts].

Framework: [Vitest / Jest / Playwright]
Type: [unit / integration / e2e]

Required cases:
1. Happy path: [normal flow]
2. Error cases: [expected errors]
3. Edge cases: [null, empty, extremes]

Required mocks:
- [DB / external API / timer]

Do NOT mock:
- [E.g.: database in integration tests]

Naming: describe('[fn]'), it('should...')`,
          result: `✓ Reads the existing implementation
✓ Generates all required cases
✓ Adds correct mocks
✓ Respects naming conventions`,
        },
      ],
    },
    claudemd: {
      title: 'CLAUDE.md — Persistent System Prompt',
      desc: 'CLAUDE.md is automatically included in every new session — it\'s essentially a permanent system prompt. A well-written CLAUDE.md eliminates 80% of repetitive prompts and ensures long-term consistency, regardless of who on the team is working.',
      hierarchyTitle: 'CLAUDE.md Hierarchy',
      hierarchyDesc: 'Claude reads CLAUDE.md hierarchically — from global to local. Local files can override or complement global rules.',
      hierarchy: [
        { path: '~/.claude/CLAUDE.md',       label: 'Global — personal',    desc: 'Personal preferences, favorite tools, code style. Not versioned.', color: 'border-purple-500/20 bg-purple-500/5', badge: 'text-purple-400 bg-purple-500/10' },
        { path: 'project/CLAUDE.md',          label: 'Project — shared',     desc: 'Project rules, tech stack, conventions. Versioned in repo — the entire team receives it.', color: 'border-amber-500/20 bg-amber-500/5', badge: 'text-amber-400 bg-amber-500/10' },
        { path: 'project/src/api/CLAUDE.md',  label: 'Subdirectory — local', desc: 'Module-specific rules. Loaded only when working in that subdirectory.', color: 'border-blue-500/20 bg-blue-500/5', badge: 'text-blue-400 bg-blue-500/10' },
      ],
      hierarchyInfo: 'Subdirectories with their own CLAUDE.md are ideal for monorepos — frontend rules don\'t load when working on the backend and vice versa. You save tokens and reduce noise.',
      structureTitle: 'Structure of an effective CLAUDE.md',
      weakLabel: 'Weak CLAUDE.md',
      weakCode: `# Project
Use TypeScript.
Use Prisma for the database.
The database is PostgreSQL.`,
      weakNote: 'Too generic. Doesn\'t help Claude make specific decisions.',
      strongLabel: 'Strong CLAUDE.md',
      strongCode: `# Stack: Next.js 16 + Prisma 7 + Neon

## Strict rules
- No \`any\` — never, use unknown
- IDs are string (cuid), not number
- Prices as Float in DB, formatPrice() for display
- import db ONLY from @/lib/db

## Mandatory error handling
Any async → try/catch
API routes → { error: '...' } with HTTP status

## What you do NOT do without asking
- Do not delete functional code
- Do not add new dependencies
- Do not modify the Prisma schema

## How to run dev
npm run dev (port 3001)`,
      importTitle: 'Importing files in CLAUDE.md',
      importDesc: <>You can include other files in CLAUDE.md with the <code className="text-amber-400">@path/to/file</code> syntax. Useful for including the Prisma schema, code examples or technical documents without duplicating them.</>,
      importCode: `# CLAUDE.md with imports

## Database schema
@prisma/schema.prisma

## Correct API route examples
@docs/api-examples.md

## Global types
@src/types/global.d.ts

# Claude will automatically read the included files
# at each new session.`,
      importTip: <>Do not include large files (hundreds of lines) in CLAUDE.md — they are added to <strong className="text-green-300">every request</strong> as input tokens. Include only what is truly necessary for daily code decisions.</>,
      sectionsTitle: 'Recommended sections',
      sections: [
        { section: 'Tech stack',              desc: 'Framework, versions, key libraries and the reason for choosing them',       must: true },
        { section: 'Code rules',              desc: 'Mandatory types, import patterns, naming conventions',                       must: true },
        { section: 'Error handling',          desc: 'How errors are handled in the project (API routes, async, etc.)',           must: true },
        { section: 'What Claude does NOT do', desc: 'Explicit restrictions: code that cannot be deleted, off-limits files',      must: true },
        { section: 'Dev commands',            desc: 'npm run dev, build, test — Claude runs them automatically when needed',      must: false },
        { section: 'Project structure',       desc: 'Where pages, components, hooks live — quick navigation guide',             must: false },
        { section: 'Commit conventions',      desc: 'Conventional commits format, branch naming if relevant',                    must: false },
        { section: 'Architectural decisions', desc: 'Why X was chosen over Y — avoids repetitive questions',                     must: false },
      ],
    },
    antipatterns: {
      title: 'Claude Code Anti-patterns',
      desc: 'These are the causes of 90% of frustrations with Claude Code. All have simple solutions — recognize them before sending the prompt.',
      problemLabel: 'Problem',
      solutionLabel: 'Solution',
      cards: [
        { number: '01', title: 'Vague prompt without context', bad: `fix the authentication bug`, fix: `Users get 401 on POST /api/auth/login.\nCheck middleware/auth.ts line 42 —\nI suspect JWT doesn't include "role".\nKeep the function interface.`, why: 'Claude doesn\'t know what bug, where it is, or the expected behavior. Describe the symptom, not the diagnosis.' },
        { number: '02', title: 'Multiple tasks simultaneously', bad: `refactor the code and add tests\nand fix performance and update docs`, fix: `Step 1: Refactor fetchUsers()\nfrom lib/api.ts — extract pagination.\n\n[You verify, only then:]\nStep 2: Add tests for the helper.`, why: 'Claude may omit sub-tasks or handle them superficially. One task per message, maximum.' },
        { number: '03', title: 'No Plan Mode for large tasks', bad: `implement a notification system\nwith email, push and in-app`, fix: `/plan Implement notification system:\nemail (Resend), push (Firebase),\nin-app (DB). Stack: Next.js + Prisma.\nList the affected files.`, why: 'Without a plan, Claude can implement 3 hours of code in the wrong direction. Plan Mode costs 30 seconds.' },
        { number: '04', title: 'No constraints on existing code', bad: `add cache to the getUsers() function`, fix: `Add Redis cache to getUsers()\nfrom lib/users.ts.\n\nKeep intact:\n- Function signature (params, return)\n- Behavior with DB offline\n- All existing calls`, why: 'Without constraints, Claude may rename, refactor adjacent code or change the signature.' },
        { number: '05', title: 'Session polluted with old context', bad: `[after 30+ messages and 3 features]\nrefactor authentication`, fix: `/clear\n\n[New session:]\nRefactor auth flow from\nmiddleware.ts + lib/auth.ts.\nContext: [fresh description]`, why: 'A long session accumulates contradictions. Claude may use old irrelevant decisions for the new task.' },
        { number: '06', title: 'ultrathink for simple tasks', bad: `ultrathink add the\n"updatedAt" field to the User model`, fix: `Add the updatedAt DateTime\n@updatedAt field to the User model\nin prisma/schema.prisma.`, why: 'ultrathink asks for maximum reasoning on that turn — you pay for many more output tokens. Reserve it for problems with real architectural impact.' },
        { number: '07', title: 'Not mentioning the stack', bad: `add authentication to the project`, fix: `Stack: Next.js 16 App Router\nORM: Prisma 7, DB: Neon\nAlready installed: next-auth@5\n\nAdd Google OAuth.\nDo not add other dependencies.`, why: 'Claude may choose an incompatible library or an approach that conflicts with what you already have.' },
        { number: '08', title: 'Not reviewing the diff before accepting', bad: `[Accept all changes automatically\nwithout reading the diff]`, fix: `Before continuing, display\na summary of modified files\nand what changed in each.`, why: 'Claude can make unanticipated collateral changes. Always review the diff before committing.' },
        { number: '09', title: 'Request to "improve" without criteria', bad: `improve this component`, fix: `Improve UserCard.tsx:\n- Reduce re-renders with memo()\n- Extract formatDate() into a helper\n- Add loading skeleton\nDo not change existing props.`, why: '"Improvement" is subjective. Claude will make arbitrary changes that may break other things.' },
        { number: '10', title: 'Ignoring CLAUDE.md or not having one', bad: `[Every session you start with:\n"The project uses Next.js, TypeScript strict,\nPrisma, no any, prices as Float..."]`, fix: `# Write once in CLAUDE.md:\nStack: Next.js 16, Prisma 7, Neon\nNo any. IDs string. Prices Float.\nImport db from @/lib/db.\n\n# And never repeat it again.`, why: 'Without CLAUDE.md, you repeat context in every session. The 30-minute investment pays off in days.' },
      ],
    },
    template: {
      title: 'Ready-to-use Templates',
      desc: <>Fill in the fields between <code className="text-amber-400">[ ]</code> and send directly. Save them in <code className="text-amber-400">.claude/commands/</code> for quick access with slash commands.</>,
      saveTip: 'Save templates as custom commands',
      saveTipDesc: <>Put each template in a <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs text-amber-400">.claude/commands/</code> file and it becomes instantly available as a slash command in any session.</>,
      saveCode: `mkdir -p .claude/commands

# Save the bug fix template:
cp bug-template.md .claude/commands/bug.md

# Immediate usage in session:
> /bug Users get 401 at login
  after refresh token. File: lib/auth.ts

# Version .claude/commands/ in git
# — the entire team benefits from the same commands`,
      cards: [
        {
          title: '🐛 Full Bug Fix',
          subtitle: 'For any production bug',
          code: `# Expected behavior:
[What should happen]

# Actual behavior:
[What happens + exact error]

# Reproduction steps:
1. [Navigate to URL]
2. [Execute action X]
3. [Error occurs]

# Involved files:
- [path/file.ts] — [why it's relevant]

# Already tried:
[What you tested without success]

# Constraints:
- Do not modify [X]
- Keep [Y]`,
        },
        {
          title: '✨ New Feature',
          subtitle: 'With user story and edge cases',
          code: `# Feature: [Title]

# User story:
As a [user type],
I want to [action]
so that [benefit].

# Technical behavior:
- [Detail 1]
- [Detail 2]

# Files to create/modify:
- [file]

# Edge cases:
- [Special case 1]
- [Special case 2]

# FORBIDDEN:
- [What you may not touch]`,
        },
        {
          title: '🔄 Safe Refactoring',
          subtitle: 'Without changing behavior',
          code: `# Refactor:
[function/component] from [file.ts]

# Motivation:
[Why — e.g.: duplicated code, complexity]

# Specific objective:
[E.g.: extract helper, reduce nesting]

# KEEP INTACT (MANDATORY):
- Public interface (types, parameters)
- Observable behavior
- [Other critical items]

# Verification:
[e.g.: npm test && npx tsc --noEmit]`,
        },
        {
          title: '🔍 Structured Code Review',
          subtitle: 'With focus and severity',
          code: `# Review [file or PR #N]

# PR context:
[What the change does and why]

# Focus on:
☐ Security (OWASP Top 10)
☐ Type safety (no any, nulls)
☐ Error handling (try/catch)
☐ Performance (N+1, memory)
☐ Consistency with CLAUDE.md

# Format:
🔴 CRITICAL → [concrete fix]
🟡 WARNING → [suggestion]
🟢 NICE-TO-HAVE → [observation]`,
        },
        {
          title: '🏗️ Architectural Consultation',
          subtitle: 'Decision before implementation',
          code: `[Activate Plan Mode: Shift+Tab]

# I want to implement:
[Complex feature/system]

# Technical context:
- Stack: [technologies]
- Scale: [application size]
- Constraints: [time, complexity]

# Options:
A) [Option A]
B) [Option B]

# IMPORTANT: Do not write code.
# Analyze and recommend.`,
        },
        {
          title: '🧪 Test Generation',
          subtitle: 'Full coverage with edge cases',
          code: `# Generate tests for:
[function] from [file.ts]

# Framework: [Vitest/Jest]
# Type: [unit / integration]

# Required cases:
1. Happy path: [normal flow]
2. Error: [expected errors]
3. Edge: [null, empty, extremes]

# Mocks:
- [DB / external API]

# Do NOT mock:
- [database in integration]`,
        },
      ],
    },
  },
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

const BADGE_CLASSES: Record<string, string> = {
  'Esențial':    'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'Essential':   'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'Intermediar': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Intermediate':'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Avansat':     'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'Advanced':    'bg-purple-500/10 text-purple-400 border-purple-500/20',
}
function DiffBadge({ level }: { level: string }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase ${BADGE_CLASSES[level] ?? ''}`}>
      {level}
    </span>
  )
}
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
function WarnBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
      <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-400" />
      <div className="text-sm leading-relaxed text-zinc-400">{children}</div>
    </div>
  )
}

function AntiCard({ number, title, bad, fix, why, problemLabel, solutionLabel }: {
  number: string; title: string; bad: string; fix: string; why: string;
  problemLabel: string; solutionLabel: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
      <div className="mb-3 flex items-center gap-3">
        <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-red-500/10 font-mono text-xs font-bold text-red-400">{number}</span>
        <h3 className="text-sm font-semibold text-white">{title}</h3>
      </div>
      <div className="mb-2 grid gap-2 sm:grid-cols-2">
        <div className="rounded-md border border-red-500/15 bg-red-500/5 p-2.5">
          <span className="mb-1 block text-[10px] font-semibold text-red-400/70 uppercase">{problemLabel}</span>
          <pre className="overflow-x-auto font-mono text-xs text-zinc-400"><code>{bad}</code></pre>
        </div>
        <div className="rounded-md border border-green-500/15 bg-green-500/5 p-2.5">
          <span className="mb-1 block text-[10px] font-semibold text-green-400/70 uppercase">{solutionLabel}</span>
          <pre className="overflow-x-auto font-mono text-xs text-zinc-300"><code>{fix}</code></pre>
        </div>
      </div>
      <p className="flex items-start gap-1.5 text-xs text-zinc-500">
        <Lightbulb className="mt-0.5 h-3 w-3 flex-shrink-0 text-amber-500/50" />
        {why}
      </p>
    </div>
  )
}

// ─── TAB: ANATOMIE ────────────────────────────────────────────────────────────

function TabAnatomie({ lang }: { lang: Lang }) {
  const c = CONTENT[lang].anatomie
  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-2 text-2xl font-bold text-white">{c.title}</h2>
        <p className="text-zinc-400 leading-relaxed">{c.desc}</p>
      </div>

      {/* COCF grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {c.cocf.map((item) => (
          <div key={item.name} className={`rounded-xl border ${item.color} bg-zinc-900/50 p-5`}>
            <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg border text-xl font-black ${item.color}`}>
              {item.letter}
            </div>
            <h3 className="mb-2 font-bold text-white">{item.name}</h3>
            <p className="text-xs leading-relaxed text-zinc-400">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Full example */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-6">
        <div className="mb-3 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-400" />
          <span className="font-semibold text-white">{c.exampleTitle}</span>
        </div>
        <CodeBlock code={c.exampleCode} />
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {c.exampleChecks.map((s) => (
            <div key={s} className="rounded-md bg-zinc-800/50 py-2 text-center text-xs font-medium text-zinc-300">{s}</div>
          ))}
        </div>
      </div>

      {/* Completeness scale */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="mb-4 font-semibold text-white">{c.scaleTitle}</h3>
        <div className="space-y-3">
          {c.scale.map((r) => (
            <div key={r.components} className="flex items-center gap-4">
              <span className="w-24 font-mono text-xs text-zinc-500">{r.components}</span>
              <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-zinc-800">
                <div className={`h-full rounded-full ${r.color}`} style={{ width: `${r.score}%` }} />
              </div>
              <span className="w-52 text-xs text-zinc-400">{r.note}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Specificity principle */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-red-400">
            <XCircle className="h-4 w-4" /> {c.vagueLabel}
          </div>
          <CodeBlock code={c.vagueCode} />
        </div>
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-green-400">
            <CheckCircle className="h-4 w-4" /> {c.specificLabel}
          </div>
          <CodeBlock code={c.specificCode} />
        </div>
      </div>
    </div>
  )
}

// ─── TAB: INTERACȚIUNE CC ─────────────────────────────────────────────────────

function TabInteractiune({ lang }: { lang: Lang }) {
  const c = CONTENT[lang].interactiune
  const db = CONTENT[lang].diffBadge
  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-2 text-2xl font-bold text-white">{c.title}</h2>
        <p className="text-zinc-400 leading-relaxed">{c.desc}</p>
      </div>

      {/* @ file references */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-500/10 p-2.5"><AtSign className="h-5 w-5 text-blue-400" /></div>
            <div>
              <h3 className="text-lg font-semibold text-white">{c.fileRef.title}</h3>
              <p className="text-xs text-zinc-500">{c.fileRef.subtitle}</p>
            </div>
          </div>
          <DiffBadge level={db.essential} />
        </div>
        <p className="mb-4 text-sm text-zinc-400 leading-relaxed">{c.fileRef.desc}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <span className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-zinc-500">{c.fileRef.explicitLabel}</span>
            <CodeBlock code={c.fileRef.explicitCode} />
          </div>
          <div>
            <span className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-zinc-500">{c.fileRef.lineLabel}</span>
            <CodeBlock code={c.fileRef.lineCode} />
          </div>
        </div>
        <div className="mt-3">
          <TipBox>{c.fileRef.tip}</TipBox>
        </div>
      </div>

      {/* Plan Mode */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-500/10 p-2.5"><Brain className="h-5 w-5 text-purple-400" /></div>
            <div>
              <h3 className="text-lg font-semibold text-white">{c.planMode.title}</h3>
              <p className="text-xs text-zinc-500">{c.planMode.subtitle}</p>
            </div>
          </div>
          <DiffBadge level={db.essential} />
        </div>
        <p className="mb-4 text-sm text-zinc-400 leading-relaxed">{c.planMode.desc}</p>
        <div className="mb-4 grid gap-3 sm:grid-cols-3">
          {c.planMode.steps.map((s) => (
            <div key={s.step} className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-purple-400">{s.step}</span>
                <span className="text-sm font-semibold text-white">{s.label}</span>
              </div>
              <div className="mb-1 text-purple-400/60">{s.icon}</div>
              <p className="text-xs text-zinc-500">{s.desc}</p>
            </div>
          ))}
        </div>
        <CodeBlock code={c.planMode.code} />
        <div className="mt-3">
          <WarnBox>{c.planMode.warn}</WarnBox>
        </div>
      </div>

      {/* Custom slash commands */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-amber-500/10 p-2.5"><Terminal className="h-5 w-5 text-amber-400" /></div>
            <div>
              <h3 className="text-lg font-semibold text-white">{c.slashCommands.title}</h3>
              <p className="text-xs text-zinc-500">{c.slashCommands.subtitle}</p>
            </div>
          </div>
          <DiffBadge level={db.essential} />
        </div>
        <p className="mb-4 text-sm text-zinc-400 leading-relaxed">{c.slashCommands.desc}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <span className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-zinc-500">{c.slashCommands.createLabel}</span>
            <CodeBlock code={c.slashCommands.createCode} />
          </div>
          <div>
            <span className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-amber-400/60">{c.slashCommands.useLabel}</span>
            <CodeBlock code={c.slashCommands.useCode} />
          </div>
        </div>
      </div>

      {/* # memory */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-500/10 p-2.5"><Hash className="h-5 w-5 text-green-400" /></div>
            <div>
              <h3 className="text-lg font-semibold text-white">{c.memory.title}</h3>
              <p className="text-xs text-zinc-500">{c.memory.subtitle}</p>
            </div>
          </div>
          <DiffBadge level={db.intermediate} />
        </div>
        <p className="mb-4 text-sm text-zinc-400 leading-relaxed">{c.memory.desc}</p>
        <CodeBlock code={c.memory.code} />
        <InfoBox>{c.memory.info}</InfoBox>
      </div>

      {/* Steering during execution */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-red-500/10 p-2.5"><Settings className="h-5 w-5 text-red-400" /></div>
            <div>
              <h3 className="text-lg font-semibold text-white">{c.steering.title}</h3>
              <p className="text-xs text-zinc-500">{c.steering.subtitle}</p>
            </div>
          </div>
          <DiffBadge level={db.intermediate} />
        </div>
        <p className="mb-4 text-sm text-zinc-400 leading-relaxed">{c.steering.desc}</p>
        <div className="space-y-3">
          {c.steering.scenarios.map((r) => (
            <div key={r.scenario} className={`rounded-lg border ${r.color} p-4`}>
              <div className="mb-2 flex items-center gap-3">
                <kbd className="rounded bg-zinc-800 px-2 py-0.5 text-xs font-semibold text-zinc-300">Esc</kbd>
                <span className="text-sm text-zinc-300">{r.scenario}</span>
              </div>
              <pre className="font-mono text-xs text-zinc-400">{r.followup}</pre>
            </div>
          ))}
        </div>
      </div>

      {/* XML structuring */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-amber-500/10 p-2.5"><Tag className="h-5 w-5 text-amber-400" /></div>
            <div>
              <h3 className="text-lg font-semibold text-white">{c.xml.title}</h3>
              <p className="text-xs text-zinc-500">{c.xml.subtitle}</p>
            </div>
          </div>
          <DiffBadge level={db.advanced} />
        </div>
        <p className="mb-4 text-sm text-zinc-400 leading-relaxed">{c.xml.desc}</p>
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <span className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-red-400/70">{c.xml.freeLabel}</span>
            <CodeBlock code={c.xml.freeCode} />
          </div>
          <div>
            <span className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-green-400/70">{c.xml.xmlLabel}</span>
            <CodeBlock code={c.xml.xmlCode} />
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── TAB: PATTERNURI ──────────────────────────────────────────────────────────

function PatternCard({ title, icon, description, template, result, templateLabel, resultLabel }: {
  title: string; icon: React.ReactNode; description: string; template: string; result: string;
  templateLabel: string; resultLabel: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all hover:border-amber-500/30 hover:bg-zinc-900">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-lg bg-amber-500/10 p-2.5 text-amber-400">{icon}</div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <p className="mb-4 text-sm leading-relaxed text-zinc-400">{description}</p>
      <div className="mb-3">
        <span className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-amber-400/70">{templateLabel}</span>
        <CodeBlock code={template} />
      </div>
      <div>
        <span className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-green-400/70">{resultLabel}</span>
        <div className="rounded-lg border border-green-500/10 bg-green-500/5 px-3 py-2">
          <pre className="font-mono text-xs leading-relaxed text-zinc-400"><code>{result}</code></pre>
        </div>
      </div>
    </div>
  )
}

const PATTERN_ICONS = [
  <AlertTriangle className="h-5 w-5" />,
  <Zap className="h-5 w-5" />,
  <RefreshCw className="h-5 w-5" />,
  <CheckCircle className="h-5 w-5" />,
  <Brain className="h-5 w-5" />,
  <FileText className="h-5 w-5" />,
]

function TabPatternuri({ lang }: { lang: Lang }) {
  const c = CONTENT[lang].patternuri
  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2 text-2xl font-bold text-white">{c.title}</h2>
        <p className="text-zinc-400 leading-relaxed">{c.desc}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {c.cards.map((card, i) => (
          <PatternCard
            key={card.title}
            icon={PATTERN_ICONS[i]}
            title={card.title}
            description={card.desc}
            template={card.template}
            result={card.result}
            templateLabel={c.templateLabel}
            resultLabel={c.resultLabel}
          />
        ))}
      </div>
    </div>
  )
}

// ─── TAB: CLAUDE.MD ───────────────────────────────────────────────────────────

function TabClaudeMd({ lang }: { lang: Lang }) {
  const c = CONTENT[lang].claudemd
  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-2 text-2xl font-bold text-white">{c.title}</h2>
        <p className="text-zinc-400 leading-relaxed">{c.desc}</p>
      </div>

      {/* Hierarchy */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
          <Layers className="h-5 w-5 text-amber-400" /> {c.hierarchyTitle}
        </h3>
        <p className="mb-4 text-sm text-zinc-400">{c.hierarchyDesc}</p>
        <div className="space-y-2">
          {c.hierarchy.map((r) => (
            <div key={r.path} className={`rounded-lg border ${r.color} p-4`}>
              <div className="flex items-start justify-between gap-3 mb-1">
                <code className="text-sm text-zinc-200">{r.path}</code>
                <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${r.badge}`}>{r.label}</span>
              </div>
              <p className="text-xs text-zinc-500">{r.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <InfoBox>{c.hierarchyInfo}</InfoBox>
        </div>
      </div>

      {/* Structure */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">{c.structureTitle}</h3>
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <span className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-red-400/70">{c.weakLabel}</span>
            <CodeBlock code={c.weakCode} />
            <p className="mt-2 text-xs text-zinc-600">{c.weakNote}</p>
          </div>
          <div>
            <span className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-green-400/70">{c.strongLabel}</span>
            <CodeBlock code={c.strongCode} />
          </div>
        </div>
      </div>

      {/* Import syntax */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">{c.importTitle}</h3>
        <p className="mb-4 text-sm text-zinc-400">{c.importDesc}</p>
        <CodeBlock code={c.importCode} />
        <TipBox>{c.importTip}</TipBox>
      </div>

      {/* Recommended sections */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-white">{c.sectionsTitle}</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {c.sections.map((r) => (
            <div key={r.section} className="flex items-start gap-3 rounded-lg border border-zinc-800 bg-zinc-900/30 p-3">
              <div className={`mt-0.5 flex-shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold ${r.must ? 'bg-amber-500/20 text-amber-400' : 'bg-zinc-800 text-zinc-500'}`}>
                {r.must ? 'MUST' : 'OPT'}
              </div>
              <div>
                <div className="text-sm font-semibold text-zinc-200">{r.section}</div>
                <div className="text-xs text-zinc-500">{r.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── TAB: ANTIPATTERNS ────────────────────────────────────────────────────────

function TabAntipatterns({ lang }: { lang: Lang }) {
  const c = CONTENT[lang].antipatterns
  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2 text-2xl font-bold text-white">{c.title}</h2>
        <p className="text-zinc-400 leading-relaxed">{c.desc}</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {c.cards.map((card) => (
          <AntiCard
            key={card.number}
            number={card.number}
            title={card.title}
            bad={card.bad}
            fix={card.fix}
            why={card.why}
            problemLabel={c.problemLabel}
            solutionLabel={c.solutionLabel}
          />
        ))}
      </div>
    </div>
  )
}

// ─── TAB: TEMPLATE-URI ────────────────────────────────────────────────────────

function TabTemplate({ lang }: { lang: Lang }) {
  const c = CONTENT[lang].template
  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2 text-2xl font-bold text-white">{c.title}</h2>
        <p className="text-zinc-400 leading-relaxed">{c.desc}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {c.cards.map((t) => (
          <div key={t.title} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
            <div className="mb-0.5 text-base font-semibold text-white">{t.title}</div>
            <div className="mb-3 text-xs text-zinc-500">{t.subtitle}</div>
            <CodeBlock code={t.code} />
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-amber-400">
          <Lightbulb className="h-4 w-4" /> {c.saveTip}
        </div>
        <p className="mb-3 text-sm text-zinc-400">{c.saveTipDesc}</p>
        <CodeBlock code={c.saveCode} />
      </div>
    </div>
  )
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────

export default function PromptingTips() {
  const [activeTab, setActiveTab] = useState<TabId>('anatomie')
  const { lang } = useApp()

  const c = CONTENT[lang]

  const TABS: Tab[] = [
    { id: 'anatomie',     label: c.tabLabels.anatomie,     icon: <BookOpen className="h-4 w-4" /> },
    { id: 'interactiune', label: c.tabLabels.interactiune, icon: <Terminal className="h-4 w-4" /> },
    { id: 'patternuri',   label: c.tabLabels.patternuri,   icon: <Code2 className="h-4 w-4" /> },
    { id: 'claudemd',     label: c.tabLabels.claudemd,     icon: <FileText className="h-4 w-4" /> },
    { id: 'antipatterns', label: c.tabLabels.antipatterns, icon: <ShieldX className="h-4 w-4" /> },
    { id: 'template',     label: c.tabLabels.template,     icon: <LayoutTemplate className="h-4 w-4" /> },
  ]

  const renderTab = () => {
    switch (activeTab) {
      case 'anatomie':     return <TabAnatomie lang={lang} />
      case 'interactiune': return <TabInteractiune lang={lang} />
      case 'patternuri':   return <TabPatternuri lang={lang} />
      case 'claudemd':     return <TabClaudeMd lang={lang} />
      case 'antipatterns': return <TabAntipatterns lang={lang} />
      case 'template':     return <TabTemplate lang={lang} />
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      {/* Header */}
      <div className="mb-10">
        <div className="mb-3 flex items-center gap-3">
          <div className="rounded-xl bg-amber-500/10 p-2.5">
            <Brain className="h-6 w-6 text-amber-400" />
          </div>
          <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
            {c.badge}
          </span>
        </div>
        <h1 className="mb-3 text-4xl font-bold text-white">{c.title}</h1>
        <p className="max-w-2xl text-lg text-zinc-400 leading-relaxed">{c.desc}</p>
      </div>

      {/* Stats strip */}
      <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {c.stats.map((s) => (
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
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
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
