import { useLayoutEffect, useRef, type RefObject } from 'react'
import {
  animate, motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTime, useTransform, useVelocity,
} from 'motion/react'
import { waLink } from '../data'
import { ArrowIcon, C, GiantWheel, Kite, StringLights, WhatsAppIcon } from './Art'
import { Magnetic, Reveal } from './Kinetic'

const ease = [0.22, 1, 0.36, 1] as const

export function Hero({ play }: { play: boolean }) {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const copyY = useTransform(scrollYProgress, [0, 1], ['0%', '35%'])
  const copyFade = useTransform(scrollYProgress, [0, 0.75], [1, 0])
  const wheelY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const hindiY = useTransform(scrollYProgress, [0, 1], ['0%', '-45%'])

  // Pointer parallax, -0.5..0.5 across the hero
  const px = useSpring(useMotionValue(0), { stiffness: 60, damping: 18 })
  const py = useSpring(useMotionValue(0), { stiffness: 60, damping: 18 })
  const wheelX = useTransform(px, (v) => v * -30)
  const hindiX = useTransform(px, (v) => v * 50)
  const hindiPY = useTransform(py, (v) => v * 30)

  const show = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: play ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 0.9, ease, delay },
  })

  return (
    <section
      id="top"
      ref={ref}
      className="hero"
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== 'mouse') return
        px.set(e.clientX / window.innerWidth - 0.5)
        py.set(e.clientY / window.innerHeight - 0.5)
      }}
    >
      <StringLights className="hero-lights" />

      <motion.div className="hero-hindi" style={{ y: hindiY, x: hindiX }} aria-hidden>
        <motion.span style={{ y: hindiPY, display: 'block' }}>मेला</motion.span>
      </motion.div>

      <div className="container hero-grid">
        <motion.div className="hero-copy" style={{ y: copyY, opacity: copyFade }}>
          <motion.p className="eyebrow" {...show(0.1)}>
            <span className="dot" /> Society melas · Dwarka &amp; around
          </motion.p>
          <h1 className="hero-title">
            <Reveal text="The mela" play={play} />
            <span className="line">
              <Reveal text="comes" play={play} delay={0.12} />{' '}
              <Reveal text="home." className="serif" play={play} delay={0.22} />
            </span>
          </h1>
          <motion.p className="hero-sub" {...show(0.45)}>
            Game stalls, chaat counters, shopping lanes and a whole lot of happy noise, set up
            right inside your housing society. Kids, dadis and everyone in between.
          </motion.p>
          <motion.div className="hero-ctas" {...show(0.6)}>
            <Magnetic>
              <a className="btn btn-marigold" href="#events">See upcoming melas <ArrowIcon size={18} /></a>
            </Magnetic>
            <Magnetic>
              <a className="btn btn-ghost" href={waLink('Namaste! I want to know about upcoming melas near me.')} target="_blank" rel="noopener">
                <WhatsAppIcon size={18} /> WhatsApp us
              </a>
            </Magnetic>
          </motion.div>
        </motion.div>

        <motion.div
          className="hero-wheel"
          style={{ y: wheelY, x: wheelX }}
          initial={{ opacity: 0, scale: 0.85, rotate: -8 }}
          animate={play ? { opacity: 1, scale: 1, rotate: 0 } : undefined}
          transition={{ duration: 1.4, ease, delay: 0.2 }}
        >
          <GiantWheel className="wheel" />
        </motion.div>
      </div>

      <FlyingKite hero={ref} className="kite kite-a" a={C.rani} b={C.marigold} delay={0.9} play={play} seed={0} />
      <FlyingKite hero={ref} className="kite kite-b" a={C.peacock} b={C.cream} delay={1.1} play={play} seed={2} />

      <motion.a href="#about" className="scroll-cue" {...show(1)} aria-label="Scroll to learn more">
        <span>Scroll</span>
        <span className="scroll-line"><motion.span animate={reduce ? undefined : { y: ['-100%', '100%'] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }} /></span>
      </motion.a>
    </section>
  )
}

/**
 * A kite on a manjha. Grab it and fly: it tilts with your swipe speed, the string
 * pulls taut while you hold it, and it flutters back to its spot when let go.
 * Tap it for a loop.
 */
function FlyingKite({ hero, className, a, b, delay, play, seed }: {
  hero: RefObject<HTMLElement | null>; className: string; a: string; b: string; delay: number; play: boolean; seed: number
}) {
  const reduce = useReducedMotion()
  const kite = useRef<HTMLDivElement>(null)
  const time = useTime()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const spin = useMotionValue(0)
  const taut = useSpring(0, { stiffness: 180, damping: 18 })
  const tilt = useSpring(useTransform(useVelocity(x), [-1600, 1600], [-45, 45]), { stiffness: 140, damping: 11 })
  // Rest position of the bridle point + where the string is held (below the fold), in hero px
  const geo = useMotionValue({ kx: 0, ky: 0, ax: 0, ay: 0 })

  useLayoutEffect(() => {
    // offsetParent is the hero; its ref isn't attached yet when this child effect runs
    const k = kite.current, h = k?.offsetParent as HTMLElement | null
    if (!k || !h) return
    const measure = () => {
      const kx = k.offsetLeft + k.offsetWidth / 2, ky = k.offsetTop + k.offsetHeight * 0.27
      geo.set({ kx, ky, ax: Math.max(0, kx - h.clientWidth * 0.12), ay: h.clientHeight + 40 })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(h)
    return () => ro.disconnect()
  }, [geo])

  // Idle wind: a lazy figure-eight, calmer while you're holding it
  const t = () => (reduce ? 0 : time.get() / 1000 + seed)
  const windX = useTransform(() => Math.sin(t() * 0.55) * 14 * (1 - taut.get()))
  const windY = useTransform(() => Math.sin(t() * 1.1) * 10 * (1 - taut.get()))
  const rotate = useTransform(() => tilt.get() + Math.sin(t() * 0.9) * 7 * (1 - taut.get()) + spin.get())

  const string = useTransform(() => {
    const g = geo.get()
    const kx = g.kx + x.get() + windX.get(), ky = g.ky + y.get() + windY.get()
    const dist = Math.hypot(kx - g.ax, ky - g.ay)
    const sag = dist * (0.2 - 0.17 * taut.get())
    return `M${g.ax} ${g.ay} Q${(g.ax + kx) / 2 + sag * 0.7} ${(g.ay + ky) / 2 + sag} ${kx} ${ky}`
  })

  const fade = { initial: { opacity: 0 }, animate: play ? { opacity: 1 } : undefined, transition: { duration: 1.2, delay } }

  return (
    <>
      <motion.svg className="kite-string" aria-hidden {...fade}>
        <motion.path d={string} />
      </motion.svg>
      <motion.div
        ref={kite}
        className={className}
        style={{ x, y }}
        drag dragConstraints={hero} dragElastic={0.12} dragSnapToOrigin
        dragTransition={{ bounceStiffness: 90, bounceDamping: 7 }}
        onDragStart={() => taut.set(1)}
        onDragEnd={() => taut.set(0)}
        onTap={() => {
          if (reduce) return
          animate(spin, spin.get() + 360, { duration: 1, ease: [0.65, 0, 0.35, 1] })
          animate(y, [0, -70, 10, 0], { duration: 1.1, ease: 'easeInOut' })
        }}
        whileDrag={{ scale: 1.12, cursor: 'grabbing' }}
        aria-label="Kite. Drag to fly it, tap for a loop."
        {...fade}
      >
        <motion.div style={{ x: windX, y: windY, rotate, originY: 0.27 }}>
          <Kite a={a} b={b} />
        </motion.div>
      </motion.div>
    </>
  )
}
