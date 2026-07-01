import { Metadata } from 'next';
import Link from 'next/link';
import { Ship, Bus, Plane, Car, Route, MapPin, Anchor, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Transportation & Travel Guide - Samui Services',
  description: 'Navigate from Koh Samui to Phang Nga, Koh Tao, and back with our comprehensive transportation guide.',
};

export default function TransportationPage() {
  return (
    <div className="min-h-screen bg-surface-hover/20 pb-16">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent pt-20 pb-16 px-6 border-b border-primary/10">
        <div className="container mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-6 text-primary">
            <Route className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-text-main mb-6">
            Island Transportation Guide
          </h1>
          <p className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto leading-relaxed">
            Navigating around the Gulf of Thailand and to the mainland is a breeze with the right information. Explore the best routes to neighboring islands and mainland destinations.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-12 max-w-5xl space-y-16">
        
        {/* Island Hopping */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Ship className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold text-text-main">Samui to Koh Tao & Koh Phangan</h2>
          </div>
          
          <div className="bg-surface rounded-3xl overflow-hidden shadow-sm border border-outline-muted p-8">
            <p className="text-text-muted mb-8 leading-relaxed">
              Koh Tao is located further north in the Gulf of Thailand. The journey requires a ferry or speedboat, usually stopping at Koh Phangan along the way.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-surface-hover/50 p-6 rounded-2xl border border-outline-muted/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-white p-2 rounded-lg shadow-sm"><Ship className="w-5 h-5 text-primary" /></div>
                  <h3 className="font-bold text-text-main">Lomprayah High-Speed</h3>
                </div>
                <p className="text-sm text-text-muted">The fastest and most popular option. Departs from Maenam (Pralarn) or Nathon Pier. Takes about 1.5 to 2 hours to reach Koh Tao.</p>
              </div>

              <div className="bg-surface-hover/50 p-6 rounded-2xl border border-outline-muted/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-white p-2 rounded-lg shadow-sm"><Ship className="w-5 h-5 text-primary" /></div>
                  <h3 className="font-bold text-text-main">Seatran Discovery</h3>
                </div>
                <p className="text-sm text-text-muted">A comfortable ferry option departing from Bangrak Pier. Takes around 2 hours to reach Koh Tao.</p>
              </div>
            </div>

            <div className="bg-primary/5 rounded-2xl p-6 border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <Anchor className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-text-main">Which pier do I need?</h4>
                  <p className="text-sm text-text-muted">Learn more about Samui&apos;s ferry terminals and locations.</p>
                </div>
              </div>
              <Link href="/samui/piers" className="px-6 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 whitespace-nowrap">
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
            <h2 className="text-3xl font-bold text-text-main">Samui to Phang Nga (Mainland)</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-surface rounded-2xl p-6 shadow-sm border border-outline-muted hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <Bus className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-bold text-text-main">Joint Ticket (Ferry + Bus)</h3>
              </div>
              <p className="text-text-muted text-sm leading-relaxed mb-4">
                The easiest overland way. Companies like Lomprayah and Phantip offer joint tickets. You take a ferry to Surat Thani / Donsak, then a dedicated minivan drives you across the peninsula.
              </p>
              <div className="inline-block bg-surface-hover text-xs font-semibold px-3 py-1.5 rounded-lg text-text-main">
                Duration: 5 - 7 hours
              </div>
            </div>

            <div className="bg-surface rounded-2xl p-6 shadow-sm border border-outline-muted hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <Plane className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-bold text-text-main">Flights via Phuket</h3>
              </div>
              <p className="text-text-muted text-sm leading-relaxed mb-4">
                No direct flights to Phang Nga exist. Fly from Samui (USM) to Phuket (HKT) via Bangkok Airways. From Phuket airport, Phang Nga is a relatively short drive.
              </p>
              <div className="inline-block bg-surface-hover text-xs font-semibold px-3 py-1.5 rounded-lg text-text-main">
                Drive from HKT: 1 - 1.5 hours
              </div>
            </div>
          </div>
        </section>

        {/* Local Transport */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Car className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold text-text-main">Getting Around Samui</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-surface rounded-2xl p-6 shadow-sm border border-outline-muted hover:border-primary/30 transition-colors">
              <h3 className="text-lg font-bold text-text-main mb-2">Songthaews</h3>
              <p className="text-text-muted text-sm leading-relaxed">
                Red pickup trucks acting as shared taxis along the ring road. Ring the bell to stop, and negotiate the price before getting in (usually 50-100 THB).
              </p>
            </div>

            <div className="bg-surface rounded-2xl p-6 shadow-sm border border-outline-muted hover:border-primary/30 transition-colors">
              <h3 className="text-lg font-bold text-text-main mb-2">Taxis & Ride Apps</h3>
              <p className="text-text-muted text-sm leading-relaxed">
                Private taxis are available but can be pricey. Apps like Grab and InDrive operate on the island and provide transparent pricing.
              </p>
            </div>

            <div className="bg-surface rounded-2xl p-6 shadow-sm border border-outline-muted hover:border-primary/30 transition-colors">
              <h3 className="text-lg font-bold text-text-main mb-2">Scooter Rental</h3>
              <p className="text-text-muted text-sm leading-relaxed">
                A popular and affordable way to explore independently. Ensure you have an international driving permit and always wear a helmet.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
