import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { prisma } from '@/lib/auth';
import Link from 'next/link';
import { Pagination } from '@/components/ui/Pagination';

export const metadata = {
  title: 'Manage Listings | Super Admin',
};

export default async function AdminListingsPage(props: { searchParams?: Promise<{ page?: string }> }) {
  const searchParams = await props.searchParams;
  const currentPage = searchParams?.page ? parseInt(searchParams.page, 10) : 1;
  const limit = 10;
  const skip = (currentPage - 1) * limit;

  const [listings, totalCount] = await Promise.all([
    prisma.listing.findMany({
      include: {
        category: true,
        island: true,
        user: true,
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    }),
    prisma.listing.count()
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-display-sm md:text-display-md font-bold text-on-surface mb-2">Manage Listings</h1>
          <p className="text-body-lg text-on-surface-variant">View and edit all published businesses in the directory.</p>
        </div>
        <Link href="/add-listing">
          <Button variant="primary" className="px-6 py-3 rounded-md font-medium">Add New Listing</Button>
        </Link>
      </div>

      <Card className="overflow-hidden p-0 bg-surface-container-lowest shadow-level-1 border border-outline-variant rounded-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface border-b-2 border-outline-variant">
                <th className="p-5 text-label-md uppercase tracking-wider font-bold text-on-surface-variant">Name & Location</th>
                <th className="p-5 text-label-md uppercase tracking-wider font-bold text-on-surface-variant">Owner</th>
                <th className="p-5 text-label-md uppercase tracking-wider font-bold text-on-surface-variant">Status</th>
                <th className="p-5 text-label-md uppercase tracking-wider font-bold text-on-surface-variant text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {listings.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-16 text-center text-on-surface-variant">
                    <div className="text-title-md font-bold text-on-surface mb-2">No listings found</div>
                    <p className="text-body-md">There are no businesses listed on the platform yet.</p>
                  </td>
                </tr>
              ) : (
                listings.map((listing) => (
                  <tr key={listing.id} className="border-b border-outline-variant hover:bg-surface-container-high transition-colors">
                    <td className="p-5">
                      <div className="font-bold text-title-md text-on-surface mb-1">
                        <Link href={`/listing/${listing.slug}`} className="text-primary hover:underline">
                          {listing.name}
                        </Link>
                      </div>
                      <div className="text-body-sm text-on-surface-variant flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-surface-container rounded-md">{listing.category?.name || 'No Category'}</span>
                        • {listing.island?.name || 'No Island'}
                      </div>
                    </td>
                    <td className="p-5">
                      {listing.user ? (
                        <div className="flex flex-col">
                          <span className="font-bold text-on-surface text-body-md">{listing.user.name || 'User'}</span>
                          <span className="text-body-sm text-on-surface-variant">{listing.user.email}</span>
                        </div>
                      ) : (
                        <span className="text-on-surface-variant italic text-body-md">System</span>
                      )}
                    </td>
                    <td className="p-5">
                      {listing.isPremium ? (
                        <span className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-label-sm font-bold tracking-wide">PREMIUM</span>
                      ) : (
                        <span className="bg-surface-container text-on-surface-variant px-3 py-1 rounded-full text-label-sm font-bold tracking-wide border border-outline-variant">STANDARD</span>
                      )}
                    </td>
                    <td className="p-5 text-right">
                      <Link href={`/dashboard/edit/${listing.id}`}>
                        <Button variant="secondary" className="px-4 py-2 text-sm rounded-md">Edit</Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
      
      <Pagination totalPages={totalPages} currentPage={currentPage} />
    </div>
  );
}
