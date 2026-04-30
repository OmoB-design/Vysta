// =============================================================================
// Revenue Calculator — Math Engine
// =============================================================================
//
// Core logic: compares a brand's current ROAS against Vysta's 8.78x benchmark
// and calculates how much revenue they're leaving on the table each month.
//
// All currency values are in the same unit as monthlySpend (GBP by default).
// =============================================================================

import type { CalculatorInputs, CalculatorResults } from '@/types/calculator'

/** Vysta's proprietary benchmark ROAS — the average achieved for their clients */
export const VYSTA_BENCHMARK_ROAS = 8.78

/**
 * Run the core revenue gap calculation.
 *
 * Formula:
 *   currentRevenue  = monthlySpend × currentRoas
 *   projectedRevenue = monthlySpend × VYSTA_BENCHMARK_ROAS
 *   monthlyGap      = projectedRevenue − currentRevenue  (clamped to 0 if already above benchmark)
 *   annualGap       = monthlyGap × 12
 *
 * @param inputs - The three values collected from the user
 * @returns Calculated revenue figures (no AI content yet)
 */
export function calculateRevenue(inputs: CalculatorInputs): CalculatorResults {
  const { monthlySpend, currentRoas } = inputs

  const currentRevenue = monthlySpend * currentRoas
  const projectedRevenue = monthlySpend * VYSTA_BENCHMARK_ROAS

  // If the brand already beats the benchmark, gap is 0 (don't show negative numbers)
  const monthlyGap = Math.max(0, projectedRevenue - currentRevenue)
  const annualGap = monthlyGap * 12

  return {
    currentRevenue,
    projectedRevenue,
    monthlyGap,
    annualGap,
  }
}

/**
 * Returns how far below the benchmark a brand's ROAS is, as a percentage.
 * Used for display purposes on the results screen.
 *
 * @example roasGapPercent(3.2) → 63.6 (i.e. 63.6% below 8.78x)
 */
export function roasGapPercent(currentRoas: number): number {
  if (currentRoas >= VYSTA_BENCHMARK_ROAS) return 0
  return ((VYSTA_BENCHMARK_ROAS - currentRoas) / VYSTA_BENCHMARK_ROAS) * 100
}

/**
 * Returns a performance tier label based on current ROAS.
 * Used to personalise copy on the results screen.
 */
export function roasTier(currentRoas: number): 'critical' | 'below' | 'average' | 'good' | 'excellent' {
  if (currentRoas < 2) return 'critical'
  if (currentRoas < 4) return 'below'
  if (currentRoas < 6) return 'average'
  if (currentRoas < VYSTA_BENCHMARK_ROAS) return 'good'
  return 'excellent'
}

/**
 * Human-readable label for the ROAS tier.
 */
export const ROAS_TIER_LABELS: Record<ReturnType<typeof roasTier>, string> = {
  critical:  'Critical — immediate action needed',
  below:     'Below average',
  average:   'Average',
  good:      'Good, but room to grow',
  excellent: 'Excellent — above our benchmark',
}
