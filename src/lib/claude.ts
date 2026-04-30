// =============================================================================
// Claude AI Integration — server-side only, never import in client components
// =============================================================================

import Anthropic from '@anthropic-ai/sdk'
import type { CalculatorInputs } from '@/types/calculator'

// Single shared client — API key read server-side from .env.local
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const platformDescriptions: Record<string, string> = {
  google:   'Google Ads only',
  meta:     'Meta (Facebook/Instagram) only — and currently has zero Google presence',
  both:     'both Google and Meta simultaneously',
  neither:  'no paid advertising currently',
  tiktok:   'TikTok Ads',
  linkedin: 'LinkedIn Ads',
  other:    'other platforms',
}

/**
 * Builds the prompt sent to Claude for the calculator insight paragraph.
 * Injects real user numbers so the output is genuinely personalised.
 */
export function buildCalculatorInsightPrompt(
  inputs: CalculatorInputs,
  results: { currentRevenue: number; projectedRevenue: number; monthlyGap: number }
): string {
  const platformDesc = platformDescriptions[inputs.platform] ?? inputs.platform

  return `You are a senior Google Ads consultant at Ad-Lab, a specialist Google & YouTube Ads agency for e-commerce brands.

A brand has just used our revenue calculator. Here is their situation:
- Monthly ad spend: $${inputs.monthlySpend.toLocaleString()}
- Current ROAS: ${inputs.currentRoas}x
- Platform: ${platformDesc}
- Their current monthly ad revenue: $${Math.round(results.currentRevenue).toLocaleString()}
- What they could be making at Ad-Lab's 8.78x average: $${Math.round(results.projectedRevenue).toLocaleString()}
- Monthly revenue gap: $${Math.round(results.monthlyGap).toLocaleString()}

Write exactly 2–3 sentences of personalised insight. Rules:
- Reference their actual numbers (spend, ROAS, the dollar gap)
- Name the specific opportunity (especially if they're Meta-only or not on Google at all)
- End with a forward-looking hook that creates urgency without being pushy
- Tone: confident, direct, like a trusted expert — not salesy or promotional
- No bullet points. No headers. Just 2–3 flowing sentences.`
}

/**
 * Calls Claude and returns the 2–3 sentence insight paragraph.
 * Falls back to a quality static string if the API call fails.
 */
export async function generateCalculatorInsight(
  inputs: CalculatorInputs,
  results: { currentRevenue: number; projectedRevenue: number; monthlyGap: number }
): Promise<string> {
  const prompt = buildCalculatorInsightPrompt(inputs, results)

  const message = await anthropic.messages.create({
    model:      'claude-opus-4-5',
    max_tokens: 250,
    messages:   [{ role: 'user', content: prompt }],
  })

  const content = message.content[0]
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude')
  }

  return content.text.trim()
}
