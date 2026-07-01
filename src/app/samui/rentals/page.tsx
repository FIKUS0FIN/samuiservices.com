import { Metadata } from 'next';
import Image from 'next/image';
import { Key, Car, Bike, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Koh Samui Car & Scooter Rental Prices & Guide 2024 - Samui Services',
  description: 'Standard rental prices for scooters and cars on Koh Samui. Learn how to rent safely, avoid scams, and explore the island with confidence.',
};

export default function RentalsPage() {
  return (
    <div className="min-h-screen bg-surface-hover/20 pb-16">
      {/* Hero Section */}
      <div className="relative pt-20 pb-24 px-6 border-b border-primary/10 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=2000"
            alt="Riding a scooter in Thailand"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-surface via-surface/90 to-surface-hover/20 z-10" />
        </div>
        
        <div className="container mx-auto max-w-5xl text-center relative z-20">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-6 text-primary shadow-sm">
            <Key className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-text-main mb-6 leading-tight">
            Vehicle <span className="text-primary">Rental Guide</span>
          </h1>
          <p className="text-lg md:text-xl text-text-muted max-w-3xl mx-auto leading-relaxed">
            Renting your own vehicle is the best way to uncover Koh Samui's hidden gems. Review our 2024 guide for standard pricing, essential safety tips, and what you need to hit the road legally.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-16 max-w-5xl space-y-16">
        
        {/* Pricing Grids */}
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Scooter Rentals */}
          <div className="bg-surface rounded-3xl overflow-hidden shadow-sm border border-outline-muted flex flex-col hover:border-primary/30 transition-colors">
            <div className="h-48 relative">
              <Image 
                src="https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=800"
                alt="Scooter parked on tropical island"
                fill
                className="object-cover"
              />
              <div className="absolute top-4 left-4 bg-surface/90 backdrop-blur-sm px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-text-main shadow-sm">
                <Bike className="w-5 h-5 text-primary" /> Scooters
              </div>
            </div>
            <div className="p-8 flex-grow flex flex-col">
              <p className="text-text-muted mb-6">The most popular and affordable way to get around. Ideal for solo travelers and couples.</p>
              
              <div className="space-y-4 mb-8 flex-grow">
                <div className="flex justify-between items-center border-b border-outline-muted/50 pb-4">
                  <span className="font-semibold text-text-main">Standard (Honda Click, 125cc)</span>
                  <span className="text-primary font-bold">150 - 250 THB/day</span>
                </div>
                <div className="flex justify-between items-center border-b border-outline-muted/50 pb-4">
                  <span className="font-semibold text-text-main">Premium (Honda PCX, 160cc)</span>
                  <span className="text-primary font-bold">300 - 450 THB/day</span>
                </div>
                <div className="flex justify-between items-center pb-2">
                  <span className="font-semibold text-text-main">Monthly Rate (Standard)</span>
                  <span className="text-primary font-bold">~3,500 - 5,000 THB</span>
                </div>
              </div>
              
              <div className="bg-primary/5 rounded-xl p-4 text-sm text-text-muted border border-primary/20">
                <strong>Requirement:</strong> International Driving Permit (IDP) with motorcycle endorsement. Helmets are strictly mandatory by law.
              </div>
            </div>
          </div>

          {/* Car Rentals */}
          <div className="bg-surface rounded-3xl overflow-hidden shadow-sm border border-outline-muted flex flex-col hover:border-primary/30 transition-colors">
            <div className="h-48 relative">
              <Image 
                src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800"
                alt="Car driving on coastal road"
                fill
                className="object-cover"
              />
              <div className="absolute top-4 left-4 bg-surface/90 backdrop-blur-sm px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-text-main shadow-sm">
                <Car className="w-5 h-5 text-primary" /> Cars & SUVs
              </div>
            </div>
            <div className="p-8 flex-grow flex flex-col">
              <p className="text-text-muted mb-6">Offers air-conditioned comfort and superior safety. Highly recommended for families or during the rainy season.</p>
              
              <div className="space-y-4 mb-8 flex-grow">
                <div className="flex justify-between items-center border-b border-outline-muted/50 pb-4">
                  <span className="font-semibold text-text-main">Economy (Toyota Yaris)</span>
                  <span className="text-primary font-bold">750 - 1,000 THB/day</span>
                </div>
                <div className="flex justify-between items-center border-b border-outline-muted/50 pb-4">
                  <span className="font-semibold text-text-main">SUV/7-Seater (Fortuner)</span>
                  <span className="text-primary font-bold">1,800 - 2,500+ THB/day</span>
                </div>
                <div className="flex justify-between items-center pb-2">
                  <span className="font-semibold text-text-main">Monthly Rate (Economy)</span>
                  <span className="text-primary font-bold">~15,000+ THB</span>
                </div>
              </div>
              
              <div className="bg-primary/5 rounded-xl p-4 text-sm text-text-muted border border-primary/20">
                <strong>Requirement:</strong> Valid driver's license, IDP, Passport, and usually a credit card or cash deposit (typically 3,000 - 5,000 THB).
              </div>
            </div>
          </div>

        </div>

        {/* Safety & Best Practices */}
        <section className="bg-surface rounded-3xl p-8 shadow-sm border border-outline-muted">
          <div className="flex items-center gap-3 mb-8">
            <ShieldCheck className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-text-main">Essential Rental Tips</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-bold text-text-main flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4 text-primary" /> Document Everything
              </h3>
              <p className="text-sm text-text-muted">
                Before driving away, take a comprehensive video walking around the vehicle. Photograph every existing scratch, dent, or mark to avoid false damage claims when returning.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-text-main flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4 text-primary" /> Insurance Matters
              </h3>
              <p className="text-sm text-text-muted">
                Always ask if the rental includes "first-class" or comprehensive insurance. Many cheap scooter rentals only carry basic government insurance which covers medical but not vehicle damage.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-text-main flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-amber-500" /> Never Leave Passports
              </h3>
              <p className="text-sm text-text-muted">
                Reputable companies will take a photocopy of your passport and require a cash deposit. Never hand over your actual passport as collateral—it is your most vital travel document.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
