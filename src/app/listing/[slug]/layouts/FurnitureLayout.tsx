/* eslint-disable @next/next/no-img-element */
import { Card } from '@/components/ui/Card';
import { MessageForm } from "@/components/features/MessageForm";
import { ReviewForm } from '@/components/features/ReviewForm';
import { ClaimButton } from '@/components/features/ClaimButton';

export default function FurnitureLayout({ business }: { business: any }) {
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
          <div className="flex items-center gap-3">
             <span className="text-gray-900">Contact:</span> {business.phone}
          </div>
          <div className="flex items-center gap-3">
             <span className="text-gray-900">Rating:</span> {business.averageRating} ★ ({business.reviewCount})
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
        <div className="max-w-4xl mx-auto text-center mb-24">
          <h2 className="font-serif text-3xl md:text-4xl text-gray-900 mb-8">The Studio</h2>
          <p className="font-light text-lg md:text-xl leading-loose text-gray-600 whitespace-pre-line">
            {business.description}
          </p>
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

        {/* Two Column Section: Reviews & Contact */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start" id="showroom">
          
          {/* Reviews Side */}
          <div>
            <h2 className="font-serif text-3xl text-gray-900 mb-10">Client Experiences</h2>
            
            <div className="space-y-10 mb-12">
              {business.reviews && business.reviews.length > 0 ? (
                business.reviews.map((review: any) => (
                  <div key={review.id} className="border-l border-gray-200 pl-8 py-2">
                    <div className="flex gap-1 text-gray-900 mb-4 text-lg">
                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </div>
                    <p className="text-xl font-serif text-gray-600 italic leading-relaxed mb-4">"{review.comment}"</p>
                    <div className="text-sm font-bold tracking-widest text-gray-900 uppercase">
                      — {review.user?.name || 'Anonymous'}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic font-serif text-lg">No experiences shared yet.</p>
              )}
            </div>
            
            <div className="bg-white p-8 border border-gray-200">
              <h3 className="text-sm font-bold tracking-widest uppercase mb-6 text-gray-900">Share Your Experience</h3>
              <ReviewForm listingId={business.id} />
            </div>
          </div>

          {/* Contact Side */}
          <div className="bg-gray-900 text-white p-10 md:p-16">
            <h2 className="font-serif text-3xl mb-12">Design Consultation</h2>
            
            <div className="space-y-8 text-sm tracking-widest uppercase font-light text-gray-400 mb-16">
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
               <div>
                 <div className="text-white mb-2 font-medium">Opening Hours</div>
                 <div className="leading-relaxed">{business.hours || 'By Appointment Only'}</div>
               </div>
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
