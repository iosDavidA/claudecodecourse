import { useState } from 'react'
import { useApp } from '../contexts/AppContext'
import {
  Target, Calendar, Code2, Shield, Rocket, Layers,
  CheckCircle, ChevronRight, AlertTriangle,
} from 'lucide-react'

type TabId = 'scenariu' | 'plan' | 'build' | 'quality' | 'deploy' | 'modele'

interface Tab { id: TabId; label: string; icon: React.ReactNode }

interface Step {
  n: string
  title: string
  model: string
  thinking: string
  modelClass: string
  why: string
  prompt: string
  output?: string
  tip?: string
  warn?: string
}

interface MatrixRow {
  cat: string
  model: string
  thinking: string
  cost: string
  why: string
  modelClass: string
}

interface StackRow { layer: string; tech: string }
interface WeekItem { week: string; focus: string; tasks: string[] }
interface CostRow { model: string; input: string; output: string; useCase: string }

interface PhaseContent {
  sectionTitle: string
  intro: string
  steps: Step[]
}

interface ContentShape {
  pageLabel: string
  pageTitle: string
  pageDesc: string
  tabs: Record<TabId, string>
  stats: { key: string; label: string }[]
  scenariu: {
    projectTitle: string
    projectDesc: string
    constraint: string
    stackTitle: string
    stack: StackRow[]
    featuresTitle: string
    features: string[]
    timelineTitle: string
    weeks: WeekItem[]
    whyTitle: string
    whyPoints: string[]
  }
  plan: PhaseContent
  build: PhaseContent & { proTipsTitle: string; proTips: string[] }
  quality: PhaseContent
  deploy: PhaseContent
  modele: {
    sectionTitle: string
    intro: string
    matrixTitle: string
    matrix: MatrixRow[]
    escalationTitle: string
    escalation: string[]
    costTitle: string
    costs: CostRow[]
    rulesTitle: string
    rules: string[]
  }
}

// ─── Content ──────────────────────────────────────────────────────────────────

const CONTENT: Record<'ro' | 'en', ContentShape> = {
  ro: {
    pageLabel: 'Lecția 12',
    pageTitle: 'Proiect complet cu Claude Code',
    pageDesc: 'De la idee la producție: workflow detaliat pentru un e-commerce full-stack. Fiecare fază arată ce model să folosești, ce prompt să trimiți și ce să aștepți.',
    tabs: { scenariu: 'Scenariu', plan: 'Plan', build: 'Build', quality: 'Quality', deploy: 'Deploy', modele: 'Modele' },
    stats: [
      { key: '6', label: 'săptămâni' },
      { key: '3', label: 'modele Claude' },
      { key: '40+', label: 'task-uri' },
      { key: '~$11', label: 'cost estimat' },
    ],
    scenariu: {
      projectTitle: 'ArtisanShop — e-commerce full-stack',
      projectDesc: 'Platformă pentru meșteșugari care vând produse handmade cu customizare pe canvas. Clienții personalizează produse (text, culori, imagini) înainte de comandă.',
      constraint: '1 developer + Claude Code · MVP în 6 săptămâni · buget Claude ~$15',
      stackTitle: 'Tech stack ales',
      stack: [
        { layer: 'Framework', tech: 'Next.js 16 (App Router)' },
        { layer: 'Limbaj', tech: 'TypeScript strict' },
        { layer: 'Styling', tech: 'Tailwind CSS v4 + shadcn/ui' },
        { layer: 'ORM', tech: 'Prisma 7 + Neon PostgreSQL' },
        { layer: 'Payments', tech: 'Stripe (checkout + webhooks)' },
        { layer: 'Email', tech: 'Resend + React Email' },
        { layer: 'Canvas', tech: 'Fabric.js (izolat în hooks)' },
        { layer: 'State', tech: 'Zustand (cart + editor)' },
        { layer: 'Auth', tech: 'NextAuth v5 (email + OAuth)' },
        { layer: 'Deploy', tech: 'Vercel + GitHub Actions' },
      ],
      featuresTitle: 'Funcționalități MVP',
      features: [
        'Landing page cu marketing + SEO',
        'Catalog produse cu filtre (categorie, preț, meșteșugar)',
        'Pagina produs + customizer canvas (Fabric.js)',
        'Autentificare (email + Google OAuth)',
        'Coș de cumpărături persistent (Zustand)',
        'Checkout cu Stripe + confirmare email',
        'Dashboard comenzi (client)',
        'Dashboard meșteșugar (upload produse, comenzi)',
        'Panou admin (CRUD complet)',
        'Email transacțional (Resend)',
        'SEO: metadata dinamică, sitemap, OG',
        'i18n: română + engleză',
      ],
      timelineTitle: 'Timeline 6 săptămâni',
      weeks: [
        { week: 'Săptămâna 1', focus: 'Setup + Auth', tasks: ['Scaffold Next.js + Prisma', 'Schema DB + migrații', 'Auth (email + Google)', 'CLAUDE.md proiect'] },
        { week: 'Săptămâna 2', focus: 'Catalog + Produs', tasks: ['Catalog cu filtre', 'Pagina produs', 'Upload imagini', 'SEO basics'] },
        { week: 'Săptămâna 3', focus: 'Canvas + Cart', tasks: ['Customizer Fabric.js', 'Coș Zustand', 'Validare comandă', 'Mobile responsive'] },
        { week: 'Săptămâna 4', focus: 'Payments + Email', tasks: ['Stripe checkout', 'Webhooks Stripe', 'Email Resend', 'Dashboard comenzi'] },
        { week: 'Săptămâna 5', focus: 'Admin + Quality', tasks: ['Dashboard meșteșugar', 'Admin panel', 'Teste E2E', 'Security review'] },
        { week: 'Săptămâna 6', focus: 'Deploy + Launch', tasks: ['CI/CD GitHub Actions', 'Vercel prod', 'Monitoring Sentry', 'Analytics Posthog'] },
      ],
      whyTitle: 'De ce Claude Code e ideal pentru asta',
      whyPoints: [
        'Schimbă modele per task — Haiku pe boilerplate, Opus pe logică critică',
        'CLAUDE.md cu convențiile proiectului = consistență automată pe tot codul',
        '/plan înainte de feature-uri complexe previne rewriting-ul',
        'Worktree izolat pentru experimentat fără risc pe branch-ul curent',
        'Headless în CI/CD: review automat de securitate la fiecare PR',
      ],
    },
    plan: {
      sectionTitle: 'Faza de planificare',
      intro: 'Nu scrii cod la prima iterație. 2-3 ore de planificare cu Opus salvează 2-3 zile de refactoring.',
      steps: [
        {
          n: '01', title: 'Brainstorm strategic',
          model: 'Opus 5.5', thinking: 'ultrathink', modelClass: 'text-rose-400 bg-rose-500/10',
          why: 'Decizii de arhitectură care se compun la infinit. Economie acum = săptămâni salvate.',
          prompt: '> ultrathink. Vreau să construiesc o platformă e-commerce\n  pentru meșteșugari cu customizare pe canvas.\n\n  Dă-mi:\n  1. Lista completă de feature-uri MVP (cu prioritizare MoSCoW)\n  2. Comparație stack: Next.js vs Remix, Prisma vs Drizzle,\n     Stripe vs Paddle — cu argumente clare\n  3. Riscuri tehnice majore și mitigare\n  4. Plan 6 săptămâni realist pentru 1 developer\n  5. Ce pot delega 100% la Claude vs. ce necesită decizie umană',
          output: 'MoSCoW prioritizat (15 features), comparație stack detaliată, 3 riscuri cu plan mitigare, timeline săptămână per săptămână, matrice human/AI.',
          tip: 'Salvează output-ul ca PROJECT_BRIEF.md — devine context pentru tot restul proiectului.',
        },
        {
          n: '02', title: 'Generare CLAUDE.md',
          model: 'Opus 5.5', thinking: 'effort high', modelClass: 'text-rose-400 bg-rose-500/10',
          why: 'CLAUDE.md e system prompt-ul permanent. Investiția acum se recuperează la fiecare sesiune.',
          prompt: '> /init\n\n# Apoi rafinează cu Opus:\n> /effort high\n> Revizuiește CLAUDE.md generat. Adaugă:\n  - Convenții TypeScript stricte (no any, interface vs type)\n  - Structura fișierelor pentru Next.js App Router\n  - Regulă: Fabric.js DOAR în hooks izolate\n  - Format commit messages (Conventional Commits)\n  - Cum se face DB migration (prisma migrate dev)\n  - Prețuri stocate ca Float, afișate cu formatPrice()',
          output: 'CLAUDE.md cu ~300 linii: structură directoare, convenții TS, reguli Fabric.js, format commits, checklist pre-commit.',
          tip: 'Testează cu: `> Creează un component ProductCard` — verifică că respectă convențiile fără instrucțiuni extra.',
        },
        {
          n: '03', title: 'Schema Prisma + relații',
          model: 'Opus 5.5', thinking: 'effort xhigh', modelClass: 'text-rose-400 bg-rose-500/10',
          why: 'Schema e fundația. O relație greșită între Product/Order costă o migrare dureroasă.',
          prompt: '> /effort xhigh\n> Proiectează schema Prisma pentru ArtisanShop:\n  - User (client + meșteșugar, same table cu rol)\n  - Product (cu variante culoare/material)\n  - Customization (JSON canvas state + preview URL)\n  - Order + OrderItem (snapshot produs la cumpărare)\n  - Review (cu moderare)\n\n  Include: indecși, cascade rules, enum-uri status,\n  cuid() pentru toate ID-urile. Explică trade-off-urile.',
          output: 'Schema completă ~120 linii, 8 modele, comentarii pentru fiecare decizie arhitecturală.',
          warn: 'Revizuiește schema înainte de prima migrare. Schimbările post-migrare costă mai mult.',
        },
        {
          n: '04', title: 'Contract API cu /plan',
          model: 'Sonnet 5', thinking: '', modelClass: 'text-amber-400 bg-amber-500/10',
          why: 'API routes sunt mecanice odată ce schema e clară. Sonnet e perfect pentru planificare structurată.',
          prompt: '> /plan Definește toate API routes pentru MVP:\n  - Auth (NextAuth callbacks)\n  - Products (CRUD + filtre)\n  - Customizations (save/load canvas state)\n  - Orders (creare, status, history)\n  - Stripe webhooks\n  - Admin routes\n\n  Pentru fiecare: metodă HTTP, path, request/response shape,\n  middleware necesar, cine are acces.',
          output: 'Plan cu 24 routes, grupate pe domenii, cu tipuri TypeScript pentru fiecare request/response.',
          tip: 'Aprobă planul și salvează-l. Claude va respecta contractul pe tot parcursul implementării.',
        },
        {
          n: '05', title: 'Arbore de componente UI',
          model: 'Sonnet 5', thinking: '', modelClass: 'text-amber-400 bg-amber-500/10',
          why: 'Server vs. Client Components necesită planificare. Mai ușor acum decât să migrezi mai târziu.',
          prompt: '> Creează arborele de componente pentru:\n  - /products (catalog)\n  - /products/[slug] (detaliu + customizer)\n  - /cart\n  - /checkout\n\n  Marchează fiecare component: SC (Server) sau CC (Client).\n  Explică de ce. Identifică granița "use client".',
          output: 'Diagramă text cu SC/CC marcat, explicații pentru granițele Server/Client importante.',
          tip: 'Salvează diagrama — te va ghida când creezi fișierele efectiv.',
        },
      ],
    },
    build: {
      sectionTitle: 'Faza de implementare',
      intro: 'Urmează planul. Schimbă modelul în funcție de complexitatea și riscul fiecărui task.',
      steps: [
        {
          n: '01', title: 'Scaffold + tooling',
          model: 'Haiku 4.5', thinking: '', modelClass: 'text-cyan-400 bg-cyan-500/10',
          why: 'Setup e repetitiv și urmează rețete cunoscute. Haiku îl face rapid și ieftin (~$0.02).',
          prompt: 'claude -p "Creează proiect Next.js 16 cu:\n  npx create-next-app@latest artisan-shop --typescript --tailwind --app\n\n  Instalează și configurează:\n  - shadcn/ui (init complet)\n  - Prisma 7 cu adapter Neon\n  - NextAuth v5, Zustand, Tailwind v4\n\n  Commit după fiecare pas major." \\\n  --model claude-haiku-4-5 \\\n  --dangerously-skip-permissions',
          output: 'Proiect scaffoldat, toate dependențele instalate, configurări de bază gata.',
          warn: 'Nu rula --dangerously-skip-permissions pe mașina ta principală fără container izolat.',
        },
        {
          n: '02', title: 'Auth system complet',
          model: 'Opus 5.5', thinking: 'effort high', modelClass: 'text-rose-400 bg-rose-500/10',
          why: 'Auth are implicații de securitate serioase. O vulnerabilitate = account takeover. Nu economisi pe asta.',
          prompt: '> /effort high\n> Implementează auth complet cu NextAuth v5:\n  - Providers: Email (magic link) + Google OAuth\n  - Sesiuni JWT cu refresh\n  - Middleware pentru rute protejate (/dashboard, /checkout, /admin)\n  - Role-based: client vs. artisan vs. admin\n  - Rate limiting pe endpoint-urile auth\n\n  Respectă convențiile din CLAUDE.md. Scrie teste\n  pentru fiecare flow (login, signup, logout, unauthorized).',
          output: 'lib/auth.ts, middleware.ts, route handler NextAuth, plus teste comprehensive pentru toate fluxurile.',
          warn: 'Testează manual toate fluxurile auth înainte de a merge mai departe.',
        },
        {
          n: '03', title: 'DB migrations + seed',
          model: 'Sonnet 5', thinking: '', modelClass: 'text-amber-400 bg-amber-500/10',
          why: 'Migrările urmează schema deja aprobată. Task mecanic potrivit pentru Sonnet.',
          prompt: '> Aplică schema Prisma aprobată.\n  Creează:\n  1. Prima migrare: npx prisma migrate dev --name init\n  2. Seed realist: 3 artisani, 15 produse, 2 clienți,\n     5 comenzi cu statusuri diferite\n  3. Helper formatPrice() în lib/utils.ts\n  4. Verifică cu npx prisma studio',
          output: 'Migrare inițială aplicată, seed cu date realiste, TypeScript-typed helpers.',
          tip: 'Rulează `npx prisma studio` — vizualizezi datele seed înainte de a scrie prima linie de UI.',
        },
        {
          n: '04', title: 'Catalog produse + filtre',
          model: 'Sonnet 5', thinking: '', modelClass: 'text-amber-400 bg-amber-500/10',
          why: 'UI CRUD standard. Sonnet face asta bine fără overhead-ul Opus.',
          prompt: '> Creează pagina /products cu:\n  - Server Component cu filtre din searchParams\n  - Filtre: categorie, preț (range), artisan, disponibilitate\n  - ProductCard cu imagine, preț formatat, rating\n  - Paginare cursor-based (10/pagină)\n  - Loading skeleton cu Suspense\n  - URL-based filters (shareable links)',
          output: 'Catalog funcțional cu filtre, paginare, skeletons. Server-rendered, SEO-ready.',
          tip: 'URL-based filters sunt critice pentru SEO și UX. Verifică că persistă la refresh.',
        },
        {
          n: '05', title: 'Canvas customizer (Fabric.js)',
          model: 'Opus 5.5', thinking: 'effort xhigh', modelClass: 'text-rose-400 bg-rose-500/10',
          why: 'Canvas + React lifecycle = complex. Starea trebuie sincronizată cu Zustand fără re-renders inutile.',
          prompt: '> /effort xhigh\n> Implementează customizer canvas:\n\n  Reguli OBLIGATORII din CLAUDE.md:\n  - Toată logica Fabric.js EXCLUSIV în hooks:\n    useCanvas.ts, useCanvasObjects.ts, useCanvasSave.ts\n  - Pagina UI apelează DOAR API-ul hook-urilor\n\n  Features:\n  - Text (font, culoare, dimensiune, poziție)\n  - Upload imagine personalizată cu crop\n  - Undo/redo (max 20 pași)\n  - Save state ca JSON în Customization model\n  - Preview PNG pentru thumbnail comandă\n  - Touch events pentru mobile',
          output: '4 hooks + componenta UI care le consumă. Canvas state în Zustand.',
          warn: 'Testează canvas pe mobile ÎNAINTE de a continua. Touch events pe Fabric.js au quirks.',
        },
        {
          n: '06', title: 'Stripe checkout + webhooks',
          model: 'Opus 5.5', thinking: 'effort xhigh', modelClass: 'text-rose-400 bg-rose-500/10',
          why: 'Cod care manipulează bani. Webhooks trebuie gestionate idempotent — eroare = comandă pierdută sau duplicată.',
          prompt: '> /effort xhigh\n> Implementează checkout Stripe complet:\n  1. PaymentIntent din coș (metadata: userId, items)\n  2. Webhook handler /api/stripe/webhook:\n     - payment_intent.succeeded → Order + OrderItems\n     - payment_intent.payment_failed → notificare\n     - charge.refunded → update status\n  3. Idempotency cu Stripe event ID\n  4. Email confirmare via Resend',
          output: 'Flow checkout complet, webhooks idempotente, email confirmare, error handling complet.',
          warn: 'Testează cu Stripe CLI local: `stripe listen --forward-to localhost:3000/api/stripe/webhook`',
        },
        {
          n: '07', title: 'Admin panel CRUD',
          model: 'Haiku 4.5', thinking: '', modelClass: 'text-cyan-400 bg-cyan-500/10',
          why: 'CRUD repetitiv pe modele deja definite. Haiku generează rapid și ieftin.',
          prompt: 'claude -p "Generează admin panel CRUD pentru:\n  - Produse (list, create, edit, delete, toggle active)\n  - Utilizatori (list, search, ban, schimb rol)\n  - Comenzi (list, filter status, update, refund)\n  - Artisani (aprobare cereri, suspend)\n\n  Folosește shadcn/ui Table, Dialog, Form.\n  Protejează cu middleware admin role check.\n  Confirmare înainte de acțiuni distructive." \\\n  --model claude-haiku-4-5',
          output: 'Admin panel cu toate paginile CRUD, dialogs de confirmare, protecție rute.',
          tip: 'Verifică cu Sonnet: `> /review pe app/admin/ — caută probleme de securitate`',
        },
      ],
      proTipsTitle: 'Obiceiuri pe parcursul Build',
      proTips: [
        'Commit după fiecare feature: `> /commit` — Claude scrie mesajul Conventional Commits',
        '/compact când sesiunea depășește 50k tokeni — economisești 80% fără a pierde contextul',
        'Sesiune separată per feature — nu amesteca auth cu canvas într-o singură sesiune',
        'Dacă Claude bate pasul pe loc 2 iterații → escaladezi la Opus + ultrathink',
        'Worktree izolat pentru experimentat: `> Lucrează într-un worktree izolat pentru a testa X`',
      ],
    },
    quality: {
      sectionTitle: 'Quality assurance',
      intro: 'Quality nu înseamnă 100% coverage. Înseamnă: nu trimiți bug-uri critice în producție.',
      steps: [
        {
          n: '01', title: 'Unit tests în CI',
          model: 'Haiku 4.5', thinking: '', modelClass: 'text-cyan-400 bg-cyan-500/10',
          why: 'Generare mecanică din cod existent. Rulat în CI = cost minim per PR.',
          prompt: '# În .github/workflows/tests.yml:\n- name: Generate missing unit tests\n  run: |\n    for file in src/lib/*.ts src/utils/*.ts; do\n      if [ ! -f "${file%.ts}.test.ts" ]; then\n        claude -p "Scrie Vitest tests pentru $file.\n        Acoperă: happy path, edge cases, error states.\n        Nu mocka implementările interne." \\\n          --model claude-haiku-4-5 \\\n          --allowedTools "Read,Write"\n      fi\n    done',
          output: 'Unit tests generate automat pentru toate utilityurile fără teste existente.',
          tip: 'Adaugă la .claude/hooks: auto-generate test la creare fișier nou în src/lib/',
        },
        {
          n: '02', title: 'Integration tests API',
          model: 'Sonnet 5', thinking: '', modelClass: 'text-amber-400 bg-amber-500/10',
          why: 'Integration tests necesită înțelegerea fluxului complet. Sonnet face asta bine.',
          prompt: '> Scrie integration tests pentru toate API routes din app/api/:\n\n  Setup: bază de date test separată (Neon branch)\n  Per route:\n  - Request valid → response corect + DB state\n  - Input invalid → 400 cu eroare clară\n  - Unauthorized → 401 / Not found → 404\n  - Edge case specific fiecărei route\n\n  Folosește Vitest + MSW pentru mock Stripe/Resend.',
          output: 'Suite completă ~60 teste, toate trec pe DB de test.',
          tip: 'Neon permite branch-uri de DB — crează un branch `test` separat.',
        },
        {
          n: '03', title: 'E2E tests Playwright',
          model: 'Sonnet 5', thinking: '', modelClass: 'text-amber-400 bg-amber-500/10',
          why: 'E2E testează fluxul utilizatorului real. Necesită înțelegere UX — potrivit pentru Sonnet.',
          prompt: '> Scrie Playwright E2E tests pentru fluxurile critice:\n  1. Guest: catalog → produs → coș → checkout\n  2. Auth: register → login → comenzi → logout\n  3. Customizer: canvas → text → save → add to cart\n  4. Payment: checkout cu card Stripe test\n  5. Admin: login → aprobare artisan → suspend user\n\n  Page object model. Rulează pe Chromium + Mobile Safari.',
          output: '5 suite-uri E2E, page objects pentru toate paginile, CI-ready.',
          tip: '`npx playwright test --reporter=html` — raport vizual cu screenshots la eșecuri.',
        },
        {
          n: '04', title: 'Audit performanță',
          model: 'Opus 5.5', thinking: 'ultrathink', modelClass: 'text-rose-400 bg-rose-500/10',
          why: 'Perf audit necesită gândire sistemică. Opus vede relațiile subtile între probleme.',
          prompt: '> ultrathink. Audit complet de performanță:\n  1. Lighthouse pe: /, /products, /products/[slug]\n     Target: LCP < 2.5s, CLS < 0.1, FID < 100ms\n  2. Bundle analysis cu @next/bundle-analyzer\n  3. N+1 queries Prisma, indecși lipsă, imagini neoptimizate\n  4. Top 10 optimizări rankate impact/efort\n  5. Implementează primele 5 fără să spargi funcționalitate',
          output: 'Raport Lighthouse înainte/după, bundle analysis, top 10 fix-uri, primele 5 implementate.',
          warn: 'Nu optimiza prematur. Fă audit DUPĂ ce toate feature-urile sunt complete.',
        },
        {
          n: '05', title: 'Security review OWASP',
          model: 'Opus 5.5', thinking: 'ultrathink', modelClass: 'text-rose-400 bg-rose-500/10',
          why: 'Vulnerabilitățile au consecințe ireparabile. Nu există "destul de bun" la securitate.',
          prompt: '> ultrathink. Security audit OWASP Top 10:\n\n  Focus obligatoriu:\n  - Injection: Prisma queries cu input user (search, filters)\n  - Broken Auth: session management, JWT expiry\n  - XSS: customizări canvas renderizate în HTML\n  - CSRF: Stripe webhooks, form actions\n  - Rate limiting: auth endpoints, order creation\n  - Secrets: env vars expuse în client bundle\n\n  Per vulnerabilitate: severity, demo exploit, fix.',
          output: 'Raport structurat: 0 critice, N medii, N mici — fix-uri implementate pentru critice și medii.',
          warn: 'Nu trimite în producție fără a adresa toate vulnerabilitățile critice și medii.',
        },
      ],
    },
    deploy: {
      sectionTitle: 'Deploy în producție',
      intro: 'Deploy-ul nu e un eveniment unic — e un sistem. Automatizezi o dată, beneficiezi la fiecare push.',
      steps: [
        {
          n: '01', title: 'GitHub Actions pipeline',
          model: 'Sonnet 5', thinking: '', modelClass: 'text-amber-400 bg-amber-500/10',
          why: 'CI/CD e mecanic și bine documentat. Sonnet știe GitHub Actions perfect.',
          prompt: '> Creează GitHub Actions workflow (.github/workflows/ci.yml):\n\n  Triggers: push main, PR la main\n  Jobs (paralele unde posibil):\n  1. lint-types: ESLint + TypeScript check\n  2. unit-tests: Vitest pe Node 22\n  3. integration-tests: Vitest cu Neon test branch\n  4. e2e: Playwright Chromium (doar PR)\n  5. security-scan: claude -p review --allowedTools Read,Grep\n  6. build: next build (doar main)\n  7. deploy-preview: Vercel preview (PR)\n  8. deploy-prod: Vercel prod (main, după checks verzi)',
          output: 'Workflow complet, jobs paralele, secrets documentate în comentarii.',
          tip: 'Parallelizare jobs: CI de la 12 min → 4 min.',
        },
        {
          n: '02', title: 'Pre-commit hooks',
          model: 'Sonnet 5', thinking: '', modelClass: 'text-amber-400 bg-amber-500/10',
          why: 'Hooks prind problemele local, înainte de CI.',
          prompt: '> Configurează .claude/hooks în settings.json:\n\n  PreToolUse (Bash): blochează rm -rf și git push --force\n  PostToolUse (Write): TypeScript check pe fișierele modificate\n\n  Și .git/hooks/pre-commit:\n  - ESLint pe fișierele staged\n  - Verifică: fără console.log în src/\n  - Verifică: TODO-uri au ticket ID (TODO: #123)',
          output: 'Hooks configurate și verificate cu un commit test.',
          tip: 'Claude Hooks (settings.json) și git hooks se completează reciproc.',
        },
        {
          n: '03', title: 'Changelog automat CI',
          model: 'Haiku 4.5', thinking: '', modelClass: 'text-cyan-400 bg-cyan-500/10',
          why: 'Format repetitiv din commit messages. Task perfect pentru Haiku în CI.',
          prompt: '# În .github/workflows/release.yml:\n- name: Generate changelog\n  run: |\n    COMMITS=$(git log --oneline $PREV_TAG..HEAD)\n    claude -p "Changelog format Keep a Changelog:\n    ## [Unreleased]\n    Din commits: $COMMITS\n    Categorii: Added, Changed, Fixed, Security" \\\n      --model claude-haiku-4-5 \\\n      --output-format text >> CHANGELOG.md\n    git add CHANGELOG.md\n    git commit -m "chore: update changelog [skip ci]"',
          output: 'CHANGELOG.md actualizat automat la fiecare release.',
        },
        {
          n: '04', title: 'Deploy Vercel + env vars',
          model: 'Sonnet 5', thinking: '', modelClass: 'text-amber-400 bg-amber-500/10',
          why: 'Deploy Vercel e procedural. Sonnet configurează corect env vars și domeniile.',
          prompt: '> Configurează deploy Vercel pentru producție:\n  1. vercel.json: rewrites, security headers (CSP, HSTS)\n  2. Lista env vars cu tip (secret vs. plain)\n  3. Neon: branch main = prod, develop = preview\n  4. Domeniu custom + SSL auto\n  5. Verifică CORS pentru Stripe webhooks\n  6. Test: vercel deploy --prod',
          output: 'vercel.json cu security headers, env vars documentate, deploy funcțional.',
          tip: 'Neon branching: prod pe main, preview deployments pe develop.',
        },
        {
          n: '05', title: 'Monitoring: Sentry + Posthog',
          model: 'Sonnet 5', thinking: '', modelClass: 'text-amber-400 bg-amber-500/10',
          why: 'Integrare SDK-uri documentate. Task direct pentru Sonnet.',
          prompt: '> Integrează monitoring:\n\n  Sentry:\n  - Error tracking: client + server + Edge\n  - Source maps pentru stack traces clare\n  - Alert: erori critice → email imediat\n\n  Posthog:\n  - Custom events: add_to_cart, checkout_started,\n    order_completed, customizer_saved\n  - Feature flags pentru rollout gradual\n\n  Verifică: fără PII (email, card) în events.',
          output: 'Sentry + Posthog integrate, events setate, alerting configurat.',
          warn: 'Verifică GDPR compliance pentru Posthog — poate necesita consent banner.',
        },
      ],
    },
    modele: {
      sectionTitle: 'Matrice modele & thinking',
      intro: 'Alegerea greșită = plătești 5× mai mult fără beneficiu sau economisești la sânge și primești output slab. Urmează matricea.',
      matrixTitle: 'Task → Model → Thinking → De ce',
      matrix: [
        { cat: 'Decizii arhitecturale', model: 'Opus 5.5', thinking: 'ultrathink', cost: '$$$$', why: 'Compun la infinit. Greșeala costă săptămâni.', modelClass: 'text-rose-400' },
        { cat: 'Auth + securitate', model: 'Opus 5.5', thinking: 'effort high', cost: '$$$', why: 'Vulnerabilitate = catastrofă. Nu economisi.', modelClass: 'text-rose-400' },
        { cat: 'Payments / Stripe', model: 'Opus 5.5', thinking: 'effort xhigh', cost: '$$$', why: 'Bani reali, logică idempotentă critică.', modelClass: 'text-rose-400' },
        { cat: 'Canvas / state complex', model: 'Opus 5.5', thinking: 'effort xhigh', cost: '$$$', why: 'Lifecycle + sync subtil, greu de debugat.', modelClass: 'text-rose-400' },
        { cat: 'Bug neclar, blocat 2+ iterații', model: 'Opus 5.5', thinking: 'ultrathink', cost: '$$$$', why: 'Escaladezi când Sonnet bate pasul pe loc.', modelClass: 'text-rose-400' },
        { cat: 'Migrații DB prod', model: 'Opus 5.5', thinking: 'effort xhigh', cost: '$$$', why: 'Risc pierdere date. Merită gândirea extra.', modelClass: 'text-rose-400' },
        { cat: 'Implementare feature', model: 'Sonnet 5', thinking: '—', cost: '$$', why: 'Default sweet spot: calitate + cost.', modelClass: 'text-amber-400' },
        { cat: 'UI / componente', model: 'Sonnet 5', thinking: '—', cost: '$$', why: 'Design-driven, iterativ.', modelClass: 'text-amber-400' },
        { cat: 'Refactoring', model: 'Sonnet 5', thinking: 'effort high', cost: '$$', why: 'Necesită înțelegerea contextului existent.', modelClass: 'text-amber-400' },
        { cat: 'Code review', model: 'Sonnet 5', thinking: 'effort high', cost: '$$', why: 'Judecată nuanțată, nu regexp scan.', modelClass: 'text-amber-400' },
        { cat: 'Integration tests', model: 'Sonnet 5', thinking: '—', cost: '$$', why: 'Necesită înțelegerea fluxului.', modelClass: 'text-amber-400' },
        { cat: 'Boilerplate CRUD', model: 'Haiku 4.5', thinking: '—', cost: '$', why: 'Repetitiv, pattern fix. 5× mai ieftin.', modelClass: 'text-cyan-400' },
        { cat: 'Generare bulk tests', model: 'Haiku 4.5', thinking: '—', cost: '$', why: 'Volum mare, template predictibil.', modelClass: 'text-cyan-400' },
        { cat: 'Documentație', model: 'Haiku 4.5', thinking: '—', cost: '$', why: 'Mecanic, urmează format fix.', modelClass: 'text-cyan-400' },
        { cat: 'CI/CD automation', model: 'Haiku 4.5', thinking: '—', cost: '$', why: 'Rulat la fiecare PR — cost per run contează.', modelClass: 'text-cyan-400' },
      ],
      escalationTitle: 'Regula de escaladare',
      escalation: [
        'Pornești cu Sonnet 5 — setează "model": "sonnet" în .claude/settings.json (default-ul Claude Code e Opus 5.5)',
        'Dacă bate pasul pe loc după 2 iterații → Opus 5.5 + /effort high',
        'Dacă problema e clară dar complexă → Opus 5.5 + /effort xhigh direct',
        'Dacă e decizie strategică sau risc înalt → Opus 5.5 + ultrathink de la start',
        'Dacă nici Opus nu rezolvă sau e agent long-horizon → Claude Fable 5.1',
        'Schimbarea modelului mid-sesiune păstrează conversația, dar invalidează prompt cache-ul — nu sări între modele la fiecare mesaj',
      ],
      costTitle: 'Cost estimat per model (per 1M tokeni)',
      costs: [
        { model: 'Haiku 4.5', input: '$1', output: '$5', useCase: 'CI/CD, boilerplate, docs — >100 task-uri/zi' },
        { model: 'Sonnet 5', input: '$2', output: '$10', useCase: 'Features, UI, tests — task-ul zilnic standard' },
        { model: 'Opus 5.5', input: '$4', output: '$20', useCase: 'Arhitectură, security, payments — deciziile importante' },
      ],
      rulesTitle: 'Reguli practice',
      rules: [
        'Un proiect ca ArtisanShop: ~70% Sonnet, ~20% Haiku, ~10% Opus → ~$9-13 total',
        'Nu folosi Opus pentru task-uri care nu escaladează în producție',
        'Haiku în CI = cost fix, previzibil, indiferent de numărul de PR-uri',
        '/compact agresiv pe sesiuni lungi — reduce costul cu 70-80%',
        'Prompt caching automat pe system prompt repetitiv — economie 90%',
      ],
    },
  },
  en: {
    pageLabel: 'Lesson 12',
    pageTitle: 'Full project with Claude Code',
    pageDesc: 'From idea to production: a detailed workflow for a full-stack e-commerce. Each phase shows which model to use, what prompt to send, and what to expect.',
    tabs: { scenariu: 'Scenario', plan: 'Plan', build: 'Build', quality: 'Quality', deploy: 'Deploy', modele: 'Models' },
    stats: [
      { key: '6', label: 'weeks' },
      { key: '3', label: 'Claude models' },
      { key: '40+', label: 'tasks' },
      { key: '~$11', label: 'estimated cost' },
    ],
    scenariu: {
      projectTitle: 'ArtisanShop — full-stack e-commerce',
      projectDesc: 'A platform for artisans selling handmade products with canvas customization. Customers personalize products (text, colors, images) before ordering.',
      constraint: '1 developer + Claude Code · MVP in 6 weeks · Claude budget ~$15',
      stackTitle: 'Chosen tech stack',
      stack: [
        { layer: 'Framework', tech: 'Next.js 16 (App Router)' },
        { layer: 'Language', tech: 'TypeScript strict' },
        { layer: 'Styling', tech: 'Tailwind CSS v4 + shadcn/ui' },
        { layer: 'ORM', tech: 'Prisma 7 + Neon PostgreSQL' },
        { layer: 'Payments', tech: 'Stripe (checkout + webhooks)' },
        { layer: 'Email', tech: 'Resend + React Email' },
        { layer: 'Canvas', tech: 'Fabric.js (isolated in hooks)' },
        { layer: 'State', tech: 'Zustand (cart + editor)' },
        { layer: 'Auth', tech: 'NextAuth v5 (email + OAuth)' },
        { layer: 'Deploy', tech: 'Vercel + GitHub Actions' },
      ],
      featuresTitle: 'MVP features',
      features: [
        'Landing page with marketing + SEO',
        'Product catalog with filters (category, price, artisan)',
        'Product detail + canvas customizer (Fabric.js)',
        'Authentication (email + Google OAuth)',
        'Persistent shopping cart (Zustand)',
        'Checkout with Stripe + confirmation email',
        'Order management dashboard (customer)',
        'Artisan dashboard (product uploads, orders)',
        'Admin panel (full CRUD)',
        'Transactional email (Resend)',
        'SEO: dynamic metadata, sitemap, OG',
        'i18n: English + Romanian',
      ],
      timelineTitle: '6-week timeline',
      weeks: [
        { week: 'Week 1', focus: 'Setup + Auth', tasks: ['Scaffold Next.js + Prisma', 'DB schema + migrations', 'Auth (email + Google)', 'Project CLAUDE.md'] },
        { week: 'Week 2', focus: 'Catalog + Product', tasks: ['Catalog with filters', 'Product page', 'Image upload', 'SEO basics'] },
        { week: 'Week 3', focus: 'Canvas + Cart', tasks: ['Fabric.js customizer', 'Zustand cart', 'Order validation', 'Mobile responsive'] },
        { week: 'Week 4', focus: 'Payments + Email', tasks: ['Stripe checkout', 'Stripe webhooks', 'Resend email', 'Orders dashboard'] },
        { week: 'Week 5', focus: 'Admin + Quality', tasks: ['Artisan dashboard', 'Admin panel', 'E2E tests', 'Security review'] },
        { week: 'Week 6', focus: 'Deploy + Launch', tasks: ['CI/CD GitHub Actions', 'Vercel prod', 'Sentry monitoring', 'Posthog analytics'] },
      ],
      whyTitle: 'Why Claude Code is ideal for this',
      whyPoints: [
        'Switch models per task — Haiku for boilerplate, Opus for critical logic',
        'CLAUDE.md with project conventions = automatic consistency across all code',
        '/plan before complex features prevents rewriting',
        'Isolated worktree for experimenting without risk on the current branch',
        'Headless in CI/CD: automatic security review on every PR',
      ],
    },
    plan: {
      sectionTitle: 'Planning phase',
      intro: "Don't write code on the first iteration. 2-3 hours of planning with Opus saves 2-3 days of refactoring.",
      steps: [
        {
          n: '01', title: 'Strategic brainstorm',
          model: 'Opus 5.5', thinking: 'ultrathink', modelClass: 'text-rose-400 bg-rose-500/10',
          why: 'Architectural decisions compound forever. Saving on thinking now = weeks lost later.',
          prompt: '> ultrathink. I want to build an e-commerce platform\n  for artisans with canvas customization.\n\n  Give me:\n  1. Complete MVP feature list (MoSCoW prioritization)\n  2. Stack comparison: Next.js vs Remix, Prisma vs Drizzle,\n     Stripe vs Paddle — with clear arguments\n  3. Major technical risks and mitigation\n  4. Realistic 6-week plan for 1 developer\n  5. What I can fully delegate to Claude vs. needs human decision',
          output: 'MoSCoW-prioritized list (15 features), detailed stack comparison, 3 risks with mitigation, week-by-week timeline, human/AI decision matrix.',
          tip: 'Save the output as PROJECT_BRIEF.md — it becomes context for the rest of the project.',
        },
        {
          n: '02', title: 'Generate CLAUDE.md',
          model: 'Opus 5.5', thinking: 'effort high', modelClass: 'text-rose-400 bg-rose-500/10',
          why: 'CLAUDE.md is the permanent system prompt. Investment in it now pays off every session.',
          prompt: '> /init\n\n# Then refine with Opus:\n> /effort high\n> Revise the generated CLAUDE.md. Add:\n  - Strict TypeScript conventions (no any, interface vs type)\n  - File structure for Next.js App Router\n  - Rule: Fabric.js ONLY in isolated hooks\n  - Commit message format (Conventional Commits)\n  - How to run DB migrations (prisma migrate dev)\n  - Prices stored as Float, displayed with formatPrice()',
          output: 'CLAUDE.md with ~300 lines: directory structure, TS conventions, Fabric.js rules, commit format, pre-commit checklist.',
          tip: 'Test with: `> Create a ProductCard component` — verify it follows conventions without extra instructions.',
        },
        {
          n: '03', title: 'Prisma schema + relations',
          model: 'Opus 5.5', thinking: 'effort xhigh', modelClass: 'text-rose-400 bg-rose-500/10',
          why: "Schema is the foundation. A wrong Product/Order relation costs a painful migration later.",
          prompt: '> /effort xhigh\n> Design Prisma schema for ArtisanShop:\n  - User (client + artisan, same table with role)\n  - Product (with color/material variants)\n  - Customization (JSON canvas state + preview URL)\n  - Order + OrderItem (product snapshot at purchase)\n  - Review (with moderation)\n\n  Include: indexes, cascade rules, status enums,\n  cuid() for all IDs. Explain trade-offs.',
          output: 'Complete schema ~120 lines, 8 models, comments for each architectural decision.',
          warn: 'Review the schema before the first migration. Post-migration changes cost more.',
        },
        {
          n: '04', title: 'API contract with /plan',
          model: 'Sonnet 5', thinking: '', modelClass: 'text-amber-400 bg-amber-500/10',
          why: 'API routes are mechanical once the schema is clear. Sonnet is perfect for structured planning.',
          prompt: '> /plan Define all API routes for the MVP:\n  - Auth (NextAuth callbacks)\n  - Products (CRUD + filters)\n  - Customizations (save/load canvas state)\n  - Orders (create, status, history)\n  - Stripe webhooks\n  - Admin routes\n\n  For each: HTTP method, path, request/response shape,\n  required middleware, who has access.',
          output: 'Plan with 24 routes, grouped by domain, TypeScript types for each request/response.',
          tip: 'Approve the plan and save it. Claude will respect the contract throughout implementation.',
        },
        {
          n: '05', title: 'UI component tree',
          model: 'Sonnet 5', thinking: '', modelClass: 'text-amber-400 bg-amber-500/10',
          why: 'Server vs. Client Components needs planning. Easier now than migrating later.',
          prompt: '> Create the component tree for:\n  - /products (catalog)\n  - /products/[slug] (detail + customizer)\n  - /cart\n  - /checkout\n\n  Mark each: SC (Server) or CC (Client).\n  Explain why. Identify the "use client" boundary.',
          output: 'Text diagram with SC/CC marked, explanations for key Server/Client boundaries.',
          tip: 'Save the diagram — it will guide you when creating the actual files.',
        },
      ],
    },
    build: {
      sectionTitle: 'Implementation phase',
      intro: 'Follow the plan. Switch models based on the complexity and risk of each task.',
      steps: [
        {
          n: '01', title: 'Scaffold + tooling',
          model: 'Haiku 4.5', thinking: '', modelClass: 'text-cyan-400 bg-cyan-500/10',
          why: 'Setup is repetitive and follows known recipes. Haiku does it fast and cheap (~$0.02).',
          prompt: 'claude -p "Create a Next.js 16 project with:\n  npx create-next-app@latest artisan-shop --typescript --tailwind --app\n\n  Install and configure:\n  - shadcn/ui (full init)\n  - Prisma 7 with Neon adapter\n  - NextAuth v5, Zustand, Tailwind v4\n\n  Commit after each major step." \\\n  --model claude-haiku-4-5 \\\n  --dangerously-skip-permissions',
          output: 'Scaffolded project, all dependencies installed, base configs ready.',
          warn: 'Do not run --dangerously-skip-permissions on your main machine without an isolated container.',
        },
        {
          n: '02', title: 'Complete auth system',
          model: 'Opus 5.5', thinking: 'effort high', modelClass: 'text-rose-400 bg-rose-500/10',
          why: "Auth has serious security implications. A vulnerability = account takeover. Don't cut costs here.",
          prompt: '> /effort high\n> Implement complete auth with NextAuth v5:\n  - Providers: Email (magic link) + Google OAuth\n  - JWT sessions with refresh\n  - Middleware for protected routes (/dashboard, /checkout, /admin)\n  - Role-based: client vs. artisan vs. admin\n  - Rate limiting on auth endpoints\n\n  Follow CLAUDE.md conventions. Write tests for\n  each flow (login, signup, logout, unauthorized).',
          output: 'lib/auth.ts, middleware.ts, NextAuth route handler, comprehensive tests for all flows.',
          warn: 'Manually test all auth flows before moving on.',
        },
        {
          n: '03', title: 'DB migrations + seed',
          model: 'Sonnet 5', thinking: '', modelClass: 'text-amber-400 bg-amber-500/10',
          why: 'Migrations follow the already-approved schema. Mechanical task for Sonnet.',
          prompt: '> Apply the approved Prisma schema.\n  Create:\n  1. First migration: npx prisma migrate dev --name init\n  2. Realistic seed: 3 artisans, 15 products, 2 customers,\n     5 orders with different statuses\n  3. formatPrice() helper in lib/utils.ts\n  4. Verify with npx prisma studio',
          output: 'Initial migration applied, realistic seed data, TypeScript-typed helpers.',
          tip: 'Run `npx prisma studio` — visualize seed data before writing the first UI line.',
        },
        {
          n: '04', title: 'Product catalog + filters',
          model: 'Sonnet 5', thinking: '', modelClass: 'text-amber-400 bg-amber-500/10',
          why: 'Standard CRUD UI. Sonnet handles this well without Opus overhead.',
          prompt: '> Create the /products page with:\n  - Server Component with searchParams filters\n  - Filters: category, price (range), artisan, availability\n  - ProductCard with image, formatted price, rating\n  - Cursor-based pagination (10/page)\n  - Loading skeleton with Suspense\n  - URL-based filters (shareable links)',
          output: 'Working catalog with filters, pagination, skeletons. Server-rendered, SEO-ready.',
          tip: 'URL-based filters are critical for SEO and UX. Verify they persist on refresh.',
        },
        {
          n: '05', title: 'Canvas customizer (Fabric.js)',
          model: 'Opus 5.5', thinking: 'effort xhigh', modelClass: 'text-rose-400 bg-rose-500/10',
          why: 'Canvas + React lifecycle = complex. State must sync with Zustand without unnecessary re-renders.',
          prompt: '> /effort xhigh\n> Implement canvas customizer:\n\n  MANDATORY rules from CLAUDE.md:\n  - All Fabric.js logic EXCLUSIVELY in hooks:\n    useCanvas.ts, useCanvasObjects.ts, useCanvasSave.ts\n  - UI page calls ONLY the hooks API\n\n  Features:\n  - Text (font, color, size, position)\n  - Custom image upload with crop\n  - Undo/redo (max 20 steps)\n  - Save state as JSON in Customization model\n  - PNG preview for order thumbnail\n  - Touch events for mobile',
          output: '4 hooks + UI component consuming them. Canvas state in Zustand.',
          warn: 'Test the canvas on mobile BEFORE continuing. Fabric.js touch events have known quirks.',
        },
        {
          n: '06', title: 'Stripe checkout + webhooks',
          model: 'Opus 5.5', thinking: 'effort xhigh', modelClass: 'text-rose-400 bg-rose-500/10',
          why: 'Code that handles money. Webhooks must be idempotent — an error = lost or duplicate order.',
          prompt: '> /effort xhigh\n> Implement complete Stripe checkout:\n  1. PaymentIntent from cart (metadata: userId, items)\n  2. Webhook handler /api/stripe/webhook:\n     - payment_intent.succeeded → Order + OrderItems\n     - payment_intent.payment_failed → notify user\n     - charge.refunded → update order status\n  3. Idempotency with Stripe event ID\n  4. Order confirmation email via Resend',
          output: 'Complete checkout flow, idempotent webhooks, confirmation email, full error handling.',
          warn: 'Test locally with Stripe CLI: `stripe listen --forward-to localhost:3000/api/stripe/webhook`',
        },
        {
          n: '07', title: 'Admin panel CRUD',
          model: 'Haiku 4.5', thinking: '', modelClass: 'text-cyan-400 bg-cyan-500/10',
          why: 'Repetitive CRUD on already-defined models. Haiku generates fast and cheap.',
          prompt: 'claude -p "Generate admin panel CRUD for:\n  - Products (list, create, edit, delete, toggle active)\n  - Users (list, search, ban, change role)\n  - Orders (list, filter status, update, refund)\n  - Artisans (approve requests, suspend)\n\n  Use shadcn/ui Table, Dialog, Form.\n  Protect with middleware admin role check.\n  Confirm before destructive actions." \\\n  --model claude-haiku-4-5',
          output: 'Complete admin panel with all CRUD pages, confirmation dialogs, route protection.',
          tip: 'Quick verify with Sonnet: `> /review on app/admin/ — look for security issues`',
        },
      ],
      proTipsTitle: 'Habits during the Build phase',
      proTips: [
        'Commit after each complete feature: `> /commit` — Claude writes the Conventional Commits message',
        '/compact when the session exceeds 50k tokens — save 80% without losing context',
        'Separate session per feature — do not mix auth with canvas in one long session',
        'If Claude is stuck after 2 iterations → escalate to Opus + ultrathink',
        'Isolated worktree for experimenting: `> Work in an isolated worktree to test X`',
      ],
    },
    quality: {
      sectionTitle: 'Quality assurance',
      intro: "Quality doesn't mean 100% coverage. It means: you don't ship critical bugs to production.",
      steps: [
        {
          n: '01', title: 'Unit tests in CI',
          model: 'Haiku 4.5', thinking: '', modelClass: 'text-cyan-400 bg-cyan-500/10',
          why: 'Mechanical generation from existing code. Run in CI = minimal cost per PR.',
          prompt: '# In .github/workflows/tests.yml:\n- name: Generate missing unit tests\n  run: |\n    for file in src/lib/*.ts src/utils/*.ts; do\n      if [ ! -f "${file%.ts}.test.ts" ]; then\n        claude -p "Write Vitest tests for $file.\n        Cover: happy path, edge cases, error states.\n        Do not mock internal implementations." \\\n          --model claude-haiku-4-5 \\\n          --allowedTools "Read,Write"\n      fi\n    done',
          output: 'Unit tests auto-generated for all utilities without existing tests.',
          tip: 'Add to .claude/hooks: auto-generate test when creating a new file in src/lib/',
        },
        {
          n: '02', title: 'Integration tests API',
          model: 'Sonnet 5', thinking: '', modelClass: 'text-amber-400 bg-amber-500/10',
          why: 'Integration tests require understanding the full request→DB→response flow.',
          prompt: '> Write integration tests for all API routes in app/api/:\n\n  Setup: separate test database (Neon branch)\n  Per route:\n  - Valid request → correct response + DB state\n  - Invalid input → 400 with clear error\n  - Unauthorized → 401 / Not found → 404\n  - Route-specific edge case\n\n  Use Vitest + MSW to mock Stripe/Resend.',
          output: 'Complete suite ~60 tests, all passing on test DB.',
          tip: 'Neon allows DB branches — create a separate `test` branch.',
        },
        {
          n: '03', title: 'E2E tests Playwright',
          model: 'Sonnet 5', thinking: '', modelClass: 'text-amber-400 bg-amber-500/10',
          why: 'E2E tests the real user flow. Requires UX understanding — suited for Sonnet.',
          prompt: '> Write Playwright E2E tests for critical flows:\n  1. Guest: catalog → product → cart → checkout\n  2. Auth: register → login → orders → logout\n  3. Customizer: canvas → add text → save → cart\n  4. Payment: checkout with Stripe test card\n  5. Admin: login → approve artisan → suspend user\n\n  Page object model. Run on Chromium + Mobile Safari.',
          output: '5 E2E suites, page objects for all main pages, CI-ready.',
          tip: '`npx playwright test --reporter=html` — visual report with screenshots on failures.',
        },
        {
          n: '04', title: 'Performance audit',
          model: 'Opus 5.5', thinking: 'ultrathink', modelClass: 'text-rose-400 bg-rose-500/10',
          why: 'Perf audit requires systemic thinking. Opus sees subtle relationships between issues.',
          prompt: '> ultrathink. Complete performance audit:\n  1. Lighthouse on: /, /products, /products/[slug]\n     Target: LCP < 2.5s, CLS < 0.1, FID < 100ms\n  2. Bundle analysis with @next/bundle-analyzer\n  3. N+1 Prisma queries, missing indexes, unoptimized images\n  4. Top 10 optimizations ranked by impact/effort\n  5. Implement top 5 without breaking functionality',
          output: 'Lighthouse report before/after, bundle analysis, top 10 fixes, first 5 implemented.',
          warn: "Don't optimize prematurely. Run audit AFTER all features are complete.",
        },
        {
          n: '05', title: 'OWASP security review',
          model: 'Opus 5.5', thinking: 'ultrathink', modelClass: 'text-rose-400 bg-rose-500/10',
          why: 'Security vulnerabilities have irreparable consequences.',
          prompt: '> ultrathink. Complete OWASP Top 10 security audit:\n\n  Mandatory focus:\n  - Injection: Prisma queries with user input (search, filters)\n  - Broken Auth: session management, JWT expiry\n  - XSS: canvas customizations rendered in HTML\n  - CSRF: Stripe webhooks, Next.js form actions\n  - Rate limiting: auth endpoints, order creation\n  - Secrets: env vars exposed in client bundle\n\n  Per vulnerability: severity, demo exploit, fix.',
          output: 'Structured report: 0 critical, N medium, N low — fixes implemented for critical and medium.',
          warn: 'Do not ship to production without addressing all critical and medium vulnerabilities.',
        },
      ],
    },
    deploy: {
      sectionTitle: 'Deploy to production',
      intro: "Deployment is not a one-time event — it's a system. Automate once, benefit on every push.",
      steps: [
        {
          n: '01', title: 'GitHub Actions pipeline',
          model: 'Sonnet 5', thinking: '', modelClass: 'text-amber-400 bg-amber-500/10',
          why: 'CI/CD is mechanical and well documented. Sonnet knows GitHub Actions perfectly.',
          prompt: '> Create a complete GitHub Actions workflow (.github/workflows/ci.yml):\n\n  Triggers: push to main, PR to main\n  Jobs (parallel where possible):\n  1. lint-types: ESLint + TypeScript check\n  2. unit-tests: Vitest on Node 22\n  3. integration-tests: Vitest with Neon test branch\n  4. e2e: Playwright Chromium (PRs only)\n  5. security-scan: claude -p review --allowedTools Read,Grep\n  6. build: next build (main only)\n  7. deploy-preview: Vercel preview (PR)\n  8. deploy-prod: Vercel prod (main, after all checks green)',
          output: 'Complete workflow, jobs parallelized, secrets documented in comments.',
          tip: 'Parallel jobs: CI from 12 min → 4 min.',
        },
        {
          n: '02', title: 'Pre-commit hooks',
          model: 'Sonnet 5', thinking: '', modelClass: 'text-amber-400 bg-amber-500/10',
          why: 'Hooks catch problems locally, before CI. They save feedback loop time.',
          prompt: '> Configure .claude/hooks in settings.json:\n\n  PreToolUse (Bash): block rm -rf and git push --force\n  PostToolUse (Write): TypeScript check on modified files\n\n  And .git/hooks/pre-commit:\n  - ESLint on staged files\n  - Check: no console.log in src/\n  - Check: TODOs have ticket ID (TODO: #123)',
          output: 'Hooks configured and verified with a test commit.',
          tip: 'Claude Hooks (settings.json) and git hooks complement each other.',
        },
        {
          n: '03', title: 'Auto changelog CI',
          model: 'Haiku 4.5', thinking: '', modelClass: 'text-cyan-400 bg-cyan-500/10',
          why: 'Repetitive format from commit messages. Perfect task for Haiku in CI.',
          prompt: '# In .github/workflows/release.yml:\n- name: Generate changelog\n  run: |\n    COMMITS=$(git log --oneline $PREV_TAG..HEAD)\n    claude -p "Changelog in Keep a Changelog format:\n    ## [Unreleased]\n    From commits: $COMMITS\n    Categories: Added, Changed, Fixed, Security" \\\n      --model claude-haiku-4-5 \\\n      --output-format text >> CHANGELOG.md\n    git add CHANGELOG.md\n    git commit -m "chore: update changelog [skip ci]"',
          output: 'CHANGELOG.md auto-updated on every release.',
        },
        {
          n: '04', title: 'Vercel deploy + env vars',
          model: 'Sonnet 5', thinking: '', modelClass: 'text-amber-400 bg-amber-500/10',
          why: 'Vercel deploy is procedural. Sonnet correctly configures env vars and domains.',
          prompt: '> Configure Vercel deploy for production:\n  1. vercel.json: rewrites, security headers (CSP, HSTS)\n  2. List env vars with type (secret vs. plain)\n  3. Neon: main branch = prod, develop = preview\n  4. Custom domain + auto SSL\n  5. Verify CORS for Stripe webhooks\n  6. Test: vercel deploy --prod',
          output: 'vercel.json with security headers, env vars documented, working deployment.',
          tip: 'Neon branching: prod on main, preview deployments on develop.',
        },
        {
          n: '05', title: 'Monitoring: Sentry + Posthog',
          model: 'Sonnet 5', thinking: '', modelClass: 'text-amber-400 bg-amber-500/10',
          why: 'Documented SDK integration. Direct task for Sonnet.',
          prompt: '> Integrate complete monitoring:\n\n  Sentry:\n  - Error tracking: client + server + Edge\n  - Source maps for clear stack traces\n  - Alert: critical errors → immediate email\n\n  Posthog:\n  - Custom events: add_to_cart, checkout_started,\n    order_completed, customizer_saved\n  - Feature flags for gradual rollout\n\n  Verify: no PII (email, card) in events.',
          output: 'Sentry + Posthog integrated, custom events set, alerting configured.',
          warn: 'Check GDPR compliance for Posthog — may require a consent banner.',
        },
      ],
    },
    modele: {
      sectionTitle: 'Model & thinking matrix',
      intro: 'Wrong model choice = paying 5× more for no benefit or pinching pennies and getting poor output. Follow the matrix.',
      matrixTitle: 'Task → Model → Thinking → Why',
      matrix: [
        { cat: 'Architectural decisions', model: 'Opus 5.5', thinking: 'ultrathink', cost: '$$$$', why: 'Compound forever. Mistake costs weeks.', modelClass: 'text-rose-400' },
        { cat: 'Auth + security', model: 'Opus 5.5', thinking: 'effort high', cost: '$$$', why: "Vulnerability = catastrophe. Don't cut costs.", modelClass: 'text-rose-400' },
        { cat: 'Payments / Stripe', model: 'Opus 5.5', thinking: 'effort xhigh', cost: '$$$', why: 'Real money, critical idempotent logic.', modelClass: 'text-rose-400' },
        { cat: 'Canvas / complex state', model: 'Opus 5.5', thinking: 'effort xhigh', cost: '$$$', why: 'Subtle lifecycle + sync, hard to debug.', modelClass: 'text-rose-400' },
        { cat: 'Unclear bug, stuck 2+ iters', model: 'Opus 5.5', thinking: 'ultrathink', cost: '$$$$', why: "Escalate when Sonnet's spinning its wheels.", modelClass: 'text-rose-400' },
        { cat: 'Prod DB migrations', model: 'Opus 5.5', thinking: 'effort xhigh', cost: '$$$', why: 'Risk of data loss. Worth the extra thinking.', modelClass: 'text-rose-400' },
        { cat: 'Feature implementation', model: 'Sonnet 5', thinking: '—', cost: '$$', why: 'Default sweet spot: quality + cost.', modelClass: 'text-amber-400' },
        { cat: 'UI / components', model: 'Sonnet 5', thinking: '—', cost: '$$', why: 'Design-driven, iterative.', modelClass: 'text-amber-400' },
        { cat: 'Refactoring', model: 'Sonnet 5', thinking: 'effort high', cost: '$$', why: 'Requires understanding existing context.', modelClass: 'text-amber-400' },
        { cat: 'Code review', model: 'Sonnet 5', thinking: 'effort high', cost: '$$', why: 'Nuanced judgment, not regexp scan.', modelClass: 'text-amber-400' },
        { cat: 'Integration tests', model: 'Sonnet 5', thinking: '—', cost: '$$', why: 'Requires flow understanding.', modelClass: 'text-amber-400' },
        { cat: 'Boilerplate CRUD', model: 'Haiku 4.5', thinking: '—', cost: '$', why: 'Repetitive, fixed pattern. 5× cheaper.', modelClass: 'text-cyan-400' },
        { cat: 'Bulk test generation', model: 'Haiku 4.5', thinking: '—', cost: '$', why: 'High volume, predictable template.', modelClass: 'text-cyan-400' },
        { cat: 'Documentation', model: 'Haiku 4.5', thinking: '—', cost: '$', why: 'Mechanical, fixed format.', modelClass: 'text-cyan-400' },
        { cat: 'CI/CD automation', model: 'Haiku 4.5', thinking: '—', cost: '$', why: 'Runs on every PR — cost per run matters.', modelClass: 'text-cyan-400' },
      ],
      escalationTitle: 'Escalation rule',
      escalation: [
        'Start with Sonnet 5 — set "model": "sonnet" in .claude/settings.json (the Claude Code default is Opus 5.5)',
        'Stuck after 2 iterations → escalate to Opus 5.5 + /effort high',
        'Problem is clear but complex → Opus 5.5 + /effort xhigh directly',
        'Strategic decision or high risk → Opus 5.5 + ultrathink from the start',
        'If even Opus fails or it is a long-horizon agent → Claude Fable 5.1',
        'Switching models mid-session keeps the conversation but invalidates the prompt cache — do not hop between models every message',
      ],
      costTitle: 'Estimated cost per model (per 1M tokens)',
      costs: [
        { model: 'Haiku 4.5', input: '$1', output: '$5', useCase: 'CI/CD, boilerplate, docs — >100 tasks/day' },
        { model: 'Sonnet 5', input: '$2', output: '$10', useCase: 'Features, UI, tests — daily standard task' },
        { model: 'Opus 5.5', input: '$4', output: '$20', useCase: 'Architecture, security, payments — the big decisions' },
      ],
      rulesTitle: 'Practical rules',
      rules: [
        'A project like ArtisanShop: ~70% Sonnet, ~20% Haiku, ~10% Opus → ~$9-13 total',
        "Don't use Opus for tasks that don't compound to production",
        'Haiku in CI = fixed, predictable cost regardless of PR count',
        'Aggressive /compact on long sessions — reduces cost by 70-80%',
        'Automatic prompt caching on system prompt — 90% savings',
      ],
    },
  },
}

// ─── Helper UI ────────────────────────────────────────────────────────────────

function ModelBadge({ model, thinking, cls }: { model: string; thinking: string; cls: string }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className={`rounded-full px-3 py-1 text-xs font-bold ${cls}`}>{model}</span>
      {thinking && (
        <span className="rounded-full bg-zinc-800 px-3 py-1 font-mono text-xs text-zinc-300">{thinking}</span>
      )}
    </div>
  )
}

function StepCard({ step }: { step: Step }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-zinc-800 font-mono text-xs font-bold text-zinc-400">
            {step.n}
          </span>
          <div>
            <h3 className="font-semibold text-white">{step.title}</h3>
            <p className="mt-0.5 text-xs leading-relaxed text-zinc-500">{step.why}</p>
          </div>
        </div>
        <ModelBadge model={step.model} thinking={step.thinking} cls={step.modelClass} />
      </div>

      <pre className="mb-3 overflow-x-auto rounded-lg bg-zinc-950 p-4 font-mono text-xs leading-relaxed text-zinc-300">
        <code>{step.prompt}</code>
      </pre>

      {step.output && (
        <p className="mb-2 rounded-lg bg-zinc-950/60 px-4 py-2.5 text-xs leading-relaxed text-zinc-400">
          <span className="font-semibold text-zinc-300">→ </span>{step.output}
        </p>
      )}

      {step.tip && (
        <div className="mt-2 flex gap-2 rounded-lg bg-cyan-500/5 border border-cyan-500/10 px-3 py-2 text-xs text-cyan-300">
          <span className="flex-shrink-0 font-bold">💡</span>
          <span>{step.tip}</span>
        </div>
      )}

      {step.warn && (
        <div className="mt-2 flex gap-2 rounded-lg bg-amber-500/5 border border-amber-500/10 px-3 py-2 text-xs text-amber-300">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
          <span>{step.warn}</span>
        </div>
      )}
    </div>
  )
}

// ─── Tab components ───────────────────────────────────────────────────────────

function TabScenariu() {
  const { lang } = useApp()
  const c = CONTENT[lang].scenariu

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-6">
        <h3 className="mb-2 text-xl font-bold text-white">{c.projectTitle}</h3>
        <p className="mb-3 leading-relaxed text-zinc-300">{c.projectDesc}</p>
        <p className="text-xs text-zinc-500">{c.constraint}</p>
      </div>

      <div>
        <h3 className="mb-4 font-semibold text-white">{c.stackTitle}</h3>
        <div className="overflow-x-auto rounded-xl border border-zinc-800">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-zinc-800/50">
              {c.stack.map((row, i) => (
                <tr key={i} className="bg-zinc-950 transition-colors hover:bg-zinc-900/30">
                  <td className="w-1/3 px-4 py-3 font-medium text-zinc-400">{row.layer}</td>
                  <td className="px-4 py-3 font-mono text-xs text-cyan-300">{row.tech}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="mb-4 font-semibold text-white">{c.featuresTitle}</h3>
        <div className="grid gap-2 sm:grid-cols-2">
          {c.features.map((f, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-zinc-400">
              <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-cyan-500/60" />
              {f}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 font-semibold text-white">{c.timelineTitle}</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {c.weeks.map((w, i) => (
            <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
              <div className="mb-1 text-xs font-bold text-cyan-400">{w.week}</div>
              <div className="mb-2 text-sm font-semibold text-white">{w.focus}</div>
              <ul className="space-y-0.5">
                {w.tasks.map((t, j) => (
                  <li key={j} className="text-xs text-zinc-500">· {t}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="mb-4 font-semibold text-white">{c.whyTitle}</h3>
        <ul className="space-y-2">
          {c.whyPoints.map((p, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
              <ChevronRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-cyan-400" />
              {p}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function TabPhase({ content }: { content: PhaseContent }) {
  return (
    <div className="space-y-6">
      <p className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-5 py-4 text-sm leading-relaxed text-zinc-400">
        {content.intro}
      </p>
      {content.steps.map((step) => (
        <StepCard key={step.n} step={step} />
      ))}
    </div>
  )
}

function TabBuild() {
  const { lang } = useApp()
  const c = CONTENT[lang].build

  return (
    <div className="space-y-6">
      <p className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-5 py-4 text-sm leading-relaxed text-zinc-400">
        {c.intro}
      </p>
      {c.steps.map((step) => (
        <StepCard key={step.n} step={step} />
      ))}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
        <h3 className="mb-4 font-semibold text-white">{c.proTipsTitle}</h3>
        <ul className="space-y-2">
          {c.proTips.map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
              <ChevronRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-cyan-400" />
              <span className="font-mono text-xs text-zinc-300">{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function TabModele() {
  const { lang } = useApp()
  const c = CONTENT[lang].modele

  return (
    <div className="space-y-8">
      <p className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-5 py-4 text-sm leading-relaxed text-zinc-400">
        {c.intro}
      </p>

      <div>
        <h3 className="mb-4 font-semibold text-white">{c.matrixTitle}</h3>
        <div className="overflow-x-auto rounded-xl border border-zinc-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900">
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400">Task</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400">Model</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400">Thinking</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400">Cost</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400">De ce / Why</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {c.matrix.map((row, i) => (
                <tr key={i} className="bg-zinc-950 transition-colors hover:bg-zinc-900/30">
                  <td className="px-4 py-3 text-xs text-zinc-300">{row.cat}</td>
                  <td className={`px-4 py-3 text-xs font-bold ${row.modelClass}`}>{row.model}</td>
                  <td className="px-4 py-3 font-mono text-xs text-zinc-400">{row.thinking}</td>
                  <td className="px-4 py-3 font-mono text-xs text-zinc-500">{row.cost}</td>
                  <td className="px-4 py-3 text-xs text-zinc-500">{row.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
          <h3 className="mb-4 font-semibold text-white">{c.escalationTitle}</h3>
          <ol className="space-y-2">
            {c.escalation.map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-zinc-400">
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-zinc-800 font-mono text-xs font-bold text-zinc-500">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
          <h3 className="mb-4 font-semibold text-white">{c.rulesTitle}</h3>
          <ul className="space-y-2">
            {c.rules.map((rule, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-zinc-400">
                <ChevronRight className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-cyan-400" />
                {rule}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <h3 className="mb-4 font-semibold text-white">{c.costTitle}</h3>
        <div className="overflow-x-auto rounded-xl border border-zinc-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900">
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400">Model</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-zinc-400">Input</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-zinc-400">Output</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400">Best for</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {c.costs.map((row, i) => {
                const cls = i === 0 ? 'text-cyan-400' : i === 1 ? 'text-amber-400' : 'text-rose-400'
                return (
                  <tr key={i} className="bg-zinc-950 transition-colors hover:bg-zinc-900/30">
                    <td className={`px-4 py-3 text-xs font-bold ${cls}`}>{row.model}</td>
                    <td className="px-4 py-3 text-center font-mono text-xs text-zinc-300">{row.input}</td>
                    <td className="px-4 py-3 text-center font-mono text-xs text-zinc-300">{row.output}</td>
                    <td className="px-4 py-3 text-xs text-zinc-500">{row.useCase}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function FullProjectWorkflow() {
  const [active, setActive] = useState<TabId>('scenariu')
  const { lang } = useApp()
  const c = CONTENT[lang]

  const TABS: Tab[] = [
    { id: 'scenariu', label: c.tabs.scenariu, icon: <Target className="h-3.5 w-3.5" /> },
    { id: 'plan',     label: c.tabs.plan,     icon: <Calendar className="h-3.5 w-3.5" /> },
    { id: 'build',    label: c.tabs.build,    icon: <Code2 className="h-3.5 w-3.5" /> },
    { id: 'quality',  label: c.tabs.quality,  icon: <Shield className="h-3.5 w-3.5" /> },
    { id: 'deploy',   label: c.tabs.deploy,   icon: <Rocket className="h-3.5 w-3.5" /> },
    { id: 'modele',   label: c.tabs.modele,   icon: <Layers className="h-3.5 w-3.5" /> },
  ]

  return (
    <section id="proiect-complet" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <span className="mb-4 inline-block text-sm font-semibold tracking-widest text-cyan-400 uppercase">
            {c.pageLabel}
          </span>
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">{c.pageTitle}</h2>
          <p className="mx-auto max-w-2xl text-zinc-400">{c.pageDesc}</p>
        </div>

        <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {c.stats.map((s, i) => (
            <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 text-center">
              <div className="text-2xl font-bold text-cyan-400">{s.key}</div>
              <div className="mt-1 text-sm text-zinc-400">{s.label}</div>
            </div>
          ))}
        </div>

        <div
          className="sticky top-16 z-10 mb-8 overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/90 backdrop-blur"
          style={{ scrollbarWidth: 'none' }}
        >
          <div className="flex p-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                  active === tab.id
                    ? 'bg-cyan-500/15 text-cyan-400'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-6 sm:p-8">
          {active === 'scenariu' && <TabScenariu />}
          {active === 'plan'     && <TabPhase content={c.plan} />}
          {active === 'build'    && <TabBuild />}
          {active === 'quality'  && <TabPhase content={c.quality} />}
          {active === 'deploy'   && <TabPhase content={c.deploy} />}
          {active === 'modele'   && <TabModele />}
        </div>
      </div>
    </section>
  )
}
