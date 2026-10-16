import { business } from '../data/demoData'
import { Img } from './Icon'

/** Terminal nav bar (decorative, not interactive). */
export function TerminalNav({ menuOpen = false }: { menuOpen?: boolean }) {
  return (
    <header className="relative z-10 flex h-[66px] items-center border-b border-divider bg-white">
      <div className="flex h-full w-[280px] items-center gap-4 border-r border-divider pl-4 pr-4">
        <Img src="logos/bold-penguin.png" alt="Bold Penguin" className="size-10 rounded-full" />
        <span className="flex-1 text-[16px] font-semibold text-ink-90">Quotes</span>
        <Img src="figma/IcKeyboardArrowDown24Px1.svg" className={menuOpen ? 'rotate-180' : ''} />
      </div>
      <div className="flex-1" />
      <div className="flex h-full w-[220px] items-center justify-end gap-3 border-r border-divider pr-5 text-right">
        <div>
          <div className="text-[16px] font-semibold text-ink-90">{business.agent}</div>
          <div className="text-[12px] font-semibold text-ink-60">{business.agency}</div>
        </div>
        <Img src="figma/Vector.svg" width={40} height={42} />
      </div>
      <div className="flex h-full w-16 items-center justify-center">
        <Img src="figma/Property1ChatBubbleSquareInformation2.svg" width={24} height={24} />
      </div>
    </header>
  )
}
