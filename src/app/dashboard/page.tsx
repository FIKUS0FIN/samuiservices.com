import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/auth';
import { DashboardSidebar } from '@/components/features/DashboardSidebar';
import { ActiveListings } from '@/components/features/ActiveListings';
import { SavedFavorites } from '@/components/features/SavedFavorites';
import { Pagination } from '@/components/ui/Pagination';

export const metadata = {
  title: 'Dashboard | Samui Services',
};

export default async function Dashboard(props: { searchParams?: Promise<{ listingPage?: string, favPage?: string, search?: string }> }) {
  const searchParams = await props.searchParams;
  const listingPage = searchParams?.listingPage ? parseInt(searchParams.listingPage, 10) : 1;
  const favPage = searchParams?.favPage ? parseInt(searchParams.favPage, 10) : 1;
  const search = searchParams?.search || '';
  const limit = 10;
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/api/auth/signin');
  }

  const [listings, totalListings, userTotalListingsCount] = await Promise.all([
    prisma.listing.findMany({
      where: { 
        userId: session.user.id,
        ...(search ? {
          OR: [
            { name: { contains: search } },
            { slug: { contains: search } }
          ]
        } : {})
      },
      include: { category: true, island: true },
      orderBy: { createdAt: 'desc' },
      skip: (listingPage - 1) * limit,
      take: limit
    }),
    prisma.listing.count({ 
      where: { 
        userId: session.user.id,
        ...(search ? {
          OR: [
            { name: { contains: search } },
            { slug: { contains: search } }
          ]
        } : {})
      } 
    }),
    prisma.listing.count({ where: { userId: session.user.id } })
  ]);

  const [favorites, totalFavorites] = await Promise.all([
    prisma.favorite.findMany({
      where: { userId: session.user.id },
      include: {
        listing: {
          include: { category: true, island: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: (favPage - 1) * limit,
      take: limit
    }),
    prisma.favorite.count({ where: { userId: session.user.id } })
  ]);

  const totalListingPages = Math.ceil(totalListings / limit);
  const totalFavPages = Math.ceil(totalFavorites / limit);

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
            <div>
              <ActiveListings listings={listings} totalCount={totalListings} userTotalCount={userTotalListingsCount} initialSearch={search} />
              <Pagination totalPages={totalListingPages} currentPage={listingPage} pageParamName="listingPage" />
            </div>
            <div>
              <SavedFavorites favorites={favorites} totalCount={totalFavorites} />
              <Pagination totalPages={totalFavPages} currentPage={favPage} pageParamName="favPage" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
