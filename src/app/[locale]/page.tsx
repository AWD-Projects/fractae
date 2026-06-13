import { Navbar } from "@/components/molecules/navbar";
import { ScrollRestorer } from "@/components/molecules/scroll-restorer";
import { SmoothScrollInit } from "@/components/molecules/snap-scroller";
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
      <SmoothScrollInit />
      <Navbar />

      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.08]"
        style={{
          backgroundImage: `url(${dotsPattern.src})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "150% auto",
          backgroundPosition: "top center",
        }}
      />

      {/* Hero — full viewport */}
      <div className="min-h-screen flex flex-col items-center justify-center pt-[64px]">
        <div className="w-full max-w-[1280px] px-5 sm:px-10 lg:px-[60px]">
          <HeroSection />
        </div>
      </div>

      {/* Why */}
      <div className="flex flex-col items-center py-16 lg:py-[110px]">
        <div className="w-full max-w-[1280px] px-5 sm:px-10 lg:px-[60px]">
          <WhySection />
        </div>
      </div>

      {/* Features */}
      <div className="flex flex-col items-center py-16 lg:py-[110px]">
        <div className="w-full max-w-[1280px] px-5 sm:px-10 lg:px-[60px]">
          <FeaturesSection />
        </div>
      </div>

      {/* Benefits */}
      <div className="flex flex-col items-center py-16 lg:py-[110px]">
        <div className="w-full max-w-[1280px] px-5 sm:px-10 lg:px-[60px]">
          <BenefitsSection />
        </div>
      </div>

      {/* Plans */}
      <div className="flex flex-col items-center py-16 lg:py-[110px]">
        <div className="w-full max-w-[1280px] px-5 sm:px-10 lg:px-[60px]">
          <PlansSection />
        </div>
      </div>

      {/* FAQ */}
      <div className="flex flex-col items-center py-16 lg:py-[110px]">
        <div className="w-full max-w-[1280px] px-5 sm:px-10 lg:px-[60px]">
          <FAQSection />
        </div>
      </div>

      {/* Contact + Footer */}
      <div className="flex flex-col items-center py-16 lg:py-[110px]">
        <div className="w-full max-w-[1280px] px-5 sm:px-10 lg:px-[60px]">
          <ContactSection />
          <FooterSection />
        </div>
      </div>
    </>
  );
}
