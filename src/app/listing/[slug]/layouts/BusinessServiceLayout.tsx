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

export default function BusinessServiceLayout({ business, faqs = [] }: { business: any, faqs?: any[] }) {
  return (
    <div className="bg-[#f8f9fa] min-h-screen text-[#212529] font-sans">
      {/* Professional Hero Section */}
      <section className="bg-white border-b border-[#dee2e6] pt-24 pb-16 md:pt-32 md:pb-20">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-[#e9ecef] text-[#495057] px-3 py-1 rounded text-xs font-bold tracking-widest uppercase">
                Business Services
              </span>
              <span className="text-[#0d6efd] font-bold text-sm flex items-center gap-1">
                <span>📍</span> {business.island.name}
              </span>
            </div>
            
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-[#212529] mb-6 leading-tight">
              {business.name}
            </h1>
            
            <p className="font-body-lg text-lg md:text-xl text-[#6c757d] mb-8 leading-relaxed max-w-lg">
              Professional solutions to help your business grow and thrive in {business.island.name}.
            </p>
            
            <div className="flex flex-wrap items-center gap-6">
              <a href="#contact" className="px-6 py-3 bg-[#0d6efd] text-white rounded font-medium hover:bg-[#0b5ed7] transition-colors shadow-sm">
                Request Consultation
              </a>
              <div className="flex items-center gap-2 text-[#495057]">
                <span className="text-[#ffc107] text-xl">★</span>
                <span className="font-bold">{business.averageRating?.toFixed(1) || '0.0'}</span>
                <span className="text-[#adb5bd]">({business.reviewCount || 0} Reviews)</span>
              </div>
            </div>
          </div>
          
          {business.image && (
            <div className="relative">
               <div className="absolute inset-0 bg-[#0d6efd] transform translate-x-4 translate-y-4 rounded-lg -z-10"></div>
               <img src={business.image} alt={business.name} className="w-full h-auto aspect-video object-cover rounded-lg shadow-md border border-[#dee2e6]" fetchPriority="high" />
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-[1200px] mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {!business.isClaimed && (
          <div className="lg:col-span-12">
             <ClaimButton listingId={business.id} />
          </div>
        )}

        <div className="lg:col-span-8 flex flex-col gap-16">
          
          {/* Company Overview */}
          <div>
            <h2 className="text-3xl font-bold text-[#212529] mb-6 border-b border-[#dee2e6] pb-4">Company Overview</h2>
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

          {/* Core Services */}
          {business.products && business.products.length > 0 && (
            <div>
              <h2 className="text-3xl font-bold text-[#212529] mb-8 border-b border-[#dee2e6] pb-4">Core Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {business.products.map((service: any) => (
                  <div key={service.id} className="bg-white p-6 rounded-lg border border-[#dee2e6] shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-[#e9ecef] text-[#0d6efd] rounded flex items-center justify-center text-2xl mb-4">
                      💼
                    </div>
                    <h3 className="text-xl font-bold text-[#212529] mb-3">{service.name}</h3>
                    <p className="text-[#6c757d] mb-4 text-sm leading-relaxed min-h-[3rem]">
                      {service.description}
                    </p>
                    {service.price && (
                      <div className="text-[#0d6efd] font-bold">
                        Consultation from ฿{service.price.toLocaleString()}
                      </div>
                    )}
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

          {/* Client References / Reviews */}
          <div>
            <UnifiedReviewsSection business={business} />
          </div>
        </div>

        {/* Contact Information */}
        <div className="lg:col-span-4" id="contact">
          <div className="bg-white border border-[#dee2e6] rounded-lg shadow-sm sticky top-24 z-10">
            <div className="p-6 border-b border-[#dee2e6] bg-[#f8f9fa] rounded-t-lg">
              <h3 className="text-xl font-bold text-[#212529]">Contact Information</h3>
            </div>
            
            <div className="p-6 space-y-6">
              {business.address && (
                <div className="flex items-start gap-4 text-[#495057]">
                   <div className="text-[#0d6efd] mt-1">📍</div>
                    <div>
                      <div className="text-sm font-bold text-[#212529] mb-1">Office Address</div>
                      {business.mapLink ? (
                        <a href={business.mapLink} target="_blank" rel="noreferrer" className="hover:underline text-[#0d6efd] transition-colors">
                          {business.address}
                        </a>
                      ) : (
                        <div>{business.address}</div>
                      )}
                    </div>
                </div>
              )}
              {business.phone && (
                <div className="flex items-start gap-4 text-[#495057]">
                   <div className="text-[#0d6efd] mt-1">📞</div>
                   <div>
                     <div className="text-sm font-bold text-[#212529] mb-1">Phone Number</div>
                     <a href={`tel:${business.phone}`} className="hover:underline">{business.phone}</a>
                   </div>
                </div>
              )}
              {business.website && (
                <div className="flex items-start gap-4 text-[#495057]">
                   <div className="text-[#0d6efd] mt-1">🌐</div>
                   <div>
                     <div className="text-sm font-bold text-[#212529] mb-1">Website</div>
                     <a href={business.website} target="_blank" rel="noreferrer" className="hover:underline block truncate max-w-[200px]">{business.website}</a>
                   </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-[#dee2e6] bg-[#f8f9fa] rounded-b-lg">
              <h4 className="font-bold text-[#212529] mb-4">Send an Inquiry</h4>
              <div className="business-dark-form">
                <MessageForm receiverId={business.userId} listingId={business.id} />
              </div>
              <style dangerouslySetInnerHTML={{__html: `
                .business-dark-form input, .business-dark-form textarea {
                  background: #fff;
                  border: 1px solid #dee2e6;
                }
                .business-dark-form button {
                  background: #0d6efd;
                  color: white;
                  border-radius: 4px;
                }
                .business-dark-form button:hover {
                  background: #0b5ed7;
                }
              `}} />
            </div>
          </div>
        </div>

      </section>
    </div>
  );
}
