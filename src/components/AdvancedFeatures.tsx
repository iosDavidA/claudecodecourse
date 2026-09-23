import {
  Webhook,
  Server,
  Users,
  Map,
  GitFork,
  Settings,
  Keyboard,
  FileCode,
  FolderCog,
} from 'lucide-react'
import { CodeBlock } from './CodeBlock'
import { useApp } from '../contexts/AppContext'

interface FeatureBlockProps {
  icon: React.ReactNode
  title: string
  keyword: string
  description: string
  details: string[]
  code: string
}

function FeatureBlock({ icon, title, keyword, description, details, code }: FeatureBlockProps) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all hover:border-amber-500/30 hover:bg-zinc-900">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-lg bg-amber-500/10 p-2.5 text-amber-400">{icon}</div>
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <code className="text-xs text-zinc-500">{keyword}</code>
        </div>
      </div>

      <p className="mb-4 text-sm leading-relaxed text-zinc-400">{description}</p>

      <ul className="mb-4 space-y-1.5">
        {details.map((d, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
            <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-amber-500" />
            {d}
          </li>
        ))}
      </ul>

      <CodeBlock code={code} />
    </div>
  )
}

interface FeatureData {
  icon: React.ReactNode
  title: string
  keyword: string
  description: string
  details: string[]
  code: string
}

interface ContentShape {
  badge: string
  title: string
  subtitle: string
  features: FeatureData[]
}

const CONTENT: Record<'ro' | 'en', ContentShape> = {
  ro: {
    badge: 'Nivel avansat',
    title: 'Funcționalități avansate',
    subtitle:
      'Claude Code nu este doar un chat — este un ecosistem extensibil cu hooks, servere MCP, subagent-i autonomi, custom commands și mod de planificare arhitecturală.',
    features: [
      {
        icon: <Webhook className="h-5 w-5" />,
        title: 'Hooks',
        keyword: 'settings.json → hooks',
        description:
          'Hook-urile sunt comenzi shell care se execută automat înainte sau după anumite acțiuni Claude Code. Le configurezi în settings.json și rulează fără intervenție manuală.',
        details: [
          'PreToolUse — se execută înainte ca un tool să fie apelat (ex: lint înainte de edit)',
          'PostToolUse — se execută după un tool (ex: format automat după fiecare scriere)',
          'Stop — se execută când Claude finalizează o sesiune',
          'SubagentStop — se execută când un subagent finalizează task-ul',
          'Poți bloca acțiuni dacă hook-ul returnează un exit code nenul',
        ],
        code: `// ~/.claude/settings.json\n{\n  "hooks": {\n    "PostToolUse": [{\n      "matcher": "Write|Edit",\n      "command": "npx prettier --write $FILE_PATH"\n    }],\n    "PreToolUse": [{\n      "matcher": "Bash",\n      "command": "echo \"Execuție: $TOOL_INPUT\""\n    }],\n    "Stop": [{\n      "command": "notify-send 'Claude a terminat!'"\n    }]\n  }\n}`,
      },
      {
        icon: <Server className="h-5 w-5" />,
        title: 'Servere MCP',
        keyword: 'Model Context Protocol',
        description:
          'MCP (Model Context Protocol) permite Claude Code să se conecteze la servere externe care furnizează unelte și context suplimentar: baze de date, API-uri, servicii third-party.',
        details: [
          'Conectare la Postgres, GitHub, Slack, Jira, Figma direct din Claude Code',
          'Serverele MCP expun „tools" pe care Claude le poate apela nativ',
          'Se configurează în settings.json sau .mcp.json la nivel de proiect',
          'Rulare cu: claude mcp add <name> <command>',
          'Poți scrie servere MCP custom în TypeScript sau Python',
        ],
        code: `// .mcp.json (rădăcina proiectului)\n{\n  "mcpServers": {\n    "postgres": {\n      "command": "npx",\n      "args": ["-y",\n        "@modelcontextprotocol/server-postgres",\n        "postgresql://localhost/mydb"\n      ]\n    },\n    "github": {\n      "command": "npx",\n      "args": ["-y",\n        "@modelcontextprotocol/server-github"\n      ],\n      "env": { "GITHUB_TOKEN": "ghp_..." }\n    }\n  }\n}`,
      },
      {
        icon: <FolderCog className="h-5 w-5" />,
        title: 'Custom Slash Commands',
        keyword: '.claude/commands/',
        description:
          'Poți crea propriile comenzi slash personalizate, salvate ca fișiere Markdown în .claude/commands/. Fiecare fișier .md devine o comandă /numefisier disponibilă în sesiune.',
        details: [
          'Fișierele din .claude/commands/ sunt accesibile ca /numecomandă',
          'Suportă argumente: $ARGUMENTS se înlocuiește cu textul după comandă',
          'Pot conține instrucțiuni complexe, reguli, template-uri de prompt',
          'Comenzile globale merg în ~/.claude/commands/ (disponibile în toate proiectele)',
          'Exemple utile: /deploy, /changelog, /pr-description, /security-audit',
        ],
        code: `# Creează .claude/commands/pr-desc.md:\nmkdir -p .claude/commands\n\ncat << 'EOF' > .claude/commands/pr-desc.md\nGenerează o descriere de PR pentru\ndiff-ul curent față de main.\n\nFormat:\n## Ce face acest PR\n## De ce e necesar\n## Cum se testează\n\nArgument primit: $ARGUMENTS\nEOF\n\n# Utilizare în sesiune:\n> /pr-desc rezolvă bug autentificare`,
      },
      {
        icon: <Users className="h-5 w-5" />,
        title: 'Subagent-i',
        keyword: 'Agent tool — subagent_type',
        description:
          'Claude Code poate lansa subagent-i specializați care lucrează în paralel, fiecare cu propriul context și set de unelte. Rezultatele se agregă automat în răspunsul principal.',
        details: [
          'Explore — agent rapid pentru căutare în codebase (glob, grep, citire fișiere)',
          'Plan — arhitect software care proiectează planuri de implementare',
          'general-purpose — agent complet pentru task-uri complexe multi-step',
          'Subagent-ii pot rula în background pentru task-uri independente',
          'Pot fi izolați în worktree-uri git separate pentru siguranță',
        ],
        code: `# Exemplu: Claude lansează 2 agenți\n# în paralel pentru research:\n\n> Analizează sistemul de plăți și\n  propune o strategie de migrare.\n\n● Agent Explore → scanează src/payments/\n● Agent Plan → proiectează arhitectura\n\n# Ambii rulează simultan, Claude\n# agregă rezultatele în răspuns final`,
      },
      {
        icon: <Map className="h-5 w-5" />,
        title: 'Plan Mode',
        keyword: 'Shift+Tab / /plan',
        description:
          'Modul de planificare permite lui Claude să analizeze cerința și să creeze un plan detaliat de implementare ÎNAINTE de a scrie cod. Ideal pentru task-uri complexe unde greșelile sunt costisitoare.',
        details: [
          'Claude creează un plan pas cu pas cu fișierele afectate și motivațiile',
          'Poți revizui, modifica sau aproba planul înainte de execuție',
          'Shift+Tab comută instant între Plan mode și Act mode',
          'În Plan mode Claude NU poate executa tools — doar analizează și planifică',
          'Planul rămâne vizibil și se poate actualiza pe parcursul implementării',
        ],
        code: `# Activare Plan mode:\n> /plan\n# sau apasă Shift+Tab\n\n> Implementează sistem notificări email\n  cu template-uri, coadă BullMQ,\n  și retry logic exponențial.\n\n📋 Plan (5 pași):\n1. lib/email/templates/ — Handlebars\n2. lib/queue.ts — config BullMQ\n3. lib/email/sender.ts — SMTP\n4. workers/email.worker.ts\n5. Teste de integrare\n\n# Shift+Tab → Act mode → execuție`,
      },
      {
        icon: <GitFork className="h-5 w-5" />,
        title: 'Git Worktrees',
        keyword: 'isolation: worktree',
        description:
          'Subagent-ii pot rula într-un worktree git izolat — o copie temporară a repo-ului pe un branch separat. Modificările rămân izolate și pot fi inspectate sau abandonate fără impact pe main.',
        details: [
          'Worktree-ul este creat automat pe un branch temporar',
          'Ideal pentru explorări experimentale sau refactorizări riscante',
          'Dacă agentul nu face modificări, worktree-ul se șterge automat',
          'Dacă face modificări, primești path-ul și branch-ul pentru review manual',
          'git diff main arată exact ce a schimbat agentul',
        ],
        code: `# Claude lansează agent izolat:\n\n> ultrathink Migrează la tRPC.\n  Lucrează într-un worktree izolat.\n\n● Creez worktree temporar...\n● Branch: agent/migrate-trpc-abc123\n● Implementez izolat...\n\n✓ 12 fișiere modificate\n  Branch: agent/migrate-trpc-abc123\n  → git diff main -- src/`,
      },
      {
        icon: <Settings className="h-5 w-5" />,
        title: 'Configurare & Ierarhie setări',
        keyword: 'settings.json + CLAUDE.md',
        description:
          'Claude Code se configurează pe patru niveluri cu prioritate crescătoare: enterprise policy, global user, proiect, și local. Fiecare nivel poate suprascrie cel anterior.',
        details: [
          '~/.claude/settings.json — global pentru toți utilizatorul (nivel user)',
          '.claude/settings.json — specific proiectului (inclus în git)',
          '.claude/settings.local.json — local, neinclus în git (override personal)',
          'CLAUDE.md / AGENTS.md / anthropic.md — instrucțiuni limbaj natural',
          'Suportă allowedTools, blockedTools, allowedCommands, env vars',
        ],
        code: `// .claude/settings.json\n{\n  "model": "claude-sonnet-5",\n  "permissions": {\n    "allow": [\n      "Read", "Edit", "Write",\n      "Bash(npm test)",\n      "Bash(npx prisma *)"\n    ],\n    "deny": [\n      "Bash(rm -rf *)",\n      "Bash(git push --force)"\n    ]\n  },\n  "env": {\n    "NODE_ENV": "development"\n  }\n}`,
      },
      {
        icon: <Keyboard className="h-5 w-5" />,
        title: 'Shortcuts & Keybindings',
        keyword: '~/.claude/keybindings.json',
        description:
          'Claude Code suportă shortcut-uri de tastatură personalizabile. Keybindings se configurează în ~/.claude/keybindings.json cu sintaxă similară VS Code.',
        details: [
          'Enter — trimite mesajul; Shift+Enter — linie nouă fără trimitere',
          'Escape — anulează acțiunea curentă sau iese din modul activ',
          'Shift+Tab — comută între Plan mode și Act mode',
          'Ctrl+C — oprește generarea curentă imediat',
          'Up/Down — navighează prin istoricul prompt-urilor',
        ],
        code: `# ~/.claude/keybindings.json\n[\n  {\n    "key": "ctrl+shift+r",\n    "command": "/review"\n  },\n  {\n    "key": "ctrl+shift+c",\n    "command": "/commit"\n  }\n]\n\n# Shortcut-uri implicite:\n# Shift+Tab → Plan/Act toggle\n# Escape    → Cancel\n# ! cmd     → Shell direct`,
      },
      {
        icon: <FileCode className="h-5 w-5" />,
        title: 'Memorie persistentă',
        keyword: '~/.claude/projects/*/memory/',
        description:
          'Claude Code dispune de un sistem de memorie bazat pe fișiere care persistă între conversații. Informațiile salvate sunt indexate în MEMORY.md și disponibile automat în sesiunile viitoare.',
        details: [
          'user — preferințe, rol, cunoștințe (ex: „este senior Go dev, nou în React")',
          'feedback — corecții și confirmări pentru comportament viitor',
          'project — context proiect: decizii, deadline-uri, stakeholders',
          'reference — pointeri la resurse externe (Linear, Jira, Grafana)',
          'MEMORY.md servește drept index — liniile de după 200 sunt truniate',
        ],
        code: `# Exemplu de memorie (feedback type):\n\n---\nname: no_db_mocks\ndescription: Nu folosi mock-uri pt. DB\ntype: feedback\n---\n\nTestele de integrare trebuie să\nhiteze o bază de date reală.\n\n**Why:** mock-urile au mascat o migrare\nstricată în Q1 2026.\n**How to apply:** generează teste cu\nhit real la Neon PostgreSQL de test.`,
      },
    ],
  },
  en: {
    badge: 'Advanced level',
    title: 'Advanced features',
    subtitle:
      'Claude Code is not just a chat — it is an extensible ecosystem with hooks, MCP servers, autonomous subagents, custom commands and an architectural planning mode.',
    features: [
      {
        icon: <Webhook className="h-5 w-5" />,
        title: 'Hooks',
        keyword: 'settings.json → hooks',
        description:
          'Hooks are shell commands that run automatically before or after certain Claude Code actions. You configure them in settings.json and they run without manual intervention.',
        details: [
          'PreToolUse — runs before a tool is called (e.g. lint before edit)',
          'PostToolUse — runs after a tool (e.g. auto-format after every write)',
          'Stop — runs when Claude finishes a session',
          'SubagentStop — runs when a subagent finishes its task',
          'You can block actions if the hook returns a non-zero exit code',
        ],
        code: `// ~/.claude/settings.json\n{\n  "hooks": {\n    "PostToolUse": [{\n      "matcher": "Write|Edit",\n      "command": "npx prettier --write $FILE_PATH"\n    }],\n    "PreToolUse": [{\n      "matcher": "Bash",\n      "command": "echo \"Running: $TOOL_INPUT\""\n    }],\n    "Stop": [{\n      "command": "notify-send 'Claude is done!'"\n    }]\n  }\n}`,
      },
      {
        icon: <Server className="h-5 w-5" />,
        title: 'MCP Servers',
        keyword: 'Model Context Protocol',
        description:
          'MCP (Model Context Protocol) allows Claude Code to connect to external servers that provide additional tools and context: databases, APIs, third-party services.',
        details: [
          'Connect to Postgres, GitHub, Slack, Jira, Figma directly from Claude Code',
          'MCP servers expose "tools" that Claude can call natively',
          'Configured in settings.json or .mcp.json at project level',
          'Run with: claude mcp add <name> <command>',
          'You can write custom MCP servers in TypeScript or Python',
        ],
        code: `// .mcp.json (project root)\n{\n  "mcpServers": {\n    "postgres": {\n      "command": "npx",\n      "args": ["-y",\n        "@modelcontextprotocol/server-postgres",\n        "postgresql://localhost/mydb"\n      ]\n    },\n    "github": {\n      "command": "npx",\n      "args": ["-y",\n        "@modelcontextprotocol/server-github"\n      ],\n      "env": { "GITHUB_TOKEN": "ghp_..." }\n    }\n  }\n}`,
      },
      {
        icon: <FolderCog className="h-5 w-5" />,
        title: 'Custom Slash Commands',
        keyword: '.claude/commands/',
        description:
          'You can create your own custom slash commands, saved as Markdown files in .claude/commands/. Each .md file becomes a /filename command available in the session.',
        details: [
          'Files in .claude/commands/ are accessible as /commandname',
          'Supports arguments: $ARGUMENTS is replaced with text after the command',
          'Can contain complex instructions, rules, prompt templates',
          'Global commands go in ~/.claude/commands/ (available across all projects)',
          'Useful examples: /deploy, /changelog, /pr-description, /security-audit',
        ],
        code: `# Create .claude/commands/pr-desc.md:\nmkdir -p .claude/commands\n\ncat << 'EOF' > .claude/commands/pr-desc.md\nGenerate a PR description for\nthe current diff against main.\n\nFormat:\n## What this PR does\n## Why it is needed\n## How to test\n\nReceived argument: $ARGUMENTS\nEOF\n\n# Usage in session:\n> /pr-desc fix authentication bug`,
      },
      {
        icon: <Users className="h-5 w-5" />,
        title: 'Subagents',
        keyword: 'Agent tool — subagent_type',
        description:
          'Claude Code can launch specialized subagents that work in parallel, each with its own context and set of tools. Results are automatically aggregated into the main response.',
        details: [
          'Explore — fast agent for codebase search (glob, grep, file reading)',
          'Plan — software architect that designs implementation plans',
          'general-purpose — full agent for complex multi-step tasks',
          'Subagents can run in the background for independent tasks',
          'Can be isolated in separate git worktrees for safety',
        ],
        code: `# Example: Claude launches 2 agents\n# in parallel for research:\n\n> Analyze the payment system and\n  propose a migration strategy.\n\n● Agent Explore → scans src/payments/\n● Agent Plan → designs the architecture\n\n# Both run simultaneously, Claude\n# aggregates results into final response`,
      },
      {
        icon: <Map className="h-5 w-5" />,
        title: 'Plan Mode',
        keyword: 'Shift+Tab / /plan',
        description:
          'Planning mode allows Claude to analyze the request and create a detailed implementation plan BEFORE writing code. Ideal for complex tasks where mistakes are costly.',
        details: [
          'Claude creates a step-by-step plan with affected files and rationale',
          'You can review, modify or approve the plan before execution',
          'Shift+Tab instantly toggles between Plan mode and Act mode',
          'In Plan mode Claude CANNOT execute tools — only analyzes and plans',
          'The plan stays visible and can be updated throughout implementation',
        ],
        code: `# Activate Plan mode:\n> /plan\n# or press Shift+Tab\n\n> Implement email notification system\n  with templates, BullMQ queue,\n  and exponential retry logic.\n\n📋 Plan (5 steps):\n1. lib/email/templates/ — Handlebars\n2. lib/queue.ts — BullMQ config\n3. lib/email/sender.ts — SMTP\n4. workers/email.worker.ts\n5. Integration tests\n\n# Shift+Tab → Act mode → execute`,
      },
      {
        icon: <GitFork className="h-5 w-5" />,
        title: 'Git Worktrees',
        keyword: 'isolation: worktree',
        description:
          'Subagents can run in an isolated git worktree — a temporary copy of the repo on a separate branch. Changes remain isolated and can be inspected or discarded without impact on main.',
        details: [
          'The worktree is created automatically on a temporary branch',
          'Ideal for experimental explorations or risky refactors',
          'If the agent makes no changes, the worktree is deleted automatically',
          'If it makes changes, you receive the path and branch for manual review',
          'git diff main shows exactly what the agent changed',
        ],
        code: `# Claude launches isolated agent:\n\n> ultrathink Migrate to tRPC.\n  Work in an isolated worktree.\n\n● Creating temporary worktree...\n● Branch: agent/migrate-trpc-abc123\n● Implementing in isolation...\n\n✓ 12 files modified\n  Branch: agent/migrate-trpc-abc123\n  → git diff main -- src/`,
      },
      {
        icon: <Settings className="h-5 w-5" />,
        title: 'Configuration & Settings Hierarchy',
        keyword: 'settings.json + CLAUDE.md',
        description:
          'Claude Code is configured at four levels with increasing priority: enterprise policy, global user, project, and local. Each level can override the previous one.',
        details: [
          '~/.claude/settings.json — global for all users (user level)',
          '.claude/settings.json — project-specific (committed to git)',
          '.claude/settings.local.json — local, not committed (personal override)',
          'CLAUDE.md / AGENTS.md / anthropic.md — natural language instructions',
          'Supports allowedTools, blockedTools, allowedCommands, env vars',
        ],
        code: `// .claude/settings.json\n{\n  "model": "claude-sonnet-5",\n  "permissions": {\n    "allow": [\n      "Read", "Edit", "Write",\n      "Bash(npm test)",\n      "Bash(npx prisma *)"\n    ],\n    "deny": [\n      "Bash(rm -rf *)",\n      "Bash(git push --force)"\n    ]\n  },\n  "env": {\n    "NODE_ENV": "development"\n  }\n}`,
      },
      {
        icon: <Keyboard className="h-5 w-5" />,
        title: 'Shortcuts & Keybindings',
        keyword: '~/.claude/keybindings.json',
        description:
          'Claude Code supports customizable keyboard shortcuts. Keybindings are configured in ~/.claude/keybindings.json with syntax similar to VS Code.',
        details: [
          'Enter — send message; Shift+Enter — new line without sending',
          'Escape — cancel the current action or exit the active mode',
          'Shift+Tab — toggle between Plan mode and Act mode',
          'Ctrl+C — stop the current generation immediately',
          'Up/Down — navigate through prompt history',
        ],
        code: `# ~/.claude/keybindings.json\n[\n  {\n    "key": "ctrl+shift+r",\n    "command": "/review"\n  },\n  {\n    "key": "ctrl+shift+c",\n    "command": "/commit"\n  }\n]\n\n# Default shortcuts:\n# Shift+Tab → Plan/Act toggle\n# Escape    → Cancel\n# ! cmd     → Direct shell`,
      },
      {
        icon: <FileCode className="h-5 w-5" />,
        title: 'Persistent memory',
        keyword: '~/.claude/projects/*/memory/',
        description:
          'Claude Code has a file-based memory system that persists across conversations. Saved information is indexed in MEMORY.md and automatically available in future sessions.',
        details: [
          'user — preferences, role, knowledge (e.g. "senior Go dev, new to React")',
          'feedback — corrections and confirmations for future behavior',
          'project — project context: decisions, deadlines, stakeholders',
          'reference — pointers to external resources (Linear, Jira, Grafana)',
          'MEMORY.md serves as index — lines after 200 are truncated',
        ],
        code: `# Memory example (feedback type):\n\n---\nname: no_db_mocks\ndescription: Do not use mocks for DB\ntype: feedback\n---\n\nIntegration tests must hit\na real database.\n\n**Why:** mocks masked a broken migration\nin Q1 2026.\n**How to apply:** generate tests with\nreal hit on Neon PostgreSQL test DB.`,
      },
    ],
  },
}

export default function AdvancedFeatures() {
  const { lang } = useApp()
  const c = CONTENT[lang]

  return (
    <section id="avansat" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <span className="mb-4 inline-block text-sm font-semibold tracking-widest text-amber-400 uppercase">
            {c.badge}
          </span>
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
            {c.title}
          </h2>
          <p className="mx-auto max-w-2xl text-zinc-400">
            {c.subtitle}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {c.features.map((feature, i) => (
            <FeatureBlock
              key={i}
              icon={feature.icon}
              title={feature.title}
              keyword={feature.keyword}
              description={feature.description}
              details={feature.details}
              code={feature.code}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
