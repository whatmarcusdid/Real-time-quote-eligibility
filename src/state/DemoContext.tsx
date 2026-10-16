import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { initialAnswers } from '../data/demoData'
import type { Answers } from '../data/types'

const KEY = 'rtqe-demo-v1'
interface Ctx { answers: Answers; update: (patch: Partial<Answers>) => void; reset: () => void }
const DemoContext = createContext<Ctx | null>(null)

function load(): Answers {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...initialAnswers, ...JSON.parse(raw) } : initialAnswers
  } catch {
    return initialAnswers
  }
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const [answers, setAnswers] = useState<Answers>(load)
  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(answers)) }, [answers])
  const update = useCallback((patch: Partial<Answers>) => setAnswers((a) => ({ ...a, ...patch })), [])
  const reset = useCallback(() => { localStorage.removeItem(KEY); setAnswers(initialAnswers) }, [])
  const value = useMemo(() => ({ answers, update, reset }), [answers, update, reset])
  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}

export function useDemo() {
  const c = useContext(DemoContext)
  if (!c) throw new Error('useDemo outside DemoProvider')
  return c
}
