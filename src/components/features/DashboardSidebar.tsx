import Link from 'next/link';
import { Card } from '@/components/ui/Card';

interface DashboardSidebarProps {
  activeTab: 'listings' | 'inbox' | 'analytics' | 'settings';
}

export function DashboardSidebar({ activeTab }: DashboardSidebarProps) {
  return (
    <Card className="p-8 self-start bg-surface-container-lowest border border-outline-variant shadow-level-1 rounded-card">
      <ul className="list-none flex flex-col gap-2 p-0 m-0">
        <li>
          <Link
            href="/dashboard"
            className={`block p-3 rounded-md transition-colors ${
              activeTab === 'listings' 
                ? 'bg-primary-container text-on-primary-container font-bold text-label-md' 
                : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface text-body-md'
            }`}
          >
            My Listings
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/inbox"
            className={`block p-3 rounded-md transition-colors ${
              activeTab === 'inbox' 
                ? 'bg-primary-container text-on-primary-container font-bold text-label-md' 
                : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface text-body-md'
            }`}
          >
            Inbox
          </Link>
        </li>
        <li>
          <a
            href="#"
            className={`block p-3 rounded-md transition-colors ${
              activeTab === 'analytics' 
                ? 'bg-primary-container text-on-primary-container font-bold text-label-md' 
                : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface text-body-md'
            }`}
          >
            Analytics
          </a>
        </li>
        <li>
          <Link
            href="/dashboard/settings"
            className={`block p-3 rounded-md transition-colors ${
              activeTab === 'settings' 
                ? 'bg-primary-container text-on-primary-container font-bold text-label-md' 
                : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface text-body-md'
            }`}
          >
            Account Settings
          </Link>
        </li>
        <li>
          <Link 
            href="/api/auth/signout" 
            className="block p-3 mt-4 text-error font-medium hover:bg-error-container hover:text-on-error-container rounded-md transition-colors text-body-md"
          >
            Log Out
          </Link>
        </li>
      </ul>
    </Card>
  );
}
