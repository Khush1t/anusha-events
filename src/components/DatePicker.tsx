import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'

const pad = (n: number) => String(n).padStart(2, '0')
const key = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const parse = (k: string) => new Date(`${k}T00:00:00`)
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
const monthOf = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1)
const sameMonth = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
const WEEK = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
const ease = [0.22, 1, 0.36, 1] as const

/** Themed calendar popover. Value is 'YYYY-MM-DD' or ''. Past dates are disabled. */
export function DatePicker({ value, onChange, labelledBy }: { value: string; onChange: (v: string) => void; labelledBy: string }) {
  const today = new Date(new Date().setHours(0, 0, 0, 0))
  const selected = value ? parse(value) : null
  const [open, setOpen] = useState(false)
  const [view, setView] = useState(() => monthOf(selected ?? today))
  const [dir, setDir] = useState(1)
  const [focus, setFocus] = useState(selected ?? today)
  const root = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const grid = useRef<HTMLDivElement>(null)

  const close = (refocus = true) => { setOpen(false); if (refocus) trigger.current?.focus() }

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => { if (!root.current?.contains(e.target as Node)) close(false) }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [open])

  // Keep keyboard focus on the active day.
  useEffect(() => {
    if (open) grid.current?.querySelector<HTMLButtonElement>(`[data-day="${key(focus)}"]`)?.focus()
  }, [open, focus, view])

  const go = (month: Date) => { setDir(month > view ? 1 : -1); setView(month) }
  const canPrev = monthOf(view) > monthOf(today)
  const pick = (d: Date) => { onChange(key(d)); close() }

  const moveFocus = (d: Date) => {
    if (d < today) return
    if (!sameMonth(d, view)) go(monthOf(d))
    setFocus(d)
  }
  const onKey = (e: KeyboardEvent) => {
    const step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key]
    if (step) { e.preventDefault(); moveFocus(addDays(focus, step)) }
    if (e.key === 'Escape') { e.preventDefault(); close() }
  }

  const first = monthOf(view)
  const lead = (first.getDay() + 6) % 7
  const days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate()
  const cells = [...Array(lead).fill(null), ...Array.from({ length: days }, (_, i) => new Date(view.getFullYear(), view.getMonth(), i + 1))]
  const saturday = addDays(today, (6 - today.getDay() + 7) % 7)

  return (
    <div className="dp" ref={root}>
      <button
        ref={trigger}
        type="button"
        className={`dp-trigger${open ? ' open' : ''}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-labelledby={`${labelledBy} dp-value`}
        onClick={() => { if (!open) { setView(monthOf(selected ?? today)); setFocus(selected ?? today) } setOpen(!open) }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <rect x="3" y="5" width="18" height="16" rx="3" /><path d="M3 10h18M8 3v4M16 3v4" />
        </svg>
        <span id="dp-value" className={selected ? '' : 'dp-placeholder'}>
          {selected ? selected.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : 'Pick a date'}
        </span>
        <motion.svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" animate={{ rotate: open ? 180 : 0 }} aria-hidden>
          <path d="m6 9 6 6 6-6" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="dp-pop"
            role="dialog"
            aria-label="Choose a date"
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97, transition: { duration: 0.15 } }}
            transition={{ duration: 0.35, ease }}
            onKeyDown={onKey}
          >
            <div className="dp-head">
              <button type="button" className="dp-nav" onClick={() => go(new Date(view.getFullYear(), view.getMonth() - 1, 1))} disabled={!canPrev} aria-label="Previous month">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden><path d="m15 18-6-6 6-6" /></svg>
              </button>
              <div className="dp-title" aria-live="polite">
                <AnimatePresence mode="popLayout" initial={false} custom={dir}>
                  <motion.span
                    key={key(view)}
                    custom={dir}
                    variants={{ in: (d: number) => ({ y: d * 16, opacity: 0 }), out: (d: number) => ({ y: d * -16, opacity: 0 }) }}
                    initial="in" animate={{ y: 0, opacity: 1 }} exit="out"
                    transition={{ duration: 0.3, ease }}
                  >
                    {view.toLocaleDateString('en-IN', { month: 'long' })} <em>{view.getFullYear()}</em>
                  </motion.span>
                </AnimatePresence>
              </div>
              <button type="button" className="dp-nav" onClick={() => go(new Date(view.getFullYear(), view.getMonth() + 1, 1))} aria-label="Next month">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden><path d="m9 18 6-6-6-6" /></svg>
              </button>
            </div>

            <div className="dp-week" aria-hidden>{WEEK.map((w, i) => <span key={w} className={i > 4 ? 'we' : ''}>{w}</span>)}</div>

            <div className="dp-body">
              <AnimatePresence mode="popLayout" initial={false} custom={dir}>
                <motion.div
                  key={key(view)}
                  ref={grid}
                  className="dp-grid"
                  role="grid"
                  custom={dir}
                  variants={{ in: (d: number) => ({ x: d * 40, opacity: 0 }), out: (d: number) => ({ x: d * -40, opacity: 0 }) }}
                  initial="in" animate={{ x: 0, opacity: 1 }} exit="out"
                  transition={{ duration: 0.32, ease }}
                >
                  {cells.map((d, i) => {
                    if (!d) return <span key={`b${i}`} />
                    const k = key(d)
                    const isSel = value === k
                    const weekend = (lead + d.getDate() - 1) % 7 > 4
                    return (
                      <button
                        key={k}
                        type="button"
                        data-day={k}
                        className={`dp-day${weekend ? ' we' : ''}${k === key(today) ? ' today' : ''}${isSel ? ' sel' : ''}`}
                        disabled={d < today}
                        tabIndex={k === key(focus) ? 0 : -1}
                        aria-pressed={isSel}
                        aria-label={d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        onClick={() => pick(d)}
                      >
                        {isSel && <motion.span layoutId="dp-sel" className="dp-sel" transition={{ type: 'spring', stiffness: 450, damping: 32 }} />}
                        <span className="dp-num">{d.getDate()}</span>
                      </button>
                    )
                  })}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="dp-foot">
              <button type="button" onClick={() => pick(saturday)}>This Saturday</button>
              <button type="button" onClick={() => pick(addDays(saturday, 7))}>Next Saturday</button>
              {value && <button type="button" className="dp-clear" onClick={() => { onChange(''); close() }}>Clear</button>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
