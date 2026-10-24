import { useEffect, useState } from 'react'
import { AnimatePresence, MotionConfig, useReducedMotion } from 'motion/react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Cursor, Intro, Nav, WhatsAppFab } from './components/Chrome'
import { Hero } from './components/Hero'
import { About, Areas, Host, Stalls } from './components/Sections'
import { Events } from './components/Events'
import { Contact, Footer } from './components/Contact'
import { Marquee } from './components/Kinetic'
import { Sparkle } from './components/Art'

gsap.registerPlugin(ScrollTrigger)

const ticker = ['Ring toss', 'Golgappe', 'Tambola', 'Bangles', 'Jalebi', 'Bouncy castle', 'Dhol', 'Mehendi', 'Momos', 'Lucky draw']

export default function App() {
  const reduce = useReducedMotion()
  const [intro, setIntro] = useState(() => !reduce && !sessionStorageGet('seen-intro'))

  useEffect(() => {
    if (!intro) return
    const t = setTimeout(() => { setIntro(false); sessionStorageSet('seen-intro') }, 1700)
    return () => clearTimeout(t)
  }, [intro])

  useEffect(() => {
    if (reduce) return
    // Lenis smooths the real window scroll, so Motion/sticky/IntersectionObserver stay in sync.
    // GSAP's ticker drives it and keeps ScrollTrigger updated. Lower lerp = heavier, more damped glide.
    const lenis = new Lenis({ anchors: true, lerp: 0.06, wheelMultiplier: 0.9 })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => { gsap.ticker.remove(tick); lenis.destroy() }
  }, [reduce])

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>{intro && <Intro key="intro" />}</AnimatePresence>
      <Nav />
      <main>
        <Hero play={!intro} />
        <Marquee className="ticker">
          {ticker.map((t) => <span key={t} className="ticker-item">{t}<Sparkle size={26} /></span>)}
        </Marquee>
        <About />
        <Stalls />
        <Events />
        <Host />
        <Areas />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFab />
      <Cursor />
      <div className="grain" aria-hidden />
    </MotionConfig>
  )
}

// Storage can throw in private mode; the intro just replays then.
function sessionStorageGet(k: string) { try { return sessionStorage.getItem(k) } catch { return null } }
function sessionStorageSet(k: string) { try { sessionStorage.setItem(k, '1') } catch { /* fine */ } }
