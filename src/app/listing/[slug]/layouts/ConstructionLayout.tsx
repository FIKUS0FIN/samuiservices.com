/* eslint-disable @next/next/no-img-element */
import { Card } from '@/components/ui/Card';
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

export default function ConstructionLayout({ business, faqs = [] }: { business: any, faqs?: any[] }) {
  return (
    <>
      {/* Construction Hero - Solid and reliable */}
      <section className="relative w-full h-[65vh] overflow-hidden">
        <img className="w-full h-full object-cover grayscale-[20%]" src={business.image || 'https://images.unsplash.com/photo-1541888086225-ee5a006ee42d?q=80&w=2000&auto=format&fit=crop'} alt={business.name} fetchPriority="high" />
        <div className="absolute inset-0 bg-surface/80 mix-blend-multiply"></div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
          <div className="bg-primary text-on-primary px-4 py-1.5 rounded text-sm font-bold tracking-widest uppercase mb-6 shadow-sm">
            Construction & Repair
          </div>
          <h1 className="font-display text-5xl md:text-7xl text-white mb-4 font-black tracking-tight drop-shadow-md">
            {business.name}
          </h1>
          <p className="font-body-lg text-white/90 max-w-2xl text-xl mb-8 font-medium">
            Building and repairing with excellence in {business.island.name}.
          </p>
          <div className="flex gap-4">
             <a href="#contact" className="px-8 py-4 bg-tertiary text-on-tertiary font-bold hover:bg-tertiary/90 transition-colors uppercase tracking-wider text-sm">
               Get an Estimate
             </a>
          </div>
        </div>
      </section>

      {/* Quick Stats Bar */}
      <div className="bg-surface-container-highest border-y border-outline-variant py-8">
         <div className="max-w-container-max mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-black text-on-surface mb-1">★ {business.averageRating?.toFixed(1) || '0.0'}</div>
              <div className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Average Rating</div>
            </div>
            <div>
              <div className="text-3xl font-black text-on-surface mb-1">{business.reviewCount || 0}</div>
              <div className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Verified Reviews</div>
            </div>
            <div>
              <div className="text-3xl font-black text-on-surface mb-1">100%</div>
              <div className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Satisfaction</div>
            </div>
            <div>
              <div className="text-3xl font-black text-on-surface mb-1">Local</div>
              <div className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">{business.island.name}</div>
            </div>
         </div>
      </div>

      <section className="max-w-container-max mx-auto px-4 md:px-6 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {!business.isClaimed && (
          <div className="lg:col-span-12">
             <ClaimButton listingId={business.id} />
          </div>
        )}

        <div className="lg:col-span-8 flex flex-col gap-16">
          
          <div className="prose prose-lg prose-slate max-w-none flex flex-col gap-6">
            <h2 className="font-display text-4xl text-on-surface font-bold">About Our Company</h2>
            <ServicesTags servicesRaw={business.services} />
            <DescriptionSection 
              businessName={business.name}
              categoryName={business.category?.name}
              islandName={business.island?.name}
              descriptionRaw={business.description}
            />
          </div>

          {/* Portfolio & Services */}
          {business.products && business.products.length > 0 && (
            <div>
              <h2 className="font-display text-4xl mb-8 text-on-surface font-bold border-l-8 border-primary pl-4">Our Projects & Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {business.products.map((item: any) => (
                  <div key={item.id} className="group relative overflow-hidden bg-surface-container-low shadow-md hover:shadow-xl transition-all">
                    {item.image ? (
                       <div className="aspect-[4/3] w-full overflow-hidden">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                       </div>
                    ) : (
                       <div className="aspect-[4/3] w-full bg-surface-container-high flex items-center justify-center">
                          <span className="text-4xl">🏗️</span>
                       </div>
                    )}
                    <div className="p-6 relative bg-surface border-t-4 border-primary">
                      <h3 className="font-headline-md text-xl mb-2 font-bold">{item.name}</h3>
                      <p className="text-on-surface-variant mb-4 line-clamp-3 min-h-[4.5rem] text-sm">
                        {item.description}
                      </p>
                      {item.price && (
                        <div className="font-bold text-lg inline-block bg-surface-container-highest px-3 py-1">
                          Starts at ฿{item.price.toLocaleString()}
                        </div>
                      )}
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

          {/* Reviews Section */}
          <div className="bg-surface-container-lowest border border-outline-variant p-8 shadow-sm">
            <UnifiedReviewsSection business={business} />
          </div>
        </div>

        {/* Contact Sidebar */}
        <div className="lg:col-span-4" id="contact">
          <Card className="p-8 sticky top-24 border-t-8 border-t-tertiary shadow-xl z-10">
            <h3 className="font-display text-3xl font-bold mb-6">Contact Us</h3>
            
            <div className="space-y-6 mb-8">
              {business.address && (
                <div className="flex gap-4 items-start">
                  <div className="text-tertiary mt-1">📍</div>
                  <div>
                    <div className="font-bold text-sm text-on-surface-variant uppercase tracking-wider mb-1">Office Location</div>
                    {business.mapLink ? (
                      <a href={business.mapLink} target="_blank" rel="noreferrer" className="font-medium text-lg hover:underline text-tertiary transition-colors block">
                        {business.address}
                      </a>
                    ) : (
                      <div className="font-medium text-lg">{business.address}</div>
                    )}
                  </div>
                </div>
              )}
              {business.phone && (
                <div className="flex gap-4 items-start">
                  <div className="text-tertiary mt-1">📞</div>
                  <div>
                    <div className="font-bold text-sm text-on-surface-variant uppercase tracking-wider mb-1">Direct Line</div>
                    <a href={`tel:${business.phone}`} className="font-medium text-lg hover:underline text-tertiary transition-colors block">{business.phone}</a>
                  </div>
                </div>
              )}
              {business.website && (
                <div className="flex gap-4 items-start">
                  <div className="text-tertiary mt-1">🌐</div>
                  <div>
                    <div className="font-bold text-sm text-on-surface-variant uppercase tracking-wider mb-1">Website</div>
                    <a href={business.website} target="_blank" rel="noreferrer" className="font-medium text-lg hover:underline text-tertiary transition-colors block truncate max-w-[200px]">{business.website}</a>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-surface-container-low p-6 rounded-lg border border-outline-variant">
              <h4 className="font-bold mb-4">Request a Consultation</h4>
              <MessageForm receiverId={business.userId} listingId={business.id} />
            </div>
          </Card>
        </div>

      </section>
    </>
  );
}
