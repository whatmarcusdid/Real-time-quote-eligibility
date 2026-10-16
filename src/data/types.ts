export type LineCode = 'GL' | 'WC'
export type CoverageId = 'GL' | 'WC' | 'BOP' | 'PL' | 'CA' | 'CYBER' | 'UMB'
export type CarrierId =
  | 'chubb' | 'hiscox' | 'liberty-mutual' | 'pathpoint' | 'biberk' | 'cna'
  | 'travelers' | 'cowbell' | 'nationwide' | 'state-auto' | 'westfield'

export interface Coverage { id: CoverageId; name: string; description: string }

export interface Carrier {
  id: CarrierId
  name: string
  logo: string
  lines: LineCode[]
  market: 'admitted' | 'additional' | 'never'
}

export type Question =
  | { id: string; kind: 'yesno'; label: string }
  | { id: string; kind: 'number'; label: string }
  | { id: string; kind: 'select'; label: string; options: string[] }

export interface CarrierScript {
  carrierId: CarrierId
  title: string
  /** true = copy reproduced from Figma; false = templated placeholder questions */
  scripted: boolean
  questions: Question[]
}

export type LineResult =
  | { status: 'quoted'; premium: number; quoteId: string; limits?: [string, string][] }
  | { status: 'timeout' }
  | { status: 'needs-questions' }

export type LineStatus = 'idle' | 'pending' | LineResult['status']

export interface Answers {
  coverages: CoverageId[]
  foundingYear: string
  legalEntity: string
  fullTime: number
  partTime: number
  grossRevenue: string
  ownerPayroll: string
  employeePayroll: string
  contractorPayroll: string
  policyStart: string
  idType: string
  fein: string
  carrier: Record<string, Record<string, string>>
  /** carriers whose question set was submitted */
  submitted: CarrierId[]
  /** business details step completed (drives rail line display) */
  submittedDetails?: boolean
}
