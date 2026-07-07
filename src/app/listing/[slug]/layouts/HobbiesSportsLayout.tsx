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

export default function HobbiesSportsLayout({ business, faqs = [] }: { business: any, faqs?: any[] }) {
  return (
    <div className="bg-[#111] min-h-screen text-gray-300 font-sans">
      {/* Sports Hero - Dynamic & Energetic */}
      <section className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden bg-black">
        <img className="w-full h-full object-cover opacity-60 scale-105" src={business.image || 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2000&auto=format&fit=crop'} alt={business.name} fetchPriority="high" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/50 to-transparent"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] mix-blend-overlay"></div>
        
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-container-max mx-auto w-full px-6">
            <div className="max-w-3xl transform -skew-x-6">
              <div className="inline-block bg-[#e5ff00] text-black px-4 py-1 text-sm font-black tracking-widest uppercase mb-6 shadow-[4px_4px_0px_#fff]">
                Hobbies & Sports
              </div>
              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white mb-6 font-black uppercase italic leading-none tracking-tight">
                {business.name}
              </h1>
              <p className="font-body-lg text-gray-300 text-xl md:text-2xl mb-8 skew-x-6 max-w-2xl font-bold">
                Level up your game in {business.island.name}.
              </p>
              <div className="flex flex-wrap gap-4 skew-x-6">
                <a href="#activities" className="px-8 py-4 bg-white text-black font-black uppercase tracking-widest hover:bg-gray-200 transition-colors shadow-[4px_4px_0px_#e5ff00]">
                  View Activities
                </a>
                {business.phone && (
                  <a href={`tel:${business.phone}`} className="px-8 py-4 border-2 border-white text-white font-black uppercase tracking-widest hover:bg-white/10 transition-colors">
                    Call Now
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="border-y border-gray-800 bg-black">
        <div className="max-w-container-max mx-auto px-6 py-6 flex flex-wrap justify-between items-center gap-6 font-black uppercase tracking-widest text-sm text-gray-500">
           <div className="flex items-center gap-2">
             <span className="text-[#e5ff00] text-xl">★</span> <span className="text-white">{business.averageRating?.toFixed(1) || '0.0'}</span> Rating
           </div>
           <div>
             <span className="text-white">{business.reviewCount || 0}</span> Reviews
           </div>
           <div>
             <span className="text-white">{business.island.name}</span> Location
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
          
          <div>
            <h2 className="text-4xl text-white font-black uppercase italic mb-6 tracking-tight">About Us</h2>
            <div className="flex flex-col gap-6">
              <ServicesTags servicesRaw={business.services} theme="sports" />
              <DescriptionSection 
                businessName={business.name}
                categoryName={business.category?.name}
                islandName={business.island?.name}
                descriptionRaw={business.description}
                theme="sports"
              />
            </div>
          </div>

          {/* Activities / Gear List */}
          {business.products && business.products.length > 0 && (
            <div id="activities">
              <h2 className="text-4xl text-white font-black uppercase italic mb-8 tracking-tight">Activities & Gear</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {business.products.map((item: any) => (
                  <div key={item.id} className="bg-gray-900 border border-gray-805 group hover:border-gray-600 transition-colors overflow-hidden flex flex-col">
                    {item.image && (
                      <div className="h-48 overflow-hidden relative">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 group-hover:grayscale-0 grayscale-[50%] transition-all duration-500" loading="lazy" />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                      </div>
                    )}
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-2xl text-white font-black uppercase italic tracking-tight mb-2">{item.name}</h3>
                      <p className="text-gray-450 mb-6 flex-1">{item.description}</p>
                      {item.price && (
                        <div className="text-[#e5ff00] font-black text-xl">
                          ฿{item.price.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Opening Hours */}
          <OpeningHoursWidget hoursRaw={business.hours} theme="sports" />

          {/* Gallery Grid */}
          <GalleryGrid businessName={business.name} galleryRaw={business.galleryImages} theme="sports" />

          {/* Location Map */}
          <InteractiveMap 
            businessName={business.name}
            address={business.address}
            lat={business.lat}
            lng={business.lng}
            mapLink={business.mapLink}
            theme="sports"
          />

          {/* Reviews */}
          <div className="border-t border-gray-800 pt-16">
             <UnifiedReviewsSection business={business} theme="sports" />
          </div>
        </div>

        {/* Info & Contact Sidebar */}
        <div className="lg:col-span-4">
          <div className="bg-[#e5ff00] text-black p-8 sticky top-24 transform rotate-1 z-10">
             <h3 className="text-3xl font-black uppercase italic tracking-tight mb-8">Basecamp Info</h3>
             
             <div className="space-y-6 mb-8 font-bold">
                {business.address && (
                  <div>
                    <div className="text-black/60 text-xs uppercase tracking-widest mb-1">Location</div>
                    {business.mapLink ? (
                      <a href={business.mapLink} target="_blank" rel="noreferrer" className="text-xl hover:underline text-black block">
                        {business.address}
                      </a>
                    ) : (
                      <div className="text-xl">{business.address}</div>
                    )}
                  </div>
                )}
                {business.phone && (
                  <div>
                    <div className="text-black/60 text-xs uppercase tracking-widest mb-1">Phone</div>
                    <a href={`tel:${business.phone}`} className="text-xl hover:underline text-black block">{business.phone}</a>
                  </div>
                )}
                {business.website && (
                  <div>
                    <div className="text-black/60 text-xs uppercase tracking-widest mb-1">Website</div>
                    <a href={business.website} target="_blank" rel="noreferrer" className="text-xl hover:underline text-black block truncate max-w-[220px]">{business.website}</a>
                  </div>
                )}
             </div>

             <div className="bg-black text-white p-6 transform -rotate-1">
                <h4 className="text-lg font-black uppercase tracking-widest mb-4 text-[#e5ff00]">Send Message</h4>
                <div className="sports-dark-form">
                  <MessageForm receiverId={business.userId} listingId={business.id} />
                </div>
                <style dangerouslySetInnerHTML={{__html: `
                  .sports-dark-form input, .sports-dark-form textarea {
                    background: #111;
                    border: 1px solid #333;
                    color: white;
                    border-radius: 0;
                  }
                  .sports-dark-form input:focus, .sports-dark-form textarea:focus {
                    border-color: #e5ff00;
                  }
                  .sports-dark-form label {
                    color: #888;
                    text-transform: uppercase;
                    font-size: 0.75rem;
                    font-weight: 900;
                    letter-spacing: 0.1em;
                  }
                  .sports-dark-form button {
                    background: #e5ff00;
                    color: black;
                    border-radius: 0;
                    font-weight: 900;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                  }
                `}} />
             </div>
          </div>
        </div>

      </section>
    </div>
  );
}
