import { SmoothScroll } from "@/components/landing/SmoothScroll";
import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { MarqueeStrip } from "@/components/landing/MarqueeStrip";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { IntegrationsSection } from "@/components/landing/IntegrationsSection";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";
import { LoadingScreen } from "@/components/landing/LoadingScreen";

export default function Home() {
  return (
    <SmoothScroll>
      <LoadingScreen />
      <Navbar />
      <main>
        <HeroSection />
        <MarqueeStrip />
        <ProblemSection />
        <HowItWorksSection />
        <FeaturesSection />
        <StatsSection />
        <IntegrationsSection />
        <CTASection />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
