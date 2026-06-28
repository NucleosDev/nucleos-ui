"use client";

import { useEffect, useState } from "react";
import { Comparison } from "@/components/public/landing/comparison";
// import { HowItWorks } from "@/components/public/landing/how-it-works";
import { Pricing } from "@/components/public/landing/pricing";
import { FloatingNotifications } from "@/components/public/landing/floating-notifications";
import { JourneyTimeline } from "@/components/public/landing/journey-timeline";
import { CTA } from "@/components/public/landing/cta";
import { Impact } from "@/components/public/landing/impact";
import { FAQ } from "@/components/public/landing/faq";
import { Badges } from "@/components/public/landing/badges";
import DashboardMosty from "@/components/public/landing/dashboard-most";
import NucleosMost from "@/components/ui/dashboard-nucleos-most";
import Users from "@/components/public/landing/users";
import { Header } from "@/components/public/landing/header";
import { Footer } from "@/components/public/landing/footer";
import NucleosHero from "@/components/ui/hero-section-sm";
import NucleosHeroMd from "@/components/ui/hero-section-md";
import NucleosHeroDesktop from "@/components/public/landing/HeroSection";
import CardsNucleos from "@/components/public/landing/cards-nucleos";
import { Testimonials } from "@/components/public/landing/testimonials";
import BlocksSection from "@/components/public/landing/blocks";
import { WaveDivider } from "@/components/public/landing/wave-divider";

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
      className="relative min-h-screen"
      style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.25s ease" }}
    >
      {/* SVG defs sempre no DOM — url(#nucleo-wave-clip) funciona em todos os breakpoints */}
      <svg
        width="0"
        height="0"
        aria-hidden="true"
        className="absolute pointer-events-none"
      >
        <defs>
          <clipPath id="nucleo-wave-clip" clipPathUnits="objectBoundingBox">
            <path d="M 0 0 L 1 0 L 1 0.85 C 0.68 1, 0.30 0.55, 0 0.775 Z" />
          </clipPath>
        </defs>
      </svg>

      <Header />

      <main>
        {/* ── Hero → Cards (muted) ── */}
        <div className="relative bg-background pb-16">
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="w-full h-full"
              style={{
                clipPath: "url(#nucleo-wave-clip)",
                background: "linear-gradient(135deg, #4D7CFF20, #4D7CFF05)",
              }}
            />
          </div>
          <div className="block md:hidden">
            <NucleosHero />
            <WaveDivider waveColor="#000" flipY={true} flipX={true} />
          </div>
          <div className="hidden md:block lg:hidden">
            <NucleosHeroMd />
            <WaveDivider waveColor="#000" flipY={true} flipX={true} />
          </div>
          <div className="hidden lg:block">
            <NucleosHeroDesktop />
            <WaveDivider
              waveColor="#000"
              flipY={true}
              flipX={true}
              className="left-0 right-0 w-full "
            />
          </div>
        </div>

        {/* ── Cards → Blocos (background) ── */}
        <div className="relative pb-16">
          <WaveDivider
            waveColor="#000"
            className="left-0 right-0 w-full "
            flipX={true}
          />

          <CardsNucleos />
          {/* <WaveDivider waveColor="#000" className="left-0 right-0 w-full " /> */}
        </div>

        {/* ── Blocos → Comparison (muted) ── */}
        <div className="relative bg-background pb-16 selection:bg-[#4D7CFF] selection:text-white">
          <BlocksSection />
          <WaveDivider
            waveColor="#000"
            flipY={true}
            flipX={true}
            className="left-0 right-0 w-full "
          />
        </div>

        {/* ── Comparison → Dashboard (background) ── */}
        <div className="relative pb-16">
          <NucleosMost />

          {/* <WaveDivider waveColor="#000" className="left-0 right-0 w-full " /> */}
        </div>

        {/* ── Dashboard → Journey (muted) ── */}
        <div className="relative  pb-16">
          <WaveDivider
            waveColor="#000"
            className="left-0 right-0 w-full "
            // flipY={true}
            // flipX={true}
          />
          {/* <div className="relative  pb-16"></div> */}
          <DashboardMosty />
        </div>

        {/* ── Journey → Users (background) ── */}
        <div className="relative pb-16">
          <JourneyTimeline />
          <WaveDivider
            waveColor="#000"
            className="left-0 right-0 w-full "
            // flipY={true}
            flipY={true}
          />
        </div>

        {/* ── Users → FAQ (muted) ── */}
        <div className="relative pb-16">
          <div className="absolute inset-0 pointer-events-none"></div>
          <Users />
          {/* <WaveDivider waveColor="#000" flipY={true} flipX={true} /> */}
        </div>

        {/* ── FAQ → Pricing (background) ── */}
        <div className="relative  pb-16">
          <FAQ />
          <WaveDivider waveColor="#000" />
        </div>

        {/* ── Pricing → CTA (muted) ── */}
        <div className="relative bg-background pb-16">
          <div className="absolute inset-0 pointer-events-none"></div>
          <Pricing />
          <WaveDivider waveColor="#000" flipY={true} flipX={true} />
        </div>

        {/* ── CTA ── */}
        <div className="bg-muted">
          <div
            className="w-full h-full"
            style={{
              clipPath: "url(#nucleo-wave-clip)",
              background: "linear-gradient(135deg, #4D7CFF20, #4D7CFF05)",
            }}
          />
          <CTA />
        </div>

        <Footer />
      </main>
    </div>
  );
}
