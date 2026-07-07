/* eslint-disable @next/next/no-img-element */
import { Card } from '@/components/ui/Card';
import { MessageForm } from "@/components/features/MessageForm";
import { ReviewForm } from '@/components/features/ReviewForm';
import { ClaimButton } from '@/components/features/ClaimButton';

export default function ToursLayout({ business }: { business: any }) {
  return (
    <>
      {/* Tours Hero - Immersive & Adventurous */}
      <section className="relative w-full h-[85vh] overflow-hidden">
        <img className="w-full h-full object-cover" src={business.image || 'https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?q=80&w=2000&auto=format&fit=crop'} alt={business.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10"></div>
        
        <div className="absolute inset-0 flex flex-col justify-end pb-24 md:pb-32">
          <div className="max-w-container-max mx-auto w-full px-4 md:px-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-[#ff6b6b] text-white px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase shadow-lg">
                Tour Provider
              </span>
              <span className="text-white font-bold bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-sm">
                📍 {business.island.name}
              </span>
            </div>
            
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white mb-6 font-black drop-shadow-xl tracking-tight leading-none max-w-4xl">
              {business.name}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-white/90 text-lg md:text-xl">
              <div className="flex items-center gap-2">
                <span className="text-[#fca311] text-2xl">★</span>
                <span className="font-bold text-white">{business.averageRating}</span>
                <span className="text-white/70">({business.reviewCount} reviews)</span>
              </div>
              <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-white/50"></div>
              {business.mapLink ? (
                <a href={business.mapLink} target="_blank" rel="noreferrer" className="font-medium hover:underline hover:text-primary transition-colors">
                  {business.address}
                </a>
              ) : (
                <div className="font-medium">{business.address}</div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Booking Bar (Sticky) */}
      <div className="bg-surface sticky top-16 md:top-20 z-40 border-b border-outline-variant shadow-sm hidden md:block">
         <div className="max-w-container-max mx-auto px-6 py-4 flex justify-between items-center">
            <div className="font-bold text-lg">{business.name}</div>
            <a href="#book" className="bg-[#ff6b6b] text-white px-8 py-3 rounded-full font-bold shadow-md hover:bg-[#ff5252] transition-colors">
              Book Your Adventure
            </a>
         </div>
      </div>

      <section className="max-w-container-max mx-auto px-4 md:px-8 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {!business.isClaimed && (
          <div className="lg:col-span-12">
             <ClaimButton listingId={business.id} />
          </div>
        )}

        <div className="lg:col-span-8 flex flex-col gap-16">
          
          <div className="prose prose-lg max-w-none">
            <h2 className="font-display text-4xl mb-6 font-bold text-on-surface">Experience the Extraordinary</h2>
            <p className="font-body-lg text-on-surface-variant leading-relaxed whitespace-pre-line text-xl">
              {business.description}
            </p>
          </div>

          {/* Tours / Packages */}
          {business.products && business.products.length > 0 && (
            <div>
              <h2 className="font-display text-4xl mb-8 font-bold text-on-surface">Available Tours</h2>
              <div className="flex flex-col gap-8">
                {business.products.map((tour: any) => (
                  <div key={tour.id} className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm border border-outline-variant flex flex-col md:flex-row group hover:shadow-xl transition-shadow">
                    {tour.image && (
                      <div className="md:w-5/12 h-64 md:h-auto relative overflow-hidden">
                        <img src={tour.image} alt={tour.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-on-surface font-bold px-3 py-1 rounded-lg text-sm shadow-sm">
                          Best Seller
                        </div>
                      </div>
                    )}
                    <div className="p-8 md:w-7/12 flex flex-col">
                      <h3 className="font-headline-md text-2xl font-bold mb-3">{tour.name}</h3>
                      <p className="text-on-surface-variant mb-6 line-clamp-3 text-lg">{tour.description}</p>
                      
                      <div className="mt-auto flex items-center justify-between pt-6 border-t border-outline-variant">
                        {tour.price ? (
                          <div>
                            <div className="text-sm text-on-surface-variant uppercase tracking-wider font-bold mb-1">From</div>
                            <div className="font-display text-3xl font-bold text-primary">฿{tour.price.toLocaleString()}</div>
                          </div>
                        ) : (
                          <div className="font-bold text-on-surface-variant uppercase tracking-wider">Contact for Price</div>
                        )}
                        <a href="#book" className="px-6 py-3 bg-secondary-container text-on-secondary-container rounded-xl font-bold hover:bg-secondary-container/80 transition-colors">
                          Inquire
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews List */}
          <div>
            <div className="flex items-end justify-between mb-8">
              <h2 className="font-display text-4xl font-bold text-on-surface">Traveler Reviews</h2>
              <div className="text-2xl font-bold flex items-center gap-2">
                <span className="text-[#fca311]">★</span> {business.averageRating}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {business.reviews && business.reviews.length > 0 ? (
                business.reviews.map((review: any) => (
                  <div key={review.id} className="bg-surface-container-low p-8 rounded-3xl border border-outline-variant">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 bg-tertiary/20 rounded-full flex items-center justify-center text-tertiary font-bold text-xl overflow-hidden shrink-0">
                        {review.user?.image ? (
                           <img src={review.user.image} alt="User" className="w-full h-full object-cover" />
                        ) : (
                           (review.user?.name || 'T').charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-lg">{review.user?.name || 'Traveler'}</div>
                        <div className="text-[#fca311] text-sm tracking-widest mt-1">
                          {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                        </div>
                      </div>
                    </div>
                    <p className="text-on-surface-variant italic leading-relaxed text-lg">"{review.comment}"</p>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-on-surface-variant text-lg">No reviews yet.</div>
              )}
            </div>

            <Card className="p-8 bg-surface-container-highest border-none shadow-inner">
               <h3 className="font-bold text-xl mb-4">Write a Review</h3>
               <ReviewForm listingId={business.id} />
            </Card>
          </div>
        </div>

        {/* Booking/Contact Sidebar */}
        <div className="lg:col-span-4" id="book">
          <div className="bg-white rounded-3xl shadow-xl border border-outline-variant p-8 sticky top-32">
            <h3 className="font-display text-3xl font-bold mb-2">Book Your Trip</h3>
            <p className="text-on-surface-variant mb-8">Send a message to our guides to secure your spot or ask questions.</p>
            
            <div className="mb-8 space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-outline-variant">
                <span className="font-bold text-on-surface-variant">Phone</span>
                <span className="font-medium text-lg">{business.phone}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-outline-variant">
                <span className="font-bold text-on-surface-variant">Location</span>
                {business.mapLink ? (
                  <a href={business.mapLink} target="_blank" rel="noreferrer" className="font-medium text-lg text-right hover:underline hover:text-primary transition-colors">
                    {business.address}
                  </a>
                ) : (
                  <span className="font-medium text-lg text-right">{business.address}</span>
                )}
              </div>
            </div>

            <div className="bg-surface-container-low p-6 rounded-2xl">
              <MessageForm receiverId={business.userId} listingId={business.id} />
            </div>
            
            <div className="mt-6 flex items-start gap-3 text-sm text-on-surface-variant">
              <span className="text-xl">🛡️</span>
              <p>Secure inquiry directly with the tour provider. No booking fees.</p>
            </div>
          </div>
        </div>

      </section>
    </>
  );
}
