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
    <div style={{ backgroundColor: '#f8fafc', minHeight: 'calc(100vh - 64px)', display: 'flex' }}>
      
      {/* Premium Sidebar */}
      <aside style={{ 
        width: '260px', 
        backgroundColor: 'white', 
        borderRight: '1px solid #e2e8f0',
        padding: '2rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: '64px',
        height: 'calc(100vh - 64px)',
        overflowY: 'auto'
      }}>
        <div style={{ marginBottom: '2.5rem', paddingLeft: '0.5rem' }}>
          <h2 style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '0.5rem' }}>Management</h2>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>Super Admin</div>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px', color: '#475569', fontWeight: 500, textDecoration: 'none', transition: 'all 0.2s', backgroundColor: 'transparent' }} className="admin-nav-link">
            <LayoutDashboard size={18} />
            Overview
          </Link>
          <Link href="/admin/listings" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px', color: '#475569', fontWeight: 500, textDecoration: 'none', transition: 'all 0.2s' }} className="admin-nav-link">
            <Store size={18} />
            Manage Listings
          </Link>
          <Link href="/admin/users" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px', color: '#475569', fontWeight: 500, textDecoration: 'none', transition: 'all 0.2s' }} className="admin-nav-link">
            <Users size={18} />
            Manage Users
          </Link>
          <Link href="/admin/claims" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px', color: '#475569', fontWeight: 500, textDecoration: 'none', transition: 'all 0.2s' }} className="admin-nav-link">
            <ClipboardCheck size={18} />
            Claim Requests
          </Link>
          <Link href="/admin/import" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px', color: '#475569', fontWeight: 500, textDecoration: 'none', transition: 'all 0.2s' }} className="admin-nav-link">
            <Database size={18} />
            Seed Database
          </Link>
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
          <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', borderRadius: '8px', color: '#64748b', fontWeight: 500, textDecoration: 'none', transition: 'all 0.2s', border: '1px solid #e2e8f0' }} className="admin-nav-back">
            <ArrowLeft size={16} />
            Back to User Dash
          </Link>
        </div>
        
        <style>{`
          .admin-nav-link:hover {
            background-color: #f1f5f9 !important;
            color: #0f172a !important;
          }
          .admin-nav-back:hover {
            background-color: #f8fafc;
            color: #334155 !important;
          }
        `}</style>
      </aside>

      {/* Admin Main Content */}
      <main style={{ flexGrow: 1, padding: '2rem 3rem', maxWidth: '1200px', margin: '0 auto' }}>
        {children}
      </main>
    </div>
  );
}
