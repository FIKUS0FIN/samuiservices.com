import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function Navbar() {
  const session = await getServerSession(authOptions);

  return (
    <nav className="glass-nav">
      <div className="container nav-container" style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ fontWeight: 800, fontSize: '1.25rem', fontFamily: 'var(--font-heading)', color: 'var(--primary-color)' }}>
          Samui Services
        </Link>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {session ? (
            <Link href="/dashboard">
              <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {session.user?.image && <img src={session.user.image} alt="Avatar" style={{ width: '20px', height: '20px', borderRadius: '50%' }} />}
                Dashboard
              </button>
            </Link>
          ) : (
            <Link href="/dashboard">
              <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Login</button>
            </Link>
          )}
          <Link href="/add-listing">
            <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Add Business</button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
