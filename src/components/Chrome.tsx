import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'motion/react'
import { waLink } from '../data'
import { WhatsAppIcon } from './Art'

const ease = [0.76, 0, 0.24, 1] as const
const links = [['What we do', '#stalls'], ['Melas', '#events'], ['Host one', '#host'], ['Contact', '#contact']]
const hello = waLink('Namaste Anusha Events! I saw your website and wanted to know more.')

export function Logo() {
  return (
    <a href="#top" className="logo" aria-label="Anusha Events, back to top">
      <svg viewBox="0 0 40 40" width="30" height="30" aria-hidden>
        <circle cx="20" cy="20" r="15" fill="none" stroke="currentColor" strokeWidth="3" />
        <path d="M20 5v30M5 20h30M9.4 9.4l21.2 21.2M30.6 9.4 9.4 30.6" stroke="currentColor" strokeWidth="2" />
        <circle cx="20" cy="20" r="5" fill="var(--rani)" />
      </svg>
      <span>anusha<em>events</em></span>
    </a>
  )
}

export function Nav() {
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)

  useMotionValueEvent(scrollY, 'change', (y) => {
    setHidden(y > (scrollY.getPrevious() ?? 0) && y > 400)
  })

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <motion.header
        className="nav"
        animate={{ y: hidden && !open ? '-150%' : '0%' }}
        transition={{ duration: 0.5, ease }}
      >
        <Logo />
        <nav className="nav-links" aria-label="Main">
          {links.map(([label, href]) => (
            <a key={href} href={href} className="roll"><span data-text={label}>{label}</span></a>
          ))}
        </nav>
        <a className="btn btn-sm btn-marigold nav-cta" href={hello} target="_blank" rel="noopener">
          <WhatsAppIcon size={18} /> WhatsApp
        </a>
        <button className="menu-btn" aria-expanded={open} aria-controls="menu" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)}>
          <motion.span animate={open ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }} />
          <motion.span animate={open ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }} />
        </button>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu"
            className="menu"
            initial={{ clipPath: 'circle(0% at calc(100% - 44px) 44px)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 44px) 44px)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 44px) 44px)' }}
            transition={{ duration: 0.7, ease }}
          >
            <nav aria-label="Mobile">
              {links.map(([label, href], i) => (
                <div className="mask" key={href}>
                  <motion.a
                    href={href}
                    onClick={() => setOpen(false)}
                    initial={{ y: '110%' }} animate={{ y: 0 }} exit={{ y: '110%' }}
                    transition={{ duration: 0.6, ease, delay: 0.15 + i * 0.06 }}
                  >
                    <small>0{i + 1}</small>{label}
                  </motion.a>
                </div>
              ))}
            </nav>
            <a className="btn" href={hello} target="_blank" rel="noopener"><WhatsAppIcon /> Message on WhatsApp</a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/** One-time opening curtain. */
export function Intro() {
  return (
    <motion.div className="intro" aria-hidden>
      <motion.div className="intro-panel intro-panel--marigold" exit={{ y: '-100%' }} transition={{ duration: 0.9, ease, delay: 0.12 }} />
      <motion.div className="intro-panel" exit={{ y: '-100%' }} transition={{ duration: 0.9, ease }}>
        <div className="mask">
          <motion.div className="intro-word" initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 0.9, ease }}>मेला</motion.div>
        </div>
        <motion.p className="intro-sub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          anusha events presents
        </motion.p>
      </motion.div>
    </motion.div>
  )
}

/** Bubble that follows the mouse over anything with data-cursor="label". */
export function Cursor() {
  const [label, setLabel] = useState('')
  const [fine] = useState(() => matchMedia('(pointer: fine)').matches)
  const cfg = { stiffness: 450, damping: 35, mass: 0.5 }
  const x = useSpring(-200, cfg)
  const y = useSpring(-200, cfg)

  useEffect(() => {
    if (!fine) return
    const move = (e: PointerEvent) => {
      x.set(e.clientX); y.set(e.clientY)
      const el = (e.target as Element).closest?.('[data-cursor]')
      setLabel(el?.getAttribute('data-cursor') ?? '')
    }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [fine, x, y])

  if (!fine) return null
  return (
    <motion.div className="cursor" style={{ x, y }} aria-hidden>
      <motion.div
        className="cursor-bubble"
        animate={{ scale: label ? 1 : 0, opacity: label ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      >
        {label}
      </motion.div>
    </motion.div>
  )
}

export function WhatsAppFab() {
  const { scrollY } = useScroll()
  const [show, setShow] = useState(false)
  useMotionValueEvent(scrollY, 'change', (y) => setShow(y > window.innerHeight * 0.8))
  return (
    <AnimatePresence>
      {show && (
        <motion.a
          className="fab"
          href={hello} target="_blank" rel="noopener"
          aria-label="Chat with Anusha Events on WhatsApp"
          initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: 90 }}
          whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 380, damping: 20 }}
        >
          <motion.span className="fab-ring" animate={{ scale: [1, 1.5], opacity: [0.7, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }} />
          <WhatsAppIcon size={28} />
        </motion.a>
      )}
    </AnimatePresence>
  )
}
