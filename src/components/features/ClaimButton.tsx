'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { submitClaimRequest } from '@/app/actions/claim';

export function ClaimButton({ listingId }: { listingId: string }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  async function handleClaim(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const result = await submitClaimRequest(formData);
    
    if (result?.error) {
      setError(result.error);
    } else if (result?.success) {
      setSuccess(true);
    }
    setLoading(false);
  }

  if (success) {
    return (
      <div style={{ backgroundColor: '#ecfdf5', color: '#065f46', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid #10b981', textAlign: 'center', marginTop: '1rem' }}>
        <strong>Request Submitted!</strong> Our team will review your claim and contact you shortly.
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#fef3c7', border: '1px solid #fbbf24', borderRadius: 'var(--radius-md)', padding: '1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
      <div>
        <h3 style={{ margin: '0 0 0.5rem 0', color: '#b45309' }}>Are you the owner of this business?</h3>
        <p style={{ margin: 0, color: '#92400e', fontSize: '0.9rem' }}>Claim this listing to update photos, respond to reviews, and manage your details.</p>
      </div>
      <form onSubmit={handleClaim} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <input type="hidden" name="listingId" value={listingId} />
        <Button variant="primary" type="submit" isLoading={loading} style={{ whiteSpace: 'nowrap' }}>
          {loading ? 'Submitting...' : 'Claim Business'}
        </Button>
        {error && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{error}</span>}
      </form>
    </div>
  );
}
