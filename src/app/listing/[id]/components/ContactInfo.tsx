import { MessageForm } from '@/components/features/MessageForm';
import { Listing } from '@prisma/client';

type ContactInfoProps = {
  business: Listing;
};

export function ContactInfo({ business }: ContactInfoProps) {
  return (
    <div style={{ width: '350px', background: 'var(--bg-color)', padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
      <h3 style={{ marginBottom: '1.5rem' }}>Contact Info</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Phone Number</div>
          <div style={{ fontSize: '1.125rem', fontWeight: 500 }}>{business.phone}</div>
        </div>
        <div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Location</div>
          <div style={{ fontSize: '1.125rem', fontWeight: 500 }}>{business.address}</div>
        </div>
        <MessageForm receiverId={business.userId} listingId={business.id} />
      </div>
    </div>
  );
}
