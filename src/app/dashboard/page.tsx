/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/auth';

export const metadata = {
  title: 'Dashboard | Samui Services',
};

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/api/auth/signin');
  }

  // Fetch user's listings from the database
  const listings = await prisma.listing.findMany({
    where: { userId: session.user.id },
    include: { category: true, island: true },
    orderBy: { createdAt: 'desc' }
  });

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    include: {
      listing: {
        include: { category: true, island: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="section">
      <div className="container">
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>My Dashboard</h1>
            <p style={{ color: 'var(--text-muted)' }}>Welcome back, {session.user.name || session.user.email}!</p>
          </div>
          <Link href="/add-listing">
            <Button variant="primary">+ Add New Listing</Button>
          </Link>
        </div>

        <div className="dashboard-grid">
          {/* Sidebar Menu */}
          <Card style={{ padding: '2rem 1.5rem', alignSelf: 'start' }}>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', padding: 0, margin: 0 }}>
              <li>
                <Link href="/dashboard" style={{ display: 'block', padding: '0.5rem', fontWeight: 600, color: 'var(--primary-color)' }}>My Listings</Link>
              </li>
              <li>
                <Link href="/dashboard/inbox" style={{ display: 'block', padding: '0.5rem', color: 'var(--text-muted)' }}>Inbox</Link>
              </li>
              <li>
                <a href="#" style={{ display: 'block', padding: '0.5rem', color: 'var(--text-muted)' }}>Analytics</a>
              </li>
              <li>
                <a href="#" style={{ display: 'block', padding: '0.5rem', color: 'var(--text-muted)' }}>Account Settings</a>
              </li>
              <li>
                <Link href="/api/auth/signout" style={{ display: 'block', padding: '0.5rem', color: 'red', marginTop: '1rem' }}>Log Out</Link>
              </li>
            </ul>
          </Card>

          {/* Main Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
            
            {/* Active Listings */}
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

            {/* Favorites */}
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
          </div>
        </div>

      </div>
    </div>
  );
}
