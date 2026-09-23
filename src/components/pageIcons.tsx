import {
  Home, Download, Brain, Wrench, Command, PenLine, Bot, Coins, Zap,
  Rocket, Puzzle, Workflow, Building2, ClipboardList,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

/**
 * Single source of truth for per-route iconography.
 * Replaces the emoji previously scattered across Navbar / PageLayout / HomePage
 * with a consistent lucide set (Terminal Atelier design system).
 */
export const PAGE_ICONS: Record<string, LucideIcon> = {
  '/':                Home,
  '/instalare':       Download,
  '/rationament':     Brain,
  '/tools':           Wrench,
  '/comenzi':         Command,
  '/prompting':       PenLine,
  '/modele':          Bot,
  '/tokenuri':        Coins,
  '/automatizare':    Zap,
  '/avansat':         Rocket,
  '/skills':          Puzzle,
  '/workflows':       Workflow,
  '/proiect-complet': Building2,
  '/referinta':       ClipboardList,
}

interface PageIconProps {
  path: string
  className?: string
}

export function PageIcon({ path, className = 'h-4 w-4' }: PageIconProps) {
  const Icon = PAGE_ICONS[path] ?? Home
  return <Icon className={className} />
}
