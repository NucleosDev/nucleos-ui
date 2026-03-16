import { Header } from '@/components/landing/header'
import { Hero } from '@/components/landing/hero'
import { Features } from '@/components/landing/features'
import { HowItWorks } from '@/components/landing/how-it-works'
import { Testimonials } from '@/components/landing/testimonials'
import { Pricing } from '@/components/landing/pricing'
import { CTA } from '@/components/landing/cta'
import { Footer } from '@/components/landing/footer'
import { Nucleos } from "@/components/landing/nucleos"
import { Impact } from '@/components/landing/impact'


export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Features />
        <Nucleos />
        <HowItWorks />
        <Impact />
        <Testimonials />
        <Pricing />
        <CTA />
       
      </main>
      <Footer />
    </div>
  )
}
