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

export default function TransportationLayout({ business, faqs = [] }: { business: any, faqs?: any[] }) {
  return (
    <>
      {/* Transportation Hero Section - Fast and bold */}
      <section className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden bg-surface-container-highest">
        <img className="w-full h-full object-cover opacity-60 mix-blend-overlay" src={business.image || 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2000&auto=format&fit=crop'} alt={business.name} fetchPriority="high" />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-surface/90 backdrop-blur-md p-8 md:p-12 rounded-3xl text-center max-w-3xl mx-4 border border-outline-variant shadow-2xl">
            <div className="bg-tertiary text-on-tertiary px-4 py-1.5 rounded-full inline-flex items-center gap-2 mb-6 font-bold tracking-wide text-sm">
              🚐 Transportation & Delivery
            </div>
            <h1 className="font-display text-4xl md:text-5xl text-on-surface mb-4 font-black">
              {business.name}
            </h1>
            <p className="font-body-lg text-on-surface-variant mb-8 line-clamp-2">
              Serving {business.island.name} and surrounding areas. Fast, reliable, and secure.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {business.phone && (
                <a href={`tel:${business.phone}`} className="px-8 py-3 bg-primary text-on-primary rounded-full font-bold shadow-md hover:bg-primary/90 transition-colors">
                  Call Now
                </a>
              )}
              <a href="#book" className="px-8 py-3 bg-secondary-container text-on-secondary-container rounded-full font-bold shadow-sm hover:bg-secondary-container/90 transition-colors">
                Request Quote
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <section className="max-w-container-max mx-auto px-4 md:px-6 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {!business.isClaimed && (
          <div className="lg:col-span-12">
             <ClaimButton listingId={business.id} />
          </div>
        )}

        {/* Main Content Area */}
        <div className="lg:col-span-8 flex flex-col gap-12">
          
          <div className="flex flex-col gap-6" id="about">
            <h2 className="font-headline-lg text-3xl text-on-surface border-b border-outline-variant pb-4">Service Details</h2>
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant flex flex-col gap-6">
              <ServicesTags servicesRaw={business.services} />
              <DescriptionSection 
                businessName={business.name}
                categoryName={business.category?.name}
                islandName={business.island?.name}
                descriptionRaw={business.description}
              />
            </div>
          </div>

          {/* Vehicle Fleet / Services Showcase */}
          {business.products && business.products.length > 0 && (
            <div>
              <h2 className="font-headline-lg text-3xl text-on-surface border-b border-outline-variant pb-4 mb-6">Our Fleet & Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {business.products.map((service: any) => (
                  <div key={service.id} className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-sm hover:shadow-md transition-shadow">
                    {service.image && (
                      <div className="md:w-1/3 h-48 md:h-auto bg-surface-container-high">
                        <img src={service.image} alt={service.name} className="w-full h-full object-cover" loading="lazy" />
                      </div>
                    )}
                    <div className="p-6 flex-1 flex flex-col justify-center">
                      <h3 className="font-headline-sm text-xl mb-2">{service.name}</h3>
                      <p className="font-body-md text-on-surface-variant mb-4 flex-1 text-sm">
                        {service.description || 'Reliable transportation service.'}
                      </p>
                      <div className="font-bold text-primary text-lg">
                        {service.price ? `From ฿${service.price.toLocaleString()}` : 'Custom Quote'}
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

          {/* Reviews Section */}
          <UnifiedReviewsSection business={business} />
        </div>

        {/* Sidebar Request Quote Form */}
        <div className="lg:col-span-4" id="book">
          <div className="bg-primary-container text-on-primary-container rounded-3xl p-8 sticky top-24 shadow-lg z-10">
            <h3 className="font-headline-md text-2xl mb-2">Request a Vehicle</h3>
            <p className="font-body-md mb-6 opacity-90">Send a direct message to {business.name} to arrange your transport.</p>
            
            <div className="mb-6 space-y-3 text-sm opacity-90">
              {business.phone && (
                <div>
                  <strong>Phone:</strong> <a href={`tel:${business.phone}`} className="hover:underline ml-1">{business.phone}</a>
                </div>
              )}
              {business.website && (
                <div>
                  <strong>Website:</strong> <a href={business.website} target="_blank" rel="noreferrer" className="hover:underline ml-1 truncate block max-w-full">{business.website}</a>
                </div>
              )}
            </div>

            <div className="bg-surface text-on-surface rounded-2xl p-6 shadow-sm">
              <MessageForm receiverId={business.userId} listingId={business.id} />
            </div>
          </div>
        </div>

      </section>
    </>
  );
}
