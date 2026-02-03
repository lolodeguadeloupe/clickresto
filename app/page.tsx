import {
  Navigation,
  Hero,
  Features,
  Testimonials,
  Pricing,
  Affiliation,
  Contact,
  Footer,
} from '@/components/landing';

export default function LandingPage() {
  return (
    <main className="bg-clickresto-background">
      <Navigation />
      <Hero />
      <Features />
      <Testimonials />
      <Pricing />
      <Affiliation />
      <Contact />
      <Footer />
    </main>
  );
}
