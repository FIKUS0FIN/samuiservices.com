/* eslint-disable @next/next/no-img-element */
import { Card } from '@/components/ui/Card';
import { MessageForm } from "@/components/features/MessageForm";
import { ReviewForm } from '@/components/features/ReviewForm';
import { ClaimButton } from '@/components/features/ClaimButton';

export default function HomeGardenLayout({ business }: { business: any }) {
  return (
    <>
      {/* Home & Garden Hero - Earthy and fresh */}
      <section className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
        <img className="w-full h-full object-cover" src={business.image || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2000&auto=format&fit=crop'} alt={business.name} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2c4c3b]/90 via-[#2c4c3b]/70 to-transparent"></div>
        
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-container-max mx-auto w-full px-4 md:px-6">
            <div className="max-w-2xl">
              <div className="inline-block bg-[#e8f3ec] text-[#2c4c3b] font-bold px-3 py-1 rounded text-sm uppercase tracking-wider mb-6">
                Home & Garden Services
              </div>
              <h1 className="font-display text-5xl md:text-7xl text-white mb-6 font-bold leading-tight drop-shadow-md">
                {business.name}
              </h1>
              <p className="font-body-lg text-[#e8f3ec] text-xl mb-8 leading-relaxed max-w-xl">
                Bringing life to your spaces. Professional landscaping and home care in {business.island.name}.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#services" className="px-6 py-3 bg-[#a3c9a8] text-[#1b3025] font-bold rounded-sm hover:bg-[#8eb893] transition-colors">
                  Explore Services
                </a>
                <a href="#contact" className="px-6 py-3 bg-transparent border-2 border-[#a3c9a8] text-[#a3c9a8] font-bold rounded-sm hover:bg-[#a3c9a8]/10 transition-colors">
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-container-max mx-auto px-4 md:px-6 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {!business.isClaimed && (
          <div className="lg:col-span-12">
             <ClaimButton listingId={business.id} />
          </div>
        )}

        <div className="lg:col-span-8 flex flex-col gap-16">
          
          <div className="prose prose-lg prose-green max-w-none">
             <h2 className="font-display text-3xl font-bold text-[#2c4c3b] mb-4">About Our Approach</h2>
             <p className="font-body-lg text-on-surface-variant leading-relaxed whitespace-pre-line text-lg">
               {business.description}
             </p>
          </div>

          {/* Services & Packages */}
          {business.products && business.products.length > 0 && (
            <div id="services">
              <h2 className="font-display text-3xl font-bold text-[#2c4c3b] mb-8">Our Services</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {business.products.map((service: any) => (
                  <div key={service.id} className="bg-surface border border-[#e8f3ec] shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
                    {service.image && (
                      <div className="h-48 overflow-hidden">
                        <img src={service.image} alt={service.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="font-headline-sm text-xl font-bold text-[#2c4c3b] mb-2">{service.name}</h3>
                      <p className="text-on-surface-variant mb-4 line-clamp-3 text-sm">
                        {service.description}
                      </p>
                      {service.price && (
                        <div className="font-bold text-[#2c4c3b] mt-auto">
                          From ฿{service.price.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          <div className="bg-[#f9fbf9] p-8 md:p-10 border border-[#e8f3ec]">
             <h2 className="font-display text-3xl font-bold text-[#2c4c3b] mb-6">What Our Clients Say</h2>
             <ReviewForm listingId={business.id} />
             
             <div className="mt-10 space-y-6">
                {business.reviews && business.reviews.length > 0 ? (
                  business.reviews.map((review: any) => (
                    <div key={review.id} className="bg-white p-6 border border-[#e8f3ec] shadow-sm flex gap-4">
                       <div className="w-12 h-12 bg-[#e8f3ec] text-[#2c4c3b] rounded-full flex items-center justify-center font-bold text-xl shrink-0">
                          {review.user?.image ? (
                            <img src={review.user.image} alt={review.user.name || 'User'} className="w-full h-full object-cover rounded-full" />
                          ) : (
                            (review.user?.name || 'C').charAt(0).toUpperCase()
                          )}
                       </div>
                       <div>
                         <div className="flex items-center gap-2 mb-1">
                           <span className="font-bold text-[#2c4c3b]">{review.user?.name || 'Client'}</span>
                           <span className="text-sm text-on-surface-variant">• {new Date(review.createdAt).toLocaleDateString()}</span>
                         </div>
                         <div className="text-[#a3c9a8] mb-2 text-sm tracking-widest">
                           {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                         </div>
                         <p className="text-on-surface-variant leading-relaxed">
                           "{review.comment}"
                         </p>
                       </div>
                    </div>
                  ))
                ) : (
                  <p className="text-on-surface-variant italic">No reviews yet.</p>
                )}
             </div>
          </div>

        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4" id="contact">
          <div className="bg-[#2c4c3b] text-white p-8 sticky top-24 shadow-xl">
             <h3 className="font-display text-2xl font-bold mb-6 text-[#a3c9a8]">Get in Touch</h3>
             
             <div className="space-y-6 mb-8 text-[#e8f3ec]">
                <div className="flex items-start gap-4">
                   <div className="text-[#a3c9a8] mt-1">🌿</div>
                   <div>
                     <div className="text-sm uppercase tracking-wider opacity-80 mb-1">Service Area</div>
                     <div className="font-medium text-lg">{business.address}</div>
                   </div>
                </div>
                <div className="flex items-start gap-4">
                   <div className="text-[#a3c9a8] mt-1">📞</div>
                   <div>
                     <div className="text-sm uppercase tracking-wider opacity-80 mb-1">Phone</div>
                     <div className="font-medium text-lg">{business.phone}</div>
                   </div>
                </div>
             </div>

             <div className="bg-white text-on-surface p-6">
                <h4 className="font-bold text-[#2c4c3b] mb-4">Send a Message</h4>
                <MessageForm receiverId={business.userId} listingId={business.id} />
             </div>
          </div>
        </div>

      </section>
    </>
  );
}
