'use client';

import { type ReactNode, useEffect, useRef } from 'react';
import { prefersReducedMotion, registerGsap } from '@/lib/motion';

/** Moves its first child by `amount` % of its height across the viewport (scrubbed, transform only). */
export function Parallax({ children, amount = 8, className }: { children: ReactNode; amount?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const inner = el.firstElementChild as HTMLElement | null;
    if (!inner) return;
    const { gsap } = registerGsap();
    const ctx = gsap.context(() => {
      gsap.set(inner, { scale: 1 + Math.abs(amount) / 50 });
      gsap.fromTo(
        inner,
        { yPercent: -amount / 2 },
        { yPercent: amount / 2, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } },
      );
    });
    return () => ctx.revert();
  }, [amount]);
  return (
    <div ref={ref} className={className}>
      <div className="absolute inset-0">{children}</div>
    </div>
  );
}
