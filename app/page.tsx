import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { LogoWall } from "@/components/landing/LogoWall";
import { FeatureSplit } from "@/components/landing/FeatureSplit";
import { BentoFeatures } from "@/components/landing/BentoFeatures";
import { Footer } from "@/components/landing/Footer";
import { ScrollGlowPath } from "@/components/landing/ScrollGlowPath";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#050505] selection:bg-apollo/30 selection:text-white">
      <ScrollGlowPath />
      
      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        
        {/* Additional Macro Whitespace between components */}
        <div className="py-12">
          <LogoWall />
        </div>
        
        <FeatureSplit />
        <BentoFeatures />
        <Footer />
      </div>
    </main>
  );
}

