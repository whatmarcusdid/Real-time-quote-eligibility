// SIMULATED service layer. No network calls; deterministic rules over fictional data.
import { carrierOrder, carriers, scriptedResults } from '../data/demoData'
import type { Answers, Carrier, CarrierId, LineCode, LineResult, LineStatus } from '../data/types'

export const FAKE_LATENCY_MS = 650
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

export interface RailCarrier { carrier: Carrier; lines: { line: LineCode; status: LineStatus; result?: LineResult }[] }
export interface RailSnapshot { eligible: RailCarrier[]; additional: RailCarrier[]; ineligible: Carrier[]; showLines: boolean }

/**
 * Simulated eligibility rules (fictional, for demo only):
 * - Before any coverage is chosen: GL-writing carriers are shown as eligible.
 * - A carrier is eligible when it writes at least one selected line (GL/WC).
 * - WC-only carriers need at least one employee besides the owner.
 * - Cowbell, Nationwide, State Auto, Westfield are always ineligible for this class (florist).
 * - Lines are listed once the business has employees answered and coverage selected.
 */
export function evaluate(a: Answers, activeCarrier?: CarrierId): RailSnapshot {
  const selected = a.coverages.filter((c): c is LineCode => c === 'GL' || c === 'WC')
  const employees = a.fullTime + a.partTime
  const wcOk = selected.includes('WC') && employees > 0
  const showLines = a.coverages.length > 0 && a.submittedDetails === true
  const offered = (c: Carrier): LineCode[] => {
    if (c.market === 'never') return []
    if (selected.length === 0) return c.lines.includes('GL') ? ['GL'] : []
    return c.lines.filter((l) => (l === 'WC' ? wcOk : selected.includes(l)))
  }
  const toRail = (c: Carrier, lines: LineCode[]): RailCarrier => ({
    carrier: c,
    lines: lines.map((line) => {
      const result = scriptedResults[c.id]?.[line]
      if (c.market === 'additional' && showLines && a.submitted.includes('travelers')) return { line, status: result?.status ?? 'idle', result }
      if (a.submitted.includes(c.id)) return { line, status: result?.status ?? 'idle', result }
      if (activeCarrier === c.id) return { line, status: 'pending' }
      return { line, status: 'idle' }
    }),
  })
  const eligible: RailCarrier[] = []
  const additional: RailCarrier[] = []
  const ineligible: Carrier[] = []
  for (const c of carriers) {
    const lines = offered(c)
    if (!lines.length) ineligible.push(c)
    else if (c.market === 'additional') additional.push(toRail(c, lines))
    else eligible.push(toRail(c, lines))
  }
  return { eligible, additional, ineligible, showLines }
}

/** Simulated async re-check with fake latency. */
export async function evaluateAsync(a: Answers, activeCarrier?: CarrierId) {
  await wait(FAKE_LATENCY_MS)
  return evaluate(a, activeCarrier)
}

export function eligibleCarrierSteps(a: Answers): CarrierId[] {
  const snap = evaluate(a)
  const ids = new Set(snap.eligible.map((r) => r.carrier.id))
  return carrierOrder.filter((id) => ids.has(id))
}

export interface QuoteListItem { carrier: Carrier; line: LineCode; key: string; result: LineResult }
export function quoteList(a: Answers): { admitted: QuoteListItem[]; additional: QuoteListItem[] } {
  const snap = evaluate({ ...a, submitted: carrierOrder, submittedDetails: true })
  const items = (rows: RailCarrier[]) =>
    rows.flatMap((r) => r.lines.filter((l) => l.result).map((l) => ({ carrier: r.carrier, line: l.line, key: `${r.carrier.id}-${l.line.toLowerCase()}`, result: l.result! })))
  const admitted = items(snap.eligible)
  // Order as shown in the Figma quote pages.
  const order = ['chubb-gl', 'liberty-mutual-wc', 'hiscox-gl', 'travelers-wc', 'biberk-wc', 'liberty-mutual-gl', 'chubb-wc', 'cna-wc']
  admitted.sort((x, y) => order.indexOf(x.key) - order.indexOf(y.key))
  return { admitted, additional: items(snap.additional) }
}
