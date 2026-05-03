'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, animate } from 'framer-motion'
import LeftPanel from '@/components/left-panel'
import { calculateRevenue } from '@/lib/calculations'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const platformLabels: Record<string, string> = {
  google:   'Google only',
  meta:     'Meta only',
  both:     'Both',
  neither:  'Neither',
  tiktok:   'TikTok',
  linkedin: 'LinkedIn',
  other:    'Other',
}

function fmtRaw(n: number) {
  return n.toLocaleString('en-US', { maximumFractionDigits: 0 })
}

// ─── Animated Number Counter ───────────────────────────────────────────────────

interface AnimatedNumberProps {
  target:   number
  prefix?:  string
  suffix?:  string
  delay?:   number
  duration?: number
  className?: string
}

function AnimatedNumber({
  target,
  prefix  = '$',
  suffix  = '',
  delay   = 0,
  duration = 1.8,
  className,
}: AnimatedNumberProps) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    setDisplay(0)

    const timer = setTimeout(() => {
      const controls = animate(0, target, {
        duration,
        ease: 'easeOut',
        onUpdate: (v) => setDisplay(Math.round(v)),
      })
      return () => controls.stop()
    }, delay * 1000)

    return () => clearTimeout(timer)
  }, [target, delay, duration])

  return (
    <span className={className}>
      {prefix}{fmtRaw(display)}{suffix}
    </span>
  )
}

// ─── Insight Shimmer Skeleton ──────────────────────────────────────────────────

function InsightSkeleton() {
  return (
    <div className="flex flex-col gap-[6px]">
      <div className="skeleton-shimmer h-[12px] w-full rounded-full" />
      <div className="skeleton-shimmer h-[12px] w-[94%] rounded-full" />
      <div className="skeleton-shimmer h-[12px] w-[80%] rounded-full" />
    </div>
  )
}

// ─── Animation variants ────────────────────────────────────────────────────────
// Scoped to the split-card content only. Left column leads, right column follows.
// Pass absolute delay (seconds) via `custom`. Blur clears on expo-out bezier.

const fadeUp = {
  hidden:  { opacity: 0, filter: 'blur(5px)', y: 8 },
  visible: (delay: number) => ({
    opacity: 1,
    filter:  'blur(0px)',
    y:       0,
    transition: {
      delay,
      duration: 0.48,
      ease:     [0.22, 1, 0.36, 1] as const,
    },
  }),
}

// ─── Main Content ──────────────────────────────────────────────────────────────

function ResultsContent() {
  const searchParams = useSearchParams()

  const adSpendRaw  = parseFloat(searchParams.get('adSpend')  ?? '0') || 0
  const roasRaw     = parseFloat(searchParams.get('roas')     ?? '0') || 0
  const platformKey = searchParams.get('platform') ?? 'google'

  const results = calculateRevenue({
    monthlySpend: adSpendRaw,
    currentRoas:  roasRaw,
    platform:     platformKey as 'google',
  })

  const annualCurrentRevenue = results.currentRevenue * 12

  // Claude insight
  const [insight, setInsight]           = useState<string | null>(null)
  const [insightError, setInsightError] = useState(false)

  useEffect(() => {
    if (adSpendRaw === 0 || roasRaw === 0) return

    fetch('/api/calculate', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        monthlySpend: adSpendRaw,
        currentRoas:  roasRaw,
        platform:     platformKey,
      }),
    })
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data?.aiInsight) {
          setInsight(json.data.aiInsight)
        } else {
          setInsightError(true)
        }
      })
      .catch(() => setInsightError(true))
  }, [adSpendRaw, roasRaw, platformKey])

  // ── Resizable split panel ──────────────────────────────────────────────────
  const [leftPct, setLeftPct] = useState(50)
  const [isMobile, setIsMobile] = useState(false)
  const containerRef           = useRef<HTMLDivElement>(null)
  const isDragging             = useRef(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const pct  = Math.min(Math.max(((e.clientX - rect.left) / rect.width) * 100, 25), 75)
      setLeftPct(pct)
    }
    const onUp = () => { isDragging.current = false }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup',   onUp)
    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup',   onUp)
    }
  }, [])

  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault()
    isDragging.current = true
  }
  // ──────────────────────────────────────────────────────────────────────────

  const summary = {
    adSpend:  `$${fmtRaw(adSpendRaw)}`,
    roas:     `${roasRaw}x`,
    platform: platformLabels[platformKey] ?? platformKey,
    dim:      true,
  }

  const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL ?? 'https://calendly.com/d/cm28-g34-5xf/google-and-youtube-ads-audit-with-vysta'

  return (
    <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden bg-(--color-surface-fg-01)">

      <LeftPanel currentView="summary" summary={summary} />

      {/* Right panel — always visible, animations live only inside the split card */}
      <main className="relative flex flex-1 flex-col md:items-center overflow-hidden md:rounded-bl-(--radius-6xl) md:rounded-tl-(--radius-6xl) border border-(--color-surface-stroke) bg-(--color-surface-primary) shadow-(--shadow-panel)">

        <div className="flex flex-1 flex-col items-start gap-(--space-50) overflow-y-auto px-5 pt-8 pb-8 md:px-(--space-120) md:pt-(--space-120) md:pb-(--space-64) md:w-full md:max-w-[820px]">

          {/* ── Notification tag — static ── */}
          <div className="px-(--space-0) py-(--space-12)">
            <div className="inline-flex shrink-0 items-center justify-center rounded-[15px] bg-(--color-grey-700) px-(--space-6) py-(--space-4)">
              <span className="text-caption-2 font-medium leading-tight text-(--color-white) whitespace-nowrap">
                Vysta | tools.growwithvysta.com
              </span>
            </div>
          </div>

          {/* ── Split results card ── */}
          <div
            ref={containerRef}
            className="relative flex flex-col md:flex-row w-full select-none shadow-[0px_0px_24px_0px_rgba(226,226,226,0.25)]"
          >

            {/* LEFT COLUMN — Where you are now */}
            <div
              style={isMobile ? undefined : { width: `${leftPct}%` }}
              className="relative flex flex-col rounded-t-(--radius-4xl) md:rounded-t-none md:rounded-tl-(--radius-4xl) md:rounded-bl-(--radius-4xl) border-[0.5px] border-(--color-surface-stroke) p-(--space-20) overflow-hidden"
            >
              <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-(--color-surface-warm)" />
              <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_0px_1.8px_0px_rgba(255,255,255,0.9)]" />

              {/* Current revenue — left column leads */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={0.15}
                className="relative flex flex-col gap-(--space-16) pb-(--space-24)"
              >
                <p className="font-sans text-caption-1 font-medium leading-body text-(--color-text-heading-06)">
                  Where you are now?
                </p>
                <p className="font-display text-h4 font-medium leading-tight text-(--color-text-heading-01)">
                  <AnimatedNumber
                    target={results.currentRevenue}
                    suffix="/mo"
                    delay={0.3}
                    duration={1.4}
                  />
                </p>
                <p className="font-sans text-caption-1 font-medium leading-body text-(--color-text-heading-06)">
                  At {roasRaw}x ROAS on ${fmtRaw(adSpendRaw)}/mo
                </p>
              </motion.div>

              {/* Divider */}
              <div className="relative border-t-[0.8px] border-(--color-surface-stroke)" />

              {/* Annual projection */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={0.3}
                className="relative flex flex-col gap-(--space-16) pt-(--space-24)"
              >
                <p className="font-sans text-caption-1 font-medium leading-body text-(--color-text-heading-01)">
                  Annual projection
                </p>
                <p className="font-display text-h4 font-medium leading-tight text-(--color-text-heading-01)">
                  <AnimatedNumber
                    target={annualCurrentRevenue}
                    delay={0.45}
                    duration={1.5}
                  />
                </p>
              </motion.div>
            </div>

            {/* RIGHT COLUMN — Where Vysta clients are */}
            <div
              style={isMobile ? undefined : { width: `${100 - leftPct}%` }}
              className="relative flex flex-col gap-(--space-18) rounded-b-(--radius-4xl) md:rounded-b-none md:rounded-tr-(--radius-4xl) md:rounded-br-(--radius-4xl) border-[0.5px] border-(--color-surface-stroke) px-(--space-20) py-(--space-20) md:pl-(--space-40) md:pr-(--space-20)"
            >
              <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-(--color-surface-dashboard)" />
              <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_0px_1.8px_0px_rgba(255,250,250,0.9)]" />

              {/* Projected revenue — right column follows left */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={0.45}
                className="relative flex flex-col gap-(--space-16) pb-(--space-24)"
              >
                <p className="font-sans text-caption-1 font-medium leading-body text-(--color-text-heading-06)">
                  Where Vysta clients like you are
                </p>
                <p className="font-display text-h4 font-medium leading-tight text-(--color-text-heading-01)">
                  <AnimatedNumber
                    target={results.projectedRevenue}
                    suffix="/mo"
                    delay={0.6}
                    duration={1.8}
                  />
                </p>

                {/* Gap line — the money shot */}
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  custom={0.6}
                  className="flex flex-col gap-(--space-8)"
                >
                  <p className="font-sans text-caption-1 font-medium leading-body text-(--color-text-heading-06)">
                    That&apos;s{' '}
                    <span className="text-(--color-text-heading-02)">
                      <AnimatedNumber
                        target={results.monthlyGap}
                        delay={0.75}
                        duration={1.8}
                      />
                    </span>
                    {' '}you&apos;re not making every month.
                  </p>
                  {results.annualGap > 0 && (
                    <p className="font-sans text-caption-2 font-medium leading-tight text-(--color-grey-500)">
                      Over a year:{' '}
                      <AnimatedNumber
                        target={results.annualGap}
                        delay={0.9}
                        duration={2.0}
                        className="text-(--color-text-heading-05)"
                      />{' '}
                      in your competitor&apos;s pocket
                    </p>
                  )}
                </motion.div>
              </motion.div>

              {/* AI Insight card — always visible, no fade wrapper */}
              <div className="relative flex flex-col gap-(--space-32)">
                {/* Outer grey wrapper */}
                <div className="rounded-(--radius-3xl) bg-(--color-surface-fg-01) shadow-(--shadow-surface)">
                  {/* Tag row */}
                  <div className="px-(--space-10) py-(--space-8)">
                    <div className="inline-flex items-center rounded-[15px] bg-(--color-grey-700) px-(--space-6) py-(--space-4)">
                      <span className="text-caption-3 font-medium leading-tight text-(--color-white) whitespace-nowrap">
                        Vysta | Insights
                      </span>
                    </div>
                  </div>
                  {/* Padded wrapper so grey shows on left, right and bottom */}
                  <div className="px-(--space-10) pb-(--space-10)">
                    <div className="relative overflow-hidden rounded-(--radius-3xl) border border-(--color-surface-stroke) bg-(--color-surface-primary) px-(--space-10) py-(--space-12) shadow-(--shadow-float)">
                      <div className="relative">
                        {insight ? (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                            className="font-sans text-caption-2 font-normal leading-tight text-(--color-text-body)"
                          >
                            {insight}
                          </motion.p>
                        ) : insightError ? (
                          <p className="font-sans text-caption-2 font-normal leading-tight text-(--color-text-body)">
                            At {roasRaw}x ROAS, you&apos;re leaving{' '}
                            <strong>${fmtRaw(results.monthlyGap)}</strong> on the table every month.
                            Vysta clients at your spend level consistently reach 8.78x within 90 days.
                            That gap is fixable.
                          </p>
                        ) : (
                          <InsightSkeleton />
                        )}
                      </div>
                      <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_2.59px_2.59px_0px_rgba(246,246,246,0.25)]" />
                    </div>
                  </div>
                </div>

                {/* CTA buttons */}
                <motion.div
                  initial={{ opacity: 0, filter: 'blur(4px)', y: 6 }}
                  animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                  transition={{ delay: 1.15, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col gap-(--space-12)"
                >
                  <a
                    href={bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative block w-full overflow-hidden rounded-(--radius-lg) border-[0.8px] border-(--color-white) px-(--space-12) py-(--space-12) text-center text-caption-1 font-medium leading-tight text-(--color-btn-primary-text) shadow-(--shadow-soft) transition-opacity duration-150 hover:opacity-90 active:opacity-80"
                  >
                    <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-(--color-btn-primary-bg)" />
                    <span className="relative">🗓 Book a call — 2/9 spots left</span>
                    <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_1.5px_2px_0px_rgba(0,0,0,0.08)]" />
                  </a>
                  <a
                    href="/grader"
                    className="block w-full rounded-(--radius-lg) bg-(--color-btn-dark-bg) px-(--space-12) py-(--space-12) text-center text-caption-2 font-medium leading-tight text-(--color-white) shadow-(--shadow-soft) transition-opacity duration-150 hover:opacity-85 active:opacity-75"
                  >
                    🔍 Grade my Google Ads account
                  </a>
                </motion.div>
              </div>
            </div>

            {/* ── Panel drag handle — desktop only ── */}
            {!isMobile && (
              <div
                onMouseDown={handleDragStart}
                style={{ left: `${leftPct}%`, top: '50%', transform: 'translate(-50%, -50%)' }}
                className="absolute z-10 h-[20px] w-[8px] cursor-ew-resize rounded-(--radius-2xl) border-[0.5px] border-(--color-surface-stroke) bg-(--color-surface-stroke) shadow-[0px_0px_2px_0px_rgba(155,155,155,0.25),inset_0px_2px_3px_0px_rgba(255,255,255,0.6),inset_0px_0px_2px_0px_white,inset_0px_0px_1px_0px_rgba(217,217,217,0.9)]"
              />
            )}
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_0px_2px_0px_rgba(255,255,255,0.5)]" />
      </main>

    </div>
  )
}

export default function ResultsPage() {
  return (
    <Suspense>
      <ResultsContent />
    </Suspense>
  )
}
