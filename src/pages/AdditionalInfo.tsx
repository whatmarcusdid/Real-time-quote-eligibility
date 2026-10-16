import { useNavigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { SelectField, TextField } from '../components/Fields'
import { idTypes } from '../data/demoData'
import { eligibleCarrierSteps } from '../services/mockService'
import { useDemo } from '../state/DemoContext'

export default function AdditionalInfo() {
  const { answers: a, update } = useDemo()
  const navigate = useNavigate()
  const feinOk = a.fein === '' || /^\d{2}-?\d{7}$/.test(a.fein)
  const steps = eligibleCarrierSteps(a)
  return (
    <AppShell step={6} totalSteps={6} title="Additional information"
      nextDisabledReason={!feinOk ? 'FEIN must look like 12-3456789 (or leave it blank).' : steps.length === 0 ? 'No eligible carriers for the selected coverage (simulated rules).' : undefined}
      onPrev={() => navigate('/apply/operations')}
      onNext={() => { if (feinOk && steps.length) navigate(`/apply/carrier/${steps[0]}`) }}>
      <div className="w-[174px]">
        <TextField label="Policy start date" value={a.policyStart} onChange={(v) => update({ policyStart: v })} placeholder="MM/DD/YYYY"
          helper="Some carriers default policy start dates to the next day." trailing={<span aria-hidden className="text-ink-60">▦</span>} />
      </div>
      <div className="grid grid-cols-2 gap-[15px]">
        <SelectField inline={false} label="What type of identification is your tax filed under?" value={a.idType} options={idTypes} onChange={(v) => update({ idType: v })} />
        <TextField inline={false} label="FEIN (Federal Tax Identification Number)" value={a.fein} placeholder="**-*******" inputMode="numeric"
          onChange={(v) => update({ fein: v })} helper="Please enter a valid FEIN to receive an accurate quote" error={feinOk ? undefined : 'Use the format 12-3456789 (fictional numbers only).'} />
      </div>
    </AppShell>
  )
}
