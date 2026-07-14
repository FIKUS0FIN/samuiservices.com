import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin, CheckCircle, ExternalLink } from 'lucide-react';
import { prisma } from '@/lib/auth';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  
  // Try to parse format: top-10-{category}-in-koh-{island}
  const match = slug.match(/^top-10-(.+)-in-koh-(.+)$/);
  if (!match) return { title: 'Guide Not Found' };
  
  let [, categoryWord, islandName] = match;
  categoryWord = categoryWord.replace(/-/g, ' ');
  const capitalizedCategory = categoryWord.charAt(0).toUpperCase() + categoryWord.slice(1);
  const capitalizedIsland = islandName.charAt(0).toUpperCase() + islandName.slice(1);

  return {
    title: `Top 10 ${capitalizedCategory} in Koh ${capitalizedIsland} (2026 Updated) | Samui Services`,
    description: `Discover the absolute best 10 ${categoryWord} in Koh ${capitalizedIsland}. Find your perfect verified spot by local experts.`,
    alternates: {
      canonical: `https://samuiservices.com/guides/${slug}`,
    },
  };
}

// Revalidate this page once a day to keep rankings fresh
export const revalidate = 86400; 

export default async function TopCategoryGuide({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Try to parse format: top-10-{category}-in-koh-{island}
  const match = slug.match(/^top-10-(.+)-in-koh-(.+)$/);
  if (!match) notFound();
  
  let [, categoryWord, islandName] = match;
  const originalCategoryWord = categoryWord.replace(/-/g, ' ');
  const capitalizedCategory = originalCategoryWord.charAt(0).toUpperCase() + originalCategoryWord.slice(1);
  const capitalizedIsland = islandName.charAt(0).toUpperCase() + islandName.slice(1);

  // Fetch categories matching the keyword
  const categories = await prisma.category.findMany({
    where: {
      OR: [
        { slug: { contains: categoryWord } },
        { name: { contains: originalCategoryWord } }
      ]
    },
    select: { id: true, name: true }
  });
  
  if (categories.length === 0) {
    // Fallback if no exact match, just get any category to avoid 404ing entirely if we want, or notFound()
    notFound();
  }

  const categoryIds = categories.map(c => c.id);

  const topListings = await prisma.listing.findMany({
    where: {
      categoryId: { in: categoryIds },
      island: { slug: islandName },
      image: { not: null }
    },
    include: {
      category: true,
      island: true,
    },
    orderBy: [
      { isPremium: 'desc' },
      { averageRating: 'desc' },
      { reviewCount: 'desc' }
    ],
    take: 10,
  });

  return (
    <div className="min-h-screen bg-surface-bright font-body-md text-on-surface overflow-x-hidden pb-16">
      
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://pub-3433478e81804444ae052b8316ad0d83.r2.dev/images/explore/photo-1558981806-ec527fa84c39.jpg?auto=format&fit=crop&q=80&w=2000"
            alt="Koh Samui beautiful beach and luxury resort" 
            fill
            className="object-cover"
            priority 
            sizes="(max-width: 768px) 100vw, 1200px"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80" />
        </div>
        <div className="relative z-10 text-center px-6 max-w-4xl mt-12">
          <span className="text-secondary-fixed font-bold tracking-widest uppercase text-sm mb-4 block">Official Guide</span>
          <h1 className="font-display text-display-md md:text-display text-white mb-6 drop-shadow-lg">
            Top 10 {capitalizedCategory} in Koh {capitalizedIsland}
          </h1>
          <p className="font-body-lg text-body-lg text-white/90 drop-shadow-md max-w-2xl mx-auto">
            From hidden gems to highly-rated popular spots, discover the absolute best {categoryWord} verified by our local experts.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-12 md:py-20">
        
        {/* Editor's Note */}
        <div className="bg-primary-container/30 border border-primary/20 rounded-2xl p-6 md:p-8 mb-12 flex flex-col md:flex-row gap-6 items-start">
          <div className="bg-primary/10 p-3 rounded-full shrink-0">
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="text-title-lg font-bold text-on-surface mb-2">Expertly Curated for 2026</h2>
            <p className="text-on-surface-variant leading-relaxed">
              Our team continually monitors guest reviews, amenities, and location advantages to bring you this definitive list. By booking one of our top-rated stays, you ensure an unforgettable experience in the Gulf of Thailand.
            </p>
          </div>
        </div>

        {/* The List */}
        <div className="space-y-12">
          {topListings.map((listing, index) => (
            <div key={listing.id} className="group bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-outline-variant flex flex-col md:flex-row">
              
              {/* Image Section */}
              <div className="relative w-full md:w-2/5 h-64 md:h-auto overflow-hidden shrink-0">
                <div className="absolute top-4 left-4 z-20 bg-secondary text-on-secondary w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-lg">
                  #{index + 1}
                </div>
                {listing.image ? (
                  <Image 
                    src={listing.image}
                    alt={listing.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                ) : (
                  <div className="w-full h-full bg-surface-container flex items-center justify-center">
                    <span className="text-on-surface-variant">No image available</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80" />
              </div>

              {/* Content Section */}
              <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-headline-sm text-headline-sm text-on-surface">
                      <Link href={`/listing/${listing.slug}`} className="hover:text-primary transition-colors">
                        {listing.name}
                      </Link>
                    </h3>
                    <div className="flex items-center gap-1.5 bg-surface-container px-3 py-1 rounded-full border border-outline-variant">
                      <Star className="w-4 h-4 text-tertiary fill-current" />
                      <span className="font-bold text-label-lg">{listing.averageRating > 0 ? listing.averageRating.toFixed(1) : 'New'}</span>
                      {listing.reviewCount > 0 && (
                        <span className="text-on-surface-variant text-label-sm ml-1">({listing.reviewCount})</span>
                      )}
                    </div>
                  </div>
                  
                  {listing.address && (
                    <div className="flex items-center gap-2 text-on-surface-variant mb-4">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span className="text-body-sm line-clamp-1">{listing.address}</span>
                    </div>
                  )}

                  <p className="text-body-md text-on-surface-variant line-clamp-3 mb-6">
                    {listing.description || `Experience the best ${categoryWord} in Koh ${capitalizedIsland} with this highly recommended spot.`}
                  </p>
                </div>

                <div className="pt-4 border-t border-outline-variant/50 flex justify-between items-center">
                  <span className="text-label-lg font-medium text-primary bg-primary/5 px-4 py-1.5 rounded-full">
                    {listing.isPremium ? 'Premium Choice' : 'Highly Recommended'}
                  </span>
                  
                  <Link 
                    href={`/listing/${listing.slug}`}
                    className="flex items-center gap-2 text-on-primary bg-primary hover:bg-primary/90 px-6 py-2.5 rounded-full transition-colors font-medium text-label-lg shadow-sm"
                  >
                    View Details
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {topListings.length === 0 && (
          <div className="text-center py-20 bg-surface-container rounded-2xl">
            <p className="text-on-surface-variant text-body-lg">Currently curating the best {categoryWord}...</p>
          </div>
        )}
      </section>
    </div>
  );
}
