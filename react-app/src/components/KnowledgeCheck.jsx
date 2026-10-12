import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { sfx } from '../lib/sounds.js'

const pop3 = () => {
  const colors = ['#5D4037', '#8D6E63', '#D7CCC8', '#D9892B', '#2F7D4F']
  const base = { particleCount: 130, spread: 95, scalar: 1.1, ticks: 220, colors }
  confetti({ ...base, origin: { x: 0.5, y: 0.7 } })
  setTimeout(() => confetti({ ...base, origin: { x: 0.28, y: 0.8 } }), 750)
  setTimeout(() => confetti({ ...base, origin: { x: 0.72, y: 0.8 } }), 1500)
  sfx.unlock()
}

// A fresh focus gradient for every question — the colour shift re-catches
// the student's eye each time a new question appears
const GRADS = [
  'from-[#FFF6EA] via-[#F7E8D6] to-[#EDD9C0]',
  'from-[#EDF7EF] via-[#DDF0E3] to-[#CBE7D5]',
  'from-[#ECF3FB] via-[#DBE8F7] to-[#C7DCF1]',
  'from-[#FBEFEC] via-[#F5DED8] to-[#EECDC5]',
]

export default function KnowledgeCheck({ questions, title = 'Knowledge Check' }) {
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  const q = questions[i]
  const perfect = done && score === questions.length

  // Confetti ×3 + fanfare as soon as the check is finished
  useEffect(() => {
    if (done) pop3()
  }, [done])

  const pick = (idx) => {
    if (picked !== null) return
    setPicked(idx)
    if (q.options[idx].correct) {
      setScore((s) => s + 1)
      sfx.success()
    } else {
      sfx.wrong()
    }
  }

  const next = () => {
    if (i + 1 < questions.length) {
      setI(i + 1)
      setPicked(null)
    } else {
      setDone(true)
    }
  }

  const retry = () => {
    setI(0); setPicked(null); setScore(0); setDone(false)
  }

  if (done) {
    return (
      <div id="knowledge-check" className="rounded-3xl bg-gradient-to-br from-[#2B1D16] via-[#4E342E] to-[#6D4C41] p-6 text-[#FFF8F0] shadow-lg sm:p-8">
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#D7CCC8]">
          📝 {title} — result
        </p>
        <p className="mt-2 text-3xl font-black sm:text-4xl">
          {perfect ? '🎉 Perfect score!' : `You scored ${score} / ${questions.length}`}
        </p>
        <p className="mt-2 text-base text-[#EFEBE9] sm:text-lg">
          {perfect
            ? 'You nailed every question. Keep exploring the other lesson!'
            : 'Read the explanations again and retry — you can get them all.'}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={() => { sfx.click(); retry() }} className="btn-anim rounded-full bg-[#EFEBE9] px-6 py-3 text-base font-extrabold text-[#4E342E] hover:bg-white">
            ↻ Try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      key={i}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      id="knowledge-check"
      className={`rounded-3xl border-l-[10px] border-[#4E342E] bg-gradient-to-br ${GRADS[i % GRADS.length]} p-6 shadow-lg sm:p-8`}
    >
      <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#6D4C41]">
        📝 {title} · Question {i + 1} of {questions.length}
      </p>
      <div className="mt-3 flex gap-2">
        {questions.map((_, k) => (
          <span key={k} className={`h-3 flex-1 rounded-full ${k < i ? 'bg-[#2F7D4F]' : k === i ? 'bg-[#6D4C41]' : 'bg-[#D7CCC8]/70'}`} />
        ))}
      </div>

      <h4 className="mt-5 text-2xl font-black leading-snug text-[#2B1D16] sm:text-3xl">{q.text}</h4>

      <div className="mt-4 space-y-3">
        {q.options.map((o, idx) => {
          const isPicked = picked === idx
          const showRight = picked !== null && o.correct
          const showWrong = isPicked && !o.correct
          return (
            <button
              key={idx}
              onClick={() => pick(idx)}
              disabled={picked !== null}
              className={`btn-anim w-full rounded-2xl border-2 px-5 py-4 text-left text-base font-bold sm:text-lg ${
                showRight
                  ? 'border-[#2F7D4F] bg-[#2F7D4F]/15 text-[#234E33]'
                  : showWrong
                    ? 'border-[#B3402F] bg-[#B3402F]/15 text-[#6E2A1F]'
                    : 'border-[#8D6E63]/50 bg-white/70 text-[#3E2723] hover:border-[#5D4037] hover:bg-white'
              }`}
            >
              {o.label}
            </button>
          )
        })}
      </div>

      {picked !== null && (
        <div className={`mt-4 rounded-2xl p-4 text-base leading-relaxed sm:text-lg ${q.options[picked].correct ? 'bg-[#2F7D4F]/15 text-[#234E33]' : 'bg-[#B3402F]/15 text-[#6E2A1F]'}`}>
          <b>{q.options[picked].correct ? '✔ Correct. ' : '✘ Not quite. '}</b>
          {q.options[picked].explain}
        </div>
      )}

      {picked !== null && (
        <button onClick={() => { sfx.click(); next() }} className="btn-anim mt-4 rounded-full bg-[#4E342E] px-6 py-3 text-base font-extrabold text-white hover:bg-[#5D4037] sm:text-lg">
          {i + 1 < questions.length ? 'Next question →' : 'See my result →'}
        </button>
      )}
    </motion.div>
  )
}
