import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import QuizModal from './QuizModal.jsx'
import { sfx } from '../../lib/sounds.js'

const PX = [[100,120],[135,78],[190,62],[250,64],[300,85],[325,140],[310,210],[250,232],[170,235],[115,205]]
const GRAINS = Array.from({ length: 70 }, () => [100 + Math.random()*230, 62 + Math.random()*175, 1 + Math.random()*3])
const REG = [[90,50,150],[150,50,210],[210,50,265],[265,50,335]]
const OFF = [[-42,8,-.07],[-14,28,.05],[18,20,-.05],[46,10,.08]]

function tracePath(x) {
  x.beginPath()
  PX.forEach((p,i)=> i ? x.lineTo(p[0],p[1]) : x.moveTo(p[0],p[1]))
  x.closePath()
}
function paintRock(x, fill) {
  tracePath(x); x.fillStyle = fill; x.fill()
  x.save(); x.clip()
  x.fillStyle = 'rgba(40,35,30,.22)'
  GRAINS.forEach(([a,b,r])=>{ x.beginPath(); x.arc(a,b,r,0,7); x.fill() })
  x.restore()
  tracePath(x); x.strokeStyle = '#4a4743'; x.lineWidth = 2; x.stroke()
}

export default function StageFrost({ onUnlock, onPassed: onStagePassed, onAdvance }) {
  const canvasRef = useRef(null)
  const viewRef = useRef(null)
  const [min, setMin] = useState(-5)
  const [max, setMax] = useState(12)
  const [w, setW] = useState(60)
  const [n, setN] = useState(10)
  const [dmg, setDmg] = useState(0)
  const [cyc, setCyc] = useState(0)
  const [broken, setBroken] = useState(false)
  const [busy, setBusy] = useState(false)
  const [phase, setPhase] = useState('')
  const [msg, setMsg] = useState('')
  const [msgOk, setMsgOk] = useState(false)
  const [quizOpen, setQuizOpen] = useState(false)
  const [passed, setPassed] = useState(false)
  const [prediction, setPrediction] = useState(null)
  const [attempts, setAttempts] = useState(0)
  const [ran, setRan] = useState(false)
  const [flying, setFlying] = useState(false)
  const flyT = useRef(null)
  const sim = useRef({ D:0, cyc:0, broken:false, bp:0, timer:null })
  const mood = broken ? '💥' : dmg >= 60 ? '😖' : dmg >= 20 ? '😐' : '🪨'
  const moodLine = broken
    ? 'Rock status: shattered! Nice experimenting.'
    : dmg >= 60
      ? 'Rock status: groaning… one more push!'
      : dmg >= 20
        ? 'Rock status: cracking… keep going!'
        : 'Rock status: solid. Change a setting and run it!'
  const combo = min <= -10 && w >= 70 ? '❄️ Ice Age combo — deep freeze + soaked crack!' : null
  // Step guide — glows whatever the student should touch next
  const step = broken ? 4 : !prediction ? 1 : !ran ? 2 : 3
  const stepText = [
    '',
    'Pick a prediction in the glowing box.',
    'Set the sliders — nights below 0 °C, days above, water in the crack.',
    'Press the glowing ▶ Run cycles button.',
    'Goal reached — press the glowing Continue → knowledge check.',
  ][step]

  const draw = (ph = phase) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const x = canvas.getContext('2d')
    const s = sim.current
    const wf = w/100
    const cross = min < 0 && max > 0
    x.clearRect(0,0,420,270)
    x.fillStyle = '#5D4037'; x.font = '14px system-ui'
    x.fillText(ph === 'freeze' ? `Night: ${min} °C` : ph === 'thaw' ? `Day: ${max} °C` : '', 10, 24)
    if (s.broken) {
      REG.forEach((r,i)=>{
        const o = OFF[i]
        x.save()
        x.translate(o[0]*s.bp, o[1]*s.bp)
        x.translate(210,150); x.rotate(o[2]*s.bp); x.translate(-210,-150)
        x.beginPath(); x.rect(r[0],r[1],r[2]-r[0],200); x.clip()
        paintRock(x, '#8c8680')
        x.restore()
      })
      x.fillStyle = '#999'
      for (let i=0;i<14;i++){ x.beginPath(); x.arc(95+i*17, 250+(i%3)*3, 2+(i%3), 0, 7); x.fill() }
      return
    }
    paintRock(x, '#8c8680')
    const d = 45 + s.D*1.2
    const g = 1.5 + s.D*.2 + (ph==='freeze' && cross && wf>0 ? 3*wf : 0)
    if (s.D > 55) {
      x.strokeStyle = '#2a2826'; x.lineWidth = 1 + s.D/40
      x.globalAlpha = Math.min(1,(s.D-55)/30)
      x.beginPath(); x.moveTo(210,60+d*.6); x.lineTo(160,200); x.moveTo(210,60+d*.7); x.lineTo(268,215); x.stroke()
      x.globalAlpha = 1
    }
    x.beginPath(); x.moveTo(210-g/2,60); x.lineTo(210+g/2,60); x.lineTo(210,60+d); x.closePath()
    x.fillStyle = '#1d1b19'; x.fill()
    if (wf > 0) {
      // Clip to the CRACK triangle only (not the whole rock),
      // otherwise water fills a wide block across the rock.
      x.save()
      x.beginPath(); x.moveTo(210-g/2,60); x.lineTo(210+g/2,60); x.lineTo(210,60+d); x.closePath()
      x.clip()
      const lv = 60 + d*(1-wf)
      x.fillStyle = ph==='freeze' && cross ? '#eaf8ff' : '#3f97d6'
      x.fillRect(150, lv, 120, 200)
      x.restore()
    }
    if (ph==='freeze' && cross && wf>0) {
      x.fillStyle = '#d33'; x.font = 'bold 18px system-ui'
      x.fillText('◀', 210-g/2-22, 60+d*.35)
      x.fillText('▶', 210+g/2+6, 60+d*.35)
    }
  }

  useEffect(()=>{ draw(); /* eslint-disable-next-line */ }, [min, max, w, dmg, cyc, broken, phase])
  useEffect(()=>()=>{ clearInterval(sim.current.timer); clearTimeout(flyT.current) }, [])

  const dmgPerCycle = () => {
    const s = sim.current
    const cross = min < 0 && max > 0
    const wf = w/100
    return (cross ? wf*7*(1+Math.min(-min,15)/30)*(1+s.D/70) : 0) + ((max-min)/50)*.2
  }

  const run = () => {
    const s = sim.current
    if (busy || s.broken) return
    // Bring the simulation to the top of the screen so students can watch it
    viewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    setBusy(true); setMsg(''); setMsgOk(false)
    setAttempts((a) => a + 1)
    setRan(true)
    // Sound + "watch the rock" fly-in so eyes follow the sim
    sfx.run()
    setFlying(true)
    clearTimeout(flyT.current)
    flyT.current = setTimeout(() => setFlying(false), 2400)
    let left = n, half = 0
    s.timer = setInterval(()=>{
      if (!half) { half = 1; setPhase('freeze'); draw('freeze') }
      else {
        half = 0; setPhase('thaw'); draw('thaw')
        s.D = Math.min(110, s.D + dmgPerCycle()); s.cyc += 1
        setDmg(s.D); setCyc(s.cyc); left--
        sfx.tick()
        if (s.D >= 100) {
          s.D = 100; setDmg(100)
          clearInterval(s.timer); setBusy(false); setPhase(''); draw('')
          s.broken = true; setBroken(true); s.bp = 0
          const a = setInterval(()=>{
            s.bp = Math.min(1, s.bp + .08)
            const canvas = canvasRef.current
            if (canvas) {
              const x = canvas.getContext('2d')
              x.clearRect(0,0,420,270)
              REG.forEach((r,i)=>{
                const o = OFF[i]
                x.save()
                x.translate(o[0]*s.bp, o[1]*s.bp)
                x.translate(210,150); x.rotate(o[2]*s.bp); x.translate(-210,-150)
                x.beginPath(); x.rect(r[0],r[1],r[2]-r[0],200); x.clip()
                paintRock(x, '#8c8680')
                x.restore()
              })
            }
            if (s.bp >= 1) clearInterval(a)
          }, 40)
          setMsg('The rock split into smaller pieces! Press Continue, answer the check, and Stage 2 unlocks.')
          setMsgOk(true)
          sfx.shatter()
          setTimeout(() => sfx.success(), 450)
        } else if (left <= 0) {
          clearInterval(s.timer); setBusy(false); setPhase('')
          setMsg(s.D < 5 ? 'Almost no change. Which ingredient might be missing? (Hint: needs nights below 0 °C, days above 0 °C, and water.)' : 'The crack grew but the rock is still whole. Adjust settings or run more cycles.')
          setMsgOk(false)
          sfx.miss()
        }
        draw(half ? 'freeze' : 'thaw')
      }
    }, 300)
  }

  const reset = () => {
    clearInterval(sim.current.timer)
    sim.current = { D:0, cyc:0, broken:false, bp:0, timer:null }
    setDmg(0); setCyc(0); setBroken(false); setBusy(false); setPhase(''); setMsg(''); setMsgOk(false); setPassed(false)
  }

  return (
    <div>
      <p id="stage-scenario" className="mb-3 rounded-xl bg-[#EFEBE9] px-3 py-2 text-xs font-semibold text-[#5D4037]">
       Scenario: A rock experiences intense daytime heat and freezing nighttime temperatures, causing water trapped in its cracks to repeatedly freeze and expand.
      </p>
      <p className="mb-3 rounded-xl bg-[#EFEBE9] px-3 py-2 text-xs font-semibold text-[#5D4037]">
        How to play: ① Predict → ② Move the sliders → ③ Press <b>Run cycles</b> → ④ When the goal is met, press <b>Continue → knowledge check</b>.
      </p>

      {/* Live step guide — shows exactly what to do next */}
      <div className="mb-3 flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#4E342E] to-[#6D4C41] px-3 py-2 text-[#FFF8F0]">
        <span className="shrink-0 rounded-full bg-[#D9892B] px-2.5 py-0.5 text-[11px] font-extrabold text-[#2B1D16]">
          STEP {step} / 4
        </span>
        <p className="text-xs font-bold">{stepText}</p>
      </div>

      {/* Interaction: predict + living rock mood */}
      <div id="stage-predict" className={`mb-3 rounded-2xl bg-[#FAF7F2] p-3 ${step === 1 ? 'glow' : ''}`}>
        <p className="text-sm font-extrabold text-[#4E342E]">
          {mood} {moodLine}
          {attempts > 0 && <span className="ml-2 text-xs font-bold text-[#8D6E63]">Attempt #{attempts}</span>}
        </p>
        {combo && <p className="mt-1 text-xs font-bold text-[#2F7D4F]">{combo}</p>}
        <p className="mt-2 text-xs font-bold uppercase tracking-wider text-[#8D6E63]">🔮 Predict first — what will happen?  If temperature in the night is at it's lowest</p>
        <div className="mt-1 flex flex-wrap gap-2">
          {['It will split', 'It will barely change', 'Not sure'].map((p) => (
            <button
              key={p}
              onClick={() => { sfx.pop(); setPrediction(p) }}
              className={`btn-anim rounded-full px-4 py-1.5 text-xs font-bold ${
                prediction === p ? 'bg-[#4E342E] text-white' : 'bg-white text-[#5D4037] border border-[#D7CCC8] hover:border-[#8D6E63]'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        {prediction && msg && (
          <p className="mt-1 text-xs text-[#5D4037]">
            Your prediction was “{prediction}” — {broken ? 'did it come true? 🎉' : 'run again and see! 👀'}
          </p>
        )}
      </div>
      <p className="mt-3 text-xs font-extrabold uppercase tracking-wider text-[#8D6E63]">
        📺 Live view — watch your rock
      </p>
      <div id="stage-live" ref={viewRef} className="relative mx-auto mt-1 w-full max-w-[420px]">
        <canvas ref={canvasRef} width="420" height="270" className="block w-full rounded-xl bg-[#E8EDF0]" />
        {/* Fly-in badge: slides up to the image when the sim starts */}
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
        ⬛ the crack · 🔵 water inside · ⬜ ice · ↕ red arrows = ice pushing the crack wider
      </p>

      <p className="mt-4 text-xs font-extrabold uppercase tracking-wider text-[#8D6E63]">
        🎛️ Controls — move a slider, then press <span className="text-[#4E342E]">Run cycles</span>
      </p>
      <div id="stage-controls" className={`rounded-xl p-1.5 ${step === 2 ? 'glow' : ''}`}>
      <label className="mt-2 block text-sm">Night temperature (coldest) <b className="float-right text-[#6D4C41]">{min} °C</b></label>
      <input type="range" min="-20" max="10" value={min} onChange={(e)=>{ let v=+e.target.value; setMin(v); if (v>max){ setMax(v) } }} className="w-full accent-[#6D4C41]" />
      <label className="mt-2 block text-sm">Day temperature (warmest) <b className="float-right text-[#6D4C41]">{max} °C</b></label>
      <input type="range" min="0" max="45" value={max} onChange={(e)=>{ let v=+e.target.value; setMax(v); if (v<min){ setMin(v) } }} className="w-full accent-[#6D4C41]" />
      <label className="mt-2 block text-sm">Water in the crack (0 % = dry) <b className="float-right text-[#6D4C41]">{w} %</b></label>
      <input type="range" min="0" max="100" value={w} onChange={(e)=>setW(+e.target.value)} className="w-full accent-[#6D4C41]" />
      <label className="mt-2 block text-sm">Freeze–thaw cycles per run <b className="float-right text-[#6D4C41]">{n}</b></label>
      <input type="range" min="1" max="50" value={n} onChange={(e)=>setN(+e.target.value)} className="w-full accent-[#6D4C41]" />
      </div>

      <p className="mt-4 text-xs font-extrabold uppercase tracking-wider text-[#8D6E63]">
        📊 Damage meter — goal: 100 % (the rock splits)
      </p>
      <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-[#D7CCC8]">
        <div className="h-full bg-[#6D4C41] transition-all" style={{ width: `${Math.min(dmg,100)}%` }} />
      </div>
      <p className="mt-1 text-xs text-[#8D6E63]">Crack width: {(1.5+Math.min(dmg,100)*.2).toFixed(1)} mm · Cycles done: {cyc} · Damage: {Math.min(100,Math.round(dmg))} %</p>

      <div id="stage-run" className="mt-3 flex flex-wrap gap-2">
        <motion.button
          whileHover={{ y: -4, scale: 1.03 }}
          whileTap={{ y: 0, scale: 0.95 }}
          onClick={() => { sfx.click(); run() }}
          disabled={busy || broken}
          className={`rounded-full bg-[#4E342E] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50 ${step === 3 ? 'glow' : ''}`}
        >
          ▶ Run cycles
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
      {msg && <p className={`mt-2 text-sm font-semibold ${msgOk ? 'text-[#2F7D4F]' : 'text-[#5D4037]'}`}>{msg}</p>}
      <p className="mt-2 text-xs text-[#8D6E63]">Goal: split the rock. Liquid water becomes ice at 0 °C and ice takes ~9% more space.</p>

      <QuizModal
        open={quizOpen}
        onClose={()=>setQuizOpen(false)}
        title="Stage 1 check — frost"
        question="The rock split. Did its minerals change into new substances?"
        options={[
          { label: 'No — same minerals, just smaller pieces', correct: true, explain: 'Ice wedged the crack wider each freeze (needs nights below 0 °C, days above, plus water). More water and more cycles split it faster. Minerals unchanged — physical disintegration.' },
          { label: 'Yes — it turned into a new mineral', correct: false, explainWrong: 'Look at the pieces: same gray rock, only cracked apart. Water froze and pried — it did not react into a new mineral. Try the other answer.' },
        ]}
        onPassed={()=>{ setPassed(true); onUnlock?.(2); onStagePassed?.() }}
        onContinue={()=>onAdvance?.()}
      />
    </div>
  )
}
