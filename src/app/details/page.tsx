'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import LeftPanel from '@/components/left-panel'
import { calculateRevenue } from '@/lib/calculations'

const platformLabels: Record<string, string> = {
  google:  'Google only',
  meta:    'Meta only',
  both:    'Both',
  neither: 'Neither',
}

function fmt(n: number) {
  return `$${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
}

function DetailsContent() {
  const searchParams = useSearchParams()
  const adSpendRaw = parseFloat(searchParams.get('adSpend') ?? '0') || 0
  const roasRaw    = parseFloat(searchParams.get('roas')    ?? '0') || 0
  const platformKey = searchParams.get('platform') ?? 'google'

  const [fullName,  setFullName]  = useState('')
  const [email,     setEmail]     = useState('')
  const [consented, setConsented] = useState(false)
  const [loading,   setLoading]   = useState(false)

  const router = useRouter()

  const navigateToResults = () => {
    router.push(
      `/results?adSpend=${adSpendRaw}&roas=${roasRaw}&platform=${platformKey}`
    )
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const results = calculateRevenue({
        monthlySpend: adSpendRaw,
        currentRoas:  roasRaw,
        platform:     platformKey as 'google',
      })
      await fetch('/api/calculator/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: fullName,
          email,
          consented,
          inputs: { monthlySpend: adSpendRaw, currentRoas: roasRaw, platform: platformKey },
          results,
        }),
      })
    } catch {
      // non-blocking — still navigate to results
    } finally {
      setLoading(false)
      navigateToResults()
    }
  }

  const summary = {
    adSpend:  fmt(adSpendRaw),
    roas:     `${roasRaw}x`,
    platform: platformLabels[platformKey] ?? platformKey,
    dim:      true,
  }

  return (
    <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden bg-(--color-surface-fg-01)">

      <LeftPanel currentView="summary" summary={summary} />

      {/* Right panel */}
      <main className="relative flex flex-1 flex-col overflow-hidden md:rounded-bl-(--radius-6xl) md:rounded-tl-(--radius-6xl) border border-(--color-surface-stroke) bg-(--color-surface-primary) shadow-(--shadow-panel)">

        {/* Scrollable content area */}
        <div className="flex flex-1 flex-col gap-(--space-20) overflow-y-auto px-5 pt-8 pb-8 md:px-(--space-120) md:pt-(--space-120) md:pb-(--space-64)">

          {/* Notification tag */}
          <div className="px-(--space-0) py-(--space-12)">
            <div className="inline-flex shrink-0 items-center justify-center rounded-[15px] bg-(--color-grey-700) px-(--space-6) py-(--space-4)">
              <span className="text-caption-2 font-medium leading-tight text-(--color-white) whitespace-nowrap">
                Vysta | tools.growwithvysta.com
              </span>
            </div>
          </div>

          {/* Title + form */}
          <div className="flex flex-col gap-(--space-40)">

            {/* Title */}
            <div className="flex flex-col gap-(--space-8)">
              <p className="font-display text-h4 font-medium leading-tight text-(--color-text-heading-01)">
                Almost there!
              </p>
              <p className="font-sans text-caption-1 font-medium leading-tight text-(--color-text-heading-06)">
                Where should we send your full breakdown?
              </p>
            </div>

            {/* Form */}
            <div className="flex flex-col gap-(--space-40)">

              {/* Fields */}
              <div className="flex flex-col gap-(--space-32)">
                <div className="flex flex-col gap-[16px]">

                  {/* Full name */}
                  <div className="flex flex-col gap-[6px]">
                    <label
                      htmlFor="fullName"
                      className="font-sans text-caption-1 font-medium leading-tight text-(--color-text-heading-01)"
                    >
                      Full name
                    </label>
                    <div className="flex w-full items-center overflow-hidden rounded-(--radius-xl) border border-(--color-surface-stroke) bg-(--color-surface-primary) px-[14px] py-(--space-14) shadow-(--shadow-input) transition-[border-color,box-shadow] duration-150 ease-in-out focus-within:border-(--color-blue-500) focus-within:shadow-[0px_0px_0px_2px_rgba(0,161,234,0.15)]">
                      <input
                        id="fullName"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your name"
                        className="flex-1 bg-transparent text-caption-1 font-medium leading-tight text-(--color-text-heading-02) outline-none placeholder:text-(--color-grey-400)"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-[6px]">
                    <label
                      htmlFor="email"
                      className="font-sans text-caption-1 font-medium leading-tight text-(--color-text-heading-01)"
                    >
                      Email address
                    </label>
                    <div className="flex w-full items-center overflow-hidden rounded-(--radius-xl) border border-(--color-surface-stroke) bg-(--color-surface-primary) px-[14px] py-(--space-14) shadow-(--shadow-input) transition-[border-color,box-shadow] duration-150 ease-in-out focus-within:border-(--color-blue-500) focus-within:shadow-[0px_0px_0px_2px_rgba(0,161,234,0.15)]">
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email@yourbrand.com"
                        className="flex-1 bg-transparent text-caption-1 font-medium leading-tight text-(--color-text-heading-02) outline-none placeholder:text-(--color-grey-400)"
                      />
                    </div>
                  </div>
                </div>

                {/* Consent + button */}
                <div className="flex flex-col gap-(--space-32)">

                  {/* Consent row */}
                  <button
                    type="button"
                    onClick={() => setConsented(!consented)}
                    className="flex items-center gap-(--space-10)"
                  >
                    {consented ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 18 18" className="flex-none">
                        <polyline points="5.75 9.25 8 11.75 12.25 6.25" fill="none" stroke="#1c1f21" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>
                        <rect x="2.75" y="2.75" width="12.5" height="12.5" rx="2" ry="2" fill="none" stroke="#1c1f21" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 18 18" className="flex-none">
                        <rect x="2.75" y="2.75" width="12.5" height="12.5" rx="2" ry="2" fill="none" stroke="#1c1f21" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>
                      </svg>
                    )}
                    <span className="text-caption-2 font-medium leading-tight text-(--color-text-heading-06)">
                      I&apos;m happy to have Vysta to follow up with me
                    </span>
                  </button>

                  {/* Primary button */}
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full rounded-(--radius-lg) bg-(--color-btn-primary-bg) px-(--space-12) py-(--space-14) text-center text-caption-1 font-medium leading-tight text-(--color-btn-primary-text) shadow-(--shadow-soft) transition-shadow duration-150 active:shadow-(--shadow-inset-sm) disabled:opacity-60"
                  >
                    {loading ? 'Saving…' : 'Show me the number'}
                  </button>
                </div>
              </div>

              {/* Skip row */}
              <button
                type="button"
                onClick={navigateToResults}
                className="flex items-center justify-center gap-[4px] text-caption-1"
              >
                <span className="font-normal text-(--color-text-heading-04)">Skip —</span>
                <span className="font-medium text-(--color-blue-500)">Show result without saving</span>
              </button>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_0px_2px_0px_rgba(255,255,255,0.5)]" />
      </main>

    </div>
  )
}

export default function DetailsPage() {
  return (
    <Suspense>
      <DetailsContent />
    </Suspense>
  )
}
