import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react'
import {
  animate, motion, useAnimationFrame, useInView, useMotionValue, useReducedMotion,
  useScroll, useSpring, useTransform, useVelocity, type MotionValue,
} from 'motion/react'

const ease = [0.22, 1, 0.36, 1] as const

/** Words rise out of a mask. Plays on scroll into view, or when `play` flips true. */
export function Reveal({ text, className, delay = 0, stagger = 0.06, play }: {
  text: string; className?: string; delay?: number; stagger?: number; play?: boolean
}) {
  const words = text.split(' ')
  const trigger = play === undefined
    ? { initial: 'hide', whileInView: 'show', viewport: { once: true, margin: '-10% 0px' } }
    : { initial: 'hide', animate: play ? 'show' : 'hide' }
  return (
    <motion.span className={className} {...trigger} transition={{ staggerChildren: stagger, delayChildren: delay }} aria-label={text}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="mask" aria-hidden>
            <motion.span
              className="mask-in"
              variants={{ hide: { y: '115%', rotate: 7 }, show: { y: '0%', rotate: 0 } }}
              transition={{ duration: 1, ease }}
            >
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 && ' '}
        </Fragment>
      ))}
    </motion.span>
  )
}

/** Fade-and-lift for any block. */
export function Rise({ children, delay = 0, className, y = 40 }: { children: ReactNode; delay?: number; className?: string; y?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: 0.9, ease, delay }}
    >
      {children}
    </motion.div>
  )
}

const wrap = (min: number, max: number, v: number) => {
  const r = max - min
  return ((((v - min) % r) + r) % r) + min
}

/** Infinite ticker that speeds up, flips and skews with scroll velocity. */
export function Marquee({ children, speed = 4, className }: { children: ReactNode; speed?: number; className?: string }) {
  const reduce = useReducedMotion()
  const base = useMotionValue(0)
  const { scrollY } = useScroll()
  const smooth = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 300 })
  const factor = useTransform(smooth, [0, 1000], [0, 4], { clamp: false })
  const skew = useTransform(smooth, [-3000, 3000], [10, -10])
  const x = useTransform(base, (v) => `${wrap(-25, 0, v)}%`)
  const dir = useRef(-1)

  useAnimationFrame((_, delta) => {
    if (reduce) return
    const f = factor.get()
    if (f < 0) dir.current = 1
    else if (f > 0) dir.current = -1
    const move = dir.current * speed * (delta / 1000)
    base.set(base.get() + move + move * Math.abs(f))
  })

  return (
    <div className={`marquee ${className ?? ''}`}>
      <motion.div className="marquee-track" style={{ x, skewX: reduce ? 0 : skew }}>
        {[0, 1, 2, 3].map((i) => (
          <div className="marquee-copy" key={i} aria-hidden={i > 0}>{children}</div>
        ))}
      </motion.div>
    </div>
  )
}

/** Pulls its child toward the pointer. Mouse only. */
export function Magnetic({ children, strength = 0.35 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduce = useReducedMotion()
  const cfg = { stiffness: 220, damping: 14, mass: 0.4 }
  const x = useSpring(0, cfg)
  const y = useSpring(0, cfg)
  return (
    <motion.span
      ref={ref}
      className="magnetic"
      style={{ x, y }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== 'mouse' || !ref.current) return
        const r = ref.current.getBoundingClientRect()
        x.set((e.clientX - r.left - r.width / 2) * strength)
        y.set((e.clientY - r.top - r.height / 2) * strength)
      }}
      onPointerLeave={() => { x.set(0); y.set(0) }}
    >
      {children}
    </motion.span>
  )
}

/** Counts up once it's on screen. */
export function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15% 0px' })
  const reduce = useReducedMotion()
  const [n, setN] = useState(reduce ? to : 0)
  useEffect(() => {
    if (!inView || reduce) return
    const c = animate(0, to, { duration: 1.8, ease, onUpdate: (v) => setN(Math.round(v)) })
    return () => c.stop()
  }, [inView, reduce, to])
  return <span ref={ref}>{n}{suffix}</span>
}

/** Paragraph whose words light up as you scroll through it. */
export function ScrollWords({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] })
  const words = text.split(' ')
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <Word key={i} p={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {w}
        </Word>
      ))}
    </p>
  )
}

function Word({ children, p, range }: { children: string; p: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(p, range, [0.14, 1])
  const accent = children.startsWith('*')
  return (
    <>
      <motion.span style={{ opacity }} className={accent ? 'accent' : undefined}>
        {accent ? children.slice(1) : children}
      </motion.span>{' '}
    </>
  )
}
