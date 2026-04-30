// =============================================================================
// POST /api/calculate
// Validates inputs → runs math → calls Claude → returns CalculatorResults
// This route is server-side only. The Anthropic API key never reaches the client.
// =============================================================================

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { calculateRevenue } from '@/lib/calculations'
import { generateCalculatorInsight } from '@/lib/claude'
import type { CalculatorInputs } from '@/types/calculator'

// Zod schema mirrors CalculatorInputs — never trust raw client data
const CalculatorInputSchema = z.object({
  monthlySpend: z.number().min(100).max(10_000_000),
  currentRoas:  z.number().min(0.1).max(100),
  platform:     z.enum(['google', 'meta', 'both', 'neither', 'tiktok', 'linkedin', 'other']),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = CalculatorInputSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error:   'Invalid input — please check your values and try again.',
          code:    'INVALID_INPUT',
        },
        { status: 400 }
      )
    }

    const inputs: CalculatorInputs = parsed.data
    const mathResults = calculateRevenue(inputs)

    // Claude call — server-side only. Graceful fallback on error.
    let aiInsight: string
    try {
      aiInsight = await generateCalculatorInsight(inputs, mathResults)
    } catch (err) {
      console.error('[Claude] Insight generation failed:', err)
      // Quality fallback so the page never shows an error state
      const gap = Math.round(mathResults.monthlyGap).toLocaleString()
      aiInsight =
        inputs.platform === 'meta'
          ? `Running Meta-only at ${inputs.currentRoas}x ROAS means you're completely absent from Google — the channel where high-intent buyers actively search for what you sell. At your spend level, Ad-Lab clients typically reach 8.78x on Google within 90 days. That $${gap}/month gap is there to be closed.`
          : `At ${inputs.currentRoas}x ROAS you're generating solid volume, but at Ad-Lab's 8.78x benchmark that same budget produces $${gap} more every single month. The delta between where you are and where your competitors are operating is the opportunity. It's fixable with the right strategy.`
    }

    return NextResponse.json({
      success: true,
      data: {
        currentRevenue:   mathResults.currentRevenue,
        projectedRevenue: mathResults.projectedRevenue,
        monthlyGap:       mathResults.monthlyGap,
        annualGap:        mathResults.annualGap,
        aiInsight,
      },
    })
  } catch (err) {
    console.error('[/api/calculate] Unhandled error:', err)
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again.', code: 'SERVER_ERROR' },
      { status: 500 }
    )
  }
}
