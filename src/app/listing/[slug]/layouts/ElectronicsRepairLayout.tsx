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

export default function ElectronicsRepairLayout({ business, faqs = [] }: { business: any, faqs?: any[] }) {
  return (
    <>
      {/* Electronics Hero Section - Tech focused */}
      <section className="bg-surface-container-low border-b border-outline-variant pt-24 pb-12 md:pt-32 md:pb-16 px-4 md:px-6">
        <div className="max-w-container-max mx-auto flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-secondary text-on-secondary px-3 py-1 rounded-full text-xs uppercase tracking-wider font-bold">
                Electronics & Repair
              </span>
              <span className="text-primary font-bold text-sm bg-primary/10 px-3 py-1 rounded-full">
                {business.island.name}
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-on-surface mb-6 font-bold leading-tight">
              {business.name}
            </h1>
            <p className="font-body-lg text-on-surface-variant max-w-2xl text-lg md:text-xl mb-8">
              Expert diagnostics and rapid repairs. We get your devices back up and running.
            </p>
            <div className="flex gap-4">
              <a href="#services" className="px-6 py-3 bg-primary text-on-primary rounded-xl font-bold hover:bg-primary/90 transition-colors">
                View Repair Services
              </a>
              {business.phone && (
                <a href={`tel:${business.phone}`} className="px-6 py-3 bg-surface-container-highest text-on-surface border border-outline rounded-xl font-bold hover:bg-surface-container-high transition-colors">
                  Call {business.phone}
                </a>
              )}
            </div>
          </div>
          {business.image && (
            <div className="w-full md:w-1/3 aspect-square rounded-3xl overflow-hidden border-4 border-surface shadow-xl relative">
              <img src={business.image} alt={business.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <div className="text-white font-bold text-xl flex items-center gap-2">
                    <span>⭐</span> {business.averageRating?.toFixed(1) || '0.0'} ({business.reviewCount || 0} Reviews)
                  </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Content Grid */}
      <section className="max-w-container-max mx-auto px-4 md:px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {!business.isClaimed && (
          <div className="lg:col-span-12">
             <ClaimButton listingId={business.id} />
          </div>
        )}

        <div className="lg:col-span-8 flex flex-col gap-12">
          
          <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant">
            <h2 className="font-headline-md text-2xl mb-4">About Our Workshop</h2>
            <div className="flex flex-col gap-6">
              <ServicesTags servicesRaw={business.services} />
              <DescriptionSection 
                businessName={business.name}
                categoryName={business.category?.name}
                islandName={business.island?.name}
                descriptionRaw={business.description}
              />
            </div>
          </div>

          {/* Services List (Tech focused table-like layout) */}
          {business.products && business.products.length > 0 && (
            <div id="services">
              <h2 className="font-headline-lg text-3xl mb-6 flex items-center gap-3">
                <span className="text-primary">🔧</span> Repair Services & Pricing
              </h2>
              <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden">
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-outline-variant bg-surface-container-low font-bold text-on-surface-variant text-sm uppercase tracking-wider hidden md:grid">
                  <div className="col-span-6">Service Type</div>
                  <div className="col-span-3 text-center">Est. Time</div>
                  <div className="col-span-3 text-right">Price</div>
                </div>
                <div className="divide-y divide-outline-variant">
                  {business.products.map((service: any) => (
                    <div key={service.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-5 items-center hover:bg-surface-container-lowest transition-colors">
                      <div className="col-span-1 md:col-span-6 flex gap-4 items-center">
                        {service.image && (
                           <img src={service.image} alt={service.name} className="w-12 h-12 rounded bg-surface-container-high object-cover shrink-0" />
                        )}
                        <div>
                          <div className="font-bold text-on-surface">{service.name}</div>
                          <div className="text-sm text-on-surface-variant line-clamp-1">{service.description}</div>
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-3 text-sm text-on-surface-variant md:text-center flex md:block items-center gap-2">
                        <span className="md:hidden font-bold">Time:</span> 
                        {service.description?.includes('hour') || service.description?.includes('day') ? service.description.split('.')[0] : 'Varies'}
                      </div>
                      <div className="col-span-1 md:col-span-3 font-bold text-primary text-lg md:text-right">
                        {service.price ? `฿${service.price.toLocaleString()}` : 'Ask'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Trust & Warranty Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="bg-primary/10 p-6 rounded-xl border border-primary/20 text-center">
                <div className="text-3xl mb-3">🛡️</div>
                <h4 className="font-bold mb-2 text-primary">Warranty</h4>
                <p className="text-sm text-on-surface-variant">We provide 90-day warranty on all parts and labor.</p>
             </div>
             <div className="bg-secondary/10 p-6 rounded-xl border border-secondary/20 text-center">
                <div className="text-3xl mb-3">⚡</div>
                <h4 className="font-bold mb-2 text-secondary">Fast Turnaround</h4>
                <p className="text-sm text-on-surface-variant">Same-day repairs available for most screen replacements.</p>
             </div>
             <div className="bg-tertiary/10 p-6 rounded-xl border border-tertiary/20 text-center">
                <div className="text-3xl mb-3">🔍</div>
                <h4 className="font-bold mb-2 text-tertiary">Free Diagnostics</h4>
                <p className="text-sm text-on-surface-variant">No fix, no fee policy on standard device evaluations.</p>
             </div>
          </div>

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
          <UnifiedReviewsSection business={business} />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <Card className="p-6">
            <h3 className="font-headline-sm mb-4">Location & Hours</h3>
            <div className="space-y-4">
              {business.address && (
                <div>
                  <div className="text-sm text-on-surface-variant mb-1 font-bold">Address</div>
                  {business.mapLink ? (
                    <a href={business.mapLink} target="_blank" rel="noreferrer" className="hover:underline text-primary transition-colors block">
                      {business.address}
                    </a>
                  ) : (
                    <div>{business.address}</div>
                  )}
                </div>
              )}
              {business.phone && (
                <div>
                  <div className="text-sm text-on-surface-variant mb-1 font-bold">Phone</div>
                  <a href={`tel:${business.phone}`} className="hover:underline text-primary transition-colors block">{business.phone}</a>
                </div>
              )}
              {business.website && (
                <div>
                  <div className="text-sm text-on-surface-variant mb-1 font-bold">Website</div>
                  <a href={business.website} target="_blank" rel="noreferrer" className="hover:underline text-primary transition-colors block truncate max-w-full">{business.website}</a>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6 bg-surface-container-low z-10">
            <h3 className="font-headline-sm mb-4">Message Technician</h3>
            <MessageForm receiverId={business.userId} listingId={business.id} />
          </Card>
        </div>

      </section>
    </>
  );
}
