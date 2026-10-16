import { Img } from './Icon'

/** Step progress rail. Steps 1–2 represent earlier (out-of-scope) application steps. */
export function LeftRail({ current, total }: { current: number; total: number }) {
  return (
    <nav aria-label="Application progress" className="flex w-14 shrink-0 flex-col bg-white shadow-[inset_-1px_0_0_#e0e0e0]">
      <ol className="m-0 flex list-none flex-col items-center p-0 pt-5">
        {Array.from({ length: total }, (_, i) => i + 1).map((n) => {
          const done = n < current
          const active = n === current
          return (
            <li key={n} className="flex flex-col items-center" aria-current={active ? 'step' : undefined}>
              <span className="sr-only">Step {n} {done ? 'completed' : active ? 'current' : 'not started'}</span>
              <span aria-hidden className={`flex size-6 items-center justify-center rounded-full text-[14px] font-semibold ${done ? 'bg-brand text-white' : active ? 'border-2 border-brand text-brand' : 'border border-ink-30 text-ink-60'}`}>
                {done ? '✓' : n}
              </span>
              {n < total && <span aria-hidden className={`h-[19px] w-0.5 ${done ? 'bg-brand' : 'bg-ink-30'}`} />}
            </li>
          )
        })}
      </ol>
      <div className="relative flex-1">
        <Img src="figma/Collapse.svg" className="absolute top-[78px] left-[30px]" />
      </div>
      <div className="flex h-[65px] items-center justify-center">
        <Img src="figma/Property1ChatBubbleSquareInformation2.svg" width={24} height={24} />
      </div>
    </nav>
  )
}
