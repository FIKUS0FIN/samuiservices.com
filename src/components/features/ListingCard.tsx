import Link from 'next/link';
import { Listing, Category, Island } from '@prisma/client';
import { Card } from '@/components/ui/Card';
import { FavoriteToggle } from '@/components/features/FavoriteToggle';

type BusinessWithRelations = Listing & { category?: Category, island?: Island, isFavorited?: boolean };

interface ListingCardProps {
  business: BusinessWithRelations;
}

export function ListingCard({ business }: ListingCardProps) {
  return (
    <div className="relative h-full w-full max-w-sm mx-auto group">
      <FavoriteToggle listingId={business.id} initialIsFavorited={!!business.isFavorited} />
      <Link href={`/listing/${business.id}`} className="block h-full no-underline text-inherit">
        <Card className="!p-0 h-full flex flex-col border-none shadow-level-1 overflow-hidden rounded-card bg-surface-container-lowest transition-shadow duration-300 hover:shadow-level-2">

          <div className="relative h-48 w-full overflow-hidden p-2">
            <div 
              className="h-full w-full bg-cover bg-center rounded-global transition-transform duration-500 group-hover:scale-105"
              style={{ backgroundImage: `url(${business.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'})` }}
            ></div>
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              <span className="bg-surface/90 text-on-surface text-label-sm font-bold px-3 py-1 rounded-pill backdrop-blur-sm shadow-sm">
                {business.category?.name || 'Uncategorized'}
              </span>
              {business.isPremium && (
                <span className="bg-secondary-container text-secondary-text text-xs font-bold px-3 py-1 rounded-pill shadow-sm">
                  Verified
                </span>
              )}
            </div>
          </div>

          <div className="p-5 flex flex-col flex-1">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-title-lg text-on-surface font-bold m-0 line-clamp-2">
                {business.name}
              </h3>
            </div>

            <div className="flex items-center gap-1.5 mb-3">
              <span className="text-accent">★</span>
              <span className="font-bold text-on-surface">{business.averageRating.toFixed(1)}</span>
              <span className="text-on-surface-variant text-body-sm">({business.reviewCount} reviews)</span>
            </div>

            <div className="text-on-surface-variant text-body-sm mb-4 flex items-center gap-1.5">
              <span className="text-outline">📍</span> {business.island?.name || 'Samui'}
            </div>
            
            <div className="mt-auto pt-4 border-t border-outline-variant/30">
               <span className="text-primary font-bold text-label-md">View Profile →</span>
            </div>
          </div>
        </Card>
      </Link>
    </div>
  );
}
