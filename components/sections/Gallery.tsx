'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Reveal } from '@/components/ui/Reveal';
import { renders } from '@/data/site';

/** Column spans for an uneven, editorial hang (desktop). */
const layout = [
  'md:col-span-8 aspect-[16/10]',
  'md:col-span-4 md:mt-24 aspect-[4/5]',
  'md:col-span-5 aspect-[4/5]',
  'md:col-span-7 md:mt-40 aspect-[16/10]',
  'md:col-span-6 aspect-[16/10]',
  'md:col-span-4 md:col-start-9 md:-mt-10 aspect-[4/5]',
  'md:col-span-7 md:col-start-2 aspect-[16/10]',
  'md:col-span-4 md:mt-28 aspect-[4/5]',
  'md:col-span-12 aspect-[21/9]',
];

export function Gallery() {
  const [open, setOpen] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const touch = useRef(0);

  const show = (k: number) => {
    setOpen(k);
    dialog.current?.showModal();
  };
  const step = useCallback((dir: number) => setOpen((k) => (k === null ? k : (k + dir + renders.length) % renders.length)), []);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    const onClose = () => setOpen(null);
    d.addEventListener('keydown', onKey);
    d.addEventListener('close', onClose);
    return () => {
      d.removeEventListener('keydown', onKey);
      d.removeEventListener('close', onClose);
    };
  }, [step]);

  const cur = open === null ? null : renders[open];

  return (
    <section id="gallery" aria-labelledby="gallery-title" className="relative z-10 bg-charcoal py-28 text-paper md:py-36">
      <div className="wrap">
        <div className="grid grid-cols-12 gap-x-6 gap-y-6">
          <div className="col-span-12 md:col-span-7">
            <p className="label !text-paper/60 mb-6">Gallery</p>
            <Reveal as="h2" id="gallery-title" className="text-[length:var(--text-title)]">
              Nine frames from the same&nbsp;model.
            </Reveal>
          </div>
          <p className="col-span-12 max-w-[40ch] self-end text-paper/70 md:col-span-4 md:col-start-9">
            Each image is rendered from the 3D residence you walked through above. Nothing is retouched or photographed. Open any frame to see it full screen.
          </p>
        </div>

        <ul className="mt-16 grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-12">
          {renders.map((r, k) => (
            <li key={r.src} className={`${layout[k]} group relative`}>
              <button
                type="button"
                onClick={() => show(k)}
                className="relative block h-full w-full overflow-hidden bg-ink"
                aria-label={`Open full screen: ${r.caption}`}
              >
                <Image
                  src={r.src}
                  alt={r.alt}
                  fill
                  sizes="(min-width: 768px) 60vw, 100vw"
                  className="object-cover transition-transform duration-[1.6s] ease-[var(--ease-settle)] group-hover:scale-[1.035]"
                />
              </button>
              <p className="label !text-paper/60 mt-3">{r.caption}</p>
            </li>
          ))}
        </ul>
      </div>

      <dialog
        ref={dialog}
        className="m-0 h-[100dvh] max-h-none w-full max-w-none bg-charcoal p-0 text-paper backdrop:bg-black/80"
        aria-label="Gallery viewer"
        onTouchStart={(e) => {
          touch.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          const dx = e.changedTouches[0].clientX - touch.current;
          if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
        }}
      >
        {cur && (
          <div className="relative flex h-full flex-col">
            <div className="relative flex-1">
              <Image
                key={cur.src}
                src={cur.src}
                alt={cur.alt}
                fill
                sizes="100vw"
                quality={85}
                className="animate-[rise_.6s_var(--ease-settle)_both] object-contain"
              />
            </div>
            <div className="wrap flex items-center justify-between gap-4 py-5">
              <p className="tnum text-[0.95rem]">
                <span className="text-paper/60">
                  {(open ?? 0) + 1} / {renders.length}
                </span>{' '}
                · {cur.caption}
              </p>
              <div className="flex items-center gap-6 text-[0.95rem] font-medium">
                <button type="button" onClick={() => step(-1)} className="link-line pb-0.5">
                  Previous
                </button>
                <button type="button" onClick={() => step(1)} className="link-line pb-0.5">
                  Next
                </button>
                <button type="button" onClick={() => dialog.current?.close()} className="link-line pb-0.5">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}
