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

export default function RealEstateLayout({ business, faqs = [] }: { business: any, faqs?: any[] }) {
  return (
    <>
      {/* Real Estate Hero Section - Taller with prominent contact */}
      <section className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden">
        <img className="w-full h-full object-cover" src={business.image || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2000&auto=format&fit=crop'} alt={business.name} fetchPriority="high" />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/80 to-transparent"></div>
        
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-container-max mx-auto w-full px-4 md:px-6 pb-12 md:pb-16 flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="flex flex-col gap-3 max-w-3xl">
              <div className="flex items-center gap-2">
                <div className="bg-primary text-on-primary px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                  <span className="text-xs uppercase tracking-wider font-bold">
                    Real Estate Agency
                  </span>
                </div>
              </div>
              <h1 className="font-display text-4xl md:text-6xl text-on-surface mb-1 drop-shadow-sm">
                {business.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-on-surface-variant">
                <div className="flex items-center gap-1.5">
                  <span className="text-primary font-bold">★ {business.averageRating?.toFixed(1) || '0.0'}</span>
                  <span className="font-label-md">({business.reviewCount || 0} reviews)</span>
                </div>
                {business.address && (
                  <div className="flex items-center gap-1.5 border-l border-outline-variant pl-4">
                    <span className="font-body-md">📍 {business.mapLink ? (
                      <a href={business.mapLink} target="_blank" rel="noreferrer" className="hover:underline hover:text-primary transition-colors">
                        {business.address}, {business.island.name}
                      </a>
                    ) : (
                      <>{business.address}, {business.island.name}</>
                    )}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-lg border border-outline-variant min-w-[320px] z-10">
              <h3 className="font-headline-sm mb-4">Contact Agent</h3>
              {business.phone && (
                <a href={`tel:${business.phone}`} className="font-body-lg font-bold mb-4 flex items-center gap-2 hover:text-primary transition-colors">
                  <span className="text-primary">📞</span> {business.phone}
                </a>
              )}
              {business.website && (
                <a href={business.website} target="_blank" rel="noreferrer" className="font-body-md font-medium mb-4 flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors">
                  <span className="text-primary">🌐</span> Visit Website
                </a>
              )}
              <MessageForm receiverId={business.userId} listingId={business.id} />
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
        <div className="lg:col-span-12 flex flex-col gap-16">
          
          <div className="flex flex-col gap-6" id="about">
            <h2 className="font-headline-lg text-3xl text-on-surface border-b border-outline-variant pb-4 mb-6">About the Agency</h2>
            <ServicesTags servicesRaw={business.services} />
            <DescriptionSection 
              businessName={business.name}
              categoryName={business.category?.name}
              islandName={business.island?.name}
              descriptionRaw={business.description}
            />
          </div>

          {/* Featured Properties Showcase */}
          {business.products && business.products.length > 0 && (
            <div>
              <h2 className="font-headline-lg text-3xl text-on-surface border-b border-outline-variant pb-4 mb-8">Featured Properties</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {business.products.map((property: any) => (
                  <Card key={property.id} className="overflow-hidden hover:-translate-y-1 transition-transform duration-300">
                    <div className="aspect-[4/3] w-full bg-surface-container-high relative">
                      {property.image ? (
                        <img src={property.image} alt={property.name} className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-on-surface-variant text-4xl">
                          🏠
                        </div>
                      )}
                      <div className="absolute top-3 right-3 bg-surface text-on-surface px-3 py-1 rounded-full font-bold shadow-md">
                        {property.price ? `฿${property.price.toLocaleString()}` : 'Contact for price'}
                      </div>
                    </div>
                    <div className="p-5 flex flex-col gap-3">
                      <h3 className="font-headline-sm text-xl line-clamp-1">{property.name}</h3>
                      <p className="font-body-md text-on-surface-variant line-clamp-2">
                        {property.description || 'View details for more information.'}
                      </p>
                    </div>
                  </Card>
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
          <div className="max-w-4xl mx-auto w-full">
            <UnifiedReviewsSection business={business} />
          </div>
        </div>
      </section>
    </>
  );
}
