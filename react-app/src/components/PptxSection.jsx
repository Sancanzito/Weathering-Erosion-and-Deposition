import { useCallback, useEffect, useRef, useState } from 'react'
import { parsePPTX, SlideRenderer } from '@kandiforge/pptx-renderer/dist/lib/index.js'
import { sfx } from '../lib/sounds.js'
import defaultPptx from '../assets/SEAN PPT.pptx?url'

const THUMB_W = 170

// Paste your Canva share link between the quotes to show a one-click
// "Open in Canva" button under the viewer. Leave '' to hide the button.
const CANVA_URL = 'https://canva.link/mh3k0pq98cco826'

// Vite's dev server (and preview) rewrite missing paths to index.html with
// 200 OK + text/html — JSZip then explodes with "Can't find end of central
// directory". So never trust status alone: verify we really got a zip.
async function fetchPptxBuf(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error('not found')
  const ct = (res.headers.get('content-type') || '').toLowerCase()
  if (ct.includes('text/html')) throw new Error('server returned an HTML page instead of the deck')
  const buf = await res.arrayBuffer()
  const b = new Uint8Array(buf, 0, Math.min(2, buf.byteLength))
  if (b[0] !== 0x50 || b[1] !== 0x4b) throw new Error('response is not a zip archive')
  return buf
}

async function looksLikePptx(file) {
  const head = new Uint8Array(await file.slice(0, 2).arrayBuffer())
  return head[0] === 0x50 && head[1] === 0x4b
}

export default function PptxSection() {
  const [source, setSource] = useState(null) // File | ArrayBuffer | URL string
  const [name, setName] = useState('')
  const [err, setErr] = useState('')
  const [drag, setDrag] = useState(false)
  const [busy, setBusy] = useState(false)
  const [deck, setDeck] = useState(null)
  const [idx, setIdx] = useState(0)
  const [tick, setTick] = useState(0)
  const [fileUrl, setFileUrl] = useState('')
  const [office, setOffice] = useState(false)
  const inputRef = useRef(null)
  const mainRef = useRef(null)
  const thumbRefs = useRef([])

  // ── pick up a deck: public/presentation.pptx first, else the bundled SEAN PPT
  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const buf = await fetchPptxBuf('presentation.pptx')
        if (!alive) return
        setSource(buf)
        setName('presentation.pptx')
      } catch {
        if (!alive || !defaultPptx) return
        try {
          const buf = await fetchPptxBuf(defaultPptx)
          if (!alive) return
          setSource(buf)
          setName('SEAN PPT.pptx')
        } catch (e) {
          if (alive) setErr('Could not load the presentation: ' + (e?.message || 'unknown error'))
        }
      }
    })()
    return () => { alive = false }
  }, [])

  // ── object URL so "Download & present in PowerPoint" works for picked files too
  useEffect(() => {
    if (source instanceof File) {
      const u = URL.createObjectURL(source)
      setFileUrl(u)
      return () => { URL.revokeObjectURL(u); setFileUrl('') }
    }
    setFileUrl('')
  }, [source])

  // ── fetch + parse the deck (File, ArrayBuffer, or URL)
  useEffect(() => {
    if (!source) { setDeck(null); return }
    let alive = true
    setBusy(true); setErr(''); setIdx(0); setDeck(null); setOffice(false)
    ;(async () => {
      try {
        let ab
        if (source instanceof ArrayBuffer) {
          ab = source
        } else if (source instanceof File) {
          if (!(await looksLikePptx(source))) throw new Error('that file is not a real .pptx (not a zip archive) — re-save it from PowerPoint as .pptx')
          ab = await source.arrayBuffer()
        } else {
          ab = await fetchPptxBuf(source)
        }
        const data = await parsePPTX(ab)
        if (!alive) return
        if (!data.slides || !data.slides.length) throw new Error('no slides found in this file')
        setDeck(data)
        sfx.pop()
      } catch (e) {
        if (alive) setErr('Could not read that deck: ' + (e?.message || 'unknown error'))
      } finally {
        if (alive) setBusy(false)
      }
    })()
    return () => { alive = false }
  }, [source])

  // ── draw the current slide on the main canvas
  const drawMain = useCallback(async () => {
    const cv = mainRef.current
    if (!cv || !deck) return
    try {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const cssW = Math.max(cv.clientWidth || 960, 320)
      const cssH = Math.round(cssW * deck.size.height / deck.size.width)
      const r = new SlideRenderer(cv, {
        width: cssW, height: cssH, scale: dpr,
        slideWidth: deck.size.width, slideHeight: deck.size.height,
      })
      await r.renderSlide(deck.slides[idx])
    } catch (e) {
      setErr('A slide failed to draw: ' + (e?.message || 'unknown error'))
    }
  }, [deck, idx])

  useEffect(() => { drawMain() }, [drawMain, tick])

  // ── redraw on window resize (debounced)
  useEffect(() => {
    if (!deck) return
    let t = null
    const onResize = () => { clearTimeout(t); t = setTimeout(() => setTick((v) => v + 1), 180) }
    window.addEventListener('resize', onResize)
    return () => { window.removeEventListener('resize', onResize); clearTimeout(t) }
  }, [deck])

  // ── filmstrip thumbnails
  useEffect(() => {
    if (!deck) return
    let alive = true
    ;(async () => {
      const h = Math.round(THUMB_W * deck.size.height / deck.size.width)
      for (let i = 0; i < deck.slides.length; i++) {
        if (!alive) return
        const cv = thumbRefs.current[i]
        if (!cv) continue
        try {
          const dpr = Math.min(window.devicePixelRatio || 1, 2)
          const r = new SlideRenderer(cv, {
            width: THUMB_W, height: h, scale: dpr,
            slideWidth: deck.size.width, slideHeight: deck.size.height,
          })
          await r.renderSlide(deck.slides[i])
        } catch { /* thumbnail skipped — main slide still works */ }
      }
    })()
    return () => { alive = false }
  }, [deck])

  // ── arrow keys step through slides while presenting
  useEffect(() => {
    if (!deck) return
    const onKey = (e) => {
      const t = e.target
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return
      setIdx((i) => {
        if (e.key === 'ArrowRight' && i < deck.slides.length - 1) { sfx.tick(); return i + 1 }
        if (e.key === 'ArrowLeft' && i > 0) { sfx.tick(); return i - 1 }
        return i
      })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [deck])

  const n = deck ? deck.slides.length : 0
  const go = (d) => {
    setIdx((i) => {
      const j = Math.min(Math.max(i + d, 0), n - 1)
      if (j !== i) sfx.tick()
      return j
    })
  }

  const load = async (f) => {
    if (!f) return
    if (!/\.pptx?$/i.test(f.name)) {
      setErr('Please choose a PowerPoint file (.pptx).')
      return
    }
    if (!(await looksLikePptx(f))) {
      setErr('That file is not a real .pptx — it is not a zip archive. Open it in PowerPoint and re-save it as .pptx, then try again.')
      sfx.wrong()
      return
    }
    setErr('')
    setName(f.name)
    setSource(f)
    sfx.pop()
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDrag(false)
    load(e.dataTransfer.files?.[0])
  }

  const clearAll = () => {
    sfx.click()
    setSource(null); setName(''); setErr(''); setDeck(null); setIdx(0); setOffice(false)
  }

  // ── Office Online iframe (Microsoft's cloud renderer — 100% fidelity)
  const deckHref = fileUrl || (name === 'presentation.pptx' ? 'presentation.pptx' : defaultPptx)
  const localOrigin =
    typeof window !== 'undefined' &&
    (['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname) ||
      window.location.protocol === 'file:')

  const openOffice = () => {
    sfx.click()
    if (!deckHref || deckHref.startsWith('blob:') || localOrigin) {
      setErr(
        'Office Online needs a public https:// link to the deck — Microsoft cannot reach your computer while you run the app locally. Deploy the site (GitHub Pages, Netlify, etc.) and this button will work; until then use ⬇️ Download & present in PowerPoint.'
      )
      sfx.wrong()
      return
    }
    setErr('')
    setOffice(true)
  }

  const officeSrc =
    `https://view.officeapps.live.com/op/embed.aspx?src=` +
    encodeURIComponent(new URL(deckHref, window.location.href).href)

  return (
    <section id="presentation" className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="overflow-hidden rounded-3xl border border-[#D7CCC8] bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-[#2B1D16] via-[#5D4037] to-[#8D6E63] px-5 py-4 sm:px-7">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#D7CCC8]">
              📊 Lesson presentation
            </p>
            <h3 className="text-lg font-black text-[#FFF8F0] sm:text-xl">
              {name ? name : 'PowerPoint placeholder'}
            </h3>
          </div>
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="file"
              accept=".pptx,.ppt"
              onChange={(e) => { load(e.target.files?.[0]); e.target.value = '' }}
              className="hidden"
            />
            <button
              onClick={() => { sfx.click(); inputRef.current?.click() }}
              className="btn-anim rounded-full bg-[#EFEBE9] px-4 py-2 text-xs font-extrabold text-[#4E342E] hover:bg-white"
            >
              {source ? '↻ Change file' : '📂 Choose .pptx'}
            </button>
            {source && (
              <button
                onClick={clearAll}
                className="btn-anim rounded-full bg-white/15 px-4 py-2 text-xs font-extrabold text-[#FFF8F0] hover:bg-white/25"
              >
                ✕ Clear
              </button>
            )}
          </div>
        </div>

        {err && (
          <p className="border-b border-[#F3D2CB] bg-[#B3402F]/10 px-5 py-2.5 text-sm font-bold text-[#8A2F20]">
            {err}
          </p>
        )}

        {source ? (
          <div className="p-3 sm:p-5">
            {busy && (
              <div className="grid min-h-[220px] place-items-center rounded-2xl border border-[#D7CCC8] bg-[#FAF7F2] text-center">
                <div>
                  <p className="text-3xl">📖</p>
                  <p className="mt-2 text-sm font-extrabold text-[#4E342E]">Reading your presentation…</p>
                  <p className="text-xs text-[#8D6E63]">Parsing slides in your browser</p>
                </div>
              </div>
            )}

            {!busy && deck && (
              <>
                {office ? (
                  /* Microsoft's official cloud renderer — full PowerPoint fidelity */
                  <div className="overflow-hidden rounded-2xl border border-[#D7CCC8] bg-white">
                    <iframe
                      title="PowerPoint — Office Online"
                      src={officeSrc}
                      className="block w-full border-0"
                      style={{ height: '72vh', minHeight: 480 }}
                    />
                  </div>
                ) : (
                  <>
                    <div className="overflow-hidden rounded-2xl border border-[#D7CCC8] bg-[#2B1D16]">
                      <canvas
                        ref={mainRef}
                        className="block w-full"
                        style={{ aspectRatio: `${deck.size.width} / ${deck.size.height}` }}
                      />
                    </div>

                    <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                      <NavBtn onClick={() => go(-1)} disabled={idx === 0}>◀ Previous</NavBtn>
                      <span className="rounded-full bg-[#EFEBE9] px-4 py-2 text-xs font-extrabold text-[#4E342E]">
                        Slide {idx + 1} / {n}
                      </span>
                      <NavBtn onClick={() => go(1)} disabled={idx >= n - 1}>Next ▶</NavBtn>
                    </div>

                    <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                      {deck.slides.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => { if (i !== idx) { sfx.click(); setIdx(i) } }}
                          className={`btn-anim shrink-0 rounded-lg border-2 bg-[#FAF7F2] transition ${
                            i === idx ? 'border-[#D9892B] shadow-md ring-2 ring-[#D9892B]/40' : 'border-[#D7CCC8] hover:border-[#8D6E63]'
                          }`}
                          style={{ width: THUMB_W }}
                          aria-label={`Go to slide ${i + 1}`}
                        >
                          <canvas
                            ref={(el) => { thumbRefs.current[i] = el }}
                            className="block w-full"
                            style={{ aspectRatio: `${deck.size.width} / ${deck.size.height}` }}
                          />
                        </button>
                      ))}
                    </div>
                  </>
                )}

                <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                  {office ? (
                    <button
                      onClick={() => { sfx.click(); setOffice(false) }}
                      className="btn-anim rounded-full bg-[#4E342E] px-5 py-2 text-xs font-extrabold text-white hover:bg-[#5D4037]"
                    >
                      ◀ Back to offline viewer
                    </button>
                  ) : (
                    <button
                      onClick={openOffice}
                      className="btn-anim rounded-full bg-[#D9892B] px-5 py-2 text-xs font-extrabold text-[#2B1D16] shadow-sm hover:brightness-110"
                    >
                      🌐 Office Online — full fidelity
                    </button>
                  )}
                  <a
                    href={deckHref}
                    download={name || 'presentation.pptx'}
                    onClick={() => sfx.click()}
                    className="btn-anim rounded-full bg-[#6D4C41] px-5 py-2 text-xs font-extrabold text-white hover:bg-[#795548]"
                  >
                    ⬇️ Download & present in PowerPoint
                  </a>
                  {CANVA_URL && (
                    <a
                      href={CANVA_URL}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => sfx.click()}
                      className="btn-anim rounded-full bg-[#4E342E] px-5 py-2 text-xs font-extrabold text-white hover:bg-[#5D4037]"
                    >
                      🔗 Open in Canva (full layout)
                    </a>
                  )}
                </div>

                <p className="mt-2 text-center text-xs text-[#8D6E63]">
                  {office
                    ? 'Rendered by Microsoft Office Online — 100% of the original layout (needs internet).'
                    : 'Offline viewer: use ◀ ▶ buttons, the filmstrip, or your arrow keys. Some charts, animations and transitions may differ from PowerPoint.'}{' '}
                  The deck ships with the app, so the offline viewer and PowerPoint download
                  work with no internet; Office Online and Canva need a connection.
                </p>
              </>
            )}

            {!busy && !deck && !err && (
              <div className="grid min-h-[180px] place-items-center rounded-2xl border border-[#D7CCC8] bg-[#FAF7F2] text-sm font-bold text-[#8D6E63]">
                No presentation loaded.
              </div>
            )}
          </div>
        ) : (
          <div
            onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
            onDragLeave={() => setDrag(false)}
            onDrop={onDrop}
            className={`m-4 rounded-3xl border-2 border-dashed p-8 text-center transition-colors sm:m-6 sm:p-12 ${
              drag ? 'border-[#D9892B] bg-[#D9892B]/10' : 'border-[#BCAAA4] bg-[#FAF7F2]'
            }`}
          >
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-[#5D4037] to-[#A1887F] text-3xl shadow-lg">
              📊
            </div>
            <p className="mt-4 text-lg font-black text-[#3E2723]">
              Presentation goes here
            </p>
            <p className="mx-auto mt-1 max-w-md text-sm text-[#6D4C41]">
              Drop your PowerPoint file (<code className="font-bold">.pptx</code>) anywhere in
              this box — it will play slide-by-slide right on this page.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => { sfx.click(); inputRef.current?.click() }}
                className="btn-anim rounded-full bg-[#4E342E] px-6 py-3 text-sm font-extrabold text-white"
              >
                📂 Choose presentation
              </button>
            </div>
            <p className="mt-4 text-xs text-[#8D6E63]">
              Tip: save your file as <b>public/presentation.pptx</b> and it loads automatically.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

function NavBtn({ children, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="btn-anim rounded-full bg-[#4E342E] px-5 py-2 text-xs font-extrabold text-white hover:bg-[#5D4037] disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  )
}
