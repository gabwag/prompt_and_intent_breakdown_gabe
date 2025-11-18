import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { nanoid } from 'nanoid'
import { NodeType } from '@/types/graph'

/**
 * Merge Tailwind classes safely
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generate unique ID for nodes/edges
 */
export function generateId(prefix?: string): string {
  return prefix ? `${prefix}-${nanoid(8)}` : nanoid(8)
}

/**
 * Get color scheme for node type
 */
export function getNodeColor(type: NodeType): {
  bg: string
  border: string
  text: string
  hex: string
} {
  const colors = {
    intent: {
      bg: 'bg-blue-50/80',
      border: 'border-blue-300',
      text: 'text-blue-900',
      hex: '#3B82F6',
    },
    constraint: {
      bg: 'bg-amber-50/80',
      border: 'border-amber-300',
      text: 'text-amber-900',
      hex: '#F59E0B',
    },
    persona: {
      bg: 'bg-emerald-50/80',
      border: 'border-emerald-300',
      text: 'text-emerald-900',
      hex: '#10B981',
    },
    knowledge: {
      bg: 'bg-indigo-50/80',
      border: 'border-indigo-300',
      text: 'text-indigo-900',
      hex: '#6366F1',
    },
    gap: {
      bg: 'bg-purple-50/80',
      border: 'border-purple-300',
      text: 'text-purple-900',
      hex: '#A855F7',
    },
  }

  return colors[type] || colors.intent
}

/**
 * Calculate node position in a circular layout around a parent
 */
export function calculateChildPosition(
  parentX: number,
  parentY: number,
  childIndex: number,
  totalChildren: number,
  radius: number = 250
): { x: number; y: number } {
  const angle = (2 * Math.PI * childIndex) / totalChildren
  return {
    x: parentX + radius * Math.cos(angle),
    y: parentY + radius * Math.sin(angle),
  }
}

/**
 * Debounce function for input handling
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

/**
 * Hash string for caching
 */
export function hashString(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return hash.toString(36)
}
