// All section components are "use client" — regular imports are correct.
// Next.js 16 prohibits dynamic({ ssr: false }) in server components.
import HeroVideo from "@/components/sections/HeroVideo";
import ServicesOverview from "@/components/sections/ServicesOverview";
import PinnedShowcase from "@/components/sections/PinnedShowcase";
import BeforeAfterReveal from "@/components/sections/BeforeAfterReveal";
import PortfolioCarousel from "@/components/sections/PortfolioCarousel";
import WhyUs from "@/components/sections/WhyUs";
import Testimonials from "@/components/sections/Testimonials";
import CTA from "@/components/sections/CTA";

export default function HomePage() {
  return (
    <main>
      <HeroVideo />
      <ServicesOverview />
      <PinnedShowcase />
      <BeforeAfterReveal />
      <PortfolioCarousel />
      <WhyUs />
      <Testimonials />
      <CTA />
    </main>
  );
}
