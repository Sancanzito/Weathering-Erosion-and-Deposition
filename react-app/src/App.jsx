import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar.jsx'
import PhysicalDetail from './components/PhysicalDetail.jsx'
import ChemicalDetail from './components/ChemicalDetail.jsx'
import RockLab from './components/RockLab.jsx'
import WeatherImage from './components/WeatherImage.jsx'
import PptxSection from './components/PptxSection.jsx'
import PageSpy from './components/PageSpy.jsx'
import ErosionDetail from './components/ErosionDetail.jsx'
import Questions from './components/Questions.jsx'
import landslideImg from './assets/images/landslide.jpg'

// Scrollspy chip lists per page (ids must exist in that view)
const MAIN_SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'presentation', label: 'Presentation' },
  { id: 'parts', label: 'Parts' },
]
const CHEM_SECTIONS = [
  { id: 'chem-intro', label: 'Overview' },
  { id: 'chem-compare', label: 'Compare' },
  { id: 'chemical-oxidation', label: 'Oxidation' },
  { id: 'chemical-carbonation', label: 'Carbonation' },
  { id: 'chemical-dissolution', label: 'Dissolution' },
  { id: 'chemical-hydrolysis', label: 'Hydrolysis' },
  { id: 'chemical-hydration', label: 'Hydration' },
  { id: 'knowledge-check', label: 'Check' },
]
const PHYS_SECTIONS = [
  { id: 'phys-intro', label: 'Overview' },
  { id: 'physical-frost', label: 'Frost' },
  { id: 'physical-root', label: 'Roots' },
  { id: 'physical-abrasion', label: 'Abrasion' },
  { id: 'physical-thermal', label: 'Thermal' },
  { id: 'knowledge-check', label: 'Check' },
]
const EROSION_SECTIONS = [
  { id: 'erosion-intro', label: 'Overview' },
  { id: 'erosion', label: 'Erosion' },
  { id: 'deposition', label: 'Deposition' },
  { id: 'erosion-video', label: 'Video' },
  { id: 'knowledge-check', label: 'Check' },
]

export default function App() {
  // Homepage IS the simulation — land straight in it
  const [active, setActive] = useState('simulation')
  // Navbar words appear only after the whole lab is finished…
  const [labDone, setLabDone] = useState(false)
  // …or when the teacher enters the unlock password (123), which opens everything
  const [unlocked, setUnlocked] = useState(false)
  const [labKey, setLabKey] = useState(0) // bump to remount RockLab from scratch

  // Navigation and Reset handlers
  const navigate = (page) => {
    setActive(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const reset = () => {
    setActive('simulation')
    setLabDone(false)
    setUnlocked(false) // full reset also re-locks the pages
    setLabKey((prev) => prev + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Teacher password (123) — opens every page without finishing the lab
  const unlock = () => {
    setUnlocked(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#3E2723]">
      <Navbar
        active={active}
        onNavigate={navigate}
        onReset={reset}
        onUnlock={unlock}
        locked={!labDone && !unlocked}
      />

      <AnimatePresence mode="wait">
        <motion.main
          key={active}
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -56 }}
          transition={{ type: 'spring', stiffness: 260, damping: 26, mass: 0.75 }}
        >
          {active === 'simulation' && (
            <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
              <RockLab key={labKey} onProgress={(cleared) => setLabDone(cleared.length >= 4)} />
              {!labDone && !unlocked && (
                <p className="mt-4 rounded-xl bg-[#EFEBE9] px-4 py-3 text-sm font-semibold text-[#5D4037]">
                  🔒 Clear all {4} stages to unlock the Main page, Types of
                  Weathering, Erosion & Deposition and Questions above.
                </p>
              )}
              {(labDone || unlocked) && (
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={() => navigate('main')}
                  className="btn-anim rounded-full border border-[#8D6E63]/40 px-5 py-2.5 text-sm font-bold text-[#5D4037] hover:bg-[#EFEBE9]"
                >
                  Go to overview →
                </button>
                <button
                  onClick={() => navigate('chemical')}
                  className="btn-anim rounded-full border border-[#8D6E63]/40 px-5 py-2.5 text-sm font-bold text-[#5D4037] hover:bg-[#EFEBE9]"
                >
                  Part 1 Chemical
                </button>
                <button
                  onClick={() => navigate('physical')}
                  className="btn-anim rounded-full border border-[#8D6E63]/40 px-5 py-2.5 text-sm font-bold text-[#5D4037] hover:bg-[#EFEBE9]"
                >
                  Part 2 Physical
                </button>
                <button
                  onClick={() => navigate('erosion')}
                  className="btn-anim rounded-full border border-[#8D6E63]/40 px-5 py-2.5 text-sm font-bold text-[#5D4037] hover:bg-[#EFEBE9]"
                >
                  🌊 Erosion & Deposition
                </button>
              </div>
              )}
            </section>
          )}

          {active === 'main' && (
            <>
              <PageSpy sections={MAIN_SECTIONS} />
              {/* MAIN HERO — part 1 */}
              <section id="overview" className="mx-auto max-w-6xl px-4 pb-6 pt-10 sm:px-6">
                <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#3E2723] via-[#6D4C41] to-[#BCAAA4] p-8 text-[#FFF8F0] shadow-xl sm:p-12">
                  <div className="grid items-center gap-8 md:grid-cols-[1.15fr_0.85fr]">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#D7CCC8]">
                        Earth Science • Weathering
                      </p>
                      <h1 className="mt-2 max-w-2xl text-4xl font-black leading-tight sm:text-5xl">
                        Rocks break down. Earth builds up.
                      </h1>
                      <p className="mt-3 max-w-2xl text-[#EFEBE9]/90">
                        Start with the hands-on simulation, then dig into each
                        part separately. Use Reset anytime to jump back to the lab.
                      </p>
                      <div className="mt-6 flex flex-wrap gap-3">
                        <button
                          onClick={() => navigate('simulation')}
                          className="btn-anim rounded-full bg-[#EFEBE9] px-6 py-3 text-sm font-black text-[#4E342E] hover:bg-white"
                        >
                          🪨 Enter Simulation →
                        </button>
                        <button
                          onClick={() => navigate('chemical')}
                          className="btn-anim rounded-full border border-[#EFEBE9]/60 px-5 py-2.5 text-sm font-bold text-[#FFF8F0] hover:bg-white/10"
                        >
                          🧪 Part 1: Chemical
                        </button>
                        <button
                          onClick={() => navigate('physical')}
                          className="btn-anim rounded-full border border-[#EFEBE9]/60 px-5 py-2.5 text-sm font-bold text-[#FFF8F0] hover:bg-white/10"
                        >
                          🪨 Part 2: Physical
                        </button>
                        <button
                          onClick={() => navigate('erosion')}
                          className="btn-anim rounded-full border border-[#EFEBE9]/60 px-5 py-2.5 text-sm font-bold text-[#FFF8F0] hover:bg-white/10"
                        >
                          🌊 Erosion & Deposition
                        </button>
                        <button
                          onClick={() => navigate('questions')}
                          className="btn-anim rounded-full border border-[#EFEBE9]/60 px-5 py-2.5 text-sm font-bold text-[#FFF8F0] hover:bg-white/10"
                        >
                          ❓ Questions
                        </button>
                      </div>
                    </div>
                    <WeatherImage
                      src={landslideImg}
                      alt="Landslide — weathered slope giving way"
                      caption="Why it matters: weakened, weathered slopes can give way as landslides."
                    />
                  </div>
                </div>
              </section>

              {/* PPT — one click opens the presentation in Canva */}
              <PptxSection />

              {/* PART PICKER */}
              <section id="parts" className="mx-auto grid max-w-6xl gap-4 px-4 pb-10 sm:px-6 md:grid-cols-2">
                <button
                  onClick={() => navigate('chemical')}
                  className="btn-anim rounded-3xl border border-[#D7CCC8] bg-gradient-to-b from-[#FFF8F0] to-[#EFEBE9] p-6 text-left shadow-sm hover:shadow-md"
                >
                  <span className="text-3xl">🧪</span>
                  <h2 className="mt-2 text-xl font-extrabold">Part 1 — Chemical Weathering</h2>
                  <p className="mt-1 text-sm text-[#6D4C41]">
                    5 processes that change rock composition.
                  </p>
                  <span className="mt-3 inline-block rounded-full bg-[#5D4037] px-4 py-1.5 text-xs font-bold text-white">
                    Open part →
                  </span>
                </button>

                <button
                  onClick={() => navigate('physical')}
                  className="btn-anim rounded-3xl border border-[#D7CCC8] bg-gradient-to-b from-[#FFF8F0] to-[#EFEBE9] p-6 text-left shadow-sm hover:shadow-md"
                >
                  <span className="text-3xl">🪨</span>
                  <h2 className="mt-2 text-xl font-extrabold">Part 2 — Physical Weathering</h2>
                  <p className="mt-1 text-sm text-[#6D4C41]">
                    4 processes that crack rock without changing it.
                  </p>
                  <span className="mt-3 inline-block rounded-full bg-[#8D6E63] px-4 py-1.5 text-xs font-bold text-white">
                    Open part →
                  </span>
                </button>
              </section>
            </>
          )}

          {active === 'chemical' && (
            <>
              <PageSpy sections={CHEM_SECTIONS} />
              <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
                <button
                  onClick={() => navigate('main')}
                  className="btn-anim mb-4 rounded-full border border-[#8D6E63]/40 px-4 py-1.5 text-xs font-bold text-[#5D4037] hover:bg-[#EFEBE9]"
                >
                  ← Back to Main
                </button>
                <div id="chem-intro" className="rounded-3xl bg-[#3E2723] p-7 text-[#EFEBE9] sm:p-9">
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#BCAAA4]">
                    Part 1 • Types of Weathering (Chemical)
                  </p>
                  <h2 className="mt-1 text-3xl font-black">Chemical Weathering</h2>
                  <p className="mt-2 max-w-[65ch] text-sm leading-relaxed text-[#EFEBE9]/85">
                    Decomposition — water, oxygen and acids change rock into new
                    substances. The 5 key processes below.
                  </p>
                  <ChemicalDetail />
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      onClick={() => navigate('physical')}
                      className="btn-anim rounded-full bg-[#EFEBE9] px-5 py-2.5 text-sm font-extrabold text-[#4E342E] hover:bg-white"
                    >
                      Next: Part 2 Physical →
                    </button>
                    <button
                      onClick={() => navigate('questions')}
                      className="btn-anim rounded-full border border-[#EFEBE9]/50 px-5 py-2.5 text-sm font-bold text-[#EFEBE9] hover:bg-white/10"
                    >
                      Go to Questions
                    </button>
                  </div>
                </div>
              </section>
            </>
          )}

          {active === 'physical' && (
            <>
              <PageSpy sections={PHYS_SECTIONS} />
              <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
                <button
                  onClick={() => navigate('main')}
                  className="btn-anim mb-4 rounded-full border border-[#8D6E63]/40 px-4 py-1.5 text-xs font-bold text-[#5D4037] hover:bg-[#EFEBE9]"
                >
                  ← Back to Main
                </button>
                <div id="phys-intro" className="rounded-3xl border-2 border-[#8D6E63]/40 bg-[#EFEBE9] p-7 sm:p-9">
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#8D6E63]">
                    Part 2 • Types of Weathering (Physical)
                  </p>
                  <h2 className="mt-1 text-3xl font-black text-[#4E342E]">
                    Physical Weathering
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-[#5D4037]">
                    Disintegration — freeze-thaw, roots, abrasion & temperature
                    swings that crack rock without changing what it's made of.
                  </p>
                  <PhysicalDetail />
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      onClick={() => navigate('chemical')}
                      className="btn-anim rounded-full bg-[#4E342E] px-5 py-2.5 text-sm font-extrabold text-white hover:bg-[#5D4037]"
                    >
                      ← Back: Part 1 Chemical
                    </button>
                    <button
                      onClick={() => navigate('erosion')}
                      className="btn-anim rounded-full border border-[#8D6E63]/40 px-5 py-2.5 text-sm font-bold text-[#5D4037] hover:bg-[#EFEBE9]"
                    >
                      🌊 Erosion & Deposition
                    </button>
                  </div>
                </div>
              </section>
            </>
          )}

          {active === 'erosion' && (
            <>
              <PageSpy sections={EROSION_SECTIONS} />
              <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
                <button
                  onClick={() => navigate('main')}
                  className="btn-anim mb-4 rounded-full border border-[#8D6E63]/40 px-4 py-1.5 text-xs font-bold text-[#5D4037] hover:bg-[#EFEBE9]"
                >
                  ← Back to Main
                </button>
                <ErosionDetail />
              </section>
            </>
          )}

          {active === 'questions' && (
            <Questions onBack={() => navigate('main')} onReset={reset} />
          )}
        </motion.main>
      </AnimatePresence>

      <footer className="border-t border-[#D7CCC8] py-6 text-center text-xs text-[#8D6E63]">
        🌍 EarthScience Weathering Lab • brown → light brown earthy theme
      </footer>
    </div>
  )
}