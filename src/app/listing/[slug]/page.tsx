import { notFound } from 'next/navigation';
import { getBusinessBySlug } from '@/lib/db';
import { Card } from '@/components/ui/Card';
import { MessageForm } from "@/components/features/MessageForm";
import { ReviewForm } from '@/components/features/ReviewForm';
import { ClaimButton } from '@/components/features/ClaimButton';
import ProductGrid from './components/ProductGrid';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);
  if (!business) return { title: 'Not Found' };
  
  return {
    title: `${business.name} | ${business.category.name} in ${business.island.name}`,
    description: business.description,
    openGraph: {
      title: business.name,
      description: business.description,
      images: business.image ? [{ url: business.image }] : [],
    },
    twitter: {
      card: 'summary_large_image',
    }
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
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>About this business</h3>
                <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
                  {business.description}
                </p>
              </Card>

              {/* Products & Services Showcase */}
              {business.products && business.products.length > 0 && (
                <ProductGrid products={business.products} />
              )}

              {/* Reviews Section */}
              <Card>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Reviews</h2>
                <ReviewForm listingId={business.id} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {business.reviews && business.reviews.length > 0 ? (
                    business.reviews.map(review => (
                      <div key={review.id} style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', backgroundColor: '#f9fafb' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                          <div style={{ width: '2.5rem', height: '2.5rem', backgroundColor: '#e5e7eb', borderRadius: '50%', overflow: 'hidden' }}>
                            {review.user?.image ? (
                              <img src={review.user.image} alt={review.user.name || 'User'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', fontWeight: 'bold' }}>
                                {(review.user?.name || 'U').charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div>
                            <div style={{ fontWeight: 'bold' }}>{review.user?.name || 'Anonymous User'}</div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                              {new Date(review.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div style={{ marginLeft: 'auto', color: '#eab308', fontWeight: 'bold', fontSize: '1.125rem' }}>
                            {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                          </div>
                        </div>
                        <p style={{ margin: 0, lineHeight: 1.6 }}>{review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <div style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      No reviews yet. Be the first to review this business!
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Sticky Sidebar Widget */}
            <div style={{ width: '100%', maxWidth: '350px', position: 'sticky', top: '100px', flexShrink: 0 }}>
              <Card style={{ border: '2px solid #eff6ff', boxShadow: 'var(--shadow-lg)' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>Contact Business</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', backgroundColor: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                      📞
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Phone Number</div>
                      <div style={{ fontWeight: 'bold', fontSize: '1.125rem' }}>{business.phone}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}>
                      📍
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Location</div>
                      <div style={{ fontWeight: 'bold' }}>{business.address}</div>
                    </div>
                  </div>
                  <div style={{ marginTop: '1rem' }}>
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
