import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/hero/Hero';
import CircuitBoard from '@/components/circuit-board/Simulation';
import LearningPlatform from '@/components/LearningPlatform';
import HardwareKits from '@/components/HardwareKits';
import Stats from '@/components/Stats';
import Team from '@/components/Team';
import Contact from '@/components/contact/Contact';
import Footer from '@/components/layout/Footer';
import CompaniesRibbon from '@/components/CompaniesRibbon';
import Testimonials from '@/components/Testimonials';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <div className="hidden md:block">
        <CircuitBoard />
      </div>
      <LearningPlatform />
      <HardwareKits />
      <Stats />
      <CompaniesRibbon />
      <Testimonials />
      <Team />
      <Contact />
      <Footer />
    </main>
  );
}