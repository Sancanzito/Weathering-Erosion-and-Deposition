import { useEffect, useState } from 'react'
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
      <div id="knowledge-check" className="rounded-2xl bg-gradient-to-r from-[#2B1D16] to-[#5D4037] p-5 text-[#FFF8F0]">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#D7CCC8]">
          📝 {title} — result
        </p>
        <p className="mt-1 text-2xl font-black">
          {perfect ? '🎉 Perfect score!' : `You scored ${score} / ${questions.length}`}
        </p>
        <p className="mt-1 text-sm text-[#EFEBE9]/90">
          {perfect
            ? 'You nailed every question. Keep exploring the other lesson!'
            : 'Read the explanations again and retry — you can get them all.'}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button onClick={() => { sfx.click(); retry() }} className="btn-anim rounded-full bg-[#EFEBE9] px-5 py-2.5 text-sm font-extrabold text-[#4E342E] hover:bg-white">
            ↻ Try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div id="knowledge-check" className="rounded-2xl border-l-8 border-[#6D4C41] bg-white p-5 shadow-sm">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#8D6E63]">
        📝 {title} · Question {i + 1} of {questions.length}
      </p>
      <div className="mt-2 flex gap-1.5">
        {questions.map((_, k) => (
          <span key={k} className={`h-1.5 flex-1 rounded-full ${k < i ? 'bg-[#2F7D4F]' : k === i ? 'bg-[#6D4C41]' : 'bg-[#D7CCC8]'}`} />
        ))}
      </div>

      <h4 className="mt-3 text-lg font-extrabold text-[#3E2723]">{q.text}</h4>

      <div className="mt-3 space-y-2">
        {q.options.map((o, idx) => {
          const isPicked = picked === idx
          const showRight = picked !== null && o.correct
          const showWrong = isPicked && !o.correct
          return (
            <button
              key={idx}
              onClick={() => pick(idx)}
              disabled={picked !== null}
              className={`btn-anim w-full rounded-xl border-2 px-4 py-2.5 text-left text-sm font-semibold ${
                showRight
                  ? 'border-[#2F7D4F] bg-[#2F7D4F]/10 text-[#234E33]'
                  : showWrong
                    ? 'border-[#B3402F] bg-[#B3402F]/10 text-[#6E2A1F]'
                    : 'border-[#D7CCC8] text-[#4E342E] hover:border-[#8D6E63]'
              }`}
            >
              {o.label}
            </button>
          )
        })}
      </div>

      {picked !== null && (
        <div className={`mt-3 rounded-2xl p-3 text-sm leading-relaxed ${q.options[picked].correct ? 'bg-[#2F7D4F]/10 text-[#234E33]' : 'bg-[#B3402F]/10 text-[#6E2A1F]'}`}>
          <b>{q.options[picked].correct ? '✔ Correct. ' : '✘ Not quite. '}</b>
          {q.options[picked].explain}
        </div>
      )}

      {picked !== null && (
        <button onClick={() => { sfx.click(); next() }} className="btn-anim mt-3 rounded-full bg-[#4E342E] px-5 py-2.5 text-sm font-extrabold text-white hover:bg-[#5D4037]">
          {i + 1 < questions.length ? 'Next question →' : 'See my result →'}
        </button>
      )}
    </div>
  )
}
