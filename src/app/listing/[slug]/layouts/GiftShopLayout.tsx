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

export default function GiftShopLayout({ business, faqs = [] }: { business: any, faqs?: any[] }) {
  return (
    <div className="bg-[#fff9f5] min-h-screen text-[#4a3b32]">
      {/* Gift Shop Hero - Cozy & Welcoming */}
      <section className="relative w-full py-16 md:py-24 px-4 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#ffd6c4] rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#ffe8d6] rounded-full blur-3xl opacity-50 translate-y-1/3 -translate-x-1/4"></div>
        
        <div className="max-w-container-max mx-auto flex flex-col md:flex-row gap-8 items-center relative z-10">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-block border border-[#d4bcae] text-[#8c7462] px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6 bg-white/50 backdrop-blur-sm">
              Gift & Souvenir Shop
            </div>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl mb-6 font-bold text-[#3d2f26]">
              {business.name}
            </h1>
            <p className="font-body-lg text-lg md:text-xl text-[#6b584a] mb-8 max-w-xl mx-auto md:mx-0 leading-relaxed">
              Find the perfect keepsake from {business.island.name}.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-4">
              <span className="text-[#e07a5f] font-bold text-lg">★ {business.averageRating?.toFixed(1) || '0.0'}</span>
              <span className="text-[#8c7462]">({business.reviewCount || 0} Reviews)</span>
              <span className="text-[#d4bcae]">|</span>
              <span className="text-[#8c7462]">📍 {business.island.name}</span>
            </div>
          </div>
          
          {business.image && (
            <div className="w-full md:w-5/12">
               <div className="aspect-[4/5] rounded-t-full rounded-b-3xl overflow-hidden shadow-xl border-8 border-white transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <img src={business.image} alt={business.name} className="w-full h-full object-cover" fetchPriority="high" />
               </div>
            </div>
          )}
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-container-max mx-auto px-4 md:px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
        
        {!business.isClaimed && (
          <div className="lg:col-span-12">
             <ClaimButton listingId={business.id} />
          </div>
        )}

        <div className="lg:col-span-8 flex flex-col gap-16">
          
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-[#f0e4dc]">
            <h2 className="font-display text-3xl font-bold mb-6 text-[#3d2f26]">Our Story</h2>
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

          {/* Featured Items */}
          {business.products && business.products.length > 0 && (
            <div>
              <div className="flex items-center gap-4 mb-8">
                <h2 className="font-display text-3xl font-bold text-[#3d2f26]">Treasures & Gifts</h2>
                <div className="h-px bg-[#f0e4dc] flex-1"></div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {business.products.map((item: any) => (
                  <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm border border-[#f0e4dc] hover:shadow-md transition-shadow group">
                    <div className="aspect-square w-full rounded-xl overflow-hidden bg-[#fff9f5] mb-4 relative">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">🎁</div>
                      )}
                      {item.price && (
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur text-[#e07a5f] font-bold px-2 py-1 rounded-lg text-sm shadow-sm">
                          ฿{item.price.toLocaleString()}
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-[#3d2f26] mb-1 truncate">{item.name}</h3>
                    <p className="text-sm text-[#8c7462] line-clamp-2">{item.description}</p>
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

          {/* Reviews */}
          <div>
            <UnifiedReviewsSection business={business} />
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4">
          <div className="bg-[#e07a5f] text-white rounded-3xl p-8 sticky top-24 shadow-lg overflow-hidden relative z-10">
            <div className="absolute -right-10 -bottom-10 text-[150px] opacity-10 pointer-events-none">🛍️</div>
            
            <h3 className="font-display text-3xl font-bold mb-8">Visit the Shop</h3>
            
            <div className="space-y-6 mb-10">
              {business.address && (
                <div>
                  <div className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">Location</div>
                  {business.mapLink ? (
                    <a href={business.mapLink} target="_blank" rel="noreferrer" className="font-medium text-lg hover:underline text-white block">
                      {business.address}
                    </a>
                  ) : (
                    <div className="font-medium text-lg">{business.address}</div>
                  )}
                </div>
              )}
              {business.phone && (
                <div>
                  <div className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">Phone</div>
                  <a href={`tel:${business.phone}`} className="font-medium text-lg text-white block hover:underline">{business.phone}</a>
                </div>
              )}
              {business.website && (
                <div>
                  <div className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">Website</div>
                  <a href={business.website} target="_blank" rel="noreferrer" className="font-medium text-lg text-white block hover:underline truncate max-w-full">{business.website}</a>
                </div>
              )}
            </div>

            <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/20">
               <h4 className="font-bold mb-4 text-white">Ask a question</h4>
               <div className="gift-shop-dark-form">
                 <MessageForm receiverId={business.userId} listingId={business.id} />
               </div>
               <style dangerouslySetInnerHTML={{__html: `
                 .gift-shop-dark-form input, .gift-shop-dark-form textarea {
                   background: rgba(255, 255, 255, 0.1);
                   border: 1px solid rgba(255, 255, 255, 0.2);
                   color: white;
                 }
                 .gift-shop-dark-form label {
                   color: rgba(255, 255, 255, 0.8);
                 }
                 .gift-shop-dark-form button {
                   background: white;
                   color: #e07a5f;
                 }
               `}} />
            </div>
          </div>
        </div>

      </section>
    </div>
  );
}
