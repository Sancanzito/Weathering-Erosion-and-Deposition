import { motion } from 'framer-motion'
import WeatherImage from './WeatherImage.jsx'
import KnowledgeCheck from './KnowledgeCheck.jsx'

import vennImg from '../assets/images/venn diagram of weathering of rocks.jpg'
import oxidationImg from '../assets/images/oxidation.jpg'
import carbonationImg from '../assets/images/carbonation.jpg'
import carbonationFormulaImg from '../assets/images/carbonation chemical formula.png'
import dissolutionImg from '../assets/images/dissolution.jpg'
import hydrolysisImg from '../assets/images/hydrolysis.jpg'
import hydrationImg from '../assets/images/hydration.jpg'

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5 },
}

const processes = [
  {
    id: 'oxidation',
    num: '1. Oxidation',
    accent: 'border-[#A8482A]',
    chip: 'bg-[#A8482A]/15 text-[#7A2E18]',
    body: 'Oxygen reacts with minerals that contain iron. The iron forms iron oxides, which give rocks a reddish-brown color and often make the surface crumbly. In many environments, water speeds up this process.',
    img: oxidationImg,
    alt: 'Oxidation — rusty iron-rich rock',
    caption: 'Iron minerals exposed to oxygen and water develop a rust-like, crumbly coating.',
    equations: ['4Fe + 3O₂ + 2H₂O → 2Fe₂O₃·H₂O (Limonite, rust)'],
    example: 'Iron-rich rocks developing a rust-like coating, weakening the entire structure.',
  },
  {
    id: 'carbonation',
    num: '2. Carbonation',
    accent: 'border-[#3F7F7A]',
    chip: 'bg-[#3F7F7A]/15 text-[#265451]',
    body: 'Carbon dioxide dissolves in rainwater and forms weak carbonic acid. This acid reacts with limestone (calcite) and dissolves it, slowly carving out holes and passages underground.',
    img: carbonationImg,
    alt: 'Carbonation — limestone cave formation',
    caption: 'Rain + CO₂ forms weak acid that dissolves limestone into caves and karst.',
    formulaImg: carbonationFormulaImg,
    equations: [
      'CO₂ + H₂O → H₂CO₃ (carbonic acid)',
      'CaCO₃ + H₂CO₃ → Ca²⁺ + 2HCO₃⁻ (dissolved)',
    ],
    example: 'The formation of vast limestone caves and dramatic karst landscapes.',
  },
  {
    id: 'dissolution',
    num: '3. Dissolution',
    accent: 'border-[#8C7AB0]',
    chip: 'bg-[#8C7AB0]/15 text-[#57467A]',
    body: 'Water dissolves certain minerals directly and carries the dissolved material away. Unlike carbonation, no external acid is required. Minerals like halite (rock salt) and gypsum are especially easy for water to remove.',
    img: dissolutionImg,
    alt: 'Dissolution — salt dissolving in water',
    caption: 'Halite and gypsum dissolve directly in water with no acid needed.',
    equations: ['NaCl + H₂O → Na⁺ + Cl⁻ (dissolved ions)'],
    example: 'Rock salt dissolving when exposed to fresh water, creating salt pans or sinkholes.',
  },
  {
    id: 'hydrolysis',
    num: '4. Hydrolysis',
    accent: 'border-[#B0793F]',
    chip: 'bg-[#B0793F]/15 text-[#7A4F20]',
    body: 'Water reacts chemically with minerals and changes them into new minerals, often clay minerals. Unlike dissolution, the original mineral does not simply wash away: it decomposes into something different.',
    img: hydrolysisImg,
    alt: 'Hydrolysis — feldspar turning to clay',
    caption: 'Feldspar breaks down and recombines into soft kaolinite clay.',
    equations: [
      '2KAlSi₃O₈ + 2H₂CO₃ + 9H₂O → Al₂Si₂O₅(OH)₄ (Kaolinite) + 4H₄SiO₄ + 2K⁺ + 2HCO₃⁻',
    ],
    example: 'Feldspar in granite changing into clay minerals, causing the granite to crumble.',
  },
  {
    id: 'hydration',
    num: '5. Hydration',
    accent: 'border-[#3D7FB5]',
    chip: 'bg-[#3D7FB5]/15 text-[#245A85]',
    body: 'Some minerals take water molecules directly into their crystal structure. The mineral swells and changes form, which can weaken the rock and make it easier for subsequent physical weathering to break it apart.',
    img: hydrationImg,
    alt: 'Hydration — anhydrite swelling into gypsum',
    caption: 'Anhydrite absorbs water, swells into gypsum and stresses the rock.',
    equations: ['CaSO₄ + 2H₂O → CaSO₄·2H₂O (Gypsum, larger volume)'],
    example: 'Anhydrite absorbing water and transforming into gypsum, causing structural stress.',
  },
]

export default function ChemicalDetail() {
  return (
    <div className="mt-4 space-y-4">
      {/* Intro — CHEMICAL only */}
      <div className="rounded-2xl bg-gradient-to-r from-[#2B1D16] to-[#6D4C41] p-5 text-[#FFF8F0]">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#D7CCC8]">
          Chemical weathering • Decomposition
        </p>
        <h3 className="mt-1 text-2xl font-black leading-tight">
          Chemical vs. Physical Weathering
        </h3>
        <p className="mt-2 max-w-[65ch] text-sm leading-relaxed text-[#EFEBE9]/95">
          Both break down rock, but chemical weathering changes{' '}
          <i>what rock is made of</i> — creating new substances.
        </p>
      </div>

      {/* Comparison */}
      <motion.div {...fadeUp} id="chem-compare" className="rounded-2xl border-l-8 border-[#D7CCC8] bg-white p-5 shadow-sm sm:p-6">
        <h3 className="text-xl font-extrabold text-[#3E2723]">
          The Difference: Changes Substance vs. Size
        </h3>
        <WeatherImage
          src={vennImg}
          alt="Venn diagram of weathering of rocks"
          caption="Venn diagram: physical weathering changes size and shape; chemical weathering changes composition and creates new materials."
        />
        <p className="max-w-[65ch] text-[15px] leading-relaxed text-[#4E342E]">
          <b>Chemical weathering</b> (decomposition) changes the{' '}
          <i>chemical composition</i> of the rock, creating new substances,
          while <b>physical weathering</b> (disintegration) only changes the{' '}
          <i>size and shape</i> without altering chemistry.
        </p>
      </motion.div>

      {processes.map((p) => (
        <motion.article
          key={p.id}
          {...fadeUp}
          id={`chemical-${p.id}`}
          className={`rounded-2xl border-l-8 ${p.accent} bg-white p-5 shadow-sm sm:p-6`}
        >
          <span className={`inline-block rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] ${p.chip}`}>
            {p.num}
          </span>
          <p className="mt-2 max-w-[65ch] text-[15px] leading-relaxed text-[#4E342E]">
            {p.body}
          </p>

          <WeatherImage
            src={p.img}
            alt={p.alt}
            caption={p.caption}
            formula={p.equations[0]}
            formulaImg={p.formulaImg}
          />
          {p.equations.slice(1).map((eq, i) => (
            <p
              key={i}
              className="mb-2 max-w-[65ch] overflow-x-auto rounded-lg bg-[#EFEBE9] px-3 py-2 font-mono text-[13px] text-[#4E342E]"
            >
              {eq}
            </p>
          ))}
          <p className="border-t border-[#D7CCC8] pt-3 text-sm text-[#5D4037]">
            <b>Example:</b> {p.example}
          </p>
        </motion.article>
      ))}

      {/* Table */}
      <motion.div {...fadeUp} className="overflow-hidden rounded-2xl bg-[#3E2723] p-5 text-[#EFEBE9] sm:p-6">
        <h3 className="text-lg font-extrabold">Side by side</h3>
        <div className="mt-3 overflow-x-auto rounded-xl bg-[#FFF8F0] text-[#3E2723]">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr className="bg-[#D7CCC8]/60 text-left">
                <th className="px-3 py-2">Process</th>
                <th className="px-3 py-2">Key agent</th>
                <th className="px-3 py-2">Main chemical change</th>
                <th className="px-3 py-2">Result</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-[#D7CCC8]">
                <td className="px-3 py-2 font-bold">Oxidation</td>
                <td className="px-3 py-2">Oxygen (+ water)</td>
                <td className="px-3 py-2">Iron forms reddish oxides (Limonite)</td>
                <td className="px-3 py-2">Brittle, rusty rock</td>
              </tr>
              <tr className="border-t border-[#D7CCC8]">
                <td className="px-3 py-2 font-bold">Carbonation</td>
                <td className="px-3 py-2">Carbonic acid</td>
                <td className="px-3 py-2">Limestone → calcium bicarbonate</td>
                <td className="px-3 py-2">Caves and karst</td>
              </tr>
              <tr className="border-t border-[#D7CCC8]">
                <td className="px-3 py-2 font-bold">Dissolution</td>
                <td className="px-3 py-2">Water</td>
                <td className="px-3 py-2">Halite dissolves into ions</td>
                <td className="px-3 py-2">Salt washes away</td>
              </tr>
              <tr className="border-t border-[#D7CCC8]">
                <td className="px-3 py-2 font-bold">Hydrolysis</td>
                <td className="px-3 py-2">Water (+ mild acid)</td>
                <td className="px-3 py-2">Feldspar → clay minerals</td>
                <td className="px-3 py-2">Granite crumbles</td>
              </tr>
              <tr className="border-t border-[#D7CCC8]">
                <td className="px-3 py-2 font-bold">Hydration</td>
                <td className="px-3 py-2">Water</td>
                <td className="px-3 py-2">Water enters crystal structure</td>
                <td className="px-3 py-2">Minerals swell</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-center text-xs text-[#D7CCC8]">
          Chemical weathering changes what rock is made of (decomposition), not just its size.
        </p>
      </motion.div>

      {/* Last stage of the lesson — 3 questions, explanation either way, confetti ×3 if perfect */}
      <KnowledgeCheck
        title="Chemical — knowledge check"
        questions={[
          {
            text: 'What changes when a rock is chemically attacked?',
            options: [
              { label: 'Its chemical composition — new substances form', correct: true, explain: 'Decomposition means oxygen, water or acids convert the original minerals into something new (oxides, ions, clay).' },
              { label: 'Only its size — it splits into smaller pieces', correct: false, explainWrong: 'Size-only change comes from mechanical force (ice, roots, sand). Here the material itself becomes new substances.' },
              { label: 'Nothing changes, the rock just gets wet', correct: false, explainWrong: 'Water is a reactant, not just a soak — it carries oxygen and acid that rebuild minerals into new ones.' },
            ],
          },
          {
            text: 'Carbonic acid (rain + CO₂) meets limestone (CaCO₃). What happens?',
            options: [
              { label: 'The limestone dissolves into Ca²⁺ and HCO₃⁻ ions', correct: true, explain: 'CaCO₃ + H₂CO₃ → Ca²⁺ + 2HCO₃⁻. The ions wash away in water — that is how caves and karst form.' },
              { label: 'The limestone freezes and cracks apart', correct: false, explainWrong: 'Freezing is ice physics, not an acid reaction. Here the mineral itself goes into solution.' },
              { label: 'The limestone turns into iron oxide', correct: false, explainWrong: 'Iron oxide comes from oxygen + iron minerals (rust). Limestone has no iron — it dissolves instead.' },
            ],
          },
          {
            text: 'You see a red-brown crust on an iron-rich rock. What caused it?',
            options: [
              { label: 'Oxygen + moisture turned iron minerals into Fe₂O₃', correct: true, explain: '4FeO + O₂ → 2Fe₂O₃ — a new mineral. Remove oxygen or water and the color never appears.' },
              { label: 'Sunlight baked the rock like a desert', correct: false, explainWrong: 'Heat alone only cracks the surface — color change needs an actual chemical reaction with oxygen and water.' },
              { label: 'Sand polished it red', correct: false, explainWrong: 'Abrasion wears surfaces smooth with same-material dust; it cannot change the mineral into a new one.' },
            ],
          },
        ]}
      />
    </div>
  )
}
