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
      
      {/* Hero Image Banner */}
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <BusinessHero business={business as any} />

      <div className="container section">
        {!business.isClaimed && <ClaimButton listingId={business.id} />}

        <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
            
            {/* Main Content Area */}
            <div style={{ flex: '1 1 600px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

              <BusinessInfo business={business as any} />

              {/* Reviews Section */}
              <Card>
                <h2 className="text-2xl font-bold mb-6">Reviews</h2>
                <ReviewForm listingId={business.id} />

                <ReviewsList reviews={business.reviews as any} />
              </Card>
            </div>

            {/* Sticky Sidebar Widget */}
            <ContactInfo business={business as any} />

        </div>
      </div>
    </div>
  );
}
