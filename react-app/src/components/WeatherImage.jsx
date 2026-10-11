import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function WeatherImage({ src, alt, caption, formula, formulaImg }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <figure className="my-4 overflow-hidden rounded-xl border border-[#D7CCC8]/80 bg-[#FAF7F2]">
        <button
          onClick={() => setOpen(true)}
          className="group relative block w-full cursor-zoom-in"
          aria-label={`Inspect image: ${alt}`}
        >
          <img
            src={src}
            alt={alt}
            loading="lazy"
            className="h-56 w-full object-cover transition duration-300 group-hover:scale-[1.02] sm:h-64"
          />
          <span className="absolute bottom-2 right-2 rounded-full bg-black/60 px-3 py-1 text-[11px] font-bold text-white opacity-0 transition group-hover:opacity-100">
            🔍 click to inspect
          </span>
        </button>
        {(caption || formula || formulaImg) && (
          <figcaption className="border-t border-[#D7CCC8]/60 px-3 py-2">
            {caption && (
              <p className="text-xs leading-relaxed text-[#5D4037]">{caption}</p>
            )}
            {formula && (
              <p className="mt-1 overflow-x-auto rounded-md bg-[#EFEBE9] px-2 py-1 font-mono text-[11px] text-[#4E342E]">
                {formula}
              </p>
            )}
            {formulaImg && (
              <button
                onClick={() => setOpen(true)}
                className="mt-2 block cursor-zoom-in"
                aria-label="Inspect formula image"
              >
                <img
                  src={formulaImg}
                  alt="Chemical formula detail"
                  loading="lazy"
                  className="h-16 w-auto rounded-md border border-[#D7CCC8] bg-white object-contain"
                />
                <span className="mt-0.5 block text-[10px] font-bold uppercase tracking-wider text-[#8D6E63]">
                  Formula detail — click to enlarge
                </span>
              </button>
            )}
          </figcaption>
        )}
      </figure>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4"
          >
            <motion.div
              initial={{ scale: 0.92, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 8 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[88vh] w-full max-w-3xl overflow-auto rounded-2xl bg-[#FFF8F0] p-3 shadow-2xl"
            >
              <div className="flex items-start justify-between gap-3 px-1 pb-2">
                <p className="text-sm font-bold text-[#4E342E]">{alt}</p>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-full bg-[#3E2723] px-3 py-1 text-xs font-bold text-white hover:bg-[#5D4037]"
                >
                  ✕ Close
                </button>
              </div>
              <img
                src={src}
                alt={alt}
                className="max-h-[60vh] w-full rounded-xl object-contain bg-[#EFEBE9]"
              />
              {caption && (
                <p className="px-1 pt-2 text-sm text-[#5D4037]">{caption}</p>
              )}
              {formula && (
                <p className="mx-1 mt-2 rounded-lg bg-[#EFEBE9] px-3 py-2 font-mono text-xs text-[#4E342E]">
                  {formula}
                </p>
              )}
              {formulaImg && (
                <img
                  src={formulaImg}
                  alt="Chemical formula detail enlarged"
                  className="mt-2 w-full rounded-xl border border-[#D7CCC8] bg-white object-contain"
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
