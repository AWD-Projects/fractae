import { Navbar } from "@/components/molecules/navbar";
import { ScrollRestorer } from "@/components/molecules/scroll-restorer";
import { HeroSection } from "@/components/landing/hero-section";
import { WhySection } from "@/components/landing/why-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { BenefitsSection } from "@/components/landing/benefits-section";
import { PlansSection } from "@/components/landing/plans-section";
import { FAQSection } from "@/components/landing/faq-section";
import { ContactSection } from "@/components/landing/contact-section";
import { FooterSection } from "@/components/landing/footer-section";
import dotsPattern from "@/assets/bg-images/dots.png";

export default function LandingPage() {
  return (
    <>
      <ScrollRestorer />
      {/* Fixed navbar */}
      <Navbar />

      {/* Dots pattern — fixed, scaled down to 60% width so dots appear smaller */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.08]"
        style={{
          backgroundImage: `url(${dotsPattern.src})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "150% auto",
          backgroundPosition: "top center",
        }}
      />

      {/* Snap scroll container */}
      <main
        id="snap-root"
        className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth relative z-10"
      >
        <div className="snap-start min-h-screen flex flex-col items-center justify-center">
          <div className="w-full max-w-[1280px] px-[60px]">
            <HeroSection />
          </div>
        </div>

        <div className="snap-start h-screen flex flex-col items-center justify-center overflow-hidden">
          <div className="w-full max-w-[1280px] px-[60px]">
            <WhySection />
          </div>
        </div>

        <div className="snap-start min-h-screen flex flex-col items-center justify-center">
          <div className="w-full max-w-[1280px] px-[60px]">
            <FeaturesSection />
          </div>
        </div>

        <div className="snap-start min-h-screen flex flex-col items-center justify-center">
          <div className="w-full max-w-[1280px] px-[60px]">
            <BenefitsSection />
          </div>
        </div>

        <div className="snap-start min-h-screen flex flex-col items-center justify-center">
          <div className="w-full max-w-[1280px] px-[60px]">
            <PlansSection />
          </div>
        </div>

        <div className="snap-start min-h-screen flex flex-col items-center justify-center">
          <div className="w-full max-w-[1280px] px-[60px]">
            <FAQSection />
          </div>
        </div>

        <div className="snap-start min-h-screen flex flex-col items-center justify-center">
          <div className="w-full max-w-[1280px] px-[60px]">
            <ContactSection />
            <FooterSection />
          </div>
        </div>
      </main>
    </>
  );
}
