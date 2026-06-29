import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { DashboardSidebar } from '@/components/features/DashboardSidebar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { updateProfile } from '@/app/actions/user';

export const metadata = {
  title: 'Settings | Dashboard | Samui Services',
};

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/api/auth/signin');
  }

  return (
    <div className="section bg-surface">
      <div className="container">
        
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-display-md font-bold mb-2 text-on-surface">Account Settings</h1>
            <p className="text-on-surface-variant text-body-lg">Manage your profile and account preferences.</p>
          </div>
        </div>

        <div className="dashboard-grid">
          {/* Sidebar Menu */}
          <DashboardSidebar activeTab="settings" />

          {/* Main Content */}
          <div className="flex flex-col gap-8 flex-1">
            <Card className="p-8 shadow-level-1 border border-outline-variant bg-surface-container-lowest rounded-card">
              <h2 className="text-headline-sm font-bold mb-6 text-on-surface">Profile Information</h2>
              <form action={updateProfile} className="flex flex-col gap-6 max-w-lg">
                <div className="input-group">
                  <label htmlFor="email" className="input-label font-bold text-on-surface block mb-2">Email Address (Cannot be changed)</label>
                  <Input 
                    type="email" 
                    id="email" 
                    name="email" 
                    defaultValue={session.user.email || ''} 
                    disabled 
                    className="bg-surface opacity-70"
                  />
                </div>
                
                <div className="input-group">
                  <label htmlFor="name" className="input-label font-bold text-on-surface block mb-2">Display Name</label>
                  <Input 
                    type="text" 
                    id="name" 
                    name="name" 
                    defaultValue={session.user.name || ''} 
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div className="pt-4">
                  <Button type="submit" variant="primary">Save Changes</Button>
                </div>
              </form>
            </Card>
          </div>
        </div>

      </div>
    </div>
  );
}
