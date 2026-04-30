import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = url && key ? createClient(url, key) : null

export interface LeadInsert {
  fullName:  string
  email:     string
  consented: boolean
  adSpend:   number
  roas:      number
  platform:  string
  currentRevenue:   number
  projectedRevenue: number
  monthlyGap:  number
  annualGap:   number
}

export async function saveLead(data: LeadInsert): Promise<void> {
  if (!supabase) {
    console.warn('Supabase not configured — skipping lead save')
    return
  }
  const { error } = await supabase.from('leads').insert([{
    full_name:         data.fullName,
    email:             data.email,
    consented:         data.consented,
    ad_spend:          data.adSpend,
    roas:              data.roas,
    platform:          data.platform,
    current_revenue:   data.currentRevenue,
    projected_revenue: data.projectedRevenue,
    monthly_gap:       data.monthlyGap,
    annual_gap:        data.annualGap,
    created_at:        new Date().toISOString(),
  }])
  if (error) throw error
}
