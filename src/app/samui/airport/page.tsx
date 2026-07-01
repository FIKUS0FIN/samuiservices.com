import { Metadata } from 'next';
import Image from 'next/image';
import { Plane, MapPin, Coffee, ShoppingBag, Info, ShieldCheck, Map as MapIcon, Wifi, BadgeDollarSign } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Samui Airport (USM) Official Guide - Facilities & Destinations',
  description: 'Everything you need to know about Samui International Airport (USM). Find official information on destinations, Samui Park Avenue facilities, transport, and more.',
};

export default function AirportPage() {
  return (
    <div className="min-h-screen bg-surface-hover/20 pb-16">
      {/* Hero Section */}
      <div className="relative pt-20 pb-24 px-6 border-b border-primary/10 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1579730534241-d8ecb14ba963?auto=format&fit=crop&q=80&w=2000"
            alt="Aircraft preparing for departure"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-surface via-surface/90 to-surface-hover/20 z-10" />
        </div>
        
        <div className="container mx-auto max-w-5xl text-center relative z-20">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-6 text-primary shadow-sm">
            <Plane className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-text-main mb-6 leading-tight">
            Samui International <span className="text-primary">Airport (USM)</span>
          </h1>
          <p className="text-lg md:text-xl text-text-muted max-w-3xl mx-auto leading-relaxed">
            Operated by Bangkok Airways, USM is widely recognized as one of the most beautiful airports in the world, featuring a unique open-air tropical design that immediately immerses you in the island vibe.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-16 max-w-5xl space-y-16">
        
        {/* Key Info Grid */}
        <section className="grid md:grid-cols-3 gap-6">
          <div className="bg-surface rounded-2xl p-6 shadow-sm border border-outline-muted flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-xl text-primary"><MapPin className="w-6 h-6" /></div>
            <div>
              <h3 className="font-bold text-text-main mb-1">Location</h3>
              <p className="text-sm text-text-muted">Bo Phut subdistrict, approx 2 km north of Chaweng.</p>
            </div>
          </div>
          
          <div className="bg-surface rounded-2xl p-6 shadow-sm border border-outline-muted flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-xl text-primary"><ShieldCheck className="w-6 h-6" /></div>
            <div>
              <h3 className="font-bold text-text-main mb-1">Terminals</h3>
              <p className="text-sm text-text-muted">Domestic and International terminals are within 50m walking distance.</p>
            </div>
          </div>
          
          <div className="bg-surface rounded-2xl p-6 shadow-sm border border-outline-muted flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-xl text-primary"><Info className="w-6 h-6" /></div>
            <div>
              <h3 className="font-bold text-text-main mb-1">Operating Hours</h3>
              <p className="text-sm text-text-muted">Generally operates during scheduled flights, 6:00 AM to 10:00 PM.</p>
            </div>
          </div>
        </section>

        {/* Samui Park Avenue & Facilities */}
        <section>
          <div className="flex flex-col lg:flex-row gap-10 items-center bg-surface rounded-3xl overflow-hidden shadow-sm border border-outline-muted p-4 lg:p-0">
            <div className="w-full lg:w-1/2 h-64 lg:h-full min-h-[400px] relative rounded-2xl lg:rounded-none overflow-hidden">
              <Image 
                src="https://images.unsplash.com/photo-1616057745914-f58c73d9e875?auto=format&fit=crop&q=80&w=800"
                alt="Tropical airport lounge"
                fill
                className="object-cover"
              />
            </div>
            <div className="w-full lg:w-1/2 lg:py-12 lg:pr-12">
              <h2 className="text-3xl font-bold text-text-main mb-4">Samui Park Avenue</h2>
              <p className="text-text-muted leading-relaxed mb-8">
                Unlike standard enclosed airports, Samui features an open-air promenade called <strong>Samui Park Avenue</strong>. Here, passengers can stroll through landscaped gardens while waiting for their flights.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-surface-hover/50 p-4 rounded-xl border border-outline-muted/50">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                  <div>
                    <h4 className="font-bold text-text-main">Shopping & Boutiques</h4>
                    <p className="text-sm text-text-muted">Souvenirs, local products, and duty-free goods.</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 bg-surface-hover/50 p-4 rounded-xl border border-outline-muted/50">
                  <Coffee className="w-5 h-5 text-primary" />
                  <div>
                    <h4 className="font-bold text-text-main">Dining Options</h4>
                    <p className="text-sm text-text-muted">A variety of cafés, restaurants, and quick bites.</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 bg-surface-hover/50 p-4 rounded-xl border border-outline-muted/50">
                  <BadgeDollarSign className="w-5 h-5 text-primary" />
                  <div>
                    <h4 className="font-bold text-text-main">Passenger Services</h4>
                    <p className="text-sm text-text-muted">Currency exchange, SIM cards (AIS, True, DTAC), VAT refund, and prayer rooms.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Flight Destinations */}
        <section className="bg-surface rounded-3xl p-8 shadow-sm border border-outline-muted">
          <div className="flex items-center gap-3 mb-6">
            <MapIcon className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-text-main">Direct Destinations</h2>
          </div>
          <p className="text-text-muted mb-8 leading-relaxed">
            Samui Airport serves approximately 9 direct destinations across 3 countries. Bangkok Airways is the primary operator, providing excellent connectivity.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-text-main text-lg mb-4 border-b border-outline-muted/50 pb-2">Domestic Flights</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-text-muted"><Plane className="w-4 h-4 text-primary" /> Bangkok (Suvarnabhumi BKK)</li>
                <li className="flex items-center gap-3 text-text-muted"><Plane className="w-4 h-4 text-primary" /> Bangkok (Don Mueang DMK)</li>
                <li className="flex items-center gap-3 text-text-muted"><Plane className="w-4 h-4 text-primary" /> Phuket (HKT)</li>
                <li className="flex items-center gap-3 text-text-muted"><Plane className="w-4 h-4 text-primary" /> Chiang Mai (CNX)</li>
                <li className="flex items-center gap-3 text-text-muted"><Plane className="w-4 h-4 text-primary" /> Krabi (KBV)</li>
                <li className="flex items-center gap-3 text-text-muted"><Plane className="w-4 h-4 text-primary" /> U-Tapao / Pattaya (UTP)</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-text-main text-lg mb-4 border-b border-outline-muted/50 pb-2">International Flights</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-text-muted"><Plane className="w-4 h-4 text-primary" /> Singapore (SIN) - Bangkok Airways & Scoot</li>
                <li className="flex items-center gap-3 text-text-muted"><Plane className="w-4 h-4 text-primary" /> Hong Kong (HKG)</li>
              </ul>
              <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 flex items-start gap-3">
                <Info className="w-5 h-5 shrink-0 mt-0.5" />
                <p><strong>Note:</strong> Flight routes and schedules are subject to seasonal changes. Always check with the official airlines for current availability.</p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
