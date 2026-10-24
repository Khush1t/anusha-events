import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { events, waLink, type MelaEvent } from '../data'
import { ArrowIcon, Kite, C, WhatsAppIcon } from './Art'
import { Magnetic, Reveal, Rise } from './Kinetic'

/** "4 PM – 10 PM" on 2026-10-31 -> Date at 16:00 local. */
export function startOf(e: MelaEvent) {
  const d = new Date(`${e.date}T00:00:00`)
  const m = e.time.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i)
  if (m) d.setHours((+m[1] % 12) + (m[3].toUpperCase() === 'PM' ? 12 : 0), +(m[2] ?? 0))
  return d
}

const fmt = (e: MelaEvent, o: Intl.DateTimeFormatOptions) => new Date(`${e.date}T00:00:00`).toLocaleDateString('en-IN', o)
const ask = (e: MelaEvent) =>
  waLink(`Namaste! I'd like to know more about the ${e.title} at ${e.society}, ${e.area} on ${fmt(e, { day: 'numeric', month: 'long' })}.`)

export function Events() {
  // ponytail: an event stays listed until the end of its day, no time-zone juggling
  const now = new Date()
  const upcoming = events
    .filter((e) => new Date(`${e.date}T23:59:59`) >= now)
    .sort((a, b) => a.date.localeCompare(b.date))
  const [next, ...rest] = upcoming

  return (
    <section id="events" className="events">
      <div className="container">
        <div className="events-head">
          <div>
            <span className="label">(03) Mela calendar</span>
            <h2 className="h2"><Reveal text="Upcoming" /> <Reveal text="melas." className="serif accent-rani" delay={0.1} /></h2>
          </div>
          <Rise><p className="muted">Entry is free for residents unless the society says otherwise. Tap any mela to ask us about it on WhatsApp.</p></Rise>
        </div>

        {next ? <NextUp e={next} /> : (
          <Rise className="empty">
            <p className="h3">The next mela is being planned.</p>
            <a className="btn btn-ink" href={waLink('Namaste! When is your next mela?')} target="_blank" rel="noopener"><WhatsAppIcon size={18} /> Ask us what’s next</a>
          </Rise>
        )}

        {rest.length > 0 && (
          <ul className="event-list">
            {rest.map((e, i) => (
              <motion.li
                key={e.date + e.title}
                className={`event-row tone-${e.tone}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-5% 0px' }}
                transition={{ duration: 0.7, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              >
                <a href={ask(e)} target="_blank" rel="noopener" data-cursor="Ask on WhatsApp">
                  <span className="ev-date">
                    <span className="ev-day">{fmt(e, { day: '2-digit' })}</span>
                    <span className="ev-mon">{fmt(e, { month: 'short' })}<br />{fmt(e, { weekday: 'short' })}</span>
                  </span>
                  <span className="ev-main">
                    <span className="ev-title">{e.title}</span>
                    <span className="ev-where">{e.society} · {e.area}</span>
                  </span>
                  <span className="ev-meta">
                    <span className="ev-time">{e.time}</span>
                    <span className="ev-tags">{e.tags.map((t) => <span key={t}>{t}</span>)}</span>
                  </span>
                  <span className="ev-arrow"><ArrowIcon size={22} /></span>
                </a>
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

function NextUp({ e }: { e: MelaEvent }) {
  const target = startOf(e).getTime()
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])
  const left = Math.max(0, target - now)
  const units = [
    ['Days', Math.floor(left / 864e5)],
    ['Hrs', Math.floor(left / 36e5) % 24],
    ['Min', Math.floor(left / 6e4) % 60],
    ['Sec', Math.floor(left / 1e3) % 60],
  ] as const

  return (
    <Rise className="next">
      <div className="next-art" aria-hidden>
        <motion.div animate={{ y: [0, -14, 0], rotate: [-8, 4, -8] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
          <Kite a={C.marigold} b={C.rani} />
        </motion.div>
      </div>
      <div className="next-info">
        <span className="pill"><span className="dot" /> Next up</span>
        <h3 className="next-title">{e.title}</h3>
        <p className="next-where">{e.society}<br />{e.area}</p>
        <p className="next-when">{fmt(e, { weekday: 'long', day: 'numeric', month: 'long' })} · {e.time}</p>
        <ul className="chips chips-light">{e.tags.map((t) => <li key={t}>{t}</li>)}</ul>
      </div>
      <div className="next-side">
        {left > 0 ? (
          <div className="countdown" role="timer" aria-label={`${units[0][1]} days ${units[1][1]} hours to go`}>
            {units.map(([label, v]) => (
              <div key={label} className="cd-unit">
                <span className="cd-num">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={v}
                      initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '-100%', opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {String(v).padStart(2, '0')}
                    </motion.span>
                  </AnimatePresence>
                </span>
                <span className="cd-label">{label}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="h3 live">It’s on right now. Come down!</p>
        )}
        <Magnetic>
          <a className="btn btn-marigold" href={ask(e)} target="_blank" rel="noopener"><WhatsAppIcon size={18} /> Ask about this mela</a>
        </Magnetic>
      </div>
    </Rise>
  )
}
