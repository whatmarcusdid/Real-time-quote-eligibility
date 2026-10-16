import type { ReactNode } from 'react'
import { business } from '../data/demoData'
import { DisabledAction } from './DisabledAction'
import { Img } from './Icon'

export function AppHeader({ children, className = '' }: { children?: ReactNode; className?: string }) {
  return (
    <div className={`bg-gradient-to-r from-brand from-[1.4%] to-[rgba(96,0,197,0.4)] px-5 pt-[41px] ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-md border-2 border-white bg-brand-icon p-[11px]">
            <Img src="figma/IconsComponent.svg" width={24} height={24} />
          </div>
          <div className="whitespace-nowrap">
            <h1 className="m-0 text-[28px] font-bold leading-normal text-white">{business.name}</h1>
            <p className="m-0 text-[12px] font-semibold text-white/70">{business.meta}</p>
          </div>
        </div>
        <DisabledAction reason="saving drafts needs a real backend; progress is kept locally in this browser instead." tipAlign="right"
          className="focus-invert w-[159px] rounded-md border-2 border-white px-[14px] py-[9px] text-[14px] font-extrabold uppercase text-white">
          Save &amp; Close
        </DisabledAction>
      </div>
      {children}
    </div>
  )
}
