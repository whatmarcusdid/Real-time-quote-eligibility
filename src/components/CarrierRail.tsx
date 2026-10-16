import { useEffect, useRef, useState } from 'react'
import { lineNames } from '../data/demoData'
import type { CarrierId } from '../data/types'
import { evaluate, evaluateAsync, type RailCarrier, type RailSnapshot } from '../services/mockService'
import { useDemo } from '../state/DemoContext'
import { asset } from '../asset'

export const money = (n: number) => n.toLocaleString('en-US')

export function StatusIcon({ status, label }: { status: string; label?: string }) {
  if (status === 'quoted') return <span role="img" aria-label={label ?? 'Quoted'} className="flex size-[18px] items-center justify-center rounded-full bg-success text-[11px] font-bold text-white">✓</span>
  if (status === 'timeout' || status === 'needs-questions') return <span role="img" aria-label={label ?? (status === 'timeout' ? 'Carrier timeout' : 'More questions required')} className="flex size-[18px] items-center justify-center rounded-full bg-warning text-[12px] font-extrabold text-white">!</span>
  if (status === 'pending') return <span role="img" aria-label="Waiting for carrier response" className="flex size-[18px] items-center justify-center rounded-full bg-[#9b6be0] text-[10px] text-white motion-safe:animate-pulse">◷</span>
  return null
}

export function Logo({ src, name, size = 36 }: { src: string; name: string; size?: number }) {
  return <img src={asset(src)} alt={`${name} logo`} style={{ width: size, height: size }} className="shrink-0 rounded-[5px] border border-divider bg-white object-contain" />
}

function CarrierCard({ row, active, showLines }: { row: RailCarrier; active: boolean; showLines: boolean }) {
  const { carrier } = row
  return (
    <li className={`rounded-md border bg-white p-2 ${active ? 'border-2 border-brand' : 'border-divider'}`}>
      <div className="flex items-center gap-3">
        <Logo src={carrier.logo} name={carrier.name} />
        <span className="text-[16px] font-bold text-ink-90">{carrier.name}</span>
      </div>
      {showLines && (
        <ul className="m-0 mt-2 list-none space-y-3 p-0 pb-1">
          {row.lines.map((l) => (
            <li key={l.line} className="flex items-center justify-between pl-1 text-[12px] font-semibold text-ink-60">
              <span className="w-24">{lineNames[l.line]}</span>
              <span className="flex items-center gap-2">
                {l.result?.status === 'quoted' && (
                  <span className="text-right">
                    <span className="block text-[13px] font-bold text-ink-90">${money(l.result.premium)}<sup className="text-[8px]">.00</sup></span>
                    <span className="block text-[9px] font-semibold text-ink-60">Annual Premium</span>
                  </span>
                )}
                <StatusIcon status={l.status} />
              </span>
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

/** "RTE Component – Grouping by Carrier": re-evaluates (simulated) after each answer, with fake latency. */
export function CarrierRail({ activeCarrier }: { activeCarrier?: CarrierId }) {
  const { answers } = useDemo()
  const [snap, setSnap] = useState<RailSnapshot>(() => evaluate(answers, activeCarrier))
  const [updating, setUpdating] = useState(false)
  const first = useRef(true)
  const [open, setOpen] = useState(true)

  useEffect(() => {
    if (first.current) { first.current = false; return }
    let live = true
    setUpdating(true)
    evaluateAsync(answers, activeCarrier).then((s) => { if (live) { setSnap(s); setUpdating(false) } })
    return () => { live = false }
  }, [answers, activeCarrier])

  return (
    <aside aria-label="Carrier eligibility (simulated, real-time)" aria-busy={updating} className="w-[324px] shrink-0 bg-white px-3 pb-6 pt-1">
      <p aria-live="polite" className={`m-0 h-5 text-[11px] font-semibold text-brand ${updating ? '' : 'invisible'}`}>
        {updating ? 'Checking eligibility… (simulated)' : ''}
      </p>
      <div className={`transition-opacity ${updating ? 'opacity-50' : ''}`}>
        <h2 className="m-0 mb-2 text-[20px] font-bold text-ink-60">Eligible carriers</h2>
        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          {snap.eligible.map((r) => <CarrierCard key={r.carrier.id} row={r} active={r.carrier.id === activeCarrier} showLines={snap.showLines} />)}
        </ul>
        <h2 className="m-0 mt-3 mb-2 text-[20px] font-bold text-ink-60">Additional Markets</h2>
        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          {snap.additional.map((r) => <CarrierCard key={r.carrier.id} row={r} active={false} showLines={snap.showLines} />)}
        </ul>
        <div className="mt-3 mb-2 flex items-center justify-between">
          <h2 className="m-0 text-[20px] font-bold text-ink-60">Ineligible carriers</h2>
          <button type="button" aria-expanded={open} aria-controls="inelig" onClick={() => setOpen(!open)} className="rounded p-1 text-ink-60">
            <span aria-hidden className={`inline-block transition-transform ${open ? 'rotate-180' : ''}`}>⌄</span>
            <span className="sr-only">{open ? 'Collapse' : 'Expand'} ineligible carriers</span>
          </button>
        </div>
        <ul id="inelig" hidden={!open} className="m-0 flex list-none flex-col gap-3 p-0">
          {snap.ineligible.map((c) => (
            <li key={c.id} className="flex h-[38px] items-center gap-3 rounded-md border border-divider bg-white px-1.5">
              <Logo src={c.logo} name={c.name} size={26} />
              <span className="text-[14px] font-bold text-ink-90">{c.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}
