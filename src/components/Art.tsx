import { useMemo } from 'react'
import { motion, useReducedMotion, useScroll, useTime, useTransform, type MotionValue } from 'motion/react'
import type { Tone } from '../data'

// Mirrors the tokens in styles.css. SVG presentation attributes can't read CSS vars.
export const C = {
  ink: '#1d1030', ink2: '#2c1a47', cream: '#fff3e0', paper: '#f7e4c6',
  marigold: '#ffb000', rani: '#e8217f', sindoor: '#ef4a23', peacock: '#0b6e6a',
  candy: '#ff9ccb', leaf: '#4fa35a', wood: '#c98b4a',
}
export const toneHex: Record<Tone, string> = { marigold: C.marigold, rani: C.rani, peacock: C.peacock, sindoor: C.sindoor }

const rnd = (i: number) => { const x = Math.sin(i * 12.9898) * 43758.5453; return x - Math.floor(x) }
const quad = (t: number, a: number[], b: number[], c: number[]) => {
  const u = 1 - t
  return [u * u * a[0] + 2 * u * t * b[0] + t * t * c[0], u * u * a[1] + 2 * u * t * b[1] + t * t * c[1]]
}

/* ───────────── Giant wheel ───────────── */

export function GiantWheel({ className }: { className?: string }) {
  const reduce = useReducedMotion()
  const time = useTime()
  const { scrollY } = useScroll()
  const rot = useTransform(() => (reduce ? 0 : time.get() * 0.009 + scrollY.get() * 0.06))
  const cx = 200, cy = 195, R = 150
  const bulbs = Array.from({ length: 32 }, (_, i) => (i / 32) * Math.PI * 2)
  const palette = [C.marigold, C.cream, C.rani, C.cream]

  return (
    <svg className={className} viewBox="0 0 400 470" role="img" aria-label="A giant wheel turning">
      <g stroke={C.cream} strokeWidth={9} strokeLinecap="round" opacity={0.92}>
        <line x1={cx} y1={cy} x2={108} y2={452} />
        <line x1={cx} y1={cy} x2={292} y2={452} />
        <line x1={140} y1={365} x2={260} y2={365} strokeWidth={5} />
      </g>
      <rect x={66} y={448} width={268} height={14} rx={7} fill={C.marigold} />

      <motion.g style={{ rotate: rot }}>
        <circle cx={cx} cy={cy} r={R} fill="none" stroke={C.marigold} strokeWidth={8} />
        <circle cx={cx} cy={cy} r={112} fill="none" stroke={C.rani} strokeWidth={3} strokeDasharray="4 10" />
        {Array.from({ length: 16 }, (_, i) => {
          const a = (i / 16) * Math.PI * 2
          return <line key={i} x1={cx} y1={cy} x2={cx + R * Math.cos(a)} y2={cy + R * Math.sin(a)} stroke={C.marigold} strokeWidth={2.5} opacity={0.75} />
        })}
        {bulbs.map((a, i) => (
          <motion.circle
            key={i}
            cx={cx + R * Math.cos(a)} cy={cy + R * Math.sin(a)} r={4.5}
            fill={palette[i % 4]}
            animate={reduce ? undefined : { opacity: [1, 0.25, 1] }}
            transition={{ duration: 1.6 + rnd(i) * 1.6, repeat: Infinity, delay: rnd(i + 9) * 2 }}
          />
        ))}
        <circle cx={cx} cy={cy} r={22} fill={C.rani} />
        <circle cx={cx} cy={cy} r={9} fill={C.marigold} />
      </motion.g>

      {Array.from({ length: 8 }, (_, i) => (
        <Cabin key={i} i={i} rot={rot} cx={cx} cy={cy} R={R} color={[C.rani, C.marigold, C.peacock, C.sindoor][i % 4]} />
      ))}
    </svg>
  )
}

function Cabin({ i, rot, cx, cy, R, color }: { i: number; rot: MotionValue<number>; cx: number; cy: number; R: number; color: string }) {
  const time = useTime()
  const reduce = useReducedMotion()
  const a = () => ((rot.get() + i * 45) * Math.PI) / 180
  const x = useTransform(() => cx + R * Math.cos(a()))
  const y = useTransform(() => cy + R * Math.sin(a()))
  const swing = useTransform(() => (reduce ? 0 : Math.sin(time.get() / 650 + i) * 5))
  return (
    <motion.g style={{ x, y }}>
      <motion.g style={{ rotate: swing, originX: 0.5, originY: 0 }}>
        <line x1={0} y1={0} x2={0} y2={11} stroke={C.cream} strokeWidth={2} />
        <path d="M-19 15 Q0 2 19 15 Z" fill={color} />
        <rect x={-16} y={13} width={32} height={25} rx={7} fill={color} />
        <rect x={-11} y={17} width={22} height={10} rx={3} fill={C.ink} opacity={0.5} />
      </motion.g>
    </motion.g>
  )
}

/* ───────────── String lights ───────────── */

export function StringLights({ className, count = 14 }: { className?: string; count?: number }) {
  const reduce = useReducedMotion()
  const segs = [[[0, 8], [360, 120], [720, 8]], [[720, 8], [1080, 120], [1440, 8]]]
  const colors = [C.marigold, C.rani, C.cream, C.sindoor, C.marigold, '#7ee0c3']
  const bulbs = useMemo(() => segs.flatMap(([a, b, c], s) =>
    Array.from({ length: count }, (_, k) => quad((k + 0.5) / count, a, b, c).concat(s * count + k))), [count])

  return (
    <svg className={className} viewBox="0 0 1440 150" preserveAspectRatio="xMidYMin slice" aria-hidden>
      <path d="M0 8 Q360 120 720 8 Q1080 120 1440 8" fill="none" stroke={C.cream} strokeOpacity={0.3} strokeWidth={1.5} />
      {bulbs.map(([x, y, i]) => {
        const col = colors[i % colors.length]
        return (
          <g key={i} transform={`translate(${x} ${y})`}>
            <rect x={-3} y={0} width={6} height={7} rx={1.5} fill={C.cream} opacity={0.5} />
            <motion.g
              animate={reduce ? undefined : { opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.8 + rnd(i) * 2.4, repeat: Infinity, delay: rnd(i + 3) * 3 }}
            >
              <circle cy={15} r={16} fill={col} opacity={0.18} />
              <ellipse cy={15} rx={6} ry={8} fill={col} />
            </motion.g>
          </g>
        )
      })}
    </svg>
  )
}

/* ───────────── Bunting flags ───────────── */

export function Bunting({ className }: { className?: string }) {
  const reduce = useReducedMotion()
  const colors = [C.marigold, C.rani, C.peacock, C.cream, C.sindoor]
  const segs = [[[0, 0], [360, 70], [720, 6]], [[720, 6], [1080, 70], [1440, 0]]]
  const flags = segs.flatMap(([a, b, c], s) => Array.from({ length: 11 }, (_, k) => quad((k + 0.5) / 11, a, b, c).concat(s * 11 + k)))
  return (
    <svg className={className} viewBox="0 0 1440 140" preserveAspectRatio="xMidYMin slice" aria-hidden>
      <path d="M0 0 Q360 70 720 6 Q1080 70 1440 0" fill="none" stroke={C.cream} strokeOpacity={0.5} strokeWidth={2} />
      {flags.map(([x, y, i]) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <motion.g
            style={{ originX: 0.5, originY: 0 }}
            animate={reduce ? undefined : { rotate: [-5, 5] }}
            transition={{ duration: 1.8 + rnd(i) * 1.2, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut', delay: rnd(i) }}
          >
            <path d="M-22 0 H22 L0 54 Z" fill={colors[i % colors.length]} />
            <path d="M-14 8 H14" stroke={C.ink} strokeOpacity={0.25} strokeWidth={3} />
          </motion.g>
        </g>
      ))}
    </svg>
  )
}

/* ───────────── Kite ───────────── */

export function Kite({ a, b, className }: { a: string; b: string; className?: string }) {
  const reduce = useReducedMotion()
  return (
    <svg className={className} viewBox="0 0 120 230" aria-hidden>
      <path d="M60 0 L110 62 L60 62 Z" fill={a} />
      <path d="M60 0 L10 62 L60 62 Z" fill={b} />
      <path d="M10 62 L60 145 L60 62 Z" fill={a} />
      <path d="M110 62 L60 145 L60 62 Z" fill={b} />
      <path d="M60 0V145M10 62H110" stroke={C.ink} strokeOpacity={0.35} strokeWidth={2} />
      <motion.path
        d="M60 145 C40 165 80 185 60 228"
        animate={reduce ? undefined : { d: ['M60 145 C40 165 80 185 60 228', 'M60 145 C80 165 40 185 60 228'] }}
        transition={{ duration: 1.4, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
        fill="none" stroke={C.cream} strokeWidth={2}
      />
      <path d="M52 170 L60 176 L52 182 Z M68 192 L60 198 L68 204 Z" fill={b} />
    </svg>
  )
}

/* ───────────── Stall awning ───────────── */

export function Awning({ tone, className }: { tone: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 66" preserveAspectRatio="none" aria-hidden>
      {Array.from({ length: 8 }, (_, k) => (
        <path key={k} d={`M${k * 50} 0 h50 v42 a25 22 0 0 1 -50 0 z`} fill={k % 2 ? C.cream : tone} />
      ))}
      <rect width={400} height={8} fill={C.ink} opacity={0.2} />
    </svg>
  )
}

/* ───────────── Stall illustrations (react to parent "hover" variant) ───────────── */

const hoverSpring = { type: 'spring', stiffness: 260, damping: 14 } as const

export function StallArt({ kind }: { kind: string }) {
  const reduce = useReducedMotion()
  const idle = (i: number, amp = 4) => reduce ? {} : {
    animate: { y: [0, -amp, 0] },
    transition: { duration: 2.4 + rnd(i) , repeat: Infinity, ease: 'easeInOut' as const, delay: rnd(i + 2) },
  }

  if (kind === 'games') {
    const cols = [C.rani, C.marigold, C.peacock, C.sindoor, C.cream, C.rani, C.marigold, C.leaf, C.sindoor]
    return (
      <svg viewBox="0 0 260 200" className="stall-art" aria-hidden>
        <rect x={28} y={14} width={204} height={164} rx={16} fill={C.ink} opacity={0.88} />
        <rect x={38} y={24} width={184} height={144} rx={10} fill="none" stroke={C.cream} strokeOpacity={0.25} strokeDasharray="3 6" />
        {cols.map((c, i) => {
          const x = 72 + (i % 3) * 58, y = 52 + Math.floor(i / 3) * 46
          return (
            <motion.g key={i} variants={{ rest: { scale: 1 }, hover: { scale: 1.15, transition: { ...hoverSpring, delay: i * 0.03 } } }}>
              <motion.g {...idle(i, 3)}>
                <path d={`M${x} ${y + 17} l-4 6 h8 z`} fill={c} />
                <ellipse cx={x} cy={y} rx={15} ry={18} fill={c} />
                <ellipse cx={x - 5} cy={y - 7} rx={3.5} ry={5} fill="#fff" opacity={0.55} />
              </motion.g>
            </motion.g>
          )
        })}
        <motion.g variants={{ rest: { x: 40, y: 30, opacity: 0 }, hover: { x: 0, y: 0, opacity: 1, transition: { duration: 0.35 } } }}>
          <path d="M212 170 L178 140" stroke={C.cream} strokeWidth={4} strokeLinecap="round" />
          <path d="M212 170 l12 2 -2 -12 z M216 166 l14 -4 -4 14 z" fill={C.marigold} />
        </motion.g>
      </svg>
    )
  }

  if (kind === 'food') {
    return (
      <svg viewBox="0 0 260 200" className="stall-art" aria-hidden>
        <motion.g variants={{ rest: { rotate: 0 }, hover: { rotate: -10, transition: hoverSpring } }} style={{ originX: 0.5, originY: 1 }}>
          <motion.g {...idle(1, 5)}>
            <path d="M84 196 L64 104 H104 Z" fill={C.cream} />
            <path d="M84 196 L64 104 H104 Z" fill="none" stroke={C.wood} strokeWidth={2} strokeDasharray="2 6" />
            {[[84, 72, 34], [58, 88, 24], [110, 88, 24], [70, 50, 22], [100, 52, 22]].map(([x, y, r], i) => (
              <circle key={i} cx={x} cy={y} r={r} fill={i % 2 ? '#ffb3d6' : C.candy} />
            ))}
            <circle cx={74} cy={58} r={6} fill="#fff" opacity={0.5} />
          </motion.g>
        </motion.g>
        <motion.g variants={{ rest: { rotate: 0 }, hover: { rotate: 10, transition: hoverSpring } }} style={{ originX: 0.5, originY: 1 }}>
          <motion.g {...idle(4, 4)}>
            <rect x={178} y={150} width={9} height={46} rx={3} fill={C.wood} />
            <rect x={160} y={52} width={46} height={104} rx={23} fill="#f5dfae" />
            <path d="M160 82 Q172 96 183 82 T206 84 V108 H160Z" fill="#e9c27a" opacity={0.7} />
            {[[172, 70], [192, 66], [182, 120], [170, 136], [196, 132]].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={3.5} fill={C.leaf} />
            ))}
          </motion.g>
        </motion.g>
        {[[138, 40], [228, 30], [36, 34]].map(([x, y], i) => (
          <motion.path key={i} d={`M${x} ${y - 9} L${x + 2.5} ${y - 2.5} L${x + 9} ${y} L${x + 2.5} ${y + 2.5} L${x} ${y + 9} L${x - 2.5} ${y + 2.5} L${x - 9} ${y} L${x - 2.5} ${y - 2.5}Z`}
            fill={C.cream} variants={{ rest: { scale: 0.6, opacity: 0.5 }, hover: { scale: 1.3, opacity: 1, rotate: 45 } }} />
        ))}
      </svg>
    )
  }

  if (kind === 'shopping') {
    const cols = [C.rani, C.marigold, C.cream, C.sindoor, C.marigold, C.rani, '#7ee0c3']
    return (
      <svg viewBox="0 0 260 200" className="stall-art" aria-hidden>
        <ellipse cx={130} cy={188} rx={56} ry={9} fill={C.ink} opacity={0.4} />
        <rect x={126} y={24} width={8} height={164} rx={4} fill={C.ink} opacity={0.75} />
        <circle cx={130} cy={22} r={9} fill={C.marigold} />
        {cols.map((c, i) => (
          <motion.ellipse key={i} cx={130} cy={58 + i * 17} rx={48} ry={10} fill="none" stroke={c} strokeWidth={7}
            variants={{ rest: { y: 0 }, hover: { y: [0, -14, 0], transition: { duration: 0.5, delay: i * 0.05 } } }} />
        ))}
        <motion.g {...idle(7, 6)}>
          <path d="M210 40 v18" stroke={C.cream} strokeWidth={2} />
          <circle cx={210} cy={64} r={7} fill={C.marigold} />
          <path d="M198 72 Q210 100 222 72 Z" fill={C.marigold} />
          {[0, 1, 2].map((k) => <circle key={k} cx={202 + k * 8} cy={100} r={3} fill={C.rani} />)}
        </motion.g>
      </svg>
    )
  }

  // stage
  return (
    <svg viewBox="0 0 260 200" className="stall-art" aria-hidden>
      <motion.g variants={{ rest: { rotate: 0 }, hover: { rotate: [0, -5, 5, -3, 0], transition: { duration: 0.5 } } }}>
        <rect x={46} y={66} width={128} height={92} rx={12} fill={C.marigold} />
        <polyline points="58,70 74,154 90,70 106,154 122,70 138,154 154,70 170,154" fill="none" stroke={C.ink} strokeOpacity={0.55} strokeWidth={2.5} />
        <ellipse cx={46} cy={112} rx={15} ry={46} fill={C.cream} />
        <ellipse cx={174} cy={112} rx={15} ry={46} fill="#f2d39f" />
        <path d="M60 60 Q110 20 160 60" stroke={C.cream} strokeWidth={3} fill="none" />
      </motion.g>
      {[0, 1, 2].map((k) => (
        <motion.path key={k} d={`M${200 + k * 16} ${84 - k * 10} q${16 + k * 6} ${28 + k * 10} 0 ${56 + k * 20}`}
          fill="none" stroke={C.cream} strokeWidth={4} strokeLinecap="round"
          animate={reduce ? undefined : { opacity: [0.15, 1, 0.15] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: k * 0.2 }} />
      ))}
      <motion.g {...idle(11, 8)}>
        <path d="M30 40 v-22 l16 -4 v22" stroke={C.cream} strokeWidth={3} fill="none" />
        <circle cx={26} cy={40} r={6} fill={C.cream} />
        <circle cx={42} cy={36} r={6} fill={C.cream} />
      </motion.g>
    </svg>
  )
}

/* ───────────── Icons ───────────── */

type IconProps = { size?: number; className?: string }
const icon = (size = 20) => ({ width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true })

export const WhatsAppIcon = ({ size, className }: IconProps) => (
  <svg {...icon(size)} className={className}>
    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    <path d="M9 9.2c0-.6.5-1.2 1-1.2h.4l.9 2-.6.8c.5 1 1.4 1.9 2.5 2.5l.8-.6 2 .9v.4c0 .5-.6 1-1.2 1C11.6 15 9 12.4 9 9.2Z" fill="currentColor" strokeWidth={1} />
  </svg>
)
export const PhoneIcon = ({ size, className }: IconProps) => (
  <svg {...icon(size)} className={className}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)
export const ArrowIcon = ({ size, className }: IconProps) => (
  <svg {...icon(size)} className={className}><path d="M7 17 17 7M7 7h10v10" /></svg>
)
export const InstagramIcon = ({ size, className }: IconProps) => (
  <svg {...icon(size)} className={className}><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".6" fill="currentColor" /></svg>
)
export const Sparkle = ({ size = 22, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
    <path d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z" fill="currentColor" />
  </svg>
)
