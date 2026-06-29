import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Favorite, Listing, Category, Island } from '@prisma/client';

type FavoriteWithListing = Favorite & {
  listing: Listing & {
    category: Category | null;
    island: Island | null;
  };
};

export function SavedFavorites({ favorites }: { favorites: FavoriteWithListing[] }) {
  return (
    <div>
      <h2 className="text-headline-sm font-bold text-on-surface mb-6">Saved Favorites ({favorites.length})</h2>

      {favorites.length === 0 ? (
        <Card className="p-12 text-center bg-surface-container-lowest border border-outline-variant shadow-level-1 rounded-card">
          <p className="text-on-surface-variant text-body-lg mb-4">You haven&apos;t saved any listings to your favorites yet.</p>
          <Link href="/all">
            <Button variant="secondary">Browse Listings</Button>
          </Link>
        </Card>
      ) : (
        favorites.map(favorite => {
          const listing = favorite.listing;
          return (
            <Card key={listing.id} className="flex flex-col md:flex-row justify-between md:items-center p-6 mb-4 bg-surface-container-lowest border border-outline-variant shadow-level-1 rounded-card transition-shadow hover:shadow-level-2 gap-4">
              <div className="flex gap-4 items-center">
                <div className="w-20 h-16 bg-surface-container-highest rounded-md overflow-hidden flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {listing.image && <img src={listing.image} alt={listing.name} className="w-full h-full object-cover" />}
                </div>
                <div>
                  <h4 className="text-title-lg font-bold text-on-surface m-0 mb-1">{listing.name}</h4>
                  <div className="text-on-surface-variant text-body-sm">
                    {listing.category?.name || 'Uncategorized'} • {listing.island?.name || 'Unknown Location'}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href={`/${listing.island?.slug || 'all'}/${listing.id}`}>
                  <Button variant="secondary" className="px-4 py-2 text-sm bg-surface-container hover:bg-surface-container-highest border-none text-on-surface font-medium">View Public</Button>
                </Link>
              </div>
            </Card>
          );
        })
      )}
    </div>
  );
}
