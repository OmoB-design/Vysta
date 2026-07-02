'use client'

import { Fragment } from 'react'
import { Circle } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const steps = [
  { title: 'Ad spend',  desc: 'Tell us how much you spend on ads',  href: '/ad-spend' },
  { title: 'ROAS',      desc: 'Tell us about your business',        href: '/roas' },
  { title: 'Platform',  desc: "Tell us the platforms you're on",    href: '/platform' },
]

const summaryQuestions = [
  "What's your current monthly ad spend?",
  "What ROAS are you currently getting?",
  "Where are you currently running ads?",
]

interface SummaryData {
  adSpend:  string
  roas:     string
  platform: string
  dim?: boolean
}

interface LeftPanelProps {
  currentView: 'landing' | 'step1' | 'step2' | 'step3' | 'summary'
  summary?: SummaryData
}

type StepState = 'done' | 'active' | 'upcoming'

function getStepState(i: number, currentView: string): StepState {
  if (currentView === 'step1') return i === 0 ? 'active' : 'upcoming'
  if (currentView === 'step2') {
    if (i === 0) return 'done'
    if (i === 1) return 'active'
    return 'upcoming'
  }
  if (currentView === 'step3') {
    if (i <= 1) return 'done'
    return 'active'
  }
  return 'upcoming'
}

function StepCheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="22" height="22" viewBox="0 0 18 18" className="flex-none">
      <path d="M9,1C4.589,1,1,4.589,1,9s3.589,8,8,8,8-3.589,8-8S13.411,1,9,1Zm3.947,5.641c-1.859,1.382-3.435,3.29-4.683,5.669-.129,.247-.385,.402-.664,.402-.277,.003-.538-.157-.667-.407-.575-1.117-1.218-2.025-1.965-2.776-.292-.293-.291-.769,.003-1.061,.292-.292,.768-.292,1.061,.003,.573,.576,1.09,1.228,1.563,1.972,1.239-2.045,2.734-3.726,4.458-5.007,.332-.246,.802-.178,1.049,.155,.247,.332,.178,.802-.155,1.049Z" fill="#1c1f21"/>
    </svg>
  )
}

function AdcubatorLogo({ small = false }: { small?: boolean }) {
  const size = small ? 22 : 28
  return (
    <div className="flex items-center gap-2 leading-none">
      <Image
        src="/adcubator-logo.jpg"
        alt="Adcubator logo"
        width={size}
        height={size}
        className="rounded-md flex-none"
      />
      <span
        className="font-sans leading-none tracking-tight text-(--color-text-heading-01)"
        style={{ fontWeight: 900, fontSize: small ? 16 : 20 }}
      >
        adcubator
      </span>
    </div>
  )
}

function BlueBadge({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-none">
      <g clipPath="url(#lp-badge)">
        <path d="M15.1111 8C15.1111 7.02489 14.6062 6.12089 13.8089 5.59377C14 4.65689 13.7174 3.66044 13.0285 2.97155C12.3396 2.28266 11.3422 2 10.4062 2.19111C9.87825 1.39377 8.97514 0.888885 8.00003 0.888885C7.02492 0.888885 6.12092 1.39377 5.59381 2.19111C4.65425 1.99733 3.66047 2.28266 2.97158 2.97155C2.2818 3.66133 2.00003 4.65689 2.19114 5.59377C1.3938 6.12089 0.888916 7.024 0.888916 8C0.888916 8.976 1.3938 9.87822 2.19114 10.4062C2.00003 11.3431 2.2818 12.3387 2.97158 13.0284C3.66047 13.7182 4.65603 13.9991 5.59381 13.8089C6.12092 14.6062 7.02403 15.1111 8.00003 15.1111C8.97603 15.1111 9.87825 14.6062 10.4062 13.8089C11.3405 14 12.3387 13.7173 13.0285 13.0284C13.7182 12.3396 14 11.3431 13.8089 10.4062C14.6062 9.87911 15.1111 8.97511 15.1111 8ZM11.416 5.96266L7.63825 10.8516C7.51736 11.008 7.33336 11.1031 7.13603 11.1102C7.12714 11.1102 7.11914 11.1102 7.11114 11.1102C6.92269 11.1102 6.74225 11.0302 6.61514 10.8898L4.61514 8.66755C4.36892 8.39377 4.39114 7.97244 4.66492 7.72533C4.93958 7.48 5.36003 7.50133 5.60714 7.77511L7.07203 9.40355L10.3618 5.14666C10.5867 4.85511 11.0062 4.80177 11.2969 5.02666C11.5885 5.25155 11.6418 5.67022 11.4169 5.96177L11.416 5.96266Z" fill="#1050e0"/>
      </g>
      <defs>
        <clipPath id="lp-badge">
          <rect width="16" height="16" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  )
}

// Step index for mobile progress bar (-1 = not a step page)
function stepIndex(currentView: string) {
  if (currentView === 'step1') return 0
  if (currentView === 'step2') return 1
  if (currentView === 'step3') return 2
  return -1
}

export default function LeftPanel({ currentView, summary }: LeftPanelProps) {
  const isSummary = currentView === 'summary'
  const dim = summary?.dim ?? false
  const summaryAnswers = summary
    ? [summary.adSpend, summary.roas, summary.platform]
    : ['—', '—', '—']
  const mobileStep = stepIndex(currentView)

  return (
    <>
      {/* ── Mobile top bar (hidden on md+) ──────────────────────────── */}
      <header className="flex md:hidden flex-none items-center justify-between border-b border-(--color-surface-stroke) bg-(--color-surface-fg-01) px-5 py-4">
        <div className="flex items-center gap-1">
          <AdcubatorLogo small />
        </div>

        {/* Step progress bars */}
        {mobileStep >= 0 && (
          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className={`h-[3px] w-8 rounded-full transition-colors duration-150 ${
                  i <= mobileStep ? 'bg-(--color-blue-500)' : 'bg-(--color-surface-stroke)'
                }`}
              />
            ))}
          </div>
        )}

        {/* Summary label */}
        {isSummary && (
          <span className="text-caption-2 font-medium leading-tight text-(--color-text-heading-06)">
            Your details
          </span>
        )}
      </header>

      {/* ── Desktop sidebar (hidden below md) ───────────────────────── */}
      <aside className="hidden md:relative md:flex h-full w-2/5 max-w-[700px] flex-col overflow-y-auto border-l border-t border-b border-(--color-surface-stroke) bg-(--color-surface-fg-01) px-(--space-40) pt-(--space-32) pb-(--space-32)">

        <div className="flex flex-1 flex-col gap-(--space-64)">

          {/* Brand */}
          <div className="flex items-center gap-1">
            <AdcubatorLogo />
          </div>

          {/* Headline */}
          <p className="font-sans text-h4 font-medium leading-tight text-(--color-text-body)">
            Find out how much revenue your google ads is leaving on the table
          </p>

          {isSummary ? (
            <div className="overflow-hidden rounded-(--radius-5xl) border border-(--color-surface-stroke) shadow-[0px_20px_30px_0px_rgba(201,201,201,0.1)]">
              <div className={`flex flex-col gap-[2px] rounded-(--radius-5xl) shadow-(--shadow-xs) ${dim ? 'bg-(--color-surface-stroke)' : 'bg-(--color-surface-dashboard)'}`}>

                <div className="flex items-center justify-between px-(--space-20) py-(--space-12)">
                  <span className="text-caption-2 font-medium leading-tight text-(--color-text-heading-06)">
                    Your Details
                  </span>
                  <Link
                    href="/ad-spend"
                    className="text-caption-2 font-medium leading-tight text-(--color-text-heading-06) underline decoration-solid"
                  >
                    Edit Details
                  </Link>
                </div>

                {summaryQuestions.map((q, i) => (
                  <div
                    key={i}
                    className={`relative flex items-center gap-(--space-10) overflow-hidden rounded-(--radius-4xl) border border-(--color-surface-stroke) px-[15px] py-(--space-14) shadow-[0px_2px_10px_0px_rgba(221,221,221,0.25)] ${dim ? 'bg-(--color-surface-fg-01)' : 'bg-(--color-surface-primary)'}`}
                  >
                    <div className="flex size-[40px] flex-none items-center justify-center">
                      <BlueBadge size={40} />
                    </div>
                    <div className="flex flex-col gap-[10px]">
                      <p className="text-caption-2 font-medium leading-tight text-(--color-text-heading-01)">
                        {q}
                      </p>
                      <p className="text-caption-2 font-medium leading-tight text-(--color-text-heading-05)">
                        {summaryAnswers[i]}
                      </p>
                    </div>
                    <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_0px_2px_0px_rgba(255,255,255,0.8)]" />
                  </div>
                ))}
              </div>
            </div>

          ) : (
            <div className="relative flex w-[265px] flex-col">
              <div className="mb-[27px] self-start inline-flex shrink-0 items-center justify-center rounded-[15px] bg-(--color-grey-700) px-(--space-8) py-(--space-4)">
                <span className="text-caption-2 font-medium leading-tight text-(--color-white) whitespace-nowrap">
                  Get your result in 3 steps
                </span>
              </div>

              {steps.map((step, i) => {
                const state = getStepState(i, currentView)
                const isDark = state === 'done' || state === 'active'
                const nextState = i < steps.length - 1 ? getStepState(i + 1, currentView) : null
                const lineIsDark = nextState !== null && nextState !== 'upcoming'

                return (
                  <Fragment key={i}>
                    <Link href={step.href} className="flex h-[39px] items-start gap-(--space-16)">
                      <div className="flex size-[30px] flex-none items-center justify-center">
                        {isDark ? (
                          <StepCheckIcon />
                        ) : (
                          <div className="flex size-full items-center justify-center rounded-full bg-(--color-surface-fg-01) border border-(--color-surface-stroke)">
                            <Circle size={14} className="text-(--color-grey-400)" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-(--space-4)">
                        <p className="text-caption-1 font-medium leading-tight text-(--color-text-heading-02)">
                          {step.title}
                        </p>
                        <p className="text-caption-2 font-normal leading-tight text-(--color-text-heading-06)">
                          {step.desc}
                        </p>
                      </div>
                    </Link>

                    {i < steps.length - 1 && (
                      <div
                        className={`ml-[15px] h-[27px] w-px border-l ${
                          lineIsDark
                            ? 'border-solid border-(--color-grey-850)'
                            : 'border-dashed border-(--color-grey-150)'
                        }`}
                      />
                    )}
                  </Fragment>
                )
              })}
            </div>
          )}

          {/* CTA — landing only */}
          {currentView === 'landing' && (
            <Link
              href="/ad-spend"
              className="w-full rounded-(--radius-lg) bg-(--color-btn-primary-bg) px-(--space-12) py-(--space-14) text-center text-caption-1 font-medium leading-tight text-(--color-btn-primary-text) shadow-(--shadow-soft) transition-shadow duration-150 active:shadow-(--shadow-inset-sm)"
            >
              Start
            </Link>
          )}
        </div>

        {/* Footer */}
        <div className="mt-auto flex flex-col items-center gap-(--space-20) pt-(--space-32) text-center">
          <p className="text-caption-2 font-normal leading-tight text-(--color-text-heading-06)">
            By proceeding you acknowledge that you have read, understood and agree to our{' '}
            <a href="#" className="underline decoration-solid">Terms and Conditions.</a>
          </p>
          <div className="flex gap-(--space-32) text-caption-2 font-normal leading-tight text-(--color-text-heading-06)">
            <span>2026 Adcubator</span>
            <a href="#" className="underline decoration-solid">Privacy Policy</a>
            <a href="#" className="underline decoration-solid">Support</a>
          </div>
        </div>
      </aside>
    </>
  )
}
