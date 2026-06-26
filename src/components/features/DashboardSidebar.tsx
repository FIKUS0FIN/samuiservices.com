import Link from 'next/link';
import { Card } from '@/components/ui/Card';

interface DashboardSidebarProps {
  activeTab: 'listings' | 'inbox' | 'analytics' | 'settings';
}

export function DashboardSidebar({ activeTab }: DashboardSidebarProps) {
  return (
    <Card style={{ padding: '2rem 1.5rem', alignSelf: 'start' }}>
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', padding: 0, margin: 0 }}>
        <li>
          <Link
            href="/dashboard"
            style={{
              display: 'block',
              padding: '0.5rem',
              fontWeight: activeTab === 'listings' ? 600 : 'normal',
              color: activeTab === 'listings' ? 'var(--primary-color)' : 'var(--text-muted)'
            }}
          >
            My Listings
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/inbox"
            style={{
              display: 'block',
              padding: '0.5rem',
              fontWeight: activeTab === 'inbox' ? 600 : 'normal',
              color: activeTab === 'inbox' ? 'var(--primary-color)' : 'var(--text-muted)'
            }}
          >
            Inbox
          </Link>
        </li>
        <li>
          <a
            href="#"
            style={{
              display: 'block',
              padding: '0.5rem',
              fontWeight: activeTab === 'analytics' ? 600 : 'normal',
              color: activeTab === 'analytics' ? 'var(--primary-color)' : 'var(--text-muted)'
            }}
          >
            Analytics
          </a>
        </li>
        <li>
          <a
            href="#"
            style={{
              display: 'block',
              padding: '0.5rem',
              fontWeight: activeTab === 'settings' ? 600 : 'normal',
              color: activeTab === 'settings' ? 'var(--primary-color)' : 'var(--text-muted)'
            }}
          >
            Account Settings
          </a>
        </li>
        <li>
          <Link href="/api/auth/signout" style={{ display: 'block', padding: '0.5rem', color: 'red', marginTop: '1rem' }}>
            Log Out
          </Link>
        </li>
      </ul>
    </Card>
  );
}
