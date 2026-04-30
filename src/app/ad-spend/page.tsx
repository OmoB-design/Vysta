'use client'

import { useState } from 'react'
import { DollarSign } from 'lucide-react'
import { useRouter } from 'next/navigation'
import LeftPanel from '@/components/left-panel'

const progressSteps = [
  { num: '001', label: 'Ad Spend' },
  { num: '002', label: 'ROAS' },
  { num: '003', label: 'Platform' },
]

export default function AdSpendPage() {
  const [adSpend, setAdSpend] = useState('')
  const router = useRouter()

  const handleNext = () => {
    const num = parseFloat(adSpend.replace(/[^0-9.]/g, '')) || 0
    router.push(`/roas?adSpend=${num}`)
  }

  return (
    <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden bg-(--color-surface-fg-01)">

      <LeftPanel currentView="step1" />

      {/* Right panel */}
      <main className="relative flex flex-1 flex-col overflow-hidden md:rounded-bl-(--radius-6xl) md:rounded-tl-(--radius-6xl) border border-(--color-surface-stroke) bg-(--color-surface-primary) shadow-(--shadow-panel)">

        {/* Scrollable content area */}
        <div className="flex flex-1 flex-col gap-(--space-50) overflow-y-auto px-5 pt-8 pb-8 md:px-(--space-120) md:pt-(--space-120) md:pb-(--space-64)">

          {/* Notification — delay 0 */}
          <div
            className="animate-fade-in-up overflow-hidden rounded-tl-(--radius-5xl) rounded-tr-(--radius-5xl) rounded-bl-(--radius-3xl) rounded-br-(--radius-3xl) bg-(--color-surface-fg-01) shadow-(--shadow-surface)"
            style={{ animationDelay: '0s' }}
          >
            {/* Tag row */}
            <div className="px-(--space-20) py-(--space-12)">
              <div className="inline-flex shrink-0 items-center justify-center rounded-[15px] bg-(--color-grey-700) px-(--space-6) py-(--space-4)">
                <span className="text-caption-2 font-medium leading-tight text-(--color-white) whitespace-nowrap">
                  Vysta
                </span>
              </div>
            </div>
            {/* Info card */}
            <div className="relative flex w-full items-center gap-(--space-10) overflow-hidden rounded-(--radius-3xl) border border-(--color-surface-stroke) bg-(--color-surface-primary) px-[15px] py-(--space-12) shadow-(--shadow-float)">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-none">
                <g clipPath="url(#clip0_6034_25704)">
                  <path d="M15.1111 8C15.1111 7.02489 14.6062 6.12089 13.8089 5.59377C14 4.65689 13.7174 3.66044 13.0285 2.97155C12.3396 2.28266 11.3422 2 10.4062 2.19111C9.87825 1.39377 8.97514 0.888885 8.00003 0.888885C7.02492 0.888885 6.12092 1.39377 5.59381 2.19111C4.65425 1.99733 3.66047 2.28266 2.97158 2.97155C2.2818 3.66133 2.00003 4.65689 2.19114 5.59377C1.3938 6.12089 0.888916 7.024 0.888916 8C0.888916 8.976 1.3938 9.87822 2.19114 10.4062C2.00003 11.3431 2.2818 12.3387 2.97158 13.0284C3.66047 13.7182 4.65603 13.9991 5.59381 13.8089C6.12092 14.6062 7.02403 15.1111 8.00003 15.1111C8.97603 15.1111 9.87825 14.6062 10.4062 13.8089C11.3405 14 12.3387 13.7173 13.0285 13.0284C13.7182 12.3396 14 11.3431 13.8089 10.4062C14.6062 9.87911 15.1111 8.97511 15.1111 8ZM11.416 5.96266L7.63825 10.8516C7.51736 11.008 7.33336 11.1031 7.13603 11.1102C7.12714 11.1102 7.11914 11.1102 7.11114 11.1102C6.92269 11.1102 6.74225 11.0302 6.61514 10.8898L4.61514 8.66755C4.36892 8.39377 4.39114 7.97244 4.66492 7.72533C4.93958 7.48 5.36003 7.50133 5.60714 7.77511L7.07203 9.40355L10.3618 5.14666C10.5867 4.85511 11.0062 4.80177 11.2969 5.02666C11.5885 5.25155 11.6418 5.67022 11.4169 5.96177L11.416 5.96266Z" fill="#00a1ea"/>
                </g>
                <defs>
                  <clipPath id="clip0_6034_25704">
                    <rect width="16" height="16" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
              <p className="text-caption-2 font-medium leading-tight text-(--color-text-body)">
                We typically work with brands spending $30k–$500k/month
              </p>
              <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_2.59px_2.59px_0px_rgba(246,246,246,0.25)]" />
            </div>
          </div>

          {/* Progress + form */}
          <div className="flex flex-col gap-(--space-64)">

            {/* Step progress indicators — delay 0.15s */}
            <div
              className="animate-fade-in-up flex gap-(--space-32)"
              style={{ animationDelay: '0.15s' }}
            >
              {progressSteps.map((ps, i) => (
                <div key={i} className="flex flex-1 flex-col gap-(--space-10)">
                  <div
                    className={`h-[5px] w-full rounded-[4px] ${
                      i === 0 ? 'bg-(--color-blue-500)' : 'bg-(--color-surface-fg-01)'
                    }`}
                  />
                  <div className="flex gap-(--space-10) text-caption-2 font-medium leading-tight">
                    <span className="text-(--color-blue-500)">{ps.num}</span>
                    <span className="text-(--color-text-heading-02)">{ps.label}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Form */}
            <div className="flex flex-col gap-(--space-40)">

              {/* Title + subtitle — delay 0.30s */}
              <div
                className="animate-fade-in-up flex flex-col gap-(--space-8)"
                style={{ animationDelay: '0.30s' }}
              >
                <p className="font-display text-h4 font-medium leading-tight text-(--color-text-heading-01)">
                  What's your current monthly ad spend?
                </p>
                <p className="font-sans text-caption-1 font-medium leading-tight text-(--color-text-heading-06)">
                  Include all platforms - Google, Meta, TikTok, and any others.
                </p>
              </div>

              {/* Input + button */}
              <div className="flex flex-col" style={{ gap: '56px' }}>

                {/* Currency input — delay 0.45s */}
                <div
                  className="animate-fade-in-up flex w-full items-center gap-(--space-8) rounded-(--radius-xl) border border-(--color-surface-stroke) bg-(--color-surface-primary) px-[14px] py-(--space-12) shadow-(--shadow-input) transition-[border-color,box-shadow] duration-150 ease-in-out focus-within:border-(--color-blue-500) focus-within:shadow-[0px_0px_0px_2px_rgba(0,161,234,0.15)]"
                  style={{ animationDelay: '0.45s' }}
                >
                  <DollarSign size={14} className="flex-none text-(--color-grey-400)" />
                  <input
                    type="text"
                    value={adSpend}
                    onChange={(e) => setAdSpend(e.target.value)}
                    placeholder="Enter amount"
                    className="flex-1 bg-transparent text-caption-1 font-medium leading-tight text-(--color-text-heading-02) outline-none placeholder:text-(--color-grey-400)"
                  />
                </div>

                {/* Next button — delay 0.60s */}
                <button
                  type="button"
                  onClick={handleNext}
                  className="animate-fade-in-up w-full rounded-(--radius-lg) bg-(--color-btn-primary-bg) px-(--space-12) py-(--space-14) text-center text-caption-1 font-medium leading-tight text-(--color-btn-primary-text) shadow-(--shadow-soft) transition-shadow duration-150 active:shadow-(--shadow-inset-sm)"
                  style={{ animationDelay: '0.60s' }}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_0px_2px_0px_rgba(255,255,255,0.5)]" />
      </main>

    </div>
  )
}
