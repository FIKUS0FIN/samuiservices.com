import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Check, X, Building, User, Clock } from 'lucide-react';

interface ClaimCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  claim: any;
  actionLoading: string | null;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function ClaimCard({ claim, actionLoading, onApprove, onReject }: ClaimCardProps) {
  return (
    <Card key={claim.id} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>

        <div style={{ flex: 1, minWidth: '300px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{
              backgroundColor: claim.status === 'PENDING' ? '#fef08a' : claim.status === 'APPROVED' ? '#bbf7d0' : '#fecaca',
              color: claim.status === 'PENDING' ? '#854d0e' : claim.status === 'APPROVED' ? '#166534' : '#991b1b',
              padding: '0.25rem 0.5rem',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.05em'
            }}>
              {claim.status}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              <Clock size={14} />
              {new Date(claim.createdAt).toLocaleDateString()}
            </span>
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: '#0f172a' }}>
            {claim.listing?.name || 'Unknown Business'}
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 600, marginBottom: '0.25rem' }}>Requested By</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#334155', fontWeight: 500 }}>
                <User size={16} color="#64748b" />
                {claim.user?.name || 'Unknown User'}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem', paddingLeft: '1.5rem' }}>
                {claim.user?.email}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 600, marginBottom: '0.25rem' }}>Business Info</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#334155', fontWeight: 500 }}>
                <Building size={16} color="#64748b" />
                ID: {claim.listingId.substring(0, 8)}...
              </div>
            </div>
          </div>
        </div>

        {claim.status === 'PENDING' && (
          <div style={{ display: 'flex', gap: '0.75rem', alignSelf: 'center' }}>
            <Button
              variant="secondary"
              onClick={() => onReject(claim.id)}
              disabled={actionLoading === claim.id}
              style={{ backgroundColor: '#fee2e2', color: '#b91c1c', border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <X size={16} /> Reject
            </Button>
            <Button
              variant="primary"
              onClick={() => onApprove(claim.id)}
              disabled={actionLoading === claim.id}
              style={{ backgroundColor: '#22c55e', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Check size={16} /> Approve
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
