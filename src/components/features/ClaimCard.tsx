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
    <Card key={claim.id} className="p-6 flex flex-col gap-6 bg-surface-container-lowest border border-outline-variant shadow-level-1 rounded-card transition-shadow hover:shadow-level-2">
      <div className="flex justify-between items-start flex-wrap gap-4">

        <div className="flex-1 min-w-[300px]">
          <div className="flex items-center gap-2 mb-3">
            <span className={`px-2 py-1 rounded text-label-sm font-bold tracking-wide uppercase
              ${claim.status === 'PENDING' ? 'bg-secondary-container text-on-secondary-container' : 
                claim.status === 'APPROVED' ? 'bg-primary-container text-on-primary-container' : 
                'bg-error-container text-on-error-container'}`}
            >
              {claim.status}
            </span>
            <span className="flex items-center gap-1 text-on-surface-variant text-label-md">
              <Clock size={14} />
              {new Date(claim.createdAt).toLocaleDateString()}
            </span>
          </div>

          <h3 className="text-title-lg font-bold mb-4 text-on-surface">
            {claim.listing?.name || 'Unknown Business'}
          </h3>

          <div className="grid grid-cols-2 gap-4 bg-surface-container-highest p-4 rounded-xl border border-outline-variant/30">
            <div>
              <div className="text-label-sm uppercase text-on-surface-variant font-bold mb-1">Requested By</div>
              <div className="flex items-center gap-2 text-on-surface font-medium text-body-md">
                <User size={16} className="text-on-surface-variant" />
                {claim.user?.name || 'Unknown User'}
              </div>
              <div className="text-body-sm text-on-surface-variant mt-1 pl-6">
                {claim.user?.email}
              </div>
            </div>
            <div>
              <div className="text-label-sm uppercase text-on-surface-variant font-bold mb-1">Business Info</div>
              <div className="flex items-center gap-2 text-on-surface font-medium text-body-md">
                <Building size={16} className="text-on-surface-variant" />
                ID: {claim.listingId.substring(0, 8)}...
              </div>
            </div>
          </div>
        </div>

        {claim.status === 'PENDING' && (
          <div className="flex gap-3 self-center">
            <Button
              variant="secondary"
              onClick={() => onReject(claim.id)}
              disabled={actionLoading === claim.id}
              className="flex items-center gap-2 bg-error-container text-on-error-container hover:bg-error hover:text-on-error border-none"
            >
              <X size={16} /> Reject
            </Button>
            <Button
              variant="primary"
              onClick={() => onApprove(claim.id)}
              disabled={actionLoading === claim.id}
              className="flex items-center gap-2"
            >
              <Check size={16} /> Approve
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
