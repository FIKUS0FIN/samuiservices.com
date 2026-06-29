import { getServerSession } from 'next-auth';
import { authOptions, prisma } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Store, Users, ClipboardCheck, Database, ArrowLeft } from 'lucide-react';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    redirect('/api/auth/signin');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (user?.role !== 'ADMIN') {
    // Redirect non-admins to the normal dashboard
    redirect('/dashboard');
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex bg-surface">
      
      {/* Premium Sidebar */}
      <aside className="w-[260px] bg-surface-container-lowest border-r border-outline-variant p-6 flex flex-col sticky top-[64px] h-[calc(100vh-64px)] overflow-y-auto z-10">
        <div className="mb-10 pl-2">
          <h2 className="font-label-sm text-xs font-bold tracking-widest uppercase text-on-surface-variant mb-2">Management</h2>
          <div className="font-headline-sm text-xl font-bold text-on-surface">Super Admin</div>
        </div>

        <nav className="flex-1 flex flex-col gap-1">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface font-label-md hover:bg-surface-container-low transition-colors">
            <LayoutDashboard size={18} />
            Overview
          </Link>
          <Link href="/admin/listings" className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface font-label-md hover:bg-surface-container-low transition-colors">
            <Store size={18} />
            Manage Listings
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface font-label-md hover:bg-surface-container-low transition-colors">
            <Users size={18} />
            Manage Users
          </Link>
          <Link href="/admin/claims" className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface font-label-md hover:bg-surface-container-low transition-colors">
            <ClipboardCheck size={18} />
            Claim Requests
          </Link>
          <Link href="/admin/import" className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface font-label-md hover:bg-surface-container-low transition-colors">
            <Database size={18} />
            Seed Database
          </Link>
        </nav>

        <div className="mt-auto pt-8">
          <Link href="/dashboard" className="flex items-center gap-2 px-4 py-3 rounded-lg text-on-surface-variant font-label-md hover:text-on-surface hover:bg-surface-container-low border border-outline-variant transition-colors">
            <ArrowLeft size={16} />
            Back to User Dash
          </Link>
        </div>
      </aside>

      {/* Admin Main Content */}
      <main className="flex-grow p-8 md:p-12 max-w-7xl mx-auto w-full min-w-0">
        {children}
      </main>
    </div>
  );
}
