import { Card } from '@/components/ui/Card';
import { prisma } from '@/lib/auth';
import { Users, Store, ClipboardList } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Super Admin | Samui Services',
};

export default async function AdminDashboard() {
  const usersCount = await prisma.user.count();
  const listingsCount = await prisma.listing.count();
  const claimsCount = await prisma.claimRequest.count({
    where: { status: 'PENDING' }
  });

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>Platform Overview</h1>
        <p style={{ color: 'var(--text-muted)' }}>Monitor the health and activity of the Samui Services directory.</p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <Card style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#64748b' }}>Total Users</h3>
            <div style={{ padding: '0.75rem', backgroundColor: '#f0fdf4', borderRadius: '12px' }}>
              <Users color="#16a34a" size={24} />
            </div>
          </div>
          <div style={{ fontSize: '3rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{usersCount}</div>
        </Card>
        
        <Card style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#64748b' }}>Total Listings</h3>
            <div style={{ padding: '0.75rem', backgroundColor: '#eff6ff', borderRadius: '12px' }}>
              <Store color="#2563eb" size={24} />
            </div>
          </div>
          <div style={{ fontSize: '3rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{listingsCount}</div>
        </Card>

        <Card style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#64748b' }}>Pending Claims</h3>
            <div style={{ padding: '0.75rem', backgroundColor: claimsCount > 0 ? '#fef2f2' : '#f8fafc', borderRadius: '12px' }}>
              <ClipboardList color={claimsCount > 0 ? '#ef4444' : '#94a3b8'} size={24} />
            </div>
          </div>
          <div style={{ fontSize: '3rem', fontWeight: 800, color: claimsCount > 0 ? '#ef4444' : '#0f172a', lineHeight: 1 }}>{claimsCount}</div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <Card style={{ padding: '2rem', border: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a' }}>Quick Actions</h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/add-listing" style={{ padding: '0.75rem 1.5rem', backgroundColor: 'var(--primary-color)', color: 'white', borderRadius: '8px', fontWeight: 500, textDecoration: 'none' }}>
              Add New Listing
            </Link>
            <Link href="/admin/import" style={{ padding: '0.75rem 1.5rem', backgroundColor: '#f1f5f9', color: '#334155', borderRadius: '8px', fontWeight: 500, textDecoration: 'none' }}>
              Run Seed Script
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
