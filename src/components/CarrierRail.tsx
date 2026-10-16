import { useEffect, useRef, useState } from 'react'
import { lineNames, premiumRanges } from '../data/demoData'
import type { CarrierId } from '../data/types'
import { evaluate, evaluateAsync, type RailCarrier, type RailSnapshot } from '../services/mockService'
import { useDemo } from '../state/DemoContext'
import { asset } from '../asset'

export const money = (n: number) => n.toLocaleString('en-US')

/** Status icons exported from Figma. `quotes` variant uses the quote-page set (purple "wholesale" for additional markets). */
export function StatusIcon({ status, label, variant = 'rail' }: { status: string; label?: string; variant?: 'rail' | 'quotes' }) {
  const img = (src: string, l: string) => <img src={asset(src)} alt={l} width={24} height={24} className="size-6 shrink-0" />
  if (status === 'quoted') return img('figma/status-complete.svg', label ?? 'Quoted')
  if (status === 'needs-questions' && variant === 'quotes') return img('figma/status-wholesale.svg', label ?? 'More questions required')
  if (status === 'timeout' || status === 'needs-questions') return img('figma/status-warning.svg', label ?? (status === 'timeout' ? 'Carrier timeout' : 'More questions required'))
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

/** "Estimated Annual Premium" panel from the Chubb live frame (get_design_context node I1:13263;557:88152). */
function EstimatedPremium({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <section aria-labelledby="eap-h" className="sticky bottom-0 -mx-3 mt-6 flex flex-col gap-[10px] bg-[linear-gradient(rgba(96,0,197,0.06),rgba(96,0,197,0.06)),linear-gradient(#fff,#fff)] p-[18px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 id="eap-h" className="m-0 whitespace-nowrap text-[16px] font-bold text-ink-60">Estimated Annual Premium</h2>
          <span className="group relative inline-flex">
            <button type="button" aria-describedby="eap-tip" className="flex rounded-full">
              <img src={asset('figma/info-filled.svg')} alt="About this estimate" width={12} height={12} className="m-px size-3" />
            </button>
            <span id="eap-tip" role="tooltip" className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-56 -translate-x-1/2 rounded-md bg-[#1f1f24] px-3 py-2 text-[12px] font-semibold text-white opacity-0 shadow-lg group-hover:opacity-100 group-focus-within:opacity-100">
              Range across eligible carriers for this class (simulated values from the design).
            </span>
          </span>
        </div>
        <button type="button" aria-expanded={open} aria-controls="eap-body" onClick={onToggle} className="flex rounded">
          <img src={asset('figma/keyboard-arrow-down.svg')} alt={open ? 'Collapse estimate' : 'Expand estimate'} width={24} height={24} className={`size-6 transition-transform ${open ? '' : 'rotate-180'}`} />
        </button>
      </div>
      <dl id="eap-body" hidden={!open} className="m-0 flex flex-col gap-[10px]">
        {premiumRanges.map((p) => (
          <div key={p.label} className="flex justify-between whitespace-nowrap text-[12px] font-semibold text-ink-60"><dt>{p.label}</dt><dd className="m-0">{p.range}</dd></div>
        ))}
      </dl>
    </section>
  )
}

/** "RTE Component – Grouping by Carrier": re-evaluates (simulated) after each answer, with fake latency. */
export function CarrierRail({ activeCarrier }: { activeCarrier?: CarrierId }) {
  const { answers } = useDemo()
  const [snap, setSnap] = useState<RailSnapshot>(() => evaluate(answers, activeCarrier))
  const [updating, setUpdating] = useState(false)
  const first = useRef(true)
  const [open, setOpen] = useState(true)
  const [premOpen, setPremOpen] = useState(true)
  const allQuoted = snap.showLines && snap.eligible.length > 0 && snap.eligible.every((r) => r.lines.every((l) => l.result))

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
      {allQuoted && <EstimatedPremium open={premOpen} onToggle={() => setPremOpen(!premOpen)} />}
    </aside>
  )
}
