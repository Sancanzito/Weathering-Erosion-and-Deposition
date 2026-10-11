import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import QuizModal from './QuizModal.jsx'
import { sfx } from '../../lib/sounds.js'

const N = 44

export default function StageLimestone({ onUnlock, onPassed: onStagePassed, onAdvance }) {
  const canvasRef = useRef(null)
  const viewRef = useRef(null)
  const [ph, setPh] = useState(5.6)
  const [t, setT] = useState(50)
  const [mass, setMass] = useState(100)
  const [years, setYears] = useState(0)
  const [running, setRunning] = useState(false)
  const [msg, setMsg] = useState('')
  const [msgOk, setMsgOk] = useState(false)
  const [quizOpen, setQuizOpen] = useState(false)
  const [passed, setPassed] = useState(false)
  const [prediction, setPrediction] = useState(null)
  const [attempts, setAttempts] = useState(0)
  const [ran, setRan] = useState(false)
  const [flying, setFlying] = useState(false)
  const flyT = useRef(null)
  const sim = useRef({ M:100, y:0, run:false, fr:0, timer:null, bump: Array.from({length:N},()=> .5+Math.random()), pits: Array.from({length:26},()=>[Math.floor(Math.random()*N), Math.random()]) })
  const mood = mass <= 50 ? '🫠' : mass < 85 ? '😬' : '🪨'
  const moodLine = mass <= 50 ? 'Rock status: half gone — goal smashed!' : mass < 85 ? 'Rock status: pitting… keep the acid coming!' : 'Rock status: solid block. Lower the pH or add time!'
  const combo = ph <= 3 && t >= 60 ? '🧪 Acid storm combo — super sour + long soak!' : null
  const goalMet = mass < 50
  const step = goalMet ? 4 : !prediction ? 1 : !ran ? 2 : 3
  const stepText = [
    '',
    'Pick a prediction in the glowing box.',
    'Set the sliders — try a lower pH and more time.',
    'Press the glowing ▶ Start exposure button.',
    'Goal reached — press the glowing Continue → knowledge check.',
  ][step]

  const rate = (p) => .1 * Math.pow(10, (7-p)*.4)

  const draw = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const x = canvas.getContext('2d')
    const s = sim.current
    s.fr++
    x.clearRect(0,0,420,270)
    const E = (100 - s.M)/100*125, cw = 240/N
    const rc = ph < 3 ? '#e35d6a' : ph < 5 ? '#e8a15a' : '#4aa3df'
    x.fillStyle = rc
    if (s.run) for (let i=0;i<14;i++){ const dx=60+(i*29)%300, dy=(s.fr*5+i*47)%160; x.beginPath(); x.ellipse(dx,dy,1.8,4,0,0,7); x.fill() }
    x.fillStyle = '#6D4C41'; x.font = '13px system-ui'
    x.fillText('rain pH ' + Number(ph).toFixed(1), 10, 18)
    for (let i=0;i<N;i++){
      const top = 95 + E*s.bump[i]*(.8+.3*Math.sin(i*1.7)), h = 240-top
      x.fillStyle = i%2 ? '#d9d3c3' : '#d3ccba'
      x.fillRect(90+i*cw, top, cw+.6, h)
    }
    x.fillStyle = 'rgba(90,80,60,.4)'
    if (E > 10) s.pits.forEach(([c,r])=>{ const top = 95+E*s.bump[c]; x.beginPath(); x.arc(90+c*cw+cw/2, top+4+r*10*(E/60), 2+E/40, 0, 7); x.fill() })
    x.fillStyle = '#7a7466'; x.fillRect(80,240,260,12)
    if (s.run && s.M > 0) {
      x.font = '11px system-ui'; x.fillStyle = '#2a6a9a'
      for (let i=0;i<5;i++) x.fillText(i%2 ? 'HCO₃⁻' : 'Ca²⁺', 335+(s.fr*1.3+i*25)%70, 120+((s.fr*1.1+i*40)%120))
    }
    if (s.M <= 0) { x.fillStyle = '#444'; x.font = '13px system-ui'; x.fillText('Nearly all limestone has dissolved away', 100, 200) }
  }

  useEffect(()=>{
    draw()
    const iv = setInterval(()=>{ if (sim.current.run) draw() }, 60)
    return ()=>clearInterval(iv)
    // eslint-disable-next-line
  }, [ph, mass])

  useEffect(()=>()=>{ clearInterval(sim.current.timer); clearTimeout(flyT.current) }, [])

  const run = () => {
    const s = sim.current
    if (s.run || s.M <= 0) return
    // Bring the simulation to the top of the screen so students can watch it
    viewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    s.run = true; setRunning(true); setMsg(''); setMsgOk(false)
    setAttempts((a) => a + 1)
    setRan(true)
    sfx.run()
    setFlying(true)
    clearTimeout(flyT.current)
    flyT.current = setTimeout(() => setFlying(false), 2400)
    const T = t, dt = T/150
    let e = 0, lastMark = Math.floor(s.M / 10)
    s.timer = setInterval(()=>{
      e += dt; s.y += dt
      s.M = Math.max(0, s.M - rate(ph)*dt)
      setMass(s.M); setYears(s.y); draw()
      const mark = Math.floor(s.M / 10)
      if (mark < lastMark) { lastMark = mark; sfx.tick() }
      if (e >= T || s.M <= 0) {
        clearInterval(s.timer); s.run = false; setRunning(false); draw()
        if (s.M < 50) {
          setMsg('Over half the limestone is gone! Press Continue, answer the check, Stage 3 unlocks.')
          setMsgOk(true)
          sfx.dissolve()
          setTimeout(() => sfx.success(), 450)
        } else {
          setMsg('Pitted but mostly intact. Try lower pH or more time.')
          sfx.miss()
        }
      }
    }, 50)
  }

  const reset = () => {
    clearInterval(sim.current.timer)
    sim.current.M = 100; sim.current.y = 0; sim.current.run = false
    setMass(100); setYears(0); setRunning(false); setMsg(''); setMsgOk(false); setPassed(false)
    setRan(false); setFlying(false)
    draw()
  }

  return (
    <div>
      <p id="stage-scenario" className="mb-3 rounded-xl bg-[#EFEBE9] px-3 py-2 text-xs font-semibold text-[#5D4037]">
       Scenario: A limestone rock is exposed to acidic rainfall over many years, causing its surface to slowly dissolve and pit away.
      </p>
      <p className="mb-3 rounded-xl bg-[#EFEBE9] px-3 py-2 text-xs font-semibold text-[#5D4037]">
        How to play: ① Predict → ② Move the sliders → ③ Press <b>Start exposure</b> → ④ When the goal is met, press <b>Continue → knowledge check</b>.
      </p>

      {/* Live step guide — shows exactly what to do next */}
      <div className="mb-3 flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#4E342E] to-[#6D4C41] px-3 py-2 text-[#FFF8F0]">
        <span className="shrink-0 rounded-full bg-[#D9892B] px-2.5 py-0.5 text-[11px] font-extrabold text-[#2B1D16]">
          STEP {step} / 4
        </span>
        <p className="text-xs font-bold">{stepText}</p>
      </div>

      <div id="stage-predict" className={`mb-3 rounded-2xl bg-[#FAF7F2] p-3 ${step === 1 ? 'glow' : ''}`}>
        <p className="text-sm font-extrabold text-[#4E342E]">
          {mood} {moodLine}
          {attempts > 0 && <span className="ml-2 text-xs font-bold text-[#8D6E63]">Attempt #{attempts}</span>}
        </p>
        {combo && <p className="mt-1 text-xs font-bold text-[#2F7D4F]">{combo}</p>}
        <p className="mt-2 text-xs font-bold uppercase tracking-wider text-[#8D6E63]">🔮 Predict first — what will happen?</p>
        <div className="mt-1 flex flex-wrap gap-2">
          {['It will melt away', 'It will barely change', 'Not sure'].map((p) => (
            <button key={p} onClick={() => { sfx.pop(); setPrediction(p) }} className={`btn-anim rounded-full px-4 py-1.5 text-xs font-bold ${prediction === p ? 'bg-[#4E342E] text-white' : 'bg-white text-[#5D4037] border border-[#D7CCC8] hover:border-[#8D6E63]'}`}>
              {p}
            </button>
          ))}
        </div>
      </div>
      <div className="rounded-xl border-l-4 border-[#6D4C41] bg-[#EFEBE9] p-3 text-sm">
        💡 <b>Hint:</b> <code className="font-mono font-bold">CaCO₃ + H₂O + CO₂ → Ca²⁺ + 2 HCO₃⁻</code>
        <br /><span className="text-xs text-[#8D6E63]">Limestone is CaCO₃. More H⁺ (lower pH) = faster reaction.</span>
      </div>
      <p className="mt-3 text-xs font-extrabold uppercase tracking-wider text-[#8D6E63]">
        📺 Live view — watch the limestone block
      </p>
      <div id="stage-live" ref={viewRef} className="relative mx-auto mt-1 w-full max-w-[420px]">
        <canvas ref={canvasRef} width="420" height="270" className="block w-full rounded-xl bg-[#E8EDF0]" />
        <AnimatePresence>
          {flying && (
            <motion.div
              initial={{ y: 70, opacity: 0, scale: 0.8 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -14, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 170, damping: 15 }}
              className="pointer-events-none absolute inset-x-0 bottom-3 mx-auto w-fit rounded-full bg-[#4E342E]/95 px-4 py-2 text-xs font-extrabold text-[#FFF8F0] shadow-xl"
            >
              👀 Watch the block — sim running!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <p className="mt-1 text-center text-[11px] font-semibold text-[#8D6E63]">
        ▬▬ limestone block · 🔵 falling acid rain · Ca²⁺ / HCO₃⁻ = dissolved rock leaving in water · dark spots = pits
      </p>

      <p className="mt-4 text-xs font-extrabold uppercase tracking-wider text-[#8D6E63]">
        🎛️ Controls — move a slider, then press <span className="text-[#4E342E]">Start exposure</span>
      </p>
      <div id="stage-controls" className={`rounded-xl p-1.5 ${step === 2 ? 'glow' : ''}`}>
      <label className="mt-2 block text-sm">Acidity of the rain — lower pH = stronger acid <b className="float-right text-[#6D4C41]">{Number(ph).toFixed(1)}</b></label>
      <input type="range" min="1" max="7" step="0.1" value={ph} onChange={(e)=>setPh(+e.target.value)} className="w-full accent-[#6D4C41]" />
      <label className="mt-2 block text-sm">Exposure time <b className="float-right text-[#6D4C41]">{t} years</b></label>
      <input type="range" min="5" max="100" step="5" value={t} onChange={(e)=>setT(+e.target.value)} className="w-full accent-[#6D4C41]" />
      </div>

      <p className="mt-4 text-xs font-extrabold uppercase tracking-wider text-[#8D6E63]">
        📊 Rock remaining — goal: below 50 % (more than half dissolved)
      </p>
      <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-[#D7CCC8]">
        <div className="h-full bg-[#6D4C41] transition-all" style={{ width: `${Math.max(mass,0)}%` }} />
      </div>
      <p className="mt-1 text-xs text-[#8D6E63]">Rock remaining: {Math.max(0,Math.round(mass))} % · Time passed: {Math.round(years)} years</p>
      <div id="stage-run" className="mt-3 flex flex-wrap gap-2">
        <motion.button
          whileHover={{ y: -4, scale: 1.03 }}
          whileTap={{ y: 0, scale: 0.95 }}
          onClick={() => { sfx.click(); run() }}
          disabled={running || mass<=0}
          className={`rounded-full bg-[#4E342E] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50 ${step === 3 ? 'glow' : ''}`}
        >
          ▶ Start exposure
        </motion.button>
        <motion.button
          whileHover={{ y: -4, scale: 1.03 }}
          whileTap={{ y: 0, scale: 0.95 }}
          onClick={() => { sfx.click(); reset() }}
          className="rounded-full border border-[#8D6E63]/50 px-5 py-2.5 text-sm font-bold text-[#5D4037]"
        >
          ↻ New rock (start over)
        </motion.button>
        {/* Always visible — students can open the check without finishing the sim */}
        <motion.button
          whileHover={{ y: -4, scale: 1.03 }}
          whileTap={{ y: 0, scale: 0.95 }}
          onClick={() => { sfx.click(); setQuizOpen(true) }}
          className={`rounded-full bg-[#2F7D4F] px-5 py-2.5 text-sm font-extrabold text-white ${step === 4 ? 'glow' : ''}`}
        >
          {passed ? 'Review knowledge check ✓' : 'Continue → knowledge check'}
        </motion.button>
      </div>
      {msg && <p className={`mt-2 text-sm font-semibold ${msgOk ? 'text-[#2F7D4F]' : ''}`}>{msg}</p>}
      <p className="mt-2 text-xs text-[#8D6E63]">Goal: wear the limestone until less than half remains.</p>

      <QuizModal
        open={quizOpen}
        onClose={()=>setQuizOpen(false)}
        title="Stage 2 check — dissolving"
        question="The limestone wore away. Where did the rock go?"
        options={[
          { label: 'Dissolved into Ca²⁺ + HCO₃⁻ ions carried away', correct: true, explain: 'Carbonic acid attacked CaCO₃ and converted it into dissolved ions that washed off. Lower pH and longer time remove more. Composition changed — chemical change.' },
          { label: 'Broke into same-material pebbles', correct: false, explainWrong: 'No pebbles piled up — the surface lowered and pits formed as material left in water. That means it dissolved, not just cracked. Try the other answer.' },
        ]}
        onPassed={()=>{ setPassed(true); onUnlock?.(3); onStagePassed?.() }}
        onContinue={()=>onAdvance?.()}
      />
    </div>
  )
}
