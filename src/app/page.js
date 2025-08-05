import Hero from '@/components/Hero'
import Features from '@/components/Features'
import BrokerIntegrations from '@/components/BrokerIntegrations'
import Pricing from '@/components/Pricing'
import Stats from '@/components/Stats'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <BrokerIntegrations />
      <Pricing />
      <Footer />
    </div>
  );
}
