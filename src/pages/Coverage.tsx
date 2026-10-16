import { useNavigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { Img } from '../components/Icon'
import { coverages } from '../data/demoData'
import type { CoverageId } from '../data/types'
import { useDemo } from '../state/DemoContext'

export default function Coverage() {
  const { answers, update } = useDemo()
  const navigate = useNavigate()
  const toggle = (id: CoverageId) =>
    update({ coverages: answers.coverages.includes(id) ? answers.coverages.filter((c) => c !== id) : [...answers.coverages, id] })
  const none = answers.coverages.length === 0
  return (
    <AppShell step={3} totalSteps={6} title="Coverage type"
      nextDisabledReason={none ? 'Select at least one coverage type to continue.' : undefined}
      onPrev={undefined}
      onNext={() => { if (!none) navigate('/apply/business-details') }}>
      <fieldset className="m-0 flex flex-col gap-[15px] border-0 p-0">
        <legend className="sr-only">Coverage type</legend>
        {coverages.map((c) => {
          const checked = answers.coverages.includes(c.id)
          return (
            <label key={c.id} className={`flex cursor-pointer flex-col gap-4 rounded-md bg-white p-[14px] has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand ${checked ? 'border-2 border-brand p-[13px]' : 'border border-ink-30'}`}>
              <span className="flex items-center gap-3 py-2">
                <input type="checkbox" checked={checked} onChange={() => toggle(c.id)} aria-labelledby={`cov-${c.id}`} aria-describedby={`cov-${c.id}-d`} className="peer sr-only" />
                {checked
                  ? <span aria-hidden className="flex size-[18px] items-center justify-center rounded-sm bg-brand text-[13px] font-bold text-white mx-[3px]">✓</span>
                  : <Img src="figma/CheckBoxOutlineBlank24Px1.svg" width={24} height={24} />}
                <span id={`cov-${c.id}`} className="text-[20px] font-bold text-ink-90">{c.name}</span>
              </span>
              <span id={`cov-${c.id}-d`} className="pl-[37px] text-[14px] font-semibold text-ink-90">{c.description}</span>
            </label>
          )
        })}
      </fieldset>
    </AppShell>
  )
}
