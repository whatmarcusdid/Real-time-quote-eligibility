import { Img } from './Icon'

/** Step progress rail using the Figma "Steps-Component" assets. Steps 1–2 are earlier, out-of-scope steps. */
export function LeftRail({ current, total }: { current: number; total: number }) {
  return (
    <nav aria-label="Application progress" className="flex w-14 shrink-0 flex-col bg-white shadow-[inset_-1px_0_0_#e0e0e0]">
      <ol className="m-0 flex list-none flex-col p-0 px-4 pt-5">
        {Array.from({ length: total }, (_, i) => i + 1).map((n) => {
          const done = n < current
          const active = n === current
          const last = n === total
          const label = `Step ${n} ${done ? 'completed' : active ? 'current' : 'not started'}`
          return (
            <li key={n} aria-current={active ? 'step' : undefined} className={`relative w-6 ${last ? 'h-6' : 'h-[43px]'}`}>
              <span className="sr-only">{label}</span>
              {last && !done ? (
                <span aria-hidden className={`absolute inset-0 flex items-center justify-center rounded-[20px] border-2 bg-white text-[14px] font-semibold ${active ? 'border-brand text-brand' : 'border-ink-30 text-ink-60'}`}>{n}</span>
              ) : (
                <>
                  <Img src={`figma/step-${done ? 'done' : active ? 'active' : 'future'}.svg`} width={24} height={43} className="absolute inset-0" />
                  {done
                    ? <Img src="figma/check-round.svg" width={20} height={20} className="absolute top-[2px] left-[2px]" />
                    : <span aria-hidden className={`absolute top-[3px] left-0 w-6 text-center text-[14px] font-semibold ${active ? 'text-brand' : 'text-ink-60'}`}>{n}</span>}
                </>
              )}
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
