import { Metadata } from 'next';
import Image from 'next/image';
import { CloudSun, Sun, CloudRain, Droplets, ThermometerSun, Map as MapIcon } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Koh Samui Complex Weather & Microclimates Guide - Samui Services',
  description: 'Understand Koh Samui\'s unique weather patterns. Learn how the Gulf of Thailand creates microclimates and distinct seasons compared to the rest of Thailand.',
};

export default function WeatherPage() {
  return (
    <div className="min-h-screen bg-surface-hover/20 pb-16">
      {/* Hero Section */}
      <div className="relative pt-20 pb-24 px-6 border-b border-primary/10 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&q=80&w=2000"
            alt="Tropical storm clouds over ocean"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-surface via-surface/90 to-surface-hover/20 z-10" />
        </div>
        
        <div className="container mx-auto max-w-5xl text-center relative z-20">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-6 text-primary shadow-sm">
            <CloudSun className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-text-main mb-6 leading-tight">
            Understanding Samui's <br/> <span className="text-primary">Complex Weather</span>
          </h1>
          <p className="text-lg md:text-xl text-text-muted max-w-3xl mx-auto leading-relaxed">
            Forget what you know about mainland Thailand. Koh Samui is protected by the Gulf of Thailand, resulting in a unique climate, distinct seasonal shifts, and fascinating local microclimates.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-16 max-w-5xl space-y-16">
        
        {/* The Gulf Influence */}
        <section>
          <div className="bg-surface rounded-3xl overflow-hidden shadow-sm border border-outline-muted flex flex-col lg:flex-row hover:border-primary/30 transition-colors">
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
                <h2 className="text-2xl font-bold text-text-main">The Gulf Shield Effect</h2>
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
        <section className="bg-surface rounded-3xl p-8 shadow-sm border border-outline-muted">
          <h2 className="text-2xl font-bold text-text-main mb-6 border-b border-outline-muted/50 pb-4">Island Microclimates</h2>
          <p className="text-text-muted mb-8 leading-relaxed max-w-3xl">
            You can experience sunshine on one side of Samui and a torrential downpour on the other. This is due to localized microclimates created by the island's topography:
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-surface-hover/50 rounded-2xl border border-outline-muted/30">
              <h3 className="font-bold text-text-main mb-2">Mountainous Interior</h3>
              <p className="text-sm text-text-muted">The tall central peaks force humid air upwards, causing it to cool and condense. This means the jungle interior sees significantly more rainfall and cloud cover than the coastal ring.</p>
            </div>
            <div className="p-6 bg-surface-hover/50 rounded-2xl border border-outline-muted/30">
              <h3 className="font-bold text-text-main mb-2">Coastal Exposure</h3>
              <p className="text-sm text-text-muted">The eastern side (Chaweng/Lamai) faces the open gulf and receives the brunt of the Northeast monsoon winds. The northern and western sides (Maenam/Nathon) are often sheltered, resulting in calmer waters.</p>
            </div>
          </div>
        </section>

        {/* The Three Seasons */}
        <section>
          <h2 className="text-3xl font-bold text-text-main mb-8 text-center">The Three Distinct Seasons</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Dry Season */}
            <div className="bg-surface rounded-2xl p-6 shadow-sm border border-outline-muted hover:border-primary/30 transition-all hover:-translate-y-1">
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
            <div className="bg-surface rounded-2xl p-6 shadow-sm border border-outline-muted hover:border-primary/30 transition-all hover:-translate-y-1">
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
            <div className="bg-surface rounded-2xl p-6 shadow-sm border border-outline-muted hover:border-primary/30 transition-all hover:-translate-y-1">
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

      </div>
    </div>
  );
}
