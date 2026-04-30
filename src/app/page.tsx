import LeftPanel from '@/components/left-panel'
import { TestimonialCarousel } from '@/components/testimonial-carousel'

export default function LandingPage() {
  return (
    <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden bg-(--color-surface-fg-01)">

      <LeftPanel currentView="landing" />

      {/* Right panel */}
      <main className="relative flex flex-1 items-center justify-center overflow-hidden md:rounded-bl-(--radius-6xl) md:rounded-tl-(--radius-6xl) border border-(--color-surface-stroke) bg-(--color-surface-primary) px-5 py-6 md:px-(--space-40) md:py-(--space-40) shadow-(--shadow-panel)">

        <div className="w-full">
          <TestimonialCarousel />
        </div>

        <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_0px_2px_0px_rgba(255,255,255,0.5)]" />
      </main>

    </div>
  )
}
