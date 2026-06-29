/* eslint-disable @next/next/no-img-element */
import { Card } from '@/components/ui/Card';
import { MessageForm } from "@/components/features/MessageForm";
import { ReviewForm } from '@/components/features/ReviewForm';
import { ClaimButton } from '@/components/features/ClaimButton';

export default function BeautyHealthLayout({ business }: { business: any }) {
  return (
    <div className="bg-[#faf5f5] min-h-screen text-gray-800 font-sans">
      {/* Beauty & Health Hero - Soft & Calming */}
      <section className="relative w-full h-[65vh] md:h-[75vh] flex flex-col justify-center items-center text-center p-6 md:p-12 overflow-hidden">
        {/* Soft Background Elements */}
        <div className="absolute inset-0 bg-[#f4ecec] -z-20"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#f9dbdd] rounded-full blur-[100px] opacity-60 -z-10 translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#e4e1ea] rounded-full blur-[100px] opacity-60 -z-10 -translate-x-1/3 translate-y-1/3"></div>

        <div className="max-w-3xl mx-auto z-10">
          <div className="inline-block text-[#a08585] text-xs font-bold tracking-[0.2em] uppercase mb-8 border border-[#e4d5d5] px-6 py-2 rounded-full bg-white/50 backdrop-blur-sm">
            Beauty & Health
          </div>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-[#4a3f3f] mb-6 tracking-wide" style={{ lineHeight: '1.1' }}>
            {business.name}
          </h1>
          <div className="flex items-center justify-center gap-6 text-[#a08585] tracking-widest text-sm uppercase">
            <span>📍 {business.island.name}</span>
            <span className="w-1 h-1 rounded-full bg-[#d4c5c5]"></span>
            <span>⭐ {business.averageRating}</span>
          </div>
        </div>
      </section>

      {/* Main Image Banner */}
      {business.image && (
        <div className="max-w-[1200px] mx-auto px-6 -mt-16 relative z-20">
           <div className="aspect-[21/9] w-full rounded-2xl md:rounded-[3rem] overflow-hidden shadow-2xl shadow-[#e0d6d6]/50">
             <img src={business.image} alt={business.name} className="w-full h-full object-cover" />
           </div>
        </div>
      )}

      <section className="max-w-[1200px] mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {!business.isClaimed && (
          <div className="lg:col-span-12 mb-8">
             <ClaimButton listingId={business.id} />
          </div>
        )}

        <div className="lg:col-span-7 flex flex-col gap-24">
          
          <div className="text-center md:text-left">
            <h2 className="font-serif text-4xl text-[#4a3f3f] mb-8">The Experience</h2>
            <p className="font-light text-lg md:text-xl text-[#7a6b6b] leading-relaxed whitespace-pre-line">
              {business.description}
            </p>
          </div>

          {/* Service Menu */}
          {business.products && business.products.length > 0 && (
            <div>
              <h2 className="font-serif text-4xl text-[#4a3f3f] mb-12 text-center md:text-left">Treatment Menu</h2>
              
              <div className="flex flex-col gap-8">
                {business.products.map((service: any) => (
                  <div key={service.id} className="group relative">
                    <div className="flex items-end justify-between border-b border-[#e4d5d5] pb-4 mb-3">
                      <h3 className="font-serif text-2xl text-[#4a3f3f] group-hover:text-[#a08585] transition-colors">{service.name}</h3>
                      <div className="font-serif text-xl text-[#4a3f3f]">
                        {service.price ? `฿${service.price.toLocaleString()}` : 'Price on request'}
                      </div>
                    </div>
                    <div className="flex gap-6 items-start">
                       {service.image && (
                         <img src={service.image} alt={service.name} className="w-24 h-24 object-cover rounded-xl shadow-sm hidden sm:block" />
                       )}
                       <p className="font-light text-[#7a6b6b] text-lg leading-relaxed flex-1">
                         {service.description}
                       </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          <div>
            <h2 className="font-serif text-4xl text-[#4a3f3f] mb-12 text-center md:text-left">Guest Love</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
              {business.reviews && business.reviews.length > 0 ? (
                business.reviews.map((review: any) => (
                  <div key={review.id} className="bg-white p-8 rounded-3xl shadow-sm border border-[#f4ecec]">
                     <div className="text-[#e8b4b8] mb-4 text-xl">
                       {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                     </div>
                     <p className="font-light text-[#7a6b6b] leading-relaxed mb-6 italic">
                       "{review.comment}"
                     </p>
                     <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-[#f9dbdd] rounded-full overflow-hidden text-[#a08585] flex items-center justify-center font-serif text-xl">
                         {review.user?.image ? (
                           <img src={review.user.image} alt="User" className="w-full h-full object-cover" />
                         ) : (
                           (review.user?.name || 'G').charAt(0).toUpperCase()
                         )}
                       </div>
                       <div className="text-sm font-bold tracking-widest uppercase text-[#a08585]">
                         {review.user?.name || 'Guest'}
                       </div>
                     </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-[#a08585] italic">Be the first to share your experience.</div>
              )}
            </div>

            <div className="bg-[#f4ecec] p-8 rounded-3xl">
              <h3 className="font-serif text-2xl mb-6 text-[#4a3f3f]">Leave a Review</h3>
              <ReviewForm listingId={business.id} />
            </div>
          </div>
        </div>

        {/* Sidebar Info & Booking */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-[3rem] p-10 md:p-12 shadow-xl shadow-[#e0d6d6]/40 sticky top-24 border border-[#f4ecec]">
             <h3 className="font-serif text-3xl text-[#4a3f3f] mb-8 text-center">Reserve</h3>
             
             <div className="space-y-6 mb-12 text-center">
                <div>
                  <div className="text-[#a08585] text-xs font-bold tracking-widest uppercase mb-2">Location</div>
                  <div className="text-lg text-[#4a3f3f]">{business.address}</div>
                </div>
                <div>
                  <div className="text-[#a08585] text-xs font-bold tracking-widest uppercase mb-2">Contact</div>
                  <div className="text-lg text-[#4a3f3f]">{business.phone}</div>
                </div>
                <div>
                  <div className="text-[#a08585] text-xs font-bold tracking-widest uppercase mb-2">Hours</div>
                  <div className="text-lg text-[#4a3f3f]">{business.hours || 'By appointment'}</div>
                </div>
             </div>

             <div className="pt-8 border-t border-[#f4ecec]">
               <h4 className="font-serif text-xl text-[#4a3f3f] mb-6 text-center">Send Inquiry</h4>
               <MessageForm receiverId={business.userId} listingId={business.id} />
             </div>
          </div>
        </div>

      </section>
    </div>
  );
}
