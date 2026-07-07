import { Metadata } from 'next';
import Image from 'next/image';
import { Waves, Search, Star, Lightbulb, Sun, Droplets, ThermometerSun, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Best Koh Samui Beaches: Ultimate 2026 Island Guide',
  description: 'Explore the top beaches on Koh Samui in 2026. Compare nightlife in Chaweng, quiet shores in Maenam, & find your perfect tropical paradise. Read local tips! ✓',
};

export default function BeachesPage() {
  return (
    <div className="min-h-screen bg-surface-bright font-body-md text-on-surface overflow-x-hidden pb-16">
      
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://pub-3433478e81804444ae052b8316ad0d83.r2.dev/images/explore/photo-1558981806-ec527fa84c39.jpg?auto=format&fit=crop&q=80&w=2000"
            alt="Aerial view of a pristine Koh Samui beach" 
            fill
            className="object-cover"
            priority sizes="(max-width: 768px) 100vw, 1200px"/>
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
        </div>
        <div className="relative z-10 text-center px-margin-mobile max-w-2xl">
          <h1 className="font-display text-display md:text-display text-white mb-4" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>Samui Beaches</h1>
          <p className="font-body-lg text-body-lg text-white/90 mb-8" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            Discover your piece of paradise among the golden sands and turquoise waters of Thailand&apos;s most beloved island.
          </p>
          <div className="mt-8 flex justify-center">
            <div className="bg-surface-container-lowest/90 backdrop-blur-md p-1 rounded-full flex items-center shadow-lg w-full max-w-md">
              <Search className="ml-4 text-outline w-5 h-5" />
              <input 
                className="bg-transparent border-none focus:ring-0 w-full font-body-sm text-body-sm text-on-surface px-3 py-2 outline-none" 
                placeholder="Search for your favorite beach..." 
                type="text"
              />
              <button className="bg-primary text-on-primary px-6 py-2 rounded-full font-label-md text-label-md mr-1 hover:shadow-md transition-all active:scale-95">Explore</button>
            </div>
          </div>
        </div>
      </section>

      {/* Beach Grid Section */}
      <section className="max-w-container-max mx-auto px-gutter py-12 md:py-20">
        <div className="flex flex-col gap-3 mb-12">
          <h2 className="font-headline-lg text-headline-lg md:text-headline-lg text-primary">The Big Four</h2>
          <div className="w-16 h-1 bg-secondary rounded-full"></div>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xl mt-3">
            From the electric energy of Chaweng to the tranquil shores of Maenam, explore the iconic coastlines that define the Koh Samui experience.
          </p>
        </div>

        {/* Vertical Card List */}
        <div className="grid grid-cols-1 gap-8">
          
          {/* Chaweng */}
          <div className="group flex flex-col lg:flex-row bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-surface-container-high">
            <div className="lg:w-2/5 h-64 lg:h-auto relative overflow-hidden">
              <Image 
                src="https://pub-3433478e81804444ae052b8316ad0d83.r2.dev/images/explore/photo-1568772585407-9361f9bf3a87.jpg?auto=format&fit=crop&q=80&w=800"
                alt="Vibrant Chaweng Beach" 
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 100vw, 400px"/>
            </div>
            <div className="flex-1 p-8 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-headline-md text-headline-md text-on-surface">Chaweng</h3>
                  <div className="flex items-center gap-1 text-tertiary">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-label-md text-label-md">4.8</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full font-label-sm text-label-sm">Vibrant</span>
                  <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-sm text-label-sm">Energetic</span>
                  <span className="bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full font-label-sm text-label-sm">White Sand</span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant mb-8">
                  The heartbeat of Koh Samui, Chaweng offers miles of powdery white sand, turquoise waters, and the island&apos;s most dynamic social scene.
                </p>
              </div>
              <div className="bg-surface-container-low p-6 rounded-xl border-l-4 border-primary">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="text-primary w-5 h-5" />
                  <span className="font-label-md text-label-md text-primary">Pro Tip</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant italic">
                  Arrive early for the best beach club spots and enjoy the sunrise over the Gulf of Thailand.
                </p>
              </div>
            </div>
          </div>

          {/* Lamai */}
          <div className="group flex flex-col lg:flex-row-reverse bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-surface-container-high">
            <div className="lg:w-2/5 h-64 lg:h-auto relative overflow-hidden">
              <Image 
                src="https://pub-3433478e81804444ae052b8316ad0d83.r2.dev/images/explore/photo-1510414842594-a61c69b5ae57.jpg?auto=format&fit=crop&q=80&w=800"
                alt="Scenic Lamai Beach" 
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 100vw, 400px"/>
            </div>
            <div className="flex-1 p-8 flex flex-col justify-between text-right lg:text-left">
              <div>
                <div className="flex lg:flex-row flex-row-reverse justify-between items-start mb-4">
                  <h3 className="font-headline-md text-headline-md text-on-surface">Lamai</h3>
                  <div className="flex items-center gap-1 text-tertiary">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-label-md text-label-md">4.6</span>
                  </div>
                </div>
                <div className="flex flex-wrap lg:justify-start justify-end gap-2 mb-6">
                  <span className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full font-label-sm text-label-sm">Relaxed</span>
                  <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-sm text-label-sm">Scenic</span>
                  <span className="bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full font-label-sm text-label-sm">Iconic Boulders</span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant mb-8">
                  A more laid-back alternative to Chaweng, Lamai retains a classic island feel with its dramatic granite boulders and deep waters perfect for swimming.
                </p>
              </div>
              <div className="bg-surface-container-low p-6 rounded-xl border-r-4 lg:border-r-0 lg:border-l-4 border-primary">
                <div className="flex items-center lg:justify-start justify-end gap-2 mb-2">
                  <Lightbulb className="text-primary w-5 h-5" />
                  <span className="font-label-md text-label-md text-primary">Pro Tip</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant italic">
                  Visit the Grandfather and Grandmother rocks nearby for a touch of local folklore and amazing views.
                </p>
              </div>
            </div>
          </div>

          {/* Bophut */}
          <div className="group flex flex-col lg:flex-row bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-surface-container-high">
            <div className="lg:w-2/5 h-64 lg:h-auto relative overflow-hidden">
              <Image 
                src="https://pub-3433478e81804444ae052b8316ad0d83.r2.dev/images/explore/photo-1549317661-bd32c8ce0db2.jpg?auto=format&fit=crop&q=80&w=800"
                alt="Bophut Fisherman's Village" 
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 100vw, 400px"/>
            </div>
            <div className="flex-1 p-8 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-headline-md text-headline-md text-on-surface">Bophut</h3>
                  <div className="flex items-center gap-1 text-tertiary">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-label-md text-label-md">4.7</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full font-label-sm text-label-sm">Sophisticated</span>
                  <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-sm text-label-sm">Charming</span>
                  <span className="bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full font-label-sm text-label-sm">Heritage</span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant mb-8">
                  Blending authentic Thai culture with upscale leisure, Bophut is home to the historic Fisherman&apos;s Village and its trendy boutique shops and restaurants.
                </p>
              </div>
              <div className="bg-surface-container-low p-6 rounded-xl border-l-4 border-primary">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="text-primary w-5 h-5" />
                  <span className="font-label-md text-label-md text-primary">Pro Tip</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant italic">
                  Best visited on Friday evenings for the Fisherman&apos;s Village night market, a feast for all senses.
                </p>
              </div>
            </div>
          </div>

          {/* Maenam */}
          <div className="group flex flex-col lg:flex-row-reverse bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-surface-container-high">
            <div className="lg:w-2/5 h-64 lg:h-auto relative overflow-hidden">
              <Image 
                src="https://pub-3433478e81804444ae052b8316ad0d83.r2.dev/images/explore/photo-1596484552834-6a58f850e0a1.jpg?auto=format&fit=crop&q=80&w=800"
                alt="Peaceful Maenam Beach" 
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 100vw, 400px"/>
            </div>
            <div className="flex-1 p-8 flex flex-col justify-between text-right lg:text-left">
              <div>
                <div className="flex lg:flex-row flex-row-reverse justify-between items-start mb-4">
                  <h3 className="font-headline-md text-headline-md text-on-surface">Maenam</h3>
                  <div className="flex items-center gap-1 text-tertiary">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-label-md text-label-md">4.5</span>
                  </div>
                </div>
                <div className="flex flex-wrap lg:justify-start justify-end gap-2 mb-6">
                  <span className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full font-label-sm text-label-sm">Peaceful</span>
                  <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-sm text-label-sm">Family-friendly</span>
                  <span className="bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full font-label-sm text-label-sm">Secluded</span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant mb-8">
                  A sanctuary for families and digital nomads seeking quietude. Maenam offers calm, shallow waters and spectacular views of Koh Phangan across the bay.
                </p>
              </div>
              <div className="bg-surface-container-low p-6 rounded-xl border-r-4 lg:border-r-0 lg:border-l-4 border-primary">
                <div className="flex items-center lg:justify-start justify-end gap-2 mb-2">
                  <Lightbulb className="text-primary w-5 h-5" />
                  <span className="font-label-md text-label-md text-primary">Pro Tip</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant italic">
                  Perfect for a sunset stroll away from the crowds. Look for the small local bars for authentic Thai hospitality.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Weather and Tide Info */}
      <section className="bg-surface-container px-6 py-12 md:py-20">
        <div className="max-w-container-max mx-auto">
          <div className="bg-surface-container-lowest rounded-3xl p-8 md:p-12 shadow-sm border border-outline-variant flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 text-center md:text-left">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-3">Today&apos;s Beach Forecast</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">Planning a swim? Check current conditions before heading out to the sands.</p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 w-full md:w-auto">
              <div className="text-center flex flex-col items-center">
                <Sun className="text-tertiary mb-3 w-8 h-8" />
                <div className="font-label-md text-label-md text-on-surface text-lg">31°C</div>
                <div className="font-label-sm text-label-sm text-on-surface-variant">Clear</div>
              </div>
              
              <div className="text-center flex flex-col items-center">
                <Droplets className="text-primary mb-3 w-8 h-8" />
                <div className="font-label-md text-label-md text-on-surface text-lg">Low Tide</div>
                <div className="font-label-sm text-label-sm text-on-surface-variant">14:20 PM</div>
              </div>
              
              <div className="text-center flex flex-col items-center">
                <Waves className="text-secondary mb-3 w-8 h-8" />
                <div className="font-label-md text-label-md text-on-surface text-lg">Calm</div>
                <div className="font-label-sm text-label-sm text-on-surface-variant">0.3m Swell</div>
              </div>
              
              <div className="text-center flex flex-col items-center">
                <ThermometerSun className="text-error mb-3 w-8 h-8" />
                <div className="font-label-md text-label-md text-on-surface text-lg">UV 9</div>
                <div className="font-label-sm text-label-sm text-on-surface-variant">Very High</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Local Expert Verification (E-E-A-T) */}
      <section className="container mx-auto px-6 mt-16 max-w-5xl">
        <div className="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/50 shadow-sm flex flex-col md:flex-row items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h4 className="font-bold text-text-main text-lg mb-1">Local Expert Verified</h4>
            <p className="text-text-muted text-sm leading-relaxed">
              This guide was researched, compiled, and is regularly updated by our Koh Samui editorial team. We visit every location first-hand and check local listings to ensure you receive accurate and trustworthy information.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
