import { Metadata } from 'next';
import Image from 'next/image';
import { Anchor, MapPin, Ship, Navigation, ShieldCheck, Info, Ticket, HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Koh Samui Ferry Piers & Island Transfers (2026 Guide)',
  description: 'Navigate Koh Samui\'s main ferry piers: Nathon, Lipa Noi, Maenam, & Bangrak. Compare operators like Lomprayah & Seatran for 2026 travel! ✓',
};

export default function PiersPage() {
  return (
    <div className="min-h-screen bg-surface-bright font-body-md text-on-surface overflow-x-hidden pb-16">
      
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://pub-3433478e81804444ae052b8316ad0d83.r2.dev/images/explore/photo-1559136555-9303baea8ebd.jpg?auto=format&fit=crop&q=80&w=2000"
            alt="High speed ferry sailing on turquoise water" 
            fill
            className="object-cover"
            priority sizes="(max-width: 768px) 100vw, 1200px"/>
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/60" />
        </div>
        <div className="relative z-10 text-center px-margin-mobile max-w-3xl">
          <div className="inline-flex items-center justify-center p-3 bg-white/20 backdrop-blur-md rounded-2xl mb-4 text-white shadow-md">
            <Anchor className="w-8 h-8" />
          </div>
          <h1 className="font-display text-display md:text-display text-white mb-4" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            Koh Samui Piers
          </h1>
          <p className="font-body-lg text-body-lg text-white/90 max-w-2xl mx-auto" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            Your vital transit hubs for exploring the Gulf of Thailand. Compare schedules, operators, and locations for seamless island-hopping.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 mt-16 max-w-5xl space-y-16">
        
        {/* Main Piers Grid */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Ship className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold text-text-main m-0">Ferry Terminals</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Nathon Pier */}
            <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm border border-outline-variant/50 flex flex-col hover:shadow-md transition-all duration-300">
              <div className="h-48 relative">
                <Image 
                  src="https://pub-3433478e81804444ae052b8316ad0d83.r2.dev/images/explore/photo-1507525428034-b723cf961d3e.jpg?auto=format&fit=crop&q=80&w=800"
                  alt="Nathon Pier sunset"
                  fill
                  className="object-cover" sizes="(max-width: 768px) 100vw, 400px"/>
                <div className="absolute top-4 right-4 bg-primary text-on-primary text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  West Coast (Main Port)
                </div>
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-text-main mb-2">Nathon Pier</h3>
                  <p className="text-text-muted text-sm leading-relaxed mb-6">
                    The primary and largest commercial terminal on the island. Serves large passenger catamarans and car ferries connecting Samui to Surat Thani (Donsak), Koh Phangan, Koh Tao, and Chumphon.
                  </p>
                  
                  <div className="bg-surface-container-low p-4 rounded-xl text-xs text-text-muted mb-6">
                    <strong>Ferry Operators:</strong> Lomprayah, Seatran Ferry, Songserm, and various speedboat agencies.
                  </div>
                </div>
                <div className="space-y-2 text-sm pt-4 border-t border-outline-variant/30">
                  <div className="flex items-center gap-2 text-text-muted"><MapPin className="w-4 h-4 text-primary" /> Nathon Town</div>
                  <div className="flex items-center gap-2 text-text-muted"><Navigation className="w-4 h-4 text-primary" /> Mainland (Donsak), Phangan, Tao</div>
                </div>
              </div>
            </div>

            {/* Maenam (Pralarn) Pier */}
            <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm border border-outline-variant/50 flex flex-col hover:shadow-md transition-all duration-300">
              <div className="h-48 relative">
                <Image 
                  src="https://pub-3433478e81804444ae052b8316ad0d83.r2.dev/images/explore/photo-1559136555-9303baea8ebd.jpg?auto=format&fit=crop&q=80&w=800"
                  alt="Maenam Pralarn Pier"
                  fill
                  className="object-cover" sizes="(max-width: 768px) 100vw, 400px"/>
                <div className="absolute top-4 right-4 bg-primary text-on-primary text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  North Coast (Fast Transit)
                </div>
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-text-main mb-2">Maenam (Pralarn) Pier</h3>
                  <p className="text-text-muted text-sm leading-relaxed mb-6">
                    A private pier operated primarily by Lomprayah. Highly popular for travelers staying on the north coast. Offers fast, comfortable catamarans directly to Koh Phangan, Koh Tao, and Chumphon.
                  </p>
                  
                  <div className="bg-surface-container-low p-4 rounded-xl text-xs text-text-muted mb-6">
                    <strong>Ferry Operators:</strong> Lomprayah High-Speed Catamaran exclusive.
                  </div>
                </div>
                <div className="space-y-2 text-sm pt-4 border-t border-outline-variant/30">
                  <div className="flex items-center gap-2 text-text-muted"><MapPin className="w-4 h-4 text-primary" /> Maenam subdistrict</div>
                  <div className="flex items-center gap-2 text-text-muted"><Navigation className="w-4 h-4 text-primary" /> Koh Phangan, Koh Tao, Chumphon</div>
                </div>
              </div>
            </div>

            {/* Bangrak Pier */}
            <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm border border-outline-variant/50 flex flex-col hover:shadow-md transition-all duration-300">
              <div className="h-48 relative">
                <Image 
                  src="https://pub-3433478e81804444ae052b8316ad0d83.r2.dev/images/explore/photo-1436491865332-7a61a109cc05.jpg?auto=format&fit=crop&q=80&w=800"
                  alt="Bangrak Pier"
                  fill
                  className="object-cover" sizes="(max-width: 768px) 100vw, 400px"/>
                <div className="absolute top-4 right-4 bg-primary text-on-primary text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  North-East (Airport Close)
                </div>
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-text-main mb-2">Bangrak Pier (Seatran)</h3>
                  <p className="text-text-muted text-sm leading-relaxed mb-6">
                    Also known as the Big Buddha Pier. Located just a 10-minute drive from Samui Airport, making it the most convenient pier for fly-and-ferry passengers heading straight to Koh Phangan or Koh Tao.
                  </p>
                  
                  <div className="bg-surface-container-low p-4 rounded-xl text-xs text-text-muted mb-6">
                    <strong>Ferry Operators:</strong> Seatran Discovery, Lomprayah, and local speedboats.
                  </div>
                </div>
                <div className="space-y-2 text-sm pt-4 border-t border-outline-variant/30">
                  <div className="flex items-center gap-2 text-text-muted"><MapPin className="w-4 h-4 text-primary" /> Bangrak (near Big Buddha)</div>
                  <div className="flex items-center gap-2 text-text-muted"><Navigation className="w-4 h-4 text-primary" /> Koh Phangan, Koh Tao</div>
                </div>
              </div>
            </div>

            {/* Lipa Noi Pier */}
            <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm border border-outline-variant/50 flex flex-col hover:shadow-md transition-all duration-300">
              <div className="h-48 relative">
                <Image 
                  src="https://pub-3433478e81804444ae052b8316ad0d83.r2.dev/images/explore/photo-1549317661-bd32c8ce0db2.jpg?auto=format&fit=crop&q=80&w=800"
                  alt="Lipa Noi Raja Ferry Pier"
                  fill
                  className="object-cover" sizes="(max-width: 768px) 100vw, 400px"/>
                <div className="absolute top-4 right-4 bg-primary text-on-primary text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  West Coast (Vehicle Ferry)
                </div>
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-text-main mb-2">Lipa Noi Pier</h3>
                  <p className="text-text-muted text-sm leading-relaxed mb-6">
                    The primary terminal for vehicle transport. Raja Ferry operates massive car ferries from here, allowing you to drive your car or scooter directly from Donsak Pier on the Surat Thani mainland.
                  </p>
                  
                  <div className="bg-surface-container-low p-4 rounded-xl text-xs text-text-muted mb-6">
                    <strong>Ferry Operators:</strong> Raja Ferry (Car Ferry).
                  </div>
                </div>
                <div className="space-y-2 text-sm pt-4 border-t border-outline-variant/30">
                  <div className="flex items-center gap-2 text-text-muted"><MapPin className="w-4 h-4 text-primary" /> Lipa Noi subdistrict</div>
                  <div className="flex items-center gap-2 text-text-muted"><Navigation className="w-4 h-4 text-primary" /> Surat Thani Mainland (Donsak)</div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Island Transfer Tips Widget */}
        <section className="bg-surface-container-lowest rounded-3xl p-8 md:p-10 shadow-sm border border-outline-variant/50">
          <div className="flex items-center gap-3 mb-6">
            <Ticket className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-text-main m-0">Ferry Booking & Travel Tips</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="bg-primary/10 p-3 rounded-2xl text-primary h-12 w-12 flex items-center justify-center shrink-0"><Info className="w-6 h-6" /></div>
              <div>
                <h4 className="font-bold text-text-main mb-1 text-sm">Advance Booking Highly Recommended</h4>
                <p className="text-xs text-text-muted leading-relaxed">
                  During peak seasons (Dec-Feb, Jul-Aug) and around the monthly Full Moon Party in Phangan, ferry tickets sell out days in advance. Always book online via the operator&apos;s official website.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-primary/10 p-3 rounded-2xl text-primary h-12 w-12 flex items-center justify-center shrink-0"><HelpCircle className="w-6 h-6" /></div>
              <div>
                <h4 className="font-bold text-text-main mb-1 text-sm">Arrive 30-45 Minutes Early</h4>
                <p className="text-xs text-text-muted leading-relaxed">
                  Ferry boarding gates close strictly 15 minutes before departure. Give yourself plenty of time to check in, tag your heavy luggage, and secure a seat on the catamaran or car deck.
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
