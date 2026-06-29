/* eslint-disable @next/next/no-img-element */
import { Card } from '@/components/ui/Card';
import { MessageForm } from "@/components/features/MessageForm";
import { ReviewForm } from '@/components/features/ReviewForm';
import { ClaimButton } from '@/components/features/ClaimButton';

export default function GiftShopLayout({ business }: { business: any }) {
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
              <span className="text-[#e07a5f] font-bold text-lg">★ {business.averageRating}</span>
              <span className="text-[#8c7462]">({business.reviewCount} Reviews)</span>
              <span className="text-[#d4bcae]">|</span>
              <span className="text-[#8c7462]">📍 {business.address}</span>
            </div>
          </div>
          
          {business.image && (
            <div className="w-full md:w-5/12">
               <div className="aspect-[4/5] rounded-t-full rounded-b-3xl overflow-hidden shadow-xl border-8 border-white transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <img src={business.image} alt={business.name} className="w-full h-full object-cover" />
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
            <p className="font-body-lg text-lg text-[#6b584a] leading-relaxed whitespace-pre-line">
              {business.description}
            </p>
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
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
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

          {/* Reviews */}
          <div>
             <h2 className="font-display text-3xl font-bold mb-8 text-[#3d2f26]">Visitor Guestbook</h2>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {business.reviews && business.reviews.length > 0 ? (
                  business.reviews.map((review: any) => (
                    <div key={review.id} className="bg-[#fffdfb] p-6 rounded-2xl border-2 border-dashed border-[#e6d5c9] relative">
                       <div className="absolute -top-3 -right-3 text-3xl transform rotate-12">📌</div>
                       <div className="text-[#e07a5f] mb-2 tracking-widest text-sm">
                         {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                       </div>
                       <p className="text-[#6b584a] italic mb-4">"{review.comment}"</p>
                       <div className="font-bold text-sm text-[#8c7462]">— {review.user?.name || 'Visitor'}</div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center text-[#8c7462] py-8">No messages in the guestbook yet.</div>
                )}
             </div>

             <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#f0e4dc]">
               <h3 className="font-bold mb-4 text-xl">Leave a message</h3>
               <ReviewForm listingId={business.id} />
             </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4">
          <div className="bg-[#e07a5f] text-white rounded-3xl p-8 sticky top-24 shadow-lg overflow-hidden relative">
            <div className="absolute -right-10 -bottom-10 text-[150px] opacity-10 pointer-events-none">🛍️</div>
            
            <h3 className="font-display text-3xl font-bold mb-8">Visit the Shop</h3>
            
            <div className="space-y-6 mb-10">
              <div>
                <div className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">Location</div>
                <div className="font-medium text-lg">{business.address}</div>
              </div>
              <div>
                <div className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">Hours</div>
                <div className="font-medium text-lg">{business.hours || 'Open Daily'}</div>
              </div>
              <div>
                <div className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">Phone</div>
                <div className="font-medium text-lg">{business.phone}</div>
              </div>
            </div>

            <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/20">
               <h4 className="font-bold mb-4 text-white">Ask a question</h4>
               {/* Note: In a real app we might need a custom styled MessageForm to fit the dark background, but we'll use standard for now */}
               <MessageForm receiverId={business.userId} listingId={business.id} />
            </div>
          </div>
        </div>

      </section>
    </div>
  );
}
