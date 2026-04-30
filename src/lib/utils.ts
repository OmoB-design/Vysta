import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/** Combines Tailwind class names, resolving conflicts intelligently */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number as currency.
 * @example formatCurrency(47200) → "£47,200"
 * @example formatCurrency(1500000) → "£1,500,000"
 */
export function formatCurrency(value: number, currency = 'GBP'): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value)
}

/**
 * Format a ROAS multiplier.
 * @example formatROAS(3.2) → "3.2x"
 * @example formatROAS(8.78) → "8.78x"
 */
export function formatROAS(value: number): string {
  const rounded = Math.round(value * 100) / 100
  return `${rounded}x`
}

/**
 * Format a large number with K/M suffix for display.
 * @example formatCompact(1500000) → "£1.5M"
 * @example formatCompact(47200) → "£47.2K"
 */
export function formatCompact(value: number, currency = '£'): string {
  if (value >= 1_000_000) {
    return `${currency}${(value / 1_000_000).toFixed(1)}M`
  }
  if (value >= 1_000) {
    return `${currency}${(value / 1_000).toFixed(1)}K`
  }
  return `${currency}${value.toFixed(0)}`
}
