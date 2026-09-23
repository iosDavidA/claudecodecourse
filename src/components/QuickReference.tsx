import { BookOpen, Terminal, Slash } from 'lucide-react'
import { useApp } from '../contexts/AppContext'

interface FlagItem {
  flag: string
  desc: string
}

interface CommandItem {
  cmd: string
  desc: string
}

interface ShortcutItem {
  key: string
  desc: string
}

const CONTENT = {
  ro: {
    badge: 'Cheat Sheet',
    title: 'Referință rapidă',
    subtitle:
      'Toate flag-urile CLI, comenzile slash built-in și shortcut-urile de tastatură într-un singur loc. Bookmark-uiește sau printează.',
    cliTitle: 'Flag-uri CLI',
    slashTitle: 'Comenzi Slash built-in',
    shortcutsTitle: 'Keyboard shortcuts',
    flags: [
      { flag: 'claude', desc: 'Pornește sesiune interactivă în directorul curent' },
      { flag: 'claude -p "prompt"', desc: 'Non-interactiv: un singur prompt, un singur răspuns (ideal CI/CD)' },
      { flag: 'claude -r', desc: 'Resume: continuă ultima conversație cu tot contextul' },
      { flag: 'claude -c', desc: 'Continuă ultima conversație (alias pentru --continue)' },
      { flag: 'claude --model <id>', desc: 'Selectează modelul: opus (5.5, default), sonnet, haiku, fable sau ID complet' },
      { flag: 'claude --add-dir <path>', desc: 'Adaugă directoare extra la contextul sesiunii' },
      { flag: 'claude --allowedTools "..."', desc: 'Restricționează tools disponibile: Read, Edit, Write, Bash' },
      { flag: 'claude --output-format <f>', desc: 'Format output: text (default), json, stream-json' },
      { flag: 'claude --max-turns <n>', desc: 'Limitează numărul de turns agentic (implicit: nelimitat)' },
      { flag: 'claude --verbose', desc: 'Output verbose: afișează toate tool call-urile și detalii interne' },
      { flag: 'claude --no-stream', desc: 'Dezactivează streaming — primești răspunsul complet dintr-o dată' },
      { flag: 'claude --dangerously-skip-permissions', desc: 'Sare peste toate confirmările (periculos — doar în sandbox-uri)' },
      { flag: 'claude config', desc: 'Deschide configurarea interactivă a setărilor globale' },
      { flag: 'claude mcp', desc: 'Listează și gestionează serverele MCP conectate' },
      { flag: 'claude mcp add <n> <cmd>', desc: 'Adaugă un server MCP nou cu numele și comanda specificată' },
      { flag: 'claude update', desc: 'Actualizează Claude Code la ultima versiune disponibilă' },
    ] as FlagItem[],
    builtinCommands: [
      { cmd: '/help', desc: 'Afișează toate comenzile disponibile și descrierile lor' },
      { cmd: '/clear', desc: 'Resetează conversația — șterge tot contextul din sesiunea curentă' },
      { cmd: '/compact', desc: 'Comprimă conversația lungă în rezumat pt. a economisi tokeni' },
      { cmd: '/plan', desc: 'Intră în Plan mode — Claude analizează fără a executa niciun tool' },
      { cmd: '/init', desc: 'Generează CLAUDE.md scanând structura și framework-ul proiectului' },
      { cmd: '/review', desc: 'Code review automat pe diff-ul curent față de branch-ul de bază' },
      { cmd: '/commit', desc: 'Generează mesaj de commit convențional și execută git commit' },
      { cmd: '/cost', desc: 'Afișează consumul de tokeni și costul estimat al sesiunii curente' },
      { cmd: '/fast', desc: 'Comută Fast mode — output mai rapid cu același model, la preț premium (Opus 5.5 / 5 / 4.8)' },
      { cmd: '/effort', desc: 'Setează adâncimea raționamentului: low, medium, high, xhigh, max sau auto' },
      { cmd: '/loop', desc: 'Rulează un prompt repetat în sesiune: /loop 5m <prompt> sau self-paced fără interval' },
      { cmd: '/schedule', desc: 'Creează / listează Routines în cloud: /schedule daily PR review at 9am' },
      { cmd: '/model', desc: 'Schimbă modelul activ: opus, sonnet, haiku, fable, opusplan sau ID complet' },
      { cmd: '/memory', desc: 'Gestionează memoriile persistente: adaugă, editează, șterge' },
      { cmd: '/mcp', desc: 'Afișează serverele MCP conectate și tool-urile disponibile' },
      { cmd: '/bug', desc: 'Deschide un raport de bug pre-completat pentru Claude Code' },
      { cmd: '/doctor', desc: 'Diagnostichează instalarea: verifică node, autentificare, config' },
      { cmd: '/status', desc: 'Afișează statusul sesiunii: tokeni, model, fișiere în context' },
      { cmd: '! <cmd>', desc: 'Execută comandă shell direct din prompt (ex: ! npm test, ! git log)' },
    ] as CommandItem[],
    shortcuts: [
      { key: 'Enter', desc: 'Trimite prompt-ul curent' },
      { key: 'Shift+Enter', desc: 'Linie nouă fără trimitere' },
      { key: 'Shift+Tab', desc: 'Comută Plan mode ↔ Act mode' },
      { key: 'Escape', desc: 'Anulează acțiunea curentă' },
      { key: 'Ctrl+C', desc: 'Oprește generarea imediat' },
      { key: '↑ / ↓', desc: 'Navighează istoricul prompt-urilor' },
      { key: 'Tab', desc: 'Acceptă autocompletarea' },
    ] as ShortcutItem[],
  },
  en: {
    badge: 'Cheat Sheet',
    title: 'Quick reference',
    subtitle:
      'All CLI flags, built-in slash commands, and keyboard shortcuts in one place. Bookmark it or print it.',
    cliTitle: 'CLI Flags',
    slashTitle: 'Built-in Slash Commands',
    shortcutsTitle: 'Keyboard shortcuts',
    flags: [
      { flag: 'claude', desc: 'Start an interactive session in the current directory' },
      { flag: 'claude -p "prompt"', desc: 'Non-interactive: one prompt, one response (ideal for CI/CD)' },
      { flag: 'claude -r', desc: 'Resume: continue the last conversation with full context' },
      { flag: 'claude -c', desc: 'Continue the last conversation (alias for --continue)' },
      { flag: 'claude --model <id>', desc: 'Select model: opus (5.5, default), sonnet, haiku, fable or full ID' },
      { flag: 'claude --add-dir <path>', desc: 'Add extra directories to the session context' },
      { flag: 'claude --allowedTools "..."', desc: 'Restrict available tools: Read, Edit, Write, Bash' },
      { flag: 'claude --output-format <f>', desc: 'Output format: text (default), json, stream-json' },
      { flag: 'claude --max-turns <n>', desc: 'Limit the number of agentic turns (default: unlimited)' },
      { flag: 'claude --verbose', desc: 'Verbose output: shows all tool calls and internal details' },
      { flag: 'claude --no-stream', desc: 'Disable streaming — receive the complete response at once' },
      { flag: 'claude --dangerously-skip-permissions', desc: 'Skip all confirmations (dangerous — only in sandboxes)' },
      { flag: 'claude config', desc: 'Open the interactive global settings configuration' },
      { flag: 'claude mcp', desc: 'List and manage connected MCP servers' },
      { flag: 'claude mcp add <n> <cmd>', desc: 'Add a new MCP server with the specified name and command' },
      { flag: 'claude update', desc: 'Update Claude Code to the latest available version' },
    ] as FlagItem[],
    builtinCommands: [
      { cmd: '/help', desc: 'Show all available commands and their descriptions' },
      { cmd: '/clear', desc: 'Reset the conversation — clears all context from the current session' },
      { cmd: '/compact', desc: 'Compress a long conversation into a summary to save tokens' },
      { cmd: '/plan', desc: 'Enter Plan mode — Claude analyzes without executing any tool' },
      { cmd: '/init', desc: 'Generate CLAUDE.md by scanning the project structure and framework' },
      { cmd: '/review', desc: 'Automatic code review on the current diff against the base branch' },
      { cmd: '/commit', desc: 'Generate a conventional commit message and execute git commit' },
      { cmd: '/cost', desc: 'Show token usage and estimated cost of the current session' },
      { cmd: '/fast', desc: 'Toggle Fast mode — faster output with the same model, at premium pricing (Opus 5.5 / 5 / 4.8)' },
      { cmd: '/effort', desc: 'Set reasoning depth: low, medium, high, xhigh, max or auto' },
      { cmd: '/loop', desc: 'Re-run a prompt in the session: /loop 5m <prompt>, or self-paced without an interval' },
      { cmd: '/schedule', desc: 'Create / list cloud Routines: /schedule daily PR review at 9am' },
      { cmd: '/model', desc: 'Switch the active model: opus, sonnet, haiku, fable, opusplan or full ID' },
      { cmd: '/memory', desc: 'Manage persistent memories: add, edit, delete' },
      { cmd: '/mcp', desc: 'Show connected MCP servers and available tools' },
      { cmd: '/bug', desc: 'Open a pre-filled bug report for Claude Code' },
      { cmd: '/doctor', desc: 'Diagnose the installation: checks node, auth, config' },
      { cmd: '/status', desc: 'Show session status: tokens, model, files in context' },
      { cmd: '! <cmd>', desc: 'Execute a shell command directly from the prompt (e.g. ! npm test, ! git log)' },
    ] as CommandItem[],
    shortcuts: [
      { key: 'Enter', desc: 'Send the current prompt' },
      { key: 'Shift+Enter', desc: 'New line without sending' },
      { key: 'Shift+Tab', desc: 'Toggle Plan mode ↔ Act mode' },
      { key: 'Escape', desc: 'Cancel the current action' },
      { key: 'Ctrl+C', desc: 'Stop generation immediately' },
      { key: '↑ / ↓', desc: 'Navigate prompt history' },
      { key: 'Tab', desc: 'Accept autocomplete suggestion' },
    ] as ShortcutItem[],
  },
}

export default function QuickReference() {
  const { lang } = useApp()
  const c = CONTENT[lang]

  return (
    <section id="referinta" className="px-6 py-24">
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
          {/* CLI Flags */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="mb-5 flex items-center gap-2">
              <Terminal className="h-5 w-5 text-amber-400" />
              <h3 className="text-lg font-semibold text-white">{c.cliTitle}</h3>
            </div>
            <div className="space-y-0.5">
              {c.flags.map((f, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-0.5 rounded-lg px-3 py-2 odd:bg-zinc-800/30 sm:flex-row sm:items-start sm:gap-4"
                >
                  <code className="min-w-0 flex-shrink-0 font-mono text-xs text-amber-400 sm:w-52">
                    {f.flag}
                  </code>
                  <span className="text-xs leading-relaxed text-zinc-400">{f.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Slash Commands + Shortcuts */}
          <div className="flex flex-col gap-6">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
              <div className="mb-5 flex items-center gap-2">
                <Slash className="h-5 w-5 text-amber-400" />
                <h3 className="text-lg font-semibold text-white">{c.slashTitle}</h3>
              </div>
              <div className="space-y-0.5">
                {c.builtinCommands.map((cmd, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-lg px-3 py-2 odd:bg-zinc-800/30"
                  >
                    <code className="w-20 flex-shrink-0 font-mono text-xs text-amber-400">
                      {cmd.cmd}
                    </code>
                    <span className="text-xs leading-relaxed text-zinc-400">{cmd.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
              <div className="mb-5 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-amber-400" />
                <h3 className="text-lg font-semibold text-white">{c.shortcutsTitle}</h3>
              </div>
              <div className="space-y-0.5">
                {c.shortcuts.map((s, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 rounded-lg px-3 py-2 odd:bg-zinc-800/30"
                  >
                    <kbd className="w-28 flex-shrink-0 rounded border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-center font-mono text-xs text-zinc-300">
                      {s.key}
                    </kbd>
                    <span className="text-xs text-zinc-400">{s.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
