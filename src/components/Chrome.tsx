import { business } from '../data/demoData'
import { Img } from './Icon'

/** Decorative Safari chrome + Terminal nav bar (not interactive). */
export function BrowserChrome() {
  return (
    <div aria-hidden="true" className="select-none">
      <div className="flex h-10 items-end bg-[#dee1e6] pl-2">
        <div className="flex h-8 w-[280px] items-center gap-2 rounded-t-lg bg-white px-3 text-[12px] text-[#3c4043]">
          <span className="size-4 rounded-full bg-[#c4c4c4]" />
          <span className="flex-1 truncate font-caption">White Demo Agency | Insurance Quote</span>
          <Img src="figma/IconClose.svg" width={16} height={16} />
        </div>
        <div className="flex h-8 w-[256px] items-center gap-2 px-4 text-[12px] text-[#3c4043]">
          <Img src="logos/bold-penguin.png" className="size-4 rounded-full" />
          <span className="flex-1 font-caption">Bold Penguin</span>
          <Img src="figma/IconClose.svg" width={16} height={16} />
        </div>
        <Img src="figma/AddTabIcon.svg" className="mb-0 size-8" />
      </div>
      <div className="flex h-9 items-center gap-4 bg-white px-3 shadow-[0_1px_0_#eff1f4]">
        <Img src="figma/LeftArrow.svg" />
        <Img src="figma/RightArrow.svg" />
        <Img src="figma/Menu.svg" />
        <div className="flex h-7 flex-1 items-center gap-2 rounded-full bg-[#f1f3f4] px-3 font-caption text-[14px] text-[#202124]">
          <Img src="figma/IconLock.svg" />
          white-demo-agency.boldpenguin.com/quote-start-landing
          <span className="flex-1" />
          <Img src="figma/IconStarOutlined.svg" />
        </div>
        <Img src="figma/Account.svg" />
      </div>
    </div>
  )
}

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
