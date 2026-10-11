import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { sfx } from '../../lib/sounds.js'

export default function QuizModal({ open, onClose, title, question, options, onPassed, onContinue }) {
  const [picked, setPicked] = useState(null)
  const [done, setDone] = useState(false)

  if (!open) return null

  const correct = options.find((o) => o.correct)

  const pick = (i) => {
    if (done) return
    setPicked(i)
    setDone(true)
    if (options[i].correct) {
      onPassed?.()
      sfx.success()
    } else {
      sfx.wrong()
    }
  }

  const close = () => {
    setPicked(null)
    setDone(false)
    onClose?.()
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={close}
        className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 p-4"
      >
        <motion.div
          initial={{ scale: 0.94, y: 14 }}
          animate={{ scale: 1, y: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md rounded-3xl bg-[#FFF8F0] p-6 shadow-2xl"
        >
          <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#8D6E63]">
            {title}
          </p>
          <h3 className="mt-1 text-lg font-extrabold text-[#3E2723]">{question}</h3>

          <div className="mt-3 space-y-2">
            {options.map((o, i) => {
              const isPicked = picked === i
              const showRight = done && o.correct
              const showWrong = done && isPicked && !o.correct
              return (
                <button
                  key={i}
                  onClick={() => pick(i)}
                  disabled={done}
                  className={`btn-anim w-full rounded-xl border-2 px-4 py-2.5 text-left text-sm font-semibold ${
                    showRight
                      ? 'border-[#2F7D4F] bg-[#2F7D4F]/10 text-[#2F7D4F]'
                      : showWrong
                        ? 'border-[#B3402F] bg-[#B3402F]/10 text-[#B3402F]'
                        : 'border-[#D7CCC8] text-[#4E342E] hover:border-[#8D6E63]'
                  }`}
                >
                  {o.label}
                </button>
              )
            })}
          </div>

          {done && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-3 rounded-2xl p-3 text-sm leading-relaxed ${
                options[picked].correct
                  ? 'bg-[#2F7D4F]/10 text-[#234E33]'
                  : 'bg-[#B3402F]/10 text-[#6E2A1F]'
              }`}
            >
              <b>{options[picked].correct ? '✔ Correct. ' : '✘ Not quite. '}</b>
              {(options[picked].correct ? options[picked].explain : options[picked].explainWrong || correct.explain)}
            </motion.div>
          )}

          <div className="mt-4 flex gap-2">
            {done && options[picked].correct ? (
              <button
                onClick={() => { sfx.click(); close(); onContinue?.() }}
                className="btn-anim flex-1 rounded-full bg-[#4E342E] px-5 py-2.5 text-sm font-extrabold text-white hover:bg-[#5D4037]"
              >
                Continue →
              </button>
            ) : (
              <button
                onClick={() => { sfx.click(); close() }}
                className="btn-anim flex-1 rounded-full border border-[#8D6E63]/40 px-5 py-2.5 text-sm font-bold text-[#5D4037]"
              >
                {done ? 'Try again' : 'Close'}
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
