import type { ReactNode } from 'react'
import type { CarrierId } from '../data/types'
import { TerminalNav } from './Chrome'
import { AppHeader } from './Header'
import { LeftRail } from './LeftRail'
import { CarrierRail } from './CarrierRail'
import { Img } from './Icon'
import { DemoBar } from './DemoBar'
import { DisabledAction } from './DisabledAction'

interface Props {
  step: number
  totalSteps: number
  title: string
  activeCarrier?: CarrierId
  onPrev?: () => void
  onNext: () => void
  nextDisabledReason?: string
  children: ReactNode
}

/** Application-form layout: left rail | header + question card | carrier rail. Fluid from 744px (min) upward. */
export function AppShell({ step, totalSteps, title, activeCarrier, onPrev, onNext, nextDisabledReason, children }: Props) {
  return (
    <div className="min-w-[744px] w-full">
      <DemoBar />
      <TerminalNav />
      <div className="flex min-h-[845px]">
        <LeftRail current={step} total={totalSteps} />
        <main className="relative flex min-w-0 flex-1 flex-col bg-terminal">
          <AppHeader className="min-h-[178px] pb-[64px]" />
          <section aria-labelledby="qs-title" className="relative z-[1] -mt-[47px] w-[min(780px,calc(100%-40px))] self-center flex flex-col gap-[15px] rounded-lg border border-divider bg-white p-5 drop-shadow-[3px_0_2px_rgba(0,0,0,0.15)]">
            <h2 id="qs-title" className="m-0 text-[20px] font-bold text-ink-90">{title}</h2>
            {children}
          </section>
          <div className="flex-1 min-h-[120px]" />
          <div className="pointer-events-none sticky bottom-0 z-20 flex justify-between px-5 pb-5 [&>*]:pointer-events-auto">
            {onPrev ? (
              <button type="button" onClick={onPrev} className="flex size-14 items-center justify-center rounded-full bg-brand">
                <Img src="figma/IcArrowBack24Px1.svg" width={24} height={24} /><span className="sr-only">Previous</span>
              </button>
            ) : (
              <DisabledAction reason="steps 1–2 (business lookup) come before this prototype starts." tipAlign="left" above className="flex size-14 items-center justify-center rounded-full bg-brand">
                <Img src="figma/IcArrowBack24Px1.svg" width={24} height={24} /><span className="sr-only">Previous</span>
              </DisabledAction>
            )}
            <div className="flex flex-col items-end gap-1">
              <button type="button" onClick={onNext} aria-disabled={!!nextDisabledReason} aria-describedby={nextDisabledReason ? 'next-reason' : undefined}
                className={`flex size-14 items-center justify-center rounded-full ${nextDisabledReason ? 'cursor-not-allowed bg-[#9e9e9e]' : 'bg-brand'}`}>
                <Img src="figma/IcArrowForward24Px1.svg" width={24} height={24} /><span className="sr-only">Next</span>
              </button>
            </div>
          </div>
          {nextDisabledReason && <p id="next-reason" role="status" className="absolute right-5 bottom-[84px] z-20 m-0 max-w-[260px] rounded bg-white px-2 py-1 text-right text-[12px] font-semibold text-ink-60 shadow">{nextDisabledReason}</p>}
        </main>
        <CarrierRail activeCarrier={activeCarrier} />
      </div>
    </div>
  )
}
