import { motion } from 'framer-motion'
import WeatherImage from './WeatherImage.jsx'
import KnowledgeCheck from './KnowledgeCheck.jsx'

import frostImg from '../assets/images/frost wedging.jpg'
import rootImg from '../assets/images/root wedging.jpg'
import abrasionImg from '../assets/images/abrassion.jpg'
import thermalImg from '../assets/images/thermal expansion.jpg'

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5 },
}

const processes = [
  {
    id: 'frost',
    title: 'Frost wedging',
    accent: 'border-[#7FB7D4]',
    chip: 'bg-[#7FB7D4]/20 text-[#2F5568]',
    body: 'Water seeps into cracks in rock. When temperatures drop below freezing, the water turns to ice and expands by about 9%. The growing ice pushes the crack walls apart. When it thaws, the water sinks deeper, and the next freeze widens the crack again.',
    img: frostImg,
    alt: 'Frost wedging — ice splitting rock',
    caption: 'Ice expands ~9% in cracks, prying rock apart over repeated freeze-thaw cycles.',
    facts: [
      'Needs repeated freeze-thaw cycles around 0 °C.',
      'Produces angular rock fragments that pile up as talus (scree) at cliff bases.',
    ],
    where: 'Common in mountains and cold climates.',
  },
  {
    id: 'root',
    title: 'Root wedging',
    accent: 'border-[#6D4C41]',
    chip: 'bg-[#6D4C41]/15 text-[#4E342E]',
    body: 'Seeds land in cracks and sprout. As roots grow and thicken, they press against the crack walls with steady force. Over years, the crack widens and the rock can split. Roots also pull in water, which speeds up other kinds of weathering.',
    img: rootImg,
    alt: 'Root wedging — roots splitting rock',
    caption: 'Growing roots press outward with steady force, widening cracks year after year.',
    facts: [
      'A biological process, but the rock is only broken apart, not chemically changed.',
      'Visible in sidewalks, walls and rocky hillsides where trees grow.',
    ],
    where: 'Common wherever plants grow in rocky ground.',
  },
  {
    id: 'abrasion',
    title: 'Abrasion',
    accent: 'border-[#8D6E63]',
    chip: 'bg-[#8D6E63]/15 text-[#4E342E]',
    body: 'Rock surfaces are worn down when other particles scrape across them. Wind carries sand, rivers roll pebbles along their beds, glaciers drag embedded stones, and waves hurl gravel at cliffs. Each collision removes tiny bits, smoothing and rounding the rock over time.',
    img: abrasionImg,
    alt: 'Abrasion — sand and water wearing rock',
    caption: 'Wind, water and ice drag particles that sandpaper rock smooth and round.',
    facts: [
      'Works faster when the particles are hard and the flow is fast.',
      'Creates rounded river stones, polished canyon walls and wind-sculpted desert rocks.',
    ],
    where: 'Common in rivers, deserts, coasts and glaciated valleys.',
  },
  {
    id: 'thermal',
    title: 'Thermal expansion',
    accent: 'border-[#D9892B]',
    chip: 'bg-[#D9892B]/15 text-[#7A4A12]',
    body: 'Rock heats up in daytime sun and cools at night. Minerals expand and contract by different amounts, and the hot outer layer expands more than the cooler interior. Repeated stress over many cycles creates tiny cracks that grow until pieces flake or split off.',
    img: thermalImg,
    alt: 'Thermal expansion — sun heating and night cooling rock',
    caption: 'Daily heating and cooling stresses minerals until thin sheets flake off.',
    facts: [
      'Strongest where daily temperature swings are large.',
      'Often leads to exfoliation, where thin rock sheets peel off like onion skin.',
    ],
    where: 'Common in deserts and high, dry regions.',
  },
]

export default function PhysicalDetail() {
  return (
    <div className="mt-4 space-y-4">
      {/* Intro — PHYSICAL only */}
      <div className="rounded-2xl bg-gradient-to-r from-[#4E342E] to-[#8D6E63] p-5 text-[#FFF8F0]">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#EFEBE9]/80">
          Physical weathering • Disintegration
        </p>
        <h3 className="mt-1 text-2xl font-black leading-tight">
          How rock breaks without changing
        </h3>
        <p className="mt-2 max-w-[65ch] text-sm leading-relaxed text-[#EFEBE9]/95">
          Mechanical weathering splits solid rock into smaller pieces without
          altering its chemistry. Four common processes do most of the work.
        </p>
      </div>

      {processes.map((p) => (
        <motion.article
          key={p.id}
          {...fadeUp}
          id={`physical-${p.id}`}
          className={`rounded-2xl border-l-8 ${p.accent} bg-white p-5 shadow-sm sm:p-6`}
        >
          <span className={`inline-block rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] ${p.chip}`}>
            {p.title}
          </span>
          <h3 className="mt-2 text-xl font-extrabold text-[#3E2723]">{p.title}</h3>
          <p className="mt-2 max-w-[65ch] text-[15px] leading-relaxed text-[#4E342E]">
            {p.body}
          </p>

          <WeatherImage src={p.img} alt={p.alt} caption={p.caption} />

          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[#5D4037]">
            {p.facts.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
          <p className="mt-2 text-sm italic text-[#8D6E63]">{p.where}</p>
        </motion.article>
      ))}

      {/* Side by side table */}
      <motion.div {...fadeUp} className="overflow-hidden rounded-2xl bg-[#3E2723] p-5 text-[#EFEBE9] sm:p-6">
        <h3 className="text-lg font-extrabold">Side by side</h3>
        <div className="mt-3 overflow-x-auto rounded-xl bg-[#FFF8F0] text-[#3E2723]">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[#D7CCC8]/60 text-left">
                <th className="px-3 py-2">Process</th>
                <th className="px-3 py-2">Driving force</th>
                <th className="px-3 py-2">Typical setting</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-[#D7CCC8]">
                <td className="px-3 py-2 font-bold">Frost wedging</td>
                <td className="px-3 py-2">Water freezing and expanding</td>
                <td className="px-3 py-2">Cold, wet mountains</td>
              </tr>
              <tr className="border-t border-[#D7CCC8]">
                <td className="px-3 py-2 font-bold">Root wedging</td>
                <td className="px-3 py-2">Growing plant roots</td>
                <td className="px-3 py-2">Vegetated rocky ground</td>
              </tr>
              <tr className="border-t border-[#D7CCC8]">
                <td className="px-3 py-2 font-bold">Abrasion</td>
                <td className="px-3 py-2">Moving particles scraping rock</td>
                <td className="px-3 py-2">Rivers, deserts, coasts</td>
              </tr>
              <tr className="border-t border-[#D7CCC8]">
                <td className="px-3 py-2 font-bold">Thermal expansion</td>
                <td className="px-3 py-2">Repeated heating and cooling</td>
                <td className="px-3 py-2">Hot deserts</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-center text-xs text-[#D7CCC8]">
          Mechanical weathering: the first step in turning rock into sediment and soil.
        </p>
      </motion.div>

      {/* Last stage of the lesson — 3 questions, explanation either way, confetti ×3 if perfect */}
      <KnowledgeCheck
        title="Physical — knowledge check"
        questions={[
          {
            text: 'What does frost wedging need to split a rock?',
            options: [
              { label: 'Water in the crack + nights below 0 °C + days above', correct: true, explain: 'Water seeps in, freezes, expands ~9% and pries the crack open. Thaw sends water deeper, and the next freeze widens it again — same minerals the whole time.' },
              { label: 'Only strong wind blowing over the rock', correct: false, explainWrong: 'Wind matters for abrasion (sand scraping), but ice needs water AND crossing 0 °C to wedge a crack apart.' },
              { label: 'Acid rain dissolving the crack', correct: false, explainWrong: 'Acid works on limestone chemically. Frost wedging is pure mechanics — ice expansion, no chemical change.' },
            ],
          },
          {
            text: 'When water freezes into ice it takes up about…',
            options: [
              { label: '9% more space — that pressure pries rock open', correct: true, explain: 'Ice’s ~9% expansion in a confined crack creates enormous outward force — enough to split boulders over freeze–thaw cycles.' },
              { label: 'The same space — nothing changes', correct: false, explainWrong: 'If ice did not expand there would be no prying force at all. The volume gain is exactly what drives the crack wider.' },
              { label: 'Less space — ice shrinks in the crack', correct: false, explainWrong: 'Ice grows (like an ice tray’s cube standing proud). Shrinking would leave the crack untouched.' },
            ],
          },
          {
            text: 'After frost wedging splits a rock, the fragments contain…',
            options: [
              { label: 'The same minerals as the original rock', correct: true, explain: 'Only size and shape changed — mechanical force breaks physical bonds but never rebuilds minerals. That is what makes this physical, not chemical.' },
              { label: 'Brand-new minerals created by the ice', correct: false, explainWrong: 'Ice cannot manufacture minerals — a chemical change would be needed to make something new. The pieces are just smaller versions of the same rock.' },
              { label: 'No minerals — the rock vanished', correct: false, explainWrong: 'Nothing vanished; it is all still there as fragments (talus/scree). Mass stays, chemistry stays.' },
            ],
          },
        ]}
      />
    </div>
  )
}
