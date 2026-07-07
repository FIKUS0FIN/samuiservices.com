import { Metadata } from 'next';
import Image from 'next/image';
import { ShoppingBag, ShoppingCart, Store, Utensils, MapPin, Coffee, Tag, ShieldCheck, TicketPercent, Coins } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Best Koh Samui Shopping Malls & Supercenters (2026 Guide)',
  description: 'Find the best places to shop on Koh Samui. Explore modern air-conditioned malls, international brands, premium supermarkets, and shopping tips! ✓',
};

export default function MallsPage() {
  return (
    <div className="min-h-screen bg-surface-bright font-body-md text-on-surface overflow-x-hidden pb-16">
      
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&q=80&w=2000"
            alt="Modern open-air shopping mall corridor with palm trees" 
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/60" />
        </div>
        <div className="relative z-10 text-center px-margin-mobile max-w-3xl">
          <div className="inline-flex items-center justify-center p-3 bg-white/20 backdrop-blur-md rounded-2xl mb-4 text-white shadow-md">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h1 className="font-display text-display md:text-display text-white mb-4" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            Malls & Shopping Guide
          </h1>
          <p className="font-body-lg text-body-lg text-white/90 max-w-2xl mx-auto" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            From high-end international brands and premium supermarkets to coastal lifestyle pavilions, discover Samui&apos;s modern retail scene.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 mt-16 max-w-5xl space-y-16">
        
        {/* Lifestyle Malls */}
        <section className="space-y-10">
          
          {/* Central Samui */}
          <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm border border-outline-variant/50 flex flex-col lg:flex-row hover:shadow-md transition-all duration-300">
            <div className="w-full lg:w-1/2 h-64 lg:h-auto min-h-[350px] relative">
              <Image 
                src="https://images.unsplash.com/photo-1560243563-062bff001d68?auto=format&fit=crop&q=80&w=800"
                alt="Central Samui shopping complex exterior"
                fill
                className="object-cover"
              />
            </div>
            <div className="w-full lg:w-1/2 p-8 lg:p-10 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">Lifestyle Mall</span>
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-text-main mb-2 m-0">Central Samui</h2>
                <div className="flex items-center gap-2 text-text-muted mb-4">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-sm">Chaweng Beach Road</span>
                </div>
                <p className="text-text-muted text-sm leading-relaxed mb-6">
                  The largest and most comprehensive shopping complex on the island. It features a unique open-air tropical design with landscaped gardens, water features, and a central play park. Includes a cinema, gaming arcade, and over 150 shops.
                </p>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 bg-surface-container-low p-1.5 rounded-md text-primary"><Store className="w-4 h-4" /></div>
                    <div>
                      <h4 className="font-semibold text-text-main text-xs mb-0.5">International Brands</h4>
                      <p className="text-[11px] text-text-muted">Uniqlo, H&M, Adidas, sports shops</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 bg-surface-container-low p-1.5 rounded-md text-primary"><ShoppingCart className="w-4 h-4" /></div>
                    <div>
                      <h4 className="font-semibold text-text-main text-xs mb-0.5">Tops Supermarket</h4>
                      <p className="text-[11px] text-text-muted">Premium imported products & groceries</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 bg-surface-container-low p-1.5 rounded-md text-primary"><Utensils className="w-4 h-4" /></div>
                    <div>
                      <h4 className="font-semibold text-text-main text-xs mb-0.5">Dining & Food Court</h4>
                      <p className="text-[11px] text-text-muted">International restaurants & local eats</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 bg-surface-container-low p-1.5 rounded-md text-primary"><Tag className="w-4 h-4" /></div>
                    <div>
                      <h4 className="font-semibold text-text-main text-xs mb-0.5">VAT Refund Counter</h4>
                      <p className="text-[11px] text-text-muted">Tourist tax-back services on site</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Wharf Samui */}
          <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm border border-outline-variant/50 flex flex-col lg:flex-row-reverse hover:shadow-md transition-all duration-300">
            <div className="w-full lg:w-1/2 h-64 lg:h-auto min-h-[350px] relative">
              <Image 
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800"
                alt="Wharf Samui beachfront style retail"
                fill
                className="object-cover"
              />
            </div>
            <div className="w-full lg:w-1/2 p-8 lg:p-10 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">Open-Air Promenade</span>
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-text-main mb-2 m-0">The Wharf Samui</h2>
                <div className="flex items-center gap-2 text-text-muted mb-4">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-sm">Fisherman&apos;s Village, Bophut</span>
                </div>
                <p className="text-text-muted text-sm leading-relaxed mb-6">
                  A charming beachfront shopping center that merges traditional retro-style Thai-Chinese architecture with Western comforts. Offers a direct walkway into the Friday Walking Street and holds gorgeous sunset views.
                </p>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 bg-surface-container-low p-1.5 rounded-md text-primary"><Store className="w-4 h-4" /></div>
                    <div>
                      <h4 className="font-semibold text-text-main text-xs mb-0.5">Artisan Boutiques</h4>
                      <p className="text-[11px] text-text-muted">Local crafts, beachwear, customized jewelry</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 bg-surface-container-low p-1.5 rounded-md text-primary"><Coffee className="w-4 h-4" /></div>
                    <div>
                      <h4 className="font-semibold text-text-main text-xs mb-0.5">Beachfront Dining</h4>
                      <p className="text-[11px] text-text-muted">Scenic coffee shops & restaurants overlooking the bay</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* Hypermarkets */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <ShoppingCart className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold text-text-main m-0">Supercenters & Hypermarkets</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-outline-variant/50 hover:shadow-md transition-all">
              <h3 className="text-xl font-bold text-text-main mb-2">Big C Supercenter</h3>
              <div className="flex items-center gap-2 text-text-muted mb-4 text-sm">
                <MapPin className="w-4 h-4 text-primary" /> Bophut subdistrict
              </div>
              <p className="text-text-muted text-sm leading-relaxed mb-4">
                Practical, budget-friendly shopping featuring a massive grocery section, electronics department, housewares, and basic apparel. The building houses local banks, phone carriers, and a cheap food court.
              </p>
            </div>

            <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-outline-variant/50 hover:shadow-md transition-all">
              <h3 className="text-xl font-bold text-text-main mb-2">Lotus&apos;s Chaweng</h3>
              <div className="flex items-center gap-2 text-text-muted mb-4 text-sm">
                <MapPin className="w-4 h-4 text-primary" /> Chaweng (along the main ring road)
              </div>
              <p className="text-text-muted text-sm leading-relaxed mb-4">
                A large complex offering comprehensive grocery options, affordable household goods, sports equipment, and small boutique stalls. Features several major fast-food outlets, banks, and optical shops.
              </p>
            </div>
          </div>
        </section>

        {/* Shopping Tips Widget */}
        <section className="bg-surface-container-lowest rounded-3xl p-8 md:p-10 shadow-sm border border-outline-variant/50">
          <div className="flex items-center gap-3 mb-6">
            <TicketPercent className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-text-main m-0">Tourist Shopping Tips</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="bg-primary/10 p-3 rounded-2xl text-primary h-12 w-12 flex items-center justify-center shrink-0"><Tag className="w-6 h-6" /></div>
              <div>
                <h4 className="font-bold text-text-main mb-1 text-sm">VAT Refund for Tourists</h4>
                <p className="text-xs text-text-muted leading-relaxed">
                  Look for shops displaying the &quot;VAT Refund for Tourists&quot; logo. For purchases over 2,000 THB at a single store, ask for the VAT Refund Form (P.P.10) to claim your 7% tax back at Samui Airport when departing!
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-primary/10 p-3 rounded-2xl text-primary h-12 w-12 flex items-center justify-center shrink-0"><Coins className="w-6 h-6" /></div>
              <div>
                <h4 className="font-bold text-text-main mb-1 text-sm">Card Payments & Cash</h4>
                <p className="text-xs text-text-muted leading-relaxed">
                  Malls, supermarkets, and chain restaurants accept all major credit cards. However, for local stalls inside malls or food courts, cash is highly preferred. ATMs are widely available at all malls.
                </p>
              </div>
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
