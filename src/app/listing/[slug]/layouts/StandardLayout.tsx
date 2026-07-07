/* eslint-disable @next/next/no-img-element */
import { Card } from '@/components/ui/Card';
import { MessageForm } from "@/components/features/MessageForm";
import { ReviewForm } from '@/components/features/ReviewForm';
import { ClaimButton } from '@/components/features/ClaimButton';
import { ReviewWidget } from '@/components/features/ReviewWidget';
import { parseDescriptionAndReviews } from '@/lib/parseDescription';
import { getUnifiedReviews, getConsolidatedRating } from '@/lib/rating';
import ProductGrid from '../components/ProductGrid';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Utility for safe JSON parse
const safeParse = (str: string | null | undefined, fallback: any = []) => {
  if (!str) return fallback;
  try {
    return JSON.parse(str);
  } catch (e) {
    return fallback;
  }
};

export default function StandardLayout({ business, faqs = [] }: { business: any, faqs?: any[] }) {
  const services = safeParse(business.services, []);
  const gallery = safeParse(business.galleryImages, []);
  const hours = safeParse(business.hours, []);

  const { description: parsedDescription, reviews: scrapedReviews } = parseDescriptionAndReviews(
    business.description, 
    business.name, 
    business.category?.name, 
    business.island?.name
  );

  // Use up to 3 images for a beautiful hero grid if available
  const heroImages = gallery.length >= 3 
    ? gallery.slice(0, 3) 
    : [business.image || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2000&auto=format&fit=crop'];

  return (
    <article className="relative pb-24 lg:pb-0" itemScope itemType="https://schema.org/LocalBusiness">
      
      {/* Visual Breadcrumb Navigation for SEO */}
      <nav aria-label="Breadcrumb" className="bg-surface border-b border-outline-variant py-3 px-4 md:px-6">
        <ol className="max-w-container-max mx-auto flex flex-wrap items-center gap-2 text-sm text-on-surface-variant font-medium">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          </li>
          <li><span className="text-outline">/</span></li>
          {business.island.slug !== 'samui' && business.island.slug !== 'phangan' && business.island.slug !== 'tao' && (
            <>
              <li>
                <Link href={`/samui`} className="hover:text-primary transition-colors">Koh Samui</Link>
              </li>
              <li><span className="text-outline">/</span></li>
            </>
          )}
          <li>
            <Link href={`/${business.island.slug}`} className="hover:text-primary transition-colors">{business.island.name}</Link>
          </li>
          <li><span className="text-outline">/</span></li>
          <li>
            <Link href={`/?category=${business.category.slug}`} className="hover:text-primary transition-colors">{business.category.name}</Link>
          </li>
          <li><span className="text-outline">/</span></li>
          <li className="text-on-surface truncate" aria-current="page">{business.name}</li>
        </ol>
      </nav>

      {/* Dynamic Hero Section - UI/UX Designer Z-Pattern Start */}
      <header className="relative w-full overflow-hidden">
        {heroImages.length >= 3 ? (
          <div className="grid grid-cols-4 grid-rows-2 h-[50vh] md:h-[60vh] gap-1">
            <div className="col-span-4 md:col-span-2 row-span-2 relative">
              <img className="w-full h-full object-cover" src={heroImages[0]} alt={business.name} itemProp="image" />
              <div className="absolute inset-0 hero-gradient opacity-60"></div>
            </div>
            <div className="hidden md:block col-span-2 row-span-1 relative">
              <img className="w-full h-full object-cover" src={heroImages[1]} alt={business.name} />
              <div className="absolute inset-0 bg-black/20"></div>
            </div>
            <div className="hidden md:block col-span-2 row-span-1 relative">
              <img className="w-full h-full object-cover" src={heroImages[2]} alt={business.name} />
              <div className="absolute inset-0 bg-black/20"></div>
            </div>
          </div>
        ) : (
          <div className="w-full h-[50vh] md:h-[60vh] relative">
            <img className="w-full h-full object-cover" src={heroImages[0]} alt={business.name} itemProp="image" />
            <div className="absolute inset-0 hero-gradient"></div>
          </div>
        )}
        
        {/* Overlay Content */}
        <div className="absolute inset-0 flex items-end pointer-events-none">
          <div className="max-w-container-max mx-auto w-full px-4 md:px-6 pb-8 md:pb-12 pointer-events-auto">
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-primary text-on-primary px-3 py-1 rounded-full text-xs font-bold uppercase shadow-md">
                  {business.category?.name || 'Local Business'}
                </span>
                {business.priceLevel && (
                  <span className="bg-surface/90 text-on-surface px-3 py-1 rounded-full text-xs font-bold shadow-md" itemProp="priceRange">
                    {business.priceLevel}
                  </span>
                )}
              </div>
              <h1 className="font-display text-4xl md:text-6xl text-white mb-2 drop-shadow-lg font-bold flex items-center gap-3" itemProp="name">
                {business.name}
                {business.isClaimed && (
                  <span className="inline-flex items-center justify-center bg-secondary text-on-secondary rounded-full p-1.5 shadow-md" title="Verified Business">
                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                  </span>
                )}
              </h1>
              
              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-4 text-white">
                {(() => {
                  const consolidated = getConsolidatedRating(business);
                  if (consolidated.reviewCount === 0) return null;
                  return (
                    <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md" itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating">
                      <meta itemProp="ratingValue" content={consolidated.rating.toString()} />
                      <meta itemProp="reviewCount" content={consolidated.reviewCount.toString()} />
                      <span className="text-amber-400 text-lg">★</span>
                      <span className="font-bold text-white">{consolidated.rating.toFixed(1)}</span>
                      <span className="text-white/80 text-sm">
                        ({consolidated.reviewCount} reviews {consolidated.googleCount > 0 || consolidated.localCount > 0 ? `• ${consolidated.googleCount} Google, ${consolidated.localCount} Site` : ''})
                      </span>
                    </div>
                  );
                })()}
                {business.address && (
                  <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md text-sm" itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                    <span>📍</span> 
                    <span itemProp="streetAddress">{business.address.substring(0, 40)}{business.address.length > 40 ? '...' : ''}</span>
                    <meta itemProp="addressLocality" content={business.island.name} />
                    <meta itemProp="addressCountry" content="TH" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid Content */}
      <div className="max-w-container-max mx-auto px-4 md:px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative">
        
        {/* Main Column */}
        <div className="lg:col-span-8 flex flex-col gap-10">
          
          {/* Services Quick-Glance */}
          {services.length > 0 && (
            <section className="flex flex-wrap gap-2" aria-label="Services Offered">
              {services.map((service: string, idx: number) => (
                <span key={idx} className="bg-surface-container text-on-surface-variant px-4 py-2 rounded-xl text-sm font-medium border border-outline-variant">
                  {service}
                </span>
              ))}
            </section>
          )}

          {/* About */}
          <section className="flex flex-col gap-4" id="about">
            <h2 className="text-2xl font-bold text-on-surface">About {business.name}</h2>
            <div className="prose prose-lg max-w-none text-on-surface-variant leading-relaxed bg-surface p-6 rounded-2xl border border-outline-variant shadow-sm prose-headings:text-on-surface prose-a:text-primary hover:prose-a:text-primary-hover prose-strong:text-on-surface" itemProp="description">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {parsedDescription}
              </ReactMarkdown>
            </div>
          </section>

          {/* Top Scraped Reviews Widget */}
          <ReviewWidget reviews={scrapedReviews} />

          {/* Hours Box */}
          {hours.length > 0 && (
            <section className="flex flex-col gap-4" aria-labelledby="hours-heading">
              <h2 id="hours-heading" className="text-2xl font-bold text-on-surface">Opening Hours</h2>
              <div className="bg-surface p-6 rounded-2xl border border-outline-variant grid gap-2">
                {hours.map((hour: string, idx: number) => (
                  <div key={idx} className="flex justify-between text-on-surface-variant py-1 border-b border-outline-variant/50 last:border-0">
                    <span className="font-medium">{hour.split(': ')[0] || hour}</span>
                    <span>{hour.split(': ')[1] || ''}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Location & Map */}
          {((business.lat && business.lng) || business.address) && (
            <section className="flex flex-col gap-4" aria-labelledby="location-heading">
              <h2 id="location-heading" className="text-2xl font-bold text-on-surface">Location</h2>
              <div className="bg-surface rounded-2xl border border-outline-variant overflow-hidden flex flex-col shadow-sm">
                <div className="p-4 md:p-6 border-b border-outline-variant/30 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-surface-container-lowest">
                  <div className="flex flex-col gap-1">
                    <div className="font-bold text-on-surface flex items-center gap-2">
                      <span className="text-xl">📍</span> {business.name}
                    </div>
                    {business.address && (
                      <div className="text-on-surface-variant text-sm pl-7 leading-relaxed">
                        {business.address}
                      </div>
                    )}
                  </div>
                  {business.mapLink && (
                    <a 
                      href={business.mapLink} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="whitespace-nowrap bg-primary-container text-on-primary-container px-5 py-2.5 rounded-xl font-bold text-sm hover:brightness-95 transition flex items-center gap-2 shadow-sm"
                    >
                      Open in Google Maps
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </a>
                  )}
                </div>
                <div className="w-full h-[300px] md:h-[400px] bg-surface-container-highest relative">
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={`https://maps.google.com/maps?q=${business.lat && business.lng ? `${business.lat},${business.lng}` : encodeURIComponent(`${business.name} ${business.address || ''}`)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                    allowFullScreen
                    aria-hidden="false"
                    tabIndex={0}
                    title={`Map showing location of ${business.name}`}
                  ></iframe>
                </div>
              </div>
            </section>
          )}

          {/* Gallery Grid */}
          {gallery.length > 0 && (
            <section className="flex flex-col gap-4" aria-labelledby="gallery-heading">
              <h2 id="gallery-heading" className="text-2xl font-bold text-on-surface">Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {gallery.map((img: string, idx: number) => (
                  <div key={idx} className="aspect-square rounded-xl overflow-hidden border border-outline-variant bg-surface-container-highest">
                    <img src={img} alt={`${business.name} - Gallery image ${idx + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Products & Services */}
          {business.products && business.products.length > 0 && (
            <ProductGrid products={business.products} />
          )}

          {/* Reviews */}
          <section className="flex flex-col gap-4" aria-labelledby="reviews-heading">
            <h2 id="reviews-heading" className="text-2xl font-bold text-on-surface">Customer Reviews</h2>
            <Card className="p-6 md:p-8 rounded-2xl shadow-sm border-outline-variant">
              <ReviewForm listingId={business.id} />
              <div className="flex flex-col gap-6 mt-8">
                {(() => {
                  const allReviews = getUnifiedReviews(business);
                  const consolidated = getConsolidatedRating(business);
                  const googleCount = consolidated.googleCount;

                  if (allReviews.length === 0) {
                    return (
                      <div className="text-on-surface-variant italic p-4 text-center">
                        No reviews yet. Be the first to share your experience!
                      </div>
                    );
                  }
                  return (
                    <>
                      <div className="flex flex-col gap-6">
                        {allReviews.map((review: any) => (
                          <div 
                            key={review.id} 
                            className={`p-5 border rounded-2xl transition-all hover:shadow-md bg-surface-container-lowest ${
                              review.source === 'Google' 
                                ? 'border-blue-100 border-l-4 border-l-blue-500 pl-4 bg-gradient-to-r from-blue-50/20 to-transparent' 
                                : 'border-outline-variant'
                            }`}
                            itemProp="review" 
                            itemScope 
                            itemType="https://schema.org/Review"
                          >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-primary/20 text-primary rounded-full flex items-center justify-center font-bold overflow-hidden border border-outline-variant/30">
                                  {review.authorImage ? (
                                    <img src={review.authorImage} alt={review.authorName} className="w-full h-full object-cover" />
                                  ) : (
                                    (review.authorName || 'U').charAt(0).toUpperCase()
                                  )}
                                </div>
                                <div className="flex-1" itemProp="author" itemScope itemType="https://schema.org/Person">
                                  <div className="font-bold text-on-surface flex flex-wrap items-center gap-2" itemProp="name">
                                    {review.source === 'Site' && review.userId ? (
                                      <Link href={`/user/${review.userId}`} className="hover:text-primary transition-colors hover:underline">
                                        {review.authorName}
                                      </Link>
                                    ) : (
                                      review.authorName
                                    )}
                                    {review.source === 'Google' && (
                                      <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-blue-200">
                                        <span className="text-[10px]">🌐</span> Google Review
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xs text-on-surface-variant flex items-center gap-2">
                                    <span>{review.createdAt}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="text-amber-500 font-bold tracking-widest" itemProp="reviewRating" itemScope itemType="https://schema.org/Rating">
                                  {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                </div>
                              </div>
                            </div>
                            <p className="m-0 leading-relaxed text-on-surface-variant italic font-light pl-1" itemProp="reviewBody">
                              "{review.comment}"
                            </p>
                          </div>
                        ))}
                      </div>
                      
                      {googleCount > 0 && business.mapLink && (
                        <div className="mt-8 pt-6 border-t border-outline-variant/40 flex justify-center">
                          <a 
                            href={business.mapLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 px-6 py-3.5 bg-surface-container-low border border-outline-variant hover:bg-surface-container-medium hover:border-primary/30 text-primary hover:text-primary font-semibold rounded-2xl shadow-sm transition-all text-sm group"
                          >
                            <svg className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.555 0-6.445-2.89-6.445-6.445s2.89-6.445 6.445-6.445c1.614 0 3.084.593 4.225 1.574l3.19-3.19C19.29 2.015 15.938 1 12.24 1 5.922 1 12.24s4.922 11.24 11.24 11.24c6.643 0 11.24-4.667 11.24-11.24 0-.75-.084-1.477-.24-2.215H12.24z"/>
                            </svg>
                            <span>Read all {googleCount} Google reviews</span>
                            <span className="group-hover:translate-x-1.5 transition-transform">→</span>
                          </a>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            </Card>
          </section>

          {/* FAQ Section */}
          {faqs.length > 0 && (
            <section className="flex flex-col gap-4 mt-4" aria-labelledby="faq-heading">
              <h2 id="faq-heading" className="text-2xl font-bold text-on-surface">Frequently Asked Questions</h2>
              <div className="flex flex-col gap-4">
                {faqs.map((faq, idx) => (
                  <details key={idx} className="bg-surface p-5 rounded-2xl border border-outline-variant group cursor-pointer transition-all">
                    <summary className="font-bold text-lg text-on-surface outline-none list-none flex justify-between items-center">
                      {faq.name}
                      <span className="text-primary group-open:rotate-45 transition-transform text-2xl leading-none">+</span>
                    </summary>
                    <p className="mt-4 text-on-surface-variant leading-relaxed border-t border-outline-variant/30 pt-4">
                      {faq.acceptedAnswer.text}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar & Desktop Action Bar */}
        <aside className="hidden lg:block lg:col-span-4 relative">
          <div className="sticky top-24 flex flex-col gap-6">
            
            {/* CTA Widget */}
            <div className="bg-primary text-on-primary rounded-2xl p-6 shadow-xl flex flex-col gap-4">
              <h3 className="font-bold text-xl mb-2">Interested?</h3>
              {business.phone && (
                <a href={`tel:${business.phone}`} itemProp="telephone" className="w-full bg-white text-primary text-center py-3 rounded-xl font-bold hover:bg-white/90 transition shadow-sm">
                  📞 Call {business.phone}
                </a>
              )}
              {business.mapLink && (
                <a href={business.mapLink} target="_blank" rel="noreferrer" className="w-full bg-primary-container text-on-primary-container text-center py-3 rounded-xl font-bold hover:brightness-95 transition shadow-sm">
                  📍 Get Directions
                </a>
              )}
              {business.website && (
                <a href={business.website} itemProp="url" target="_blank" rel="noreferrer" className="w-full border-2 border-white/30 text-white text-center py-3 rounded-xl font-bold hover:bg-white/10 transition">
                  🌐 Visit Website
                </a>
              )}
            </div>

            {/* Message Form */}
            <div className="bg-surface border border-outline-variant rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-xl mb-4 text-on-surface">Send a Message</h3>
              <MessageForm receiverId={business.userId} listingId={business.id} />
            </div>

            {!business.isClaimed && (
              <ClaimButton listingId={business.id} />
            )}
          </div>
        </aside>
      </div>
      
    </article>
  );
}
