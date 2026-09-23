# CLAUDE.md — CCC (Claude Code Course)

## Project Overview

**Name:** CCC — Claude Code Course
**Type:** Multi-page SPA cu React Router
**Scop:** Curs interactiv bilingv (RO/EN) pentru Claude Code CLI — 14 pagini cu conținut educațional real, tehnic, fără placeholder-e.
**URL local:** http://localhost:3001 (sau port disponibil dacă 3001 e ocupat — Vite alege automat 3002, 3003... etc.)

---

## Tech Stack

| Layer | Tehnologie |
|---|---|
| Framework | React 19 + React Router v7 |
| Build | Vite 8 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite` plugin) |
| Icons | lucide-react |
| Testing | @playwright/test (audit vizual) |
| Dev Port | 3001 (fallback automat) |

---

## Structura proiectului

```
ccc/
  src/
    components/
      Navbar.tsx              # Fixed nav: 3 primary links + "Mai mult" dropdown (overflow)
      Footer.tsx              # Footer cu link-uri
      ScrollToTop.tsx         # useLocation hook pentru scroll la schimbarea rutei
      PageLayout.tsx          # Wrapper prev/next + progress dots; PAGES array = sursa de adevăr
      CodeBlock.tsx           # Code component cu copy-to-clipboard

      # Componente content tab-based (toate au sticky tabs + stats strip)
      ReasoningModes.tsx      # 4 tabs: Moduri, Exemple, API, Strategii
      PromptingTips.tsx       # 6 tabs: Anatomie, Interacțiune CC, Patternuri, CLAUDE.md, Anti-patterns, Template-uri
      ModelsGuide.tsx         # 5 tabs: Modele, Prețuri, Selectare, Configurare, Capabilități
      TokenManagement.tsx     # 5 tabs: Bazele, Context Window, Economii, Prompt Caching, Monitorizare
      AutomationGuide.tsx     # 5 tabs: Headless, CI/CD, Hooks, Scripturi, Securitate
      SkillsGuide.tsx         # 5 tabs: Ce sunt Skills, Structura, Invocare, Avansat, Exemple
                              #   Tab Exemple: bibliotecă de 36 skills copyable (filtru pe categorie)
                              #   Categorii: Git | Calitate | Testing | Docs | Dev | Community | Caveman
                              #   ALL_SKILLS (20) + COMMUNITY_SKILLS (10) + CAVEMAN_SKILLS (6)
                              #   Tot conținutul SKILL.md este în engleză (pentru copiere directă)
      Workflows.tsx           # 6 workflow scenarii end-to-end
      FullProjectWorkflow.tsx # 6 tabs: Scenariu, Plan, Build, Quality, Deploy, Modele
                              #   Scenariu: ArtisanShop e-commerce, stack, timeline 6 săptămâni
                              #   Plan→Deploy: 30 step cards cu prompt real + model badge + thinking mode
                              #   Modele: matrice completă task→model→thinking→cost, escalation rule
                              #   Accent cyan, bilingv RO/EN

      ToolsSystem.tsx         # 5 tabs: Prezentare, Fișiere, Căutare, Shell & Web, Permisiuni
                              #   Accent blue, bilingv RO/EN

      # Componente content simple (single-scroll)
      Basics.tsx              # /instalare — instalare și setup
      CliCommands.tsx         # /comenzi — referință comenzi CLI
      AdvancedFeatures.tsx    # /avansat — funcționalități avansate
      QuickReference.tsx      # /referinta — cheat sheet
      Hero.tsx                # NEUTILIZAT — rămâne în repo, homepage rescris inline

    pages/
      HomePage.tsx            # "/" — AnimatedTerminal (3 scenarii), stats strip, feature cards,
                              #       course index cu PAGE_META + difficulty badges, bottom CTA
      InstallarePage.tsx      # "/instalare"
      RationamentPage.tsx     # "/rationament"
      ToolsPage.tsx           # "/tools"
      ComenziPage.tsx         # "/comenzi"
      PromptingPage.tsx       # "/prompting"
      ModelsPage.tsx          # "/modele"
      TokenuriPage.tsx        # "/tokenuri"
      AutomationPage.tsx      # "/automatizare"
      AvansatPage.tsx         # "/avansat"
      SkillsPage.tsx          # "/skills"
      WorkflowsPage.tsx       # "/workflows"
      ProiectCompletPage.tsx  # "/proiect-complet"
      ReferintaPage.tsx       # "/referinta"

    App.tsx                   # BrowserRouter + Routes (14 rute)
    index.css                 # Tailwind v4 import + custom theme + animații
    main.tsx

  index.html                  # lang="ro", dark class pe html
  vite.config.ts              # Vite config cu plugin-uri React + Tailwind
  tsconfig.json               # strict mode activat
  pw-audit.mjs                # Audit vizual original (tokenuri-specific)
  pw-light-audit.mjs          # Audit light mode — toate 14 paginile + tab-uri (node pw-light-audit.mjs)
  pw-light-zoom.mjs           # Zoom-in pe zone specifice în light mode (node pw-light-zoom.mjs)
  pw-screenshots/             # Output screenshots din Playwright (light/ subdirector)
  CLAUDE.md                   # acest fișier
```

---

## Rute (Routes) — 14 pagini

| Path | Pagină | Componentă principală | Tab-uri |
|---|---|---|---|
| `/` | Home | HomePage | — |
| `/instalare` | Instalare | Basics | — |
| `/rationament` | Raționament | ReasoningModes | 4 |
| `/tools` | Tools | ToolsSystem | 5 |
| `/comenzi` | Comenzi | CliCommands | — |
| `/prompting` | Prompting | PromptingTips | 6 |
| `/modele` | Modele & Pricing | ModelsGuide | 5 |
| `/tokenuri` | Tokenuri | TokenManagement | 5 |
| `/automatizare` | Automatizare & CI/CD | AutomationGuide | 5 |
| `/avansat` | Avansat | AdvancedFeatures | — |
| `/skills` | Skills | SkillsGuide | 5 |
| `/workflows` | Workflows | Workflows | — |
| `/proiect-complet` | Proiect Complet | FullProjectWorkflow | 6 |
| `/referinta` | Cheat Sheet | QuickReference | — |

**Ordinea în navigare** (PAGES array în PageLayout.tsx — sursa de adevăr pentru prev/next și progress dots):
`/` → `/instalare` → `/rationament` → `/tools` → `/comenzi` → `/prompting` → `/modele` → `/tokenuri` → `/automatizare` → `/avansat` → `/skills` → `/workflows` → `/proiect-complet` → `/referinta`

---

## Navbar

Navbar folosește `PRIMARY_COUNT = 3` — primele 3 pagini din PAGES (excluzând Home) sunt afișate inline.
Restul (11 pagini) apar în dropdown-ul **"Mai mult ↓"** cu emoji + label.
Mobile menu afișează toate paginile.

---

## Pattern pagini cu tab-uri

Toate componentele mari respectă același pattern:

```tsx
// 1. Header cu badge "Lecția N" + titlu + descriere
// 2. Stats strip (4 carduri cu metrici cheie)
// 3. Sticky tabs (top-16, z-10, backdrop-blur)
//    - overflow-x-auto + scrollbarWidth: 'none' pentru mobile
//    - bg-zinc-900/90 cu border border-zinc-800
// 4. Tab content într-un rounded-xl border border-zinc-800 bg-zinc-950/50 p-6 sm:p-8
```

Culorile accent per pagină:
- `/rationament` → purple (`bg-purple-500/20 text-purple-400`)
- `/tools` → blue (`bg-blue-500/20 text-blue-400`)
- `/prompting` → amber (`bg-amber-500/20 text-amber-400`)
- `/modele` → purple (`bg-purple-500/20 text-purple-400`)
- `/tokenuri` → amber (`bg-amber-500/20 text-amber-400`)
- `/automatizare` → amber (`bg-amber-500/20 text-amber-400`)
- `/skills` → emerald (`bg-emerald-500/20 text-emerald-400`)
- `/proiect-complet` → cyan (`bg-cyan-500/15 text-cyan-400`)

---

## SkillsGuide.tsx — structură internă

Tab-uri: **Ce sunt Skills** | **Structura** | **Invocare** | **Avansat** | **Exemple**

Tab **Exemple** — bibliotecă de skills copyable:
- `ALL_SKILLS` (20 skills): Git (3) + Calitate (4) + Testing (3) + Docs (3) + Dev (7)
- `COMMUNITY_SKILLS` (10 skills): caveman, git-worktree, changelog, docker-first, create-pr, jira, linear, type-gen, release, explain-error
- `CAVEMAN_SKILLS` (6 skills): fix, why, doc, test, safe, rethink
- Filtru pe categorie: Toate | Git | Calitate | Testing | Docs | Dev | Community | Caveman
- Fiecare card se expandează → arată SKILL.md complet cu copy button
- Badge tokens: mic (emerald) / mediu (amber) / mare (red)
- **Tot conținutul SKILL.md este în engleză** — UI/descrierile cardurilor rămân în română

Tip `SkillCat`: `'all' | 'git' | 'calitate' | 'testing' | 'docs' | 'dev' | 'community' | 'caveman'`

---

## HomePage — structură internă

`AnimatedTerminal` — ciclu prin 3 scenarii (OAuth, CI debug, security scan) cu fade-in per linie.
`pageMeta` — în `src/i18n/translations.ts` → `home.pageMeta` (ro + en), cu `desc` și `badge` per rută.
`BADGE_COLORS` — în `HomePage.tsx`, Record cu clase Tailwind per rută (styling only, nu e în translations).
Difficulty badges: Start / Core / Avansat / Pro / Capstone / Ref.
`stats` și `heroPills` — funcții `(count: number) => [...]` în translations.ts. Numărul de lecții se derivă automat din `PAGES.slice(1).length` — nu edita manual cifra.
Secțiuni: hero split → stats strip → "De ce Claude Code?" (4 cards) → course index (grid 3 col) → bottom CTA gradient.

## Bilingv (RO/EN)

Toate componentele folosesc pattern-ul:
```tsx
const CONTENT: Record<'ro' | 'en', ContentShape> = { ro: {...}, en: {...} }
// În fiecare tab/funcție:
const { lang } = useApp()
const c = CONTENT[lang]
```
Stringurile UI sunt în `src/i18n/translations.ts` (nav, footer, layout, pages labels, pageMeta).
Conținut SKILL.md în tab Exemple → **mereu în engleză**, indiferent de limbă.

---

## Reguli & Convenții

### TypeScript
- **No `any`.** Toate variabilele și props au tipuri explicite.
- Folosește `interface` pentru prop objects, `type` pentru unions/aliases.
- TypeScript strict mode activat — build pică dacă există erori TS.
- Tipuri UI: `React.ReactNode` pentru children.

### Styling
- **Tailwind CSS v4** — import cu `@import "tailwindcss"` în index.css.
- Tema: dark mode (zinc-950 bg), amber-400/500 accente, design minimalist.
- Custom theme tokens în `@theme {}`: `--color-terminal`, `--color-amber-glow`.
- Nu folosi valori arbitrare (`w-[123px]`) decât dacă e strict necesar.

#### Light mode — reguli critice
Tema suportă light mode via clasa `html.light`. Toate overrides sunt în `src/index.css`.

- **Body bg**: `#f8f8f9` (off-white cald, nu alb pur).
- **Carduri**: `bg-zinc-900` → `#ffffff`; cardurile apar albe pe fundalul off-white.
- **Borders**: `border-zinc-800` → `#c8c8d0` (ușor mai vizibil decât zinc original).
- **Elevație carduri**: `rounded-xl.border-zinc-800` primesc `box-shadow` subtil automat.
- **Gradient-uri cu zinc-900/zinc-950**: Gradient stop-urile CSS NU sunt afectate de overrides `html.light .bg-zinc-*`. Elementele cu `bg-gradient-to-* via-zinc-900 to-zinc-950` rămân întunecate în light mode. **Soluție obligatorie: adaugă `preserve-dark` pe containerul respectiv** (ex: CTA section în HomePage).
- **`preserve-dark`**: Clasa izolează o zonă care rămâne întunecată indiferent de temă — text-white rămâne alb, bg-uri rămân întunecate. Folosit pe: AnimatedTerminal, CodeBlock, CTA section.
- **Divide utilities**: `divide-zinc-800` NU e acoperit automat de regula `border-zinc-800` — are propria regulă în CSS.
- **`bg-zinc-950` opacity variants**: Fiecare variantă (`/50`, `/60`, `/80`, `/90`, `/95`) are nevoie de propria regulă în CSS — nu sunt acoperite automat de regula `bg-zinc-950`. Variantele `/60` și `/90` sunt folosite în CliCommands (section cards, tab bar), ReasoningModes, FullProjectWorkflow. Dacă adaugi o variantă nouă, adaug-o explicit în `index.css`.

### Componente
- Fiecare pagină = un fișier în `src/pages/`, minim (wrappează componenta principală).
- Componentele helper (InfoBox, WarnBox, TipBox, SectionTitle etc.) se definesc **în același fișier**.
- **PageLayout wrapper obligatoriu** pe fiecare pagină cu `currentPath` corect.
- Conținut UI **bilingv RO + EN** — via `CONTENT: Record<'ro' | 'en', ContentShape>` + `useApp()`.
- Conținut SKILL.md în tab Exemple → **în engleză** (pentru copiere directă de către utilizatori).
- Dacă adaugi o pagină nouă: App.tsx (route) + PageLayout.PAGES + translations.ts (pages + pageMeta ro+en) + HomePage.tsx BADGE_COLORS.

### Când adaugi o pagină nouă
1. Creează `src/pages/NumePage.tsx` cu `<PageLayout currentPath="/cale">`
2. Adaugă în `PageLayout.PAGES` la poziția corectă în ordine
3. Adaugă route în `App.tsx`
4. Adaugă în `src/i18n/translations.ts`: entry în `pages` (ro + en) + entry în `home.pageMeta` (ro + en)
5. Adaugă în `HomePage.tsx`: entry în `BADGE_COLORS`
6. Navbar se actualizează automat (citește din PAGES)

---

## Dev & Build

```bash
# Start dev server
cd ccc && npx vite --port 3001 --host 0.0.0.0

# Build pentru producție (rulează și type-check)
npm run build

# Audit vizual light mode — toate paginile + tab-uri cheie
node pw-light-audit.mjs        # screenshots în pw-screenshots/light/
node pw-light-zoom.mjs         # zoom pe zone specifice în pw-screenshots/light-zoom/

# Playwright folosește ./node_modules/playwright/index.mjs (nu pachetul global)
# import { chromium } from './node_modules/playwright/index.mjs'

# Preview build
npm run preview
```

---

## Checklist înainte de orice modificare

- [ ] Niciun `any` introdus
- [ ] Tipuri TypeScript explicite (interface sau type)
- [ ] Stilizare cu Tailwind — niciun CSS inline
- [ ] Conținut UI bilingv: `CONTENT: Record<'ro' | 'en', ContentShape>` + `useApp()`
- [ ] Conținut SKILL.md în tab Exemple → în engleză (ambele limbi)
- [ ] Pagină nouă → App.tsx + PageLayout.PAGES + translations.ts (pages + pageMeta) + HomePage BADGE_COLORS
- [ ] Pagină nouă → învelită în `<PageLayout currentPath="/cale">`
- [ ] Build fără erori: `npm run build` trece
- [ ] Pagină nouă cu tab-uri → respectă pattern-ul sticky tabs + stats strip
- [ ] Elemente cu gradient zinc întunecat (via-zinc-900, to-zinc-950) → `preserve-dark` pe container
- [ ] Light mode verificat cu `node pw-light-audit.mjs` după modificări vizuale majore
