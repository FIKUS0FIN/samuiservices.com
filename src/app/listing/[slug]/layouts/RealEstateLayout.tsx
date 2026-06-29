/* eslint-disable @next/next/no-img-element */
import { Card } from '@/components/ui/Card';
import { MessageForm } from "@/components/features/MessageForm";
import { ReviewForm } from '@/components/features/ReviewForm';
import { ClaimButton } from '@/components/features/ClaimButton';

export default function RealEstateLayout({ business }: { business: any }) {
  return (
    <>
      {/* Real Estate Hero Section - Taller with prominent contact */}
      <section className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden">
        <img className="w-full h-full object-cover" src={business.image || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2000&auto=format&fit=crop'} alt={business.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/80 to-transparent"></div>
        
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-container-max mx-auto w-full px-4 md:px-6 pb-12 md:pb-16 flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="flex flex-col gap-3 max-w-3xl">
              <div className="flex items-center gap-2">
                <div className="bg-primary text-on-primary px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                  <span className="text-xs uppercase tracking-wider font-bold">
                    Real Estate Agency
                  </span>
                </div>
              </div>
              <h1 className="font-display text-4xl md:text-6xl text-on-surface mb-1 drop-shadow-sm">
                {business.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-on-surface-variant">
                <div className="flex items-center gap-1.5">
                  <span className="text-primary font-bold">★ {business.averageRating}</span>
                  <span className="font-label-md">({business.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1.5 border-l border-outline-variant pl-4">
                  <span className="font-body-md">📍 {business.address}, {business.island.name}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-lg border border-outline-variant min-w-[320px]">
              <h3 className="font-headline-sm mb-4">Contact Agent</h3>
              <div className="font-body-lg font-bold mb-4 flex items-center gap-2">
                <span className="text-primary">📞</span> {business.phone}
              </div>
              <MessageForm receiverId={business.userId} listingId={business.id} />
            </div>
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
        <div className="lg:col-span-12 flex flex-col gap-16">
          
          <div className="flex flex-col md:flex-row gap-12" id="about">
            <div className="flex-1">
              <h2 className="font-headline-lg text-3xl text-on-surface border-b border-outline-variant pb-4 mb-6">About the Agency</h2>
              <p className="font-body-lg text-lg text-on-surface-variant leading-relaxed whitespace-pre-line">
                {business.description}
              </p>
            </div>
          </div>

          {/* Featured Properties Showcase */}
          {business.products && business.products.length > 0 && (
            <div>
              <h2 className="font-headline-lg text-3xl text-on-surface border-b border-outline-variant pb-4 mb-8">Featured Properties</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {business.products.map((property: any) => (
                  <Card key={property.id} className="overflow-hidden hover:-translate-y-1 transition-transform duration-300">
                    <div className="aspect-[4/3] w-full bg-surface-container-high relative">
                      {property.image ? (
                        <img src={property.image} alt={property.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-on-surface-variant text-4xl">
                          🏠
                        </div>
                      )}
                      <div className="absolute top-3 right-3 bg-surface text-on-surface px-3 py-1 rounded-full font-bold shadow-md">
                        {property.price ? `฿${property.price.toLocaleString()}` : 'Contact for price'}
                      </div>
                    </div>
                    <div className="p-5 flex flex-col gap-3">
                      <h3 className="font-headline-sm text-xl line-clamp-1">{property.name}</h3>
                      <p className="font-body-md text-on-surface-variant line-clamp-2">
                        {property.description || 'View details for more information.'}
                      </p>
                      <button className="mt-2 w-full py-2 bg-secondary/10 text-secondary hover:bg-secondary/20 rounded-lg font-label-md font-bold transition-colors">
                        View Details
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Reviews Section */}
          <div className="max-w-4xl mx-auto w-full">
            <Card className="p-8">
              <h2 className="font-headline-sm text-2xl mb-6">Client Reviews</h2>
              <ReviewForm listingId={business.id} />

              <div className="flex flex-col gap-6 mt-8">
                {business.reviews && business.reviews.length > 0 ? (
                  business.reviews.map((review: any) => (
                    <div key={review.id} className="p-6 border border-outline-variant rounded-xl bg-surface-container-lowest">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full overflow-hidden shrink-0 flex items-center justify-center text-primary font-bold text-xl">
                          {review.user?.image ? (
                            <img src={review.user.image} alt={review.user.name || 'User'} className="w-full h-full object-cover" />
                          ) : (
                            (review.user?.name || 'U').charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-bold font-body-lg">{review.user?.name || 'Anonymous User'}</div>
                          <div className="text-sm text-on-surface-variant">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-primary font-bold text-lg">
                          {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                        </div>
                      </div>
                      <p className="font-body-lg text-on-surface-variant leading-relaxed">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-on-surface-variant italic bg-surface-container-low p-8 rounded-xl text-center">
                    No reviews yet. Be the first to review this agency!
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
