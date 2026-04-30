'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const testimonials = [
  {
    name: 'Aiden Hodges',
    role: 'Director, Driven Off Road',
    company: 'Driven Off Road',
    quote: "I've previously used other companies to boost my Google Ads and didn't receive the results I expected. I was just about to give up but found AdLab and got instant results. I haven't looked back!",
    avatar: '/avatars/aiden.webp',
  },
  {
    name: 'Laz Smith',
    role: 'Co-Founder, Apero The Label',
    company: 'Apero The Label',
    quote: "We'd never used an agency for Google Ads before, but Ad Lab was recommended by a trusted partner and was super up-front and professional. Definitely knows the stuff — highly recommend.",
    avatar: '/avatars/laz.webp',
  },
  {
    name: 'Jez Hedger',
    role: 'Co-Founder, Bedzy',
    company: 'Bedzy',
    quote: "Until I was introduced to Adlab, I was yet to discover an agency who could beat my own performance. They conducted a thorough audit, saw many opportunities, and before long we were beating all sales records.",
    avatar: '/avatars/jez.webp',
  },
]

const n = testimonials.length

type Phase = 'loading' | 'populating' | 'showing' | 'sliding'

// ─── Timing (ms) ───────────────────────────────────────────────
const CARD_HEIGHT = 185
const SWEEP_MS    = 600   // skeleton shimmer — 2 × 600 ms matches 1.2 s CSS cycle
const SWEEP_REPS  = 2
const REVEAL_MS   = 450   // cascade: 180 ms (last delay) + 280 ms duration + buffer
const POPULATE_MS = REVEAL_MS + 100
const DISPLAY_MS  = 4000
const SLIDE_MS    = 700

// ─── Easing curves ─────────────────────────────────────────────
const SLIDE_EASE  = [0.32, 0.72, 0, 1]  as const  // fast-out, smooth deceleration
const REVEAL_EASE = [0.16, 1,    0.3, 1] as const  // easeOutExpo — fluid like water

// ─── Shared Framer Motion transition configs ────────────────────
const slideTrans = { duration: SLIDE_MS / 1000, ease: SLIDE_EASE }
const snapTrans  = { duration: 0 }  // instant reset after slide

// ─── Per-element reveal: clip-path wipes left→right, opacity blooms fast ───
const FROM = { clipPath: 'inset(0 100% 0 0)', opacity: 0 }
const TO   = { clipPath: 'inset(0 0% 0 0)',   opacity: 1 }

function revealTrans(delay: number) {
  return {
    clipPath: { duration: 0.28, ease: REVEAL_EASE, delay },
    opacity:  { duration: 0.042, ease: 'easeOut' as const, delay },
  }
}

/* ─── Skeleton bar ─────────────────────────────────────────────── */
function Skel({ className, shimmer = false }: { className?: string; shimmer?: boolean }) {
  return (
    <div
      className={`rounded-sm ${shimmer ? 'skeleton-shimmer' : 'bg-(--color-surface-stroke)'} ${className ?? ''}`}
    />
  )
}

/* ─── Skeleton card ─────────────────────────────────────────────── */
// sweep=true  → content bars shimmer; footer is always static
function SkeletonCard({ sweep = false }: { sweep?: boolean }) {
  return (
    <div className="h-full flex flex-col bg-(--color-surface-fg-01) rounded-tl-[24px] rounded-tr-[24px] rounded-bl-[18px] rounded-br-[18px] shadow-(--shadow-surface)">
      <div className="border border-(--color-surface-stroke) rounded-[18px] p-3 overflow-hidden relative bg-(--color-surface-primary) flex flex-col">
        <div className="flex gap-1.5 items-start">
          <Skel shimmer={sweep} className="size-[30px] flex-none rounded-full" />
          <div className="flex flex-col gap-1 flex-1 pt-0.5">
            <Skel shimmer={sweep} className="h-2 w-14" />
            <Skel shimmer={sweep} className="h-[7px] w-[90px]" />
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-1">
          <Skel shimmer={sweep} className="h-2 w-full" />
          <Skel shimmer={sweep} className="h-2 w-full" />
          <Skel shimmer={sweep} className="h-2 w-[70%]" />
        </div>
        <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_0px_2px_1.5px_white]" />
      </div>
      <div className="flex items-center justify-end px-3 py-2">
        <Skel className="h-[25px] w-[84px] rounded-[10px]" />
      </div>
    </div>
  )
}

/* ─── Testimonial card ──────────────────────────────────────────── */
function TestiCard({ t, revealing = false }: { t: (typeof testimonials)[0]; revealing?: boolean }) {
  // Returns Framer Motion reveal props for each element, or {} when not revealing
  const r = (delay: number) => revealing
    ? { initial: FROM, animate: TO, transition: revealTrans(delay) }
    : {}

  return (
    <div className="h-full flex flex-col bg-(--color-surface-fg-01) border border-(--color-surface-stroke) rounded-tl-[24px] rounded-tr-[24px] rounded-bl-[18px] rounded-br-[18px] shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05),0px_0px_6.9px_0px_rgba(204,204,204,0.25),0px_1px_2px_0px_rgba(16,24,40,0.05)]">
      <div className="border border-(--color-surface-stroke) rounded-[18px] p-3 overflow-hidden relative bg-(--color-surface-primary) flex flex-col">
        <div className="flex items-start gap-1.5">
          <motion.img
            {...r(0)}
            src={t.avatar}
            alt={t.name}
            className="size-[30px] flex-none rounded-full object-cover"
          />
          <div className="flex flex-col gap-1">
            <motion.span {...r(0.04)} className="text-[12px] font-medium leading-[1.2] text-(--color-text-heading-01)">
              {t.name}
            </motion.span>
            <motion.span {...r(0.08)} className="text-[10px] font-medium leading-[1.2] text-(--color-grey-500)">
              {t.role}
            </motion.span>
          </div>
        </div>
        <motion.p
          style={{ willChange: 'transform, opacity, filter' }}
          {...(revealing ? {
            initial:    { opacity: 0, y: 17, filter: 'blur(6px)' },
            animate:    { opacity: 1, y: 0,  filter: 'blur(0px)' },
            transition: { duration: 0.547, ease: [0.22, 1, 0.36, 1] as [number,number,number,number], delay: 0.13 },
          } : {})}
          className="mt-4 text-[10px] font-medium leading-[1.2] text-(--color-text-heading-04) line-clamp-3"
        >
          {t.quote}
        </motion.p>
        <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_0px_2px_1.5px_white]" />
      </div>
      <motion.div {...r(0.22)} className="flex items-center justify-end px-3 py-2">
        <a
          href="https://www.ad-lab.io/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-(--color-purple-400) rounded-lg px-[14px] py-[6px] text-[10px] font-semibold leading-[1.2] text-(--color-white) whitespace-nowrap transition-opacity duration-150 hover:opacity-90"
        >
          See testimonial
        </a>
      </motion.div>
    </div>
  )
}

/* ─── Carousel ──────────────────────────────────────────────────── */
export function TestimonialCarousel() {
  const [idx, setIdx] = useState(0)
  const [phase, setPhase] = useState<Phase>('loading')
  const containerRef = useRef<HTMLDivElement>(null)
  const [cardWidth, setCardWidth] = useState(0)
  const [singleCard, setSingleCard] = useState(false)

  // Measure usable width on mount and resize
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth
        const mobile = w < 640
        setSingleCard(mobile)
        setCardWidth(mobile ? w : (w - 32) / 3)
      }
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  const slideOffset = cardWidth + 16

  // ── Phase machine ─────────────────────────────────────────────
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []

    if (phase === 'loading') {
      timers.push(setTimeout(() => setPhase('populating'), SWEEP_MS * SWEEP_REPS))
    } else if (phase === 'populating') {
      timers.push(setTimeout(() => setPhase('showing'), POPULATE_MS))
    } else if (phase === 'showing') {
      timers.push(setTimeout(() => setPhase('sliding'), DISPLAY_MS))
    } else if (phase === 'sliding') {
      timers.push(setTimeout(() => {
        setIdx(i => (i + 1) % n)
        setPhase('loading')
      }, SLIDE_MS))
    }

    return () => timers.forEach(clearTimeout)
  }, [phase])

  const isSliding = phase === 'sliding'
  const isLoading = phase === 'loading'
  const prevIdx   = (idx - 1 + n) % n

  return (
    // overflow-hidden clips off-screen slot; vertical padding lets shadows breathe
    <motion.div
      ref={containerRef}
      className="relative w-full overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: cardWidth > 0 ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      style={{ paddingTop: 10, paddingBottom: 10 }}
    >
      {/* ── 4-card track — Framer Motion drives the translateX ───── */}
      <motion.div
        animate={{ x: isSliding ? -slideOffset : 0 }}
        transition={isSliding ? slideTrans : snapTrans}
        style={{ display: 'flex', gap: 16 }}
      >
        {/* Slot 0 — left */}
        <div style={{ width: cardWidth, flexShrink: 0 }}>
          <TestiCard t={testimonials[prevIdx]} />
        </div>

        {/* Slot 1 — center */}
        <div style={{ width: cardWidth, flexShrink: 0 }}>
          {isLoading ? (
            <SkeletonCard sweep />
          ) : (
            // key remounts TestiCard each cycle — Framer Motion replays from initial
            <div key={idx}>
              <TestiCard t={testimonials[idx]} revealing />
            </div>
          )}
        </div>

        {/* Slot 2 — right */}
        <div style={{ width: cardWidth, flexShrink: 0 }}>
          <SkeletonCard />
        </div>

        {/* Slot 3 — off-screen right */}
        <div style={{ width: cardWidth, flexShrink: 0 }}>
          <SkeletonCard />
        </div>
      </motion.div>

      {/* ── Edge fades — desktop (3-card) only ─────────────── */}
      {!singleCard && (
        <>
          <div
            className="absolute inset-y-0 left-0 pointer-events-none z-10"
            style={{
              width: Math.round(cardWidth * 0.9),
              background: 'linear-gradient(to right, var(--color-surface-primary) 40%, transparent 100%)',
            }}
          />
          <div
            className="absolute inset-y-0 right-0 pointer-events-none z-10"
            style={{
              width: Math.round(cardWidth * 0.9),
              background: 'linear-gradient(to left, var(--color-surface-primary) 40%, transparent 100%)',
            }}
          />
        </>
      )}
    </motion.div>
  )
}
