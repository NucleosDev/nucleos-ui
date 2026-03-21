"use client";

import { useEffect } from "react";
import { Hero } from "@/components/landing/hero";
import { Comparison } from "@/components/landing/comparison";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Testimonials } from "@/components/landing/testimonials";
import { Pricing } from "@/components/landing/pricing";
import { FloatingNotifications } from "@/components/landing/floating-notifications";
import { JourneyTimeline } from "@/components/landing/journey-timeline";
import { CTA } from "@/components/landing/cta";
import { Impact } from "@/components/landing/impact";
import { FAQ } from "@/components/landing/faq";
import { Badges } from "@/components/landing/badges";
import HeroSection from "@/components/landing/hero-section";
import DashboardMosty from "@/components/landing/dashboard-most";
import Users from "@/components/landing/users";

export default function LandingPage() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  return (
    <div className="min-h-screen">
      <main>
        <HeroSection />
        <Hero />
        <FloatingNotifications />
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
      </main>
    </div>
  );
}
