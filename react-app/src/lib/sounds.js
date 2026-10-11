// Tiny Web Audio sound kit — no audio files needed, works offline.
let ctx = null
let muted = false

export const isMuted = () => muted
export const toggleMuted = () => { muted = !muted; return muted }

function ac() {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    try { ctx = new AC() } catch { return null }
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {})
  return ctx
}

function tone(freq, dur, opts = {}) {
  if (muted) return
  const c = ac(); if (!c) return
  const { type = 'sine', vol = 0.12, delay = 0, to = 0 } = opts
  const t0 = c.currentTime + delay
  const o = c.createOscillator()
  const g = c.createGain()
  o.type = type
  o.frequency.setValueAtTime(freq, t0)
  if (to) o.frequency.exponentialRampToValueAtTime(Math.max(30, to), t0 + dur)
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(vol, t0 + 0.02)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  o.connect(g); g.connect(c.destination)
  o.start(t0); o.stop(t0 + dur + 0.06)
}

function noise(dur, vol = 0.12) {
  if (muted) return
  const c = ac(); if (!c) return
  const t0 = c.currentTime
  const len = Math.max(1, Math.floor(c.sampleRate * dur))
  const buf = c.createBuffer(1, len, c.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len)
  const src = c.createBufferSource(); src.buffer = buf
  const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 1500
  const g = c.createGain(); g.gain.value = vol
  src.connect(f); f.connect(g); g.connect(c.destination)
  src.start(t0)
}

export const sfx = {
  click:   () => tone(680, 0.07, { type: 'triangle', vol: 0.1 }),
  tick:    () => tone(920, 0.05, { type: 'sine', vol: 0.05 }),
  run:     () => {
    tone(300, 0.14, { type: 'sawtooth', vol: 0.09, to: 520 })
    tone(660, 0.1, { type: 'triangle', vol: 0.08, delay: 0.1 })
  },
  success: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.18, { type: 'triangle', vol: 0.13, delay: i * 0.1 })),
  wrong:   () => {
    tone(240, 0.18, { type: 'square', vol: 0.08 })
    tone(170, 0.26, { type: 'square', vol: 0.08, delay: 0.14 })
  },
  miss:    () => tone(320, 0.25, { type: 'sine', vol: 0.07, to: 190 }),
  shatter: () => { noise(0.5, 0.16); tone(160, 0.4, { type: 'sawtooth', vol: 0.09, to: 60 }) },
  dissolve:() => { noise(0.45, 0.08); tone(500, 0.35, { type: 'sine', vol: 0.07, to: 180 }) },
  unlock:  () => [523, 784, 1047].forEach((f, i) => tone(f, 0.2, { type: 'sine', vol: 0.12, delay: i * 0.08 })),
  pop:     () => tone(1100, 0.08, { type: 'sine', vol: 0.1 }),
}
