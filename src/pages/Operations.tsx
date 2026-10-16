import { useNavigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { TextField } from '../components/Fields'
import { useDemo } from '../state/DemoContext'

export default function Operations() {
  const { answers: a, update } = useDemo()
  const navigate = useNavigate()
  const missing = !a.grossRevenue || !a.ownerPayroll
  return (
    <AppShell step={5} totalSteps={6} title="Business operations"
      nextDisabledReason={missing ? 'Gross revenue and owner payroll are required.' : undefined}
      onPrev={() => navigate('/apply/business-details')}
      onNext={() => { if (!missing) navigate('/apply/additional-info') }}>
      <TextField label="Estimated gross revenue" prefix="$" inputMode="numeric" value={a.grossRevenue} onChange={(v) => update({ grossRevenue: v })} />
      <h3 className="m-0 text-[20px] font-bold text-ink-90">What is your estimated payroll for the next 12 months?</h3>
      <TextField label="Business owner(s) only" prefix="$" inputMode="numeric" value={a.ownerPayroll} onChange={(v) => update({ ownerPayroll: v })} />
      <TextField label="Full-time, part-time, and temporary employees" inline={false} prefix="$" inputMode="numeric" value={a.employeePayroll}
        onChange={(v) => update({ employeePayroll: v })} helper="Enter $0 if you do not hire full-time, part-time or temporary employees" />
      <TextField label="1099 contractors" prefix="$" inputMode="numeric" value={a.contractorPayroll}
        onChange={(v) => update({ contractorPayroll: v })} helper="Enter $0 if you do not hire subcontractors" />
    </AppShell>
  )
}
