import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { sfx } from '../lib/sounds.js'

const weatheringChildren = [
  {
    id: 'chemical',
    label: 'Chemical',
    hint: 'Dissolving & rusting',
    icon: '🧪',
  },
  {
    id: 'physical',
    label: 'Physical',
    hint: 'Cracking & breaking',
    icon: '🪨',
  },
]

export default function Navbar({ active, onNavigate, onReset, onUnlock, locked }) {
  const [dropOpen, setDropOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [pwdOpen, setPwdOpen] = useState(false)
  const [pwdVal, setPwdVal] = useState('')
  const [pwdErr, setPwdErr] = useState('')

  const go = (id) => {
    sfx.click()
    onNavigate?.(id)
    setDropOpen(false)
    setMobileOpen(false)
  }

  // Reset (000) and Unlock (123) are password-protected so nobody loses
  // progress by a stray click — the teacher can unlock every page with 123
  const handleReset = () => {
    sfx.click()
    setDropOpen(false)
    setMobileOpen(false)
    setPwdVal('')
    setPwdErr('')
    setPwdOpen(true)
  }

  const confirmReset = () => {
    const v = pwdVal.trim()
    if (v === '000') {
      setPwdOpen(false)
      sfx.unlock()
      onReset?.()
    } else if (v === '123') {
      setPwdOpen(false)
      sfx.unlock()
      onUnlock?.()
    } else {
      sfx.wrong()
      setPwdErr('Wrong password — nothing changed.')
      setPwdVal('')
    }
  }

  const isWeatheringActive = active === 'chemical' || active === 'physical'

  const linkBase =
    'btn-anim relative rounded-full px-3.5 py-2 text-[13px] font-semibold tracking-wide lg:px-4 lg:text-sm'

  return (
    <motion.header
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 18 }}
      className="sticky top-0 z-50 shadow-lg shadow-[#3E2723]/30"
    >
      {/* brown -> light brown gradient */}
      <nav className="bg-gradient-to-r from-[#2B1D16] via-[#5D4037] to-[#A1887F]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          {/* Brand — homepage goes straight to Simulation */}
          <button
            onClick={() => go('simulation')}
            className="flex items-center gap-2.5 text-left"
          >
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#EFEBE9] text-xl shadow-inner">
              🌍
            </span>
            <span className="leading-tight">
              <span className="block text-[15px] font-extrabold tracking-wide text-[#FFF8F0]">
                EarthScience
              </span>
              <span className="block text-[11px] font-medium uppercase tracking-[0.2em] text-[#D7CCC8]">
                Weathering Lab
              </span>
            </span>
          </button>

          {/* Desktop links — Simulation first */}
          <div className="hidden items-center gap-1 lg:flex">
            <button
              onClick={() => go('simulation')}
              className={`${linkBase} ${
                active === 'simulation'
                  ? 'bg-[#EFEBE9] font-extrabold text-[#4E342E]'
                  : 'bg-white/10 text-[#FFF8F0] hover:bg-white/20'
              }`}
            >
              🪨 Simulation
              {active === 'simulation' && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-[#4E342E]"
                />
              )}
            </button>
            {!locked && (
            <button
              onClick={() => go('main')}
              className={`${linkBase} ${
                active === 'main'
                  ? 'bg-[#EFEBE9]/20 text-white'
                  : 'text-[#EFEBE9]/85 hover:bg-white/10 hover:text-white'
              }`}
            >
              Main
              {active === 'main' && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-[#EFEBE9]"
                />
              )}
            </button>
            )}

            {/* Types of Weathering (Chemical, Physical) — hidden until lab complete */}
            {!locked && (
            <div
              className="relative"
              onMouseEnter={() => setDropOpen(true)}
              onMouseLeave={() => setDropOpen(false)}
            >
              <button
                onClick={() => setDropOpen((v) => !v)}
                aria-expanded={dropOpen}
                className={`${linkBase} flex items-center gap-1.5 ${
                  isWeatheringActive
                    ? 'bg-[#EFEBE9]/20 text-white'
                    : 'text-[#EFEBE9]/85 hover:bg-white/10 hover:text-white'
                }`}
              >
                Types of Weathering
                <motion.span
                  animate={{ rotate: dropOpen ? 180 : 0 }}
                  className="inline-block text-xs"
                >
                  ▾
                </motion.span>
                {isWeatheringActive && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-[#EFEBE9]"
                  />
                )}
              </button>

              <AnimatePresence>
                {dropOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.16 }}
                    className="absolute left-1/2 top-full mt-2 w-72 -translate-x-1/2 overflow-hidden rounded-2xl border border-[#D7CCC8]/60 bg-[#FFF8F0] p-2 shadow-xl shadow-[#3E2723]/30"
                  >
                    <p className="px-3 pb-1 pt-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#8D6E63]">
                      Break down
                    </p>
                    {weatheringChildren.map((child, i) => (
                      <motion.button
                        key={child.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => go(child.id)}
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                          active === child.id
                            ? 'bg-gradient-to-r from-[#5D4037] to-[#8D6E63] text-white'
                            : 'text-[#4E342E] hover:bg-[#EFEBE9]'
                        }`}
                      >
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#EFEBE9] text-lg">
                          {child.icon}
                        </span>
                        <span>
                          <span className="block text-sm font-bold">
                            {child.label} Weathering
                          </span>
                          <span
                            className={`block text-xs ${
                              active === child.id
                                ? 'text-white/80'
                                : 'text-[#8D6E63]'
                            }`}
                          >
                            {child.hint}
                          </span>
                        </span>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            )}

            {/* Erosion & Deposition — its own page */}
            {!locked && (
            <button
              onClick={() => go('erosion')}
              className={`${linkBase} ${
                active === 'erosion'
                  ? 'bg-[#EFEBE9]/20 text-white'
                  : 'text-[#EFEBE9]/85 hover:bg-white/10 hover:text-white'
              }`}
            >
              Erosion &amp; Deposition
              {active === 'erosion' && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-[#EFEBE9]"
                />
              )}
            </button>
            )}

            {!locked && (
            <button
              onClick={() => go('questions')}
              className={`${linkBase} ${
                active === 'questions'
                  ? 'bg-[#EFEBE9]/20 text-white'
                  : 'text-[#EFEBE9]/85 hover:bg-white/10 hover:text-white'
              }`}
            >
              Questions
              {active === 'questions' && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-[#EFEBE9]"
                />
              )}
            </button>
            )}

            {/* Lock hint while the lab is unfinished */}
            {locked && (
              <span className="ml-1 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold text-[#EFEBE9]">
                🔒 Finish the Rock Lab to unlock
              </span>
            )}

            {/* Reset */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleReset}
              className="ml-2 rounded-full bg-[#EFEBE9] px-5 py-2 text-sm font-extrabold tracking-wide text-[#4E342E] shadow-md shadow-black/20 transition-colors hover:bg-white"
            >
              ⟲ Reset
            </motion.button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-xl text-[#FFF8F0] lg:hidden"
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="overflow-hidden border-t border-white/15 lg:hidden"
            >
              <div className="space-y-1 bg-[#3E2723]/95 px-4 py-3">
                <button
                  onClick={() => go('simulation')}
                  className={`w-full rounded-xl px-4 py-2.5 text-left text-sm font-extrabold ${
                    active === 'simulation'
                      ? 'bg-[#EFEBE9] text-[#4E342E]'
                      : 'bg-white/10 text-[#FFF8F0]'
                  }`}
                >
                  🪨 Simulation
                </button>
                {!locked && (
                <button
                  onClick={() => go('main')}
                  className={`w-full rounded-xl px-4 py-2.5 text-left text-sm font-bold ${
                    active === 'main'
                      ? 'bg-[#EFEBE9] text-[#4E342E]'
                      : 'text-[#EFEBE9] hover:bg-white/10'
                  }`}
                >
                  Main
                </button>
                )}

                {!locked && (
                <>
                <p className="px-4 pb-1 pt-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#BCAAA4]">
                  Types of Weathering (Chemical, Physical)
                </p>
                {weatheringChildren.map((child) => (
                  <button
                    key={child.id}
                    onClick={() => go(child.id)}
                    className={`ml-3 w-[calc(100%-1.5rem)] rounded-xl px-4 py-2.5 text-left text-sm font-semibold ${
                      active === child.id
                        ? 'bg-gradient-to-r from-[#8D6E63] to-[#BCAAA4] text-white'
                        : 'bg-white/5 text-[#EFEBE9] hover:bg-white/10'
                    }`}
                  >
                    {child.icon} {child.label}
                  </button>
                ))}
                </>
                )}

                {!locked && (
                <button
                  onClick={() => go('erosion')}
                  className={`w-full rounded-xl px-4 py-2.5 text-left text-sm font-bold ${
                    active === 'erosion'
                      ? 'bg-[#EFEBE9] text-[#4E342E]'
                      : 'text-[#EFEBE9] hover:bg-white/10'
                  }`}
                >
                  🌊 Erosion &amp; Deposition
                </button>
                )}

                {!locked && (
                <button
                  onClick={() => go('questions')}
                  className={`w-full rounded-xl px-4 py-2.5 text-left text-sm font-bold ${
                    active === 'questions'
                      ? 'bg-[#EFEBE9] text-[#4E342E]'
                      : 'text-[#EFEBE9] hover:bg-white/10'
                  }`}
                >
                  Questions
                </button>
                )}

                {locked && (
                  <p className="rounded-xl bg-white/10 px-4 py-2.5 text-xs font-bold text-[#EFEBE9]">
                    🔒 Finish the Rock Lab to unlock Main, Types of Weathering, Erosion &amp; Deposition &amp; Questions
                  </p>
                )}

                <button
                  onClick={handleReset}
                  className="mt-2 w-full rounded-xl bg-[#EFEBE9] px-4 py-2.5 text-sm font-extrabold text-[#4E342E]"
                >
                  ⟲ Reset
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* light-brown strip */}
      <div className="h-1.5 bg-gradient-to-r from-[#D7CCC8] via-[#EFEBE9] to-[#BCAAA4]" />

      {/* Reset (000) or Unlock (123) — wrong password does nothing */}
      <AnimatePresence>
        {pwdOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] grid place-items-center bg-[#2B1D16]/70 p-4"
            onClick={() => setPwdOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 14 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 14 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-3xl bg-[#FFF8F0] p-6 shadow-2xl"
            >
              <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#8D6E63]">
                ⟲ Reset or 🔓 Unlock
              </p>
              <h4 className="mt-1 text-xl font-black text-[#3E2723]">
                Enter password
              </h4>
              <p className="mt-1 text-sm text-[#6D4C41]">
                <b>000</b> — resets the lab back to the very beginning.
                <br />
                <b>123</b> — unlocks every page without finishing the lab.
              </p>
              <input
                type="password"
                autoFocus
                value={pwdVal}
                onChange={(e) => { setPwdVal(e.target.value); setPwdErr('') }}
                onKeyDown={(e) => { if (e.key === 'Enter') confirmReset() }}
                placeholder="•••"
                className="mt-4 w-full rounded-xl border-2 border-[#D7CCC8] bg-white px-4 py-3 text-center text-lg font-black tracking-[0.4em] text-[#4E342E] outline-none focus:border-[#6D4C41]"
              />
              {pwdErr && (
                <p className="mt-2 text-center text-sm font-bold text-[#B3402F]">
                  {pwdErr}
                </p>
              )}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => { sfx.click(); setPwdOpen(false) }}
                  className="btn-anim flex-1 rounded-full border border-[#8D6E63]/50 px-4 py-2.5 text-sm font-bold text-[#5D4037] hover:bg-[#EFEBE9]"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmReset}
                  className="btn-anim flex-1 rounded-full bg-[#4E342E] px-4 py-2.5 text-sm font-extrabold text-white hover:bg-[#5D4037]"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
