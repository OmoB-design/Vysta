import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { calculateRevenue } from '@/lib/calculations'
import type { LeadPayload } from '@/types/calculator'

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase env vars not set')
  return createClient(url, key, { auth: { persistSession: false } })
}

export async function POST(req: NextRequest) {
  let body: LeadPayload
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { firstName, email, consented, inputs, results } = body

  if (!email || !inputs || !results) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 422 })
  }

  // Re-derive results server-side so the client can't send fabricated numbers
  const verified = calculateRevenue(inputs)

  try {
    const db = getAdminClient()
    const { error } = await db.from('calculator_leads').insert([{
      first_name:        firstName,
      email,
      consented:         consented ?? false,
      monthly_spend:     inputs.monthlySpend,
      current_roas:      inputs.currentRoas,
      platform:          inputs.platform,
      current_revenue:   verified.currentRevenue,
      projected_revenue: verified.projectedRevenue,
      monthly_gap:       verified.monthlyGap,
      annual_gap:        verified.annualGap,
    }])
    if (error) throw error
  } catch (err) {
    console.error('[leads] insert failed', err)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }

  return NextResponse.json({ ok: true }, { status: 201 })
}
