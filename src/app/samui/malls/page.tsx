import { Metadata } from 'next';
import { ShoppingBag, ShoppingCart, Store, Utensils, MapPin, Coffee, Tag } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Koh Samui Malls & Shopping - Samui Services',
  description: 'Discover the major shopping malls and retail centers in Koh Samui.',
};

export default function MallsPage() {
  return (
    <div className="min-h-screen bg-surface-hover/20 pb-16">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent pt-20 pb-16 px-6 border-b border-primary/10">
        <div className="container mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-6 text-primary">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-text-main mb-6">
            Malls & Shopping Centers
          </h1>
          <p className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto leading-relaxed">
            While Koh Samui is famous for its lively street markets, it also offers modern shopping malls and lifestyle centers for those looking for international brands, air-conditioned comfort, supermarkets, and entertainment.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-12 max-w-5xl space-y-16">
        
        {/* Central Samui */}
        <section>
          <div className="bg-surface rounded-3xl overflow-hidden shadow-sm border border-outline-muted hover:border-primary/30 transition-colors">
            <div className="p-8 md:p-10">
              <div className="flex flex-col md:flex-row md:items-start gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider">Lifestyle Mall</span>
                  </div>
                  <h2 className="text-3xl font-bold text-text-main mb-4">Central Samui</h2>
                  <div className="flex items-center gap-2 text-text-muted mb-6">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>Heart of Chaweng</span>
                  </div>
                  <p className="text-text-muted mb-6 leading-relaxed">
                    Formerly Central Festival, this is the largest and most comprehensive lifestyle shopping complex on the island. It features an open-air design, heavily landscaped with a central courtyard.
                  </p>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 bg-surface-hover p-1.5 rounded-md"><Store className="w-4 h-4 text-primary" /></div>
                      <div>
                        <h4 className="font-semibold text-text-main text-sm">International Brands</h4>
                        <p className="text-xs text-text-muted">Fashion, cosmetics, and tech</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1 bg-surface-hover p-1.5 rounded-md"><ShoppingCart className="w-4 h-4 text-primary" /></div>
                      <div>
                        <h4 className="font-semibold text-text-main text-sm">Tops Market</h4>
                        <p className="text-xs text-text-muted">Premium supermarket</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1 bg-surface-hover p-1.5 rounded-md"><Utensils className="w-4 h-4 text-primary" /></div>
                      <div>
                        <h4 className="font-semibold text-text-main text-sm">Dining</h4>
                        <p className="text-xs text-text-muted">Food court & standalone restaurants</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1 bg-surface-hover p-1.5 rounded-md"><Tag className="w-4 h-4 text-primary" /></div>
                      <div>
                        <h4 className="font-semibold text-text-main text-sm">Vibe</h4>
                        <p className="text-xs text-text-muted">Modern, spacious, family-friendly</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Wharf */}
        <section>
          <div className="bg-surface rounded-3xl overflow-hidden shadow-sm border border-outline-muted hover:border-primary/30 transition-colors">
            <div className="p-8 md:p-10">
              <div className="flex flex-col md:flex-row md:items-start gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider">Open-Air Complex</span>
                  </div>
                  <h2 className="text-3xl font-bold text-text-main mb-4">Wharf Samui</h2>
                  <div className="flex items-center gap-2 text-text-muted mb-6">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>Fisherman&apos;s Village, Bophut</span>
                  </div>
                  <p className="text-text-muted mb-6 leading-relaxed">
                    Situated right next to Fisherman&apos;s Village, The Wharf is a retro-themed, open-air shopping and dining complex that beautifully blends Eastern and Western architectural styles.
                  </p>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 bg-surface-hover p-1.5 rounded-md"><Store className="w-4 h-4 text-primary" /></div>
                      <div>
                        <h4 className="font-semibold text-text-main text-sm">Boutiques</h4>
                        <p className="text-xs text-text-muted">Clothing & artisan crafts</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1 bg-surface-hover p-1.5 rounded-md"><Coffee className="w-4 h-4 text-primary" /></div>
                      <div>
                        <h4 className="font-semibold text-text-main text-sm">Dining</h4>
                        <p className="text-xs text-text-muted">Excellent beachfront restaurants</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Hypermarkets */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <ShoppingCart className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold text-text-main">Hypermarkets</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-surface rounded-2xl p-6 shadow-sm border border-outline-muted hover:border-primary/30 transition-colors">
              <h3 className="text-xl font-bold text-text-main mb-2">Big C Supercenter</h3>
              <div className="flex items-center gap-2 text-text-muted mb-4 text-sm">
                <MapPin className="w-4 h-4 text-primary" /> Bophut
              </div>
              <p className="text-text-muted text-sm leading-relaxed mb-4">
                Practical shopping with a massive grocery section, electronics, clothing, and home goods at affordable prices. Includes smaller retail kiosks, banks, and a food court.
              </p>
            </div>

            <div className="bg-surface rounded-2xl p-6 shadow-sm border border-outline-muted hover:border-primary/30 transition-colors">
              <h3 className="text-xl font-bold text-text-main mb-2">Lotus&apos;s</h3>
              <div className="flex items-center gap-2 text-text-muted mb-4 text-sm">
                <MapPin className="w-4 h-4 text-primary" /> Chaweng
              </div>
              <p className="text-text-muted text-sm leading-relaxed mb-4">
                Formerly Tesco Lotus, this large complex offers comprehensive grocery shopping, affordable clothing, electronics, and various fast-food outlets and retail stores.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
