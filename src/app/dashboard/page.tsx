import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/auth';
import { DashboardSidebar } from '@/components/features/DashboardSidebar';
import { ActiveListings } from '@/components/features/ActiveListings';
import { SavedFavorites } from '@/components/features/SavedFavorites';

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
          <DashboardSidebar activeTab="listings" />

          {/* Main Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
            <ActiveListings listings={listings} />
            <SavedFavorites favorites={favorites} />
          </div>
        </div>

      </div>
    </div>
  );
}
