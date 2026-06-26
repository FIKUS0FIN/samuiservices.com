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
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Import & Seed Data</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage your database records and sample data.</p>
      </div>

      <Card style={{ padding: '2rem', maxWidth: '600px' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Seed Test Data</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
          Running this tool will populate your database with the 10 core service categories (Construction, Plumbers, etc.) 
          and insert a set of high-quality sample listings for testing purposes. It safely skips existing records to prevent duplicates.
        </p>

        {message && (
          <div style={{ 
            padding: '1rem', 
            marginBottom: '1.5rem', 
            borderRadius: '4px',
            backgroundColor: message.type === 'success' ? '#dcfce7' : '#fee2e2',
            color: message.type === 'success' ? '#166534' : '#991b1b',
            fontWeight: 500
          }}>
            {message.text}
          </div>
        )}

        <Button 
          variant="primary" 
          onClick={handleSeed} 
          disabled={loading}
          style={{ minWidth: '150px' }}
        >
          {loading ? 'Seeding...' : 'Run Seed Script'}
        </Button>
      </Card>
    </div>
  );
}
