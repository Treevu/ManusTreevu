import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import HowItWorks from '@/components/landing/HowItWorks';
import Solutions from '@/components/landing/Solutions';
import WhyTreevu from '@/components/landing/WhyTreevu';
import Pricing from '@/components/landing/Pricing';
import RoiCalculator from '@/components/landing/RoiCalculator';
import FoundersForm from '@/components/landing/FoundersForm';
import NewsSection from '@/components/landing/NewsSection';
import Footer from '@/components/landing/Footer';
import FAQ from '@/components/landing/FAQ';

export default function Home() {
  return (
    <div className="min-h-screen bg-treevu-base text-treevu-text font-sans selection:bg-brand-primary selection:text-treevu-base">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Solutions />
        <WhyTreevu />
        <Pricing />
        <RoiCalculator />
        <FAQ />
        <FoundersForm />
        <NewsSection />
      </main>
      <Footer />
    </div>
  );
}
