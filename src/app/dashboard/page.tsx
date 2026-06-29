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
    <div className="section bg-background min-h-screen">
      <div className="container pt-12">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <div>
            <h1 className="font-display text-display-md font-bold text-primary mb-2">My Dashboard</h1>
            <p className="font-body-lg text-on-surface-variant text-body-lg">Welcome back, {session.user.name || session.user.email}!</p>
          </div>
          <Link href="/add-listing">
            <Button variant="primary" className="shadow-md hover:shadow-lg active:scale-95 transition-all px-6">+ Add New Listing</Button>
          </Link>
        </div>

        <div className="dashboard-grid grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
          {/* Sidebar Menu */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 self-start shadow-sm">
            <DashboardSidebar activeTab="listings" />
          </div>

          {/* Main Content */}
          <div className="flex flex-col gap-12">
            <ActiveListings listings={listings} />
            <SavedFavorites favorites={favorites} />
          </div>
        </div>

      </div>
    </div>
  );
}
