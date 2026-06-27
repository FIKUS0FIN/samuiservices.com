import Link from 'next/link';
import { Listing, Category, Island } from '@prisma/client';
import { Card } from '@/components/ui/Card';
import { FavoriteToggle } from '@/components/features/FavoriteToggle';

type BusinessWithRelations = Listing & { category?: Category, island?: Island, isFavorited?: boolean };

interface BusinessCardProps {
  business: BusinessWithRelations;
}

export function BusinessCard({ business }: BusinessCardProps) {
  return (
    <div className="relative group">
      <FavoriteToggle listingId={business.id} initialIsFavorited={!!business.isFavorited} />
      <Link href={`/listing/${business.id}`} className="block no-underline text-inherit">
        <Card className={`!p-0 flex flex-col md:flex-row gap-4 border-none shadow-level-1 overflow-hidden rounded-card bg-surface-card transition-shadow duration-300 hover:shadow-level-2 ${business.isPremium ? 'ring-2 ring-secondary-container' : ''}`}>

          <div className="relative h-48 md:h-auto md:w-64 flex-shrink-0 p-2">
            <div
              className="h-full w-full min-h-[150px] bg-cover bg-center rounded-global transition-transform duration-500 group-hover:scale-105"
              style={{ backgroundImage: `url(${business.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'})` }}
            ></div>

             <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 md:hidden">
              <span className="bg-surface/90 text-text-main text-xs font-bold px-3 py-1 rounded-pill backdrop-blur-sm shadow-sm">
                {business.category?.name || 'Uncategorized'}
              </span>
            </div>
          </div>

          <div className="p-5 md:py-6 md:pr-8 flex flex-col flex-1 justify-center">
            <div className="flex justify-between items-start mb-2">
              <div className="text-primary font-semibold text-sm uppercase tracking-wide hidden md:block mb-1">
                {business.category?.name || 'Uncategorized'} • {business.island?.name || 'Unknown Location'}
              </div>
              {business.isPremium && (
                 <span className="bg-secondary-container text-secondary-text text-xs font-bold px-3 py-1 rounded-pill shadow-sm">
                  Verified
                </span>
              )}
            </div>

            <h3 className="text-headline-sm text-text-main font-bold m-0 mb-2">
              {business.name}
            </h3>

            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-accent">★</span>
              <span className="font-bold text-text-main">{business.averageRating.toFixed(1)}</span>
              <span className="text-text-muted text-sm">({business.reviewCount} reviews)</span>
            </div>
          </div>
        </Card>
      </Link>
    </div>
  );
}
