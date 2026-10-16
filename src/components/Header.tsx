import type { ReactNode } from 'react'
import { business } from '../data/demoData'
import { DisabledAction } from './DisabledAction'
import { Img } from './Icon'

export function AppHeader({ children, className = '' }: { children?: ReactNode; className?: string }) {
  return (
    <div className={`bg-gradient-to-r from-brand from-[1.4%] to-[rgba(96,0,197,0.4)] px-5 pt-[41px] ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-4">
          <div className="hidden rounded-md border-2 border-white bg-brand-icon p-[11px] min-[900px]:block">
            <Img src="figma/IconsComponent.svg" width={24} height={24} />
          </div>
          <div className="min-w-0">
            <h1 className="m-0 text-[22px] font-bold leading-normal min-[900px]:text-[28px] text-white">{business.name}</h1>
            <p className="m-0 text-[12px] font-semibold text-white/70">{business.meta}</p>
          </div>
        </div>
        <div className="shrink-0">
        <DisabledAction reason="saving drafts needs a real backend; progress is kept locally in this browser instead." tipAlign="right"
          className="focus-invert whitespace-nowrap rounded-md border-2 border-white px-3 min-[900px]:w-[159px] min-[900px]:px-[14px] py-[9px] text-[14px] font-extrabold uppercase text-white">
          Save &amp; Close
        </DisabledAction>
        </div>
      </div>
      {children}
    </div>
  )
}
