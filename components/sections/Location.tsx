'use client';

import { useMemo, useState } from 'react';
import { Reveal } from '@/components/ui/Reveal';
import { places } from '@/data/site';

/** Map units: 1 = 2 m. The tower is at (470, 330); north is up; the river runs north–south to the west. */
const T: [number, number] = [470, 330];
const RIVER = 'M240 0 C 250 160, 225 330, 248 480 S 262 640, 250 700 L 395 700 C 405 600, 380 470, 396 330 S 392 120, 400 0 Z';

export function Location() {
  const [focus, setFocus] = useState<string | null>(null);
  const blocks = useMemo(() => {
    const out: [number, number, number, number][] = [];
    for (let x = 452; x < 1000; x += 32)
      for (let y = 6; y < 700; y += 32) {
        if (Math.abs(x + 12 - T[0]) < 22 && Math.abs(y + 12 - T[1]) < 22) continue;
        if (x < 460 && y > 200 && y < 470) continue; // Quay Park
        out.push([x, y, 24, 24]);
      }
    for (let x = 6; x < 225; x += 32) for (let y = 6; y < 700; y += 32) out.push([x, y, 24, 24]);
    return out;
  }, []);
  const sorted = useMemo(() => [...places].sort((a, b) => a.minutes - b.minutes), []);

  return (
    <section id="location" aria-labelledby="location-title" className="relative z-10 bg-ivory py-28 md:py-36">
      <div className="wrap grid grid-cols-12 gap-x-6 gap-y-12">
        <div className="col-span-12 md:col-span-7">
          <p className="label mb-6">Location</p>
          <Reveal as="h2" id="location-title" className="text-[length:var(--text-title)]">
            The river to the west, the station seven minutes&nbsp;east.
          </Reveal>
        </div>
        <p className="col-span-12 max-w-[40ch] self-end text-mute md:col-span-4 md:col-start-9">
          Ostra Quay is invented for this concept, so the map is illustrative. Walking times are measured on it at 80 m a minute.
        </p>

        <figure className="col-span-12 lg:col-span-8">
          <svg
            viewBox="0 0 1000 700"
            className="h-auto w-full bg-paper text-charcoal"
            role="img"
            aria-label="Illustrative map of the fictional Ostra Quay district, with the tower beside the river and nearby places marked."
          >
            <g fill="var(--color-ivory-2)">
              {blocks.map(([x, y, w, h]) => (
                <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} />
              ))}
            </g>
            <rect x={402} y={200} width={58} height={270} fill="#d7d3c0" />
            <path d={RIVER} fill="#cbc3b4" />
            <g stroke="#b9ae9c" strokeWidth={0.8} opacity={0.7}>
              {Array.from({ length: 30 }, (_, i) => (
                <line key={i} x1={262 + (i % 3) * 40} y1={i * 24} x2={292 + (i % 3) * 40} y2={i * 24} />
              ))}
            </g>
            {/* Lantern Bridge */}
            <rect x={232} y={158} width={176} height={9} fill="var(--color-paper)" stroke="var(--color-stone)" />
            {/* walking rings: 5 and 10 minutes */}
            {[200, 400].map((r) => (
              <circle key={r} cx={T[0]} cy={T[1]} r={r} fill="none" stroke="var(--color-stone)" strokeDasharray="4 6" />
            ))}
            <text x={T[0] + 6} y={T[1] - 206} className="fill-mute" style={{ font: '500 13px var(--font-sans)', letterSpacing: '0.08em' }}>
              5 MIN
            </text>
            <text x={T[0] + 6} y={T[1] - 406 + 24} className="fill-mute" style={{ font: '500 13px var(--font-sans)', letterSpacing: '0.08em' }}>
              10 MIN
            </text>
            {/* the tower */}
            <rect x={T[0] - 10} y={T[1] - 10} width={20} height={20} fill="var(--color-charcoal)" />
            <text x={T[0] + 18} y={T[1] + 5} style={{ font: '400 20px var(--font-display)' }}>
              Aurelia
            </text>
            {/* places */}
            {places.map((p) => {
              const on = focus === p.id;
              return (
                <g key={p.id} transform={`translate(${p.at[0]} ${p.at[1]})`}>
                  <circle
                    r={on ? 11 : 6}
                    fill={on ? 'var(--color-bronze)' : 'var(--color-paper)'}
                    stroke="var(--color-bronze)"
                    strokeWidth={2}
                    style={{ transition: 'r .3s, fill .3s' }}
                  />
                  {on && (
                    <text x={16} y={5} style={{ font: '500 16px var(--font-sans)' }} fill="var(--color-ink)">
                      {p.name}
                    </text>
                  )}
                </g>
              );
            })}
            <text x={318} y={640} transform="rotate(-86 318 640)" className="fill-mute" style={{ font: '500 14px var(--font-sans)', letterSpacing: '0.2em' }}>
              RIVER OSTRA
            </text>
            <g transform="translate(950 50)" fill="currentColor">
              <path d="M0 -18 L7 4 L0 0 L-7 4 Z" />
              <text y={22} textAnchor="middle" style={{ font: '500 13px var(--font-sans)' }}>
                N
              </text>
            </g>
          </svg>
          <figcaption className="label mt-3">Illustrative map of a fictional district</figcaption>
        </figure>

        <div className="col-span-12 lg:col-span-4">
          <ol className="divide-y divide-line border-y border-line">
            {sorted.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onPointerEnter={() => setFocus(p.id)}
                  onPointerLeave={() => setFocus(null)}
                  onFocus={() => setFocus(p.id)}
                  onBlur={() => setFocus(null)}
                  className="grid w-full grid-cols-[4.4rem_1fr_auto] items-baseline gap-3 py-4 text-left transition-colors hover:text-bronze-deep"
                >
                  <span className="tnum font-display text-[1.7rem] leading-none">
                    {p.minutes}
                    <span className="font-sans text-[0.8rem]"> min</span>
                  </span>
                  <span className="text-[1.04rem]">{p.name}</span>
                  <span className="label">{p.kind}</span>
                  <span className="sr-only">, walking. Highlights it on the map.</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
