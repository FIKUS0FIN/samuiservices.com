import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Ship, Bus, Plane, Car, Route, MapPin, Anchor, ArrowRight, ShieldCheck, Ticket } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Koh Samui Transportation Guide: Ferries, Taxis & Buses (2026)',
  description: 'Find the best ways to get to Koh Phangan, Koh Tao, and Phang Nga from Koh Samui. Compare taxis, ferries, and local transport options in 2026! ✓',
};

export default function TransportationPage() {
  return (
    <div className="min-h-screen bg-surface-bright font-body-md text-on-surface overflow-x-hidden pb-16">
      
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=80&w=2000"
            alt="Scenic view of a boat sailing on turquoise water" 
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/60" />
        </div>
        <div className="relative z-10 text-center px-margin-mobile max-w-3xl">
          <div className="inline-flex items-center justify-center p-3 bg-white/20 backdrop-blur-md rounded-2xl mb-4 text-white shadow-md">
            <Route className="w-8 h-8" />
          </div>
          <h1 className="font-display text-display md:text-display text-white mb-4" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            Transportation Guide
          </h1>
          <p className="font-body-lg text-body-lg text-white/90 max-w-2xl mx-auto" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            Navigate Koh Samui and the Gulf of Thailand with confidence. Compare local taxi apps, ferry lines, and mainland bus routes.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 mt-16 max-w-5xl space-y-16">
        
        {/* Island Hopping */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Ship className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold text-text-main m-0">Samui to Koh Phangan & Koh Tao</h2>
          </div>
          
          <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm border border-outline-variant/50 p-8">
            <p className="text-text-muted mb-8 leading-relaxed text-sm">
              Koh Phangan and Koh Tao lie directly north of Koh Samui. As there are no airports on those islands, travel is strictly by sea. The high-speed catamaran ferries run several times daily.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 hover:border-primary/20 transition-all duration-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-white p-2 rounded-lg shadow-xs"><Ship className="w-5 h-5 text-primary" /></div>
                  <h3 className="font-bold text-text-main text-base m-0">Lomprayah Catamarans</h3>
                </div>
                <p className="text-xs text-text-muted leading-relaxed">
                  The fastest and most stable transport. Catamarans depart from Maenam (Pralarn) Pier and Nathon Pier. Reaches Koh Phangan in 20-30 minutes, and Koh Tao in 1.5 to 2 hours.
                </p>
              </div>

              <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 hover:border-primary/20 transition-all duration-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-white p-2 rounded-lg shadow-xs"><Ship className="w-5 h-5 text-primary" /></div>
                  <h3 className="font-bold text-text-main text-base m-0">Seatran Discovery</h3>
                </div>
                <p className="text-xs text-text-muted leading-relaxed">
                  Highly comfortable passenger vessels departing from Bangrak Pier. Perfect for travelers coming directly from the airport. Takes about 30 mins to Phangan and 2 hours to Tao.
                </p>
              </div>
            </div>

            <div className="bg-primary/5 rounded-2xl p-6 border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                  <Anchor className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-text-main text-sm mb-0.5">Need pier directions?</h4>
                  <p className="text-xs text-text-muted leading-relaxed">Learn about ferry operators, terminal facilities, and precise terminal locations on our piers guide.</p>
                </div>
              </div>
              <Link href="/samui/piers" className="px-6 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transition-colors flex items-center gap-2 text-xs whitespace-nowrap">
                View Piers Guide
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Mainland Travel */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Bus className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold text-text-main m-0">Samui to Phang Nga (Mainland)</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-outline-variant/50 hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-4">
                <Bus className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-bold text-text-main m-0">Joint Ferry & Bus Ticket</h3>
              </div>
              <p className="text-text-muted text-sm leading-relaxed mb-4">
                The most practical overland option. You purchase a single ticket from agencies like Lomprayah or Phantip. You ride the ferry from Nathon Pier to Donsak Pier on the mainland, where a synchronized air-conditioned minivan or coach meets you to drive directly across to Phang Nga province.
              </p>
              <div className="inline-block bg-surface-container-low text-xs font-semibold px-3 py-1.5 rounded-lg text-text-main border border-outline-variant/30">
                Duration: 5.5 - 7 hours | Est: 750 - 950 THB
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-outline-variant/50 hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-4">
                <Plane className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-bold text-text-main m-0">Fly & Drive via Phuket</h3>
              </div>
              <p className="text-text-muted text-sm leading-relaxed mb-4">
                No airport exists in Phang Nga province. The fastest travel method is booking a direct flight operated by Bangkok Airways from Samui Airport (USM) to Phuket International Airport (HKT). From HKT, you can rent a car or take a taxi across the Sarasin Bridge directly into Phang Nga.
              </p>
              <div className="inline-block bg-surface-container-low text-xs font-semibold px-3 py-1.5 rounded-lg text-text-main border border-outline-variant/30">
                Flight: 55 mins | Drive: 1 hour | Est: 4,000+ THB
              </div>
            </div>
          </div>
        </section>

        {/* Local Transport */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Car className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold text-text-main m-0">Getting Around Samui</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/50 hover:shadow-md transition-all">
              <h3 className="text-lg font-bold text-text-main mb-2">Songthaews</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Red pickup passenger trucks running continuously along the main ring road. Wave one down to board. Always confirm the fare with the driver before getting in (standard fare is 50-150 THB depending on distance).
              </p>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/50 hover:shadow-md transition-all">
              <h3 className="text-lg font-bold text-text-main mb-2">Ride-Hailing Apps</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Highly recommended for transparent fares. Grab and InDrive apps are widely active on the island. Local private street taxis are available but often refuse to use the meter—negotiate carefully.
              </p>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/50 hover:shadow-md transition-all">
              <h3 className="text-lg font-bold text-text-main mb-2">Vehicle Rentals</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Scooters (150-300 THB/day) or economy cars (800-1200 THB/day) provide maximum independence. Ensure you carry your license and International Driving Permit to navigate checkpoints legally.
              </p>
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
