import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { SelectField, TextField, YesNo } from '../components/Fields'
import { Modal } from '../components/Modal'
import { TimeoutNotice, UnderwrittenBy } from '../components/TimeoutCard'
import { carrierScripts, scriptedResults } from '../data/demoData'
import type { CarrierId } from '../data/types'
import { eligibleCarrierSteps, FAKE_LATENCY_MS } from '../services/mockService'
import { useDemo } from '../state/DemoContext'

export default function CarrierQuestions() {
  const { carrierId } = useParams<{ carrierId: CarrierId }>()
  const { answers, update } = useDemo()
  const navigate = useNavigate()
  const [showErrors, setShowErrors] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const steps = eligibleCarrierSteps(answers)
  const script = carrierId ? carrierScripts[carrierId] : undefined
  if (!carrierId || !script || !steps.includes(carrierId)) return <Navigate to={steps[0] ? `/apply/carrier/${steps[0]}` : '/apply/coverage'} replace />

  const idx = steps.indexOf(carrierId)
  const values = answers.carrier[carrierId] ?? {}
  const set = (qid: string, v: string) => update({ carrier: { ...answers.carrier, [carrierId]: { ...values, [qid]: v } } })
  const unanswered = script.questions.filter((q) => !values[q.id]?.trim())
  const goNext = () => navigate(idx + 1 < steps.length ? `/apply/carrier/${steps[idx + 1]}` : '/quotes/chubb-gl')
  const timeoutLine = (['WC', 'GL'] as const).find((l) => scriptedResults[carrierId]?.[l]?.status === 'timeout')

  const onNext = () => {
    if (submitting) return
    if (unanswered.length) { setShowErrors(true); return }
    setSubmitting(true)
    update({ submitted: answers.submitted.includes(carrierId) ? answers.submitted : [...answers.submitted, carrierId] })
    window.setTimeout(() => {
      setSubmitting(false)
      if (timeoutLine) setModalOpen(true)
      else goNext()
    }, FAKE_LATENCY_MS + 100)
  }

  return (
    <AppShell step={7} totalSteps={7} title={script.title} activeCarrier={answers.submitted.includes(carrierId) ? undefined : carrierId}
      onPrev={() => navigate(idx > 0 ? `/apply/carrier/${steps[idx - 1]}` : '/apply/additional-info')}
      onNext={onNext}
      nextDisabledReason={submitting ? 'Sending answers to carrier… (simulated)' : undefined}>
      {!script.scripted && <p className="m-0 rounded bg-[#f3ecfc] px-3 py-2 text-[12px] font-semibold text-brand">Templated carrier: these questions are placeholders, not from the design.</p>}
      {showErrors && unanswered.length > 0 && (
        <p role="alert" className="m-0 text-[12px] font-bold text-red-700">Answer the {unanswered.length} remaining question{unanswered.length > 1 ? 's' : ''} to get a quote.</p>
      )}
      {script.questions.map((q) => {
        const err = showErrors && !values[q.id]?.trim()
        if (q.kind === 'yesno') return <YesNo key={q.id} label={q.label} value={values[q.id]} onChange={(v) => set(q.id, v)} error={err} />
        if (q.kind === 'number') return (
          <div key={q.id}><TextField inline={false} label={q.label} value={values[q.id] ?? ''} inputMode="numeric" onChange={(v) => set(q.id, v.replace(/\D/g, ''))} error={err ? 'Required' : undefined} /></div>
        )
        return <SelectField key={q.id} inline={false} searchable label={q.label} value={values[q.id] ?? ''} options={q.options} placeholder="" onChange={(v) => set(q.id, v)} />
      })}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} labelledBy="timeout-title">
        {timeoutLine && (
          <div className="flex w-[min(377px,calc(100vw-48px))] flex-col gap-4 p-5">
            <UnderwrittenBy carrierId={carrierId} line={timeoutLine} headingId="timeout-title" />
            <TimeoutNotice />
            <div className="flex gap-6">
              <button type="button" autoFocus onClick={() => { setModalOpen(false); goNext() }} className="flex-1 rounded border-2 border-brand py-2.5 text-[14px] font-extrabold text-brand">CLOSE</button>
              <button type="button" onClick={() => navigate(`/quotes/${carrierId}-${timeoutLine.toLowerCase()}`)} className="flex-1 rounded bg-brand py-2.5 text-[14px] font-extrabold text-white">GO TO QUOTE PAGE</button>
            </div>
          </div>
        )}
      </Modal>
    </AppShell>
  )
}
