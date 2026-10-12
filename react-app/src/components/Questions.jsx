import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import prosAndCons from '../assets/images/pros-and-cons.jpg'
import { sfx } from '../lib/sounds.js'

const TITLE = 'PROS & CONS'

export default function Questions({ onBack }) {
  const [showImage, setShowImage] = useState(false)
  const cardRef = useRef(null)
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const rotateX = useSpring(useTransform(my, [0, 1], [9, -9]), { stiffness: 160, damping: 16 })
  const rotateY = useSpring(useTransform(mx, [0, 1], [-11, 11]), { stiffness: 160, damping: 16 })

  useEffect(() => {
    if (!showImage) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setShowImage(false)
        sfx.click()
      }
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [showImage])

  const track = (e) => {
    const r = cardRef.current?.getBoundingClientRect()
    if (!r) return
    mx.set((e.clientX - r.left) / r.width)
    my.set((e.clientY - r.top) / r.height)
  }
  const center = () => {
    mx.set(0.5)
    my.set(0.5)
  }

  const close = () => {
    sfx.pop()
    setShowImage(false)
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <button
        onClick={onBack}
        className="btn-anim mb-4 rounded-full border border-[#8D6E63]/40 px-4 py-1.5 text-xs font-bold text-[#5D4037] hover:bg-[#EFEBE9]"
      >
        ← Back to Main
      </button>

      <div className="rounded-3xl bg-gradient-to-br from-[#5D4037] to-[#A1887F] p-7 text-white sm:p-9">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#EFEBE9]/80">
          Check yourself
        </p>
        <h2 className="mt-1 text-3xl font-black">Questions</h2>
        <p className="mt-4 rounded-2xl bg-black/20 p-4 text-sm leading-relaxed">
          Considering that weathering destroys steel and concrete buildings,
          erosion erodes soil and often covers infrastructure while deposition
          disperses water in an area. Are these geological processes still
          beneficial to us humans? Defend your answer using examples.
        </p>

        {/* Hidden-page launcher: floats, tilts toward the cursor, letters wave on hover */}
        <motion.div
          ref={cardRef}
          onMouseMove={track}
          onMouseLeave={center}
          animate={{ y: [0, -16, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ rotateX, rotateY, transformPerspective: 900 }}
          className="mt-6 rounded-[28px] border-2 border-[#FFD54F]/50 bg-gradient-to-br from-[#2B1D16]/85 via-[#4E342E]/85 to-[#1B0F0A]/90 p-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] sm:p-8"
        >
          <button
            onClick={() => {
              sfx.click()
              setShowImage(true)
            }}
            aria-label="Open the hidden Pros and Cons page"
            className="group block w-full cursor-pointer text-center focus:outline-none"
          >
            <span className="block bg-gradient-to-r from-[#FFD54F] via-[#FF8A65] to-[#4FC3F7] bg-clip-text text-[clamp(44px,9vw,100px)] font-black uppercase leading-none tracking-tight text-transparent drop-shadow-[0_0_28px_rgba(255,180,80,0.55)] transition-all duration-500 group-hover:drop-shadow-[0_0_40px_rgba(255,180,80,0.9)]">
              {TITLE.split('').map((ch, i) => (
                <span
                  key={i}
                  className="inline-block transition-transform duration-500 ease-out group-hover:-translate-y-5 group-hover:rotate-3"
                  style={{ transitionDelay: `${i * 45}ms` }}
                >
                  {ch === ' ' ? '\u00A0' : ch}
                </span>
              ))}
            </span>
            <span className="mt-3 block text-sm font-bold uppercase tracking-[0.3em] text-[#D7CCC8] transition-colors duration-300 group-hover:text-[#FFD54F] sm:text-base">
              ✦ Tap to reveal the hidden page ✦
            </span>
          </button>
        </motion.div>
      </div>

      {/* Hidden page: full-screen viewer */}
      <AnimatePresence>
        {showImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={close}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.85, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 210, damping: 24 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-5xl rounded-3xl border-4 border-[#FFD54F]/40 bg-[#1B0F0A] p-4 shadow-[0_0_80px_rgba(255,180,80,0.25)] sm:p-6"
            >
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h3 className="bg-gradient-to-r from-[#FFD54F] via-[#FF8A65] to-[#4FC3F7] bg-clip-text text-2xl font-black text-transparent drop-shadow-[0_0_18px_rgba(255,180,80,0.5)] sm:text-4xl">
                  🌟 Weathering: Pros &amp; Cons
                </h3>
                <button
                  onClick={close}
                  className="btn-anim rounded-full bg-[#EFEBE9] px-5 py-2 text-sm font-extrabold text-[#4E342E] hover:bg-white"
                >
                  ✕ Close (Esc)
                </button>
              </div>
              <img
                src={prosAndCons}
                alt="Pros and cons of weathering, erosion and deposition for humans"
                className="mx-auto max-h-[72vh] w-auto rounded-2xl shadow-2xl"
              />
              <p className="mt-3 text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#D7CCC8]">
                Use this chart to defend your answer above
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
