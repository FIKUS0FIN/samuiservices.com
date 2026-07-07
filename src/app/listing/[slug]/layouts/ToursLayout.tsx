/* eslint-disable @next/next/no-img-element */
import { MessageForm } from "@/components/features/MessageForm";
import { ClaimButton } from '@/components/features/ClaimButton';
import { 
  ServicesTags, 
  DescriptionSection, 
  OpeningHoursWidget, 
  InteractiveMap, 
  GalleryGrid, 
  UnifiedReviewsSection 
} from '../components/LayoutWidgets';

export default function ToursLayout({ business, faqs = [] }: { business: any, faqs?: any[] }) {
  return (
    <>
      {/* Tours Hero - Immersive & Adventurous */}
      <section className="relative w-full h-[85vh] overflow-hidden">
        <img className="w-full h-full object-cover" src={business.image || 'https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?q=80&w=2000&auto=format&fit=crop'} alt={business.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10"></div>
        
        <div className="absolute inset-0 flex flex-col justify-end pb-24 md:pb-32">
          <div className="max-w-container-max mx-auto w-full px-4 md:px-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-[#ff6b6b] text-white px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase shadow-lg">
                Tour Provider
              </span>
              <span className="text-white font-bold bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-sm">
                📍 {business.island.name}
              </span>
            </div>
            
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white mb-6 font-black drop-shadow-xl tracking-tight leading-none max-w-4xl">
              {business.name}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-white/90 text-lg md:text-xl">
              <div className="flex items-center gap-2">
                <span className="text-[#fca311] text-2xl">★</span>
                <span className="font-bold text-white">{business.averageRating?.toFixed(1) || '0.0'}</span>
                <span className="text-white/70">({business.reviewCount || 0} reviews)</span>
              </div>
              <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-white/50"></div>
              {business.mapLink ? (
                <a href={business.mapLink} target="_blank" rel="noreferrer" className="font-medium hover:underline hover:text-primary transition-colors">
                  {business.address}
                </a>
              ) : (
                <div className="font-medium">{business.address}</div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Booking Bar (Sticky) */}
      <div className="bg-surface sticky top-16 md:top-20 z-40 border-b border-outline-variant shadow-sm hidden md:block">
         <div className="max-w-container-max mx-auto px-6 py-4 flex justify-between items-center">
            <div className="font-bold text-lg">{business.name}</div>
            <a href="#book" className="bg-[#ff6b6b] text-white px-8 py-3 rounded-full font-bold shadow-md hover:bg-[#ff5252] transition-colors">
              Book Your Adventure
            </a>
         </div>
      </div>

      <section className="max-w-container-max mx-auto px-4 md:px-8 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {!business.isClaimed && (
          <div className="lg:col-span-12">
             <ClaimButton listingId={business.id} />
          </div>
        )}

        <div className="lg:col-span-8 flex flex-col gap-16">
          
          <div className="flex flex-col gap-6">
            <h2 className="font-display text-4xl font-bold text-on-surface">Experience the Extraordinary</h2>
            <ServicesTags servicesRaw={business.services} />
            <DescriptionSection 
              businessName={business.name}
              categoryName={business.category?.name}
              islandName={business.island?.name}
              descriptionRaw={business.description}
            />
          </div>

          {/* Tours / Packages */}
          {business.products && business.products.length > 0 && (
            <div>
              <h2 className="font-display text-4xl mb-8 font-bold text-on-surface">Available Tours</h2>
              <div className="flex flex-col gap-8">
                {business.products.map((tour: any) => (
                  <div key={tour.id} className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm border border-outline-variant flex flex-col md:flex-row group hover:shadow-xl transition-shadow">
                    {tour.image && (
                      <div className="md:w-5/12 h-64 md:h-auto relative overflow-hidden">
                        <img src={tour.image} alt={tour.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-on-surface font-bold px-3 py-1 rounded-lg text-sm shadow-sm">
                          Best Seller
                        </div>
                      </div>
                    )}
                    <div className="p-8 md:w-7/12 flex flex-col">
                      <h3 className="font-headline-md text-2xl font-bold mb-3">{tour.name}</h3>
                      <p className="text-on-surface-variant mb-6 line-clamp-3 text-lg">{tour.description}</p>
                      
                      <div className="mt-auto flex items-center justify-between pt-6 border-t border-outline-variant">
                        {tour.price ? (
                          <div>
                            <div className="text-sm text-on-surface-variant uppercase tracking-wider font-bold mb-1">From</div>
                            <div className="font-display text-3xl font-bold text-primary">฿{tour.price.toLocaleString()}</div>
                          </div>
                        ) : (
                          <div className="font-bold text-on-surface-variant uppercase tracking-wider">Contact for Price</div>
                        )}
                        <a href="#book" className="px-6 py-3 bg-secondary-container text-on-secondary-container rounded-xl font-bold hover:bg-secondary-container/80 transition-colors">
                          Inquire
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Opening Hours */}
          <OpeningHoursWidget hoursRaw={business.hours} />

          {/* Gallery Grid */}
          <GalleryGrid businessName={business.name} galleryRaw={business.galleryImages} />

          {/* Location Map */}
          <InteractiveMap 
            businessName={business.name}
            address={business.address}
            lat={business.lat}
            lng={business.lng}
            mapLink={business.mapLink}
          />

          {/* Reviews List */}
          <div>
            <UnifiedReviewsSection business={business} />
          </div>
        </div>

        {/* Booking/Contact Sidebar */}
        <div className="lg:col-span-4" id="book">
          <div className="bg-white rounded-3xl shadow-xl border border-outline-variant p-8 sticky top-32">
            <h3 className="font-display text-3xl font-bold mb-2">Book Your Trip</h3>
            <p className="text-on-surface-variant mb-8">Send a message to our guides to secure your spot or ask questions.</p>
            
            <div className="mb-8 space-y-4">
              {business.phone && (
                <div className="flex justify-between items-center py-3 border-b border-outline-variant">
                  <span className="font-bold text-on-surface-variant">Phone</span>
                  <a href={`tel:${business.phone}`} className="font-medium text-lg hover:text-primary transition-colors">{business.phone}</a>
                </div>
              )}
              {business.website && (
                <div className="flex justify-between items-center py-3 border-b border-outline-variant">
                  <span className="font-bold text-on-surface-variant">Website</span>
                  <a href={business.website} target="_blank" rel="noreferrer" className="font-medium text-lg hover:text-primary transition-colors text-right truncate max-w-[200px]">Visit Site</a>
                </div>
              )}
              {business.address && (
                <div className="flex justify-between items-start py-3 border-b border-outline-variant gap-2">
                  <span className="font-bold text-on-surface-variant shrink-0">Location</span>
                  {business.mapLink ? (
                    <a href={business.mapLink} target="_blank" rel="noreferrer" className="font-medium text-right hover:underline hover:text-primary transition-colors">
                      {business.address}
                    </a>
                  ) : (
                    <span className="font-medium text-right">{business.address}</span>
                  )}
                </div>
              )}
            </div>

            <div className="bg-surface-container-low p-6 rounded-2xl">
              <MessageForm receiverId={business.userId} listingId={business.id} />
            </div>
            
            <div className="mt-6 flex items-start gap-3 text-sm text-on-surface-variant">
              <span className="text-xl">🛡️</span>
              <p>Secure inquiry directly with the tour provider. No booking fees.</p>
            </div>
          </div>
        </div>

      </section>
    </>
  );
}
