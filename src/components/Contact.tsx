import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { contact, telLink, waLink } from '../data'
import { ArrowIcon, InstagramIcon, PhoneIcon, WhatsAppIcon } from './Art'
import { DatePicker } from './DatePicker'
import { Magnetic, Reveal } from './Kinetic'

const intents = [
  { key: 'host', label: 'Host a mela in my society', line: "We'd like to host a mela in our society." },
  { key: 'stall', label: 'Book a stall', line: "I'd like to book a stall at one of your melas." },
  { key: 'event', label: 'Ask about a mela', line: 'I wanted to ask about an upcoming mela.' },
  { key: 'other', label: 'Something else', line: 'I have a question.' },
]

export function Contact() {
  const [intent, setIntent] = useState(intents[0])
  const [name, setName] = useState('')
  const [society, setSociety] = useState('')
  const [date, setDate] = useState('')

  const message = [
    'Namaste Anusha Events!',
    intent.line,
    name && `Name: ${name}`,
    society && `Society: ${society}`,
    date && `Date: ${new Date(date + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`,
  ].filter(Boolean).join('\n')

  return (
    <section id="contact" className="contact">
      <div className="container">
        <span className="label">(06) Say namaste</span>
        <h2 className="contact-title">
          <Reveal text="Chalo," /><br />
          <Reveal text="mela lagate hain." className="serif accent-marigold" delay={0.1} />
        </h2>
        <p className="translation">“Come on, let’s set up a mela.”</p>

        <div className="contact-grid">
          <form
            className="composer"
            onSubmit={(e) => { e.preventDefault(); window.open(waLink(message), '_blank', 'noopener') }}
          >
            <fieldset>
              <legend>I want to…</legend>
              <div className="intents">
                {intents.map((it) => (
                  <label key={it.key} className={`intent ${intent.key === it.key ? 'on' : ''}`}>
                    <input type="radio" name="intent" value={it.key} checked={intent.key === it.key} onChange={() => setIntent(it)} />
                    {intent.key === it.key && <motion.span layoutId="intent-bg" className="intent-bg" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                    <span className="intent-text">{it.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="fields">
              <label className="field-wrap">
                <span>Your name</span>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Priya Sharma" autoComplete="name" />
              </label>
              <label className="field-wrap">
                <span>Society &amp; sector</span>
                <input value={society} onChange={(e) => setSociety(e.target.value)} placeholder="e.g. Sector 12, Dwarka" />
              </label>
              <div className="field-wrap">
                <span id="date-label">Date in mind <em>(optional)</em></span>
                <DatePicker value={date} onChange={setDate} labelledBy="date-label" />
              </div>
            </div>

            <div className="preview" aria-live="polite">
              <span className="preview-label">Your message</span>
              <div className="bubble">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.pre key={message} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                    {message}
                  </motion.pre>
                </AnimatePresence>
              </div>
            </div>

            <Magnetic strength={0.2}>
              <button type="submit" className="btn btn-wa btn-lg"><WhatsAppIcon /> Send on WhatsApp</button>
            </Magnetic>
          </form>

          <div className="direct">
            <a className="direct-link" href={telLink} data-cursor="Call now">
              <span className="direct-kicker"><PhoneIcon size={16} /> Call</span>
              <span className="direct-big">{contact.phone}</span>
              <ArrowIcon size={28} className="direct-arrow" />
            </a>
            <a className="direct-link" href={waLink('Namaste Anusha Events!')} target="_blank" rel="noopener" data-cursor="Say hi">
              <span className="direct-kicker"><WhatsAppIcon size={16} /> WhatsApp</span>
              <span className="direct-big">Chat with us</span>
              <ArrowIcon size={28} className="direct-arrow" />
            </a>
            <a className="direct-link" href={contact.instagram} target="_blank" rel="noopener" data-cursor="Follow">
              <span className="direct-kicker"><InstagramIcon size={16} /> Instagram</span>
              <span className="direct-big">See past melas</span>
              <ArrowIcon size={28} className="direct-arrow" />
            </a>
            {contact.email && (
              <a className="direct-link" href={`mailto:${contact.email}`}>
                <span className="direct-kicker">Email</span>
                <span className="direct-big">{contact.email}</span>
                <ArrowIcon size={28} className="direct-arrow" />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  const word = 'anusha'
  return (
    <footer className="footer">
      <div className="container">
        <p className="footer-word" aria-label="Anusha Events">
          {word.split('').map((ch, i) => (
            <motion.span key={i} aria-hidden whileHover={{ y: '-18%', rotate: i % 2 ? 8 : -8, color: ['#ffb000', '#e8217f', '#4fd1b5'][i % 3] }} transition={{ type: 'spring', stiffness: 400, damping: 12 }}>
              {ch}
            </motion.span>
          ))}
          <span className="footer-events serif" aria-hidden>events</span>
        </p>
        <div className="footer-row">
          <span>© {new Date().getFullYear()} Anusha Events · Made with chaat in Dwarka, New Delhi</span>
          <Magnetic><a href="#top" className="roll"><span data-text="Back to top ↑">Back to top ↑</span></a></Magnetic>
        </div>
      </div>
    </footer>
  )
}
