"use client";

import { useEffect } from "react";
import { Comparison } from "@/components/public/landing/comparison";
import { HowItWorks } from "@/components/public/landing/how-it-works";
import { Pricing } from "@/components/public/landing/pricing";
import { FloatingNotifications } from "@/components/public/landing/floating-notifications";
import { JourneyTimeline } from "@/components/public/landing/journey-timeline";
import { CTA } from "@/components/public/landing/cta";
import { Impact } from "@/components/public/landing/impact";
import { FAQ } from "@/components/public/landing/faq";
import { Badges } from "@/components/public/landing/badges";
import HeroSection from "@/components/public/landing/hero-section";
import DashboardMosty from "@/components/public/landing/dashboard-most";
import Users from "@/components/public/landing/users";
import { Header } from "@/components/public/landing/header";
import { Footer } from "react-day-picker";

export default function LandingPage() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  return (
    <div className="min-h-screen min-h-dvh">
      <Header />
      <main>
        <HeroSection />
        {/* <Hero /> */}
        {/* <FloatingNotifications /> */}
        <Comparison />
        <DashboardMosty />
        <JourneyTimeline />
        <HowItWorks />
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
