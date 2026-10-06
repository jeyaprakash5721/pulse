import { SiteHeader } from "@/components/landing/site-header";
import { Hero } from "@/components/landing/hero";
import { Pricing } from "@/components/landing/pricing";
import { Faq, Features, FinalCta, Footer, HowItWorks, LogoStrip, Testimonials } from "@/components/landing/sections";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <LogoStrip />
        <Features />
        <HowItWorks />
        <Testimonials />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
