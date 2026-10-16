import { useId, type ReactNode } from 'react'

/** A visible control that is intentionally disabled in the demo, with a visible reason on hover/focus. */
export function DisabledAction({ children, reason, className = '', tipAlign = 'center', above = false }: { children: ReactNode; reason: string; className?: string; tipAlign?: 'center' | 'right' | 'left'; above?: boolean }) {
  const id = useId()
  const pos = tipAlign === 'right' ? 'right-0' : tipAlign === 'left' ? 'left-0' : 'left-1/2 -translate-x-1/2'
  return (
    <span className="group relative inline-flex">
      <button type="button" aria-disabled="true" aria-describedby={id} onClick={(e) => e.preventDefault()} className={`cursor-not-allowed ${className}`}>
        {children}
      </button>
      <span id={id} role="tooltip" className={`pointer-events-none absolute z-50 ${above ? 'bottom-full mb-2' : 'top-full mt-2'} w-64 rounded-md bg-[#1f1f24] px-3 py-2 text-left text-[12px] font-semibold normal-case tracking-normal text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 ${pos}`}>
        Disabled in this demo: {reason}
      </span>
    </span>
  )
}
