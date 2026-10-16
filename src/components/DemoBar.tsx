import { useNavigate } from 'react-router-dom'
import { useDemo } from '../state/DemoContext'

/** Always-visible demo control: labels the prototype as simulated and resets local demo data. */
export function DemoBar() {
  const { reset } = useDemo()
  const navigate = useNavigate()
  return (
    <div role="region" aria-label="Demo controls" className="flex items-center justify-center gap-3 bg-[#1f1f24] py-1 px-4 text-[12px] font-semibold text-white shadow-lg">
      <span>Simulated demo · fictional data &amp; eligibility rules</span>
      <button type="button" onClick={() => { reset(); navigate('/apply/coverage') }} className="focus-invert rounded-full bg-white px-3 py-1 font-extrabold text-brand">
        Reset demo
      </button>
    </div>
  )
}
