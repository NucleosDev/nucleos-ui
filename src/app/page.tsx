"use client"

import { Header } from '@/components/landing/header'
import { Hero } from '@/components/landing/hero'
import { Comparison } from "@/components/landing/comparison"
import { Features } from '@/components/landing/features'
import { HowItWorks } from '@/components/landing/how-it-works'
import { BentoGrid } from "@/components/landing/bento-grid"
import { AppPreview } from "@/components/landing/app-preview"
import { Testimonials } from '@/components/landing/testimonials'
import { Pricing } from '@/components/landing/pricing'
import { FloatingNotifications } from "@/components/landing/floating-notifications"
import { JourneyTimeline } from "@/components/landing/journey-timeline"
import { CTA } from '@/components/landing/cta'
import { Footer } from '@/components/landing/footer'
import { Nucleos } from "@/components/landing/nucleos"
import { Impact } from '@/components/landing/impact'
import { FAQ } from "@/components/landing/faq"
import { Badges } from "@/components/landing/badges"
import { SocialProof } from '@/components/landing/social-proof' 

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <SocialProof />
        <section id="recursos">
        <Features />
        <AppPreview />
        <Nucleos />
        <BentoGrid />
        </section>
        <FloatingNotifications />
        <Comparison />
        <section id="como-funciona">
         <JourneyTimeline />
        <HowItWorks />
        </section>
         <Badges />
         <section id="impacto">
        <Impact />
        </section>
        <section id="depoimentos">
        <Testimonials />
        </section>
        <section id="faq">
        <FAQ />
        </section>
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
