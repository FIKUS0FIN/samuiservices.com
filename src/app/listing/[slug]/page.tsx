/* eslint-disable @next/next/no-img-element */
import { notFound } from 'next/navigation';
import { getBusinessBySlug } from '@/lib/db';
import { Card } from '@/components/ui/Card';
import { ReviewForm } from '@/components/features/ReviewForm';
import { ClaimButton } from '@/components/features/ClaimButton';
import { MessageForm } from '@/components/features/MessageForm';
import { BusinessHero } from './components/BusinessHero';
import { BusinessInfo } from './components/BusinessInfo';
import { ContactInfo } from './components/ContactInfo';
import { ReviewsList } from './components/ReviewsList';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);
  if (!business) return { title: 'Not Found' };
  
  return {
    title: `${business.name} | ${business.category.name} in ${business.island.name}`,
    description: business.description,
  };
}

export default async function BusinessDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);
  
  if (!business) {
    notFound();
  }

    // Schema.org JSON-LD for LocalBusiness
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: business.name,
    image: business.image,
    telephone: business.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address,
      addressLocality: business.island.name,
      addressRegion: 'Surat Thani',
      addressCountry: 'TH'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: business.averageRating,
      reviewCount: business.reviewCount
    },
    description: business.description,
    hasOfferCatalog: business.products && business.products.length > 0 ? {
      '@type': 'OfferCatalog',
      name: 'Products & Services',
      itemListElement: business.products.map((product, index) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Product',
          name: product.name,
          description: product.description,
          image: product.image,
        },
        price: product.price,
        priceCurrency: 'THB',
        position: index + 1
      }))
    } : undefined
  };

  return (
    <div>
      {/* Inject JSON-LD into the head for Google and AI agents */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026') }}
      />
      

      {/* Hero Image Banner */}
      <div style={{ width: '100%', height: business.layout === 'premium' ? '500px' : '350px', backgroundImage: `url(${business.image})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15, 23, 42, 0.9) 0%, transparent 100%)' }}></div>
        <div className="container" style={{ position: 'relative', height: '100%', display: 'flex', alignItems: business.layout === 'premium' ? 'center' : 'flex-end', justifyContent: business.layout === 'premium' ? 'center' : 'flex-start', paddingBottom: business.layout === 'premium' ? '0' : '2rem' }}>
           <div style={{ textAlign: business.layout === 'premium' ? 'center' : 'left' }}>
              <div style={{ color: '#60a5fa', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '2px', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                {business.category.name} • {business.island.name}
              </div>
              <h1 style={{ fontSize: business.layout === 'premium' ? '4.5rem' : '3.5rem', color: 'white', marginBottom: '0.5rem', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>{business.name}</h1>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: business.layout === 'premium' ? 'center' : 'flex-start', gap: '1rem', fontSize: '1.25rem', color: 'white', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>★ {business.averageRating}</span>
                <span>({business.reviewCount} verified reviews)</span>
              </div>
           </div>
        </div>
      </div>

      <div className="container section">
        {!business.isClaimed && <ClaimButton listingId={business.id} />}

        <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
            
            {/* Main Content Area */}
            <div style={{ flex: '1 1 600px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <Card>
                <h3 className="text-2xl font-bold mb-4">About this business</h3>
                <p className="text-lg text-muted" style={{ lineHeight: 1.8 }}>
                  {business.description}
                </p>
              </Card>


              {/* Products & Services Showcase */}
              {business.products && business.products.length > 0 && (
                <div style={{ marginTop: '2rem' }}>
                  <h2 className="text-2xl font-bold mb-6" style={{ fontSize: '2rem', marginBottom: '1.5rem', marginTop: '1rem' }}>Products & Services</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                    {business.products.map(product => (
                      <Card key={product.id} style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                        {product.image && (
                          <div style={{ height: '180px', width: '100%', backgroundImage: `url(${product.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                        )}
                        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>{product.name}</h3>
                          {product.price !== null && (
                            <div style={{ color: 'var(--primary-color)', fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '0.75rem' }}>
                              ${product.price}
                            </div>
                          )}
                          {product.description && (
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', flex: 1, marginBottom: 0, lineHeight: 1.6 }}>{product.description}</p>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews Section */}
              <Card>
                <h2 className="text-2xl font-bold mb-6">Reviews</h2>
                <ReviewForm listingId={business.id} />

                <div className="flex flex-col gap-6">
                  {business.reviews && business.reviews.length > 0 ? (
                    business.reviews.map(review => (
                      <div key={review.id} className="p-6 border border-gray-200 rounded-lg bg-gray-50">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                            {review.user?.image ? (
                              <img src={review.user.image} alt={review.user.name || 'User'} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold">
                                {(review.user?.name || 'U').charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-bold">{review.user?.name || 'Anonymous User'}</div>
                            <div className="text-sm text-muted">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="ml-auto text-yellow-500 font-bold text-lg">
                            {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                          </div>
                        </div>
                        <p className="m-0 leading-relaxed">{review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-muted italic">
                      No reviews yet. Be the first to review this business!
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Sticky Sidebar Widget */}
            <div style={{ width: '100%', maxWidth: '350px', position: 'sticky', top: '100px', flexShrink: 0 }}>
              <Card className="shadow-lg border-2 border-blue-50">
                <h3 className="text-xl font-bold mb-6 text-center border-b pb-4">Contact Business</h3>

                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      📞
                    </div>
                    <div>
                      <div className="text-sm text-muted mb-1">Phone Number</div>
                      <div className="font-bold text-lg">{business.phone}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      📍
                    </div>
                    <div>
                      <div className="text-sm text-muted mb-1">Location</div>
                      <div className="font-bold">{business.address}</div>
                    </div>
                  </div>
                  <div className="mt-4">
                     <MessageForm receiverId={business.userId} listingId={business.id} />
                  </div>
                </div>
              </Card>
            </div>

        </div>
      </div>
    </div>
  );
}
