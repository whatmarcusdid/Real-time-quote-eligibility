// All data is FICTIONAL demo data for the "Union Square Flowers" scenario.
import type { Answers, Carrier, CarrierId, CarrierScript, Coverage, LineCode, LineResult } from './types'

export const business = {
  name: 'Union Square Flowers',
  meta: 'ID: T8W-32F-7LG • Flower shops, fresh • General Liability, Workers Compensation',
  agent: 'Marcus White',
  agency: 'White Demo Agency',
}

// Real coverage names (the Figma cards all read "General Liability" by mistake).
export const coverages: Coverage[] = [
  { id: 'GL', name: 'General Liability', description: 'General Liability (GL) coverage insures businesses against claims for property damage or personal and advertising injury caused by your employees, services, or business operations' },
  { id: 'WC', name: "Workers' Compensation", description: "Workers' Compensation (WC) coverage provides benefits such as wage loss and disability to employees who get sick or injured from work-related incidents." },
  { id: 'BOP', name: "Business Owner's Policy", description: "A Business Owner's Policy (BOP) combines Commercial Property and General Liability (GL) insurance into one insurance policy. In addition to General Liability it includes coverage for claims resulting from fire, theft or other covered perils." },
  { id: 'PL', name: 'Professional Liability', description: "Professional Liability (PL) coverage, also known as Errors and Omissions (E&O), protects businesses against claims related to misrepresentation, negligence, and errors in the business's professional capacity." },
  { id: 'CA', name: 'Commercial Auto', description: 'Commercial Auto (CA) coverage insures a business for liability damages caused by vehicles operated by its employees in the course of business, and physical damage caused to vehicles insured by the business owner.' },
  { id: 'CYBER', name: 'Cyber Liability', description: 'Cyber Liability (CL) coverage insures businesses against damages caused by data breaches or other malicious cyber attacks against computer systems.' },
  { id: 'UMB', name: 'Umbrella', description: 'Umbrella Insurance (UMB) provides excess liability coverage to help pay for eligible catastrophic business losses that exceed underlying policy liability limits.' },
]

export const lineNames: Record<LineCode, string> = { GL: 'General Liability', WC: 'Workers Compensation' }

export const carriers: Carrier[] = [
  { id: 'biberk', name: 'BiBERK', logo: 'logos/biberk.png', lines: ['WC'], market: 'admitted' },
  { id: 'chubb', name: 'CHUBB', logo: 'logos/chubb.png', lines: ['GL', 'WC'], market: 'admitted' },
  { id: 'cna', name: 'CNA', logo: 'logos/cna.png', lines: ['WC'], market: 'admitted' },
  { id: 'hiscox', name: 'Hiscox', logo: 'logos/hiscox.png', lines: ['GL'], market: 'admitted' },
  { id: 'liberty-mutual', name: 'Liberty Mutual', logo: 'logos/liberty-mutual.png', lines: ['GL', 'WC'], market: 'admitted' },
  { id: 'travelers', name: 'Travelers', logo: 'logos/travelers.png', lines: ['WC'], market: 'admitted' },
  { id: 'pathpoint', name: 'Pathpoint', logo: 'logos/pathpoint.png', lines: ['GL'], market: 'additional' },
  { id: 'cowbell', name: 'Cowbell', logo: 'logos/cowbell.png', lines: [], market: 'never' },
  { id: 'nationwide', name: 'Nationwide', logo: 'logos/nationwide.png', lines: [], market: 'never' },
  { id: 'state-auto', name: 'State Auto', logo: 'logos/state-auto.png', lines: [], market: 'never' },
  { id: 'westfield', name: 'Westfield', logo: 'logos/westfield.png', lines: [], market: 'never' },
]
export const carrierById = Object.fromEntries(carriers.map((c) => [c.id, c])) as Record<CarrierId, Carrier>

/** Order of carrier question steps (canvas order in Figma). */
export const carrierOrder: CarrierId[] = ['biberk', 'chubb', 'cna', 'hiscox', 'liberty-mutual', 'travelers']

const yn = (id: string, label: string) => ({ id, kind: 'yesno' as const, label })
const template = (carrierId: CarrierId, title: string): CarrierScript => ({
  carrierId, title, scripted: false,
  questions: [
    yn('t1', `[Templated] Has ${title} coverage been cancelled or non-renewed in the past three years?`),
    yn('t2', '[Templated] Does the business operate from more than one location?'),
    yn('t3', '[Templated] Are any employees under 18 years of age?'),
  ],
})

export const carrierScripts: Record<string, CarrierScript> = {
  chubb: {
    carrierId: 'chubb', title: 'Chubb', scripted: true,
    questions: [
      yn('cancelled', 'Has any policy or coverage been cancelled or non-renewed during the prior three (3) years for any premises or operations?'),
      yn('otherBusiness', 'Does your business own or operate any other business under the same legal entity that will NOT be quoted on this application?'),
      yn('bankruptcy', 'Has your business, a majority owner, partner or member filed bankruptcy in the past five years?'),
      { id: 'wcClaims', kind: 'number', label: "How many Workers' Compensation claims have you made in the past? (Enter 0 if no claims.)" },
      { id: 'priorInsurer', kind: 'select', label: "What is the name of your previous Workers' Compensation insurer? (Select Others if no previous insurer.)", options: ['Self-Insured', 'The Hartford', 'Employers', 'State Fund', 'Others'] },
      yn('owners', 'Are you seeking coverage for the owners, partners, LLC members or executive officers of this business?'),
      yn('mvr', 'Do you or other business owners review MVRs annually for employees who drive regularly?'),
      yn('delivery', 'Does your business offer delivery in modes of transportation other than automobile such as bicycle, moped, motorcycle, scooter, or roller skates?'),
    ],
  },
  cna: {
    carrierId: 'cna', title: 'CNA', scripted: true,
    questions: [
      yn('subLimits', "Are subcontractor Employers Liability limits required to equal and exceed the insured contractors Employer Liability limits?"),
      yn('subCerts', "Are certificates of Workers' Compensation insurance required for all subcontractors?"),
      yn('rtw', 'Does the customer utilize a Return to Work Program (RTW) for work-related injuries?'),
    ],
  },
  biberk: template('biberk', 'BiBERK'),
  hiscox: template('hiscox', 'Hiscox'),
  'liberty-mutual': template('liberty-mutual', 'Liberty Mutual'),
  travelers: template('travelers', 'Travelers'),
}

const glLimits: [string, string][] = [
  ['Per Occurrence Limit', '$1,000,000'],
  ['General Aggregate Limit', '$2,000,000'],
  ['Products - Completed Operations Aggregate Limit', '$2,000,000'],
  ['Medical Expense Limit', '$5,000'],
]
const wcLimits: [string, string][] = [
  ['Each Accident', '$1,000,000'],
  ['Disease - Policy Limit', '$1,000,000'],
  ['Disease - Each Employee', '$1,000,000'],
]

/** Scripted (predetermined) carrier responses. Values from Figma where shown; others marked SIM. */
export const scriptedResults: Record<string, Partial<Record<LineCode, LineResult>>> = {
  biberk: { WC: { status: 'quoted', premium: 39282, quoteId: '863041', limits: wcLimits } },
  chubb: { GL: { status: 'quoted', premium: 1720, quoteId: '863066', limits: glLimits }, WC: { status: 'timeout' } },
  cna: { WC: { status: 'timeout' } },
  hiscox: { GL: { status: 'quoted', premium: 3178, quoteId: '863102', limits: glLimits } },
  // Liberty Mutual GL premium is not legible in Figma: SIM value.
  'liberty-mutual': { GL: { status: 'quoted', premium: 2460, quoteId: '863115', limits: glLimits }, WC: { status: 'quoted', premium: 1058, quoteId: '863116', limits: wcLimits } },
  travelers: { WC: { status: 'quoted', premium: 21923, quoteId: '863130', limits: wcLimits } },
  pathpoint: { GL: { status: 'needs-questions' } },
}

export const initialAnswers: Answers = {
  coverages: [],
  foundingYear: '2017',
  legalEntity: 'LLC',
  fullTime: 2,
  partTime: 8,
  grossRevenue: '2,000,000',
  ownerPayroll: '1,000,000',
  employeePayroll: '2',
  contractorPayroll: '8',
  policyStart: '7/1/2022',
  idType: 'FEIN (Federal Tax Identification Number)',
  fein: '',
  carrier: {},
  submitted: [],
}

/** Estimated Annual Premium ranges shown in the rail once quoting finishes (values from the Chubb live frame). */
export const premiumRanges: { label: string; range: string }[] = [
  { label: 'General Liability', range: '$739 - $1,204' },
  { label: 'Worker’s Compensation', range: '$734 - $1,343' },
]

export const legalEntities = ['LLC', 'Corporation', 'Sole Proprietorship', 'Partnership', 'Non-profit']
export const idTypes = ['FEIN (Federal Tax Identification Number)', 'SSN (Social Security Number)']
