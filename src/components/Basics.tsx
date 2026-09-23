import { Download, Shield, FolderKey, FileCheck, Monitor } from 'lucide-react'
import { CodeBlock } from './CodeBlock'
import { useApp } from '../contexts/AppContext'

interface StepProps {
  icon: React.ReactNode
  title: string
  description: string
  code?: string
}

function Step({ icon, title, description, code }: StepProps) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all hover:border-amber-500/30 hover:bg-zinc-900">
      <div className="mb-4 inline-flex rounded-lg bg-amber-500/10 p-2.5 text-amber-400">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
      <p className="mb-4 text-sm leading-relaxed text-zinc-400">{description}</p>
      {code && <CodeBlock code={code} />}
    </div>
  )
}

const CONTENT = {
  ro: {
    badge: 'Fundamente',
    title: 'Instalare și configurare',
    subtitle:
      'Claude Code este un agent de programare agentic care rulează direct în terminal. Accesează fișierele, execută comenzi shell și înțelege contextul complet al proiectului tău.',
    steps: [
      {
        title: '1. Instalare globală',
        description:
          'Instalează Claude Code global prin npm. Necesită Node.js ≥ 18. După instalare, comanda claude devine disponibilă în orice director.',
        code: `# Instalare globală\nnpm install -g @anthropic-ai/claude-code\n\n# Verifică versiunea instalată\nclaude --version\n\n# Actualizează la ultima versiune\nnpm update -g @anthropic-ai/claude-code`,
      },
      {
        title: '2. Autentificare',
        description:
          'La prima rulare, Claude Code deschide browser-ul pentru autentificare cu contul tău Anthropic. Token-ul se salvează local în ~/.claude/ și se reînnoiește automat. Alternativ, poți folosi un API key.',
        code: `# Pornește Claude Code (prima dată)\nclaude\n\n# Browser-ul se deschide automat\n# → Autorizează accesul\n# → Token salvat în ~/.claude/\n\n# Sau cu API key explicit:\nexport ANTHROPIC_API_KEY="sk-ant-..."\nclaude`,
      },
      {
        title: '3. Permisiuni fișiere',
        description:
          'Claude Code operează cu permisiuni granulare: citire, scriere, și execuție shell. Configurate în .claude/settings.json. Poți permite sau bloca tools specifice, inclusiv comenzi Bash particulare.',
        code: `# .claude/settings.json\n{\n  "permissions": {\n    "allow": [\n      "Read", "Edit", "Write",\n      "Bash(npm *)",\n      "Bash(git diff*)",\n      "Bash(npx prisma *)" \n    ],\n    "deny": [\n      "Bash(rm -rf *)",\n      "Bash(git push --force)"\n    ]\n  }\n}`,
      },
      {
        title: '4. Fișierul CLAUDE.md',
        description:
          'Creează CLAUDE.md în rădăcina proiectului pentru context persistent: convenții de cod, stack-ul tehnologic, reguli specifice. Claude Code îl citește automat. Funcționează și cu AGENTS.md sau anthropic.md.',
        code: `# Generează automat cu:\nclaude\n> /init\n\n# Sau creează manual:\ncat << 'EOF' > CLAUDE.md\n# Proiect: API Next.js + TypeScript\n- Folosește Prisma ORM\n- Testează cu Vitest\n- IDs sunt string (cuid)\n- Fără any types\nEOF`,
      },
      {
        title: '5. Integrare IDE',
        description:
          'Claude Code se integrează direct în VS Code și JetBrains (WebStorm, IntelliJ etc.) prin extensii oficiale. Poți rula conversații fără a părăsi editorul, cu acces complet la fișierele proiectului.',
        code: `# VS Code — instalare extensie:\ncode --install-extension anthropic.claude-code\n\n# JetBrains — din Marketplace:\n# Settings → Plugins → "Claude Code"\n\n# Sau folosești direct din terminal\n# integrat în IDE (fără extensie)`,
      },
      {
        title: '6. Directoare suplimentare',
        description:
          'Implicit, Claude Code are acces doar la directorul curent. Poți adăuga directoare externe cu --add-dir — util când proiectul tău depinde de librării sau configurații din afara folderului curent.',
        code: `# Adaugă directoare la context:\nclaude --add-dir ~/shared-libs\nclaude --add-dir /etc/nginx/conf.d\n\n# Rulează cu permisiuni extinse\n# (atenție — reduce securitatea):\nclaude --dangerously-skip-permissions`,
      },
    ],
  },
  en: {
    badge: 'Fundamentals',
    title: 'Installation & configuration',
    subtitle:
      'Claude Code is an agentic programming agent that runs directly in the terminal. It accesses files, executes shell commands, and understands the full context of your project.',
    steps: [
      {
        title: '1. Global installation',
        description:
          'Install Claude Code globally via npm. Requires Node.js ≥ 18. After installation, the claude command is available in any directory.',
        code: `# Global installation\nnpm install -g @anthropic-ai/claude-code\n\n# Check installed version\nclaude --version\n\n# Update to latest version\nnpm update -g @anthropic-ai/claude-code`,
      },
      {
        title: '2. Authentication',
        description:
          'On first run, Claude Code opens the browser to authenticate with your Anthropic account. The token is saved locally in ~/.claude/ and renews automatically. Alternatively, you can use an API key.',
        code: `# Start Claude Code (first time)\nclaude\n\n# Browser opens automatically\n# → Authorize access\n# → Token saved in ~/.claude/\n\n# Or with explicit API key:\nexport ANTHROPIC_API_KEY="sk-ant-..."\nclaude`,
      },
      {
        title: '3. File permissions',
        description:
          'Claude Code operates with granular permissions: read, write, and shell execution. Configured in .claude/settings.json. You can allow or deny specific tools, including particular Bash commands.',
        code: `# .claude/settings.json\n{\n  "permissions": {\n    "allow": [\n      "Read", "Edit", "Write",\n      "Bash(npm *)",\n      "Bash(git diff*)",\n      "Bash(npx prisma *)" \n    ],\n    "deny": [\n      "Bash(rm -rf *)",\n      "Bash(git push --force)"\n    ]\n  }\n}`,
      },
      {
        title: '4. The CLAUDE.md file',
        description:
          'Create CLAUDE.md in the project root for persistent context: code conventions, tech stack, specific rules. Claude Code reads it automatically. Also works with AGENTS.md or anthropic.md.',
        code: `# Generate automatically with:\nclaude\n> /init\n\n# Or create manually:\ncat << 'EOF' > CLAUDE.md\n# Project: Next.js API + TypeScript\n- Use Prisma ORM\n- Test with Vitest\n- IDs are string (cuid)\n- No any types\nEOF`,
      },
      {
        title: '5. IDE integration',
        description:
          'Claude Code integrates directly into VS Code and JetBrains (WebStorm, IntelliJ, etc.) via official extensions. You can run conversations without leaving the editor, with full access to project files.',
        code: `# VS Code — install extension:\ncode --install-extension anthropic.claude-code\n\n# JetBrains — from Marketplace:\n# Settings → Plugins → "Claude Code"\n\n# Or use directly from the terminal\n# integrated in the IDE (no extension)`,
      },
      {
        title: '6. Additional directories',
        description:
          'By default, Claude Code only has access to the current directory. You can add external directories with --add-dir — useful when your project depends on libraries or configurations outside the current folder.',
        code: `# Add directories to context:\nclaude --add-dir ~/shared-libs\nclaude --add-dir /etc/nginx/conf.d\n\n# Run with extended permissions\n# (caution — reduces security):\nclaude --dangerously-skip-permissions`,
      },
    ],
  },
}

const ICONS = [
  <Download className="h-5 w-5" />,
  <Shield className="h-5 w-5" />,
  <FolderKey className="h-5 w-5" />,
  <FileCheck className="h-5 w-5" />,
  <Monitor className="h-5 w-5" />,
  <Download className="h-5 w-5" />,
]

export default function Basics() {
  const { lang } = useApp()
  const c = CONTENT[lang]

  return (
    <section id="instalare" className="px-6 py-24">
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

        <div className="grid gap-6 md:grid-cols-2">
          {c.steps.map((step, i) => (
            <Step
              key={i}
              icon={ICONS[i]}
              title={step.title}
              description={step.description}
              code={step.code}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
