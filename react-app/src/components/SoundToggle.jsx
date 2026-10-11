import { useState } from 'react'
import { isMuted, toggleMuted, sfx } from '../lib/sounds.js'

export default function SoundToggle() {
  const [muted, setMuted] = useState(isMuted())

  const flip = () => {
    const nowMuted = toggleMuted()
    setMuted(nowMuted)
    if (!nowMuted) sfx.pop()
  }

  return (
    <button
      onClick={flip}
      title={muted ? 'Sound is off — click to turn on' : 'Sound is on — click to mute'}
      className="btn-anim absolute right-5 top-5 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-extrabold text-[#FFF8F0] backdrop-blur hover:bg-white/25 sm:right-7 sm:top-7"
    >
      {muted ? '🔇 Sound off' : '🔊 Sound on'}
    </button>
  )
}
