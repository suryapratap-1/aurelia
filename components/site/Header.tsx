'use client';

import { useEffect, useRef, useState } from 'react';
import { nav } from '@/data/site';
import { Wordmark } from './Wordmark';

export function Header() {
  const [solid, setSolid] = useState(false);
  const [active, setActive] = useState<string>('');
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    addEventListener('scroll', onScroll, { passive: true });
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    for (const n of nav) {
      const el = document.getElementById(n.id);
      if (el) io.observe(el);
    }
    // the menu closes when one of its links is followed
    const d = dialog.current;
    const onLink = (e: Event) => {
      if ((e.target as HTMLElement).closest('a')) d?.close();
    };
    d?.addEventListener('click', onLink);
    return () => {
      removeEventListener('scroll', onScroll);
      io.disconnect();
      d?.removeEventListener('click', onLink);
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-500 ${
        solid ? 'border-b border-line bg-ivory/95 text-ink' : 'bg-transparent text-paper'
      }`}
    >
      <div className="wrap flex h-16 items-center justify-between gap-6 md:h-[4.5rem]">
        <a href="#top" className="flex items-baseline gap-3">
          <Wordmark className="text-[1.35rem] md:text-[1.5rem]" />
          <span className="label hidden !text-current opacity-70 lg:inline">A fictional concept</span>
          <span className="sr-only">Residences, back to top</span>
        </a>
        <nav aria-label="Sections" className="hidden xl:block">
          <ul className="flex gap-7 text-[0.94rem]">
            {nav.map((n) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  aria-current={active === n.id ? 'location' : undefined}
                  className="link-line pb-1 aria-[current=location]:bg-[length:100%_1px]"
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-3">
          <a href="#enquire" className="btn-door hidden !py-2.5 text-[0.94rem] sm:inline-flex">
            Arrange a viewing
          </a>
          <button type="button" className="xl:hidden px-2 py-2 text-[0.94rem] font-medium" aria-haspopup="dialog" onClick={() => dialog.current?.showModal()}>
            Menu
          </button>
        </div>
      </div>

      <dialog ref={dialog} className="m-0 h-[100dvh] max-h-none w-full max-w-none bg-charcoal p-0 text-paper backdrop:bg-charcoal/40" aria-label="Site menu">
        <div className="wrap flex h-16 items-center justify-between">
          <Wordmark className="text-[1.35rem]" />
          <button type="button" className="px-2 py-2 font-medium" onClick={() => dialog.current?.close()}>
            Close
          </button>
        </div>
        <nav aria-label="Sections" className="wrap mt-10">
          <ul className="space-y-3">
            {nav.map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`} className="font-display text-[2.6rem] leading-tight">
                  {n.label}
                </a>
              </li>
            ))}
            <li className="pt-6">
              <a href="#enquire" className="btn-door">
                Arrange a viewing
              </a>
            </li>
          </ul>
        </nav>
      </dialog>
    </header>
  );
}
