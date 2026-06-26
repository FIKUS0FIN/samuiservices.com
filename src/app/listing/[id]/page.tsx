import { notFound } from 'next/navigation';
import { getBusinessById } from '@/lib/db';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ReviewForm } from '@/components/features/ReviewForm';
import { MessageForm } from '@/components/features/MessageForm';
import { ClaimButton } from '@/components/features/ClaimButton';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const business = await getBusinessById(id);
  if (!business) return { title: 'Not Found' };
  
  return {
    title: `${business.name} | ${business.category.name} in ${business.island.name}`,
    description: business.description,
  };
}

export default async function BusinessDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const business = await getBusinessById(id);
  
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
    description: business.description
  };

  return (
    <div>
      {/* Inject JSON-LD into the head for Google and AI agents */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026') }}
      />
      
      {/* Hero Image */}
      <div style={{ width: '100%', height: '400px', backgroundImage: `url(${business.image})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--bg-color) 0%, transparent 100%)' }}></div>
      </div>

      <div className="container" style={{ marginTop: '-100px', position: 'relative', zIndex: 10, paddingBottom: '4rem' }}>
        {!business.isClaimed && <ClaimButton listingId={business.id} />}
        <Card style={{ padding: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem' }}>
            
            <div style={{ flex: 1, minWidth: '300px' }}>
              <div style={{ color: 'var(--primary-color)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '1px' }}>
                {business.category.name} • {business.island.name}
              </div>
              <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>{business.name}</h1>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.25rem', marginBottom: '2rem' }}>
                <span style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>★ {business.averageRating}</span>
                <span style={{ color: 'var(--text-muted)' }}>({business.reviewCount} verified reviews)</span>
              </div>
              
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>About this business</h3>
              <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
                {business.description}
              </p>
            </div>
            
            <div style={{ width: '350px', background: 'var(--bg-color)', padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Contact Info</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Phone Number</div>
                  <div style={{ fontSize: '1.125rem', fontWeight: 500 }}>{business.phone}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Location</div>
                  <div style={{ fontSize: '1.125rem', fontWeight: 500 }}>{business.address}</div>
                </div>
                <MessageForm receiverId={business.userId} listingId={business.id} />
              </div>
            </div>
            
            
          </div>
        </Card>

        {/* Reviews Section */}
        <div style={{ marginTop: '2rem' }}>
          <Card style={{ padding: '3rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Reviews</h2>
            
            <ReviewForm listingId={business.id} />
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {business.reviews && business.reviews.length > 0 ? (
                business.reviews.map(review => (
                  <div key={review.id} style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                      <div style={{ width: '40px', height: '40px', backgroundColor: '#e2e8f0', borderRadius: '50%', overflow: 'hidden' }}>
                        {review.user?.image ? (
                          <img src={review.user.image} alt={review.user.name || 'User'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                            {(review.user?.name || 'U').charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{review.user?.name || 'Anonymous User'}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div style={{ marginLeft: 'auto', color: 'var(--accent-color)' }}>
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                      </div>
                    </div>
                    <p style={{ margin: 0, lineHeight: 1.6 }}>{review.comment}</p>
                  </div>
                ))
              ) : (
                <div style={{ color: 'var(--text-muted)' }}>
                  No reviews yet. Be the first to review this business!
                </div>
              )}
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
