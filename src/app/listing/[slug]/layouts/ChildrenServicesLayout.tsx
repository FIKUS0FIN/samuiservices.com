/* eslint-disable @next/next/no-img-element */
import { Card } from '@/components/ui/Card';
import { MessageForm } from "@/components/features/MessageForm";
import { ReviewForm } from '@/components/features/ReviewForm';
import { ClaimButton } from '@/components/features/ClaimButton';

export default function ChildrenServicesLayout({ business }: { business: any }) {
  return (
    <div className="bg-[#fcf8e8] min-h-screen">
      {/* Playful Hero Section */}
      <section className="relative w-full h-[55vh] md:h-[65vh] overflow-hidden rounded-b-[3rem] md:rounded-b-[5rem] shadow-sm">
        <img className="w-full h-full object-cover opacity-90" src={business.image || 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=2000&auto=format&fit=crop'} alt={business.name} />
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
             <span>⭐ {business.averageRating} Rating</span>
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
            <p className="font-body-lg text-lg text-on-surface-variant leading-relaxed whitespace-pre-line">
              {business.description}
            </p>
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
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="p-6">
                        <h3 className="font-display text-2xl font-bold mb-2">{item.name}</h3>
                        <p className="text-on-surface-variant mb-4">{item.description}</p>
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

          {/* Parent Reviews */}
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border-2 border-tertiary/20">
            <h2 className="font-display text-3xl text-tertiary font-bold mb-2">Happy Parents</h2>
            <p className="text-on-surface-variant mb-6">See what other families are saying.</p>
            <ReviewForm listingId={business.id} />

            <div className="flex flex-col gap-4 mt-8">
              {business.reviews && business.reviews.length > 0 ? (
                business.reviews.map((review: any) => (
                  <div key={review.id} className="p-6 bg-surface-container-lowest rounded-2xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-[#ffb74d] rounded-full overflow-hidden flex items-center justify-center text-white font-bold text-xl border-2 border-white shadow-sm">
                        {review.user?.image ? (
                          <img src={review.user.image} alt={review.user.name || 'User'} className="w-full h-full object-cover" />
                        ) : (
                          (review.user?.name || 'P').charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-lg">{review.user?.name || 'Parent'}</div>
                        <div className="text-secondary font-bold text-sm tracking-widest">
                          {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                        </div>
                      </div>
                    </div>
                    <p className="text-on-surface-variant text-lg">"{review.comment}"</p>
                  </div>
                ))
              ) : (
                <div className="text-on-surface-variant text-center py-8">No reviews yet. We'd love to hear from you!</div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="bg-primary-container text-on-primary-container p-8 rounded-[2rem] shadow-sm transform rotate-1 hover:rotate-0 transition-transform">
            <h3 className="font-display text-2xl font-bold mb-6">Contact & Location</h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="text-2xl">📍</div>
                <div>
                  <div className="font-bold mb-1 opacity-80 text-sm uppercase">Where to find us</div>
                  <div className="font-medium text-lg">{business.address}</div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-2xl">📞</div>
                <div>
                  <div className="font-bold mb-1 opacity-80 text-sm uppercase">Call us</div>
                  <div className="font-medium text-lg">{business.phone}</div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-2xl">🕒</div>
                <div>
                  <div className="font-bold mb-1 opacity-80 text-sm uppercase">Open Hours</div>
                  <div className="font-medium text-lg">{business.hours || 'Contact us for hours'}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] shadow-sm border-2 border-outline-variant">
            <h3 className="font-display text-2xl font-bold mb-4">Send a Message</h3>
            <MessageForm receiverId={business.userId} listingId={business.id} />
          </div>
        </div>

      </section>
    </div>
  );
}
