import ScrollSpy from 'react-scrollspy-navigation'

// Uniform sticky scrollspy chip bar used on every page.
// sections = [{ id, label }] — ids must exist on elements in the current view.
// contained = true when mounted inside an already max-w/padded container
// (keeps chips aligned with the content below instead of double-insetting).
export default function PageSpy({ sections, contained = false }) {
  if (!sections || sections.length === 0) return null
  const spy = (
    <ScrollSpy activeClass="spy-active" offsetTop={128}>
      <nav
        aria-label="On this page"
        className="spy-scroll flex min-w-max items-center gap-2 overflow-x-auto py-2"
      >
        {sections.map((s) => (
          <a key={s.id} href={`#${s.id}`} className="spy-pill">
            {s.label}
          </a>
        ))}
      </nav>
    </ScrollSpy>
  )
  return (
    <div className="sticky top-[70px] z-40 border-b border-[#D7CCC8] bg-[#FAF7F2]/95 shadow-sm shadow-[#3E2723]/10 backdrop-blur">
      {contained ? (
        spy
      ) : (
        <div className="mx-auto max-w-6xl px-4 sm:px-6">{spy}</div>
      )}
    </div>
  )
}
