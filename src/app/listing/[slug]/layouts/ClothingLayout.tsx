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

export default function ClothingLayout({ business, faqs = [] }: { business: any, faqs?: any[] }) {
  return (
    <div className="bg-white min-h-screen font-sans text-gray-900">
      {/* Fashion Hero - Editorial Style */}
      <section className="relative w-full h-[70vh] md:h-[85vh]">
        <div className="absolute inset-0 bg-black/10 z-10 pointer-events-none"></div>
        <img 
          className="w-full h-full object-cover object-top" 
          src={business.image || 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2000&auto=format&fit=crop'} 
          alt={business.name} 
        />
        
        <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center p-6 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
           <div className="mt-auto pb-12 md:pb-24 max-w-4xl">
              <div className="text-white/80 uppercase tracking-[0.3em] text-xs font-bold mb-4">
                Clothing & Accessories
              </div>
              <h1 className="font-serif text-5xl md:text-8xl text-white mb-6 uppercase tracking-wider" style={{ letterSpacing: '0.05em' }}>
                {business.name}
              </h1>
              <p className="text-white/90 text-lg md:text-xl font-light tracking-wide max-w-2xl mx-auto">
                Curated fashion in the heart of {business.island.name}.
              </p>
           </div>
        </div>
      </section>

      {/* Info Ticker */}
      <div className="bg-black text-white py-3 overflow-hidden border-y border-white/20">
         <div className="flex gap-12 animate-marquee whitespace-nowrap justify-center text-sm tracking-widest uppercase">
            <span>Free Local Delivery Available</span>
            <span>•</span>
             {business.mapLink ? (
               <a href={business.mapLink} target="_blank" rel="noreferrer" className="hover:underline">Visit Us At {business.address}</a>
             ) : (
               <span>Visit Us At {business.address}</span>
             )}
            <span>•</span>
            <span>{business.averageRating?.toFixed(1) || '0.0'} Star Rating</span>
            <span className="md:hidden">•</span>
            <span className="hidden md:inline">Latest Collections In-Store</span>
         </div>
      </div>

      <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-16 md:py-24">
        
        {!business.isClaimed && (
          <div className="mb-12">
             <ClaimButton listingId={business.id} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          {/* Main Editorial Content */}
          <div className="lg:col-span-8 flex flex-col gap-20">
            
            {/* The Brand Story */}
            <div className="text-center max-w-3xl mx-auto flex flex-col gap-6">
              <h2 className="font-serif text-3xl md:text-4xl uppercase tracking-widest">The Brand</h2>
              <div className="w-12 h-[1px] bg-black mx-auto"></div>
              <ServicesTags servicesRaw={business.services} />
              <DescriptionSection 
                businessName={business.name}
                categoryName={business.category?.name}
                islandName={business.island?.name}
                descriptionRaw={business.description}
              />
            </div>

            {/* Collection / Products */}
            {business.products && business.products.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-12">
                  <h2 className="font-serif text-3xl uppercase tracking-widest">Collections</h2>
                  <a href="#shop" className="text-sm uppercase tracking-widest border-b border-black pb-1 hover:text-gray-500 transition-colors">View All</a>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
                  {business.products.map((product: any) => (
                    <div key={product.id} className="group cursor-pointer">
                      <div className="aspect-[3/4] w-full overflow-hidden bg-gray-100 mb-6">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
                        )}
                      </div>
                      <div className="text-center">
                        <h3 className="font-medium text-lg uppercase tracking-wider mb-2">{product.name}</h3>
                        <p className="text-gray-550 text-sm font-light mb-3 line-clamp-2 px-4">{product.description}</p>
                        {product.price && (
                          <div className="font-serif text-lg">฿{product.price.toLocaleString()}</div>
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
            <div className="border-t border-black/10 pt-20">
              <UnifiedReviewsSection business={business} />
            </div>
          </div>

          {/* Boutique Info Sidebar */}
          <div className="lg:col-span-4" id="shop">
            <div className="sticky top-24 border border-black/10 p-8 md:p-10 z-10 bg-white">
              <h3 className="font-serif text-2xl uppercase tracking-widest mb-8 text-center">Boutique Info</h3>
              
              <div className="space-y-8 text-sm tracking-wide font-light">
                {business.address && (
                  <div>
                    <div className="uppercase font-bold mb-2">Visit Us</div>
                    {business.mapLink ? (
                      <a href={business.mapLink} target="_blank" rel="noreferrer" className="leading-loose text-gray-600 hover:text-black transition-colors hover:underline block">
                        {business.address}
                      </a>
                    ) : (
                      <div className="leading-loose text-gray-600">{business.address}</div>
                    )}
                  </div>
                )}
                
                {business.phone && (
                  <div>
                    <div className="uppercase font-bold mb-2">Contact</div>
                    <a href={`tel:${business.phone}`} className="leading-loose text-gray-600 hover:text-black transition-colors block">{business.phone}</a>
                  </div>
                )}
                
                {business.website && (
                  <div>
                    <div className="uppercase font-bold mb-2">Website</div>
                    <a href={business.website} target="_blank" rel="noreferrer" className="leading-loose text-gray-600 hover:text-black transition-colors block truncate max-w-full">{business.website}</a>
                  </div>
                )}
              </div>

              <div className="mt-12 pt-12 border-t border-black/10">
                <h4 className="uppercase font-bold text-sm tracking-widest mb-6 text-center">Inquire</h4>
                <MessageForm receiverId={business.userId} listingId={business.id} />
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
