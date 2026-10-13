import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import WeatherImage from './WeatherImage.jsx'
import KnowledgeCheck from './KnowledgeCheck.jsx'
import { sfx } from '../lib/sounds.js'

import landslideImg from '../assets/images/landslide.jpg'
import depositionImg from '../assets/images/deposition.jpg'
import depositionDiagramImg from '../assets/images/deposition erosion diagram.jpg'
import erosionVideo from '../assets/erosion_deposition_1_minute.mp4'

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5 },
}

const EROSION_AGENTS = [
  { icon: '💧', name: 'Running water', desc: 'Rivers and rainfall carve channels, wash soil downslope and carry sediment away — the most powerful and common erosion agent.' },
  { icon: '💨', name: 'Wind', desc: 'In dry, open areas wind lifts dust and sand, blasting and abrading surfaces as it travels.' },
  { icon: '🧊', name: 'Ice (glaciers)', desc: 'Slow-moving ice sheets pluck and grind rock, scraping valleys into steep U-shapes as they advance.' },
  { icon: '⬇️', name: 'Gravity', desc: 'Pulls weathered material downhill — landslides, rockfalls and mudflows, also called mass wasting.' },
]

const DEPOSITION_AGENTS = [
  { icon: '💧', name: 'Slowing water', desc: 'When rivers and floods lose speed they drop their sediment — building floodplains, deltas and alluvial fans.' },
  { icon: '💨', name: 'Wind', desc: 'Losing energy, wind sets its load down — laying down loess plains and stacking sand dunes.' },
  { icon: '🧊', name: 'Melting glaciers', desc: 'Retreating ice leaves mixed debris behind: till, moraines and drumlins.' },
  { icon: '🌊', name: 'Ocean waves', desc: 'Waves run out of energy at the coast and lay sand down — beaches, sandbars, spits and tombolos.' },
]

function YouTubeVideo({ src, poster }) {
  const ref = useRef(null)
  const [playing, setPlaying] = useState(false)

  const play = () => {
    sfx.click()
    ref.current?.play()?.catch(() => {})
  }

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-[#D7CCC8] bg-black shadow-lg">
      <div className="relative aspect-video w-full">
        <video
          ref={ref}
          src={src}
          poster={poster}
          playsInline
          controls
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          className="absolute inset-0 h-full w-full bg-black object-contain"
        />
        {!playing && (
          <div className="pointer-events-none absolute inset-0 grid place-items-center bg-black/30 transition hover:bg-black/20">
            <button
              onClick={play}
              aria-label="Play video"
              className="pointer-events-auto grid h-16 w-16 place-items-center rounded-full bg-[#FF0000] shadow-[0_10px_28px_rgba(0,0,0,0.5)] transition hover:scale-110 hover:bg-[#FF1A1A] sm:h-20 sm:w-20"
            >
              <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7 fill-white sm:h-9 sm:w-9">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ErosionDetail() {
  return (
    <div className="mt-4 space-y-4">
      {/* Intro — the video now lives at the end of the lesson */}
      <section id="erosion-intro" className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h2 className="text-3xl font-black text-[#3E2723] sm:text-5xl">Erosion &amp; Deposition</h2>
        <p className="mt-3 text-lg leading-relaxed text-[#4E342E] sm:text-xl">
          Two halves of the same journey: material is <b>worn away and carried off</b> by
          erosion, then <b>dropped and settled</b> again by deposition. Explore each
          process below — and the agents that drive them — then watch the clip at the
          end of the page to see it all together.
        </p>
      </section>

      {/* EROSION — its own section */}
      <motion.section id="erosion" {...fadeUp} className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h2 className="text-3xl font-black text-[#3E2723] sm:text-5xl">🌊 Erosion</h2>
        <p className="mt-3 text-lg leading-relaxed text-[#4E342E] sm:text-xl">
          <b>Erosion</b> is the wearing away and removal of soil and rock by water, wind,
          or ice. The material does not just break — it is <b>transported somewhere else</b>.
        </p>
        <WeatherImage
          src={landslideImg}
          alt="Landslide — weathered slope giving way"
          caption="Why it matters: weakened, weathered slopes can give way as landslides."
        />
        <h3 className="mt-8 text-2xl font-black text-[#5D4037] sm:text-4xl">
          What are the agents of erosion?
        </h3>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {EROSION_AGENTS.map((a) => (
            <div key={a.name} className="rounded-2xl border border-[#D7CCC8] bg-gradient-to-br from-[#FFF8F0] to-[#EFEBE9] p-5 shadow-sm sm:p-6">
              <span className="text-4xl">{a.icon}</span>
              <p className="mt-2 text-xl font-black text-[#3E2723] sm:text-2xl">{a.name}</p>
              <p className="mt-1 text-base leading-relaxed text-[#5D4037] sm:text-lg">{a.desc}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* DEPOSITION — its own section */}
      <motion.section id="deposition" {...fadeUp} className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h2 className="text-3xl font-black text-[#3E2723] sm:text-5xl">🏖️ Deposition</h2>
        <p className="mt-3 text-lg leading-relaxed text-[#4E342E] sm:text-xl">
          <b>Deposition</b> is the dropping off and settling of eroded materials, often by
          slowing water, wind, or gravity. Wherever an agent loses energy, it <b>lays its
          load down</b> — and new landforms grow.
        </p>
        <WeatherImage
          src={depositionImg}
          alt="Sediment deposited by slowing water"
          caption="Sediment settles out as water slows — layer by layer."
        />
        <WeatherImage
          src={depositionDiagramImg}
          alt="Diagram linking erosion to deposition"
          caption="The hand-off: erosion carries the material, deposition builds the landform."
        />
        <h3 className="mt-8 text-2xl font-black text-[#5D4037] sm:text-4xl">
          What are the agents of deposition?
        </h3>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {DEPOSITION_AGENTS.map((a) => (
            <div key={a.name} className="rounded-2xl border border-[#D7CCC8] bg-gradient-to-br from-[#FFF8F0] to-[#EFEBE9] p-5 shadow-sm sm:p-6">
              <span className="text-4xl">{a.icon}</span>
              <p className="mt-2 text-xl font-black text-[#3E2723] sm:text-2xl">{a.name}</p>
              <p className="mt-1 text-base leading-relaxed text-[#5D4037] sm:text-lg">{a.desc}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Video — placed at the last part of the lesson, just before the check */}
      <section id="erosion-video" className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h2 className="text-3xl font-black text-[#3E2723] sm:text-5xl">🎬 Watch it in action</h2>
        <p className="mt-3 text-lg leading-relaxed text-[#4E342E] sm:text-xl">
          See erosion and deposition working together to reshape our landscapes over time.
        </p>
        <YouTubeVideo src={erosionVideo} poster={landslideImg} />
        <p className="mt-3 text-center text-sm text-[#8D6E63]">
          One minute recap — then prove what you learned below.
        </p>
      </section>

      {/* Last stage of the lesson — 3 questions, explanation either way, confetti ×3 if perfect */}
      <section id="knowledge-check" className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <KnowledgeCheck
          title="Erosion & Deposition — knowledge check"
          questions={[
            {
              text: 'Which of the following is an example of erosion?',
              options: [
                { label: 'Water carrying away soil down a slope', correct: true, explain: 'Water moving soil downslope is classic erosion — materials are transported away from their original location.' },
                { label: 'A river dropping sediment to form a delta', correct: false, explainWrong: 'A delta is deposition — sediment is dropped and accumulates, not removed.' },
                { label: 'Wind picking up dust and carrying it across a field', correct: false, explainWrong: 'Wind erosion occurs, but the question asks for deposition examples. Deltas are a key deposition feature.' },
              ],
            },
            {
              text: 'What force is primarily responsible for glacial erosion?',
              options: [
                { label: 'Ice pushing and scraping the ground', correct: true, explain: 'Glaciers act like giant sandpaper, plucking rock fragments and grinding them as they move.' },
                { label: 'Chemical reactions breaking down minerals', correct: false, explainWrong: 'That\'s chemical weathering, not glacial erosion — mechanical force is key here.' },
                { label: 'Plant roots wedging cracks apart', correct: false, explainWrong: 'Biological weathering, not glacial. Glacial erosion is driven by the weight and movement of ice.' },
              ],
            },
            {
              text: 'Why are river deltas important for deposition?',
              options: [
                { label: 'They drop sediment where the river meets slower water', correct: true, explain: 'Deltas form because river flow slows dramatically at the coast, causing suspended sediment to settle out.' },
                { label: 'They freeze solid in cold climates', correct: false, explainWrong: 'Rivers don\'t freeze to become deltas — that\'s ice, not deposition.' },
                { label: 'They are formed by volcanic activity', correct: false, explainWrong: 'Volcanic activity creates landforms, not river deltas. Deltas are purely sedimentary deposits.' },
              ],
            },
          ]}
        />
      </section>
    </div>
  )
}
