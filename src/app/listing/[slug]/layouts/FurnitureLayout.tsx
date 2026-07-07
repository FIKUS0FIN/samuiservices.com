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

export default function FurnitureLayout({ business, faqs = [] }: { business: any, faqs?: any[] }) {
  return (
    <div className="bg-[#faf9f8] min-h-screen font-sans">
      {/* Furniture Hero - Minimalist & Spacious */}
      <section className="relative w-full h-[75vh] bg-[#ebe7e0]">
        {business.image ? (
          <img className="w-full h-full object-cover mix-blend-multiply opacity-80" src={business.image} alt={business.name} />
        ) : (
          <img className="w-full h-full object-cover mix-blend-multiply opacity-80" src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2000&auto=format&fit=crop" alt="Furniture Showroom" />
        )}
        
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <div className="bg-white/90 backdrop-blur-md p-10 md:p-16 text-center max-w-2xl w-full border border-gray-100 shadow-xl">
             <div className="text-gray-500 uppercase tracking-[0.2em] text-xs font-bold mb-6">
                Furniture & Interior Design
             </div>
             <h1 className="font-serif text-5xl md:text-6xl text-gray-900 mb-6 tracking-wide">
                {business.name}
             </h1>
             <div className="flex items-center justify-center gap-6 text-sm text-gray-600 tracking-widest uppercase mb-8">
               <span>{business.island.name}</span>
               <span>•</span>
               <span>Est. {new Date().getFullYear()}</span>
             </div>
             <a href="#showroom" className="inline-block bg-gray-900 text-white px-8 py-4 text-sm tracking-widest uppercase hover:bg-gray-800 transition-colors">
                Visit Showroom
              </a>
          </div>
        </div>
      </section>

      {/* Info Strip */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-6 text-sm tracking-widest text-gray-500 uppercase">
          {business.address && (
            <div className="flex items-center gap-3">
               <span className="text-gray-900">Address:</span>
               {business.mapLink ? (
                 <a href={business.mapLink} target="_blank" rel="noreferrer" className="hover:underline text-gray-900">
                   {business.address}
                 </a>
               ) : (
                 business.address
               )}
            </div>
          )}
          {business.phone && (
            <div className="flex items-center gap-3">
               <span className="text-gray-900">Contact:</span> <a href={`tel:${business.phone}`} className="hover:text-primary transition-colors">{business.phone}</a>
            </div>
          )}
          <div className="flex items-center gap-3">
             <span className="text-gray-900">Rating:</span> {business.averageRating?.toFixed(1) || '0.0'} ★ ({business.reviewCount || 0})
          </div>
        </div>
      </div>

      <section className="max-w-[1600px] mx-auto px-4 md:px-12 py-20">
        
        {!business.isClaimed && (
          <div className="mb-16 max-w-4xl mx-auto">
             <ClaimButton listingId={business.id} />
          </div>
        )}

        {/* Studio Info */}
        <div className="max-w-4xl mx-auto text-center mb-24 flex flex-col gap-6">
          <h2 className="font-serif text-3xl md:text-4xl text-gray-900">The Studio</h2>
          <ServicesTags servicesRaw={business.services} />
          <DescriptionSection 
            businessName={business.name}
            categoryName={business.category?.name}
            islandName={business.island?.name}
            descriptionRaw={business.description}
          />
        </div>

        {/* Collections */}
        {business.products && business.products.length > 0 && (
          <div className="mb-32">
            <h2 className="font-serif text-3xl md:text-4xl text-gray-900 mb-12 text-center">Selected Pieces</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
              {business.products.map((item: any) => (
                <div key={item.id} className="group">
                  <div className="aspect-[4/5] bg-gray-100 overflow-hidden mb-6 relative">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">Image Unavailable</div>
                    )}
                    {item.price && (
                      <div className="absolute bottom-0 left-0 bg-white px-4 py-2 text-sm font-medium tracking-wider">
                        ฿{item.price.toLocaleString()}
                      </div>
                    )}
                  </div>
                  <h3 className="font-medium text-lg text-gray-900 tracking-wide mb-2">{item.name}</h3>
                  <p className="text-gray-500 font-light leading-relaxed line-clamp-2">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Opening Hours & Gallery & Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-32 items-start">
          <OpeningHoursWidget hoursRaw={business.hours} />
          <InteractiveMap 
            businessName={business.name}
            address={business.address}
            lat={business.lat}
            lng={business.lng}
            mapLink={business.mapLink}
          />
        </div>

        <div className="mb-32">
          <GalleryGrid businessName={business.name} galleryRaw={business.galleryImages} />
        </div>

        {/* Two Column Section: Reviews & Contact */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start" id="showroom">
          
          {/* Reviews Side */}
          <div>
            <UnifiedReviewsSection business={business} />
          </div>

          {/* Contact Side */}
          <div className="bg-gray-900 text-white p-10 md:p-16">
            <h2 className="font-serif text-3xl mb-12">Design Consultation</h2>
            
            <div className="space-y-8 text-sm tracking-widest uppercase font-light text-gray-400 mb-16">
               {business.address && (
                 <div>
                   <div className="text-white mb-2 font-medium">Showroom Location</div>
                   {business.mapLink ? (
                      <a href={business.mapLink} target="_blank" rel="noreferrer" className="leading-relaxed hover:underline text-white block">
                        {business.address}
                      </a>
                    ) : (
                      <div className="leading-relaxed">{business.address}</div>
                    )}
                 </div>
               )}
               {business.phone && (
                 <div>
                   <div className="text-white mb-2 font-medium">Call Us</div>
                   <a href={`tel:${business.phone}`} className="leading-relaxed text-white block hover:underline">{business.phone}</a>
                 </div>
               )}
               {business.website && (
                 <div>
                   <div className="text-white mb-2 font-medium">Website</div>
                   <a href={business.website} target="_blank" rel="noreferrer" className="leading-relaxed text-white block hover:underline truncate max-w-full">{business.website}</a>
                 </div>
               )}
            </div>

            <div>
              <h3 className="text-sm font-medium tracking-widest uppercase mb-6 text-white">Send Inquiry</h3>
              <div className="furniture-dark-form">
                <MessageForm receiverId={business.userId} listingId={business.id} />
              </div>
              <style dangerouslySetInnerHTML={{__html: `
                .furniture-dark-form input, .furniture-dark-form textarea {
                  background: rgba(255,255,255,0.05);
                  border: 1px solid rgba(255,255,255,0.1);
                  color: white;
                }
                .furniture-dark-form label {
                  color: rgba(255,255,255,0.7);
                }
                .furniture-dark-form button {
                  background: white;
                  color: black;
                }
              `}} />
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
