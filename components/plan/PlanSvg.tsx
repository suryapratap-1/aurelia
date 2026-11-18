'use client';

import { forwardRef, type ReactNode } from 'react';
import { type Door, doors, glazing, type Room, type RoomId, rooms, walls } from '@/data/residence';

/** Plan drawn with west (the river) at the top and north to the right. 1 m = S units. */
export const S = 40;
const PAD = 30;
export const px = (x: number, z: number): [number, number] => [PAD + (12 - z) * S, PAD + (x + 14.6) * S];
export const VIEW = { w: PAD * 2 + 24 * S, h: PAD * 2 + 19.6 * S };

function DoorMark({ d, strong }: { d: Door; strong?: boolean }) {
  const H = px(d.hinge[0], d.hinge[1]);
  const C = px(d.hinge[0] + d.closed[0] * d.width, d.hinge[1] + d.closed[1] * d.width);
  const O = px(d.hinge[0] + d.open[0] * d.width, d.hinge[1] + d.open[1] * d.width);
  const r = d.width * S;
  // sweep direction from the sign of the screen-space cross product
  const cross = (C[0] - H[0]) * (O[1] - H[1]) - (C[1] - H[1]) * (O[0] - H[0]);
  const sweep = cross > 0 ? 1 : 0;
  return (
    <g className="door" data-door={d.id}>
      <path
        d={`M${C[0]} ${C[1]} A ${r} ${r} 0 0 ${sweep} ${O[0]} ${O[1]}`}
        fill="none"
        stroke="var(--color-bronze)"
        strokeWidth={strong ? 2 : 1.2}
        strokeDasharray="5 4"
      />
      <line x1={H[0]} y1={H[1]} x2={O[0]} y2={O[1]} stroke="var(--color-bronze)" strokeWidth={strong ? 4 : 2.5} />
    </g>
  );
}

const rectPath = (r: Room['rect']) => {
  const a = px(r[0], r[2]);
  const b = px(r[1], r[3]);
  const x = Math.min(a[0], b[0]);
  const y = Math.min(a[1], b[1]);
  return { x, y, w: Math.abs(a[0] - b[0]), h: Math.abs(a[1] - b[1]) };
};

type Props = {
  selected?: RoomId | null;
  onSelect?: (id: RoomId) => void;
  onHover?: (id: RoomId | null) => void;
  compact?: boolean;
  className?: string;
  children?: ReactNode;
  title?: string;
};

export const PlanSvg = forwardRef<SVGSVGElement, Props>(function PlanSvg({ selected, onSelect, onHover, compact, className, children, title }, ref) {
  const interactive = !!onSelect;
  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
      className={className}
      role={interactive ? 'group' : 'img'}
      aria-label={title ?? 'Floor plan of Residence 23W, west at the top'}
    >
      {/* rooms */}
      {rooms.map((r) => {
        const b = rectPath(r.rect);
        const on = selected === r.id;
        return (
          <g key={r.id} className="pointer-events-none">
            <rect
              x={b.x}
              y={b.y}
              width={b.w}
              height={b.h}
              fill={on ? 'rgba(138,106,69,0.16)' : r.id === 'balcony' ? 'transparent' : compact ? 'rgba(250,247,241,0.9)' : 'var(--color-paper)'}
              stroke={r.id === 'balcony' ? 'currentColor' : 'none'}
              strokeDasharray={r.id === 'balcony' ? '6 5' : undefined}
              strokeWidth={1}
              style={{ transition: 'fill .4s' }}
            />
            {!compact && !r.minor && (
              <text
                x={b.x + b.w / 2}
                y={b.y + b.h / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                className="select-none"
                style={{ font: '500 15px var(--font-sans)', letterSpacing: '0.06em', textTransform: 'uppercase' }}
                fill={on ? 'var(--color-bronze-deep)' : 'var(--color-mute)'}
              >
                {r.name}
              </text>
            )}
          </g>
        );
      })}
      {/* glazing: a thin double line */}
      {glazing.map(([x1, z1, x2, z2]) => {
        const a = px(x1, z1);
        const b = px(x2, z2);
        return (
          <g key={`${x1},${z1},${x2},${z2}`} stroke="currentColor" className="pointer-events-none">
            <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} strokeWidth={5} opacity={0.18} />
            <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} strokeWidth={1} />
          </g>
        );
      })}
      {/* walls */}
      <g stroke="currentColor" strokeWidth={compact ? 6 : 5} strokeLinecap="square" className="pointer-events-none">
        {walls.map(([x1, z1, x2, z2]) => {
          const a = px(x1, z1);
          const b = px(x2, z2);
          return <line key={`${x1},${z1},${x2},${z2}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />;
        })}
      </g>
      <g className="pointer-events-none">
        {doors.map((d) => (
          <DoorMark key={d.id} d={d} strong={d.id === 'entry'} />
        ))}
      </g>
      {!compact && (
        <g className="pointer-events-none" fill="currentColor" style={{ font: '500 13px var(--font-sans)', letterSpacing: '0.08em' }}>
          {/* north arrow: north is to the right */}
          <g transform={`translate(${VIEW.w - 70} ${VIEW.h - 40})`}>
            <line x1={-30} y1={0} x2={10} y2={0} stroke="currentColor" strokeWidth={1.5} />
            <path d="M14 0 L4 -6 L4 6 Z" />
            <text x={22} y={4}>
              N
            </text>
          </g>
          {/* scale bar: 5 m */}
          <g transform={`translate(${PAD} ${VIEW.h - 34})`}>
            <line x1={0} y1={0} x2={5 * S} y2={0} stroke="currentColor" strokeWidth={1.5} />
            {[0, 1, 2, 3, 4, 5].map((k) => (
              <line key={k} x1={k * S} y1={-5} x2={k * S} y2={k % 5 === 0 ? 6 : 3} stroke="currentColor" />
            ))}
            <text x={5 * S + 10} y={4}>
              5 M
            </text>
          </g>
          <text x={VIEW.w / 2} y={18} textAnchor="middle" opacity={0.7}>
            WEST · RIVER OSTRA
          </text>
          <text x={px(0, -0.5)[0]} y={px(2.6, 0)[1]} textAnchor="middle" opacity={0.7}>
            LIFT LOBBY
          </text>
        </g>
      )}
      {/* hit areas: one focusable button per main room, above the drawing */}
      {interactive &&
        rooms
          .filter((r) => !r.minor)
          .map((r) => {
            const b = rectPath(r.rect);
            return (
              // biome-ignore lint/a11y/useSemanticElements: an SVG region cannot be an HTML <button>; it has role, focus and Enter/Space handling
              <g
                key={r.id}
                role="button"
                tabIndex={0}
                aria-pressed={selected === r.id}
                aria-label={r.name}
                className="cursor-pointer outline-none [&:focus-visible>rect]:stroke-[var(--color-bronze)]"
                onClick={() => onSelect?.(r.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelect?.(r.id);
                  }
                }}
                onPointerEnter={() => onHover?.(r.id)}
                onPointerLeave={() => onHover?.(null)}
              >
                <rect x={b.x + 3} y={b.y + 3} width={b.w - 6} height={b.h - 6} fill="transparent" strokeWidth={3} />
              </g>
            );
          })}
      {children}
    </svg>
  );
});
