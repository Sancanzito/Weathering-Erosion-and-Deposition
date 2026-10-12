import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import QuizModal from './QuizModal.jsx'
import { sfx } from '../../lib/sounds.js'

const PX = [[100,120],[135,78],[190,62],[250,64],[300,85],[325,140],[310,210],[250,232],[170,235],[115,205]]
const O = [232,138,48], Rd = [188,58,38], Br = [118,68,42], Gy = [104,112,108]
const mix = (a,b,t) => a.map((v,i)=>Math.round(v+(b[i]-v)*t))
const col = (r) => r < 50 ? mix(O,Rd,r/50) : mix(Rd,Br,(r-50)/50)

function tracePath(x){ x.beginPath(); PX.forEach((p,i)=> i ? x.lineTo(p[0],p[1]) : x.moveTo(p[0],p[1])); x.closePath() }

export default function StageOxidation({ onUnlock, onPassed: onStagePassed, onAdvance }) {
  const canvasRef = useRef(null)
  const viewRef = useRef(null)
  const [o, setO] = useState(60)
  const [mo, setMo] = useState(60)
  const [t, setT] = useState(50)
  const [rust, setRust] = useState(0)
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
  const sim = useRef({ R:0, y:0, run:false, f:0, timer:null, spots: Array.from({length:46},()=>[110+Math.random()*210, 70+Math.random()*160, Math.random()*75, 6+Math.random()*11]) })
  const mood = rust >= 70 ? '🦀' : rust >= 30 ? '🟠' : '🪨'
  const moodLine = rust >= 70 ? 'Rock status: rusty crust — goal smashed!' : rust >= 30 ? 'Rock status: blushing orange… more air + water!' : 'Rock status: gray-green. Feed it oxygen and moisture!'
  const combo = o >= 80 && mo >= 80 ? '🌧️ Rust storm combo — soaked in air + water!' : o === 0 || mo === 0 ? '⚠️ Missing ingredient — rust needs BOTH oxygen and water!' : null
  const goalMet = rust >= 70
  const step = goalMet ? 4 : !prediction ? 1 : !ran ? 2 : 3
  const stepText = [
    '',
    'Pick a prediction in the glowing box.',
    'Set the sliders — rust needs BOTH oxygen and moisture.',
    'Press the glowing ▶ Start exposure button.',
    'Goal reached — press the glowing Continue → knowledge check.',
  ][step]

  const draw = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const x = canvas.getContext('2d')
    const s = sim.current
    s.f++
    x.clearRect(0,0,420,270)
    const of = o/100, mf = mo/100
    const c = col(s.R), base = mix(Gy, c, Math.min(1, s.R/100)*.75)
    tracePath(x); x.fillStyle = `rgb(${base})`; x.fill()
    x.save(); tracePath(x); x.clip()
    s.spots.forEach(([a,b,th,sz])=>{
      if (s.R > th) {
        const k = Math.min(1.5, .4+(s.R-th)/60), cc = col(Math.min(100, s.R+th/4))
        x.fillStyle = `rgba(${cc},.8)`
        x.beginPath(); x.arc(a,b,sz*k,0,7); x.fill()
      }
    })
    x.restore()
    if (s.R > 60) { tracePath(x); x.strokeStyle = `rgb(${Br})`; x.lineWidth = 2+s.R/18; x.stroke() }
    x.font = '12px system-ui'; x.fillStyle = '#4b7fb0'
    for (let i=0;i<Math.round(of*9);i++) x.fillText('O₂', 20+((i*83+s.f*.8)%380), 30+((i*41)%200)+Math.sin((s.f+i*9)/12)*8)
    x.fillStyle = '#3f97d6'
    for (let i=0;i<Math.round(mf*10);i++){ x.beginPath(); x.ellipse(60+(i*37)%320, (s.f*3+i*53)%250, 2, 4, 0, 0, 7); x.fill() }
  }

  useEffect(()=>{
    draw()
    const iv = setInterval(()=>draw(), 80)
    return ()=>clearInterval(iv)
    // eslint-disable-next-line
  }, [o, mo, rust])
  useEffect(()=>()=>{ clearInterval(sim.current.timer); clearTimeout(flyT.current) }, [])

  const run = () => {
    const s = sim.current
    if (s.run || s.R >= 100) return
    // Bring the simulation to the top of the screen so students can watch it
    viewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    s.run = true; setRunning(true); setMsg(''); setMsgOk(false)
    setAttempts((a) => a + 1)
    setRan(true)
    sfx.run()
    setFlying(true)
    clearTimeout(flyT.current)
    flyT.current = setTimeout(() => setFlying(false), 2400)
    const T = t, of = o/100, mf = mo/100, dt = T/150, r = 2*of*mf + .02*of
    let e = 0, lastMark = 0
    s.timer = setInterval(()=>{
      e += dt; s.y += dt
      s.R = Math.min(100, s.R + r*dt)
      setRust(s.R); setYears(s.y)
      const mark = Math.floor(s.R / 10)
      if (mark > lastMark) { lastMark = mark; sfx.tick() }
      if (e >= T || s.R >= 100) {
        clearInterval(s.timer); s.run = false; setRunning(false)
        if (s.R >= 70) {
          setMsg('Red-brown rust covers the rock! Press Continue, answer the check, Stage 4 unlocks.')
          setMsgOk(true)
          sfx.shatter()
          setTimeout(() => sfx.success(), 450)
        } else {
          setMsg(s.R < 10 ? 'Hardly any color change. Check oxygen and moisture, try more time.' : 'Some color. Increase ingredients or time.')
          sfx.miss()
        }
      }
    }, 50)
  }

  const reset = () => {
    clearInterval(sim.current.timer)
    sim.current.R = 0; sim.current.y = 0; sim.current.run = false
    setRust(0); setYears(0); setRunning(false); setMsg(''); setMsgOk(false); setPassed(false)
    setRan(false); setFlying(false)
  }

  return (
    <div>
      <p id="stage-scenario" className="mb-4 rounded-2xl bg-gradient-to-r from-[#EFEBE9] to-[#E6DACA] px-5 py-4 text-[24px] font-semibold leading-snug text-[#4E342E] shadow-sm">
       Scenario: A dark gray, iron-rich rock is exposed to oxygen and moisture over a long period, causing it to rust into a red-brown crust.
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
        {combo && <p className="mt-1 text-xs font-bold text-[#7A2E18]">{combo}</p>}
        <p className="mt-2 text-xs font-bold uppercase tracking-wider text-[#8D6E63]">🔮 Predict first — what will happen?</p>
        <div className="mt-1 flex flex-wrap gap-2">
          {['It will turn red-brown', 'It will stay gray', 'Not sure'].map((p) => (
            <button key={p} onClick={() => { sfx.pop(); setPrediction(p) }} className={`btn-anim rounded-full px-4 py-1.5 text-xs font-bold ${prediction === p ? 'bg-[#4E342E] text-white' : 'bg-white text-[#5D4037] border border-[#D7CCC8] hover:border-[#8D6E63]'}`}>
              {p}
            </button>
          ))}
        </div>
      </div>
      <div className="rounded-xl border-l-4 border-[#A8482A] bg-[#EFEBE9] p-3 text-sm">
        💡 <b>Hint:</b> <code className="font-mono font-bold">4 FeO + O₂ → 2 Fe₂O₃</code>
        <br /><span className="text-xs text-[#8D6E63]">Gray-green iron minerals → red-brown Fe₂O₃.</span>
      </div>
      <p className="mt-3 text-xs font-extrabold uppercase tracking-wider text-[#8D6E63]">
        📺 Live view — watch the iron-rich rock
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
              👀 Watch the rock — sim running!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <p className="mt-1 text-center text-[11px] font-semibold text-[#8D6E63]">
        O₂ = oxygen in the air · 💧 blue dots = moisture · orange spots = rust (Fe₂O₃) forming
      </p>

      <p className="mt-4 text-xs font-extrabold uppercase tracking-wider text-[#8D6E63]">
        🎛️ Controls — move the sliders, then press <span className="text-[#4E342E]">Start exposure</span>
      </p>
      <div id="stage-controls" className={`rounded-xl p-1.5 ${step === 2 ? 'glow' : ''}`}>
      <label className="mt-2 block text-sm">Oxygen reaching the rock <b className="float-right text-[#6D4C41]">{o} %</b></label>
      <input type="range" min="0" max="100" value={o} onChange={(e)=>setO(+e.target.value)} className="w-full accent-[#6D4C41]" />
      <label className="mt-2 block text-sm">Moisture on the rock <b className="float-right text-[#6D4C41]">{mo} %</b></label>
      <input type="range" min="0" max="100" value={mo} onChange={(e)=>setMo(+e.target.value)} className="w-full accent-[#6D4C41]" />
      <label className="mt-2 block text-sm">Exposure time <b className="float-right text-[#6D4C41]">{t} years</b></label>
      <input type="range" min="5" max="100" step="5" value={t} onChange={(e)=>setT(+e.target.value)} className="w-full accent-[#6D4C41]" />
      </div>

      <p className="mt-4 text-xs font-extrabold uppercase tracking-wider text-[#8D6E63]">
        📊 Rust coverage — goal: at least 70 % turned red-brown
      </p>
      <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-[#D7CCC8]">
        <div className="h-full bg-[#A8482A] transition-all" style={{ width: `${rust}%` }} />
      </div>
      <p className="mt-1 text-xs text-[#8D6E63]">Rust formed: {Math.round(rust)} % · Time passed: {Math.round(years)} years</p>
      <div id="stage-run" className="mt-3 flex flex-wrap gap-2">
        <motion.button
          whileHover={{ y: -4, scale: 1.03 }}
          whileTap={{ y: 0, scale: 0.95 }}
          onClick={() => { sfx.click(); run() }}
          disabled={running || rust>=100}
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
      <p className="mt-2 text-xs text-[#8D6E63]">Goal: change at least 70% of the iron minerals. What if one ingredient is missing?</p>

      <QuizModal
        open={quizOpen}
        onClose={()=>setQuizOpen(false)}
        title="Stage 3 check — rusting"
        question="The gray-green rock turned red-brown. What happened?"
        options={[
          { label: 'Iron minerals became iron oxide — a new mineral', correct: true, explain: 'Oxygen plus moisture converted FeO into Fe₂O₃. Take away oxygen or water and almost nothing changes. Composition changed — chemical change.' },
          { label: 'It only cracked — same minerals', correct: false, explainWrong: 'Cracks alone stay gray. Here the color and mineral changed across the surface — a new substance formed. Try the other answer.' },
        ]}
        onPassed={()=>{ setPassed(true); onUnlock?.(4); onStagePassed?.() }}
        onContinue={()=>onAdvance?.()}
      />
    </div>
  )
}
