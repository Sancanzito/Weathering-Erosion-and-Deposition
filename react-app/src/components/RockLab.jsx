import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import StageFrost from './rocklab/StageFrost.jsx'
import StageLimestone from './rocklab/StageLimestone.jsx'
import StageOxidation from './rocklab/StageOxidation.jsx'
import StageFinal from './rocklab/StageFinal.jsx'
import PageSpy from './PageSpy.jsx'
import SoundToggle from './SoundToggle.jsx'
import { sfx } from '../lib/sounds.js'

// Stage 4 Field Cases removed — it will live as a quiz later.
const STAGES = [
  { id: 1, tab: '1 · Frost', title: 'Stage 1 · Frost Wedging' },
  { id: 2, tab: '2 · Limestone', title: 'Stage 2 · Dissolving Limestone' },
  { id: 3, tab: '3 · Rust', title: 'Stage 3 · Rusting Rock' },
  { id: 4, tab: '4 · Final Word', title: 'Stage 4 · 4 Pics, 1 Word' },
]

// Scrollspy chips inside the lab — change with the active stage
const SIM_SECTIONS = [
  { id: 'lab-top', label: 'Lab intro' },
  { id: 'stage-scenario', label: 'Scenario' },
  { id: 'stage-predict', label: 'Predict' },
  { id: 'stage-live', label: 'Live view' },
  { id: 'stage-controls', label: 'Controls' },
  { id: 'stage-run', label: 'Run & check' },
]
const FINAL_SECTIONS = [
  { id: 'lab-top', label: 'Lab intro' },
  { id: 'stage-puzzle', label: '4 Pictures' },
  { id: 'stage-letters', label: 'Letters' },
]

export default function RockLab({ onProgress }) {
  const [unlocked, setUnlocked] = useState(1)
  const [cur, setCur] = useState(1)
  const [passed, setPassed] = useState([])
  const labRef = useRef(null)

  const markPassed = (id) => {
    setPassed((prev) => {
      if (prev.includes(id)) return prev
      const next = [...prev, id]
      onProgress?.(next)
      return next
    })
  }

  const unlock = (n) => setUnlocked((u) => Math.max(u, n))

  const handleUnlock = (next) => () => {
    unlock(next)
  }

  // After a knowledge check: jump to the next stage and bring the lab
  // back to the top of the screen so the new simulation starts in view.
  const handleAdvance = (next) => () => {
    unlock(next)
    setCur(next)
    requestAnimationFrame(() => {
      labRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  return (
    <div>
      {/* Mounted exactly once for the whole lab — the chips swap with the
          stage, but the bar itself never re-renders or duplicates */}
      <PageSpy sections={cur === 4 ? FINAL_SECTIONS : SIM_SECTIONS} contained />
      <div id="lab-top" className="relative rounded-3xl bg-gradient-to-br from-[#2B1D16] via-[#5D4037] to-[#8D6E63] p-7 text-[#FFF8F0] sm:p-9">
        <SoundToggle />
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#D7CCC8]">
          Start of the game • Rock Lab
        </p>
        <h2 className="mt-1 text-3xl font-black">🪨 Rock Lab</h2>
        <p className="mt-2 max-w-[65ch] text-sm text-[#EFEBE9]/90">
          Finish all {STAGES.length} stages to unlock the rest of the site —
          Main, Types of Weathering and Questions appear after the lab.
          Each simulation has a Continue check.
        </p>
        <p className="mt-2 text-xs font-bold text-[#D7CCC8]">
          Progress: {passed.length} / {STAGES.length} cleared
          {passed.length >= STAGES.length ? ' — Lab complete! 🎉' : ''}
        </p>
      </div>

      <div ref={labRef} className="mt-4 flex scroll-mt-[136px] flex-wrap gap-2">
        {STAGES.map((s) => {
          const locked = s.id > unlocked
          const done = passed.includes(s.id)
          return (
            <button
              key={s.id}
              disabled={locked}
              onClick={() => { sfx.click(); setCur(s.id) }}
              className={`btn-anim min-w-[110px] flex-1 rounded-xl border px-3 py-2 text-xs font-bold transition ${
                cur === s.id
                  ? 'border-[#4E342E] bg-[#4E342E] text-white shadow'
                  : locked
                    ? 'cursor-not-allowed border-[#D7CCC8] bg-white/60 text-[#8D6E63] opacity-60'
                    : 'border-[#D7CCC8] bg-white text-[#4E342E] hover:border-[#8D6E63]'
              }`}
            >
              {locked ? '🔒 ' : done ? '✅ ' : ''}{s.tab}
            </button>
          )
        })}
      </div>

      <motion.div
        key={cur}
        initial={{ opacity: 0, y: 72 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26, mass: 0.75 }}
        className="mt-4 rounded-3xl border border-[#D7CCC8] bg-white p-5 shadow-sm sm:p-7"
      >
        <h3 className="text-xl font-extrabold text-[#3E2723]">
          {STAGES.find((s)=>s.id===cur).title}
        </h3>
        <div className="mt-3">
          {cur === 1 && (
            <StageFrost
              onUnlock={handleUnlock(2)}
              onPassed={() => markPassed(1)}
              onAdvance={handleAdvance(2)}
            />
          )}
          {cur === 2 && (
            <StageLimestone
              onUnlock={handleUnlock(3)}
              onPassed={() => markPassed(2)}
              onAdvance={handleAdvance(3)}
            />
          )}
          {cur === 3 && (
            <StageOxidation
              onUnlock={handleUnlock(4)}
              onPassed={() => markPassed(3)}
              onAdvance={handleAdvance(4)}
            />
          )}
          {cur === 4 && <StageFinal onSolved={() => markPassed(4)} />}
        </div>
      </motion.div>
    </div>
  )
}
