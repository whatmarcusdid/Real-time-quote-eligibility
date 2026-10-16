import { useNavigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { SelectField, Stepper, TextField } from '../components/Fields'
import { legalEntities } from '../data/demoData'
import { useDemo } from '../state/DemoContext'

export default function BusinessDetails() {
  const { answers: a, update } = useDemo()
  const navigate = useNavigate()
  const yearOk = /^(19|20)\d{2}$/.test(a.foundingYear) && Number(a.foundingYear) <= 2026
  return (
    <AppShell step={4} totalSteps={6} title="Business details"
      nextDisabledReason={yearOk ? undefined : 'Enter a valid four-digit founding year.'}
      onPrev={() => navigate('/apply/coverage')}
      onNext={() => { if (yearOk) { update({ submittedDetails: true }); navigate('/apply/operations') } }}>
      <div className="grid grid-cols-2 gap-[15px]">
        <TextField label="Founding year of business" value={a.foundingYear} inputMode="numeric" onChange={(v) => update({ foundingYear: v })}
          error={yearOk ? undefined : 'Enter a year between 1900 and 2026.'} />
        <SelectField label="Legal entity title" value={a.legalEntity} options={legalEntities} onChange={(v) => update({ legalEntity: v })} />
      </div>
      <h3 className="m-0 text-[20px] font-bold text-ink-90">Does this business have employees other than the business owner?</h3>
      <div className="flex gap-[15px]">
        <Stepper label="Number of Full Time Employees" value={a.fullTime} onChange={(v) => update({ fullTime: v })} />
        <Stepper label="Number of Part Time Employees" value={a.partTime} onChange={(v) => update({ partTime: v })} />
      </div>
    </AppShell>
  )
}
