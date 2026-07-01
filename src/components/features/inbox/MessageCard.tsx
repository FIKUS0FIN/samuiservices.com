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
    slug: string;
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
    <Card className={`p-6 transition-all duration-300 rounded-card bg-surface-container-lowest ${isMessageUnread ? 'border-l-4 border-l-primary shadow-level-2' : 'border border-outline-variant shadow-level-1'}`}>
      <div className="flex flex-col md:flex-row justify-between mb-4 md:items-start gap-2">
        <div className="flex gap-4 items-center">
          <div className="w-10 h-10 bg-surface-container-highest rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center">
            {otherParty?.image ? (
              <img src={otherParty.image} alt={otherParty.name || 'User'} className="w-full h-full object-cover" />
            ) : (
              <span className="text-on-surface-variant font-medium">
                {(otherParty?.name || 'U').charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <div className={`text-title-sm text-on-surface ${isMessageUnread ? 'font-bold' : 'font-medium'}`}>
              {isReceived ? (otherParty?.name || 'Anonymous User') : `To: ${otherParty?.name || 'User'}`}
              {isMessageUnread && <span className="ml-2 w-2 h-2 bg-primary rounded-full inline-block align-middle"></span>}
            </div>
            <div className="text-on-surface-variant text-body-sm">
              {new Date(message.createdAt).toLocaleString()}
            </div>
          </div>
        </div>
        {message.listing && (
          <Link href={`/listing/${message.listing.slug}`} className="text-label-md text-primary font-medium hover:underline">
            View Listing
          </Link>
        )}
      </div>

      <p className={`m-0 p-4 bg-surface-container-highest rounded-md text-on-surface text-body-md ${isMessageUnread ? 'font-medium' : 'font-normal'}`}>
        {message.content}
      </p>

      {isReceived && (
        <div className="mt-4 text-right">
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
