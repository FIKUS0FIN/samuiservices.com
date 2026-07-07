import { Metadata } from 'next';
import Image from 'next/image';
import { Plane, MapPin, Coffee, ShoppingBag, Info, ShieldCheck, Map as MapIcon, Wifi, BadgeDollarSign, HeartPulse, Sparkles, Luggage } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Samui International Airport (USM) 2026 Travel Guide',
  description: 'Find official information on Samui Airport (USM). Explore flight routes, destinations, Samui Park Avenue facilities, passenger services, & airport transit! ✓',
};

export default function AirportPage() {
  return (
    <div className="min-h-screen bg-surface-bright font-body-md text-on-surface overflow-x-hidden pb-16">
      
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://pub-3433478e81804444ae052b8316ad0d83.r2.dev/images/explore/photo-1436491865332-7a61a109cc05.jpg?auto=format&fit=crop&q=80&w=2000"
            alt="Airplane preparing for landing on tropical island runway" 
            fill
            className="object-cover"
            priority sizes="(max-width: 768px) 100vw, 1200px"/>
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/60" />
        </div>
        <div className="relative z-10 text-center px-margin-mobile max-w-3xl">
          <div className="inline-flex items-center justify-center p-3 bg-white/20 backdrop-blur-md rounded-2xl mb-4 text-white shadow-md">
            <Plane className="w-8 h-8" />
          </div>
          <h1 className="font-display text-display md:text-display text-white mb-4" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            Samui Airport (USM)
          </h1>
          <p className="font-body-lg text-body-lg text-white/90 max-w-2xl mx-auto" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            Consistently voted one of the most beautiful airports in the world, featuring an open-air tropical design that immediately welcomes you to island paradise.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 mt-16 max-w-5xl space-y-16">
        
        {/* Key Info Grid */}
        <section className="grid md:grid-cols-3 gap-6">
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/50 flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-xl text-primary shrink-0"><MapPin className="w-6 h-6" /></div>
            <div>
              <h3 className="font-bold text-text-main text-sm mb-1">Location</h3>
              <p className="text-xs text-text-muted leading-relaxed">Bo Phut subdistrict, approximately 2 km north of main Chaweng.</p>
            </div>
          </div>
          
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/50 flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-xl text-primary shrink-0"><ShieldCheck className="w-6 h-6" /></div>
            <div>
              <h3 className="font-bold text-text-main text-sm mb-1">Terminals</h3>
              <p className="text-xs text-text-muted leading-relaxed">Domestic and International terminals are within 50m walking distance.</p>
            </div>
          </div>
          
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/50 flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-xl text-primary shrink-0"><Info className="w-6 h-6" /></div>
            <div>
              <h3 className="font-bold text-text-main text-sm mb-1">Operating Hours</h3>
              <p className="text-xs text-text-muted leading-relaxed">Daily from 06:00 AM to 10:00 PM (restricted due to noise regulations).</p>
            </div>
          </div>
        </section>

        {/* Samui Park Avenue & Facilities */}
        <section>
          <div className="flex flex-col lg:flex-row gap-10 items-center bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm border border-outline-variant/50 p-4 lg:p-0">
            <div className="w-full lg:w-1/2 h-64 lg:h-full min-h-[420px] relative rounded-2xl lg:rounded-none overflow-hidden">
              <Image 
                src="https://pub-3433478e81804444ae052b8316ad0d83.r2.dev/images/explore/photo-1556388158-158ea5ccacbd.jpg?auto=format&fit=crop&q=80&w=800"
                alt="Tropical open air airport waiting lounge"
                fill
                className="object-cover" sizes="(max-width: 768px) 100vw, 400px"/>
            </div>
            <div className="w-full lg:w-1/2 lg:py-12 lg:pr-12 lg:pl-4">
              <h2 className="text-2xl lg:text-3xl font-bold text-text-main mb-4">Samui Park Avenue</h2>
              <p className="text-text-muted text-sm leading-relaxed mb-8">
                Unlike standard enclosed glass airports, USM features <strong>Samui Park Avenue</strong>—a beautiful open-air garden promenade where passengers can stroll through landscaped gardens, rest in thatched salas, and shop while waiting for flights.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 hover:border-primary/20 transition-all duration-200">
                  <ShoppingBag className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <h4 className="font-bold text-text-main text-xs mb-0.5">Boutiques & Souvenirs</h4>
                    <p className="text-[11px] text-text-muted">Local silk, dry fruits, spa products, and duty-free goods.</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 hover:border-primary/20 transition-all duration-200">
                  <Coffee className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <h4 className="font-bold text-text-main text-xs mb-0.5">Dining & Cafés</h4>
                    <p className="text-[11px] text-text-muted">Selection of pizzerias, Thai food, coffee houses, and dessert parlors.</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 hover:border-primary/20 transition-all duration-200">
                  <BadgeDollarSign className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <h4 className="font-bold text-text-main text-xs mb-0.5">Banking & SIM Cards</h4>
                    <p className="text-[11px] text-text-muted">Currency exchanges, ATMs, VAT refund counters, and local telecom kiosks.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Flight Destinations */}
        <section className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm border border-outline-variant/50">
          <div className="flex items-center gap-3 mb-6">
            <MapIcon className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-text-main m-0">Direct Flight Connections</h2>
          </div>
          <p className="text-text-muted text-sm leading-relaxed mb-8">
            Samui Airport serves domestic hubs and key international gateways. Bangkok Airways is the primary carrier, maintaining high standards of service.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-text-main text-lg mb-4 border-b border-outline-variant/30 pb-2">Domestic Destinations</h3>
              <ul className="space-y-3 text-sm text-text-muted">
                <li className="flex items-center gap-3"><Plane className="w-4 h-4 text-primary shrink-0" /> Bangkok (Suvarnabhumi BKK) - hourly flights</li>
                <li className="flex items-center gap-3"><Plane className="w-4 h-4 text-primary shrink-0" /> Bangkok (Don Mueang DMK)</li>
                <li className="flex items-center gap-3"><Plane className="w-4 h-4 text-primary shrink-0" /> Phuket (HKT) - daily shuttle flights</li>
                <li className="flex items-center gap-3"><Plane className="w-4 h-4 text-primary shrink-0" /> Chiang Mai (CNX)</li>
                <li className="flex items-center gap-3"><Plane className="w-4 h-4 text-primary shrink-0" /> Krabi (KBV)</li>
                <li className="flex items-center gap-3"><Plane className="w-4 h-4 text-primary shrink-0" /> U-Tapao / Pattaya (UTP)</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-text-main text-lg mb-4 border-b border-outline-variant/30 pb-2">International Connections</h3>
              <ul className="space-y-3 text-sm text-text-muted">
                <li className="flex items-center gap-3"><Plane className="w-4 h-4 text-primary shrink-0" /> Singapore (SIN) - Bangkok Airways & Scoot</li>
                <li className="flex items-center gap-3"><Plane className="w-4 h-4 text-primary shrink-0" /> Hong Kong (HKG)</li>
                <li className="flex items-center gap-3"><Plane className="w-4 h-4 text-primary shrink-0" /> Chengdu (CTU) & Chongqing (CKG) - seasonal</li>
              </ul>
              
              <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-800 flex items-start gap-3">
                <Info className="w-5 h-5 shrink-0 mt-0.5" />
                <p><strong>Note:</strong> International flight schedules are highly seasonal. Always confirm directly with Bangkok Airways or Scoot for up-to-date timetables.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Exclusive Passenger Comforts Widget */}
        <section className="bg-surface-container-lowest rounded-3xl p-8 md:p-10 shadow-sm border border-outline-variant/50">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-text-main m-0">Passenger Amenities & Comfort</h2>
          </div>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/30">
              <div className="flex items-center gap-2 text-primary mb-2">
                <Wifi className="w-4 h-4" />
                <span className="font-bold text-xs">Complimentary Lounge</span>
              </div>
              <h4 className="font-bold text-text-main text-sm mb-1">Courtesy Corner</h4>
              <p className="text-xs text-text-muted leading-relaxed">All economy tickets on Bangkok Airways include free access to refreshments, snacks, and Wi-Fi at departure lounges.</p>
            </div>
            
            <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/30">
              <div className="flex items-center gap-2 text-primary mb-2">
                <Luggage className="w-4 h-4" />
                <span className="font-bold text-xs">Luggage Services</span>
              </div>
              <h4 className="font-bold text-text-main text-sm mb-1">Left Luggage Booth</h4>
              <p className="text-xs text-text-muted leading-relaxed">Convenient luggage storage is available at the arrivals area for short or long-term storage (approx 150 THB per bag/day).</p>
            </div>
            
            <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/30">
              <div className="flex items-center gap-2 text-primary mb-2">
                <HeartPulse className="w-4 h-4" />
                <span className="font-bold text-xs">Medical Care</span>
              </div>
              <h4 className="font-bold text-text-main text-sm mb-1">First Aid Clinic</h4>
              <p className="text-xs text-text-muted leading-relaxed">A fully staffed medical clinic is situated in the transit hall for emergency care and travel medicine services.</p>
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
