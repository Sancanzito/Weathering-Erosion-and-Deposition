export default function Questions({ onBack, onReset }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <button
        onClick={onBack}
        className="btn-anim mb-4 rounded-full border border-[#8D6E63]/40 px-4 py-1.5 text-xs font-bold text-[#5D4037] hover:bg-[#EFEBE9]"
      >
        ← Back to Main
      </button>
      <div className="rounded-3xl bg-gradient-to-br from-[#5D4037] to-[#A1887F] p-7 text-white sm:p-9">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#EFEBE9]/80">
          Check yourself
        </p>
        <h2 className="mt-1 text-3xl font-black">Questions</h2>
        <p className="mt-4 rounded-2xl bg-black/20 p-4 text-sm leading-relaxed">
          Considering that weathering destroys steel and concrete buildings,
          erosion erodes soil and often covers infrastructure while deposition
          disperses water in an area. Are these geological processes still
          beneficial to us humans? Defend your answer using examples.
        </p>
        <button
          onClick={onReset}
          className="mt-5 rounded-full bg-[#EFEBE9] px-5 py-2.5 text-sm font-extrabold text-[#4E342E] hover:bg-white"
        >
          ⟲ Reset to Main
        </button>
      </div>
    </section>
  )
}
