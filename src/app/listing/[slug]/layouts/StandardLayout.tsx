/* eslint-disable @next/next/no-img-element */
import { Card } from '@/components/ui/Card';
import { MessageForm } from "@/components/features/MessageForm";
import { ReviewForm } from '@/components/features/ReviewForm';
import { ClaimButton } from '@/components/features/ClaimButton';
import ProductGrid from '../components/ProductGrid';

export default function StandardLayout({ business }: { business: any }) {
  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
        <img className="w-full h-full object-cover" src={business.image || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2000&auto=format&fit=crop'} alt={business.name} />
        <div className="absolute inset-0 hero-gradient"></div>
        
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-container-max mx-auto w-full px-4 md:px-6 pb-12 md:pb-20">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="bg-secondary text-on-secondary px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                  <span className="text-xs uppercase tracking-wider font-bold">
                    {business.category.name}
                  </span>
                </div>
              </div>
              <h1 className="font-display text-4xl md:text-6xl text-white mb-1 drop-shadow-md">
                {business.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-white/90">
                <div className="flex items-center gap-1.5">
                  <span className="text-tertiary-fixed-dim font-bold">★ {business.averageRating}</span>
                  <span className="font-label-md">({business.reviewCount} verified reviews)</span>
                </div>
                <div className="flex items-center gap-1.5 border-l border-white/20 pl-4">
                  <span className="font-body-md">📍 {business.address}, {business.island.name}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content & Booking Grid */}
      <section className="max-w-container-max mx-auto px-4 md:px-6 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {!business.isClaimed && (
          <div className="lg:col-span-12">
             <ClaimButton listingId={business.id} />
          </div>
        )}

        {/* Main Content Area */}
        <div className="lg:col-span-8 flex flex-col gap-12">
          
          <div className="flex flex-col gap-6" id="about">
            <h2 className="font-headline-lg text-3xl text-on-surface border-b border-outline-variant pb-4">About Us</h2>
            <p className="font-body-lg text-lg text-on-surface-variant leading-relaxed whitespace-pre-line">
              {business.description}
            </p>
          </div>

          {/* Products & Services Showcase */}
          {business.products && business.products.length > 0 && (
            <ProductGrid products={business.products} />
          )}

          {/* Reviews Section */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-text-main">Reviews</h2>
            <ReviewForm listingId={business.id} />

            <div className="flex flex-col gap-6 mt-8">
              {business.reviews && business.reviews.length > 0 ? (
                business.reviews.map((review: any) => (
                  <div key={review.id} className="p-6 border border-outline-muted rounded-md bg-surface">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 bg-outline-muted rounded-full overflow-hidden shrink-0">
                        {review.user?.image ? (
                          <img src={review.user.image} alt={review.user.name || 'User'} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-text-muted font-bold">
                            {(review.user?.name || 'U').charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-text-main">{review.user?.name || 'Anonymous User'}</div>
                        <div className="text-sm text-text-muted">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-amber-500 font-bold text-lg">
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                      </div>
                    </div>
                    <p className="m-0 leading-relaxed text-text-main">{review.comment}</p>
                  </div>
                ))
              ) : (
                <div className="text-text-muted italic bg-surface p-6 rounded-md text-center">
                  No reviews yet. Be the first to review this business!
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Sticky Sidebar Widget */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 h-max">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-md flex flex-col gap-6">
            <h3 className="font-headline-sm text-2xl text-on-surface border-b border-outline-variant pb-4">Contact Business</h3>

            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  📞
                </div>
                <div>
                  <div className="font-label-md text-sm text-on-surface-variant mb-1">Phone Number</div>
                  <div className="font-body-lg font-bold text-lg text-on-surface">{business.phone}</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                  📍
                </div>
                <div>
                  <div className="font-label-md text-sm text-on-surface-variant mb-1">Location</div>
                  <div className="font-body-md text-on-surface leading-tight">{business.address}</div>
                </div>
              </div>
              <div className="mt-2 pt-6 border-t border-outline-variant">
                 <MessageForm receiverId={business.userId} listingId={business.id} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
