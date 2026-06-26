import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Listing, Category, Island } from '@prisma/client';

type ListingWithRelations = Listing & { category: Category | null; island: Island | null };

export function ActiveListings({ listings }: { listings: ListingWithRelations[] }) {
  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Active Listings ({listings.length})</h2>

      {listings.length === 0 ? (
        <Card style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>You don&apos;t have any listings yet.</p>
          <Link href="/add-listing">
            <Button variant="primary">Create Your First Listing</Button>
          </Link>
        </Card>
      ) : (
        listings.map(listing => (
          <Card key={listing.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ width: '80px', height: '60px', backgroundColor: '#e2e8f0', borderRadius: 'var(--radius-sm)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {listing.image && <img src={listing.image} alt={listing.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} />}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h4 style={{ fontSize: '1.125rem', marginBottom: '0.25rem', marginTop: 0 }}>{listing.name}</h4>
                  {listing.isPremium && (
                    <span style={{ backgroundColor: '#fef3c7', color: '#d97706', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.15rem 0.4rem', borderRadius: '4px', textTransform: 'uppercase' }}>
                      Premium
                    </span>
                  )}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  {listing.category?.name || 'Uncategorized'} • {listing.island?.name || 'Unknown Location'}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {!listing.isPremium && (
                <Button variant="secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                  Upgrade
                </Button>
              )}
              <Link href={`/dashboard/edit/${listing.id}`}>
                <Button variant="secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Edit</Button>
              </Link>
              <Link href={`/${listing.island?.slug || 'all'}/${listing.id}`}>
                <Button variant="secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>View Public</Button>
              </Link>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}
