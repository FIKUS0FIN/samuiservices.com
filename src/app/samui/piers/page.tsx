import { Metadata } from 'next';
import { Anchor, MapPin, Ship, Navigation } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Koh Samui Piers - Samui Services',
  description: 'Guide to the main ferry piers on Koh Samui including Nathon, Maenam, Bangrak, and Lipa Noi.',
};

export default function PiersPage() {
  return (
    <div className="min-h-screen bg-surface-hover/20 pb-16">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent pt-20 pb-16 px-6 border-b border-primary/10">
        <div className="container mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-6 text-primary">
            <Anchor className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-text-main mb-6">
            Koh Samui Piers
          </h1>
          <p className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto leading-relaxed">
            Your gateway to the mainland and neighboring islands. Learn about the main ferry terminals, their locations, and the services they provide.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-12 max-w-5xl space-y-16">
        
        {/* Main Piers */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Ship className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold text-text-main">Ferry Terminals</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-surface rounded-2xl p-6 shadow-sm border border-outline-muted hover:border-primary/30 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-text-main">Nathon Pier</h3>
                <span className="bg-surface-hover text-xs font-semibold px-2 py-1 rounded-md text-text-main">West Coast</span>
              </div>
              <p className="text-text-muted mb-4 text-sm leading-relaxed">
                The main and largest pier on the island. It serves both car ferries and passenger ferries (Lomprayah, Seatran) heading to the mainland (Donsak), Koh Phangan, and Koh Tao.
              </p>
              <div className="space-y-2 text-sm mt-4 pt-4 border-t border-outline-muted/50">
                <div className="flex items-center gap-2 text-text-muted"><MapPin className="w-4 h-4 text-primary" /> Nathon Town</div>
                <div className="flex items-center gap-2 text-text-muted"><Navigation className="w-4 h-4 text-primary" /> Mainland, Phangan, Tao</div>
              </div>
            </div>

            <div className="bg-surface rounded-2xl p-6 shadow-sm border border-outline-muted hover:border-primary/30 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-text-main">Maenam (Pralarn) Pier</h3>
                <span className="bg-surface-hover text-xs font-semibold px-2 py-1 rounded-md text-text-main">North Coast</span>
              </div>
              <p className="text-text-muted mb-4 text-sm leading-relaxed">
                Operated primarily by Lomprayah High-Speed Catamaran. It is a very popular departure point for trips to Koh Phangan, Koh Tao, and Chumphon.
              </p>
              <div className="space-y-2 text-sm mt-4 pt-4 border-t border-outline-muted/50">
                <div className="flex items-center gap-2 text-text-muted"><MapPin className="w-4 h-4 text-primary" /> Maenam</div>
                <div className="flex items-center gap-2 text-text-muted"><Navigation className="w-4 h-4 text-primary" /> Phangan, Tao, Chumphon</div>
              </div>
            </div>

            <div className="bg-surface rounded-2xl p-6 shadow-sm border border-outline-muted hover:border-primary/30 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-text-main">Bangrak Pier</h3>
                <span className="bg-surface-hover text-xs font-semibold px-2 py-1 rounded-md text-text-main">North Coast</span>
              </div>
              <p className="text-text-muted mb-4 text-sm leading-relaxed">
                Located very close to the airport. Seatran Discovery operates from here, offering convenient connections to Koh Phangan and Koh Tao.
              </p>
              <div className="space-y-2 text-sm mt-4 pt-4 border-t border-outline-muted/50">
                <div className="flex items-center gap-2 text-text-muted"><MapPin className="w-4 h-4 text-primary" /> Bangrak (Near Big Buddha)</div>
                <div className="flex items-center gap-2 text-text-muted"><Navigation className="w-4 h-4 text-primary" /> Phangan, Tao</div>
              </div>
            </div>

            <div className="bg-surface rounded-2xl p-6 shadow-sm border border-outline-muted hover:border-primary/30 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-text-main">Lipa Noi Pier</h3>
                <span className="bg-surface-hover text-xs font-semibold px-2 py-1 rounded-md text-text-main">West Coast</span>
              </div>
              <p className="text-text-muted mb-4 text-sm leading-relaxed">
                Operated by Raja Ferry, this is the main port for bringing vehicles (cars and motorbikes) from the mainland (Donsak Pier). 
              </p>
              <div className="space-y-2 text-sm mt-4 pt-4 border-t border-outline-muted/50">
                <div className="flex items-center gap-2 text-text-muted"><MapPin className="w-4 h-4 text-primary" /> Lipa Noi</div>
                <div className="flex items-center gap-2 text-text-muted"><Navigation className="w-4 h-4 text-primary" /> Mainland (Donsak)</div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
