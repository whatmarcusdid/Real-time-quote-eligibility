import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { BrowserChrome, TerminalNav } from '../components/Chrome'
import { AppHeader } from '../components/Header'
import { DisabledAction } from '../components/DisabledAction'
import { DemoBar } from '../components/DemoBar'
import { Img } from '../components/Icon'
import { Logo, StatusIcon, money } from '../components/CarrierRail'
import { Modal } from '../components/Modal'
import { TimeoutNotice, UnderwrittenBy } from '../components/TimeoutCard'
import { carriers, lineNames } from '../data/demoData'
import { eligibleCarrierSteps, quoteList, type QuoteListItem } from '../services/mockService'
import { useDemo } from '../state/DemoContext'
import { asset } from '../asset'

const forms = [
  ['Commercial Insurance Application', 'ACORD 125'],
  ['Commercial General Liablity Section', 'ACORD 126'],
  ['Workers Compensation Application', 'ACORD 130'],
]

function QuoteRow({ item, selected }: { item: QuoteListItem; selected: boolean }) {
  return (
    <li>
      <Link to={`/quotes/${item.key}`} aria-current={selected ? 'page' : undefined}
        className={`flex h-[35px] items-center gap-3 rounded-r-full py-6 pr-3 pl-5 no-underline ${selected ? 'bg-[#d5c2ef]' : 'hover:bg-white/60'}`}>
        <Logo src={item.carrier.logo} name={item.carrier.name} size={32} />
        <span className="flex-1">
          <span className="block text-[14px] font-semibold text-ink-90">{item.carrier.name}</span>
          <span className="block text-[10px] font-semibold text-ink-60">{item.line}</span>
        </span>
        <StatusIcon variant="quotes" status={item.result.status} label={item.result.status === 'quoted' ? 'Quoted' : item.result.status === 'timeout' ? 'Carrier timeout' : 'More questions required'} />
      </Link>
    </li>
  )
}

export default function Quotes() {
  const { quoteKey } = useParams()
  const { answers } = useDemo()
  const navigate = useNavigate()
  const { admitted, additional } = quoteList(answers)
  const all = [...admitted, ...additional]
  const item = all.find((i) => i.key === quoteKey)
  if (!item) return <Navigate to={`/quotes/${all[0]?.key ?? ''}`} replace />
  const steps = eligibleCarrierSteps(answers)
  const backTo = steps.length ? `/apply/carrier/${steps[steps.length - 1]}` : '/apply/coverage'
  const firstQuoted = admitted.find((i) => i.result.status === 'quoted')?.key ?? admitted[0].key
  const r = item.result

  return (
    <div className="mx-auto w-[1440px]">
      <BrowserChrome />
      <TerminalNav menuOpen />
      <AppHeader className="h-[178px]">
        <Link to={backTo} className="focus-invert mt-5 inline-flex items-center gap-3 rounded text-[12px] font-semibold text-white no-underline">
          <span className="flex size-6 items-center justify-center rounded-full border-2 border-white text-[12px]" aria-hidden>↺</span>
          Go back to application form
        </Link>
      </AppHeader>
      <div className="flex">
        <nav aria-label="Quotes by carrier" className="w-[288px] shrink-0 bg-terminal pt-4 pb-4">
          <h2 className="m-0 mb-2 pl-5 text-[16px] font-semibold text-ink-60">Admitted markets</h2>
          <ul className="m-0 list-none p-0">{admitted.map((i) => <QuoteRow key={i.key} item={i} selected={i.key === item.key} />)}</ul>
          <h2 className="m-0 mt-3 mb-2 pl-5 text-[16px] font-semibold text-ink-60">Additional markets</h2>
          <ul className="m-0 list-none p-0">{additional.map((i) => <QuoteRow key={i.key} item={i} selected={i.key === item.key} />)}</ul>
        </nav>
        <main className="relative flex-1 bg-terminal pb-24">
          {r.status === 'quoted' ? (
            <div className="flex gap-6 pl-24 pr-12">
              <section aria-labelledby="cov-h" className="flex-1 pt-4">
                <p className="m-0 text-[10px] font-semibold text-ink-60">Please review this policy’s details and continue to checkout</p>
                <h2 id="cov-h" className="m-0 mt-8 text-[20px] font-bold text-ink-90">Coverage Details</h2>
                <h3 className="m-0 mt-3 text-[16px] font-semibold text-ink-90">{lineNames[item.line]}</h3>
                <dl className="m-0 mt-3 space-y-3">
                  {(r.limits ?? []).map(([k, v]) => (
                    <div key={k} className="flex justify-between text-[14px] font-semibold text-ink-90"><dt>{k}</dt><dd className="m-0">{v}</dd></div>
                  ))}
                </dl>
              </section>
              <section aria-label="Quote summary" className="-mt-[44px] w-[330px] self-start rounded-lg bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.12)]">
                <UnderwrittenBy carrierId={item.carrier.id} line={item.line} />
                <p className="m-0 mt-2 text-[44px] font-semibold text-ink-90">${money(r.premium)}<sup className="text-[20px]">.00</sup></p>
                <p className="m-0 text-[10px] font-semibold text-ink-60">Estimated yearly cost (simulated)</p>
                <hr className="my-3 w-12 border-t-4 border-[#e0e0e0]" />
                <p className="m-0 flex justify-between text-[10px] font-semibold text-ink-60"><span>Quote ID#</span><span>{r.quoteId}</span></p>
                <div className="mt-3 [&>span]:flex [&>span]:w-full">
                  <DisabledAction reason="binding a policy requires a real carrier integration and payment; it is out of scope for this prototype."
                    className="w-full rounded bg-brand py-3 text-[14px] font-extrabold uppercase text-white">Continue to bind</DisabledAction>
                </div>
              </section>
            </div>
          ) : r.status === 'timeout' ? (
            <section aria-labelledby="to-h" className="ml-[150px] -mt-[44px] w-[330px] rounded-lg bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.12)]">
              <UnderwrittenBy carrierId={item.carrier.id} line={item.line} headingId="to-h" />
              <div className="mt-4"><TimeoutNotice /></div>
            </section>
          ) : null}
        </main>
      </div>
      <aside aria-label="More options" className="w-[288px] bg-white pb-20">
        <h2 className="m-0 px-5 pt-5 text-[16px] font-semibold text-ink-60">Transfer</h2>
        <div className="flex items-center gap-3 px-5 py-3">
          <Img src="figma/IconDatTransfer8.svg" width={24} height={24} />
          <span className="flex-1"><span className="block text-[14px] font-semibold">Refer To Exchange</span><span className="block text-[9px] text-ink-60">Learn More</span></span>
          <DisabledAction reason="referring to the exchange is an external integration not simulated here." tipAlign="left" className="rounded p-1">
            <Img src="figma/external-link.svg" width={24} height={24} /><span className="sr-only">Refer to Exchange</span>
          </DisabledAction>
        </div>
        <h2 className="m-0 px-5 pt-3 text-[16px] font-semibold text-ink-60">Forms</h2>
        <ul className="m-0 list-none p-0">
          {forms.map(([name, code]) => (
            <li key={code} className="flex items-center gap-3 px-5 py-2">
              <span aria-hidden className="relative h-8 w-[29px] shrink-0 rounded-[3px] border border-divider bg-white"><Img src="figma/pdf.svg" className="absolute inset-0 m-auto" /></span>
              <span className="flex-1"><span className="block text-[14px] font-semibold">{name}</span><span className="block text-[9px] text-ink-60">{code}</span></span>
              <DisabledAction reason="ACORD PDFs are generated by the real platform; no documents exist in this demo." tipAlign="left" className="rounded p-1">
                <Img src="figma/download.svg" width={24} height={24} /><span className="sr-only">Download {name}</span>
              </DisabledAction>
            </li>
          ))}
        </ul>
        <h2 className="m-0 flex items-center justify-between px-5 pt-3 text-[16px] font-semibold text-ink-60">Ineligible carriers<Img src="figma/alert-circle.svg" width={24} height={24} /></h2>
        <ul className="m-0 list-none p-0">
          {carriers.filter((c) => c.market === 'never').map((c) => (
            <li key={c.id} className="flex items-center gap-3 px-5 py-2">
              <img src={asset(c.logo)} alt={`${c.name} logo`} className="h-6 w-8 object-contain" />
              <span className="text-[14px] font-semibold">{c.name}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 border-t border-divider px-5 pt-4">
          <DisabledAction reason="live support chat is not part of the prototype." tipAlign="left" className="flex items-center gap-2 rounded text-[12px] font-extrabold text-brand">
            NEED ADDITIONAL HELP?
          </DisabledAction>
        </div>
      </aside>
      <Modal open={r.status === 'needs-questions'} onClose={() => navigate(`/quotes/${firstQuoted}`)} labelledBy="pp-title">
        <div className="flex w-[436px] flex-col gap-4 p-5">
          <UnderwrittenBy carrierId={item.carrier.id} line={item.line} headingId="pp-title" />
          <div className="flex gap-4 rounded-md border-2 border-[#9e9e9e] bg-[#ececec] p-4 text-[14px] font-semibold text-ink-90">
            <span aria-hidden className="flex size-5 shrink-0 items-center justify-center rounded-full bg-ink-60 text-[12px] font-extrabold text-white">i</span>
            <div>
              <p className="m-0">Pathpoint is a wholesale brokerage licensed in all 50 states that provides quotes from E&amp;S carriers. Get an instant non-admitted market quote by answering a few additional questions.</p>
              <p className="m-0 mt-3 italic">By clicking “Complete Questions” user acknowledges they are subject to any and all state rules and regulations governing access to the non-admitted market.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button type="button" autoFocus onClick={() => navigate(`/quotes/${firstQuoted}`)} className="flex-1 rounded border-2 border-brand py-2.5 text-[14px] font-extrabold text-brand">CLOSE</button>
            <span className="flex-1 [&>span]:flex [&>span]:w-full">
              <DisabledAction reason="Pathpoint's non-admitted question set isn't designed yet." className="w-full rounded bg-brand py-2.5 text-[14px] font-extrabold text-white">COMPLETE QUESTIONS</DisabledAction>
            </span>
          </div>
        </div>
      </Modal>
      <DemoBar />
    </div>
  )
}
