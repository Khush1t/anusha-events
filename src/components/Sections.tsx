import { useLayoutEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { areas, stalls, stats, waLink } from '../data'
import { ArrowIcon, Awning, Bunting, C, Sparkle, StallArt, WhatsAppIcon, toneHex } from './Art'
import { ChipField } from './ChipField'
import { Counter, Magnetic, Reveal, Rise, ScrollWords } from './Kinetic'

/* ───────────── 01 About ───────────── */

export function About() {
  return (
    <section id="about" className="about">
      <div className="container">
        <Rise><span className="label">(01) Who we are</span></Rise>
        <ScrollWords
          className="statement"
          text="We take everything you love about a *mela, the *games, the *chaat, the *shopping and the noise, and set it up right inside your society gates. No traffic, no parking hunt. Walk down, bring the kids, and stay for the lucky draw."
        />
        <div className="stats">
          {stats.map((s, i) => (
            <Rise key={s.label} delay={i * 0.08} className="stat">
              <span className="stat-num"><Counter to={s.value} suffix={s.suffix} /></span>
              <span className="stat-label">{s.label}</span>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ───────────── 02 Stalls (pinned horizontal scroll) ───────────── */

export function Stalls() {
  const section = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [dist, setDist] = useState(0)

  useLayoutEffect(() => {
    const measure = () => track.current && setDist(Math.max(0, track.current.scrollWidth - window.innerWidth))
    measure()
    const ro = new ResizeObserver(measure)
    if (track.current) ro.observe(track.current)
    return () => ro.disconnect()
  }, [])

  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist])

  return (
    <section id="stalls" ref={section} className="stalls" style={{ height: `calc(100svh + ${dist}px)` }}>
      <div className="stalls-sticky">
        <Bunting className="stalls-bunting" />
        <motion.div ref={track} className="stalls-track" style={{ x }}>
          <div className="stalls-intro">
            <span className="label">(02) What's at a mela</span>
            <h2 className="h2">
              <Reveal text="Har stall pe" />
              <br />
              <Reveal text="kuch naya." className="serif accent-marigold" delay={0.1} />
            </h2>
            <p className="muted">Something new at every stall. Pick the mix that suits your society: a full-blown Diwali mela or a cosy Sunday bazaar.</p>
            <span className="hint">Keep scrolling <ArrowIcon size={16} /></span>
          </div>

          {stalls.map((s, i) => (
            <motion.article
              key={s.key}
              className={`stall tone-${s.tone}`}
              initial="rest" animate="rest" whileHover="hover"
              variants={{ rest: { rotate: i % 2 ? 1.5 : -1.5, y: 0 }, hover: { rotate: 0, y: -12 } }}
              transition={{ type: 'spring', stiffness: 220, damping: 18 }}
            >
              <Awning tone={s.tone === 'rani' ? '#c4126a' : toneHex[s.tone]} className="awning" />
              <div className="stall-body">
                <div className="stall-head">
                  <span className="stall-no">0{i + 1}</span>
                  <span className="hindi" lang="hi">{s.hindi}</span>
                </div>
                <StallArt kind={s.key} />
                <h3>{s.title}</h3>
                <p>{s.blurb}</p>
                <ul className="chips">{s.items.map((it) => <li key={it}>{it}</li>)}</ul>
              </div>
            </motion.article>
          ))}

          <div className="stalls-end">
            <p className="h3">Mix &amp; match <span className="serif">for your society.</span></p>
            <Magnetic>
              <a className="btn btn-marigold" href={waLink("Namaste! I'd like to plan a mela for our society. Can we discuss the stall mix?")} target="_blank" rel="noopener">
                <WhatsAppIcon size={18} /> Plan the stall mix
              </a>
            </Magnetic>
          </div>
        </motion.div>
        <div className="stalls-progress"><motion.span style={{ scaleX: scrollYProgress }} /></div>
      </div>
    </section>
  )
}

/* ───────────── 04 Host a mela ───────────── */

const steps = [
  { t: 'Ping us', d: 'Tell us your society, a rough date and how big you want it. One WhatsApp message is enough to start.' },
  { t: 'We plan it', d: 'Layout, stall mix, games, sound, lights and vendors, matched to your space, your crowd and your budget.' },
  { t: 'We set it up', d: 'On the day our team handles stalls, power, decor and vendors. Your committee doesn’t have to run around.' },
  { t: 'You enjoy it', d: 'Residents play, eat and shop. When it’s over we pack up and leave the grounds clean.' },
]

export function Host() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.7', 'end 0.6'] })

  return (
    <section id="host" className="host">
      <div className="container host-grid">
        <div className="host-side">
          <span className="label">(04) For RWAs &amp; committees</span>
          <h2 className="h2">
            <Reveal text="Want a mela" />{' '}
            <Reveal text="in your society?" className="serif" delay={0.1} />
          </h2>
          <p className="muted">We work with RWAs, society committees and resident groups across Dwarka. You bring the people, we bring the mela.</p>
          <Magnetic>
            <a className="btn btn-marigold" href={waLink("Namaste! I'm from a housing society and we'd like to host a mela. Can we talk?")} target="_blank" rel="noopener">
              <WhatsAppIcon size={18} /> Plan my society’s mela
            </a>
          </Magnetic>
        </div>

        <div className="steps" ref={ref}>
          <svg className="steps-line" viewBox="0 0 4 100" preserveAspectRatio="none" aria-hidden>
            <path d="M2 0V100" stroke={C.cream} strokeOpacity={0.18} strokeWidth={4} />
            <motion.path d="M2 0V100" stroke={C.marigold} strokeWidth={4} style={{ pathLength: scrollYProgress }} />
          </svg>
          <ol>
            {steps.map((s, i) => (
              <motion.li
                key={s.t}
                className="step"
                initial={{ opacity: 0.25, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ margin: '-45% 0px -45% 0px' }}
                transition={{ duration: 0.6 }}
              >
                <motion.span
                  className="step-no"
                  initial={{ backgroundColor: C.peacock, color: C.cream }}
                  whileInView={{ backgroundColor: C.marigold, color: C.ink }}
                  viewport={{ margin: '-45% 0px -45% 0px' }}
                >
                  {i + 1}
                </motion.span>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

/* ───────────── 05 Areas ───────────── */

export function Areas() {
  const reduce = useReducedMotion()
  return (
    <section className="areas">
      <div className="container areas-grid">
        <div>
          <span className="label">(05) Where we set up</span>
          <h2 className="h2">
            <Reveal text="Dwarka" />{' '}
            <Reveal text="& around." className="serif" delay={0.1} />
          </h2>
          <p>Every sector of Dwarka and the neighbourhoods around it. Not on the list? Message anyway, we travel for a good mela.</p>
        </div>

        <motion.div
          className="badge"
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
          aria-hidden
        >
          <svg viewBox="0 0 200 200">
            <defs><path id="ring" d="M100 100 m-78 0 a78 78 0 1 1 156 0 a78 78 0 1 1 -156 0" /></defs>
            <circle cx="100" cy="100" r="98" fill={C.ink} />
            <text><textPath href="#ring">DWARKA ✦ WEST DELHI ✦ AND AROUND ✦ MELA ✦ </textPath></text>
          </svg>
          <span className="badge-core"><Sparkle size={40} /></span>
        </motion.div>
      </div>

      <div className="container">
        <ChipField items={areas} />
      </div>
    </section>
  )
}
