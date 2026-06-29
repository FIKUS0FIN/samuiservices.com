'use client';
import { ClaimCard } from '@/components/features/ClaimCard';
import { Card } from '@/components/ui/Card';
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
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-display-sm md:text-display-md font-bold text-on-surface mb-2">Claim Requests</h1>
          <p className="text-body-lg text-on-surface-variant">Review and manage ownership claims for businesses on the platform.</p>
        </div>
      </div>

      {loading ? (
        <Card className="p-8 text-center text-on-surface-variant bg-surface-container-lowest shadow-level-1 border border-outline-variant rounded-card">
          Loading claims...
        </Card>
      ) : claims.length === 0 ? (
        <Card className="p-16 text-center bg-surface-container-lowest shadow-level-1 border border-outline-variant rounded-card">
          <div className="inline-flex p-4 bg-surface-container rounded-full mb-4">
            <Building className="w-8 h-8 text-on-surface-variant" />
          </div>
          <h3 className="text-headline-sm font-bold text-on-surface mb-2">No pending claims</h3>
          <p className="text-body-lg text-on-surface-variant">All business claim requests have been processed.</p>
        </Card>
      ) : (
        <div className="grid gap-4">
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
