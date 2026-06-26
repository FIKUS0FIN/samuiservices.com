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
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Saved Favorites ({favorites.length})</h2>

      {favorites.length === 0 ? (
        <Card style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>You haven&apos;t saved any listings to your favorites yet.</p>
          <Link href="/all">
            <Button variant="secondary">Browse Listings</Button>
          </Link>
        </Card>
      ) : (
        favorites.map(favorite => {
          const listing = favorite.listing;
          return (
            <Card key={listing.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ width: '80px', height: '60px', backgroundColor: '#e2e8f0', borderRadius: 'var(--radius-sm)' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {listing.image && <img src={listing.image} alt={listing.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} />}
                </div>
                <div>
                  <h4 style={{ fontSize: '1.125rem', marginBottom: '0.25rem', marginTop: 0 }}>{listing.name}</h4>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    {listing.category?.name || 'Uncategorized'} • {listing.island?.name || 'Unknown Location'}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link href={`/${listing.island?.slug || 'all'}/${listing.id}`}>
                  <Button variant="secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>View Public</Button>
                </Link>
              </div>
            </Card>
          );
        })
      )}
    </div>
  );
}
