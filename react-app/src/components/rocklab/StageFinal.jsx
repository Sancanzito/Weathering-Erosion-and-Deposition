import { useState } from 'react'
import { sfx } from '../../lib/sounds.js'

const PICS = [
  '<rect width="100" height="100" fill="#cfd8dc"/><path d="M15 80 L25 35 L55 20 L85 40 L80 80Z" fill="#8a8580"/><path d="M52 21 L48 42 L58 55 L50 80" stroke="#222" stroke-width="3" fill="none"/>',
  '<rect width="100" height="100" fill="#cfd8dc"/><path d="M10 90 L30 20 L47 15 L55 90Z M58 90 L60 15 L80 22 L92 90Z" fill="#7d7873"/><path d="M47 15 L55 90 L58 90 L60 15Z" fill="#cfeeff"/>',
  '<rect width="100" height="100" fill="#d6e6df"/><path d="M5 85 Q50 60 95 85 L95 100 L5 100Z" fill="#d9d3c3"/><path d="M50 8 Q60 28 50 36 Q40 28 50 8Z" fill="#4aa3df"/><circle cx="30" cy="80" r="3" fill="#bbb"/><circle cx="58" cy="76" r="2" fill="#bbb"/><circle cx="72" cy="82" r="3" fill="#bbb"/>',
  '<rect width="100" height="100" fill="#e9dfc7"/><path d="M20 70 L30 40 L60 35 L80 60 L70 85 L30 88Z" fill="#a8452f"/><circle cx="40" cy="60" r="8" fill="#c8693a"/><circle cx="62" cy="68" r="6" fill="#7a4a2b"/>',
]
const ANS = 'WEATHERING'
const LETTERS = 'WETEHINGRA'.split('')

export default function StageFinal({ onSolved }) {
  const [slots, setSlots] = useState(Array(10).fill(null))
  const [msg, setMsg] = useState('')
  const [ok, setOk] = useState(false)

  const check = (s) => {
    if (!s.includes(null)) {
      if (s.map((i)=>LETTERS[i]).join('') === ANS) {
        setMsg("🎉 WEATHERING! You've completed the lab: rocks are broken down and changed by ice, water, acid and air.")
        setOk(true)
        onSolved?.()
        sfx.success()
      } else {
        setMsg('Not the right word yet. Tap a letter in the answer row to remove it.')
        setOk(false)
        sfx.wrong()
      }
    }
  }

  return (
    <div>
      <p className="text-sm text-[#8D6E63]">What one word connects all four pictures? (Topic: rocks)</p>
      <div id="stage-puzzle" className="mx-auto mt-3 grid max-w-[340px] grid-cols-2 gap-2">
        {PICS.map((p,i)=>(<div key={i} className="overflow-hidden rounded-xl border border-[#D7CCC8]" dangerouslySetInnerHTML={{ __html: `<svg viewBox="0 0 100 100" style="width:100%;display:block">${p}</svg>` }} />))}
      </div>
      <div id="stage-letters" className="mt-3 flex flex-wrap justify-center gap-1.5">
        {slots.map((v,i)=>(
          <button key={i} onClick={()=>{ const s=[...slots]; s[i]=null; setSlots(s); setMsg(''); setOk(false); sfx.click() }} className="btn-anim h-[42px] w-8 rounded-lg border-2 border-[#6D4C41] bg-white font-bold text-[#3E2723]">
            {v != null ? LETTERS[v] : ''}
          </button>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap justify-center gap-1.5">
        {LETTERS.map((l,i)=>(
          <button key={i} disabled={slots.includes(i)} onClick={()=>{ const k=slots.indexOf(null); if (k<0) return; const s=[...slots]; s[k]=i; setSlots(s); sfx.pop(); check(s) }} className="btn-anim h-[42px] w-8 rounded-lg border-2 border-[#D7CCC8] bg-white font-bold text-[#3E2723] disabled:opacity-25">
            {l}
          </button>
        ))}
      </div>
      <button onClick={()=>{ setSlots(Array(10).fill(null)); setMsg(''); setOk(false); sfx.click() }} className="btn-anim mt-3 rounded-full border border-[#8D6E63]/50 px-5 py-2 text-sm font-bold text-[#5D4037]">Clear</button>
      {msg && <p className={`mt-2 text-sm font-semibold ${ok ? 'text-[#2F7D4F]' : 'text-[#B3402F]'}`}>{msg}</p>}
    </div>
  )
}
