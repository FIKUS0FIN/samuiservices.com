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

export default function ChildrenServicesLayout({ business, faqs = [] }: { business: any, faqs?: any[] }) {
  return (
    <div className="bg-[#fcf8e8] min-h-screen">
      {/* Playful Hero Section */}
      <section className="relative w-full h-[55vh] md:h-[65vh] overflow-hidden rounded-b-[3rem] md:rounded-b-[5rem] shadow-sm">
        <img className="w-full h-full object-cover opacity-90" src={business.image || 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=2000&auto=format&fit=crop'} alt={business.name} fetchPriority="high" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent"></div>
        
        <div className="absolute bottom-0 w-full p-8 md:p-12 text-center text-white">
           <div className="inline-block bg-tertiary-container text-on-tertiary-container font-bold px-4 py-2 rounded-full mb-4 shadow-md rotate-[-2deg]">
             🎈 Fun & Safe for Kids!
           </div>
           <h1 className="font-display text-5xl md:text-7xl font-black mb-2 drop-shadow-lg" style={{ textShadow: '2px 4px 0px rgba(0,0,0,0.2)' }}>
             {business.name}
           </h1>
           <div className="font-bold text-xl flex justify-center items-center gap-2 drop-shadow-md">
             <span>📍 {business.island.name}</span>
             <span>•</span>
             <span>⭐ {business.averageRating?.toFixed(1) || '0.0'} Rating</span>
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
        <div className="lg:col-span-8 flex flex-col gap-10">
          
          <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border-2 border-primary/20 relative" id="about">
            <div className="absolute -top-6 -left-4 text-6xl">✨</div>
            <h2 className="font-display text-3xl md:text-4xl text-primary font-bold mb-6">About Us</h2>
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

          {/* Activities & Programs */}
          {business.products && business.products.length > 0 && (
            <div>
              <h2 className="font-display text-3xl md:text-4xl text-secondary font-bold mb-8 pl-4 border-l-8 border-secondary rounded-l-sm">Our Programs & Activities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {business.products.map((item: any, i: number) => {
                  const colors = ['border-primary', 'border-secondary', 'border-tertiary', 'border-[#ffb74d]'];
                  const colorClass = colors[i % colors.length];
                  
                  return (
                    <div key={item.id} className={`bg-white rounded-3xl overflow-hidden shadow-sm border-4 ${colorClass} hover:shadow-md transition-shadow relative top-0 hover:-top-1`}>
                      {item.image && (
                        <div className="h-48 w-full">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                        </div>
                      )}
                      <div className="p-6">
                        <h3 className="font-display text-2xl font-bold mb-2">{item.name}</h3>
                        <p className="text-on-surface-variant mb-4 text-sm">{item.description}</p>
                        {item.price && (
                          <div className="inline-block bg-surface-container text-on-surface font-bold px-4 py-2 rounded-full text-sm">
                            ฿{item.price.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
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

          {/* Parent Reviews */}
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border-2 border-tertiary/20">
            <UnifiedReviewsSection business={business} />
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="bg-primary-container text-on-primary-container p-8 rounded-[2rem] shadow-sm transform rotate-1 hover:rotate-0 transition-transform z-10">
            <h3 className="font-display text-2xl font-bold mb-6">Contact & Location</h3>
            <div className="space-y-6">
              {business.address && (
                <div className="flex gap-4">
                  <div className="text-2xl text-primary">📍</div>
                  <div>
                    <div className="font-bold mb-1 opacity-80 text-sm uppercase">Where to find us</div>
                    {business.mapLink ? (
                      <a href={business.mapLink} target="_blank" rel="noreferrer" className="font-medium text-lg hover:underline transition-colors">
                        {business.address}
                      </a>
                    ) : (
                      <div className="font-medium text-lg">{business.address}</div>
                    )}
                  </div>
                </div>
              )}
              {business.phone && (
                <div className="flex gap-4">
                  <div className="text-2xl text-secondary">📞</div>
                  <div>
                    <div className="font-bold mb-1 opacity-80 text-sm uppercase">Call us</div>
                    <a href={`tel:${business.phone}`} className="font-medium text-lg hover:underline">{business.phone}</a>
                  </div>
                </div>
              )}
              {business.website && (
                <div className="flex gap-4">
                  <div className="text-2xl text-tertiary">🌐</div>
                  <div>
                    <div className="font-bold mb-1 opacity-80 text-sm uppercase">Website</div>
                    <a href={business.website} target="_blank" rel="noreferrer" className="font-medium text-lg hover:underline truncate block max-w-[200px]">{business.website}</a>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] shadow-sm border-2 border-outline-variant">
            <h3 className="font-display text-2xl font-bold mb-4">Send a Message</h3>
            <div className="children-dark-form">
              <MessageForm receiverId={business.userId} listingId={business.id} />
            </div>
            <style dangerouslySetInnerHTML={{__html: `
              .children-dark-form input, .children-dark-form textarea {
                background: #fcf8e8;
                border: 2px border-primary/20;
              }
              .children-dark-form button {
                background: var(--md-sys-color-primary);
                color: white;
              }
            `}} />
          </div>
        </div>

      </section>
    </div>
  );
}
