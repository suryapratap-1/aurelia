import { PlanSvg } from '@/components/plan/PlanSvg';
import { nav } from '@/data/site';
import { Wordmark } from './Wordmark';

export function Footer() {
  return (
    <footer className="relative z-10 overflow-hidden bg-ivory pb-10 pt-24 text-ink">
      <div className="wrap grid grid-cols-12 gap-x-6 gap-y-12">
        <div className="col-span-12 md:col-span-5">
          <Wordmark className="text-[clamp(2.6rem,6vw,5rem)]" />
          <p className="mt-4 max-w-[34ch] text-mute">Residence 23W, level 23, west face. A fictional tower on a fictional quay.</p>
        </div>
        <nav aria-label="Footer" className="col-span-12 sm:col-span-6 md:col-span-2 md:col-start-7">
          <p className="label mb-4">The site</p>
          <ul className="space-y-2">
            {nav.map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`} className="link-line pb-0.5">
                  {n.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#enquire" className="link-line pb-0.5">
                Enquire
              </a>
            </li>
          </ul>
        </nav>
        <div className="col-span-12 break-words sm:col-span-6 md:col-span-3">
          <p className="label mb-4">Contact</p>
          <address className="space-y-2 not-italic">
            <p>Sales gallery, Ostra Quay (fictional)</p>
            <p>
              <a href="mailto:residences@aurelia.example" className="link-line pb-0.5">
                residences@aurelia.example
              </a>
            </p>
            <p className="text-mute">By appointment, Tuesday to Saturday</p>
          </address>
        </div>

        {/* the plan again, at the foot of the page: the drawing you started from */}
        <div className="col-span-12 border-t border-line pt-10">
          <PlanSvg compact className="mx-auto h-auto w-full max-w-[26rem] text-stone" title="Floor plan of Residence 23W" />
        </div>

        <div className="col-span-12 flex flex-col gap-3 border-t border-line pt-6 text-[0.85rem] text-mute md:flex-row md:justify-between">
          <p>Aurelia Residences is a fictional concept. No property, price, address or certification on this site is real.</p>
          <p>
            Furniture, textures and sky:{' '}
            <a className="link-line" href="https://polyhaven.com">
              Poly Haven
            </a>{' '}
            (CC0). Type: Gloock and Schibsted Grotesk (SIL OFL).
          </p>
        </div>
      </div>
    </footer>
  );
}
