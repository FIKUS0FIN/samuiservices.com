/* eslint-disable @next/next/no-img-element */
import { Card } from '@/components/ui/Card';
import { MessageForm } from "@/components/features/MessageForm";
import { ReviewForm } from '@/components/features/ReviewForm';
import { ClaimButton } from '@/components/features/ClaimButton';
import ProductGrid from '../components/ProductGrid';

// Utility for safe JSON parse
const safeParse = (str: string | null | undefined, fallback: any = []) => {
  if (!str) return fallback;
  try {
    return JSON.parse(str);
  } catch (e) {
    return fallback;
  }
};

export default function StandardLayout({ business }: { business: any }) {
  const services = safeParse(business.services, []);
  const gallery = safeParse(business.galleryImages, []);
  const hours = safeParse(business.hours, []);

  // Use up to 3 images for a beautiful hero grid if available
  const heroImages = gallery.length >= 3 
    ? gallery.slice(0, 3) 
    : [business.image || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2000&auto=format&fit=crop'];

  return (
    <div className="relative pb-24 lg:pb-0"> {/* Padding for mobile sticky bar */}
      
      {/* Dynamic Hero Section - UI/UX Designer Z-Pattern Start */}
      <section className="relative w-full overflow-hidden">
        {heroImages.length >= 3 ? (
          <div className="grid grid-cols-4 grid-rows-2 h-[60vh] md:h-[70vh] gap-1">
            <div className="col-span-4 md:col-span-2 row-span-2 relative">
              <img className="w-full h-full object-cover" src={heroImages[0]} alt={business.name} />
              <div className="absolute inset-0 hero-gradient opacity-60"></div>
            </div>
            <div className="hidden md:block col-span-2 row-span-1 relative">
              <img className="w-full h-full object-cover" src={heroImages[1]} alt={business.name} />
              <div className="absolute inset-0 bg-black/20"></div>
            </div>
            <div className="hidden md:block col-span-2 row-span-1 relative">
              <img className="w-full h-full object-cover" src={heroImages[2]} alt={business.name} />
              <div className="absolute inset-0 bg-black/20"></div>
            </div>
          </div>
        ) : (
          <div className="w-full h-[60vh] md:h-[70vh] relative">
            <img className="w-full h-full object-cover" src={heroImages[0]} alt={business.name} />
            <div className="absolute inset-0 hero-gradient"></div>
          </div>
        )}
        
        {/* Overlay Content */}
        <div className="absolute inset-0 flex items-end pointer-events-none">
          <div className="max-w-container-max mx-auto w-full px-4 md:px-6 pb-8 md:pb-12 pointer-events-auto">
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-primary text-on-primary px-3 py-1 rounded-full text-xs font-bold uppercase shadow-md">
                  {business.category?.name || 'Local Business'}
                </span>
                {business.priceLevel && (
                  <span className="bg-surface/90 text-on-surface px-3 py-1 rounded-full text-xs font-bold shadow-md">
                    {business.priceLevel}
                  </span>
                )}
              </div>
              <h1 className="font-display text-4xl md:text-6xl text-white mb-2 drop-shadow-lg font-bold">
                {business.name}
              </h1>
              
              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-4 text-white">
                {business.averageRating > 0 && (
                  <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md">
                    <span className="text-amber-400 text-lg">★</span>
                    <span className="font-bold">{business.averageRating}</span>
                    <span className="text-white/80 text-sm">({business.reviewCount} reviews)</span>
                  </div>
                )}
                {business.address && (
                  <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md text-sm">
                    <span>📍</span> {business.address.substring(0, 40)}{business.address.length > 40 ? '...' : ''}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid Content */}
      <section className="max-w-container-max mx-auto px-4 md:px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative">
        
        {/* Main Column */}
        <div className="lg:col-span-8 flex flex-col gap-10">
          
          {/* Services Quick-Glance */}
          {services.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {services.map((service: string, idx: number) => (
                <span key={idx} className="bg-surface-container text-on-surface-variant px-4 py-2 rounded-xl text-sm font-medium border border-outline-variant">
                  {service}
                </span>
              ))}
            </div>
          )}

          {/* About */}
          <div className="flex flex-col gap-4" id="about">
            <h2 className="text-2xl font-bold text-on-surface">About</h2>
            <p className="text-lg text-on-surface-variant leading-relaxed whitespace-pre-line bg-surface p-6 rounded-2xl border border-outline-variant">
              {business.description}
            </p>
          </div>

          {/* Hours Box */}
          {hours.length > 0 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold text-on-surface">Opening Hours</h2>
              <div className="bg-surface p-6 rounded-2xl border border-outline-variant grid gap-2">
                {hours.map((hour: string, idx: number) => (
                  <div key={idx} className="flex justify-between text-on-surface-variant py-1 border-b border-outline-variant/50 last:border-0">
                    <span className="font-medium">{hour.split(': ')[0] || hour}</span>
                    <span>{hour.split(': ')[1] || ''}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gallery Grid */}
          {gallery.length > 0 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold text-on-surface">Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {gallery.map((img: string, idx: number) => (
                  <div key={idx} className="aspect-square rounded-xl overflow-hidden border border-outline-variant bg-surface-container-highest">
                    <img src={img} alt={`Gallery image ${idx + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Products & Services */}
          {business.products && business.products.length > 0 && (
            <ProductGrid products={business.products} />
          )}

          {/* Reviews */}
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-on-surface">Reviews</h2>
            <Card className="p-6 md:p-8 rounded-2xl shadow-sm border-outline-variant">
              <ReviewForm listingId={business.id} />
              <div className="flex flex-col gap-6 mt-8">
                {business.reviews && business.reviews.length > 0 ? (
                  business.reviews.map((review: any) => (
                    <div key={review.id} className="p-5 border border-outline-variant rounded-xl bg-surface-container-lowest">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="w-10 h-10 bg-primary/20 text-primary rounded-full flex items-center justify-center font-bold">
                          {(review.user?.name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-on-surface">{review.user?.name || 'Anonymous User'}</div>
                          <div className="text-xs text-on-surface-variant">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-amber-500 font-bold tracking-widest">
                          {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                        </div>
                      </div>
                      <p className="m-0 leading-relaxed text-on-surface-variant">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-on-surface-variant italic p-4 text-center">
                    No reviews yet. Be the first to share your experience!
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Sidebar & Desktop Action Bar */}
        <div className="hidden lg:block lg:col-span-4 relative">
          <div className="sticky top-24 flex flex-col gap-6">
            
            {/* CTA Widget */}
            <div className="bg-primary text-on-primary rounded-2xl p-6 shadow-xl flex flex-col gap-4">
              <h3 className="font-bold text-xl mb-2">Interested?</h3>
              {business.phone && (
                <a href={`tel:${business.phone}`} className="w-full bg-white text-primary text-center py-3 rounded-xl font-bold hover:bg-white/90 transition shadow-sm">
                  📞 Call Now
                </a>
              )}
              {business.mapLink && (
                <a href={business.mapLink} target="_blank" rel="noreferrer" className="w-full bg-primary-container text-on-primary-container text-center py-3 rounded-xl font-bold hover:brightness-95 transition shadow-sm">
                  📍 Get Directions
                </a>
              )}
              {business.website && (
                <a href={business.website} target="_blank" rel="noreferrer" className="w-full border-2 border-white/30 text-white text-center py-3 rounded-xl font-bold hover:bg-white/10 transition">
                  🌐 Visit Website
                </a>
              )}
            </div>

            {/* Message Form */}
            <div className="bg-surface border border-outline-variant rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-xl mb-4 text-on-surface">Send a Message</h3>
              <MessageForm receiverId={business.userId} listingId={business.id} />
            </div>

            {!business.isClaimed && (
              <ClaimButton listingId={business.id} />
            )}
          </div>
        </div>
      </section>

      {/* Sticky Mobile Action Bar (Conversion Optimized) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-outline-variant p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-50 flex items-center gap-3">
        {business.phone && (
          <a href={`tel:${business.phone}`} className="flex-1 bg-primary text-on-primary text-center py-3.5 rounded-xl font-bold shadow-md flex justify-center items-center gap-2">
            <span>📞</span> Call
          </a>
        )}
        {business.mapLink && (
          <a href={business.mapLink} target="_blank" rel="noreferrer" className="flex-1 bg-secondary-container text-on-secondary-container text-center py-3.5 rounded-xl font-bold shadow-md flex justify-center items-center gap-2">
            <span>📍</span> Map
          </a>
        )}
        {business.website && (
          <a href={business.website} target="_blank" rel="noreferrer" className="w-14 h-14 bg-surface-container flex items-center justify-center rounded-xl border border-outline-variant">
            🌐
          </a>
        )}
      </div>
      
    </div>
  );
}
