# CURS_STATUS.md — ce conține cursul acum

> **Scop:** sursa de adevăr pentru informațiile „perisabile” din curs (modele, prețuri, comenzi, default-uri).
> Înainte de un update: citește secțiunile 1–3, verifică sursele din secțiunea 4 și compară.
> După update: modifică faptele de aici, bifează fișierele atinse și adaugă o intrare în **Jurnal** (secțiunea 6).

**Ultima verificare completă:** 2026-09-23
**Surse verificate:** platform.claude.com (models overview, pricing) + code.claude.com (model-config)

---

## 1. Fapte curente (sept. 2026)

### 1.1 Modele curente

| Model | ID API | Alias Claude Code | Input / Output ($/MTok) | Cache read | Cache write 5m | Context | Max output | Thinking | Effort implicit | Knowledge cutoff |
|---|---|---|---|---|---|---|---|---|---|---|
| Claude Fable 5.1 | `claude-fable-5-1` | `fable` | $10 / $50 | $0.25 (2,5%) | $12.50 | 1M | 128K | adaptiv, mereu activ | high | iun. 2026 |
| Claude Opus 5.5 | `claude-opus-5-5` | `opus` | $4 / $20 | $0.20 (5%) | $5.00 | 1M | 128K | adaptiv, mereu activ | **medium** | iun. 2026 |
| Claude Sonnet 5 | `claude-sonnet-5` | `sonnet` | $2 / $10 | $0.20 | $2.50 | 1M | 128K | adaptiv (se poate dezactiva) | high | ian. 2026 |
| Claude Haiku 4.5 | `claude-haiku-4-5` | `haiku` | $1 / $5 | $0.10 | $1.25 | 200K | 64K | clasic (`budget_tokens`), fără effort | — | feb. 2025 |

- **Recomandarea Anthropic:** Opus 5.5 ca punct de pornire; Fable 5.1 pentru raționament extrem / agenți long-horizon.
- **Legacy (încă disponibile, NU apar în curs):** Fable 5, Opus 5, Opus 4.8, Opus 4.7, Opus 4.6, Opus 4.5, Sonnet 4.6, Sonnet 4.5.
- **Acces limitat (NU apare în curs):** Claude Mythos 5.1 (Project Glasswing).
- **Batch API:** −50% input și output. **Fast mode** (API, research preview): Opus 5.5 $8/$40; Opus 5 / 4.8 $10/$50.
- **Tokenizer:** modelele 4.7+ produc ~30% mai mulți tokeni pentru același text ⇒ 1M tokeni ≈ 555K cuvinte ≈ ~1.650 pagini A4 (Haiku 200K ≈ ~450 pagini).
- **Sonnet 5:** prețul $2/$10 (anunțat inițial ca introductiv) a devenit standard — creșterea la $3/$15 din 1 sept. 2026 NU a mai avut loc.
- **Retragere Haiku 4.5:** nu mai devreme de 15 oct. 2026 — **de verificat la următorul update** (posibil înlocuitor).

### 1.2 Claude Code — modele

- **Model implicit:** Opus 5.5 (Pro, Max, Team, Enterprise, API, Bedrock, Google Cloud). Microsoft Foundry: Sonnet 4.5.
- **Alias-uri:** `default`, `best` (fable dacă e disponibil, altfel opus), `fable`, `opus`, `sonnet`, `haiku`, `sonnet[1m]`, `opus[1m]`, `opusplan` (opus în plan mode, sonnet la execuție).
- **Prioritate (mare → mic):** `/model` în sesiune → `--model` → `ANTHROPIC_MODEL` → `"model"` în settings.json → default-ul contului.
- `/model <nume>` **salvează** alegerea ca default (scrie în user settings). Doar sesiunea curentă: `/model` → tasta `s`.
- Variabile: `ANTHROPIC_DEFAULT_{OPUS,SONNET,HAIKU,FABLE}_MODEL`, `CLAUDE_CODE_SUBAGENT_MODEL`.

### 1.3 Claude Code — raționament (effort)

- Niveluri: `low` · `medium` · `high` · `xhigh` · `max` (+ `ultracode`, mod care orchestrează workflow-uri la xhigh — **nemenționat în curs**).
- Setare: `/effort [nivel|auto]`, `claude --effort <nivel>`, `CLAUDE_CODE_EFFORT_LEVEL`, settings `"effortLevel"` + `"modelSettings": { "opus": { "effort": ... } }`, frontmatter `effort:` în skills/subagenți.
- Nivel nesuportat ⇒ coboară la cel mai apropiat inferior (ex. xhigh → high pe Opus 4.6).
- **Keyword-uri:** doar `ultrathink` e recunoscut (raționament mai profund pe o singură tură, nu schimbă effort-ul). `think`, `think hard`, `megathink` = text obișnuit.
- Schimbarea effort-ului / modelului mid-sesiune păstrează conversația, dar poate invalida prompt cache-ul.

### 1.4 Claude Code — task-uri programate

| | `/loop` (sesiune) | Desktop (local) | Routines (cloud) |
|---|---|---|---|
| Unde rulează | sesiunea curentă | calculatorul tău, app deschisă | cloud Anthropic |
| Sesiune deschisă | da | nu | nu |
| Fișiere locale | da | da | nu (clonă nouă) |
| Permisiuni | ca în sesiune | per task | fără prompturi |
| Interval minim | 1 min | 1 min | 1 oră |
| Declanșatori | timp | timp / manual | timp, API, GitHub |

- `/loop [interval] [prompt]` — unități s/m/h/d; fără interval = self-paced (1 min–1 h); fără prompt = mentenanță sau `loop.md` (`.claude/loop.md` > `~/.claude/loop.md`, max 25.000 bytes). Esc oprește loop-ul self-paced.
- Tool-uri: `CronCreate`, `CronList`, `CronDelete`; ID 8 caractere; max 50 task-uri/sesiune; expirare 7 zile; jitter până la 30 min; fără catch-up; `CLAUDE_CODE_DISABLE_CRON=1`.
- Desktop: Code → Routines → New routine → Local (Desktop ≥ 1.1.5368); preseturi Manual/Hourly/Daily/Weekdays/Weekly; o rulare de recuperare pentru ultimele 7 zile; prompt în `~/.claude/scheduled-tasks/<nume>/SKILL.md`.
- Routines: research preview; Pro/Max/Team/Enterprise; `/schedule` (alias `/routines`), `/schedule list|update|run`; claude.ai/code/routines; API `/fire` cu header `experimental-cc-routine-2026-04-01`; GitHub: pull_request, release; branch-uri `claude/*`; limită zilnică de rulări (one-off exceptate).

### 1.5 API — thinking

- Opus 5.5 / Fable 5.1: thinking mereu activ; `{type:"disabled"}` și `budget_tokens` ⇒ 400. Doar `{type:"adaptive"}` sau omis.
- Sonnet 5: adaptiv implicit, `disabled` acceptat. `budget_tokens` ⇒ 400 pe toate modelele curente, cu excepția Haiku 4.5.
- `display: "summarized"` pentru a vedea rezumatul gândirii (implicit textul thinking vine gol).
- Opus 5.5 / Fable 5.1: „preserved thinking” — istoricul se tratează append-only; nu edita/reordona blocurile thinking.

---

## 2. Ce conține cursul (15 pagini) și unde sunt faptele perisabile

| Rută | Componentă | Conținut | Fapte perisabile de verificat |
|---|---|---|---|
| `/` | `pages/HomePage.tsx` + `i18n/translations.ts` | hero, terminal animat, stats, index | stats „4 modele”, „5 niveluri effort”, whyCards (Adaptive Thinking), scenariu terminal `--effort xhigh`, pageMeta `/rationament` și `/modele` |
| `/instalare` | `Basics.tsx` | instalare, API key, setup | comenzi de instalare |
| `/rationament` | `ReasoningModes.tsx` | effort, ultrathink, API thinking | **tot fișierul** — niveluri effort, default-uri per model, keyword-uri, cod API, compatibilitate modele |
| `/tools` | `ToolsSystem.tsx` | Read/Edit/Bash/Glob/Grep, permisiuni | numele tool-urilor |
| `/comenzi` | `CliCommands.tsx` | slash commands, flags, scripturi | `/model`, `/effort`, `/fast`, exemple `--model` |
| `/prompting` | `PromptingTips.tsx` | COCF, Plan Mode, anti-patterns | anti-pattern #06 (ultrathink) |
| `/modele` | `ModelsGuide.tsx` | modele, prețuri, selectare, configurare, capabilități | **tot fișierul** — array `MODELS`, tabel cost/task, cache ($0.72 / $0.18), matrice, escaladare, priorități config, cod SDK, `capRows`, `thinkingModels`, bare comparație (`vals`) |
| `/tokenuri` | `TokenManagement.tsx` | context, caching, economii | tabel context (pagini A4), cost/task (Opus 5.5), best practices |
| `/automatizare` | `AutomationGuide.tsx` | headless, CI/CD, hooks | raport Haiku vs Sonnet/Opus |
| `/programare` | `SchedulingGuide.tsx` | /loop, task-uri Desktop, Routines cloud, rețete | **tot fișierul** — tabel comparativ, limite (50 task-uri, 7 zile, 1 oră cloud), comenzi `/schedule`, header beta `/fire`, pași de creare în Desktop |
| `/avansat` | `AdvancedFeatures.tsx` | MCP, subagents, worktrees | exemplu settings.json (`"model"`) |
| `/skills` | `SkillsGuide.tsx` | SKILL.md, 36 skills copyable | mențiunea ultrathink în skills |
| `/workflows` | `Workflows.tsx` | 6 scenarii end-to-end | prompturi cu `/effort` / `ultrathink` |
| `/proiect-complet` | `FullProjectWorkflow.tsx` | capstone ArtisanShop | badge-uri model/effort pe 30 pași, matrice, regula de escaladare, costuri ($2/$10, $4/$20), estimare ~$9-13 / ~$11 |
| `/referinta` | `QuickReference.tsx` | cheat sheet | flag `--model`, `/fast`, `/effort`, `/model` |

**Calcule derivate** (refă-le dacă se schimbă prețurile):
- `ModelsGuide` → cost per task: valorile vechi scalate cu raportul de preț (Sonnet ×2/3, Opus 5.5 ×0.8 față de Opus 4.8).
- `ModelsGuide` → cache: 180K input × preț input (fără cache) vs 150K × cache read + 5K × cache write + 30K × input (cu cache).
- `ModelsGuide` → strategia Opus+Sonnet: 50K × output Opus + 200K × output Sonnet vs 250K × output Opus.
- `ModelsGuide` → bara „Cost relativ”: output-ul fiecărui model raportat la Fable (Haiku 10, Sonnet 20, Opus 40, Fable 100).
- `TokenManagement` → cost/task: calibrat pe Opus 5.5 fără caching.

---

## 3. Checklist pentru următorul update

1. Verifică sursele din secțiunea 4 și compară cu secțiunea 1.
2. `grep` după ID-uri / nume vechi în `src/` (ex. `opus-5-5`, `Opus 5.5`, `fable-5-1`, `Fable 5.1`, prețuri `$4`, `$20`, `$0.20`).
3. Actualizează fișierele din tabelul secțiunii 2 (ambele limbi — blocurile `ro` și `en`).
4. Refă calculele derivate.
5. `npm run build` (include type-check) → trebuie să treacă.
6. Verificare vizuală: `/modele` și `/rationament` (dark + light, `node pw-light-audit.mjs` dacă s-a schimbat layout-ul).
7. Actualizează **acest fișier**: secțiunea 1, data „Ultima verificare”, jurnalul.

---

## 4. Surse oficiale

- Modele: https://platform.claude.com/docs/en/about-claude/models/overview
- Prețuri: https://platform.claude.com/docs/en/about-claude/pricing
- Deprecări: https://platform.claude.com/docs/en/about-claude/model-deprecations
- Claude Code — modele & effort: https://code.claude.com/docs/en/model-config
- Claude Code — comenzi: https://code.claude.com/docs/en/slash-commands
- Task-uri programate: https://code.claude.com/docs/en/scheduled-tasks · https://code.claude.com/docs/en/desktop-scheduled-tasks · https://code.claude.com/docs/en/routines

---

## 5. Puncte deschise / de urmărit

- Haiku 4.5: retragere „nu mai devreme de 15 oct. 2026” — verifică dacă a apărut un Haiku nou.
- `ultracode` (effort mode + workflows) nu e explicat în curs — candidat pentru `/rationament` sau `/avansat`.
- `/cost` e folosit în mai multe pagini (CliCommands, ModelsGuide strategia 10, TokenManagement) — verifică dacă mai e comanda recomandată pentru consum.
- Flag-ul scurt `-m` pentru `--model` (CliCommands) — neverificat în documentație.

---

## 6. Jurnal de update-uri

### 2026-09-23 — lecție nouă: Task-uri programate (`/programare`)
- Pagină nouă după Automatizare: `/loop`, task-uri Desktop, Routines în cloud (`/schedule`), rețete practice.
- Fișiere: `SchedulingGuide.tsx`, `ProgramarePage.tsx`, `App.tsx`, `PageLayout.tsx` (PAGES), `pageIcons.tsx`, `HomePage.tsx` (TIER), `i18n/translations.ts`, `QuickReference.tsx` (+ `/loop`, `/schedule`).
- Renumerotare etichete: Skills → Lecția 11, Proiect Complet → Lecția 13.
- De urmărit: Routines e în research preview — verifică limitele și header-ul beta `/fire` la fiecare update.

### 2026-09-23 — trecere la generația Opus 5.5 / Fable 5.1
- **Înainte:** Haiku 4.5 / Sonnet 5 ($3/$15) / Opus 4.8 ($5/$25) / Fable 5; Sonnet ca default Claude Code; keyword-uri `think` / `megathink` / `ultrathink` cu bugete fixe 10K / 32K / 128K.
- **Acum:** Haiku 4.5 / Sonnet 5 ($2/$10) / Opus 5.5 ($4/$20, default) / Fable 5.1; raționament prin `/effort` + `ultrathink`.
- Fișiere: `ModelsGuide.tsx`, `ReasoningModes.tsx` (rescris), `FullProjectWorkflow.tsx`, `CliCommands.tsx` (+ comanda `/effort`), `TokenManagement.tsx`, `QuickReference.tsx` (+ `/effort`), `Workflows.tsx`, `PromptingTips.tsx`, `AutomationGuide.tsx`, `i18n/translations.ts`.
