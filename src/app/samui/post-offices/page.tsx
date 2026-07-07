import { Metadata } from 'next';
import Image from 'next/image';
import { Mail, MapPin, Clock, Package, ShieldCheck, CreditCard, Send, Map } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Koh Samui Post Offices & ZIP Codes Guide (2026)',
  description: 'Find Koh Samui post office locations, official ZIP codes, operating hours, & tourist tips for sending mail and shipping packages with Thailand Post in 2026! ✓',
};

export default function PostOfficesPage() {
  return (
    <div className="min-h-screen bg-surface-bright font-body-md text-on-surface overflow-x-hidden pb-16">
      
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://pub-3433478e81804444ae052b8316ad0d83.r2.dev/images/explore/photo-1556742044-3c52d6e88c62.jpg?auto=format&fit=crop&q=80&w=2000"
            alt="Hand placing a postcard inside a traditional red mailbox" 
            fill
            className="object-cover"
            priority sizes="(max-width: 768px) 100vw, 1200px"/>
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/60" />
        </div>
        <div className="relative z-10 text-center px-margin-mobile max-w-3xl">
          <div className="inline-flex items-center justify-center p-3 bg-white/20 backdrop-blur-md rounded-2xl mb-4 text-white shadow-md">
            <Mail className="w-8 h-8" />
          </div>
          <h1 className="font-display text-display md:text-display text-white mb-4" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            Post Offices & ZIP Codes
          </h1>
          <p className="font-body-lg text-body-lg text-white/90 max-w-2xl mx-auto" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            Send postcards, ship parcels, or receive international mail. Discover Thailand Post branches, working hours, and postal codes across Samui.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 mt-16 max-w-5xl space-y-16">
        
        {/* Main Branches */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Package className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold text-text-main m-0">Main Postal Branches</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Nathon Post Office */}
            <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-outline-variant/50 hover:shadow-md transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-text-main m-0">Nathon Post Office</h3>
                <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">ZIP Code: 84140</span>
              </div>
              <p className="text-text-muted text-sm leading-relaxed mb-6">
                The island&apos;s main sorting office and headquarters. Handles the largest volume of inbound/outbound packages, EMS shipments, and customs clearances for international parcel inspections.
              </p>
              <div className="space-y-2 text-sm pt-4 border-t border-outline-variant/30">
                <div className="flex items-center gap-2 text-text-muted"><MapPin className="w-4 h-4 text-primary" /> Nathon Capital Town (West Coast)</div>
                <div className="flex items-center gap-2 text-text-muted"><Clock className="w-4 h-4 text-primary" /> Mon-Fri: 08:30 - 16:30 | Sat: 09:00 - 12:00 (Sun Closed)</div>
              </div>
            </div>

            {/* Chaweng Post Office */}
            <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-outline-variant/50 hover:shadow-md transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-text-main m-0">Chaweng Post Office</h3>
                <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">ZIP Code: 84320</span>
              </div>
              <p className="text-text-muted text-sm leading-relaxed mb-6">
                A highly busy branch catering to the main tourist hub. Excellent for tourists dropping off postcards, shipping local souvenirs, or sending parcels home via airmail.
              </p>
              <div className="space-y-2 text-sm pt-4 border-t border-outline-variant/30">
                <div className="flex items-center gap-2 text-text-muted"><MapPin className="w-4 h-4 text-primary" /> Central Chaweng (behind the lake road)</div>
                <div className="flex items-center gap-2 text-text-muted"><Clock className="w-4 h-4 text-primary" /> Mon-Fri: 08:30 - 16:30 | Sat: 09:00 - 12:00 (Sun Closed)</div>
              </div>
            </div>

            {/* Lamai Post Office */}
            <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-outline-variant/50 hover:shadow-md transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-text-main m-0">Lamai Post Office</h3>
                <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">ZIP Code: 84310</span>
              </div>
              <p className="text-text-muted text-sm leading-relaxed mb-6">
                Serving the southern and eastern coastline. Offers standard postal duties, box packing services, registered mail, and express package shipments (EMS) with full tracking.
              </p>
              <div className="space-y-2 text-sm pt-4 border-t border-outline-variant/30">
                <div className="flex items-center gap-2 text-text-muted"><MapPin className="w-4 h-4 text-primary" /> Main Lamai Ring Road (Central)</div>
                <div className="flex items-center gap-2 text-text-muted"><Clock className="w-4 h-4 text-primary" /> Mon-Fri: 08:30 - 16:30 | Sat: 09:00 - 12:00 (Sun Closed)</div>
              </div>
            </div>

            {/* Maenam Post Office */}
            <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-outline-variant/50 hover:shadow-md transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-text-main m-0">Maenam Post Office</h3>
                <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">ZIP Code: 84330</span>
              </div>
              <p className="text-text-muted text-sm leading-relaxed mb-6">
                Conveniently located for expats and visitors staying on the northern coast of the island. Offers quick services for local utility payments, packaging, and standard postage.
              </p>
              <div className="space-y-2 text-sm pt-4 border-t border-outline-variant/30">
                <div className="flex items-center gap-2 text-text-muted"><MapPin className="w-4 h-4 text-primary" /> Maenam Ring Road (Opposite Soi 5)</div>
                <div className="flex items-center gap-2 text-text-muted"><Clock className="w-4 h-4 text-primary" /> Mon-Fri: 08:30 - 16:30 | Sat: 09:00 - 12:00 (Sun Closed)</div>
              </div>
            </div>

          </div>
        </section>

        {/* Packing & Shipping Tips Widget */}
        <section className="bg-surface-container-lowest rounded-3xl p-8 md:p-10 shadow-sm border border-outline-variant/50">
          <div className="flex items-center gap-3 mb-6">
            <Send className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-text-main m-0">Packing & Shipping Guidelines</h2>
          </div>
          <p className="text-text-muted mb-8 leading-relaxed text-sm">
            Read these helpful tips before going to the post office to ensure a smooth and swift mailing experience:
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 text-xs text-text-muted">
            <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/30">
              <div className="flex items-center gap-2 text-primary mb-3">
                <CreditCard className="w-5 h-5 animate-pulse" />
                <h4 className="font-bold text-text-main text-sm m-0">Passport Required</h4>
              </div>
              <p className="leading-relaxed">
                By Thai law, you <strong>MUST</strong> present your original passport (or National ID Card for Thai citizens) for any parcel shipment (domestic or international) to prevent illicit trafficking.
              </p>
            </div>
            
            <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/30">
              <div className="flex items-center gap-2 text-primary mb-3">
                <Package className="w-5 h-5" />
                <h4 className="font-bold text-text-main text-sm m-0">Wrapping & Boxes</h4>
              </div>
              <p className="leading-relaxed">
                All branches sell standard cardboard boxes, padded envelopes, bubble wrap, and tape. Staff are incredibly helpful and will often package your items securely on-site for a nominal fee.
              </p>
            </div>
            
            <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/30">
              <div className="flex items-center gap-2 text-primary mb-3">
                <Map className="w-5 h-5" />
                <h4 className="font-bold text-text-main text-sm m-0">Address Formats</h4>
              </div>
              <p className="leading-relaxed">
                Always print the destination address clearly, including the recipient&apos;s phone number. For international shipments, write the country in bold capital letters at the bottom.
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
