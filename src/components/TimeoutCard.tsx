import { carrierById, lineNames } from '../data/demoData'
import type { CarrierId, LineCode } from '../data/types'
import { asset } from '../asset'

export function TimeoutNotice() {
  return (
    <div className="flex gap-4 rounded-md border-2 border-[#f0b400] bg-warning-bg p-4 text-[14px] font-semibold text-ink-90">
      <span aria-hidden className="flex size-5 shrink-0 items-center justify-center rounded-full bg-warning text-[12px] font-extrabold text-white">!</span>
      <p className="m-0">This Carrier returned a timeout error. Please try again at a later time. If this issue persists, please contact Bold Penguin at support@boldpenguin.com. <span className="text-ink-60">(Simulated error.)</span></p>
    </div>
  )
}

export function UnderwrittenBy({ carrierId, line, headingId }: { carrierId: CarrierId; line: LineCode; headingId?: string }) {
  const c = carrierById[carrierId]
  return (
    <div>
      <h2 id={headingId} className="m-0 text-[20px] font-bold text-ink-90">{line === 'WC' ? 'Workers Compensation' : lineNames[line]}</h2>
      <p className="m-0 text-[10px] font-semibold text-ink-60">Underwritten by {c.name}</p>
      <img src={asset(c.logo)} alt={`${c.name} logo`} className="mt-1 h-12 w-[96px] object-cover object-center" />
    </div>
  )
}
