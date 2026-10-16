import { useEffect, useRef, type ReactNode } from 'react'

/** Accessible modal using native <dialog> (focus trap, Esc to close, focus return). */
export function Modal({ open, onClose, labelledBy, children }: { open: boolean; onClose: () => void; labelledBy: string; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])
  return (
    <dialog ref={ref} aria-labelledby={labelledBy} onClose={onClose} onCancel={onClose}
      className="m-auto rounded-xl border-0 p-0 shadow-[0_4px_24px_rgba(0,0,0,0.2)] backdrop:bg-black/30">
      {open && children}
    </dialog>
  )
}
