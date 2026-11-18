'use client';

import { useState } from 'react';
import { PlanSvg } from '@/components/plan/PlanSvg';
import { Reveal } from '@/components/ui/Reveal';
import { area, BALCONY_AREA, dims, INTERNAL_AREA, type RoomId, roomById, rooms } from '@/data/residence';
import { scrollToY, stopOffsets } from '@/lib/motion';

const fmt = (n: number) => (Number.isInteger(n) ? `${n}` : n.toFixed(n * 10 === Math.round(n * 10) ? 1 : 2));

export function FloorPlan() {
  const [selected, setSelected] = useState<RoomId>('living');
  const [hover, setHover] = useState<RoomId | null>(null);
  const room = roomById[hover ?? selected];
  const [w, d] = dims(room.rect);
  const main = rooms.filter((r) => !r.minor);

  const visit = () => {
    const f = room.stop ? stopOffsets.get(room.stop) : undefined;
    if (f) scrollToY(f());
  };

  return (
    <section id="plan" aria-labelledby="plan-title" className="relative z-10 bg-paper py-28 md:py-36">
      <div className="wrap">
        <div className="grid grid-cols-12 gap-x-6 gap-y-8">
          <div className="col-span-12 md:col-span-6">
            <p className="label mb-6">The plan</p>
            <Reveal as="h2" id="plan-title" className="text-[length:var(--text-title)]">
              Every door, drawn as it&nbsp;opens.
            </Reveal>
          </div>
          <p className="col-span-12 max-w-[42ch] self-end text-mute md:col-span-4 md:col-start-9">
            West is at the top, where the river is. Choose a room on the drawing or in the list to read its size and finishes, then step into it in the
            walk-through.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-12 gap-x-6 gap-y-10">
          <div className="col-span-12 lg:col-span-8">
            <div className="overflow-x-auto pb-2 [scrollbar-width:thin]">
              <PlanSvg
                className="h-auto w-full min-w-[40rem] text-charcoal"
                selected={hover ?? selected}
                onSelect={setSelected}
                onHover={setHover}
                title="Interactive floor plan of Residence 23W. West at the top. Each room can be selected."
              />
            </div>
            <p className="label mt-4">
              Internal {INTERNAL_AREA} m² · balcony {Math.round(BALCONY_AREA)} m² · dashed arcs show each door’s swing
            </p>
          </div>

          <aside className="col-span-12 lg:col-span-4" aria-live="polite" aria-label="Selected room">
            <div className="border-t border-charcoal pt-6">
              <p className="label tnum">
                {fmt(area(room.rect))} m² · {fmt(w)} × {fmt(d)} m
              </p>
              <h3 className="mt-3 text-[clamp(2.2rem,3.4vw,3.2rem)]">{room.name}</h3>
              <p className="mt-4 max-w-[36ch] text-[1.06rem] leading-snug">{room.note}</p>
              <ul className="mt-6 divide-y divide-line border-y border-line text-[0.97rem]">
                {room.finishes.map((f) => (
                  <li key={f} className="py-3">
                    {f}
                  </li>
                ))}
              </ul>
              {room.stop && (
                <button type="button" onClick={visit} className="btn-door mt-8">
                  Step into the {room.name.toLowerCase()}
                </button>
              )}
            </div>

            <fieldset className="mt-12">
              <legend className="label mb-3">Rooms</legend>
              <div className="flex flex-wrap gap-2">
                {main.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    aria-pressed={selected === r.id}
                    onClick={() => setSelected(r.id)}
                    className="border border-line px-3 py-1.5 text-[0.9rem] transition-colors hover:border-charcoal aria-pressed:border-bronze aria-pressed:bg-bronze aria-pressed:text-paper"
                  >
                    {r.name}
                  </button>
                ))}
              </div>
            </fieldset>
          </aside>
        </div>
      </div>
    </section>
  );
}
