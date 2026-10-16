# Real-time quote eligibility: scripted prototype

A portfolio prototype of an agent quoting flow (Bold Penguin Terminal style) built from the Figma section
*Real-time quote eligibility* (`iYVhK3s7jLWceLr62T05iO`, node `2006:57654`). It's a **scripted, predetermined guided
flow** for the fictional business **Union Square Flowers**. Desktop only, designed at **1440px** wide.

## Run
```bash
npm install
npm run dev            # http://localhost:5173
npm run build          # type check + production build (dist/, includes 404.html SPA fallback)
npm run preview        # serve dist on :4173
npm run lint           # ESLint
npm run typecheck      # tsc -b
npx playwright install chromium && npm run preview & node scripts/verify.mjs   # headless walkthrough
```
Deploy under a sub-path (e.g. GitHub Pages): `BASE_PATH=/Real-time-quote-eligibility/ npm run build`.

## Reset the demo
Answers are saved in `localStorage` (`rtqe-demo-v1`). Click **Reset demo** in the dark pill at the top of the page
to clear them and return to Coverage type. You can also clear site data in the browser.

## Flow and routes
| Route | Figma frames |
|---|---|
| `/apply/coverage` | Coverage selection 4, 5 |
| `/apply/business-details` | Business details 5, 6 |
| `/apply/operations` | Business operations 5–7 |
| `/apply/additional-info` | Additional information 3, 4 |
| `/apply/carrier/:carrierId` (biberk → chubb → cna → hiscox → liberty-mutual → travelers) | BiBERK/Chubb/CNA/Hiscox/Liberty Mutual/Travelers 3–5, the "live" frames, CHUBB and CNA modals |
| `/quotes/:carrier-line` (e.g. `chubb-gl`) | Quote page (on …) ×9, Pathpoint modal |

## What is simulated
- **All data is fictional** (business, agent, quote IDs, premiums). Premiums come from the Figma frames, except
  Liberty Mutual GL ($2,460), which is invented because it isn't legible in the design.
- **Eligibility rules** (`src/services/mockService.ts`): a carrier is eligible if it writes a selected GL/WC line.
  WC also needs ≥1 employee besides the owner. Cowbell, Nationwide, State Auto and Westfield are always ineligible.
  These are invented for the demo, not real underwriting.
- **Real-time rail**: re-evaluated after every answer with a fake ~650 ms delay ("Checking eligibility… (simulated)").
- **Carrier responses are scripted**: CHUBB WC and CNA WC always return a simulated timeout (with modal), and Pathpoint
  always requires additional questions.
- **Chubb and CNA** questions are reproduced from Figma. BiBERK, Hiscox, Liberty Mutual and Travelers use
  **templated placeholder questions**, labeled on screen.
- Browser tabs/address bar, Terminal nav, user menu, Intercom, left-rail collapse and help icon are **decorative**.

## Intentionally disabled (each shows its reason on hover/focus)
Save & Close · Previous on the first step · Continue to Bind · Refer To Exchange · ACORD PDF downloads ·
Complete Questions (Pathpoint) · Need additional help?

## Design tokens
Inspected with Figma `get_variable_defs` and mapped in `src/index.css` (`@theme`): Primary/Purple 100 `#6000C5`,
Dark/Primary `#4B4D52`, Terminal-BG `#E7EBEE`, and Mulish type styles (28/20/16/14/12). The success/warning colors and the
emphasis opacities (90/60/30/12%) are inferred from the design-context code and screenshots.

## Structure
`src/data` typed mock data · `src/services` simulated service layer · `src/state` demo store (localStorage) ·
`src/components` shell and UI · `src/pages` one file per route · `public/figma`, `public/logos` assets exported from Figma.
