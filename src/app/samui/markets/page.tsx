import { Metadata } from 'next';
import { MapPin, Clock, CalendarDays, Store, ShoppingBag } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Koh Samui Markets - Samui Services',
  description: 'Explore the best day and night markets in Koh Samui.',
};

export default function MarketsPage() {
  return (
    <div className="min-h-screen bg-surface-hover/20 pb-16">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent pt-20 pb-16 px-6 border-b border-primary/10">
        <div className="container mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-6 text-primary">
            <Store className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-text-main mb-6">
            Koh Samui Markets
          </h1>
          <p className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto leading-relaxed">
            Discover a vibrant market scene, where you can find everything from fresh local produce to unique souvenirs, clothing, and delicious street food.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-12 max-w-5xl space-y-16">
        
        {/* Night Markets Section */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <ShoppingBag className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold text-text-main">Popular Night Markets</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-surface rounded-2xl p-6 shadow-sm border border-outline-muted hover:border-primary/30 transition-colors">
              <h3 className="text-xl font-bold text-text-main mb-3">Fisherman&apos;s Village Walking Street</h3>
              <p className="text-text-muted mb-4">One of the most popular and expansive markets on the island with a fantastic seaside atmosphere.</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-text-muted"><MapPin className="w-4 h-4 text-primary" /> Bophut</div>
                <div className="flex items-center gap-2 text-text-muted"><CalendarDays className="w-4 h-4 text-primary" /> Fridays</div>
                <div className="flex items-center gap-2 text-text-muted"><Clock className="w-4 h-4 text-primary" /> 17:00 - 23:00</div>
              </div>
            </div>

            <div className="bg-surface rounded-2xl p-6 shadow-sm border border-outline-muted hover:border-primary/30 transition-colors">
              <h3 className="text-xl font-bold text-text-main mb-3">Lamai Night Market</h3>
              <p className="text-text-muted mb-4">Offering a wide array of food, clothes, and local goods right in the bustling center of Lamai.</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-text-muted"><MapPin className="w-4 h-4 text-primary" /> Lamai Center</div>
                <div className="flex items-center gap-2 text-text-muted"><CalendarDays className="w-4 h-4 text-primary" /> Sundays</div>
                <div className="flex items-center gap-2 text-text-muted"><Clock className="w-4 h-4 text-primary" /> 17:00 - 23:00</div>
              </div>
            </div>

            <div className="bg-surface rounded-2xl p-6 shadow-sm border border-outline-muted hover:border-primary/30 transition-colors">
              <h3 className="text-xl font-bold text-text-main mb-3">Chaweng Night Market</h3>
              <p className="text-text-muted mb-4">Famous for its incredible variety of street food, seafood stalls, and lively atmosphere.</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-text-muted"><MapPin className="w-4 h-4 text-primary" /> Chaweng</div>
                <div className="flex items-center gap-2 text-text-muted"><CalendarDays className="w-4 h-4 text-primary" /> Daily</div>
                <div className="flex items-center gap-2 text-text-muted"><Clock className="w-4 h-4 text-primary" /> 17:00 - 23:00</div>
              </div>
            </div>

            <div className="bg-surface rounded-2xl p-6 shadow-sm border border-outline-muted hover:border-primary/30 transition-colors">
              <h3 className="text-xl font-bold text-text-main mb-3">Maenam Walking Street</h3>
              <p className="text-text-muted mb-4">A cozy night market in Chinatown with a more relaxed vibe, great cocktails, and authentic Thai food.</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-text-muted"><MapPin className="w-4 h-4 text-primary" /> Maenam</div>
                <div className="flex items-center gap-2 text-text-muted"><CalendarDays className="w-4 h-4 text-primary" /> Thursdays</div>
                <div className="flex items-center gap-2 text-text-muted"><Clock className="w-4 h-4 text-primary" /> 17:00 - 23:00</div>
              </div>
            </div>
          </div>
        </section>

        {/* Day Markets Section */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Store className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold text-text-main">Day & Fresh Markets</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-surface rounded-2xl p-6 shadow-sm border border-outline-muted hover:border-primary/30 transition-colors">
              <h3 className="text-xl font-bold text-text-main mb-3">Nathon Fresh Market</h3>
              <p className="text-text-muted mb-4">The main port town’s market, great for fresh seafood, meats, and discovering local ingredients.</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-text-muted"><MapPin className="w-4 h-4 text-primary" /> Nathon</div>
                <div className="flex items-center gap-2 text-text-muted"><CalendarDays className="w-4 h-4 text-primary" /> Daily</div>
                <div className="flex items-center gap-2 text-text-muted"><Clock className="w-4 h-4 text-primary" /> Early Morning - Afternoon</div>
              </div>
            </div>

            <div className="bg-surface rounded-2xl p-6 shadow-sm border border-outline-muted hover:border-primary/30 transition-colors">
              <h3 className="text-xl font-bold text-text-main mb-3">Hua Thanon Market</h3>
              <p className="text-text-muted mb-4">Located in a traditional Muslim fishing village, offering an authentic glimpse into local life and the freshest daily catch.</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-text-muted"><MapPin className="w-4 h-4 text-primary" /> Hua Thanon</div>
                <div className="flex items-center gap-2 text-text-muted"><CalendarDays className="w-4 h-4 text-primary" /> Daily</div>
                <div className="flex items-center gap-2 text-text-muted"><Clock className="w-4 h-4 text-primary" /> Early Morning</div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
