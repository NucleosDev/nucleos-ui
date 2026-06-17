"use client";

import { useEffect, useState } from "react";
import { Comparison } from "@/components/public/landing/comparison";
import { HowItWorks } from "@/components/public/landing/how-it-works";
import { Pricing } from "@/components/public/landing/pricing";
import { FloatingNotifications } from "@/components/public/landing/floating-notifications";
import { JourneyTimeline } from "@/components/public/landing/journey-timeline";
import { CTA } from "@/components/public/landing/cta";
import { Impact } from "@/components/public/landing/impact";
import { FAQ } from "@/components/public/landing/faq";
import { Badges } from "@/components/public/landing/badges";
import DashboardMosty from "@/components/public/landing/dashboard-most";
import Users from "@/components/public/landing/users";
import { Header } from "@/components/public/landing/header";
import { Footer } from "react-day-picker";
import NucleosHero from "@/components/ui/hero-section-sm";
import NucleosHeroMd from "@/components/ui/hero-section-md";
import NucleosHeroDesktop from "@/components/public/landing/HeroSection";
import CardsNucleos from "@/components/public/landing/cards-nucleos";
import { Testimonials } from "@/components/public/landing/testimonials";
import BlocksSection from "@/components/public/landing/blocks";
export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.25s ease" }}
    >
      <Header />
      <main>
        {/* Hero responsivo: mobile < md, tablet md–lg, desktop lg+ */}
        <div className="block md:hidden">
          <NucleosHero />
        </div>
        <div className="hidden md:block lg:hidden">
          <NucleosHeroMd />
        </div>
        <div className="hidden lg:block">
          <NucleosHeroDesktop />
        </div>
        <CardsNucleos />
        <div className="w-screen min-h-screen bg-white dark:bg-neutral-950 transition-colors duration-300 flex flex-col justify-center relative selection:bg-[#4D7CFF] selection:text-white">
          <BlocksSection />
        </div>
        {/* <Hero /> */}
        {/* <FloatingNotifications /> */}
        <Comparison />
        <DashboardMosty />
        <JourneyTimeline />
        <HowItWorks />
        <Testimonials />
        <Badges />
        <Impact />
        <Users />
        <FAQ />
        <Pricing />

        <CTA />
        <Footer />
      </main>
    </div>
  );
}
