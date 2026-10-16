import { useId, type ReactNode } from 'react'
import { Img } from './Icon'

const box = 'flex h-[46px] items-center gap-3 rounded border border-ink-30 bg-white px-2 focus-within:border-2 focus-within:border-brand'

export function TextField({ label, value, onChange, prefix, helper, trailing, inline = true, inputMode, error, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; prefix?: string; helper?: string; trailing?: ReactNode
  inline?: boolean; inputMode?: 'numeric' | 'text'; error?: string; placeholder?: string
}) {
  const id = useId()
  const hid = `${id}-h`
  return (
    <div className="flex w-full flex-col gap-1">
      {!inline && <label htmlFor={id} className="text-[14px] font-semibold text-ink-90">{label}</label>}
      <div className={`${box} ${inline ? 'h-[38px] min-h-[38px] box-content py-0' : ''} ${error ? 'border-red-600' : ''}`}>
        {prefix && <span aria-hidden className="pl-1 text-[16px] text-ink-60">{prefix}</span>}
        <div className="flex flex-1 flex-col">
          {inline && <label htmlFor={id} className="text-[10px] font-semibold text-ink-60">{label}</label>}
          <input id={id} value={value} placeholder={placeholder} inputMode={inputMode} onChange={(e) => onChange(e.target.value)}
            aria-describedby={helper || error ? hid : undefined} aria-invalid={!!error}
            className="w-full border-0 bg-transparent p-0 text-[14px] font-semibold text-ink-90 outline-none" />
        </div>
        {trailing}
      </div>
      {(helper || error) && <p id={hid} className={`m-0 text-[8px] font-semibold ${error ? 'text-red-700 text-[11px]' : 'text-ink-60'}`}>{error ?? helper}</p>}
    </div>
  )
}

export function SelectField({ label, value, options, onChange, inline = true, searchable = false, placeholder }: {
  label: string; value: string; options: string[]; onChange: (v: string) => void; inline?: boolean; searchable?: boolean; placeholder?: string
}) {
  const id = useId()
  return (
    <div className="flex w-full flex-col gap-1">
      {!inline && <label htmlFor={id} className="text-[14px] font-semibold text-ink-90">{label}</label>}
      <div className={`${box} relative ${inline ? 'h-[38px] box-content' : ''}`}>
        {searchable && <span aria-hidden className="text-[16px] text-ink-90">⌕</span>}
        <div className="flex flex-1 flex-col">
          {inline && <label htmlFor={id} className="text-[10px] font-semibold text-ink-60">{label}</label>}
          <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className="w-full appearance-none border-0 bg-transparent p-0 pr-8 text-[14px] font-semibold text-ink-90 outline-none">
            {placeholder !== undefined && <option value="">{placeholder}</option>}
            {options.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
        <Img src="figma/IcKeyboardArrowDown24Px1.svg" className="pointer-events-none absolute right-2" width={24} height={24} />
      </div>
    </div>
  )
}

export function Stepper({ label, value, onChange, min = 0 }: { label: string; value: number; onChange: (v: number) => void; min?: number }) {
  const id = useId()
  return (
    <div className="flex flex-col gap-3">
      <label htmlFor={id} className="text-[14px] font-semibold text-ink-90">{label}</label>
      <div className="flex h-[46px] w-[167px] items-center justify-between rounded border border-ink-30 px-5 focus-within:border-2 focus-within:border-brand">
        <button type="button" aria-label={`Decrease ${label}`} onClick={() => onChange(Math.max(min, value - 1))} className="flex size-[15px] items-center justify-center rounded-full bg-brand text-[13px] font-bold leading-none text-white">−</button>
        <input id={id} type="number" min={min} value={value} onChange={(e) => onChange(Math.max(min, Number(e.target.value) || 0))}
          className="w-12 border-0 bg-transparent text-center text-[14px] font-semibold text-ink-90 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none" />
        <button type="button" aria-label={`Increase ${label}`} onClick={() => onChange(value + 1)} className="flex size-[15px] items-center justify-center rounded-full bg-brand text-[13px] font-bold leading-none text-white">+</button>
      </div>
    </div>
  )
}

/** Segmented YES / NO control implemented as a native radio group (arrow keys work). */
export function YesNo({ label, value, onChange, error }: { label: string; value?: string; onChange: (v: string) => void; error?: boolean }) {
  const name = useId()
  return (
    <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
      <legend className="mb-2 p-0 text-[12px] font-semibold text-ink-90">{label}</legend>
      <div className={`flex w-[218px] overflow-hidden rounded border-2 ${error ? 'border-red-600' : 'border-brand'}`}>
        {['YES', 'NO'].map((opt) => (
          <label key={opt} className={`relative flex h-[30px] flex-1 cursor-pointer items-center justify-center text-[14px] font-extrabold has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand ${value === opt ? 'bg-brand text-white' : 'bg-white text-brand'}`}>
            <input type="radio" name={name} value={opt} checked={value === opt} onChange={() => onChange(opt)} className="absolute opacity-0" />
            {opt}
          </label>
        ))}
      </div>
    </fieldset>
  )
}
