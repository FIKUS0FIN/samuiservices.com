import { Metadata } from 'next';
import Image from 'next/image';
import { CloudSun, Sun, CloudRain, Droplets, ThermometerSun, Map as MapIcon, ShieldCheck, CheckSquare, Wind } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Koh Samui Weather & 2026 Microclimates Travel Guide',
  description: 'Understand Koh Samui\'s unique weather patterns, seasons, and microclimates. Find out the best time to visit and what to pack in 2026! ✓',
};

export default function WeatherPage() {
  return (
    <div className="min-h-screen bg-surface-bright font-body-md text-on-surface overflow-x-hidden pb-16">
      
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=2000"
            alt="Tropical palms against a sunny blue sky on Koh Samui" 
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/60" />
        </div>
        <div className="relative z-10 text-center px-margin-mobile max-w-3xl">
          <div className="inline-flex items-center justify-center p-3 bg-white/20 backdrop-blur-md rounded-2xl mb-4 text-white shadow-md">
            <CloudSun className="w-8 h-8" />
          </div>
          <h1 className="font-display text-display md:text-display text-white mb-4" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            Samui Weather Guide
          </h1>
          <p className="font-body-lg text-body-lg text-white/90 max-w-2xl mx-auto" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            Forget what you know about mainland Thailand. Discover how the Gulf of Thailand creates a unique shield effect and distinctive local microclimates.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 mt-16 max-w-5xl space-y-16">
        
        {/* The Gulf Influence */}
        <section>
          <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm border border-outline-variant/50 flex flex-col lg:flex-row hover:shadow-md transition-all duration-300">
            <div className="w-full lg:w-1/2 h-64 lg:h-auto min-h-[350px] relative">
              <Image 
                src="https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&q=80&w=800"
                alt="Gulf of Thailand coastal view"
                fill
                className="object-cover"
              />
            </div>
            <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4 text-primary">
                <MapIcon className="w-6 h-6" />
                <h2 className="text-2xl font-bold text-text-main m-0">The Gulf Shield Effect</h2>
              </div>
              <p className="text-text-muted leading-relaxed mb-6">
                Koh Samui’s climate is entirely defined by its position inside the Gulf of Thailand. This natural geographic basin acts as a massive shield against the severe southwestern monsoons that hit Phuket and the Andaman Coast during the summer months. 
              </p>
              <p className="text-text-muted leading-relaxed">
                Because of this, Samui remains relatively dry and sunny from April to August—precisely when the other side of Thailand is experiencing its heaviest rainfall!
              </p>
            </div>
          </div>
        </section>

        {/* Microclimates */}
        <section className="bg-surface-container-lowest rounded-3xl p-8 md:p-10 shadow-sm border border-outline-variant/50">
          <h2 className="text-2xl font-bold text-text-main mb-6 border-b border-outline-variant/30 pb-4">Island Microclimates</h2>
          <p className="text-text-muted mb-8 leading-relaxed max-w-3xl">
            You can experience sunshine on one side of Samui and a torrential downpour on the other. This is due to localized microclimates created by the island's topography:
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-surface-container-low rounded-2xl border border-outline-variant/30 hover:border-primary/20 transition-all duration-200">
              <h3 className="font-bold text-text-main mb-2">Mountainous Interior</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                The tall central peaks of Samui force humid air upwards, causing it to cool and condense. This means the jungle interior and waterfalls see significantly more rainfall and cloud cover than the coastal ring.
              </p>
            </div>
            <div className="p-6 bg-surface-container-low rounded-2xl border border-outline-variant/30 hover:border-primary/20 transition-all duration-200">
              <h3 className="font-bold text-text-main mb-2">Coastal Exposure</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                The eastern side (Chaweng/Lamai) faces the open gulf and receives the brunt of the Northeast monsoon winds. The northern and western sides (Maenam/Nathon) are often sheltered, resulting in calmer waters.
              </p>
            </div>
          </div>
        </section>

        {/* The Three Seasons */}
        <section>
          <h2 className="text-3xl font-bold text-text-main mb-8 text-center">The Three Distinct Seasons</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Dry Season */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/50 hover:border-primary/30 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-6">
                <Sun className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold text-text-main mb-2">Dry Season</h3>
              <div className="text-sm font-semibold text-primary mb-4">December – February</div>
              <p className="text-text-muted text-sm leading-relaxed mb-4">
                The most popular and stable time to visit. You'll experience lower humidity, cooler evening breezes, clear skies, and calm seas. It is the peak tourist season.
              </p>
            </div>

            {/* Hot Season */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/50 hover:border-primary/30 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-6">
                <ThermometerSun className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-text-main mb-2">Hot Season</h3>
              <div className="text-sm font-semibold text-primary mb-4">March – August</div>
              <p className="text-text-muted text-sm leading-relaxed mb-4">
                Temperatures soar and the ocean becomes incredibly warm. This season is generally dry, making Samui a fantastic alternative to the rainy west coast during summer holidays.
              </p>
            </div>

            {/* Rainy Season */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/50 hover:border-primary/30 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                <CloudRain className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-text-main mb-2">Rainy Season</h3>
              <div className="text-sm font-semibold text-primary mb-4">September – November</div>
              <p className="text-text-muted text-sm leading-relaxed mb-4">
                Driven by the Northeast monsoon. November is typically the wettest month. However, tropical rain usually comes in short, heavy bursts that clear up quickly, rather than persistent day-long gloom.
              </p>
            </div>

          </div>
        </section>

        {/* Season Packing Checklist Widget */}
        <section className="bg-surface-container-lowest rounded-3xl p-8 md:p-10 shadow-sm border border-outline-variant/50">
          <div className="flex items-center gap-3 mb-6">
            <CheckSquare className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-text-main m-0">What to Pack for Koh Samui</h2>
          </div>
          <p className="text-text-muted mb-8 leading-relaxed">
            Ensure you have the right gear to stay comfortable under the tropical sun or during a passing monsoon shower.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-text-main text-lg mb-4 flex items-center gap-2">
                <Sun className="w-5 h-5 text-amber-500" /> Dry & Hot Seasons Checklist
              </h3>
              <ul className="space-y-3 text-sm text-text-muted">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" /> Light, breathable linen or cotton clothing</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" /> Reef-safe biodegradable sunscreen (SPF 50+)</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" /> Polarized sunglasses & wide-brimmed sun hat</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" /> Multi-country plug adapter & power bank</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" /> High-quality swimwear & quick-dry towel</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-text-main text-lg mb-4 flex items-center gap-2">
                <Wind className="w-5 h-5 text-blue-500" /> Rainy Season Checklist
              </h3>
              <ul className="space-y-3 text-sm text-text-muted">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" /> Lightweight waterproof rain jacket or poncho</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" /> Waterproof dry bag for phones & cameras (10L+)</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" /> Non-slip water shoes or durable sports sandals</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" /> DEET-based mosquito repellent</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" /> Compact travel umbrella</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Local Expert Verification (E-E-A-T) */}
        <section className="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/50 shadow-sm flex flex-col md:flex-row items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h4 className="font-bold text-text-main text-lg mb-1">Local Expert Verified</h4>
            <p className="text-text-muted text-sm leading-relaxed">
              This guide was researched, compiled, and is regularly updated by our Koh Samui editorial team. We visit every location first-hand and check local listings to ensure you receive accurate and trustworthy information.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
