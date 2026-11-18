import Image from 'next/image';
import { Parallax } from '@/components/ui/Parallax';
import { Reveal } from '@/components/ui/Reveal';
import { BALCONY_AREA, INTERNAL_AREA } from '@/data/residence';

const facts: [string, string][] = [
  ['Internal area', `${INTERNAL_AREA} m²`],
  ['Balcony', `${Math.round(BALCONY_AREA)} m²`],
  ['Bedrooms', '3'],
  ['Bathrooms', '2 + powder room'],
  ['Ceilings', '3.0 m'],
  ['Level', '23 of 42'],
];

export function Introduction() {
  return (
    <section id="residence" aria-labelledby="intro-title" className="relative z-10 overflow-hidden bg-ivory pb-28 pt-28 md:pb-40 md:pt-40">
      <div className="wrap grid grid-cols-12 gap-x-6 gap-y-14">
        <div className="col-span-12 md:col-span-7">
          <p className="label mb-6">The residence</p>
          <Reveal as="h2" id="intro-title" className="text-[length:var(--text-title)]">
            One home on the west half of level&nbsp;23.
          </Reveal>
        </div>
        <div className="col-span-12 md:col-span-4 md:col-start-9 md:pt-12">
          <p className="max-w-[38ch] text-[1.125rem] leading-[1.45]">
            Aurelia is a 42-level tower on Ostra Quay. Its west face looks across the river to the park on the far bank, and every home on that side is planned
            around the view.
          </p>
          <p className="mt-5 max-w-[38ch] text-mute">
            23W is the largest of them: a 20 m run of living, dining and kitchen along the glass, two bedrooms to the south and the primary suite to the north.
          </p>
        </div>

        {/* imagery: a large render bleeding off the left edge, a smaller interior offset to the right */}
        <figure className="col-span-12 -ml-4 md:col-span-8 md:-ml-16">
          <Parallax amount={-6} className="relative aspect-[16/10] overflow-hidden bg-ivory-2">
            <Image
              src="/renders/facade.webp"
              alt="The west face of the tower at level 23; Residence 23W is behind the glass, its balcony in front."
              fill
              sizes="(min-width: 768px) 66vw, 100vw"
              className="object-cover"
            />
          </Parallax>
          <figcaption className="label mt-3 pl-4 md:pl-16">Rendered from the live model · level 23, west face</figcaption>
        </figure>
        <figure className="col-span-8 col-start-5 md:col-span-4 md:col-start-9 md:mt-[22vh]">
          <Parallax amount={10} className="relative aspect-[4/5] overflow-hidden bg-ivory-2">
            <Image
              src="/renders/living.webp"
              alt="The living room, facing west across the river."
              fill
              sizes="(min-width: 768px) 33vw, 66vw"
              className="object-cover object-[35%_50%]"
            />
          </Parallax>
          <figcaption className="label mt-3">The living room, 8 m of west glass</figcaption>
        </figure>

        <dl className="col-span-12 mt-6 grid grid-cols-2 border-t border-line sm:grid-cols-3 lg:grid-cols-6">
          {facts.map(([k, v]) => (
            <div key={k} className="border-b border-line py-6 pr-4 lg:border-b-0">
              <dt className="label">{k}</dt>
              <dd className="tnum mt-2 font-display text-[2rem] leading-none">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="col-span-12 max-w-[70ch] text-[0.95rem] text-mute md:col-span-8">
          Aurelia Residences is a fictional concept. Nothing here is for sale and the address does not exist. The figures all come from one invented plan, and
          they agree with each other.
        </p>
      </div>
    </section>
  );
}
