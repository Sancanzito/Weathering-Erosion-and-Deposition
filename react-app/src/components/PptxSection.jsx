import { sfx } from '../lib/sounds.js'

// The class presentation lives in Canva — this button opens it in a new tab.
const CANVA_URL = 'https://canva.link/mh3k0pq98cco826'

export default function PptxSection() {
  if (!CANVA_URL) return null
  return (
    <section id="presentation" className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <a
        href={CANVA_URL}
        target="_blank"
        rel="noreferrer"
        onClick={() => sfx.click()}
        className="group flex w-full flex-col items-center justify-center gap-3 rounded-3xl border-2 border-[#D9892B]/60 bg-gradient-to-br from-[#2B1D16] via-[#5D4037] to-[#8D6E63] px-6 py-12 text-center shadow-[0_18px_45px_-18px_rgba(62,39,35,0.75)] transition hover:brightness-110 sm:py-16"
      >
        <span className="text-4xl sm:text-5xl">📊</span>
        <span className="bg-gradient-to-r from-[#FFD54F] via-[#FF8A65] to-[#4FC3F7] bg-clip-text text-3xl font-black uppercase leading-tight tracking-tight text-transparent drop-shadow-[0_0_24px_rgba(255,180,80,0.5)] transition-all duration-500 group-hover:drop-shadow-[0_0_36px_rgba(255,180,80,0.85)] sm:text-5xl md:text-6xl">
          Click here to open the PPT
        </span>
        <span className="text-xs font-extrabold uppercase tracking-[0.35em] text-[#D7CCC8] transition-colors duration-300 group-hover:text-[#FFD54F] sm:text-sm">
          View the presentation in Canva →
        </span>
        <span className="text-[11px] font-semibold text-[#BCAAA4]/80">
          Opens in a new tab · needs internet
        </span>
      </a>
    </section>
  )
}
