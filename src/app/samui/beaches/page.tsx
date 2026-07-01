import { Metadata } from 'next';
import Image from 'next/image';
import { Palmtree, MapPin, Users, Waves, Navigation, Music } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Best Koh Samui Beaches Guide - Chaweng, Lamai, Bophut & Maenam',
  description: 'Discover the best beaches on Koh Samui. From the vibrant nightlife of Chaweng to the serene shores of Maenam, find your perfect island paradise.',
};

export default function BeachesPage() {
  return (
    <div className="min-h-screen bg-surface-hover/20 pb-16">
      {/* Hero Section with Image */}
      <div className="relative pt-20 pb-24 px-6 border-b border-primary/10 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1544941913-75a7458ec2d1?auto=format&fit=crop&q=80&w=2000"
            alt="Koh Samui tropical beach"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-surface via-surface/90 to-surface-hover/20 z-10" />
        </div>
        
        <div className="container mx-auto max-w-5xl text-center relative z-20">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-6 text-primary shadow-sm">
            <Palmtree className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-text-main mb-6 leading-tight">
            The Ultimate Koh Samui <br/> <span className="text-primary">Beaches Guide</span>
          </h1>
          <p className="text-lg md:text-xl text-text-muted max-w-3xl mx-auto leading-relaxed">
            With over 40 kilometers of coastline, Koh Samui offers a beach for every type of traveler. Whether you're seeking vibrant nightlife, world-class dining, or a quiet stretch of pristine sand, find your perfect coastal paradise below.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-16 max-w-6xl space-y-20">
        
        {/* Chaweng */}
        <section className="scroll-mt-24" id="chaweng">
          <div className="flex flex-col lg:flex-row gap-10 items-center bg-surface rounded-3xl overflow-hidden shadow-sm border border-outline-muted p-4 lg:p-0">
            <div className="w-full lg:w-1/2 h-64 lg:h-full min-h-[400px] relative rounded-2xl lg:rounded-none overflow-hidden">
              <Image 
                src="https://images.unsplash.com/photo-1596881775730-a8898ac8006f?auto=format&fit=crop&q=80&w=800"
                alt="Chaweng Beach Koh Samui"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="w-full lg:w-1/2 lg:py-12 lg:pr-12">
              <div className="flex items-center gap-2 mb-4 text-primary font-semibold tracking-wide uppercase text-sm">
                <Music className="w-4 h-4" /> The Vibrant Hub
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-text-main mb-4">Chaweng Beach</h2>
              <p className="text-text-muted leading-relaxed mb-6">
                The undisputed center of action on Koh Samui. Chaweng boasts a stunning 7-kilometer stretch of fine, powdery white sand and warm, shallow waters. It is the island's most developed area, offering an unparalleled mix of beach clubs, world-class restaurants, shopping malls, and an energetic nightlife scene that goes until dawn.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-surface-hover/50 p-4 rounded-xl border border-outline-muted/50">
                  <div className="flex items-center gap-2 text-text-main font-bold mb-1"><Users className="w-4 h-4 text-primary" /> Vibe</div>
                  <div className="text-sm text-text-muted">High Energy, Busy, Fun</div>
                </div>
                <div className="bg-surface-hover/50 p-4 rounded-xl border border-outline-muted/50">
                  <div className="flex items-center gap-2 text-text-main font-bold mb-1"><Waves className="w-4 h-4 text-primary" /> The Beach</div>
                  <div className="text-sm text-text-muted">Soft white sand, active</div>
                </div>
              </div>
              <p className="text-sm text-text-muted border-l-2 border-primary pl-4 italic">
                <strong>Pro Tip:</strong> The beach is divided into three zones. Head to North Chaweng if you want a slightly quieter, family-friendly atmosphere while staying close to the amenities.
              </p>
            </div>
          </div>
        </section>

        {/* Lamai */}
        <section className="scroll-mt-24" id="lamai">
          <div className="flex flex-col lg:flex-row-reverse gap-10 items-center bg-surface rounded-3xl overflow-hidden shadow-sm border border-outline-muted p-4 lg:p-0">
            <div className="w-full lg:w-1/2 h-64 lg:h-full min-h-[400px] relative rounded-2xl lg:rounded-none overflow-hidden">
              <Image 
                src="https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&q=80&w=800"
                alt="Lamai Beach Koh Samui"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="w-full lg:w-1/2 lg:py-12 lg:pl-12">
              <div className="flex items-center gap-2 mb-4 text-primary font-semibold tracking-wide uppercase text-sm">
                <Navigation className="w-4 h-4" /> The Balanced Alternative
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-text-main mb-4">Lamai Beach</h2>
              <p className="text-text-muted leading-relaxed mb-6">
                As the second largest resort area, Lamai offers a fantastic balance. It provides plenty of dining, shopping, and nightlife options, but maintains a more laid-back, less congested atmosphere than Chaweng. It's a favorite among digital nomads, long-term expats, and travelers who want convenience without the chaos.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-surface-hover/50 p-4 rounded-xl border border-outline-muted/50">
                  <div className="flex items-center gap-2 text-text-main font-bold mb-1"><Users className="w-4 h-4 text-primary" /> Vibe</div>
                  <div className="text-sm text-text-muted">Relaxed, Accessible</div>
                </div>
                <div className="bg-surface-hover/50 p-4 rounded-xl border border-outline-muted/50">
                  <div className="flex items-center gap-2 text-text-main font-bold mb-1"><Waves className="w-4 h-4 text-primary" /> The Beach</div>
                  <div className="text-sm text-text-muted">Golden sand, deeper water</div>
                </div>
              </div>
              <p className="text-sm text-text-muted border-l-2 border-primary pl-4 italic">
                <strong>Pro Tip:</strong> Don't miss the famous Hin Ta and Hin Yai (Grandfather and Grandmother) rock formations located at the southern tip of Lamai beach.
              </p>
            </div>
          </div>
        </section>

        {/* Bophut */}
        <section className="scroll-mt-24" id="bophut">
          <div className="flex flex-col lg:flex-row gap-10 items-center bg-surface rounded-3xl overflow-hidden shadow-sm border border-outline-muted p-4 lg:p-0">
            <div className="w-full lg:w-1/2 h-64 lg:h-full min-h-[400px] relative rounded-2xl lg:rounded-none overflow-hidden">
              <Image 
                src="https://images.unsplash.com/photo-1601369792440-6f02888bf1c3?auto=format&fit=crop&q=80&w=800"
                alt="Bophut Fisherman's Village Koh Samui"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="w-full lg:w-1/2 lg:py-12 lg:pr-12">
              <div className="flex items-center gap-2 mb-4 text-primary font-semibold tracking-wide uppercase text-sm">
                <MapPin className="w-4 h-4" /> The Charming Village
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-text-main mb-4">Bophut Beach</h2>
              <p className="text-text-muted leading-relaxed mb-6">
                Bophut is synonymous with elegance and charm, anchored by the historic Fisherman's Village. Here, old wooden Chinese shop-houses have been converted into chic boutiques, trendy cafes, and upscale seaside restaurants. It is the perfect destination for couples and foodies seeking a sophisticated, romantic atmosphere.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-surface-hover/50 p-4 rounded-xl border border-outline-muted/50">
                  <div className="flex items-center gap-2 text-text-main font-bold mb-1"><Users className="w-4 h-4 text-primary" /> Vibe</div>
                  <div className="text-sm text-text-muted">Sophisticated, Romantic</div>
                </div>
                <div className="bg-surface-hover/50 p-4 rounded-xl border border-outline-muted/50">
                  <div className="flex items-center gap-2 text-text-main font-bold mb-1"><Waves className="w-4 h-4 text-primary" /> The Beach</div>
                  <div className="text-sm text-text-muted">Coarse sand, great views</div>
                </div>
              </div>
              <p className="text-sm text-text-muted border-l-2 border-primary pl-4 italic">
                <strong>Pro Tip:</strong> Visit on a Friday evening! The entire main street of Fisherman's Village closes to traffic and transforms into a massive, bustling night market.
              </p>
            </div>
          </div>
        </section>

        {/* Maenam */}
        <section className="scroll-mt-24" id="maenam">
          <div className="flex flex-col lg:flex-row-reverse gap-10 items-center bg-surface rounded-3xl overflow-hidden shadow-sm border border-outline-muted p-4 lg:p-0">
            <div className="w-full lg:w-1/2 h-64 lg:h-full min-h-[400px] relative rounded-2xl lg:rounded-none overflow-hidden">
              <Image 
                src="https://images.unsplash.com/photo-1582236531393-559d43d1a89c?auto=format&fit=crop&q=80&w=800"
                alt="Maenam Beach Koh Samui"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="w-full lg:w-1/2 lg:py-12 lg:pl-12">
              <div className="flex items-center gap-2 mb-4 text-primary font-semibold tracking-wide uppercase text-sm">
                <Palmtree className="w-4 h-4" /> The Quiet Sanctuary
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-text-main mb-4">Maenam Beach</h2>
              <p className="text-text-muted leading-relaxed mb-6">
                If you are looking to escape the crowds entirely, Maenam is your sanctuary. Located on the northern coast, this long, pristine stretch of golden sand offers a deeply relaxed, "local" feel. It is wonderfully serene, making it the top choice for families and those seeking absolute tranquility.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-surface-hover/50 p-4 rounded-xl border border-outline-muted/50">
                  <div className="flex items-center gap-2 text-text-main font-bold mb-1"><Users className="w-4 h-4 text-primary" /> Vibe</div>
                  <div className="text-sm text-text-muted">Quiet, Peaceful, Family</div>
                </div>
                <div className="bg-surface-hover/50 p-4 rounded-xl border border-outline-muted/50">
                  <div className="flex items-center gap-2 text-text-main font-bold mb-1"><Waves className="w-4 h-4 text-primary" /> The Beach</div>
                  <div className="text-sm text-text-muted">Golden sand, calm water</div>
                </div>
              </div>
              <p className="text-sm text-text-muted border-l-2 border-primary pl-4 italic">
                <strong>Pro Tip:</strong> The water here gets deep quite quickly compared to Chaweng, making it excellent for swimming regardless of the tide level.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
