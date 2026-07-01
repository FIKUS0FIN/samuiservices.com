import { Metadata } from 'next';
import { Plane, PlaneTakeoff, PlaneLanding, Coffee, ShoppingBag, Car } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Samui Airport (USM) Information - Samui Services',
  description: 'Everything you need to know about Samui International Airport.',
};

export default function AirportPage() {
  return (
    <div className="min-h-screen bg-surface-hover/20 pb-16">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent pt-20 pb-16 px-6 border-b border-primary/10">
        <div className="container mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-6 text-primary">
            <Plane className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-text-main mb-6">
            Samui International Airport (USM)
          </h1>
          <p className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto leading-relaxed">
            Often described as one of the most beautiful and unique airports in the world, featuring an open-air design with thatched roofs that creates a tropical resort feel from the moment you land.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-12 max-w-5xl space-y-16">
        
        {/* Airlines and Destinations */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <PlaneTakeoff className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold text-text-main">Airlines & Destinations</h2>
          </div>
          <p className="text-text-muted mb-6 text-lg">
            Bangkok Airways operates the majority of flights, connecting Koh Samui directly with:
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-surface rounded-2xl p-6 shadow-sm border border-outline-muted hover:border-primary/30 transition-colors">
              <h3 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2">
                <PlaneLanding className="w-5 h-5 text-primary" />
                Domestic
              </h3>
              <ul className="space-y-3 text-text-muted">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Bangkok (Suvarnabhumi)</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Phuket</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Chiang Mai</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Pattaya (U-Tapao)</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Krabi</li>
              </ul>
            </div>

            <div className="bg-surface rounded-2xl p-6 shadow-sm border border-outline-muted hover:border-primary/30 transition-colors">
              <h3 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2">
                <PlaneTakeoff className="w-5 h-5 text-primary" />
                International
              </h3>
              <ul className="space-y-3 text-text-muted">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Singapore</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Hong Kong</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Chengdu (Seasonal)</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Kuala Lumpur (Seasonal)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Facilities Section */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Coffee className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold text-text-main">Airport Facilities</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-surface rounded-2xl p-6 shadow-sm border border-outline-muted hover:border-primary/30 transition-colors">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Coffee className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-text-main mb-2">Courtesy Corner</h3>
              <p className="text-text-muted text-sm leading-relaxed">
                Complimentary snacks, coffee, tea, and Wi-Fi are provided for all departing passengers, a signature touch of Bangkok Airways.
              </p>
            </div>

            <div className="bg-surface rounded-2xl p-6 shadow-sm border border-outline-muted hover:border-primary/30 transition-colors">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <ShoppingBag className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-text-main mb-2">Samui Park Avenue</h3>
              <p className="text-text-muted text-sm leading-relaxed">
                A charming open-air shopping and dining promenade near the departure area with boutiques, restaurants, and cafes.
              </p>
            </div>

            <div className="bg-surface rounded-2xl p-6 shadow-sm border border-outline-muted hover:border-primary/30 transition-colors">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Car className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-text-main mb-2">Transportation</h3>
              <p className="text-text-muted text-sm leading-relaxed">
                Authorized airport taxis and private minivans are available upon arrival. Car rental counters (Avis, Hertz, Sixt) are also located in the arrivals area.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
