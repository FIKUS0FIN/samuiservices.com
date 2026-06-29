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
    <div className="section bg-surface">
      <div className="container">
        
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-display-md font-bold mb-2 text-on-surface">Inbox</h1>
            <p className="text-on-surface-variant text-body-lg">Manage your messages</p>
          </div>
        </div>

        <div className="dashboard-grid">
          {/* Sidebar Menu */}
          <DashboardSidebar activeTab="inbox" />

          {/* Main Content */}
          <div className="flex-1 min-w-0">
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
