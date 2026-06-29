'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';
import { seedDatabase } from '@/app/actions/seed';

export default function AdminImportPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleSeed = async () => {
    if (!window.confirm('Are you sure you want to seed the database? This will insert sample categories and businesses.')) {
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const result = await seedDatabase();
      if (result.success) {
        setMessage({ text: result.message, type: 'success' });
      } else {
        setMessage({ text: result.message, type: 'error' });
      }
    } catch (err: unknown) {
      setMessage({ text: (err as Error).message || 'An unexpected error occurred', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-display-sm md:text-display-md font-bold text-on-surface mb-2">Import & Seed Data</h1>
        <p className="text-body-lg text-on-surface-variant">Manage your database records and sample data.</p>
      </div>

      <Card className="p-8 max-w-2xl bg-surface-container-lowest shadow-level-1 border border-outline-variant rounded-card">
        <h2 className="text-headline-sm font-bold mb-4 text-on-surface">Seed Test Data</h2>
        <p className="text-body-lg text-on-surface-variant mb-6 leading-relaxed">
          Running this tool will populate your database with the 10 core service categories (Construction, Plumbers, etc.) 
          and insert a set of high-quality sample listings for testing purposes. It safely skips existing records to prevent duplicates.
        </p>

        {message && (
          <div className={`p-4 mb-6 rounded-md font-medium text-body-md ${
            message.type === 'success' 
              ? 'bg-primary-container text-on-primary-container border border-primary/20' 
              : 'bg-error-container text-on-error-container border border-error/20'
          }`}>
            {message.text}
          </div>
        )}

        <Button 
          variant="primary" 
          onClick={handleSeed} 
          disabled={loading}
          className="min-w-[150px] py-3"
        >
          {loading ? 'Seeding...' : 'Run Seed Script'}
        </Button>
      </Card>
    </div>
  );
}
