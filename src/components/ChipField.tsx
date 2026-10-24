import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import Matter from 'matter-js'

const { Engine, Runner, Bodies, Body, Composite, Constraint, Events } = Matter

/**
 * Area chips as solid blocks: they rain into the box when it scrolls into view,
 * collide, stack and stay inside. Mouse: grab and throw. Touch: tap to toss
 * (touch-drag would hijack page scrolling).
 */
export function ChipField({ items }: { items: string[] }) {
  const field = useRef<HTMLDivElement>(null)
  const chips = useRef<(HTMLSpanElement | null)[]>([])
  const reduce = useReducedMotion()

  useEffect(() => {
    const el = field.current
    if (!el || reduce) return
    let teardown = () => {}
    let width = 0
    let dead = false

    const start = () => {
      teardown()
      const W = el.clientWidth, H = el.clientHeight, T = 400
      width = W
      const engine = Engine.create({ gravity: { x: 0, y: 1.2 } })
      const runner = Runner.create()
      const wall = (x: number, y: number, w: number, h: number) => Bodies.rectangle(x, y, w, h, { isStatic: true })
      // Floor and side walls run high above the box so chips can fall in from the top.
      Composite.add(engine.world, [
        wall(W / 2, H + T / 2, W + T * 2, T),
        wall(-T / 2, H - H * 2, T, H * 4),
        wall(W + T / 2, H - H * 2, T, H * 4),
      ])

      const els = chips.current.filter(Boolean) as HTMLSpanElement[]
      const sizes = els.map((c) => [c.offsetWidth, c.offsetHeight])
      const bodies = els.map((_, i) => {
        const [w, h] = sizes[i]
        const x = w / 2 + 8 + Math.random() * Math.max(0, W - w - 16)
        return Bodies.rectangle(x, -h - i * (h + 18), w, h, {
          chamfer: { radius: h / 2 },
          angle: (Math.random() - 0.5) * 0.6,
          restitution: 0.35, friction: 0.4, frictionAir: 0.012, density: 0.002,
        })
      })
      Composite.add(engine.world, bodies)

      // Close the lid once everyone is inside.
      let lid = false
      Events.on(engine, 'afterUpdate', () => {
        bodies.forEach((b, i) => {
          const [w, h] = sizes[i]
          els[i].style.transform = `translate(${b.position.x - w / 2}px, ${b.position.y - h / 2}px) rotate(${b.angle}rad)`
        })
        if (!lid && bodies.every((b) => b.bounds.min.y > 0)) {
          lid = true
          Composite.add(engine.world, wall(W / 2, -T / 2, W + T * 2, T))
        }
      })

      // Mouse drag via a spring constraint, so throws keep their momentum.
      const local = (e: PointerEvent) => {
        const r = el.getBoundingClientRect()
        return { x: Math.min(W, Math.max(0, e.clientX - r.left)), y: Math.min(H, Math.max(0, e.clientY - r.top)) }
      }
      let grab: Matter.Constraint | null = null
      let grabbed: HTMLElement | null = null
      const move = (e: PointerEvent) => { if (grab) grab.pointA = local(e) }
      const up = () => {
        if (grab) Composite.remove(engine.world, grab)
        grabbed?.classList.remove('grabbing')
        grab = null; grabbed = null
      }
      const downs = els.map((c, i) => {
        const down = (e: PointerEvent) => {
          const b = bodies[i]
          if (e.pointerType !== 'mouse') {
            Body.setVelocity(b, { x: (Math.random() - 0.5) * 10, y: -16 })
            Body.setAngularVelocity(b, (Math.random() - 0.5) * 0.35)
            return
          }
          e.preventDefault()
          const p = local(e)
          grab = Constraint.create({
            pointA: p, bodyB: b, pointB: { x: p.x - b.position.x, y: p.y - b.position.y },
            stiffness: 0.12, damping: 0.08, length: 0,
          })
          Composite.add(engine.world, grab)
          grabbed = c
          c.classList.add('grabbing')
        }
        c.addEventListener('pointerdown', down)
        return down
      })
      window.addEventListener('pointermove', move)
      window.addEventListener('pointerup', up)

      // Only simulate while the box is on screen.
      let running = false
      const io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && !running) { Runner.run(runner, engine); running = true }
        else if (!entry.isIntersecting && running) { Runner.stop(runner); running = false }
      }, { threshold: 0.2 })
      io.observe(el)

      teardown = () => {
        io.disconnect()
        Runner.stop(runner)
        Events.off(engine, 'afterUpdate')
        Engine.clear(engine)
        els.forEach((c, i) => c.removeEventListener('pointerdown', downs[i]))
        window.removeEventListener('pointermove', move)
        window.removeEventListener('pointerup', up)
      }
    }

    let timer = 0
    const ro = new ResizeObserver(() => {
      if (Math.abs(el.clientWidth - width) < 40) return
      clearTimeout(timer)
      timer = window.setTimeout(start, 150)
    })
    document.fonts.ready.then(() => { if (dead) return; start(); ro.observe(el) })

    return () => { dead = true; clearTimeout(timer); ro.disconnect(); teardown() }
  }, [reduce, items])

  return (
    <div className={`field${reduce ? '' : ' physics'}`} ref={field}>
      <span className="field-hint"><span className="hint-mouse">Grab one and throw it</span><span className="hint-touch">Tap one to toss it</span></span>
      {items.map((a, i) => (
        <span key={a} ref={(n) => { chips.current[i] = n }} className={`area-chip chip-${i % 4}`}>{a}</span>
      ))}
    </div>
  )
}
