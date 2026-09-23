import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

interface CodeBlockProps {
  code: string
  className?: string
  /** optional language / filename label shown in the chrome bar */
  label?: string
}

export function CodeBlock({ code, className = '', label }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={`preserve-dark group relative overflow-hidden rounded-xl border border-zinc-800 bg-terminal edge-light ${className}`}>
      {label && (
        <div className="flex items-center gap-1.5 border-b border-zinc-800/80 px-3.5 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
          <span className="ml-2 font-mono text-[11px] text-zinc-500">{label}</span>
        </div>
      )}
      <button
        onClick={copy}
        className="absolute top-2 right-2 z-10 rounded-lg border border-zinc-700/60 bg-zinc-800/80 p-1.5 text-zinc-400 opacity-0 backdrop-blur-sm transition-all duration-200 hover:border-amber-500/40 hover:text-amber-400 focus-visible:opacity-100 group-hover:opacity-100"
        title="Copiază codul"
        type="button"
      >
        {copied
          ? <Check className="h-3.5 w-3.5 text-green-400" />
          : <Copy className="h-3.5 w-3.5" />
        }
      </button>
      <pre className="overflow-x-auto p-3.5 font-mono text-xs leading-relaxed text-zinc-300">
        <code>{code}</code>
      </pre>
    </div>
  )
}
