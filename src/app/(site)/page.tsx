// All section components are "use client" — regular imports are correct.
// Next.js 16 prohibits dynamic({ ssr: false }) in server components.
import HeroVideo from "@/components/sections/HeroVideo";
import StatementSection from "@/components/sections/StatementSection";
import PinnedShowcase from "@/components/sections/PinnedShowcase";
import PortfolioCarousel from "@/components/sections/PortfolioCarousel";
import BeforeAfterReveal from "@/components/sections/BeforeAfterReveal";

export default function HomePage() {
  return (
    <main>
      <HeroVideo />
      <PortfolioCarousel />
      <StatementSection />
      <PinnedShowcase />
      <BeforeAfterReveal />

    </main>
  );
}
