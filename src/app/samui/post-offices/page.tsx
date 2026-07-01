import { Metadata } from 'next';
import { Mail, MapPin, Clock, Package } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Koh Samui Post Offices - Samui Services',
  description: 'Locations and information for the main post offices in Koh Samui.',
};

export default function PostOfficesPage() {
  return (
    <div className="min-h-screen bg-surface-hover/20 pb-16">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent pt-20 pb-16 px-6 border-b border-primary/10">
        <div className="container mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-6 text-primary">
            <Mail className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-text-main mb-6">
            Post Offices
          </h1>
          <p className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto leading-relaxed">
            Whether you need to send postcards home, ship packages, or receive mail, Thailand Post offers reliable and affordable services across Koh Samui.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-12 max-w-5xl space-y-16">
        
        {/* Main Branches */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Package className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold text-text-main">Main Branches</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-surface rounded-2xl p-6 shadow-sm border border-outline-muted hover:border-primary/30 transition-colors">
              <h3 className="text-xl font-bold text-text-main mb-2">Nathon Post Office</h3>
              <p className="text-text-muted text-sm mb-4">The main branch on the island, handling the largest volume of mail and packages.</p>
              <div className="space-y-2 text-sm pt-4 border-t border-outline-muted/50">
                <div className="flex items-center gap-2 text-text-muted"><MapPin className="w-4 h-4 text-primary" /> Nathon Town</div>
                <div className="flex items-center gap-2 text-text-muted"><Clock className="w-4 h-4 text-primary" /> Mon-Fri: 08:30 - 16:30</div>
                <div className="flex items-center gap-2 text-text-muted"><Clock className="w-4 h-4 text-primary" /> Sat-Sun: 09:00 - 12:00</div>
              </div>
            </div>

            <div className="bg-surface rounded-2xl p-6 shadow-sm border border-outline-muted hover:border-primary/30 transition-colors">
              <h3 className="text-xl font-bold text-text-main mb-2">Maenam Post Office</h3>
              <p className="text-text-muted text-sm mb-4">Conveniently located for those staying on the northern coast of the island.</p>
              <div className="space-y-2 text-sm pt-4 border-t border-outline-muted/50">
                <div className="flex items-center gap-2 text-text-muted"><MapPin className="w-4 h-4 text-primary" /> Maenam Ring Road</div>
                <div className="flex items-center gap-2 text-text-muted"><Clock className="w-4 h-4 text-primary" /> Mon-Fri: 08:30 - 16:30</div>
                <div className="flex items-center gap-2 text-text-muted"><Clock className="w-4 h-4 text-primary" /> Sat: 09:00 - 12:00</div>
              </div>
            </div>

            <div className="bg-surface rounded-2xl p-6 shadow-sm border border-outline-muted hover:border-primary/30 transition-colors">
              <h3 className="text-xl font-bold text-text-main mb-2">Lamai Post Office</h3>
              <p className="text-text-muted text-sm mb-4">Serving the busy Lamai area, offering all standard postal and shipping services.</p>
              <div className="space-y-2 text-sm pt-4 border-t border-outline-muted/50">
                <div className="flex items-center gap-2 text-text-muted"><MapPin className="w-4 h-4 text-primary" /> Lamai Center</div>
                <div className="flex items-center gap-2 text-text-muted"><Clock className="w-4 h-4 text-primary" /> Mon-Fri: 08:30 - 16:30</div>
                <div className="flex items-center gap-2 text-text-muted"><Clock className="w-4 h-4 text-primary" /> Sat: 09:00 - 12:00</div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 sm:p-8">
            <h3 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Helpful Tips
            </h3>
            <ul className="space-y-3 text-text-main text-sm">
              <li className="flex items-start gap-2">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <span><strong>Identification:</strong> You MUST bring your original passport when sending or receiving packages internationally.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <span><strong>Packaging:</strong> Post offices sell boxes, envelopes, tape, and bubble wrap. They will often help you pack items securely.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <span><strong>Services:</strong> Thailand Post offers EMS (Express Mail Service) for fast and trackable international shipping, which is highly reliable.</span>
              </li>
            </ul>
          </div>
        </section>

      </div>
    </div>
  );
}
