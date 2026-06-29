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
      <div className="mb-8">
        <h1 className="font-display text-display-sm font-bold text-on-surface mb-2">Platform Overview</h1>
        <p className="font-body-lg text-on-surface-variant">Monitor the health and activity of the Samui Services directory.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/30 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="font-label-md text-on-surface-variant uppercase tracking-widest text-sm">Total Users</h3>
            <div className="p-3 bg-secondary-container text-on-secondary-container rounded-xl">
              <Users size={24} />
            </div>
          </div>
          <div className="font-display text-5xl font-bold text-on-surface leading-none">{usersCount}</div>
        </div>
        
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/30 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="font-label-md text-on-surface-variant uppercase tracking-widest text-sm">Total Listings</h3>
            <div className="p-3 bg-primary-container text-on-primary-container rounded-xl">
              <Store size={24} />
            </div>
          </div>
          <div className="font-display text-5xl font-bold text-on-surface leading-none">{listingsCount}</div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/30 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="font-label-md text-on-surface-variant uppercase tracking-widest text-sm">Pending Claims</h3>
            <div className={`p-3 rounded-xl ${claimsCount > 0 ? 'bg-error-container text-on-error-container' : 'bg-surface-container text-on-surface-variant'}`}>
              <ClipboardList size={24} />
            </div>
          </div>
          <div className={`font-display text-5xl font-bold leading-none ${claimsCount > 0 ? 'text-error' : 'text-on-surface'}`}>{claimsCount}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-surface-container-lowest p-6 md:p-8 rounded-xl shadow-sm border border-outline-variant/30">
          <h2 className="font-display text-headline-lg mb-6 text-on-surface font-bold">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link href="/add-listing" className="px-6 py-3 bg-primary text-on-primary rounded-lg font-label-md shadow-md active:scale-95 transition-all">
              Add New Listing
            </Link>
            <Link href="/admin/import" className="px-6 py-3 bg-surface-container-lowest border border-outline-variant text-on-surface rounded-lg font-label-md hover:bg-surface-container-low transition-colors">
              Run Seed Script
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
