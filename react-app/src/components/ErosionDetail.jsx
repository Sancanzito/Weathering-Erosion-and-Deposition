import { motion } from 'framer-motion'
import WeatherImage from './WeatherImage.jsx'
import KnowledgeCheck from './KnowledgeCheck.jsx'

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

export default function ErosionDetail() {
  return (
    <div className="mt-4 space-y-4">
      {/* Intro — EROSION & DEPOSITION only */}
      <section id="erosion-intro" className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h2 className="text-2xl font-black text-[#3E2723] sm:text-3xl">Erosion & Deposition</h2>
        <p className="mt-2 text-[#4E342E]">
          <b>Erosion</b> is the wearing away and removal of soil and rock by water, wind, or ice. 
          <b>Deposition</b> is the dropping off and settling of eroded materials, often by slowing water, wind, or gravity.
        </p>
        <div id="erosion-video" className="mt-4 overflow-hidden rounded-3xl border border-[#D7CCC8] bg-white shadow-sm">
          <video
            src={erosionVideo}
            title="Erosion & Deposition Overview"
            className="w-full"
            controls
            poster={landslideImg}
          />
        </div>
        <p className="mt-2 text-center text-xs text-[#8D6E63]">
          Watch how erosion and deposition shape our landscapes over time.
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
