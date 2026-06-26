import { notFound } from 'next/navigation';
import { getBusinessById } from '@/lib/db';
import { Card } from '@/components/ui/Card';
import { ReviewForm } from '@/components/features/ReviewForm';
import { ClaimButton } from '@/components/features/ClaimButton';
import { BusinessHero } from './components/BusinessHero';
import { BusinessInfo } from './components/BusinessInfo';
import { ContactInfo } from './components/ContactInfo';
import { ReviewsList } from './components/ReviewsList';

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
      <BusinessHero image={business.image} />

      <div className="container" style={{ marginTop: '-100px', position: 'relative', zIndex: 10, paddingBottom: '4rem' }}>
        {!business.isClaimed && <ClaimButton listingId={business.id} />}
        <Card style={{ padding: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem' }}>
            
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <BusinessInfo business={business as any} />
            
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <ContactInfo business={business as any} />
            
          </div>
        </Card>

        {/* Reviews Section */}
        <div style={{ marginTop: '2rem' }}>
          <Card style={{ padding: '3rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Reviews</h2>
            
            <ReviewForm listingId={business.id} />
            
            <ReviewsList reviews={business.reviews} />
          </Card>
        </div>

      </div>
    </div>
  );
}
