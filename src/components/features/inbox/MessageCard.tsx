import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ReplyForm } from './ReplyForm';

export type MessageWithDetails = {
  id: string;
  content: string;
  createdAt: Date;
  isRead: boolean;
  listingId: string | null;
  senderId: string;
  receiverId: string;
  sender?: { name: string | null; image: string | null } | null;
  receiver?: { name: string | null; image: string | null } | null;
  listing?: {
    id: string;
    name: string;
    island: { slug: string; name: string }
  } | null;
};

interface MessageCardProps {
  message: MessageWithDetails;
  isReceived: boolean;
  isMessageUnread: boolean;
  isReplying: boolean;
  isSubmitting: boolean;
  onExpandMessage: (message: MessageWithDetails) => void;
  onReplySubmit: (message: MessageWithDetails, content: string) => void;
  onCancelReply: () => void;
}

export function MessageCard({
  message,
  isReceived,
  isMessageUnread,
  isReplying,
  isSubmitting,
  onExpandMessage,
  onReplySubmit,
  onCancelReply
}: MessageCardProps) {
  const otherParty = isReceived ? message.sender : message.receiver;

  return (
    <Card style={{ padding: '1.5rem', borderLeft: isMessageUnread ? '4px solid var(--primary-color)' : '1px solid var(--border-color)' }} className="fade-in-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ width: '40px', height: '40px', backgroundColor: '#e2e8f0', borderRadius: '50%', overflow: 'hidden' }}>
            {otherParty?.image ? (
              <img src={otherParty.image} alt={otherParty.name || 'User'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                {(otherParty?.name || 'U').charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <div style={{ fontWeight: isMessageUnread ? 700 : 600 }}>
              {isReceived ? (otherParty?.name || 'Anonymous User') : `To: ${otherParty?.name || 'User'}`}
              {isMessageUnread && <span style={{ marginLeft: '8px', width: '8px', height: '8px', backgroundColor: 'var(--primary-color)', borderRadius: '50%', display: 'inline-block' }}></span>}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              {new Date(message.createdAt).toLocaleString()}
            </div>
          </div>
        </div>
        {message.listing && (
          <Link href={`/${message.listing.island?.slug || 'all'}/${message.listing.id}`} style={{ fontSize: '0.875rem', color: 'var(--primary-color)' }}>
            Re: {message.listing.name}
          </Link>
        )}
      </div>

      <p style={{ margin: 0, padding: '1rem', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-sm)', fontWeight: isMessageUnread ? 500 : 400 }}>
        {message.content}
      </p>

      {isReceived && (
        <div style={{ marginTop: '1rem', textAlign: 'right' }}>
          <Button variant="secondary" onClick={() => onExpandMessage(message)}>
            {isReplying ? 'Cancel Reply' : 'Reply'}
          </Button>
        </div>
      )}

      {isReplying && isReceived && (
        <ReplyForm
          isSubmitting={isSubmitting}
          onSubmit={(content) => onReplySubmit(message, content)}
          onCancel={onCancelReply}
        />
      )}
    </Card>
  );
}
