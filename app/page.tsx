import { Amenities } from '@/components/sections/Amenities';
import { Enquiry } from '@/components/sections/Enquiry';
import { FloorPlan } from '@/components/sections/FloorPlan';
import { Gallery } from '@/components/sections/Gallery';
import { Hero } from '@/components/sections/Hero';
import { Introduction } from '@/components/sections/Introduction';
import { Journey } from '@/components/sections/Journey';
import { Location } from '@/components/sections/Location';
import { Specifications } from '@/components/sections/Specifications';
import { Footer } from '@/components/site/Footer';
import { Header } from '@/components/site/Header';
import { Loader } from '@/components/site/Loader';
import { SmoothScroll } from '@/components/site/SmoothScroll';
import { WorldLayer } from '@/features/world/WorldLayer';

export default function Page() {
  return (
    <>
      <SmoothScroll />
      <WorldLayer />
      <Loader />
      <Header />
      <main id="main">
        <Hero />
        <Introduction />
        <Journey />
        <FloorPlan />
        <Amenities />
        <Location />
        <Gallery />
        <Specifications />
        <Enquiry />
      </main>
      <Footer />
    </>
  );
}
