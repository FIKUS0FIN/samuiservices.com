/* eslint-disable @next/next/no-img-element */
import { Card } from '@/components/ui/Card';
import { MessageForm } from "@/components/features/MessageForm";
import { ReviewForm } from '@/components/features/ReviewForm';
import { ClaimButton } from '@/components/features/ClaimButton';

export default function TransportationLayout({ business }: { business: any }) {
  return (
    <>
      {/* Transportation Hero Section - Fast and bold */}
      <section className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden bg-surface-container-highest">
        <img className="w-full h-full object-cover opacity-60 mix-blend-overlay" src={business.image || 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2000&auto=format&fit=crop'} alt={business.name} />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-surface/90 backdrop-blur-md p-8 md:p-12 rounded-3xl text-center max-w-3xl mx-4 border border-outline-variant shadow-2xl">
            <div className="bg-tertiary text-on-tertiary px-4 py-1.5 rounded-full inline-flex items-center gap-2 mb-6 font-bold tracking-wide text-sm">
              🚐 Transportation & Delivery
            </div>
            <h1 className="font-display text-4xl md:text-5xl text-on-surface mb-4 font-black">
              {business.name}
            </h1>
            <p className="font-body-lg text-on-surface-variant mb-8 line-clamp-2">
              Serving {business.island.name} and surrounding areas. Fast, reliable, and secure.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href={`tel:${business.phone}`} className="px-8 py-3 bg-primary text-on-primary rounded-full font-bold shadow-md hover:bg-primary/90 transition-colors">
                Call Now
              </a>
              <a href="#book" className="px-8 py-3 bg-secondary-container text-on-secondary-container rounded-full font-bold shadow-sm hover:bg-secondary-container/90 transition-colors">
                Request Quote
              </a>
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
        <div className="lg:col-span-8 flex flex-col gap-12">
          
          <div className="flex flex-col gap-6" id="about">
            <h2 className="font-headline-lg text-3xl text-on-surface border-b border-outline-variant pb-4">Service Details</h2>
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <p className="font-body-lg text-on-surface-variant leading-relaxed whitespace-pre-line">
                  {business.description}
                </p>
              </div>
              <div className="bg-surface-container-low p-6 rounded-xl min-w-[250px]">
                <h4 className="font-bold text-on-surface mb-4">Quick Info</h4>
                <ul className="space-y-3 font-body-md text-on-surface-variant">
                  <li className="flex gap-2">
                    <span>📍</span>
                    <span>
                      Base:{" "}
                      {business.mapLink ? (
                        <a href={business.mapLink} target="_blank" rel="noreferrer" className="hover:underline text-primary transition-colors">
                          {business.address}
                        </a>
                      ) : (
                        business.address
                      )}
                    </span>
                  </li>
                  <li className="flex gap-2"><span>⭐</span> {business.averageRating} Rating ({business.reviewCount} verified)</li>
                  <li className="flex gap-2"><span>🕒</span> {business.hours || '24/7 Available'}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Vehicle Fleet / Services Showcase */}
          {business.products && business.products.length > 0 && (
            <div>
              <h2 className="font-headline-lg text-3xl text-on-surface border-b border-outline-variant pb-4 mb-6">Our Fleet & Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {business.products.map((service: any) => (
                  <div key={service.id} className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-sm hover:shadow-md transition-shadow">
                    {service.image && (
                      <div className="md:w-1/3 h-48 md:h-auto bg-surface-container-high">
                        <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="p-6 flex-1 flex flex-col justify-center">
                      <h3 className="font-headline-sm text-xl mb-2">{service.name}</h3>
                      <p className="font-body-md text-on-surface-variant mb-4 flex-1">
                        {service.description || 'Reliable transportation service.'}
                      </p>
                      <div className="font-bold text-primary text-lg">
                        {service.price ? `From ฿${service.price.toLocaleString()}` : 'Custom Quote'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews Section */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
            <ReviewForm listingId={business.id} />
            <div className="flex flex-col gap-4 mt-8">
              {business.reviews && business.reviews.length > 0 ? (
                business.reviews.map((review: any) => (
                  <div key={review.id} className="p-5 border-b border-outline-variant last:border-0 flex gap-4">
                    <div className="w-10 h-10 bg-tertiary-container rounded-full overflow-hidden shrink-0 flex items-center justify-center text-on-tertiary-container font-bold">
                      {review.user?.image ? (
                        <img src={review.user.image} alt="User" className="w-full h-full object-cover" />
                      ) : (
                        (review.user?.name || 'U').charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold">{review.user?.name || 'Customer'}</span>
                        <span className="text-primary text-sm font-bold">
                          {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                        </span>
                      </div>
                      <p className="text-on-surface-variant">{review.comment}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-on-surface-variant italic py-4">No reviews yet.</div>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar Request Quote Form */}
        <div className="lg:col-span-4" id="book">
          <div className="bg-primary-container text-on-primary-container rounded-3xl p-8 sticky top-24 shadow-lg">
            <h3 className="font-headline-md text-2xl mb-2">Request a Vehicle</h3>
            <p className="font-body-md mb-6 opacity-90">Send a direct message to {business.name} to arrange your transport.</p>
            <div className="bg-surface rounded-2xl p-6 shadow-sm">
              <MessageForm receiverId={business.userId} listingId={business.id} />
            </div>
          </div>
        </div>

      </section>
    </>
  );
}
