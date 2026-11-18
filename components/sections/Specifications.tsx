import { Reveal } from '@/components/ui/Reveal';
import { specs } from '@/data/site';

/** Set like the schedule on an architect's drawing: code, item, specification. */
export function Specifications() {
  return (
    <section id="details" aria-labelledby="details-title" className="relative z-10 bg-ivory py-28 md:py-36">
      <div className="wrap grid grid-cols-12 gap-x-6 gap-y-14">
        <div className="col-span-12 md:col-span-4">
          <div className="md:sticky md:top-28">
            <p className="label mb-6">Details</p>
            <Reveal as="h2" id="details-title" className="text-[length:var(--text-title)]">
              The schedule.
            </Reveal>
            <p className="mt-6 max-w-[32ch] text-mute">
              What the drawings would say, in the order a buyer asks. All of it fictional, all of it consistent with the plan above.
            </p>
          </div>
        </div>
        <div className="col-span-12 space-y-16 md:col-span-8">
          {specs.map((g) => (
            <table key={g.group} className="w-full border-collapse text-left">
              <caption className="mb-4 text-left font-display text-[1.9rem] leading-none">{g.group}</caption>
              <tbody>
                {g.rows.map(([k, v]) => (
                  <tr key={k} className="border-t border-line align-baseline last:border-b">
                    <th scope="row" className="w-[42%] py-4 pr-6 text-[0.95rem] font-normal text-mute">
                      {k}
                    </th>
                    <td className="py-4 text-[1.04rem]">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ))}
        </div>
      </div>
    </section>
  );
}
