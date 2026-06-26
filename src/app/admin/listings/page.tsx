import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { prisma } from '@/lib/auth';
import Link from 'next/link';

export const metadata = {
  title: 'Manage Listings | Super Admin',
};

export default async function AdminListingsPage() {
  const listings = await prisma.listing.findMany({
    include: {
      category: true,
      island: true,
      user: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>Manage Listings</h1>
          <p style={{ color: 'var(--text-muted)' }}>View and edit all published businesses in the directory.</p>
        </div>
        <Link href="/add-listing">
          <Button variant="primary" style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: 500 }}>Add New Listing</Button>
        </Link>
      </div>

      <Card style={{ overflow: 'hidden', padding: 0, border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, color: '#64748b' }}>Name & Location</th>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, color: '#64748b' }}>Owner</th>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, color: '#64748b' }}>Status</th>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, color: '#64748b', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {listings.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <div style={{ fontSize: '1.125rem', fontWeight: 500, color: '#475569', marginBottom: '0.5rem' }}>No listings found</div>
                    <p>There are no businesses listed on the platform yet.</p>
                  </td>
                </tr>
              ) : (
                listings.map((listing) => (
                  <tr key={listing.id} style={{ borderBottom: '1px solid #e2e8f0', transition: 'background-color 0.2s' }} className="admin-table-row">
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: '0.25rem' }}>
                        <Link href={`/listing/${listing.id}`} style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>
                          {listing.name}
                        </Link>
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ padding: '0.125rem 0.375rem', backgroundColor: '#f1f5f9', borderRadius: '4px' }}>{listing.category?.name || 'No Category'}</span>
                        • {listing.island?.name || 'No Island'}
                      </div>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      {listing.user ? (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 500, color: '#334155' }}>{listing.user.name || 'User'}</span>
                          <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>{listing.user.email}</span>
                        </div>
                      ) : (
                        <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>System</span>
                      )}
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      {listing.isPremium ? (
                        <span style={{ backgroundColor: '#fef08a', color: '#854d0e', padding: '0.375rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em' }}>PREMIUM</span>
                      ) : (
                        <span style={{ backgroundColor: '#f1f5f9', color: '#64748b', padding: '0.375rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em' }}>STANDARD</span>
                      )}
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                      <Link href={`/dashboard/edit/${listing.id}`}>
                        <Button variant="secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', borderRadius: '6px' }}>Edit</Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <style>{`
            .admin-table-row:hover {
              background-color: #f8fafc;
            }
          `}</style>
        </div>
      </Card>
    </div>
  );
}
