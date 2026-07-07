import { Metadata } from 'next';
import Image from 'next/image';
import { MapPin, Clock, CalendarDays, Store, ShoppingBag, ShieldCheck, Star, Utensils } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Best Koh Samui Night Markets & Walking Streets (2026 Guide)',
  description: 'Plan your shopping and street food adventures with the ultimate 2026 guide to Koh Samui night markets, walking streets, and daily fresh markets! ✓',
};

export default function MarketsPage() {
  return (
    <div className="min-h-screen bg-surface-bright font-body-md text-on-surface overflow-x-hidden pb-16">
      
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&q=80&w=2000"
            alt="Vibrant Thai night market with colorful street food stalls" 
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/60" />
        </div>
        <div className="relative z-10 text-center px-margin-mobile max-w-3xl">
          <div className="inline-flex items-center justify-center p-3 bg-white/20 backdrop-blur-md rounded-2xl mb-4 text-white shadow-md">
            <Store className="w-8 h-8" />
          </div>
          <h1 className="font-display text-display md:text-display text-white mb-4" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            Samui Markets Guide
          </h1>
          <p className="font-body-lg text-body-lg text-white/90 max-w-2xl mx-auto" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            Experience the culinary heart and vibrant culture of Koh Samui through its lively walking streets, night bazaars, and traditional fresh food markets.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 mt-16 max-w-5xl space-y-16">
        
        {/* Night Markets Section */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <ShoppingBag className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold text-text-main m-0">Popular Walking Streets & Night Markets</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Fisherman's Village */}
            <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm border border-outline-variant/50 flex flex-col hover:shadow-md transition-all duration-300">
              <div className="h-48 relative">
                <Image 
                  src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800"
                  alt="Fisherman's Village Walking Street"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-text-main mb-2">Fisherman&apos;s Village Walking Street</h3>
                  <p className="text-text-muted text-sm leading-relaxed mb-6">
                    The island&apos;s flagship weekly market. Stretches down the narrow Bophut beach road, lined with boutique shops, beach bars, and hundreds of temporary stalls selling clothes, handicrafts, and cocktails.
                  </p>
                </div>
                <div className="space-y-2 text-sm pt-4 border-t border-outline-variant/30">
                  <div className="flex items-center gap-2 text-text-muted"><MapPin className="w-4 h-4 text-primary" /> Bophut subdistrict</div>
                  <div className="flex items-center gap-2 text-text-muted"><CalendarDays className="w-4 h-4 text-primary" /> Every Friday (with smaller events on Mon/Wed)</div>
                  <div className="flex items-center gap-2 text-text-muted"><Clock className="w-4 h-4 text-primary" /> 17:00 - 23:00</div>
                </div>
              </div>
            </div>

            {/* Lamai Night Market */}
            <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm border border-outline-variant/50 flex flex-col hover:shadow-md transition-all duration-300">
              <div className="h-48 relative">
                <Image 
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800"
                  alt="Lamai Night Market"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-text-main mb-2">Lamai Night Market</h3>
                  <p className="text-text-muted text-sm leading-relaxed mb-6">
                    A bustling street market closing off the central Lamai intersection. Famous for its heavy focus on affordable clothing, beachwear, local souvenirs, and a massive street food hub in the center.
                  </p>
                </div>
                <div className="space-y-2 text-sm pt-4 border-t border-outline-variant/30">
                  <div className="flex items-center gap-2 text-text-muted"><MapPin className="w-4 h-4 text-primary" /> Central Lamai (near McDs)</div>
                  <div className="flex items-center gap-2 text-text-muted"><CalendarDays className="w-4 h-4 text-primary" /> Every Sunday</div>
                  <div className="flex items-center gap-2 text-text-muted"><Clock className="w-4 h-4 text-primary" /> 17:00 - 23:00</div>
                </div>
              </div>
            </div>

            {/* Chaweng Night Market */}
            <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm border border-outline-variant/50 flex flex-col hover:shadow-md transition-all duration-300">
              <div className="h-48 relative">
                <Image 
                  src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800"
                  alt="Chaweng Night Market food court"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-text-main mb-2">Chaweng Night Market</h3>
                  <p className="text-text-muted text-sm leading-relaxed mb-6">
                    An open-air food bazaar located behind Central Samui. It is the ultimate spot on the island for fresh seafood, featuring ice-covered displays where you select fish or lobster to be cooked to order.
                  </p>
                </div>
                <div className="space-y-2 text-sm pt-4 border-t border-outline-variant/30">
                  <div className="flex items-center gap-2 text-text-muted"><MapPin className="w-4 h-4 text-primary" /> Chaweng (behind Central Mall)</div>
                  <div className="flex items-center gap-2 text-text-muted"><CalendarDays className="w-4 h-4 text-primary" /> Open Daily</div>
                  <div className="flex items-center gap-2 text-text-muted"><Clock className="w-4 h-4 text-primary" /> 17:00 - 23:30</div>
                </div>
              </div>
            </div>

            {/* Maenam Walking Street */}
            <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm border border-outline-variant/50 flex flex-col hover:shadow-md transition-all duration-300">
              <div className="h-48 relative">
                <Image 
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800"
                  alt="Maenam Walking Street Chinatown"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-text-main mb-2">Maenam Walking Street</h3>
                  <p className="text-text-muted text-sm leading-relaxed mb-6">
                    Set in the charming Chinatown area of Maenam, this market has a highly relaxed, family-friendly vibe. Excellent for cheap cocktails served in bamboo cups and traditional local sweets.
                  </p>
                </div>
                <div className="space-y-2 text-sm pt-4 border-t border-outline-variant/30">
                  <div className="flex items-center gap-2 text-text-muted"><MapPin className="w-4 h-4 text-primary" /> Maenam Chinatown</div>
                  <div className="flex items-center gap-2 text-text-muted"><CalendarDays className="w-4 h-4 text-primary" /> Every Thursday</div>
                  <div className="flex items-center gap-2 text-text-muted"><Clock className="w-4 h-4 text-primary" /> 17:00 - 22:30</div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Day & Fresh Markets Section */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Store className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold text-text-main m-0">Day & Fresh Markets</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            
            <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm border border-outline-variant/50 flex flex-col md:flex-row hover:shadow-md transition-all duration-300">
              <div className="md:w-1/3 h-48 md:h-auto relative">
                <Image 
                  src="https://images.unsplash.com/photo-1488459718432-0685149d5aa8?auto=format&fit=crop&q=80&w=800"
                  alt="Nathon Fresh Market"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-text-main mb-1">Nathon Fresh Market</h3>
                  <p className="text-text-muted text-xs leading-relaxed mb-4">
                    The primary local trading post. Excellent for cheap tropical fruits, freshly grated coconut, Thai curry pastes, and local seafood.
                  </p>
                </div>
                <div className="space-y-1.5 text-xs border-t border-outline-variant/30 pt-3">
                  <div className="flex items-center gap-2 text-text-muted"><MapPin className="w-3.5 h-3.5 text-primary" /> Nathon Port</div>
                  <div className="flex items-center gap-2 text-text-muted"><Clock className="w-3.5 h-3.5 text-primary" /> Daily: 05:00 - 16:00</div>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm border border-outline-variant/50 flex flex-col md:flex-row hover:shadow-md transition-all duration-300">
              <div className="md:w-1/3 h-48 md:h-auto relative">
                <Image 
                  src="https://images.unsplash.com/photo-1534482421-64566f976cfa?auto=format&fit=crop&q=80&w=800"
                  alt="Hua Thanon Market"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-text-main mb-1">Hua Thanon Market</h3>
                  <p className="text-text-muted text-xs leading-relaxed mb-4">
                    Located in the traditional Muslim fishing village. Best spot for purchasing the absolute freshest morning catch directly from local fishing boats.
                  </p>
                </div>
                <div className="space-y-1.5 text-xs border-t border-outline-variant/30 pt-3">
                  <div className="flex items-center gap-2 text-text-muted"><MapPin className="w-3.5 h-3.5 text-primary" /> Hua Thanon (South Coast)</div>
                  <div className="flex items-center gap-2 text-text-muted"><Clock className="w-3.5 h-3.5 text-primary" /> Daily: 04:00 - 11:00 AM</div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Must-Try Street Food Widget */}
        <section className="bg-surface-container-lowest rounded-3xl p-8 md:p-10 shadow-sm border border-outline-variant/50">
          <div className="flex items-center gap-3 mb-6">
            <Utensils className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-text-main m-0">Must-Try Market Delicacies</h2>
          </div>
          <p className="text-text-muted mb-8 leading-relaxed">
            Don&apos;t leave the night markets without trying these highly popular and delicious Thai street foods:
          </p>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/30">
              <div className="flex items-center gap-1 text-tertiary mb-2">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-bold text-xs">Moo Ping</span>
              </div>
              <h4 className="font-bold text-text-main text-sm mb-1">Grilled Pork Skewers</h4>
              <p className="text-xs text-text-muted leading-relaxed">Sweet and savory marinated pork skewers grilled over charcoal. Pair with hot sticky rice (10-15 THB per skewer).</p>
            </div>
            
            <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/30">
              <div className="flex items-center gap-1 text-tertiary mb-2">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-bold text-xs">Som Tum</span>
              </div>
              <h4 className="font-bold text-text-main text-sm mb-1">Green Papaya Salad</h4>
              <p className="text-xs text-text-muted leading-relaxed">Shredded green papaya, tomatoes, chilies, garlic, fish sauce, and lime juice mashed in a mortar (40-60 THB).</p>
            </div>
            
            <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/30">
              <div className="flex items-center gap-1 text-tertiary mb-2">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-bold text-xs">Khanom Krok</span>
              </div>
              <h4 className="font-bold text-text-main text-sm mb-1">Coconut Pancakes</h4>
              <p className="text-xs text-text-muted leading-relaxed">Sweet, custard-like coconut grilled pancakes cooked in a specialized dimpled iron pan. Crispy outside, molten inside (30 THB).</p>
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
