import { getServerSession } from 'next-auth';
import { authOptions, prisma } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { InboxView } from '@/components/features/InboxView';
import { DashboardSidebar } from '@/components/features/DashboardSidebar';

export const metadata = {
  title: 'Inbox | Dashboard | Samui Services',
};

export default async function InboxPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/api/auth/signin');
  }

  // Fetch messages received by the user
  const receivedMessages = await prisma.message.findMany({
    where: { receiverId: session.user.id },
    include: {
      sender: {
        select: { name: true, image: true }
      },
      listing: {
        select: { id: true, name: true, island: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  // Fetch messages sent by the user
  const sentMessages = await prisma.message.findMany({
    where: { senderId: session.user.id },
    include: {
      receiver: {
        select: { name: true, image: true }
      },
      listing: {
        select: { id: true, name: true, island: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="section">
      <div className="container">
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Inbox</h1>
            <p style={{ color: 'var(--text-muted)' }}>Manage your messages</p>
          </div>
        </div>

        <div className="dashboard-grid">
          {/* Sidebar Menu */}
          <DashboardSidebar activeTab="inbox" />

          {/* Main Content */}
          <div style={{ flex: 1 }}>
            <InboxView 
              receivedMessages={receivedMessages} 
              sentMessages={sentMessages} 
              currentUserId={session.user.id} 
            />
          </div>
        </div>

      </div>
    </div>
  );
}
