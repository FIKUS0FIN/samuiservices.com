'use client';

import { Card } from '@/components/ui/Card';
import { ClaimCard } from "@/components/features/ClaimCard";
import { approveClaim, rejectClaim } from '@/app/actions/claims';
import { useState, useEffect } from 'react';
import { Check, X, Building, User, Clock } from 'lucide-react';

export default function AdminClaimsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [claims, setClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchClaims = async () => {
    try {
      const res = await fetch('/api/admin/claims');
      if (res.ok) {
        const data = await res.json();
        setClaims(data);
      }
    } catch (e) {
      console.error('Failed to fetch claims', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchClaims();
  }, []);

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      await approveClaim(id);
      await fetchClaims();
    } catch (e) {
      console.error(e);
      alert('Failed to approve claim');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    setActionLoading(id);
    try {
      await rejectClaim(id);
      await fetchClaims();
    } catch (e) {
      console.error(e);
      alert('Failed to reject claim');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontWeight: 700, color: '#0f172a' }}>Claim Requests</h1>
          <p style={{ color: 'var(--text-muted)' }}>Review and manage ownership claims for businesses on the platform.</p>
        </div>
      </div>

      {loading ? (
        <Card style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading claims...
        </Card>
      ) : claims.length === 0 ? (
        <Card style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', padding: '1rem', backgroundColor: '#f1f5f9', borderRadius: '50%', marginBottom: '1rem' }}>
            <Building style={{ width: '2rem', height: '2rem', color: '#94a3b8' }} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>No pending claims</h3>
          <p style={{ color: 'var(--text-muted)' }}>All business claim requests have been processed.</p>
        </Card>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {claims.map((claim) => (
            <ClaimCard
              key={claim.id}
              claim={claim}
              actionLoading={actionLoading}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))}
        </div>
      )}
    </div>
  );
}
