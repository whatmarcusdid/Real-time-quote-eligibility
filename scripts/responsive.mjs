// Responsive checks + screenshots. Usage: node scripts/responsive.mjs [baseUrl]
import { chromium } from '@playwright/test'
import { mkdirSync } from 'node:fs'
const BASE = process.argv[2] ?? 'http://localhost:4173'
const OUT = new URL('../../verify/responsive/', import.meta.url).pathname
mkdirSync(OUT, { recursive: true })
const SHOT_WIDTHS = [744, 1024, 1280, 1440]
const CHECK_WIDTHS = [744, 900, 1024, 1280, 1440, 1920]
const routes = [
  ['coverage', '/apply/coverage'],
  ['business-details', '/apply/business-details'],
  ['chubb', '/apply/carrier/chubb'],
  ['quote-chubb-gl', '/quotes/chubb-gl'],
  ['quote-chubb-wc', '/quotes/chubb-wc'],
  ['quote-pathpoint-modal', '/quotes/pathpoint-gl'],
]
let fails = 0, passes = 0
const check = (name, ok, extra = '') => { ok ? passes++ : fails++; if (!ok) console.log(`FAIL ${name} ${extra}`) }
const browser = await chromium.launch()
for (const w of CHECK_WIDTHS) {
  const page = await browser.newPage({ viewport: { width: w, height: 900 } })
  // seed a completed demo (GL + WC, all carrier question sets submitted) so quote pages, Pathpoint modal and premium panel render
  await page.goto(BASE + '/apply/coverage')
  await page.evaluate(() => localStorage.setItem('rtqe-demo-v1', JSON.stringify({ coverages: ['GL', 'WC'], fein: '12-3456789', submitted: ['biberk', 'chubb', 'cna', 'hiscox', 'liberty-mutual', 'travelers'] })))
  for (const [name, path] of routes) {
    await page.goto(BASE + path); await page.waitForTimeout(900)
    const r = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth
      const off = [...document.querySelectorAll('body *')].filter((el) => {
        if (el.closest('.sr-only') || el.closest('[hidden]')) return false
        const b = el.getBoundingClientRect(); return b.width > 0 && b.right > vw + 1
      }).slice(0, 3).map((el) => el.tagName + '.' + String(el.className).slice(0, 40))
      const clipped = [...document.querySelectorAll('h1,h2,h3,p,span,label,dt,dd,button,a')].filter((el) => {
        if (el.closest('.sr-only')) return false
        const cs = getComputedStyle(el); return cs.overflow !== 'visible' && el.scrollWidth > el.clientWidth + 1 && !el.classList.contains('truncate')
      }).length
      const rect = (s) => document.querySelector(s)?.getBoundingClientRect()
      const card = rect('main section'), rail = rect('aside')
      const overlap = card && rail && card.right > rail.left + 1 && card.bottom > rail.top
      const next = rect('button:has(> .sr-only)') && [...document.querySelectorAll('button')].find((b) => b.textContent === 'Next')?.getBoundingClientRect()
      const escapes = [...document.querySelectorAll('main, aside, nav')].flatMap((box) => { const bb = box.getBoundingClientRect(); return [...box.querySelectorAll('button, a, input, h1, h2, h3')].filter((el) => { if (el.closest('.sr-only, dialog')) return false; const b = el.getBoundingClientRect(); return b.width > 0 && (b.left < bb.left - 1 || b.right > bb.right + 1) }).map((el) => el.tagName + ':' + el.textContent.slice(0, 20)) })
      const dlg = document.querySelector('dialog[open]')?.getBoundingClientRect()
      return { escapes, sw: document.documentElement.scrollWidth, vw, off, clipped, overlap: !!overlap,
        nextInView: next ? next.bottom <= innerHeight && next.top >= 0 && document.elementFromPoint(next.x + next.width / 2, next.y + next.height / 2)?.closest('button')?.textContent === 'Next' : null,
        saveVisible: (() => { const s = [...document.querySelectorAll('button')].find((b) => /Save/.test(b.textContent)); if (!s) return null; const b = s.getBoundingClientRect(); return document.elementFromPoint(b.x + b.width / 2, b.y + b.height / 2)?.closest('button') === s })(),
        dlgFits: dlg ? dlg.left >= 0 && dlg.right <= vw && dlg.top >= 0 && dlg.bottom <= innerHeight : null }
    })
    const tag = `${name}@${w}`
    if (name === 'quote-pathpoint-modal') check(`${tag} modal open`, r.dlgFits !== null)
    check(`${tag} no horizontal overflow`, r.sw <= r.vw, `${r.sw}>${r.vw} ${r.off.join(' ')}`)
    check(`${tag} controls stay inside their column`, r.escapes.length === 0, r.escapes.slice(0, 3).join(' | '))
    check(`${tag} no clipped text`, r.clipped === 0, String(r.clipped))
    check(`${tag} card/rail no overlap`, !r.overlap)
    if (r.nextInView !== null) check(`${tag} sticky Next in viewport`, r.nextInView)
    if (r.saveVisible !== null && r.dlgFits === null) check(`${tag} Save & Close not covered`, r.saveVisible)
    if (r.dlgFits !== null) check(`${tag} modal fits viewport`, r.dlgFits)
    if (SHOT_WIDTHS.includes(w)) await page.screenshot({ path: `${OUT}${name}-${w}.png`, fullPage: true })
  }
  await page.close()
}
await browser.close()
console.log(`\n${passes}/${passes + fails} responsive checks passed`)
process.exit(fails ? 1 : 0)
